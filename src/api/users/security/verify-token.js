var jwt = require('jsonwebtoken');
var config = require('../../config');
const User = require('../user-model');
 
function verifyToken(req, res) { 
  const token = req.headers['authorization'];
  
  let userId = ""
  if (!token)
    return -1;
   
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      userId = -2;
    } 
    else {
      userId = decoded.user;
    }
  });
  
  return userId;
}

module.exports = verifyToken;