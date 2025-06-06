import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
  { text: 'Users', icon: <PeopleIcon />, path: '/users' },
  { text: 'Conversations', icon: <ChatIcon />, path: '/conversations' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  { text: 'Logout', icon: <LogoutIcon />, path: '/' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 220,
          boxSizing: 'border-box',
          background: 'rgba(80, 36, 143, 0.95)',
          color: '#fff',
        },
        display: { xs: 'none', md: 'block' },
      }}
    >
      <Box sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 22 }}>
        HR Bot
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
