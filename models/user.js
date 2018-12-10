var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// Create user data model
var userSchema = new Schema({
    name: { type: String, required: [true, 'The name is required'] },
    email: { type: String, unique: true, required: [true, 'The email is required'] },
    password: { type: String, required: [true, 'The password is required'] }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} should be unique' })


module.exports = mongoose.model('User', userSchema);