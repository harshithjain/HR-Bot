import React from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const users = []; // Replace with real data

const UsersTable = () => (
  <Card sx={{ borderRadius: 3, mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ mb: 2 }}>Users</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center">No users found.</TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default UsersTable;
