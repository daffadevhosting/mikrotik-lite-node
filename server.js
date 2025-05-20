const express = require('express');
const MikroTikClient = require('./src/client');
const { parseResponse } = require('./src/parser');  // Import parser function
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('.')); // serve index.html

app.post('/api/login', async (req, res) => {
  const { host, user, password } = req.body;

  const client = new MikroTikClient({
    host,
    user,
    password,
    debug: true
  });

  try {
    await client.connect();
    const rawResult = await client.sendCommand(['/system/resource/print']);
    const parsed = parseResponse(rawResult);  // <-- pakai fungsi parser, bukan client.parse()

    const resource = parsed[0] || {};

    client.close();

    res.json({ success: true, resource });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
