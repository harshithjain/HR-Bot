import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

interface Question {
  id: number;
  question_text: string;
  answer_text: string;
  created_at: string;
  confidence_score: number;
  source_documents: Array<{
    title: string;
    content: string;
    source_url: string;
  }>;
}

const History = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/questions/');
        setQuestions(response.data);
      } catch (err) {
        setError('Failed to load question history');
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Question History
      </Typography>

      <List>
        {questions.map((question) => (
          <Paper
            key={question.id}
            elevation={2}
            sx={{ mb: 2, overflow: 'hidden' }}
          >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle1" component="div">
                    {question.question_text}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip
                      label={`Confidence: ${Math.round(
                        question.confidence_score * 100
                      )}%`}
                      size="small"
                      color={
                        question.confidence_score > 0.7
                          ? 'success'
                          : question.confidence_score > 0.4
                          ? 'warning'
                          : 'error'
                      }
                    />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ ml: 2 }}
                    >
                      {new Date(question.created_at).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" paragraph>
                  {question.answer_text}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Sources:
                </Typography>
                <List dense>
                  {question.source_documents.map((doc, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={doc.title}
                        secondary={
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {doc.content}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default History; 