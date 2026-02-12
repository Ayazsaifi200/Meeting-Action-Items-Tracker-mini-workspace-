import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './components/HomePage';
import TranscriptProcessor from './components/TranscriptProcessor';
import ActionItemsList from './components/ActionItemsList';
import HealthStatus from './components/HealthStatus';
import TranscriptHistory from './components/TranscriptHistory';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Meeting Action Items Tracker
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
                <Link to="/process" style={{ color: 'white', textDecoration: 'none' }}>Process Meeting</Link>
                <Link to="/action-items" style={{ color: 'white', textDecoration: 'none' }}>Action Items</Link>
                <Link to="/history" style={{ color: 'white', textDecoration: 'none' }}>History</Link>
                <Link to="/status" style={{ color: 'white', textDecoration: 'none' }}>Status</Link>
              </Box>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/process" element={<TranscriptProcessor />} />
              <Route path="/action-items" element={<ActionItemsList />} />
              <Route path="/history" element={<TranscriptHistory />} />
              <Route path="/status" element={<HealthStatus />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
