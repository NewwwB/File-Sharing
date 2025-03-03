import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  useTheme,
  CircularProgress,
} from "@mui/material";

const SignUp: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const theme = useTheme(); 
  const isDarkMode = theme.palette.mode === "dark";

  // State variables for inputs in the form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  // Function to handle sign-up
  const handleSignup = () => {
    // Validate input fields
    if (!email || !password || !confirmPassword) {
      alert("All fields are required!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setLoading(true);

    // Simulate account creation process
    setTimeout(() => {
      setLoading(false);
      alert("Account created successfully! Now you can log in.");
      onSwitch(); // Switch to the login page
    }, 2000);
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
          Sign Up
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

        {/* Confirm Password Input */}
        <TextField
          label="Confirm Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          sx={{ input: { color: isDarkMode ? "#fff" : "#000" } }}
        />

        {/* Sign-Up Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </Button>

        {/* Switch to Login Option */}
        <Typography
          variant="body2"
          sx={{ mt: 2, cursor: "pointer", color: "blue" }}
          onClick={onSwitch}
        >
          Already have an account? Log In
        </Typography>
      </Paper>
    </Box>
  );
};

export default SignUp;