const express = require('express');
const MikroTikClient = require('./src/client');
const { parseResponse } = require('./src/parser');  // Import parser function
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('.')); // serve index.html

app.post('/api/login', async (req, res) => {
  const { host, user, password, port } = req.body;

  const client = new MikroTikClient({ host, user, password, port, debug: true });

  try {
    await client.connect();

    const response = await client.sendCommand(['/system/resource/print']);
    client.close();

    if (response.length > 0) {
      return res.json({ success: true, resource: response[0] });
    } else {
      return res.json({ success: false, message: 'No data returned from router' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
