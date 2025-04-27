import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Link as LinkIcon,
  PlaylistAddCheck as ActionsIcon,
  Email as EmailIcon,
  Chat as SlackIcon,
  Description as DriveIcon,
  Notes as NotionIcon,
  BugReport as JiraIcon,
  Code as GithubIcon,
  CalendarToday as CalendarIcon,
  Task as TaskIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    conversations: [],
    connectors: [],
    actions: [],
    sources: {},
  });
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real implementation, you would have a dedicated endpoint for dashboard stats
      // For this demo, we'll make separate requests and combine the data
      const [conversationsRes, connectorsRes, actionsRes] = await Promise.all([
        axios.get('/chat/conversations'),
        axios.get('/connectors'),
        axios.get('/actions'),
      ]);
      
      setStats({
        conversations: conversationsRes.data.conversations.slice(0, 5),
        connectors: connectorsRes.data.connectors,
        actions: actionsRes.data.actions.filter(a => a.status === 'pending'),
        sources: countSourceTypes(connectorsRes.data.connectors),
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Count source types
  const countSourceTypes = (connectors) => {
    const counts = {};
    
    connectors.forEach((connector) => {
      counts[connector.type] = (counts[connector.type] || 0) + 1;
    });
    
    return counts;
  };
  
  // Get icon for connector type
  const getConnectorIcon = (type) => {
    switch (type) {
      case 'gmail':
        return <EmailIcon />;
      case 'slack':
        return <SlackIcon />;
      case 'google_drive':
        return <DriveIcon />;
      case 'notion':
        return <NotionIcon />;
      case 'jira':
        return <JiraIcon />;
      case 'github':
        return <GithubIcon />;
      default:
        return <LinkIcon />;
    }
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
  
  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return <CheckIcon color="success" />;
      case 'pending':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to BibliosAI - Your intelligent RAG platform
        </Typography>
      </Box>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Stats overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
            }}
          >
            <ChatIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.conversations.length}
            </Typography>
            <Typography variant="body2">Recent Conversations</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'secondary.light',
              color: 'secondary.contrastText',
            }}
          >
            <LinkIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.connectors.length}
            </Typography>
            <Typography variant="body2">Connected Sources</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
            }}
          >
            <ActionsIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="div">
              {stats.actions.length}
            </Typography>
            <Typography variant="body2">Pending Actions</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <InfoIcon sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" component="div">
              {Object.keys(stats.sources).length}
            </Typography>
            <Typography variant="body2">Source Types</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Main content */}
      <Grid container spacing={3}>
        {/* Recent conversations */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Conversations
              </Typography>
              
              {stats.conversations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No conversations yet
                  </Typography>
                </Box>
              ) : (
                <List>
                  {stats.conversations.map((conversation) => (
                    <React.Fragment key={conversation.id}>
                      <ListItem
                        button
                        onClick={() => navigate(`/chat/${conversation.id}`)}
                      >
                        <ListItemIcon>
                          <ChatIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={conversation.title}
                          secondary={`${conversation.message_count} messages • ${formatDate(conversation.updated_at)}`}
                          primaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/chat')}
                sx={{ ml: 'auto' }}
              >
                New Conversation
              </Button>
              <Button size="small" onClick={() => navigate('/chat')}>
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Pending actions */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Actions
              </Typography>
              
              {stats.actions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <ActionsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No pending actions
                  </Typography>
                </Box>
              ) : (
                <List>
                  {stats.actions.slice(0, 5).map((action) => (
                    <React.Fragment key={action.id}>
                      <ListItem
                        button
                        onClick={() => navigate('/actions')}
                      >
                        <ListItemIcon>
                          {getActionIcon(action.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={action.title}
                          secondary={`${action.type} • ${formatDate(action.created_at)}`}
                          primaryTypographyProps={{ noWrap: true }}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/actions')}
                sx={{ ml: 'auto' }}
              >
                View All Actions
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Connected sources */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Connected Sources
              </Typography>
              
              {stats.connectors.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <LinkIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    No connected sources yet
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/connectors')}
                  >
                    Connect a Source
                  </Button>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {stats.connectors.map((connector) => (
                    <Grid item xs={12} sm={6} md={4} key={connector.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                backgroundColor: 'action.hover',
                                mr: 2,
                              }}
                            >
                              {getConnectorIcon(connector.type)}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" component="div" noWrap>
                                {connector.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getStatusIcon(connector.status)}
                                <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                                  {connector.status}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            onClick={() => navigate(`/connectors/${connector.id}`)}
                          >
                            Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate('/connectors')}
                sx={{ ml: 'auto' }}
              >
                Manage Sources
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
