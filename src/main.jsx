import { StrictMode } from 'react'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import ReactDOM from 'react-dom/client';
import {theme} from './theme';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);

