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
  CircularProgress,
} from "@mui/material";

const LogIn: React.FC<{ onSwitch: () => void; onLogin: () => void }> = ({ onSwitch, onLogin }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  // State variables for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); 

  // Login function
  const handleLogin = () => {
    if (!email || !password) {
      alert("Email and Password are required!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === "admin@example.com" && password === "password") {
        onLogin(); // Triggers authentication
      } else {
        alert("Invalid credentials! Try admin@example.com / password");
      }
    }, 2000); // Simulating a login request
  };

  // Guest login to login without password
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
      sx={{ backgroundColor: "#4A90E2" }}
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
        {/* Title */}
        <Typography variant="h5" gutterBottom>
          LogIn
        </Typography>

        {/* Email Input */}
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ input: { color: isDarkMode ? "#fff" : "#000" } }}
        />

        {/* Password Input */}
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

        {/* Remember Me Checkbox */}
        <FormControlLabel
          control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
          label="Remember Me"
        />

        {/* Login Button with Spinner */}
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleLogin} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        {/* Guest Login Button */}
        <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleGuestLogin} disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login as Guest"}
        </Button>

        {/* Switch to Sign Up */}
        <Typography
          variant="body2"
          sx={{ mt: 2, cursor: "pointer", color: "blue" }}
          onClick={onSwitch}
        >
          Don't have an account? Sign Up
        </Typography>
      </Paper>
    </Box>
  );
};

export default LogIn;
