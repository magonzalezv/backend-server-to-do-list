var express = require('express');

var app = express();

var User = require('../models/user');
var Task = require('../models/task');

// Search evaluating type of collection (Users or Tasks)
app.get('/colection/:table/:text', (req, res) => {

    var search = req.params.text;
    var table = req.params.table;
    var regex = new RegExp(search, 'i');

    var promise;

    switch (table) {
        case 'users':

            promise = searchUsers(search, regex);
            break;

        case 'tasks':
            console.log('Ok')
            promise = SearchTasks(search, regex);
            break;


        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'the types of search are: Users and tasks',
                error: { message: 'type table/collection are invalid' }
            });

    }
    promise.then(data => {
        res.status(200).json({
            ok: true,
            [table]: data
        });
    })


});

// General Search
app.get('/all/:text', (req, res, next) => {

    var search = req.params.text;
    var regex = new RegExp(search, 'i');

    Promise.all([
            searchUsers(search, regex),
            SearchTasks(search, regex)
        ])
        .then(responses => {
            res.status(200).json({
                ok: true,
                users: responses[0],
                tasks: responses[1],
            });
        });

});


// Search Users
function searchUsers(search, regex) {

    return new Promise((resolve, reject) => {
        User.find({}, 'name email')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, users) => {
                if (err) {
                    reject('Error loading users', err);
                } else {
                    resolve(users);
                }
            });
    });


}

// Search Tasks
function SearchTasks(search, regex) {

    return new Promise((resolve, reject) => {
        Task.find({})
            .populate('user')
            .or([{ 'name': regex }, { 'description': regex }])
            .exec((err, tasks) => {
                if (err) {
                    reject('Error loading tasks', err);
                } else {
                    resolve(tasks);
                    console.log(tasks);
                }
            });
    });


}

module.exports = app;