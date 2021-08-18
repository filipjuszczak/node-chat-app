const users = [];

const addUser = function ({ id, username, room }) {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  if (!username || !room) {
    return { error: 'Username and room are required!' };
  }

  const userExists = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (userExists) {
    return { error: 'Username is in use!' };
  }

  const user = { id, username, room };
  users.push(user);

  return { user };
};

const removeUser = function (id) {
  const idx = users.findIndex((user) => user.id === id);

  if (idx !== -1) {
    return users.splice(idx, 1)[0];
  }
};

const getUser = function (id) {
  return users.find((user) => user.id === id);
};

const getUsersInRoom = function (room) {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};
