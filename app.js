const express = require('express');
const app = express();
const morgan =  require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//carapp routes
const userRoutes = require('./api/routes/user');
const CarRoutes = require('./api/routes/car');
const LeaseRoutes = require('./api/routes/lease');
const rentRoutes = require('./api/routes/rent');


//console.log(process.env.MONGO_ATLAS_PW);
//connecting to MongoDB

//mongodb+srv://elton_test:'+process.env.MONGO_ATLAS_PW+'@cluster0.1nwst.mongodb.net/CARAPP?retryWrites=true&w=majority

// mongoose.connect('mongodb://127.0.0.1/Carapp',
// {useNewUrlParser: true,useUnifiedTopology: true});

//morgan route to monitor requests
app.use(morgan('dev'));
app.use('/userProfile',express.static('uploads/userProfiles'));
app.use('/carImg',express.static('uploads/carImgs'));


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//preventing CORS errors in the browser
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requesredd-With, Content-Type, Accept, Authorization"
    );
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});


//no6vf0gbshWFjXIh

// routes 
app.use('/carapp/api/v1/users',userRoutes);
app.use('/carapp/api/v1/car',CarRoutes);
app.use('/carapp/api/v1/lease',LeaseRoutes);
app.use('/carapp/api/v1/rent',rentRoutes);



app.use((req, res, next)=>{

    const error = new Error('Not found');
    error.status=404;
    next(error);
    
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
});

module.exports = app;