import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';

import { createTheme, ThemeProvider } from '@mui/material';

import Nav from './Nav';
import Register from './Register.js';
import Login from './Login.js';
import Dashboard from './Dashboard';
import ChangePassword from './ChangePassword.js';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E33E7F',
    },
  },
});

const App = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <SnackbarProvider maxSnack={5}>
            <Nav />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/changepass" component={ChangePassword} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/forgotpass" component={ForgotPassword} />
              <Route exact path="/resetpass/:id/:token" component={ResetPassword} />
            </Switch>
          </SnackbarProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default App;
