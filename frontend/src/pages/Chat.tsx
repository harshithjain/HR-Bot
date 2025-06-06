import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  sources?: Array<{
    text: string;
    metadata: {
      title: string;
      url: string;
    };
    relevance_score: number;
  }>;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: input,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/questions/', {
        question_text: input,
      });

      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.data.answer_text,
        isUser: false,
        sources: response.data.source_documents.map((doc: any) => ({
          text: doc.content,
          metadata: {
            title: doc.title,
            url: doc.source_url,
          },
          relevance_score: response.data.confidence_score,
        })),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error while processing your question.',
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          mb: 2,
          p: 2,
          overflow: 'auto',
          backgroundColor: '#f5f5f5',
        }}
      >
        <List>
          {messages.map((message) => (
            <React.Fragment key={message.id}>
              <ListItem
                sx={{
                  justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    backgroundColor: message.isUser ? '#e3f2fd' : '#ffffff',
                  }}
                >
                  <ListItemText
                    primary={message.text}
                    secondary={
                      !message.isUser && message.sources && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Sources:
                          </Typography>
                          {message.sources.map((source, index) => (
                            <Box key={index} sx={{ mt: 0.5 }}>
                              <Typography variant="caption" component="div">
                                {source.metadata.title}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Relevance: {Math.round(source.relevance_score * 100)}%
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )
                    }
                  />
                </Paper>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          display: 'flex',
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask a question about HR policies..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          disabled={loading || !input.trim()}
        >
          Send
        </Button>
      </Paper>
    </Box>
  );
};

export default Chat; 