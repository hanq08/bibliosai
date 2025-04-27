import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Card,
  CardContent,
  CardActions,
  IconButton,
  CircularProgress,
  Collapse,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Link as LinkIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export default function Chat() {
  const { conversationId } = useParams();
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSources, setExpandedSources] = useState({});
  const [expandedActions, setExpandedActions] = useState({});
  const messagesEndRef = useRef(null);
  
  // Fetch conversation if conversationId is provided
  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/chat/conversations/${conversationId}`);
        setConversation(response.data);
        setMessages(response.data.messages);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setError('Failed to load conversation');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [conversationId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Add user message to UI immediately
      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      
      // Clear input
      setMessage('');
      
      // Send message to API
      const response = await axios.post('/chat', {
        message: message.trim(),
        conversation_id: conversationId,
      });
      
      // Add assistant response to UI
      const assistantMessage = {
        role: 'assistant',
        content: response.data.message,
        timestamp: new Date().toISOString(),
        sources: response.data.sources,
        suggested_actions: response.data.suggested_actions,
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      
      // Update conversation ID if this is a new conversation
      if (!conversationId) {
        window.history.replaceState(
          null,
          '',
          `/chat/${response.data.conversation_id}`
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle source expansion
  const toggleSource = (index) => {
    setExpandedSources((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  
  // Toggle action expansion
  const toggleAction = (index) => {
    setExpandedActions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  
  // Handle action approval
  const handleApproveAction = async (action) => {
    try {
      await axios.post(`/actions/${action.id}/approve`);
      // In a real app, you would update the UI to show the action is approved
      // For this demo, we'll just show an alert
      alert(`Action "${action.title}" approved and will be executed.`);
    } catch (error) {
      console.error('Error approving action:', error);
      alert('Failed to approve action. Please try again.');
    }
  };
  
  // Handle action rejection
  const handleRejectAction = async (action) => {
    try {
      await axios.post(`/actions/${action.id}/reject`);
      // In a real app, you would update the UI to show the action is rejected
      alert(`Action "${action.title}" rejected.`);
    } catch (error) {
      console.error('Error rejecting action:', error);
      alert('Failed to reject action. Please try again.');
    }
  };
  
  // Render action icon based on type
  const renderActionIcon = (type) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'calendar':
        return <CalendarIcon />;
      case 'task':
        return <TaskIcon />;
      default:
        return <TaskIcon />;
    }
  };
  
  // Render message content
  const renderMessageContent = (message) => {
    return (
      <Box sx={{ whiteSpace: 'pre-wrap' }}>
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </Box>
    );
  };
  
  // Render sources
  const renderSources = (message, index) => {
    if (!message.sources || message.sources.length === 0) return null;
    
    const isExpanded = expandedSources[index] || false;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => toggleSource(index)}
        >
          <Typography variant="body2" color="text.secondary">
            Sources ({message.sources.length})
          </Typography>
          {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </Box>
        
        <Collapse in={isExpanded}>
          <List dense sx={{ mt: 1 }}>
            {message.sources.map((source, sourceIndex) => (
              <Paper
                key={sourceIndex}
                variant="outlined"
                sx={{ mb: 1, p: 1, backgroundColor: 'background.paper' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LinkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle2">{source.title}</Typography>
                  <Chip
                    label={source.source_type}
                    size="small"
                    sx={{ ml: 'auto', fontSize: '0.7rem' }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {source.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(source.timestamp), 'MMM d, yyyy h:mm a')}
                  </Typography>
                  <Tooltip title="Relevance score">
                    <Chip
                      label={`${Math.round(source.relevance_score * 100)}%`}
                      size="small"
                      color={source.relevance_score > 0.8 ? 'success' : 'default'}
                      sx={{ fontSize: '0.7rem' }}
                    />
                  </Tooltip>
                </Box>
              </Paper>
            ))}
          </List>
        </Collapse>
      </Box>
    );
  };
  
  // Render suggested actions
  const renderSuggestedActions = (message, index) => {
    if (!message.suggested_actions || message.suggested_actions.length === 0) return null;
    
    const isExpanded = expandedActions[index] || false;
    
    return (
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => toggleAction(index)}
        >
          <Typography variant="body2" color="text.secondary">
            Suggested Actions ({message.suggested_actions.length})
          </Typography>
          {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
        </Box>
        
        <Collapse in={isExpanded}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {message.suggested_actions.map((action, actionIndex) => (
              <Grid item xs={12} key={actionIndex}>
                <Card variant="outlined">
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                        {renderActionIcon(action.type)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1">{action.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {action.description}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      Parameters:
                    </Typography>
                    
                    {Object.entries(action.parameters).map(([key, value]) => (
                      <Box key={key} sx={{ display: 'flex', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mr: 1, minWidth: 80 }}>
                          {key}:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {typeof value === 'object' ? JSON.stringify(value) : value.toString()}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                  
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<CheckIcon />}
                      color="success"
                      onClick={() => handleApproveAction(action)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="small"
                      startIcon={<CloseIcon />}
                      color="error"
                      onClick={() => handleRejectAction(action)}
                    >
                      Reject
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Collapse>
      </Box>
    );
  };
  
  return (
    <Box sx={{ height: 'calc(100vh - 88px)', display: 'flex', flexDirection: 'column' }}>
      {/* Chat header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6">
          {conversation?.title || 'New Conversation'}
        </Typography>
      </Paper>
      
      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Messages container */}
      <Paper
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          mb: 2,
          backgroundColor: 'background.default',
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              p: 4,
            }}
          >
            <BotIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Start a new conversation
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Ask me anything about your connected data sources. I can help you find information,
              summarize content, and even suggest actions based on your data.
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((msg, index) => (
              <ListItem
                key={index}
                alignItems="flex-start"
                sx={{
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                  px: 1,
                  py: 1.5,
                }}
              >
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar
                    sx={{
                      bgcolor: msg.role === 'user' ? 'primary.main' : 'secondary.main',
                      width: 32,
                      height: 32,
                    }}
                  >
                    {msg.role === 'user' ? <PersonIcon /> : <BotIcon />}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {msg.role === 'user' ? 'You' : 'BibliosAI'} •{' '}
                        {format(new Date(msg.timestamp), 'h:mm a')}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        backgroundColor:
                          msg.role === 'user' ? 'primary.50' : 'background.paper',
                        borderRadius: 2,
                        maxWidth: '80%',
                        ml: msg.role === 'user' ? 'auto' : 0,
                        mr: msg.role === 'user' ? 0 : 'auto',
                      }}
                    >
                      {renderMessageContent(msg)}
                      {msg.role === 'assistant' && renderSources(msg, index)}
                      {msg.role === 'assistant' && renderSuggestedActions(msg, index)}
                    </Paper>
                  }
                  sx={{
                    margin: 0,
                  }}
                />
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Paper>
      
      {/* Message input */}
      <Paper sx={{ p: 2 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            disabled={loading}
            sx={{ mr: 1 }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
            disabled={!message.trim() || loading}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
