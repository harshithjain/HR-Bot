import React from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const conversations = []; // Replace with real data

const RecentConversationsTable = () => (
  <Card sx={{ borderRadius: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Recent Conversations</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Messages</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {conversations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">No conversations found.</TableCell>
            </TableRow>
          ) : (
            conversations.map((conv) => (
              <TableRow key={conv.id}>
                <TableCell>{conv.user}</TableCell>
                <TableCell>{conv.date}</TableCell>
                <TableCell>{conv.messages}</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default RecentConversationsTable;
