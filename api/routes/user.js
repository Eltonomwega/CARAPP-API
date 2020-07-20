const db = require('../../models');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/userProfiles');
    },
    filename: function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
});

const fileFilter = (req, file,cb)=>{
        if(file.mimetype === 'image/jpeg'||file.mimetype === 'image/png'){
            cb(null,true);
        }else{
            cb(null,false);
        }
};

const upload = multer({storage:storage,limits:{
    fileSize:1024*1024*10
},
fileFilter:fileFilter
});



const router = express.Router();
    


router.post('/signup',upload.single('userImg'),(req, res, next)=>{
    
    console.log(req.file);

    if (req.body.user_name == null ||req.body.location == null||req.body.email== null|| !req.file) {
        res.status(404).json({message: 'Record can not be created. Missing data!'});
    }else{
        bcrypt.hash(req.body.password,10,(err,hash)=>{

            if (err) {
            return res.status(500).json({
                error:err
            });
            }else{
                console.log(hash);
                db.user.create({
                    user_name: req.body.user_name,
                    location:req.body.location,
                    rating:req.body.rating,
                    email:req.body.email,
                    userImg:req.file.filename,
                    password: hash
                })
                .then(result=>{
                    console.log(result);
                res.status(201).json({
                    message: 'User created!',
                    user: result
                });
                }).catch(err =>{
                    console.log(err);
                res.status(500).json({
                    error:err.errors
                });
        
                });  
            }
        });        
    }

});


router.post('/login',(req,res,next)=>{

        db.user.findOne({ where: { email:req.body.email } })
        .then(user=>{
            if (user.length < 1) {
                return res.status(401).json({
                    message:'Auth failed. Check if either email or password is correct'
                });
            }else{
                bcrypt.compare((req.body.password).toString(), user.password, (err,result)=>{
                    
                    if (err) {
                        return res.status(401).json({
                            message:'Auth failed. Check if either email or password is correct'
                        }); 
                    }
                    if (result) {
                        console.log(user);
                        const token = jwt.sign(
                            {
                                email:user.email,
                                name:user.user_name,
                                userId:user.id,
                                rating:user.rating,
                                isAdmin:user.isAdmin
                            },
                             "qwerty1234",
                            {
                                expiresIn: "2 days"
                            }
                        );
                        console.log(user);
                        return res.status(200).json({
                            message:'Auth was successful',
                            token: token
                        });
                    }
                    else{
                        return res.status(401).json({
                            message:'Auth failed. Check if either email or password is correct'
                        });
                    }
                });
            }
        })
        .catch(err =>{
            console.log("here "+ req.body.email);
            res.status(500).json({
                message:'Auth failed. Check if either email or password is correct'
            });
        });

});

router.get('/',checkAuth,(req,res,next)=>{

    db.user.findAll({
        attributes:['id','user_name','email','rating','userImg','location']
    })
    .then(result=>{
        const response = {
        count: result.length,
        users : result.map(doc=>{
            return{
            id:doc.id,
            name:doc.user_name,
            email:doc.email,
            rating:doc.rating,
            location:doc.location,
            isAdmin:doc.isAdmin,
            request:{
                type:'GET',
                url:'http://localhost:3000/userProfile/'+doc.userImg
            }
        }
        })

    };

    res.status(200).json(response);

    })
    .catch(err=>{
        console.log("here"+ err);
        res.status(500).json({
            error:err
        });
    });
});


router.get('/:userId',checkAuth,(req,res,next)=>{
        const id = req.params.userId;

        db.user.findOne({where:{id:id}})
        .then(user=>{
                res.status(200).json({
                    name:user.user_name,
                    email:user.email,
                    location:user.location,
                    rating:user.rating,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/userProfile/'+user.userImg
                    }
                })

        })
        .catch(err=>{

                res.status(500).json({
                    error:err
                })
        });


});

router.patch('/:userId',checkAdmin,(req,res,next)=>{
    const id = req.params.userId;
        //adding functionality to update one or multiple items
        const updateOps = {};
        for (const ops of req.body){
            updateOps[ops.propName] = ops.value;
        }
        /* end*/

    // [
    //     {"propName":"Name","value":"Elton omwega"},
    //     {"propName":"year","value":"2"},
    //     {"propName":"email","value":"elton.ombogi@strathmore.edu"},
    //     {"propName":"address","value":"Nairobi 2543"}
    // ]

    db.user.update(updateOps,{where:{id:id}})
    .then(result =>{
        if (result.length !=0) {
            console.log(updateOps);
        res.status(200).json({
            message:'user record updated succefully',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/users/'+id
            }
        });
        }else{
            res.status(404).json({message: 'No valid entry for the ID provided'}); 
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err,
            message:'updated was not successful!'});
    });
})

router.delete('/:userId',checkAdmin,(req,res,next)=>{
        const id = req.params.userId;

        db.user.destroy({where:{id:id}})
        .then(result=>{
            res.status(200).json({
                result:result,
                message:'deleted successfully',
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/users/'
                }
            });
        })
        .catch(err=>{

        });

});

module.exports = router;

