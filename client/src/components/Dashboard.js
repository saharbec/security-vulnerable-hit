import React, { useState, useEffect, useCallback } from 'react';
import Axios from 'axios';

import { useSnackbar } from 'notistack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useHistory } from 'react-router';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import PopUp from './PopUp';
import config from '../config';

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

const Dashboard = () => {
  const [search, setSearch] = useState('');
  const [noteList, setNoteList] = useState([]);
  const [popUpInfo, setPopUpInfo] = useState({});
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();

  const getHeaders = useCallback(() => {
    return {
      'x-access-token': localStorage.getItem('token'),
    };
  }, []);

  const validateAuthenticated = useCallback(async () => {
    if (getHeaders()['x-access-token']) {
      try {
        await Axios.get(`${config.serverUrl}/authentication_status`, { headers: getHeaders() });
        searchNotes(search);
      } catch (error) {
        history.push('/Login');
      }
    } else {
      history.push('/Login');
    }
  }, [history, getHeaders]);

  useEffect(() => {
    validateAuthenticated();
  }, [validateAuthenticated]);

  const handleAddNote = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    Axios.post(
      `${config.serverUrl}/addNote`,
      { title: data.get('title'), content: data.get('content') },
      { headers: getHeaders() }
    )
      .then((response) => {
        searchNotes(search);
        enqueueSnackbar(response.data, { variant: 'success' });
      })
      .catch((error) => {
        const massage = error.response ? error.response.data : 'Network Error';
        enqueueSnackbar(massage, { variant: 'error' });
      });
  };

  const onClickSearch = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setSearch(data.get('search'));
    searchNotes(search);
  };

  const searchNotes = async (text) => {
    try {
      const response = await Axios.post(`${config.serverUrl}/Search`, { search: text }, { headers: getHeaders() });
      setNoteList(response.data);
    } catch (error) {
      const massage = error.response ? error.response.data : 'Network Error';
      enqueueSnackbar(massage, { variant: 'error' });
    }
  };

  const handleRemoveNote = async (item) => {
    try {
      await Axios.post(`${config.serverUrl}/removeNote`, { title: item.title }, { headers: getHeaders() });
      searchNotes(search);
    } catch (error) {
      const massage = error.response ? error.response.data : 'Network Error';
      enqueueSnackbar(massage, { variant: 'error' });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <PopUp
        info={popUpInfo}
        handleClose={() => {
          setPopUpInfo(false);
        }}
      ></PopUp>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* <Typography component="h1" variant="h3">
              Dashboard
              </Typography> */}

        <Box component="form" noValidate onSubmit={handleAddNote} sx={{ mt: 3 }}>
          <Typography component="h1" variant="h5">
            Add note
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6}>
              <TextField required fullWidth id="title" label="Title" name="title" />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField required fullWidth multiline id="Content" label="Content" name="content" />
            </Grid>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Add Note
            </Button>
          </Grid>
        </Box>

        <Box component="form" noValidate onSubmit={onClickSearch} sx={{ mt: 3 }}>
          <Typography component="h1" variant="h5">
            My Notes
          </Typography>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid item xs={6} sm={14}>
              <TextField required fullWidth id="search" label="Search" name="search" />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Search
              </Button>
            </Grid>
          </Grid>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {noteList.map((item) => {
              return (
                <Grid item xs={6}>
                  <Card sx={{ maxWidth: 300 }}>
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {item.title}
                        </Typography>
                        {/* <div contentEditable='true' dangerouslySetInnerHTML={{ __html: item.content }}></div> //XSS */}
                        <Typography variant="body2" color="text.secondary">
                          {item.content}
                        </Typography>

                        <Tooltip
                          sx={fabStyle}
                          title="Delete"
                          placement="right"
                          onClick={() => {
                            handleRemoveNote(item);
                          }}
                        >
                          <IconButton>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
