# BibliosAI Frontend

This is the frontend application for BibliosAI, an intelligent RAG platform that connects to various data sources and allows users to query their data using natural language.

## Getting Started

### Prerequisites

- Node.js 18+ (LTS version recommended)
- npm 9+ or yarn 1.22+

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env` file in the frontend directory with the following content:

```
REACT_APP_API_URL=http://localhost:8000
```

### Development

To start the development server:

```bash
npm start
# or
yarn start
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This will create a `build` directory with the production-ready application.

## Project Structure

```
frontend/
├── public/             # Static assets
├── src/                # React source code
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── App.js          # Main App component
│   └── index.js        # Entry point
└── package.json        # Dependencies and scripts
```

## Features

- **Authentication**: Login, registration, and OAuth integration
- **Dashboard**: Overview of connected sources and recent activity
- **Chat Interface**: Interact with the LLM using your connected data sources
- **Connectors**: Connect to various data sources like Gmail, Slack, etc.
- **Actions**: Approve or reject suggested actions from the LLM
- **Settings**: Manage your account and preferences

## Technologies

- React 18
- React Router 6
- Material-UI 5
- Axios for API requests
- JWT for authentication
