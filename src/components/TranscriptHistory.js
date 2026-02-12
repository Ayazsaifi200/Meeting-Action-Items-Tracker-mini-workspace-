import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { getTranscripts, deleteTranscript } from '../services/api';
import { format } from 'date-fns';

function TranscriptHistory() {
  const navigate = useNavigate();
  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    setLoading(true);
    try {
      const data = await getTranscripts(5); // Last 5 transcripts
      setTranscripts(data);
      setError('');
    } catch (err) {
      setError('Failed to load transcripts. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (transcript) => {
    navigate('/action-items', { state: { transcriptId: transcript.id } });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transcript and all its action items?')) {
      try {
        await deleteTranscript(id);
        fetchTranscripts();
      } catch (err) {
        setError('Failed to delete transcript');
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Transcript History
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your last 5 processed meeting transcripts
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {transcripts.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary" paragraph>
              No transcripts found. Start by processing your first meeting!
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/process')}
            >
              Process Meeting
            </Button>
          </Paper>
        ) : (
          <List>
            {transcripts.map((transcript) => (
              <Paper key={transcript.id} elevation={2} sx={{ mb: 2 }}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        onClick={() => handleView(transcript)}
                        aria-label="view"
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(transcript.id)}
                        aria-label="delete"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="h6">
                        {transcript.title}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarIcon fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(transcript.created_at)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Chip
                            label={`${transcript.action_items?.length || 0} action items`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {transcript.processed_at && (
                            <Chip
                              label="Processed"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Box>
    </Container>
  );
}

export default TranscriptHistory;