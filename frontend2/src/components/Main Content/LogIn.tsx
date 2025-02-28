import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  //login function
  const handleLogin = () => {
    if (email === "admin@example.com" && password === "password") {
      onLogin(); // Triggers authentication
    } else {
      alert("Invalid credentials! Try admin@example.com / password");
    }
  };

  //guest login to login without password
  const handleGuestLogin = () => {
    alert("Logging in as Guest");
    onLogin();
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor:"#4A90E2" }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: "24px",
          borderRadius: "12px",
          width: "350px",
          textAlign: "center",
          backgroundColor: isDarkMode ? "#1e1e1e" : "#fff",
          color: isDarkMode ? "#fff" : "#000",
        }}
      >
        <Typography variant="h5" gutterBottom>
          LogIn
        </Typography>

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ input: { color: isDarkMode ? "#fff" : "#000" } }}
        />

        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ input: { color: isDarkMode ? "#fff" : "#000" } }}
        />

        <FormControlLabel
          control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
          label="Remember Me"
        />

        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin}>
          Login
        </Button>
         
        <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleGuestLogin}>
          Login as Guest
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
