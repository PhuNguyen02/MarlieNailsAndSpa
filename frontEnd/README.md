# SPA Application

A React TypeScript application with Redux Toolkit and Material-UI.

## Tech Stack

- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Material-UI (MUI)** for UI components
- **React Router** for routing
- **Vite** for build tooling

## Project Structure

```
src/
├── api/          # API configuration and services
├── assets/       # Static assets (images, fonts, etc.)
├── components/   # Reusable UI components
├── config/       # Application configuration
├── features/     # Feature-based modules
├── hooks/        # Custom React hooks
├── message/      # Message/notification utilities
├── pages/        # Page components
├── router/       # Routing configuration
├── store/        # Redux store and slices
├── styles/       # Global styles and theme
└── utils/        # Utility functions
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

