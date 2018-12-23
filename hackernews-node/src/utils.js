const jwt = require('jsonwebtoken');
const APP_SECRET = 'GraphQL-is-aw3some'; // should be an environment variable (.env)

function getUserId(request) {
  const Authorization = request.get('Authorization');

  if (!Authorization)
    throw new Error('Not authenticated');

  const token = Authorization.replace('Bearer ', '');
  const { userId } = jwt.verify(token, APP_SECRET);
  return userId;
}

module.exports = {
  APP_SECRET,
  getUserId,
}
