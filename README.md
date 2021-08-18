# A Node.js/Express/Socket.io chat app.

**Features:**

- user can:
  - provide their nickname,
  - name of chat room they want to join,
- app checks for potential username duplication; it does not allow two users with the same nickname in one chat room,
- messages are filtered by profanity filter; no bad words are allowed,
- container storing messages auto-scrolls (this behavior can be overwritten by intentional scrolling up to view older messages),
- list of active chatters is displayed on the left-hand side of the page; it is updated every time user joins or leaves chat room.
