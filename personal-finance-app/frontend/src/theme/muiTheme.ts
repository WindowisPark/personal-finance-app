import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customColors: {
      income: string;
      expense: string;
      balance: string;
      cardBackground: string;
      textPrimary: string;
      textSecondary: string;
    };
  }
  
  interface ThemeOptions {
    customColors?: {
      income?: string;
      expense?: string;
      balance?: string;
      cardBackground?: string;
      textPrimary?: string;
      textSecondary?: string;
    };
  }
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2980b9',
    },
    secondary: {
      main: '#2ecc71',
      light: '#58d68d',
      dark: '#27ae60',
    },
    error: {
      main: '#e74c3c',
      light: '#ec7063',
      dark: '#c0392b',
    },
    warning: {
      main: '#f39c12',
      light: '#f7dc6f',
      dark: '#e67e22',
    },
    info: {
      main: '#3498db',
      light: '#5dade2',
      dark: '#2980b9',
    },
    success: {
      main: '#27ae60',
      light: '#58d68d',
      dark: '#229954',
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
  },
  customColors: {
    income: '#27ae60',
    expense: '#e74c3c',
    balance: '#3498db',
    cardBackground: '#ffffff',
    textPrimary: '#333333',
    textSecondary: '#666666',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5dade2',
      light: '#85c1e9',
      dark: '#3498db',
    },
    secondary: {
      main: '#58d68d',
      light: '#7dcea0',
      dark: '#2ecc71',
    },
    error: {
      main: '#ec7063',
      light: '#f1948a',
      dark: '#e74c3c',
    },
    warning: {
      main: '#f7dc6f',
      light: '#f9e79f',
      dark: '#f39c12',
    },
    info: {
      main: '#5dade2',
      light: '#85c1e9',
      dark: '#3498db',
    },
    success: {
      main: '#58d68d',
      light: '#7dcea0',
      dark: '#27ae60',
    },
    background: {
      default: '#1a1a1a',
      paper: '#2d2d2d',
    },
    text: {
      primary: '#ffffff',
      secondary: '#cccccc',
    },
  },
  customColors: {
    income: '#58d68d',
    expense: '#ec7063',
    balance: '#5dade2',
    cardBackground: '#2d2d2d',
    textPrimary: '#ffffff',
    textSecondary: '#cccccc',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});