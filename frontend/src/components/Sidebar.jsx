import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ChatIcon from "@mui/icons-material/Chat";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/admin" },
  { text: "Users", icon: <PeopleIcon />, path: "/users" },
  { text: "Conversations", icon: <ChatIcon />, path: "/conversations" },
  { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  { text: "Logout", icon: <LogoutIcon />, path: "/" },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const drawerContent = (
    <>
      {/* <h2 style={{ margin: "13px 20px" }}>Admin Dashboard</h2> */}
      <List style={{ marginTop: "40px" }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setOpen(false); // Hide sidebar after navigation
            }}
          >
            <ListItemIcon sx={{ color: "#fff" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Hamburger/Close menu button */}
      <Box
        sx={{
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 1400,
        }}
      >
        <IconButton
          onClick={() => setOpen((prev) => !prev)}
          sx={{
            color: "#000",
            background: "rgba(255, 255, 255, 0.95)",
            "&:hover": { background: "hsl(0, 0.00%, 80.80%)" },
          }}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      {/* Sidebar Drawer */}
      <Drawer
        variant="persistent"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            background: "rgb(140 49 153)",
            color: "#fff",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
