const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const MikroTikClient = require('./src/client'); // sesuaikan path kalau beda

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // agar index.html bisa diload

// ✅ Route API Login ke Mikrotik
app.post('/api/login', async (req, res) => {
  const { host, user, password } = req.body;

  const client = new MikroTikClient({
    host,
    user,
    password,
    port: 1209, // atau kamu pakai custom port
    debug: true
  });

  try {
    await client.connect();
    const response = await client.sendCommand(['/system/resource/print']);
    client.close();
    res.json({ success: true, resource: response[0] }); // hanya kirim object pertama
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
