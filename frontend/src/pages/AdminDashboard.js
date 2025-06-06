import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import DashboardSummaryCards from "../components/DashboardSummaryCards";
import UsersTable from "../components/UsersTable";
import RecentConversationsTable from "../components/RecentConversationsTable";
import UploadDocumentDialog from "../components/UploadDocumentDialog";
import { Box, Container, Button } from "@mui/material";

const AdminDashboard = () => {
  const [uploadOpen, setUploadOpen] = useState(false);

  const handleUploadSuccess = () => {
    setUploadOpen(false);
    // Optionally refresh data here
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar title="Admin Dashboard" />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            <Button variant="contained" sx={{ mr: 2 }}>
              Refresh Data
            </Button>
            <Button variant="contained" onClick={() => setUploadOpen(true)}>
              Upload Document
            </Button>
          </Box>
          <DashboardSummaryCards />
          <UsersTable />
          <RecentConversationsTable />
        </Container>
        <UploadDocumentDialog
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
