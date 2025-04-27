import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Email as EmailIcon,
  Chat as SlackIcon,
  Description as DriveIcon,
  Notes as NotionIcon,
  BugReport as JiraIcon,
  Code as GithubIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

export default function Connectors() {
  const navigate = useNavigate();
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newConnector, setNewConnector] = useState({
    name: '',
    type: '',
    description: '',
  });
  
  // Fetch connectors on component mount
  useEffect(() => {
    fetchConnectors();
  }, []);
  
  // Fetch connectors from API
  const fetchConnectors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/connectors');
      setConnectors(response.data.connectors);
    } catch (error) {
      console.error('Error fetching connectors:', error);
      setError('Failed to load connectors. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle dialog open/close
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewConnector({
      name: '',
      type: '',
      description: '',
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConnector((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle connector creation
  const handleCreateConnector = async () => {
    try {
      setLoading(true);
      
      const response = await axios.post('/connectors', newConnector);
      
      // If the connector requires OAuth, redirect to the auth URL
      if (response.data.auth_url) {
        window.location.href = response.data.auth_url;
        return;
      }
      
      // Otherwise, add the new connector to the list
      setConnectors((prev) => [...prev, response.data.connector]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating connector:', error);
      setError('Failed to create connector. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle connector sync
  const handleSyncConnector = async (connectorId) => {
    try {
      await axios.post(`/connectors/${connectorId}/sync`);
      alert('Sync started. This may take a few minutes.');
    } catch (error) {
      console.error('Error syncing connector:', error);
      alert('Failed to sync connector. Please try again.');
    }
  };
  
  // Handle connector deletion
  const handleDeleteConnector = async (connectorId) => {
    if (!window.confirm('Are you sure you want to delete this connector?')) {
      return;
    }
    
    try {
      await axios.delete(`/connectors/${connectorId}`);
      setConnectors((prev) => prev.filter((c) => c.id !== connectorId));
    } catch (error) {
      console.error('Error deleting connector:', error);
      alert('Failed to delete connector. Please try again.');
    }
  };
  
  // Get icon for connector type
  const getConnectorIcon = (type) => {
    switch (type) {
      case 'gmail':
        return <EmailIcon fontSize="large" />;
      case 'slack':
        return <SlackIcon fontSize="large" />;
      case 'google_drive':
        return <DriveIcon fontSize="large" />;
      case 'notion':
        return <NotionIcon fontSize="large" />;
      case 'jira':
        return <JiraIcon fontSize="large" />;
      case 'github':
        return <GithubIcon fontSize="large" />;
      default:
        return <LinkIcon fontSize="large" />;
    }
  };
  
  // Get color for connector status
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'pending':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Available connector types
  const connectorTypes = [
    { value: 'gmail', label: 'Gmail' },
    { value: 'slack', label: 'Slack' },
    { value: 'google_drive', label: 'Google Drive' },
    { value: 'notion', label: 'Notion' },
    { value: 'jira', label: 'Jira' },
    { value: 'github', label: 'GitHub' },
    { value: 'custom', label: 'Custom' },
  ];
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Data Connectors
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Connector
        </Button>
      </Box>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Connectors grid */}
      {loading && connectors.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : connectors.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <LinkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No connectors yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Connect to your data sources to start using BibliosAI
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Add Your First Connector
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {connectors.map((connector) => (
            <Grid item xs={12} sm={6} md={4} key={connector.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        backgroundColor: 'action.hover',
                        mr: 2,
                      }}
                    >
                      {getConnectorIcon(connector.type)}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div" noWrap>
                        {connector.name}
                      </Typography>
                      <Chip
                        label={connector.status}
                        size="small"
                        color={getStatusColor(connector.status)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  
                  {connector.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {connector.description}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Last sync: {connector.last_sync ? new Date(connector.last_sync).toLocaleString() : 'Never'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Type: {connector.type}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => handleSyncConnector(connector.id)}
                    disabled={connector.status !== 'connected'}
                  >
                    Sync
                  </Button>
                  <Button
                    size="small"
                    onClick={() => navigate(`/connectors/${connector.id}`)}
                  >
                    Details
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteConnector(connector.id)}
                    sx={{ ml: 'auto' }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Add connector dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Connector</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Connector Name"
              name="name"
              value={newConnector.name}
              onChange={handleInputChange}
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="connector-type-label">Connector Type</InputLabel>
              <Select
                labelId="connector-type-label"
                name="type"
                value={newConnector.type}
                onChange={handleInputChange}
                label="Connector Type"
              >
                {connectorTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              margin="normal"
              fullWidth
              label="Description (Optional)"
              name="description"
              value={newConnector.description}
              onChange={handleInputChange}
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleCreateConnector}
            variant="contained"
            disabled={!newConnector.name || !newConnector.type || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Connector'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
