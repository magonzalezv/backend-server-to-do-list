var express = require('express');


var app = express();

// Import Task data model
var Task = require('../models/task');


//  GET all Tasks
app.get('/', (req, res, next) => {

    Task.find({})
        .populate('user')
        .exec(
            (err, tasks) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error loading tasks',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    tasks
                });

            })


});


// Create new Task
app.post('/', (req, res) => {
    var body = req.body;

    var task = new Task({
        name: body.name,
        description: body.description,
        user: body.userID,
        status: body.status
    });

    task.save((err, SavedTask) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error when creating task',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            task: SavedTask
        });

    });
});


//Get a task
app.get('/:id', (req, res) => {

    var id = req.params.id;

    Task.findById(id)
        .populate('user')
        .exec((err, task) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error searching task',
                    errors: err
                });
            }

            if (!task) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'The task with the id: ' + id + 'does not exist',
                    errors: { message: 'No task with this ID' }

                });
            }

            res.status(200).json({
                ok: true,
                task: task
            });

        });

});

// Update an Task
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body

    Task.findById(id, (err, task) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error searching task',
                errors: err
            });
        }

        if (!task) {
            return res.status(404).json({
                ok: false,
                mensaje: 'The task with the id: ' + id + 'does not exist',
                errors: { message: 'No task with this ID' }

            });
        }

        task.name = body.name;
        task.description = body.description;
        task.user = body.userID;
        task.status = body.status;

        task.save((err, updatedTask) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error updating task',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                task: updatedTask
            });

        });

    });
});


module.exports = app;