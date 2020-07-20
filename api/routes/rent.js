const db = require('../../models');
const express = require('express');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.post('/',checkAuth,(req, res, next)=>{
    
        db.rent.create({
            carId: req.body.carId,
            clientId:req.userData.userId,
            durationHours:req.body.durationHours,
        })
        .then(result=>{
            console.log(result);
        res.status(201).json({
            message: 'rent record created!',
            order: result
        });
        }).catch(err =>{
            console.log(err);
        res.status(500).json({
            error:err
        });

        });
    

});


module.exports = router;

