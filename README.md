# mikrotik-lite-node

Lite Node.js library to communicate with MikroTik RouterOS via API port (8728).

## 🧱 Struktur Dasar Library
```pgsql
mikrotik-lite-node/
├── src/
│   ├── client.js         # TCP client handler
│   ├── login.js          # Login logic (challenge-response)
│   ├── command.js        # Command encode/decode logic
│   └── menus/
│       ├── hotspot.js    # Abstraksi per menu
│       └── ...           
├── index.js              # Main API
├── package.json
```

## Features
- Lightweight & modular
- New Login Method v6+ - v7
- Send commands and parse basic responses

## Example
```js
const MikroTikClient = require('./index');

(async () => {
  const api = new MikroTikClient({
    host: '192.168.88.1',
    user: 'admin',
    password: ''
  });

  await api.connect();
  const data = await api.sendCommand(['/ip/hotspot/user/print']);
  console.log(data);
  api.close();
})();
```
