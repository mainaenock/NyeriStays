export default function handler(req, res) {
  // Serve index.html for all routes (SPA routing)
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Nyeri Stays</title>
      </head>
      <body>
        <div id="root"></div>
        <script>
          // Redirect to the actual index.html
          window.location.href = '/';
        </script>
      </body>
    </html>
  `);
}
