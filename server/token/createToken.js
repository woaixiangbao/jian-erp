const jwt = require('jsonwebtoken');

module.exports = (userId) => {
  const token = jwt.sign(
    {
      userId,
    },
    'jian1984',
    {
      expiresIn: '60s',
    },
  );
  return token;
};
