// src/menus/hotspot.js

module.exports = (client) => ({
  listUsers: () => client.send(['/ip/hotspot/user/print']),

  addUser: ({ name, password, profile }) => {
    const command = [
      '/ip/hotspot/user/add',
      `=name=${name}`,
      `=password=${password}`,
      `=profile=${profile}`
    ];
    return client.send(command);
  },

  removeUser: (id) => {
    const command = [
      '/ip/hotspot/user/remove',
      `=.id=${id}`
    ];
    return client.send(command);
  },

  enableUser: (id) => {
    const command = [
      '/ip/hotspot/user/enable',
      `=.id=${id}`
    ];
    return client.send(command);
  },

  disableUser: (id) => {
    const command = [
      '/ip/hotspot/user/disable',
      `=.id=${id}`
    ];
    return client.send(command);
  }
});
