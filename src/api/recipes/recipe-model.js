/**
 * Arquivo: recipes-model.js
 * Author: Jacqueline Almeida
 * Descrição: arquivo responsável onde trataremos o modelo da classe 'Recipes'
 * obs.: http://mongoosejs.com/docs/schematypes.html
 */

 const mongoose = require('mongoose');

 const Schema = mongoose.Schema;
 
 const RecipeSchema = new Schema({
    userId: {
      type: String,
    }, 
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    preparation: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    }
 });
 
 module.exports = mongoose.model('Recipe', RecipeSchema);