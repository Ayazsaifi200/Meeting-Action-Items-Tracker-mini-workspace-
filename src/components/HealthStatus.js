import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  CheckCircle as HealthyIcon,
  Error as UnhealthyIcon,
  Refresh as RefreshIcon,
  Storage as DatabaseIcon,
  Cloud as CloudIcon,
  Computer as ServerIcon
} from '@mui/icons-material';
import { checkHealth } from '../services/api';

function HealthStatus() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await checkHealth();
      setHealth(data);
      setError('');
    } catch (err) {
      setError('Cannot connect to backend. Please ensure the server is running on http://localhost:8000');
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return status === 'healthy' ? 'success' : 'error';
  };

  const getStatusIcon = (status) => {
    return status === 'healthy' ? <HealthyIcon /> : <UnhealthyIcon />;
  };

  const formatTimestamp = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch {
      return timestamp;
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            System Status
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchHealth}
          >
            Refresh
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {health && (
          <>
            <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Overall System Status
              </Typography>
              <Chip
                icon={getStatusIcon(health.status)}
                label={health.status.toUpperCase()}
                color={getStatusColor(health.status)}
                size="large"
                sx={{ fontSize: '1.2rem', py: 3, px: 2 }}
              />
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                Last checked: {formatTimestamp(health.timestamp)}
              </Typography>
            </Paper>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ServerIcon sx={{ mr: 1, fontSize: 40 }} color="primary" />
                    <Typography variant="h6">Backend Server</Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon('healthy')}
                    label="HEALTHY"
                    color="success"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    FastAPI server is running and responding to requests.
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <DatabaseIcon sx={{ mr: 1, fontSize: 40 }} color="primary" />
                    <Typography variant="h6">Database</Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(health.database)}
                    label={health.database.toUpperCase()}
                    color={getStatusColor(health.database)}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    SQLite database connection status.
                    {health.database === 'unhealthy' && ' Please check your database configuration.'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CloudIcon sx={{ mr: 1, fontSize: 40 }} color="primary" />
                    <Typography variant="h6">LLM Service (Google Gemini 2.5 Flash)</Typography>
                  </Box>
                  <Chip
                    icon={getStatusIcon(health.llm_service)}
                    label={health.llm_service.toUpperCase()}
                    color={getStatusColor(health.llm_service)}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Google Gemini AI service connectivity.
                    {health.llm_service === 'unhealthy' && ' Please verify your GOOGLE_API_KEY in the .env file.'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </>
        )}

        <Paper elevation={1} sx={{ p: 3, mt: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom>
            Troubleshooting
          </Typography>
          <Typography variant="body2" paragraph>
            If any component shows as unhealthy:
          </Typography>
          <ul>
            <li><Typography variant="body2">Backend: Ensure FastAPI server is running on http://localhost:8000</Typography></li>
            <li><Typography variant="body2">Database: Verify the SQLite database file exists (run setup_db.py if needed)</Typography></li>
            <li><Typography variant="body2">LLM Service: Check that GOOGLE_API_KEY is set in backend/.env file</Typography></li>
          </ul>
        </Paper>
      </Box>
    </Container>
  );
}

export default HealthStatus;