import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Topbar = ({ title }) => (
  <AppBar position="static" sx={{ background: 'rgba(123,47,242,0.95)', boxShadow: 'none' }}>
    <Toolbar>
      <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
        {title}
      </Typography>
      <Box component="img" src="/logo192.png" alt="Logo" sx={{ height: 40 }} />
    </Toolbar>
  </AppBar>
);

export default Topbar;
