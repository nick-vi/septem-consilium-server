const jwt = require('jsonwebtoken')

module.exports.auth = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1]
  if (!token) return res.status(401).send('Access denied. No token provided.')

  try {
    req.user = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    const { bodyUserId } = req.body
    const { queryUserId } = req.params
    const { sub: _userId } = req.user

    if ((bodyUserId && _userId !== bodyUserId) || (queryUserId && _userId !== queryUserId)) {
      res.status(403).send('Unauthorized token.')
      return
    }

    next()
  } catch (ex) {
    res.status(400).send('Invalid token.')
  }
}
