import {Container, createTheme, CssBaseline,
  IconButton, Stack, ThemeProvider, Typography} from '@mui/material';
import React from 'react';
import MainPage from './pages/mainPage.jsx';
import packageJson from './../package.json';
import {GitHub} from '@mui/icons-material';

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
        <Stack
          component='footer'
          alignItems='center'
        >
          <IconButton
            component='span'
            onClick={()=>{
              window.open('https://github.com/avt1745zet/find-different-colors');
            }}
          >
            <GitHub/>
          </IconButton>
          <Typography variant='body1' align='center'>
            Version: {packageJson.version}
          </Typography>
        </Stack>
      </Container>
    </ThemeProvider>
  );
};

export default App;
