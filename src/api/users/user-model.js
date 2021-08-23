/**
 * Arquivo: users-model.js
 * Author: Jacqueline Almeida
 * Descrição: arquivo responsável onde trataremos o modelo da classe 'Users'
 * obs.: http://mongoosejs.com/docs/schematypes.html
 */

 const mongoose = require('mongoose');

 const Schema = mongoose.Schema;
 
 const UserSchema = new Schema({
     name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function validator(v) {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(v);
            },
        },
        required: true,
    },
     password: {
        type: String,
        required: true,
      },
     role: {
        type: String,
        required: true,
        default: 'user',
      },
 });
 
 module.exports = mongoose.model('User', UserSchema);