import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import UpdateIcon from '@mui/icons-material/Update';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Ask Questions',
      description: 'Get instant answers to your HR-related questions from our comprehensive knowledge base.',
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/chat'),
    },
    {
      title: 'View History',
      description: 'Access your previous questions and answers for future reference.',
      icon: <HistoryIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/history'),
    },
    {
      title: 'Up-to-date Information',
      description: 'Our system automatically updates with the latest HR policies and procedures.',
      icon: <UpdateIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/chat'),
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        sx={{ mb: 6 }}
      >
        Welcome to BxA Knowledge Base
      </Typography>

      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        align="center"
        color="text.secondary"
        sx={{ mb: 8 }}
      >
        Your intelligent HR assistant for quick and accurate answers
      </Typography>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                },
              }}
            >
              <CardHeader
                avatar={feature.icon}
                title={feature.title}
                titleTypographyProps={{ variant: 'h6' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Button
                  variant="contained"
                  onClick={feature.action}
                  sx={{ mt: 2 }}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 