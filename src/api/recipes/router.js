const router = require('express').Router();
const Recipe = require('./recipe-model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const jwt_secret = require('../config');
const verifyToken = require('../users/security/verify-token');
const User = require('../users/user-model');

// Multer
const multer  = require('multer')
// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: function (request, file, cb) {
      cb(null, '../uploads/')
  },
  filename: function (request, file, cb) {
      // Extração da extensão do arquivo original:
      const extensaoArquivo = file.originalname.split('.')[1];

      // Cria um código randômico que será o nome do arquivo
      const novoNomeArquivo = request.params.id

      // Indica o novo nome do arquivo:
      cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
  }
});

const upload = multer({ storage });

function createRecipe(request, response) { 
  const recipe = new Recipe();

  userId = verifyToken(request, response)
 
  if (userId != -1) {
    User.findById(userId, function(error, user){
      if (user) {
        recipe.userId = userId;
        recipe.name = request.body.name; 
        recipe.ingredients = request.body.ingredients;
        recipe.preparation = request.body.preparation;
        
        recipe.save(function saveRecipe(error) { 
          if (error) { 
            return response.status(400).send({ message: 'Invalid entries. Try again.' });
          }
            
          return response.status(201).send({ recipe });
        });
      }
      else {
        return response.status(400).send({ message: 'Invalid entries. Try again.' });
      }
    });
  }
  else {
    return response.status(401).send({ message: 'jwt malformed' });
  }  
}

function listRecipes(request, response) {
  Recipe.find({}, function (error, recipes) { response.status(200).send({ recipes }); }); 
}

function getRecipe(request, response){
  let id = request.params.id
  
  Recipe.findById(id, function (error, recipe) { 
    if (!recipe){
      return response.status(404).send({ message: "recipe not found" });
    }
    response.status(200).send({ recipe });
  });
}

function editRecipe(request, response){
  let id = request.params.id
  userId = verifyToken(request, response)
  if (userId == -1) {
    return response.status(401).send({ message: 'missing auth token' });
  }
  else if (userId == -2){
    return response.status(401).send({ message: 'jwt malformed' });
  }
  else {
    Recipe.findById(id, function (error, recipe) {
      if (!recipe)
        return response.status(404).send({ message: "recipe not found" });
      else {
        User.findById(userId, function (error, user) {
          if(user.id == recipe.userId || user.role == "admin") {
            recipe.name = request.body.name; 
            recipe.ingredients = request.body.ingredients;
            recipe.preparation = request.body.preparation;

            recipe.save(function(error) {
              if (error)
                console.log('error')
              else
                response.status(200).send({ recipe });
            });
          }
          else {
            return response.status(401).send({ message: 'unauthorized' });
          }
        });
      }
    });
  }
}

function deleteRecipe(request, response){
  let id = request.params.id
  userId = verifyToken(request, response)
  if (userId == -1) {
    return response.status(401).send({ message: 'missing auth token' });
  }
  else if (userId == -2){
    return response.status(401).send({ message: 'jwt malformed' });
  }
  else {
    Recipe.findById(id, function (error, recipe) {
      if (!recipe)
        return response.status(404).send({ message: "recipe not found" });
      else {
        User.findById(userId, function (error, user) {
          if(user.id == recipe.userId || user.role == "admin") {
            
            Recipe.findByIdAndRemove(id, function(error) {
              if (error)
                console.log('error')
              else
                response.sendStatus(204);
            });
          }
          else {
            return response.status(401).send({ message: 'unauthorized' });
          }
        });
      }
    });
  }
}

function addImageToRecipe (request, response){
  baseUrlImage = "localhost:3000/scr/uploads/"
  let id = request.params.id
  userId = verifyToken(request, response)
  if (userId == -1) {
    return response.status(401).send({ message: 'missing auth token' });
  }
  else if (userId == -2){
    return response.status(401).send({ message: 'jwt malformed' });
  }
  else {
    Recipe.findById(id, function (error, recipe) {
      if (!recipe)
        return response.status(404).send({ message: "recipe not found" });
      else {
        User.findById(userId, function (error, user) {
          if(user.id == recipe.userId || user.role == "admin") {
            recipe.image = baseUrlImage+request.file.filename

            recipe.save(function(error) {
              if (error)
                console.log('error')
              else
                response.status(200).send({ recipe });
            });
          }
          else {
            return response.status(401).send({ message: 'unauthorized' });
          }
        });
      }
    });
  }
}

function getImage (request, response){
  let id_da_receita = request.params.id_da_receita
  response.render("localhost:3000/scr/uploads/"+id_da_receita+".jpeg")
}

router.post('/recipes', createRecipe);
router.get('/recipes', listRecipes);
router.get('/recipes/:id', getRecipe);
router.put('/recipes/:id', editRecipe);
router.delete('/recipes/:id', deleteRecipe);
router.put('/recipes/:id/image/', upload.single('image'), addImageToRecipe);
router.get('/images/:id_da_receita', getImage);

module.exports = router; 