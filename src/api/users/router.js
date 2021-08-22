const router = require('express').Router();
const User = require('./user-model');

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

  router.post('/users', createUser);

  module.exports = router;