// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0a84ff', // Colore principale
    },
    secondary: {
      main: '#5e5ce6',
    },
    background: {
      default: '#f2f2f7',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

export default theme;
