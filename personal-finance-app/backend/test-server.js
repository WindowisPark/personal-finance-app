const express = require('express');
const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server is running on port ${PORT}`);
});