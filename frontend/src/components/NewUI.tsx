import React, { useState } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Paper,
  Divider,
  Snackbar,
} from "@mui/material";
import {
  CloudUpload,
  CloudDownload,
  People,
  BarChart,
} from "@mui/icons-material";

function NewUI() {
  const [usersOnline, setUsersOnline] = useState(["Alice", "Bob", "Charlie"]);
  const [connectionRequests, setConnectionRequests] = useState(["David"]);
  const [fileRequests, setFileRequests] = useState(["file1.pdf"]);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleAcceptConnection = (user: string) => {
    setUsersOnline([...usersOnline, user]);
    setConnectionRequests(connectionRequests.filter((u) => u !== user));
    setSnackbarMessage(`${user} is now connected.`);
  };

  const handleAcceptFile = (file: string) => {
    setFileRequests(fileRequests.filter((f) => f !== file));
    setSnackbarMessage(`Receiving ${file}...`);
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">File Sharing App</Typography>
        </Toolbar>
      </AppBar>

      <Box display="flex" justifyContent="space-between" mt={3}>
        {/* Online Users Section */}
        <Paper elevation={3} style={{ padding: 16, flex: 1, marginRight: 16 }}>
          <Typography variant="h6">
            <People /> Online Users
          </Typography>
          <List>
            {usersOnline.map((user, index) => (
              <ListItem key={index}>
                <ListItemText primary={user} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Connection Requests */}
        <Paper elevation={3} style={{ padding: 16, flex: 1, marginRight: 16 }}>
          <Typography variant="h6">Connection Requests</Typography>
          <List>
            {connectionRequests.length > 0 ? (
              connectionRequests.map((user, index) => (
                <ListItem key={index}>
                  <ListItemText primary={user} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptConnection(user)}
                  >
                    Approve
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography>No new requests</Typography>
            )}
          </List>
        </Paper>

        {/* File Requests */}
        <Paper elevation={3} style={{ padding: 16, flex: 1 }}>
          <Typography variant="h6">File Requests</Typography>
          <List>
            {fileRequests.length > 0 ? (
              fileRequests.map((file, index) => (
                <ListItem key={index}>
                  <ListItemText primary={file} />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleAcceptFile(file)}
                  >
                    Accept
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography>No pending file requests</Typography>
            )}
          </List>
        </Paper>
      </Box>

      <Divider style={{ margin: "20px 0" }} />

      {/* File Transfer Actions */}
      <Box display="flex" justifyContent="space-around">
        <Button variant="contained" startIcon={<CloudUpload />} color="primary">
          Send File
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudDownload />}
          color="secondary"
        >
          Receive File
        </Button>
      </Box>

      <Divider style={{ margin: "20px 0" }} />

      {/* Transfer Statistics */}
      <Paper elevation={3} style={{ padding: 16 }}>
        <Typography variant="h6">
          <BarChart /> Transfer Stats
        </Typography>
        <Typography>Total Files Sent: 10</Typography>
        <Typography>Total Files Received: 8</Typography>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={3000}
        onClose={() => setSnackbarMessage("")}
        message={snackbarMessage}
      />
    </Container>
  );
}

export default NewUI;
