var mongoose = require('mongoose');

var Schema = mongoose.Schema;
// create a schema
var toDoSchema = new Schema({
    id: String,
    title: String,
    completed: Boolean
}, {collection:"TodoList"});
// we need to create a model using it
var ToDo = mongoose.model('ToDo', toDoSchema);
module.exports= ToDo