# BibliosAI User Guide

This guide provides instructions on how to use the BibliosAI platform effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Connecting Data Sources](#connecting-data-sources)
4. [Chat Interface](#chat-interface)
5. [Managing Actions](#managing-actions)
6. [Settings](#settings)
7. [Tips and Best Practices](#tips-and-best-practices)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Creating an Account

1. Navigate to the BibliosAI login page at http://localhost:3000 (or your deployment URL)
2. Click on "Create an Account"
3. Fill in your details:
   - Full Name
   - Email Address
   - Password (at least 8 characters)
4. Click "Create Account"
5. Verify your email address by clicking the link sent to your email

### Logging In

1. Navigate to the BibliosAI login page
2. Enter your email and password
3. Click "Sign In"
4. Alternatively, you can use OAuth to sign in with Google, Microsoft, or GitHub

## Dashboard

The dashboard provides an overview of your BibliosAI system:

### Key Elements

- **Recent Conversations**: Quick access to your recent chat conversations
- **Connected Sources**: Overview of your connected data sources
- **Pending Actions**: Actions that require your approval
- **Statistics**: Usage statistics and insights

### Navigation

- Use the sidebar to navigate between different sections of the application
- Click on any card to view more details or take action

## Connecting Data Sources

BibliosAI can connect to various data sources to provide context for your queries.

### Available Connectors

- **Gmail**: Access your emails
- **Slack**: Connect to your Slack workspace
- **Google Drive**: Access documents and files
- **Notion**: Connect to your Notion workspace
- **Jira**: Access your Jira issues
- **GitHub**: Connect to your GitHub repositories

### Adding a New Connector

1. Navigate to the "Connectors" page from the sidebar
2. Click "Add Connector"
3. Select the connector type (e.g., Gmail)
4. Enter a name and description for the connector
5. Click "Connect"
6. Follow the OAuth flow to grant BibliosAI access to your data
7. Once connected, BibliosAI will start syncing your data

### Managing Connectors

- **View Details**: Click on a connector to view its details
- **Sync**: Manually trigger a sync to update data
- **Edit**: Change the connector name or description
- **Delete**: Remove a connector and its associated data

## Chat Interface

The chat interface allows you to interact with BibliosAI using natural language.

### Starting a New Conversation

1. Navigate to the "Chat" page from the sidebar
2. Click "New Conversation"
3. Type your question or request in the input field
4. Press Enter or click the send button

### Using Context from Connected Sources

- BibliosAI automatically retrieves relevant information from your connected sources
- You can specify which sources to use for a particular conversation
- Click the "Sources" button above the chat input to select specific sources

### Viewing Source References

- When BibliosAI provides an answer, it may include references to the sources it used
- Click on a source reference to view the original content
- Sources are ranked by relevance to your query

### Managing Conversations

- **Rename**: Click the conversation title to rename it
- **Delete**: Click the three dots menu and select "Delete"
- **Export**: Click the three dots menu and select "Export" to download the conversation

## Managing Actions

BibliosAI can suggest actions based on your conversations, such as sending emails or scheduling meetings.

### Approving Actions

1. Navigate to the "Actions" page from the sidebar or click on a pending action notification
2. Review the action details
3. Click "Approve" to authorize BibliosAI to perform the action
4. Confirm your approval

### Rejecting Actions

1. Review the action details
2. Click "Reject" if you don't want the action to be performed
3. Optionally, provide a reason for rejection

### Viewing Action History

- The "Actions" page shows all actions, including pending, approved, completed, and rejected
- Use the tabs to filter actions by status
- Click on an action to view its details, including the result if it has been completed

## Settings

The settings page allows you to customize your BibliosAI experience.

### Profile Settings

- Update your name, email, and profile picture
- Change your password
- Delete your account

### Security Settings

- Manage connected accounts (Google, Microsoft, GitHub)
- View active sessions
- Enable two-factor authentication

### Notification Settings

- Configure email notifications
- Set up notification preferences for actions and system updates

### Appearance Settings

- Toggle dark mode
- Adjust font size and layout density
- Choose accent color

## Tips and Best Practices

### Effective Queries

- **Be specific**: Clearly state what you're looking for
- **Provide context**: Include relevant details in your query
- **Use follow-up questions**: Ask for clarification or more details

### Managing Data Sources

- **Regular syncing**: Keep your data sources up to date
- **Organize data**: Well-organized data sources lead to better results
- **Multiple sources**: Connect multiple sources for comprehensive context

### Action Workflow

- **Review carefully**: Always review suggested actions before approving
- **Set boundaries**: Configure which types of actions BibliosAI can suggest
- **Provide feedback**: Reject actions that aren't helpful to improve suggestions

## Troubleshooting

### Common Issues

#### Authentication Problems

- **Issue**: Unable to log in
- **Solution**: Reset your password or check your email for verification

#### Connector Sync Failures

- **Issue**: Connector shows error status
- **Solution**: Check your permissions, reconnect the source, or contact support

#### Missing or Incorrect Information

- **Issue**: BibliosAI provides incomplete or incorrect answers
- **Solution**: Ensure your data sources are properly synced and try rephrasing your query

#### Action Execution Failures

- **Issue**: Approved actions fail to execute
- **Solution**: Check the action details for error messages and ensure the necessary permissions are granted

### Getting Help

- **Documentation**: Refer to the [API Documentation](api.md) and [Architecture Overview](architecture.md)
- **Support**: Contact support@bibliosai.com for assistance
- **Community**: Join our community forum at https://community.bibliosai.com

## Advanced Features

### Custom Connectors

BibliosAI supports custom connectors for specialized data sources:

1. Navigate to "Connectors" > "Add Connector" > "Custom Connector"
2. Follow the configuration wizard to set up your custom data source
3. Test the connection and start syncing

### Workflow Automation

Create automated workflows based on specific triggers:

1. Navigate to "Settings" > "Automation"
2. Click "Create Workflow"
3. Define triggers, conditions, and actions
4. Save and activate your workflow

### Data Export and Backup

Export your data for backup or analysis:

1. Navigate to "Settings" > "Data Management"
2. Select the data you want to export
3. Choose the export format
4. Click "Export" to download your data

## Keyboard Shortcuts

- **Ctrl/Cmd + N**: New conversation
- **Ctrl/Cmd + /**: Focus search
- **Ctrl/Cmd + Enter**: Send message
- **Esc**: Cancel current action
- **Ctrl/Cmd + Shift + A**: Go to Actions page
- **Ctrl/Cmd + Shift + C**: Go to Connectors page
- **Ctrl/Cmd + Shift + S**: Go to Settings page
