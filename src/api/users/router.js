const router = require('express').Router();
const User = require('./user-model');
const jwt = require('jsonwebtoken');
const config = require('../config');

function createUser(request, response) { 
  const user = new User();
  user.name = request.body.name; 
  user.email = request.body.email;
  user.password = request.body.password;

  user.save(function saveUser(error) { 
    if (error) { 
      if (error.name === 'MongoError' && error.code === 11000) {
        return response.status(409).send({ message: 'Email already registered' });
      }  
      
      return response.status(400).send({ message: 'Invalid entries. Try again.' });
    }
      
    response.status(201).send({ user });
  });
}

function login(request, response) {
  if (request.body.email == null || request.body.password == null){
    return response.status(401).send({ message: 'All fields must be filled' });
  }
  
  User.findOne({email: request.body.email, password: request.body.password}, function(error, user){
    if (!user) {
      return response.status(401).send({ message: 'Incorrect username or password' });
    }
    const payload = { user: user._id }
    const token = jwt.sign(payload, config.secret);
    response.status(200).send({ token })
  });
}

router.post('/users', createUser);
router.post('/login', login)

module.exports = router;