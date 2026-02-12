import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  HealthAndSafety as HealthIcon
} from '@mui/icons-material';

function HomePage() {
  const navigate = useNavigate();

  const features = [
    { 
      icon: <DescriptionIcon color="primary" />, 
      title: 'Paste Meeting Transcript', 
      description: 'Simply paste your meeting transcript text',
      action: () => navigate('/process')
    },
    { 
      icon: <CheckCircleIcon color="primary" />, 
      title: 'Extract Action Items', 
      description: 'AI automatically identifies tasks, owners, and due dates',
      action: () => navigate('/process')
    },
    { 
      icon: <HistoryIcon color="primary" />, 
      title: 'View History', 
      description: 'Access your last 5 processed transcripts',
      action: () => navigate('/history')
    },
    { 
      icon: <HealthIcon color="primary" />, 
      title: 'System Status', 
      description: 'Check backend, database, and LLM connection health',
      action: () => navigate('/status')
    },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Meeting Action Items Tracker
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" paragraph>
          Transform your meeting transcripts into actionable tasks
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            How It Works
          </Typography>
          <List>
            {features.map((feature, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  button 
                  onClick={feature.action}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 1,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon>
                    {feature.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="h6">{feature.title}</Typography>}
                    secondary={feature.description}
                  />
                </ListItem>
                {index < features.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/process')}
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/status')}
          >
            Check System Status
          </Button>
        </Box>

        <Paper elevation={1} sx={{ p: 3, mt: 4, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Features
          </Typography>
          <List dense>
            <ListItem>• Edit, add, and delete action items</ListItem>
            <ListItem>• Mark items as done/pending</ListItem>
            <ListItem>• Filter by status (open/completed)</ListItem>
            <ListItem>• Tag categorization</ListItem>
            <ListItem>• AI-powered extraction using Google Gemini Flash 2.0</ListItem>
          </List>
        </Paper>
      </Box>
    </Container>
  );
}

export default HomePage;