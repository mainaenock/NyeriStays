const express = require('express');

const app = express();

// Test basic routes
app.get('/test', (req, res) => {
  res.json({ message: 'Test route works' });
});

app.get('/test/:id', (req, res) => {
  res.json({ message: 'Parameter route works', id: req.params.id });
});

app.listen(3001, () => {
  console.log('Test server running on port 3001');
}); 