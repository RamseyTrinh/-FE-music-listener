import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00cda8',
        },
        secondary: {
            main: '#33de93',
        },
        background: {
            default: '#0f1a2a',
            paper: '#0f1a2a',
        },
        text: {
            primary: 'rgba(255,255,255,0.87)',
        },
    },
    props: {
        MuiAppBar: {
            color: 'transparent',
        },
        MuiTooltip: {
            arrow: true,
        },
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '1rem',
                    padding: '1rem',
                },
            },
        },
    },
    direction: 'rtl',
    shape: {
        borderRadius: 4,
    },
    spacing: 8,
});
