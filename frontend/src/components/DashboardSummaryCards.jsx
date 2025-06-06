import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const summary = [
  { label: 'Total Users', value: 0 },
  { label: 'Total Conversations', value: 0 },
  { label: 'Active Users', value: 0 },
];

const DashboardSummaryCards = () => (
  <Grid container spacing={3} sx={{ mb: 3 }}>
    {summary.map((item) => (
      <Grid item xs={12} md={4} key={item.label}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary">{item.label}</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>{item.value}</Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default DashboardSummaryCards;
