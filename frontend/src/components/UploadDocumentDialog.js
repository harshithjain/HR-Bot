import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, CircularProgress, InputLabel, Box } from '@mui/material';
import axios from 'axios';

const UploadDocumentDialog = ({ open, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);
      formData.append('source_url', sourceUrl);
      const res = await axios.post('/api/documents/upload_document/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('PDF uploaded and processed successfully!');
      setTitle('');
      setFile(null);
      setSourceUrl('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setTitle('');
    setFile(null);
    setSourceUrl('');
    setError('');
    setSuccess('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Upload PDF Document</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        <TextField
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <InputLabel htmlFor="pdf-upload" sx={{ mb: 1 }}>PDF File</InputLabel>
        <Box sx={{ mb: 2 }}>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={{ width: '100%' }}
          />
        </Box>
        <TextField
          label="Source URL"
          value={sourceUrl}
          onChange={e => setSourceUrl(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !title || !file}>
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadDocumentDialog; 