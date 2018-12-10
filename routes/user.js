var express = require('express');
// Encrypt password
var bcrypt = require('bcryptjs');

var app = express();

// Import User data model
var User = require('../models/user');


//  GET all Users
app.get('/', (req, res, next) => {
    var since = req.query.since || 0;
    since = Number(since);


    User.find({}, 'name email')
        .skip(since)
        .limit(10)
        .exec(
            (err, users) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error loading users',
                        errors: err
                    });
                }

                User.count({}, (err, counting) => {
                    res.status(200).json({
                        ok: true,
                        users,
                        total: counting
                    });
                });



            })


});


// Create new User
app.post('/', (req, res) => {
    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10)
    });

    user.save((err, SavedUser) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error when creating user',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            user: SavedUser
        });

    });
});


// Update an User
app.put('/:id', (req, res) => {

    var id = req.params.id;
    var body = req.body

    User.findById(id, (err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error searching user',
                errors: err
            });
        }

        if (!user) {
            return res.status(404).json({
                ok: false,
                mensaje: 'The user with the id: ' + id + 'does not exist',
                errors: { message: 'No user with this ID' }

            });
        }

        user.name = body.name;
        user.email = body.email;
        user.password = body.password;

        user.save((err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error updating user',
                    errors: err
                });
            }

            updatedUser.password = ':)';

            res.status(200).json({
                ok: true,
                user: updatedUser
            });

        });

    });
});


// Delete an User by Id
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    User.findByIdAndRemove(id, (err, RemovedUser) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error deleting user',
                errors: err
            });
        }

        if (!RemovedUser) {
            return res.status(400).json({
                ok: false,
                mensaje: 'There is not an user whith that id',
                errors: { message: 'There is not an user whith that id' }
            });
        }

        res.status(200).json({
            ok: true,
            user: RemovedUser
        });

    });

});


module.exports = app;