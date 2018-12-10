// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Initialize variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Import routes
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var taskRoutes = require('./routes/task');
var searchRoutes = require('./routes/search');


// connection to the database
mongoose.connection.openUri('mongodb://localhost:27017/to-do-listDB', (err, res) => {

    if (err) throw err;

    console.log('Database: \x1b[36m%s\x1b[0m', 'online');

})


// Routes
app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/search', searchRoutes);
app.use('/', appRoutes);


// Listen to requests
app.listen(3000, () => {
    console.log('Express Server port 3000: \x1b[36m%s\x1b[0m', 'online');
})