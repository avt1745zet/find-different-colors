import {Container, createTheme,
  CssBaseline, ThemeProvider} from '@mui/material';
import React from 'react';
import MainPage from './pages/mainPage.jsx';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Container fixed sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <MainPage/>
      </Container>
    </ThemeProvider>
  );
};

export default App;
