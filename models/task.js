var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Create task data model
var taskSchema = new Schema({
    name: { type: String, required: [true, 'The name is required'] },
    description: { type: String, required: [true, 'The description is required'] },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, required: [true, 'The status is required'] }
}, { collection: 'tasks' });

module.exports = mongoose.model('Task', taskSchema);