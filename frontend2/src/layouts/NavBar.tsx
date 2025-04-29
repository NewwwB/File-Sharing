import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Menu,
  Switch,
} from "@mui/material";
import React, { useContext } from "react";
import { ThemeContext } from "../theme/ThemeProviderWrapper";
import { useStateContext } from "../contexts/StateContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar() {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { state } = useStateContext();

  function handleOpenUserMenu(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseUserMenu(): void {
    setAnchorElUser(null);
  }

  return (
    <Box sx={{ flexGrow: 1, height: "64px" }}>
      <AppBar position="sticky">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* App name or logo */}
          <Typography variant="h6" component="div">
            File Share
          </Typography>

          {/* Right-side controls */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
            {/* Dark Mode Toggle Group */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LightModeIcon fontSize="small" />
              <Switch
                color="warning"
                checked={darkMode}
                onChange={toggleDarkMode}
              />
              <DarkModeIcon fontSize="small" />
            </Box>

            {/* User Info Group */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {state.user?.name && (
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {state.user.name}
                </Typography>
              )}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={state.user?.name}
                    src={state.user?.profilePic}
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: "cover",
                      backgroundColor: "#ccc",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
