import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { createTranscript } from '../services/api';

function TranscriptProcessor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Please provide both title and transcript content');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await createTranscript({ title, content });
      setSuccess(true);
      setTimeout(() => {
        navigate('/action-items', { state: { transcriptId: response.id } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process transcript. Please check your API connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle('');
    setContent('');
    setError('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Process Meeting Transcript
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Paste your meeting transcript below and let AI extract the action items for you.
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Meeting Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Weekly Team Sync - Feb 12, 2026"
              sx={{ mb: 3 }}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Meeting Transcript"
              variant="outlined"
              multiline
              rows={15}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your meeting transcript here...&#10;&#10;Example:&#10;John: We need to finalize the project proposal by Friday.&#10;Sarah: I'll review the budget section by tomorrow.&#10;Mike: Can you send me the latest design mockups? I need them by end of day."
              disabled={loading}
              sx={{ mb: 3 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={loading}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
              >
                {loading ? 'Processing...' : 'Process Transcript'}
              </Button>
            </Box>
          </form>
        </Paper>

        <Snackbar
          open={success}
          autoHideDuration={2000}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Transcript processed successfully! Redirecting to action items...
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default TranscriptProcessor;