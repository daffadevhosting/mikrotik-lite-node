module.exports = function loginPlain(socket, user, password, debug = false) {
  return new Promise((resolve, reject) => {
    function log(...args) {
      if (debug) console.log('[LOGIN DEBUG]', ...args);
    }

    const commands = [
      '/login',
      '=name=' + user,
      '=password=' + password
    ];

    const encode = require('./command').encodeSentence;
    const buffer = encode(commands);

    socket.write(buffer);

    let response = '';

    socket.once('data', (data) => {
      response += data.toString();

      if (response.includes('!done')) {
        log('Login success!');
        resolve();
      } else if (response.includes('!trap') || response.includes('!fatal')) {
        log('Login failed:', response);
        reject(new Error('Login gagal. Cek username/password.'));
      } else {
        log('Login unexpected response:', response);
        reject(new Error('Login response tidak dikenali.'));
      }
    });

    socket.once('error', (err) => {
      reject(err);
    });
  });
};
