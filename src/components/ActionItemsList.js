import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  Chip,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { 
  getActionItems, 
  updateActionItem, 
  deleteActionItem, 
  markActionItemComplete,
  createActionItem,
  getTranscripts
} from '../services/api';

function ActionItemsList() {
  const location = useLocation();
  const [actionItems, setActionItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [editDialog, setEditDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    task: '',
    owner: '',
    due_date: '',
    tags: '',
    status: 'pending',
    transcript_id: 1
  });

  useEffect(() => {
    fetchActionItems();
    fetchTranscripts();
  }, [fetchActionItems, fetchTranscripts]);

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  const fetchTranscripts = useCallback(async () => {
    try {
      const data = await getTranscripts();
      setTranscripts(data);
    } catch (err) {
      console.error('Error fetching transcripts:', err);
    }
  }, []);

  const fetchActionItems = useCallback(async () => {
    setLoading(true);
    try {
      const transcriptId = location.state?.transcriptId;
      const filters = transcriptId ? { transcript_id: transcriptId } : {};
      const data = await getActionItems(filters);
      setActionItems(data);
      setError('');
    } catch (err) {
      setError('Failed to load action items. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [location.state?.transcriptId]);

  const applyFilter = useCallback(() => {
    if (filter === 'all') {
      setFilteredItems(actionItems);
    } else {
      setFilteredItems(actionItems.filter(item => item.status === filter));
    }
  }, [filter, actionItems]);

  const handleToggleComplete = async (item) => {
    try {
      if (item.status === 'pending') {
        await markActionItemComplete(item.id);
      } else {
        await updateActionItem(item.id, { status: 'pending' });
      }
      fetchActionItems();
    } catch (err) {
      setError('Failed to update action item status');
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      task: item.task,
      owner: item.owner || '',
      due_date: item.due_date || '',
      tags: item.tags || '',
      status: item.status,
      transcript_id: item.transcript_id
    });
    setEditDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this action item?')) {
      try {
        await deleteActionItem(id);
        fetchActionItems();
      } catch (err) {
        setError('Failed to delete action item');
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      await updateActionItem(currentItem.id, formData);
      setEditDialog(false);
      fetchActionItems();
    } catch (err) {
      setError('Failed to update action item');
    }
  };

  const handleAdd = () => {
    setFormData({
      task: '',
      owner: '',
      due_date: '',
      tags: '',
      status: 'pending',
      transcript_id: transcripts[0]?.id || 1
    });
    setAddDialog(true);
  };

  const handleSaveAdd = async () => {
    if (!formData.task.trim()) {
      alert('Task description is required');
      return;
    }
    try {
      await createActionItem(formData);
      setAddDialog(false);
      fetchActionItems();
    } catch (err) {
      setError('Failed to create action item');
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Action Items
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Action Item
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter</InputLabel>
            <Select
              value={filter}
              label="Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All Items</MenuItem>
              <MenuItem value="pending">Open</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="caption" sx={{ ml: 2 }}>
            {filteredItems.length} item(s)
          </Typography>
        </Paper>

        {filteredItems.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No action items found. Process a meeting transcript to get started!
            </Typography>
          </Paper>
        ) : (
          <List>
            {filteredItems.map((item) => (
              <Paper key={item.id} elevation={2} sx={{ mb: 2, p: 2 }}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton onClick={() => handleEdit(item)} aria-label="edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(item.id)} aria-label="delete">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <IconButton
                        onClick={() => handleToggleComplete(item)}
                        color={item.status === 'completed' ? 'success' : 'default'}
                      >
                        {item.status === 'completed' ? <CheckIcon /> : <UncheckedIcon />}
                      </IconButton>
                      <Typography
                        variant="h6"
                        sx={{
                          textDecoration: item.status === 'completed' ? 'line-through' : 'none',
                          color: item.status === 'completed' ? 'text.secondary' : 'text.primary'
                        }}
                      >
                        {item.task}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 6, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {item.owner && (
                        <Chip label={`👤 ${item.owner}`} size="small" variant="outlined" />
                      )}
                      {item.due_date && (
                        <Chip label={`📅 ${item.due_date}`} size="small" variant="outlined" color="primary" />
                      )}
                      {item.tags && (
                        <Chip label={`🏷️ ${item.tags}`} size="small" variant="outlined" color="secondary" />
                      )}
                      <Chip
                        label={item.status}
                        size="small"
                        color={item.status === 'completed' ? 'success' : 'warning'}
                      />
                    </Box>
                  </Box>
                </ListItem>
              </Paper>
            ))}
          </List>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Action Item</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Task"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Due Date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add Action Item</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Task"
              value={formData.task}
              onChange={(e) => setFormData({ ...formData, task: e.target.value })}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="Owner"
              value={formData.owner}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Due Date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              margin="normal"
            />
            {transcripts.length > 0 && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Associated Transcript</InputLabel>
                <Select
                  value={formData.transcript_id}
                  label="Associated Transcript"
                  onChange={(e) => setFormData({ ...formData, transcript_id: e.target.value })}
                >
                  {transcripts.map((transcript) => (
                    <MenuItem key={transcript.id} value={transcript.id}>
                      {transcript.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveAdd} variant="contained">Add</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}

export default ActionItemsList;