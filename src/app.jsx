import {Box, Container, createTheme,
  CssBaseline, ThemeProvider, Typography} from '@mui/material';
import React from 'react';
import MainPage from './pages/mainPage.jsx';
import packageJson from './../package.json';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Container
        fixed
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <MainPage/>
        <Box
          component='footer'
          sx={{
            marginBlock: '0.5rem',
          }}
        >
          <Typography variant='body1' align='center'>
            Version: {packageJson.version}
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
