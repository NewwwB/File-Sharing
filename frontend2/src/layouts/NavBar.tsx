import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Menu,
  Switch,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import React from "react";
import img from "../assets/react.svg";

const settings = ["Profile", "Account", "Dashboard", "Logout"];

function NavBar() {
  // const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  function handleOpenUserMenu(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseUserMenu(): void {
    setAnchorElUser(null);
  }

  return (
    <>
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
            <Switch color="warning" sx={{ marginRight: "10px" }} />
            <Typography mr={2}>John</Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={img} />
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography sx={{ textAlign: "center" }}>
                      {setting}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

export default NavBar;
