import { useState } from "react";
import { Box, Stack } from "@mui/material";
import Content from "./layouts/Content";
import SideBar from "./layouts/SideBar";
import NavBar from "./layouts/NavBar";
import ThemeProviderWrapper from "./theme/ThemeProviderWrapper";
import LogIn from "./components/Main Content/LogIn";
import SignUp from "./components/Main Content/SignUp"; // Import SignUp Component

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [isSignUp, setIsSignUp] = useState(false); // Track Login/Signup Page

  // login
  const handleLogin = () => {
    localStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  return (
    <ThemeProviderWrapper>
      {isAuthenticated ? (
        <Box sx={{ height: "100vh", overflow: "hidden" }}>
          <NavBar onLogout={handleLogout} />
          <Stack direction="row" spacing={2} justifyContent="space-between" height="calc(100vh - 64px)">
            <SideBar />
            <Content />
          </Stack>
        </Box>
      ) : isSignUp ? (
        <SignUp onSwitch={() => setIsSignUp(false)} /> /* Switch to Login */
      ) : (
        <LogIn onSwitch={() => setIsSignUp(true)} onLogin={handleLogin} /> /* Switch to SignUp */
      )}
    </ThemeProviderWrapper>
  );
}

export default App;
