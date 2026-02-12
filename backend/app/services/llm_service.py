import google.generativeai as genai
import os
import re
import json
import time
from typing import List, Dict
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    _last_health_check = None
    _last_health_result = None
    _health_cache_seconds = 120  # Cache health result for 2 minutes
    
    def __init__(self):
        # Configure Gemini
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def extract_action_items(self, transcript: str) -> List[Dict]:
        """Extract action items from meeting transcript using Gemini 2.5 Flash"""
        
        prompt = f"""
        Analyze this meeting transcript and extract action items. For each action item, identify:
        1. The task/action to be completed
        2. The person responsible (if mentioned)
        3. Any due date or timeline mentioned
        4. Any relevant tags or categories
        
        Format the response as a JSON array of objects with these fields:
        - task (string): Clear description of what needs to be done
        - owner (string or null): Person responsible
        - due_date (string or null): When it's due (keep original format from transcript)
        - tags (string or null): Relevant categories/tags
        
        Meeting Transcript:
        {transcript}
        
        Return only the JSON array, no other text.
        """
        
        # Retry up to 3 times with backoff for rate limits
        for attempt in range(3):
            try:
                response = self.model.generate_content(prompt)
                
                # Extract JSON from response
                json_match = re.search(r'\[(.*?)\]', response.text, re.DOTALL)
                if json_match:
                    json_str = '[' + json_match.group(1) + ']'
                    action_items = json.loads(json_str)
                    return action_items
                else:
                    return json.loads(response.text)
                    
            except Exception as e:
                error_str = str(e)
                if '429' in error_str and attempt < 2:
                    wait_time = (attempt + 1) * 30  # 30s, 60s
                    print(f"Rate limited, waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                    continue
                print(f"Error extracting action items: {e}")
                return []
        return []
    
    def check_service_health(self) -> bool:
        """Check if LLM service is accessible (with caching to save quota)"""
        # Return cached result if recent enough
        now = time.time()
        if (LLMService._last_health_check is not None and 
            now - LLMService._last_health_check < LLMService._health_cache_seconds):
            return LLMService._last_health_result
        
        try:
            # Use count_tokens instead of generate_content to avoid quota usage
            result = self.model.count_tokens("health check")
            healthy = result.total_tokens > 0
            LLMService._last_health_check = now
            LLMService._last_health_result = healthy
            return healthy
        except Exception:
            LLMService._last_health_check = now
            LLMService._last_health_result = False
            return False