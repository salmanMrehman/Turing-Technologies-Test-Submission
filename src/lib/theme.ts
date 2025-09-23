import { createTheme } from '@mui/material/styles';
import colors from '../../public/styles/colors';

const AVENIR_STACK =
  '"Avenir LT Std", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';

const theme = createTheme({
  palette: {
    primary: { main: colors.primary },
    background: { default: colors.secondary },
    text: { primary: colors.text.primary, secondary: colors.text.secondary },
  },
  shape: { borderRadius: 4 },

  typography: {
    fontSize: 14,
    fontFamily: AVENIR_STACK, // use Avenir globally for MUI typography
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage:
            'radial-gradient(1200px 600px at 70% 30%, rgba(255,255,255,.6), transparent 60%)',
        },
      },
    },

    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: { borderBottom: '1px solid #e5e7eb', backgroundColor: '#fff' },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'medium', fullWidth: true, variant: 'outlined' },
    },

    // Ensure inputs/labels/buttons also use Avenir
    MuiInputBase: {
      styleOverrides: {
        root: { fontFamily: AVENIR_STACK },
        input: {
          fontFamily: AVENIR_STACK,
          '::placeholder': { fontFamily: AVENIR_STACK },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: { root: { fontFamily: AVENIR_STACK } },
    },
    MuiButton: {
      styleOverrides: { root: { fontFamily: AVENIR_STACK } },
    },
  },
});

export default theme;
