import { useState } from 'react';
import { Box, Button, Textarea, Text } from 'theme-ui';

const SuggestionsBox = () => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    if (!content.trim()) {
      setStatus('Please enter a suggestion or comment.');
      return;
    }

    try {
      const response = await fetch('/api/migration/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ msg: content, sig: 'signature-placeholder' }) // Adjust as needed
      });

      if (response.ok) {
        setStatus('Your suggestion has been sent!');
        setContent(''); // Clear the textarea
      } else {
        setStatus('Failed to send your suggestion. Please try again.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <Box sx={{ mt: 4, p: 3, border: '1px solid', borderColor: 'muted', borderRadius: '4px' }}>
      <Text as="h3" sx={{ mb: 2 }}>
        Suggestions - Comments
      </Text>
      <Textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Enter your suggestion or comment here..."
        sx={{ mb: 2 }}
      />
      <Button onClick={handleSubmit} sx={{ mr: 2 }}>
        Submit
      </Button>
      <Text as="p" sx={{ mt: 2, color: 'primary' }}>
        {status}
      </Text>
    </Box>
  );
};

export default SuggestionsBox;
