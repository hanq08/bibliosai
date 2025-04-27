import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Email as EmailIcon,
  Chat as SlackIcon,
  Description as DriveIcon,
  Notes as NotionIcon,
  BugReport as JiraIcon,
  Code as GithubIcon,
  Link as LinkIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

export default function ConnectorDetail() {
  const { connectorId } = useParams();
  const navigate = useNavigate();
  const [connector, setConnector] = useState(null);
  const [syncHistory, setSyncHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
  });
  
  // Fetch connector details on component mount
  useEffect(() => {
    fetchConnectorDetails();
  }, [connectorId]);
  
  // Fetch connector details from API
  const fetchConnectorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, you would call an API to get the connector details
      // For this demo, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock connector data
      const mockConnector = {
        id: connectorId,
        name: 'Work Gmail',
        type: 'gmail',
        description: 'My work email account for retrieving important communications',
        status: 'connected',
        last_sync: '2023-01-15T10:30:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-15T10:30:00Z',
        config: {
          email: 'user@example.com',
          folders: ['INBOX', 'Sent', 'Important'],
          sync_frequency: 'hourly',
          max_emails: 1000,
        },
        stats: {
          total_documents: 1245,
          last_sync_count: 37,
          total_size_mb: 156,
        },
      };
      
      // Mock sync history
      const mockSyncHistory = [
        {
          id: '1',
          status: 'completed',
          started_at: '2023-01-15T10:00:00Z',
          completed_at: '2023-01-15T10:30:00Z',
          items_synced: 37,
          errors: 0,
        },
        {
          id: '2',
          status: 'completed',
          started_at: '2023-01-14T10:00:00Z',
          completed_at: '2023-01-14T10:25:00Z',
          items_synced: 42,
          errors: 0,
        },
        {
          id: '3',
          status: 'error',
          started_at: '2023-01-13T10:00:00Z',
          completed_at: '2023-01-13T10:05:00Z',
          items_synced: 0,
          errors: 1,
          error_message: 'Authentication failed. Please reconnect the account.',
        },
      ];
      
      setConnector(mockConnector);
      setSyncHistory(mockSyncHistory);
      
      // Initialize edit form with current values
      setEditForm({
        name: mockConnector.name,
        description: mockConnector.description || '',
      });
    } catch (error) {
      console.error('Error fetching connector details:', error);
      setError('Failed to load connector details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sync connector
  const handleSyncConnector = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would call an API to sync the connector
      await axios.post(`/connectors/${connectorId}/sync`);
      
      alert('Sync started. This may take a few minutes.');
      
      // Refresh connector details after a short delay
      setTimeout(() => {
        fetchConnectorDetails();
      }, 2000);
    } catch (error) {
      console.error('Error syncing connector:', error);
      alert('Failed to sync connector. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle edit dialog
  const handleOpenEditDialog = () => {
    setOpenEditDialog(true);
  };
  
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };
  
  // Handle edit form change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle update connector
  const handleUpdateConnector = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would call an API to update the connector
      await axios.put(`/connectors/${connectorId}`, editForm);
      
      // Update local state
      setConnector((prev) => ({
        ...prev,
        name: editForm.name,
        description: editForm.description,
      }));
      
      handleCloseEditDialog();
    } catch (error) {
      console.error('Error updating connector:', error);
      alert('Failed to update connector. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };
  
  // Handle delete connector
  const handleDeleteConnector = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would call an API to delete the connector
      await axios.delete(`/connectors/${connectorId}`);
      
      // Navigate back to connectors list
      navigate('/connectors');
    } catch (error) {
      console.error('Error deleting connector:', error);
      alert('Failed to delete connector. Please try again.');
      setLoading(false);
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
  
  // Get color for status
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
  
  // Get icon for sync status
  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'in_progress':
        return <CircularProgress size={20} />;
      default:
        return <WarningIcon color="warning" />;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  // Render loading state
  if (loading && !connector) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error && !connector) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }
  
  return (
    <Box>
      {/* Header with back button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton
          onClick={() => navigate('/connectors')}
          sx={{ mr: 1 }}
          aria-label="back"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1">
          Connector Details
        </Typography>
      </Box>
      
      {connector && (
        <>
          {/* Connector overview */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: 'action.hover',
                      mr: 2,
                    }}
                  >
                    {getConnectorIcon(connector.type)}
                  </Box>
                  <Box>
                    <Typography variant="h4" component="h2">
                      {connector.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Chip
                        label={connector.status}
                        color={getStatusColor(connector.status)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {connector.type} • Last synced: {formatDate(connector.last_sync)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                {connector.description && (
                  <Typography variant="body1" paragraph>
                    {connector.description}
                  </Typography>
                )}
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Created
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {formatDate(connector.created_at)}
                    </Typography>
                    
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ mt: 2 }}>
                      Last Updated
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(connector.updated_at)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<RefreshIcon />}
                      onClick={handleSyncConnector}
                      disabled={connector.status !== 'connected' || loading}
                      sx={{ mr: 1 }}
                    >
                      Sync Now
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={handleOpenEditDialog}
                      disabled={loading}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Stats and configuration */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Stats */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Statistics
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={4}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, textAlign: 'center' }}
                    >
                      <Typography variant="h4" color="primary">
                        {connector.stats.total_documents}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Documents
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, textAlign: 'center' }}
                    >
                      <Typography variant="h4" color="primary">
                        {connector.stats.last_sync_count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Sync
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Paper
                      variant="outlined"
                      sx={{ p: 2, textAlign: 'center' }}
                    >
                      <Typography variant="h4" color="primary">
                        {connector.stats.total_size_mb} MB
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Size
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            {/* Configuration */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Configuration
                </Typography>
                
                <List dense>
                  {Object.entries(connector.config).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Typography>
                        }
                        secondary={
                          Array.isArray(value)
                            ? value.join(', ')
                            : typeof value === 'object'
                            ? JSON.stringify(value)
                            : value.toString()
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    startIcon={<SettingsIcon />}
                    size="small"
                  >
                    Advanced Settings
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Sync history */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Sync History
            </Typography>
            
            {syncHistory.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                No sync history available.
              </Typography>
            ) : (
              <List>
                {syncHistory.map((sync) => (
                  <React.Fragment key={sync.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getSyncStatusIcon(sync.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="subtitle1">
                              {formatDate(sync.started_at)}
                            </Typography>
                            <Chip
                              label={sync.status}
                              size="small"
                              color={
                                sync.status === 'completed'
                                  ? 'success'
                                  : sync.status === 'error'
                                  ? 'error'
                                  : 'default'
                              }
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" component="span">
                              {sync.status === 'completed'
                                ? `Successfully synced ${sync.items_synced} items in ${
                                    (new Date(sync.completed_at) - new Date(sync.started_at)) / 60000
                                  } minutes`
                                : sync.error_message}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleOpenDeleteDialog}
              >
                Delete Connector
              </Button>
              
              <Button>
                View Full History
              </Button>
            </Box>
          </Paper>
          
          {/* Edit dialog */}
          <Dialog
            open={openEditDialog}
            onClose={handleCloseEditDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Edit Connector</DialogTitle>
            <DialogContent>
              <TextField
                margin="normal"
                fullWidth
                label="Name"
                name="name"
                value={editForm.name}
                onChange={handleEditFormChange}
              />
              <TextField
                margin="normal"
                fullWidth
                label="Description"
                name="description"
                value={editForm.description}
                onChange={handleEditFormChange}
                multiline
                rows={3}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseEditDialog}>Cancel</Button>
              <Button
                onClick={handleUpdateConnector}
                variant="contained"
                disabled={loading}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Delete confirmation dialog */}
          <Dialog
            open={openDeleteDialog}
            onClose={handleCloseDeleteDialog}
          >
            <DialogTitle>Delete Connector</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this connector? This action cannot be undone.
                All data associated with this connector will be removed from the system.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
              <Button
                onClick={handleDeleteConnector}
                color="error"
                disabled={loading}
              >
                Delete Connector
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
}
