const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// importing routes
const indexRoutes = require('./routes/routeIndex');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views/pages'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('public'));


// routes
app.use('/', indexRoutes);

// initialize
app.listen(app.get('port'), () => {
    console.log('Listening on port: ' + app.get('port'));
})
