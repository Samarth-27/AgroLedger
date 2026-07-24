import { createTheme, alpha } from '@mui/material/styles';

const brandColor = '#6366f1'; // Indigo
const secondaryColor = '#ec4899'; // Pink
const backgroundDefault = '#f1f5f9'; // Slate 100
const paperBackground = '#ffffff';

export const theme = createTheme({
  palette: {
    primary: {
      main: brandColor,
      light: alpha(brandColor, 0.8),
      dark: '#4f46e5',
    },
    secondary: {
      main: secondaryColor,
      light: alpha(secondaryColor, 0.8),
      dark: '#db2777',
    },
    background: {
      default: backgroundDefault,
      paper: paperBackground,
    },
    text: {
      primary: '#0f172a', // Slate 900
      secondary: '#475569', // Slate 600
    }
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontSize: '1.5rem', fontWeight: 600 },
    h6: { fontSize: '1.125rem', fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          padding: '10px 20px',
          boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.23)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.125)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff', // White drawer for clean look
          color: '#0f172a',
          borderRight: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          color: '#0f172a',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          padding: '16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(99, 102, 241, 0.05)',
          color: brandColor,
        },
      },
    },
  },
});
