import React, { useCallback, useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Axios from 'axios';
import { useSnackbar } from 'notistack';
import Alert from '@mui/material/Alert';

import config from '../config';

const ChangePassword = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordValidated, setNewPasswordValidated] = useState('');
  const [passwordConfig, setPasswordConfig] = useState([]);

  const headers = {
    'x-access-token': localStorage.getItem('token'),
  };

  const getPasswordConfig = useCallback(() => {
    Axios.get(`${config.serverUrl}/passwordRequirements`)
      .then((response) => {
        setPasswordConfig([response.data]);
      })
      .catch((error) => {
        const massage = error.response ? error.response.data : 'Network Error';
        enqueueSnackbar(massage, { variant: 'error' });
      });
  }, [enqueueSnackbar]);

  useEffect(() => {
    getPasswordConfig();
  }, [getPasswordConfig]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newPassword === newPasswordValidated) {
      Axios.post(
        `${config.serverUrl}/changePassword`,
        {
          currentPassword: currentPassword,
          newPassword: newPassword,
        },
        { headers: headers }
      )
        .then((response) => {
          enqueueSnackbar('Changed password successfully', {
            variant: 'success',
          });
          localStorage.setItem('token', response.data.token);
          setCurrentPassword('');
          setNewPassword('');
          setNewPasswordValidated('');
        })
        .catch((error) => {
          const massage = error.response
            ? error.response.data
            : 'Network Error';
          enqueueSnackbar(massage, { variant: 'error' });
        });
    } else {
      enqueueSnackbar('passwords dont mach', { variant: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Change Password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="currentPassword"
            type="password"
            label="Current Password"
            name="currentPassword"
            autoFocus
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="New Password"
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value);
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="validatePassword"
            label="Validate Password"
            type="password"
            id="validatePassword"
            value={newPasswordValidated}
            onChange={(event) => {
              setNewPasswordValidated(event.target.value);
            }}
          />
          {passwordConfig.length !== 0 && (
            <Alert
              severity={
                passwordConfig[0]['min password length'] <= newPassword.length
                  ? 'success'
                  : 'error'
              }
            >
              password must contain more than{' '}
              {passwordConfig[0]['min password length']} characters
            </Alert>
          )}
          {passwordConfig.length !== 0 &&
            Object.keys(passwordConfig[0].character.settings).reduce(
              (filtered, key) => {
                if (passwordConfig[0].character.settings[key]) {
                  let re = new RegExp(passwordConfig[0].character.regex[key]);
                  filtered.push(
                    <Alert
                      key={key}
                      severity={re.test(newPassword) ? 'success' : 'error'}
                    >
                      {key}
                    </Alert>
                  );
                }
                return filtered;
              },
              []
            )}
          <Button
            color="secondary"
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ChangePassword;
