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
import { Menu as MenuIcon } from "@mui/icons-material";
import React, { useContext } from "react";
import img from "../assets/react.svg";
import { ThemeContext } from "../theme/ThemeProviderWrapper";


const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar({ onLogout }: { onLogout: () => void }) {
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  function handleOpenUserMenu(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseUserMenu(): void {
    setAnchorElUser(null);
  }

  function handleMenuClick(setting: string) {
    if (setting === "Logout") {
      onLogout(); // Call the logout function
    }
    handleCloseUserMenu();
  }

  return (
    <Box sx={{ flexGrow: 1, height: "64px" }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            File Share
          </Typography>

          {/* Dark Mode Switch */}
          <Switch
            color="warning"
            checked={darkMode}
            onChange={toggleDarkMode}
            sx={{ marginRight: "10px" }}
          />
          <Typography mr={2}>John</Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src={img} />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                  <Typography sx={{ textAlign: "center" }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
