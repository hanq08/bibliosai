import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  Avatar,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Chat as SlackIcon,
  Task as TaskIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

export default function Actions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState('pending');
  const [selectedAction, setSelectedAction] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Fetch actions on component mount and tab change
  useEffect(() => {
    fetchActions(tabValue);
  }, [tabValue]);
  
  // Fetch actions from API
  const fetchActions = async (status) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`/actions${status ? `?status=${status}` : ''}`);
      setActions(response.data.actions);
    } catch (error) {
      console.error('Error fetching actions:', error);
      setError('Failed to load actions. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle action approval
  const handleApproveAction = async (actionId) => {
    try {
      await axios.post(`/actions/${actionId}/approve`);
      
      // Update action status in the UI
      setActions((prev) =>
        prev.map((action) =>
          action.id === actionId
            ? { ...action, status: 'approved' }
            : action
        )
      );
      
      // If we're viewing pending actions, remove this action from the list
      if (tabValue === 'pending') {
        setActions((prev) => prev.filter((action) => action.id !== actionId));
      }
    } catch (error) {
      console.error('Error approving action:', error);
      alert('Failed to approve action. Please try again.');
    }
  };
  
  // Handle action rejection
  const handleRejectAction = async (actionId) => {
    try {
      await axios.post(`/actions/${actionId}/reject`);
      
      // Update action status in the UI
      setActions((prev) =>
        prev.map((action) =>
          action.id === actionId
            ? { ...action, status: 'rejected' }
            : action
        )
      );
      
      // If we're viewing pending actions, remove this action from the list
      if (tabValue === 'pending') {
        setActions((prev) => prev.filter((action) => action.id !== actionId));
      }
    } catch (error) {
      console.error('Error rejecting action:', error);
      alert('Failed to reject action. Please try again.');
    }
  };
  
  // Handle action details dialog
  const handleOpenDetails = (action) => {
    setSelectedAction(action);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Get icon for action type
  const getActionIcon = (type) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'calendar':
        return <CalendarIcon />;
      case 'slack':
        return <SlackIcon />;
      case 'task':
        return <TaskIcon />;
      default:
        return <TaskIcon />;
    }
  };
  
  // Get color for action status
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'approved':
        return 'info';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Actions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage actions suggested by BibliosAI
        </Typography>
      </Box>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="action status tabs"
        >
          <Tab label="Pending" value="pending" />
          <Tab label="Approved" value="approved" />
          <Tab label="Completed" value="completed" />
          <Tab label="Rejected" value="rejected" />
          <Tab label="Failed" value="failed" />
        </Tabs>
      </Box>
      
      {/* Actions grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : actions.length === 0 ? (
        <Card variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <TaskIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No {tabValue} actions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tabValue === 'pending'
              ? 'There are no pending actions that require your approval.'
              : `There are no ${tabValue} actions to display.`}
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {actions.map((action) => (
            <Grid item xs={12} sm={6} md={4} key={action.id}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        mr: 2,
                      }}
                    >
                      {getActionIcon(action.type)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="div" noWrap>
                        {action.title}
                      </Typography>
                      <Chip
                        label={action.status}
                        size="small"
                        color={getStatusColor(action.status)}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                  
                  {action.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {action.description}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      Created: {formatDate(action.created_at)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Type: {action.type}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  {action.status === 'pending' && (
                    <>
                      <Button
                        size="small"
                        startIcon={<CheckIcon />}
                        color="success"
                        onClick={() => handleApproveAction(action.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        startIcon={<CloseIcon />}
                        color="error"
                        onClick={() => handleRejectAction(action.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    size="small"
                    startIcon={<InfoIcon />}
                    onClick={() => handleOpenDetails(action)}
                    sx={{ ml: action.status === 'pending' ? 'auto' : 0 }}
                  >
                    Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Action details dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedAction && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  {getActionIcon(selectedAction.type)}
                </Avatar>
                <Box>
                  {selectedAction.title}
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedAction.status}
                      size="small"
                      color={getStatusColor(selectedAction.status)}
                    />
                  </Box>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {selectedAction.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedAction.description}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Parameters
                </Typography>
                {Object.entries(selectedAction.parameters).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'medium', mr: 1, minWidth: 100 }}
                    >
                      {key}:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {typeof value === 'object'
                        ? JSON.stringify(value)
                        : value.toString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              {selectedAction.result && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Result
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                    {typeof selectedAction.result === 'object'
                      ? JSON.stringify(selectedAction.result, null, 2)
                      : selectedAction.result.toString()}
                  </Typography>
                </Box>
              )}
              
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Timeline
                </Typography>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'medium', mr: 1, minWidth: 100 }}
                  >
                    Created:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(selectedAction.created_at)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', mb: 0.5 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'medium', mr: 1, minWidth: 100 }}
                  >
                    Updated:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(selectedAction.updated_at)}
                  </Typography>
                </Box>
                {selectedAction.completed_at && (
                  <Box sx={{ display: 'flex' }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 'medium', mr: 1, minWidth: 100 }}
                    >
                      Completed:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(selectedAction.completed_at)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              {selectedAction.status === 'pending' && (
                <>
                  <Button
                    startIcon={<CheckIcon />}
                    color="success"
                    onClick={() => {
                      handleApproveAction(selectedAction.id);
                      handleCloseDialog();
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    startIcon={<CloseIcon />}
                    color="error"
                    onClick={() => {
                      handleRejectAction(selectedAction.id);
                      handleCloseDialog();
                    }}
                  >
                    Reject
                  </Button>
                </>
              )}
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
