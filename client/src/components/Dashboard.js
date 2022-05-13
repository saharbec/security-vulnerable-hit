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

import config from '../config';

const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
};

const Dashboard = () => {
  const history = useHistory();

  const [searchValue, setSearchValue] = useState('');
  const [notesList, setNoteList] = useState([]);

  const [newNoteValues, setNewNotesValues] = useState({
    title: '',
    content: '',
  });

  const { enqueueSnackbar } = useSnackbar();

  const getHeaders = useCallback(() => {
    return {
      'x-access-token': localStorage.getItem('token'),
    };
  }, []);

  const validateAuthenticated = useCallback(async () => {
    const headers = getHeaders();
    if (headers['x-access-token']) {
      try {
        await Axios.get(`${config.serverUrl}/authentication_status`, {
          headers,
        });
      } catch (error) {
        history.push('/Login');
      }
    } else {
      history.push('/Login');
    }
  }, [history, getHeaders]);

  const searchNotes = useCallback(
    async (text) => {
      try {
        const headers = getHeaders();
        const response = await Axios.get(`${config.serverUrl}/search`, {
          params: { term: text },
          headers,
        });
        setNoteList(response.data);
      } catch (error) {
        const massage = error.response ? error.response.data : 'Network Error';
        enqueueSnackbar(massage, { variant: 'error' });
      }
    },
    [enqueueSnackbar, getHeaders]
  );

  useEffect(() => {
    validateAuthenticated();
    searchNotes('');
  }, [validateAuthenticated, searchNotes]);

  const handleAddNote = (event) => {
    event.preventDefault();
    Axios.post(
      `${config.serverUrl}/addNote`,
      { title: newNoteValues.title, content: newNoteValues.content },
      { headers: getHeaders() }
    )
      .then((response) => {
        setNewNotesValues({ title: '', content: '' });
        searchNotes(searchValue);
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
    setSearchValue(data.get('search'));
    searchNotes(data.get('search'));
  };

  const handleRemoveNote = async (item) => {
    try {
      await Axios.post(
        `${config.serverUrl}/removeNote`,
        { title: item.title },
        { headers: getHeaders() }
      );
      searchNotes(searchValue);
    } catch (error) {
      const massage = error.response ? error.response.data : 'Network Error';
      enqueueSnackbar(massage, { variant: 'error' });
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
        {/* <Typography component="h1" variant="h3">
              Dashboard
              </Typography> */}

        <Box
          component="form"
          noValidate
          onSubmit={handleAddNote}
          sx={{ mt: 3 }}
        >
          <Typography component="h1" variant="h5" mb={2}>
            Add note
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                required
                fullWidth
                value={newNoteValues.title}
                onChange={(e) =>
                  setNewNotesValues({ ...newNoteValues, title: e.target.value })
                }
                id="title"
                label="Title"
                name="title"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                value={newNoteValues.content}
                onChange={(e) =>
                  setNewNotesValues({
                    ...newNoteValues,
                    content: e.target.value,
                  })
                }
                multiline
                id="Content"
                label="Content"
                name="content"
              />
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Note
            </Button>
          </Grid>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={onClickSearch}
          sx={{ mt: 3 }}
        >
          <Typography component="h1" variant="h5" mb={2}>
            My Notes
          </Typography>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid item xs={6} sm={14}>
              <TextField
                fullWidth
                id="search"
                label="Search by title"
                name="search"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {notesList.map((note) => {
              return (
                <Grid item xs={6} key={note.id}>
                  <Card sx={{ maxWidth: 300 }}>
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {note.title}
                        </Typography>
                        {/* XSS */}
                        <div
                          contentEditable="true"
                          dangerouslySetInnerHTML={{ __html: note.content }}
                        ></div>
                        {/* <Typography variant="body2" color="text.secondary">
                          {note.content}
                        </Typography> */}

                        <Tooltip
                          sx={fabStyle}
                          title="Delete"
                          placement="right"
                          onClick={() => {
                            handleRemoveNote(note);
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
