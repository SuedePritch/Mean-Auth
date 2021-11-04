const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const session = require('express-session')
const config = require('./config/database')

//Connect to Database
mongoose.connect(config.database, function(err){
    if(err){
        console.log('ERROR'+err);
    }else{
        console.log(`Connected to database`);
    }
});


const app= express();
const users = require('./routes/users');
const PORT = process.env.PORT || 8080;

//Passport Config

require('./config/passport')(passport);



//CORS
app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Passport Middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/users', users);

//Index Route
app.get('/', function(req,res, next){
    res.send('Invalid')
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
})

//Server Start
app.listen(PORT, ()=>{
    console.log('Server running on localhost:' + PORT);
});