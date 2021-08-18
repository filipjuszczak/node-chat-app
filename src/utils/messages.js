const generateMessage = function (username, text) {
  const now = new Date();

  return {
    username,
    message: text,
    createdAt: now.getTime(),
  };
};

const generateLocationMessage = function (username, coordsObj) {
  const { latitude, longitude } = coordsObj;
  const googleMapsUrl = `https://www.google.pl/maps?q=${latitude},${longitude}`;
  const now = new Date();

  return {
    username,
    url: googleMapsUrl,
    createdAt: now.getTime(),
  };
};

module.exports = { generateMessage, generateLocationMessage };
