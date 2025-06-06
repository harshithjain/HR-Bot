import React from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardSummaryCards from '../components/DashboardSummaryCards';
import UsersTable from '../components/UsersTable';
import RecentConversationsTable from '../components/RecentConversationsTable';
import { Box, Container, Button } from '@mui/material';

const AdminDashboard = () => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Topbar title="Admin Dashboard" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" sx={{ mr: 2 }}>Refresh Data</Button>
          <Button variant="outlined">Upload Document</Button>
        </Box>
        <DashboardSummaryCards />
        <UsersTable />
        <RecentConversationsTable />
      </Container>
    </Box>
  </Box>
);

export default AdminDashboard;
