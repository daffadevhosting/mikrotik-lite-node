const express = require('express');
const bodyParser = require('body-parser');
const MikroTikClient = require('./src/client');

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); // untuk membaca JSON dari request body
app.use(express.static('public')); // supaya index.html bisa diload

app.post('/api/login', async (req, res) => {
  const { host, user, password } = req.body;

  const client = new MikroTikClient({
    host,
    user,
    password,
    port: 1209, // atau port API kamu
    debug: true
  });

  try {
    await client.connect();
    const response = await client.sendCommand(['/system/resource/print']);
    client.close();
    res.json({ success: true, resource: response });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
