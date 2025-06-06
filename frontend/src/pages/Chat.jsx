import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    try {
      const res = await axios.post("http://localhost:8000/api/ask/", {
        question,
      });
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
    setQuestion("");
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth={false} style={{ margin: "50px auto", width: "60%", maxWidth: "60%", minWidth: 400, minHeight: '80vh', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Paper elevation={6} sx={{ p: 3, borderRadius: 4, background: 'rgba(255,255,255,0.95)', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h5"
            sx={{ mb: 2, fontWeight: 700, textAlign: "center", color: '#35297f' }}
          >
            HR Bot
          </Typography>
          <List
            sx={{ flex: 1, minHeight: 200, maxHeight: 'calc(80vh - 180px)', overflowY: "auto", mb: 2, px: 1 }}
          >
            {messages.map((msg, idx) => (
              <ListItem
                key={idx}
                sx={{
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  display: 'flex',
                }}
              >
                <span
                  style={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    fontSize: "1.08rem",
                    lineHeight: 1.7,
                    padding: "12px 20px",
                    borderRadius: msg.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background:
                      msg.sender === "user"
                        ? "linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)"
                        : "linear-gradient(90deg, #f357a8 0%, #ffb86c 100%)",
                    color: "#fff",
                    boxShadow: msg.sender === "user"
                      ? "0 2px 8px rgba(123,47,242,0.10)"
                      : "0 2px 8px rgba(243,87,168,0.10)",
                    display: "inline-block",
                    maxWidth: "80%",
                    marginBottom: 6,
                  }}
                >
                  {msg.text}
                </span>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={handleSend}
              disabled={loading || !question.trim()}
            >
              {loading ? "..." : "Send"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Chat;
