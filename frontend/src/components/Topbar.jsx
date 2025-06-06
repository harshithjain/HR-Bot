import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import "./Topbar.css";

const Topbar = ({ title }) => (
  <AppBar
    position="static"
    sx={{ background: "none", boxShadow: "none", zIndex: 1 }}
    className="topBar"
  >
    <Toolbar>
      <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
        {title}
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Topbar;
