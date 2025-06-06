import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { sender: 'user', text: question }]);
    try {
      const res = await axios.post('http://localhost:8000/api/ask/', { question });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.answer }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
    setQuestion('');
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)' }}>
      <Container maxWidth="sm">
        <Paper elevation={6} sx={{ p: 3, borderRadius: 4 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, textAlign: 'center' }}>HR Bot</Typography>
          <List sx={{ minHeight: 200, maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {messages.map((msg, idx) => (
              <ListItem key={idx} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <ListItemText
                  primary={msg.text}
                  sx={{
                    bgcolor: msg.sender === 'user' ? '#7b2ff2' : '#f357a8',
                    color: '#fff',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    maxWidth: '75%',
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                  }}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              disabled={loading}
            />
            <Button variant="contained" onClick={handleSend} disabled={loading || !question.trim()}>
              {loading ? '...' : 'Send'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Chat;
