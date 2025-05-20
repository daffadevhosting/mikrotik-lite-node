const net = require('net');
const { encodeSentence } = require('./command');
const login = require('./login');
const { parseResponse } = require('./parser');


class MikroTikClient {
  constructor(options) {
    this.host = options.host;
    this.user = options.user;
    this.password = options.password;
    this.port = options.port || 1209; // default port API MikroTik
    this.debug = options.debug || false;
    this.socket = null;
  }

  log(...args) {
    if (this.debug) {
      console.log('[MikroTikClient DEBUG]', ...args);
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new net.Socket();

      this.socket.setTimeout(5000); // 5 detik timeout

      this.socket.on('timeout', () => {
        this.log('Connection timeout');
        this.socket.destroy();
        reject(new Error('Connection timeout'));
      });

      this.socket.on('error', (err) => {
        this.log('Socket error:', err.message);
        reject(err);
      });

      this.socket.connect(this.port, this.host, () => {
        this.log(`Connected to ${this.host}:${this.port}`);
        login(this.socket, this.user, this.password, this.debug)
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }

	sendCommand(commands) {
	  return new Promise((resolve, reject) => {
		const buffer = encodeSentence(commands);
		this.socket.write(buffer);

		let response = Buffer.alloc(0);

		const onData = (chunk) => {
		  response = Buffer.concat([response, chunk]);

		  if (response.includes(Buffer.from('!done'))) {
			this.socket.removeListener('data', onData);
			this.log('Command response (raw):', response.toString());

			const parsed = parseResponse(response);
			this.log('Command response (parsed):', parsed);

			resolve(parsed);
		  }
		};

		this.socket.on('data', onData);

		this.socket.once('error', (err) => {
		  reject(err);
		});
	  });
	}

  close() {
    if (this.socket) {
      this.socket.end();
      this.log('Connection closed');
    }
  }
}

module.exports = MikroTikClient;
