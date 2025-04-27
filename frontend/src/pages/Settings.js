import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PhotoCamera as PhotoCameraIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: currentUser?.full_name || '',
    email: currentUser?.email || '',
    bio: '',
    jobTitle: '',
    company: '',
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    actionApprovals: true,
    weeklyDigest: false,
    systemUpdates: true,
  });
  
  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    compactMode: false,
    fontSize: 'medium',
    accentColor: 'blue',
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    // Clear messages when switching tabs
    setSuccess('');
    setError('');
  };
  
  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle password form change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle notification settings change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  
  // Handle appearance settings change
  const handleAppearanceChange = (e) => {
    const { name, checked, value } = e.target;
    setAppearanceSettings((prev) => ({
      ...prev,
      [name]: e.target.type === 'checkbox' ? checked : value,
    }));
  };
  
  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // In a real implementation, you would call an API to update the profile
      // For this demo, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password update
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // In a real implementation, you would call an API to update the password
      // For this demo, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setError('Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle notification settings update
  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // In a real implementation, you would call an API to update the notification settings
      // For this demo, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('Notification settings updated successfully');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      setError('Failed to update notification settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle appearance settings update
  const handleAppearanceUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // In a real implementation, you would call an API to update the appearance settings
      // For this demo, we'll just simulate a successful update
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setSuccess('Appearance settings updated successfully');
    } catch (error) {
      console.error('Error updating appearance settings:', error);
      setError('Failed to update appearance settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      setError('');
      
      // In a real implementation, you would call an API to delete the account
      // For this demo, we'll just simulate a successful deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Log out the user
      logout();
      
      // Redirect to login page would happen automatically due to the auth context
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>
      
      {/* Settings tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="settings tabs"
        >
          <Tab icon={<PersonIcon />} label="Profile" />
          <Tab icon={<SecurityIcon />} label="Security" />
          <Tab icon={<NotificationsIcon />} label="Notifications" />
          <Tab icon={<PaletteIcon />} label="Appearance" />
        </Tabs>
      </Paper>
      
      {/* Success and error alerts */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Tab panels */}
      <Box sx={{ mt: 3 }}>
        {/* Profile tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ position: 'relative', mb: 2 }}>
                    <Avatar
                      sx={{ width: 100, height: 100, fontSize: 40 }}
                    >
                      {profileForm.fullName.charAt(0) || 'U'}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        backgroundColor: 'background.paper',
                      }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </Box>
                  <Typography variant="h6">{profileForm.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profileForm.email}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setOpenDeleteDialog(true)}
                  >
                    Delete Account
                  </Button>
                </CardActions>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Profile Information
                </Typography>
                <Box component="form" onSubmit={handleProfileUpdate}>
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={profileForm.fullName}
                    onChange={handleProfileChange}
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    disabled
                    helperText="Email cannot be changed"
                  />
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    multiline
                    rows={3}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Job Title"
                        name="jobTitle"
                        value={profileForm.jobTitle}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        margin="normal"
                        fullWidth
                        label="Company"
                        name="company"
                        value={profileForm.company}
                        onChange={handleProfileChange}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
        
        {/* Security tab */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Box component="form" onSubmit={handlePasswordUpdate}>
              <TextField
                margin="normal"
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </Box>
            </Box>
            
            <Divider sx={{ my: 4 }} />
            
            <Typography variant="h6" gutterBottom>
              Connected Accounts
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Connect your account to these services for easier login and enhanced features.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#DB4437', mr: 2 }}>G</Avatar>
                      <Box>
                        <Typography variant="subtitle1">Google</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Not connected
                        </Typography>
                      </Box>
                    </Box>
                    <Button variant="outlined">Connect</Button>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#0078D4', mr: 2 }}>M</Avatar>
                      <Box>
                        <Typography variant="subtitle1">Microsoft</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Not connected
                        </Typography>
                      </Box>
                    </Box>
                    <Button variant="outlined">Connect</Button>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: '#333', mr: 2 }}>G</Avatar>
                      <Box>
                        <Typography variant="subtitle1">GitHub</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Not connected
                        </Typography>
                      </Box>
                    </Box>
                    <Button variant="outlined">Connect</Button>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        )}
        
        {/* Notifications tab */}
        {activeTab === 2 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notification Settings
            </Typography>
            <Box component="form" onSubmit={handleNotificationUpdate}>
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onChange={handleNotificationChange}
                    name="emailNotifications"
                  />
                }
                label="Email Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Receive email notifications for important updates and activity
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.actionApprovals}
                    onChange={handleNotificationChange}
                    name="actionApprovals"
                  />
                }
                label="Action Approval Notifications"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Get notified when an action requires your approval
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.weeklyDigest}
                    onChange={handleNotificationChange}
                    name="weeklyDigest"
                  />
                }
                label="Weekly Digest"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Receive a weekly summary of activity and insights
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onChange={handleNotificationChange}
                    name="systemUpdates"
                  />
                }
                label="System Updates"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Get notified about new features and system updates
              </Typography>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
        
        {/* Appearance tab */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Appearance Settings
            </Typography>
            <Box component="form" onSubmit={handleAppearanceUpdate}>
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.darkMode}
                    onChange={handleAppearanceChange}
                    name="darkMode"
                  />
                }
                label="Dark Mode"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Use dark theme for the application
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={appearanceSettings.compactMode}
                    onChange={handleAppearanceChange}
                    name="compactMode"
                  />
                }
                label="Compact Mode"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mb: 2 }}>
                Use a more compact layout with less whitespace
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Font Size
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Tabs
                  value={appearanceSettings.fontSize}
                  onChange={(e, value) => setAppearanceSettings((prev) => ({ ...prev, fontSize: value }))}
                >
                  <Tab value="small" label="Small" />
                  <Tab value="medium" label="Medium" />
                  <Tab value="large" label="Large" />
                </Tabs>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Accent Color
              </Typography>
              <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                {['blue', 'purple', 'green', 'orange', 'red'].map((color) => (
                  <Box
                    key={color}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: `${color}.main`,
                      cursor: 'pointer',
                      border: appearanceSettings.accentColor === color ? '2px solid' : 'none',
                      borderColor: 'divider',
                    }}
                    onClick={() => setAppearanceSettings((prev) => ({ ...prev, accentColor: color }))}
                  />
                ))}
              </Box>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </Box>
            </Box>
          </Paper>
        )}
      </Box>
      
      {/* Delete account confirmation dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete your account? This action cannot be undone.
            All your data will be permanently deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAccount}
            color="error"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
