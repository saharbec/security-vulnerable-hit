import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';

import { useSnackbar } from 'notistack';
import Typography from '@mui/material/Typography';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useHistory } from 'react-router';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import config from '../config';

const Dashboard = () => {
  const history = useHistory();

  const [searchValue, setSearchValue] = useState('');
  const [customersBySearchList, setCustomersBySearchList] = useState([]);

  const [newCustomerValues, setNewCustomerValues] = useState({
    email: '',
    name: '',
  });

  const { enqueueSnackbar } = useSnackbar();

  const getHeaders = useCallback(() => {
    return {
      'x-access-token': localStorage.getItem('token'),
    };
  }, []);

  const fetchAllCustomers = useCallback(async () => {
    const headers = getHeaders();
    const { data: allCustomers } = await Axios.get(
      `${config.serverUrl}/customers`,
      {
        headers,
      }
    );
    setCustomersBySearchList(allCustomers);
  }, [getHeaders]);

  const initPage = useCallback(async () => {
    const headers = getHeaders();
    if (headers['x-access-token']) {
      try {
        await Axios.get(`${config.serverUrl}/authentication_status`, {
          headers,
        });
        await fetchAllCustomers();
      } catch (error) {
        history.push('/Login');
      }
    } else {
      history.push('/Login');
    }
  }, [history, getHeaders, fetchAllCustomers]);

  const searchCustomers = useCallback(
    async (text) => {
      try {
        const headers = getHeaders();
        const response = await Axios.get(`${config.serverUrl}/search`, {
          params: { term: text },
          headers,
        });
        setCustomersBySearchList(response.data);
      } catch (error) {
        const massage = error.response ? error.response.data : 'Network Error';
        enqueueSnackbar(massage, { variant: 'error' });
      }
    },
    [enqueueSnackbar, getHeaders]
  );

  useEffect(() => {
    initPage();
  }, [initPage]);

  const handleAddCustomer = (event) => {
    event.preventDefault();
    const { name, email } = newCustomerValues;
    Axios.post(
      `${config.serverUrl}/addCustomer`,
      { name, email },
      { headers: getHeaders() }
    )
      .then(({ data }) => {
        setNewCustomerValues({ name: '', email: '' });
        enqueueSnackbar(data, { variant: 'success' });
        fetchAllCustomers();
      })
      .catch((error) => {
        const massage = error.response ? error.response.data : 'Network Error';
        enqueueSnackbar(massage, { variant: 'error' });
      });
  };

  const onClickSearch = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSearchValue(data.get('search'));
    searchCustomers(data.get('search'));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* <Typography component="h1" variant="h3">
              Dashboard
              </Typography> */}

        <Box component="form" noValidate onSubmit={handleAddCustomer}>
          <Typography component="h1" variant="h5" mb={2}>
            Add customer
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                value={newCustomerValues.name}
                onChange={(e) =>
                  setNewCustomerValues({
                    ...newCustomerValues,
                    name: e.target.value,
                  })
                }
                id="name"
                label="Name"
                name="name"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                value={newCustomerValues.email}
                onChange={(e) =>
                  setNewCustomerValues({
                    ...newCustomerValues,
                    email: e.target.value,
                  })
                }
                multiline
                id="email"
                label="Email"
                name="email"
              />
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Customer
            </Button>
          </Grid>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={onClickSearch}
          sx={{ my: 1 }}
        >
          <Typography component="h1" variant="h5" mb={2}>
            Customers
          </Typography>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid item xs={6} sm={14}>
              <TextField
                fullWidth
                id="search"
                label="Search by name"
                name="search"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 3, mb: 2 }}
              >
                Search
              </Button>
              <Button onClick={fetchAllCustomers} variant="outlined" fullWidth>
                Show all
              </Button>
            </Grid>
          </Grid>
        </Box>
        <TableContainer
          style={{ maxHeight: 315, overflow: 'auto', marginTop: 15 }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell component="th">Email</TableCell>
                <TableCell component="th">Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customersBySearchList.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell
                    component="th"
                    dangerouslySetInnerHTML={{ __html: customer.name }}
                  ></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Dashboard;
