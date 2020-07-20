const db = require('../../models');
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads/carImgs');
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


router.post('/',checkAuth,upload.single('carImg'),(req, res, next)=>{
    
    console.log(req.file);

if (req.body.carName == null||req.body.noPlate== null||req.userData.userId== null||req.body.description== null||!req.file) {
    res.status(404).json({message: 'Record can not be created. Missing data!'});
}else{
        db.car.create({
            carName: req.body.carName,
            noPlate:req.body.noPlate,
            mileage:req.body.mileage,
            userId:req.userData.userId,
            description:req.body.description,
            carImg:req.file.filename,
        })
        .then(result=>{
            console.log(result);
        res.status(201).json({
            message: 'Car created!',
            car:{
            carName: result.carName,
            noPlate:result.noPlate,
            userId:result.userId,
            description:result.description,
            carImg:{
                type:'GET',
                url: 'http://localhost:3000/carImg/'+result.carImg}
            }
        });
        }).catch(err =>{
            console.log(err);
        res.status(500).json({
            error:err
        });

        });
    
    }
});


router.get('/',checkAuth,(req,res,next)=>{

    db.car.findAll({
        attributes:['id','userId','carName','noPlate','description','mileage','rating','carImg'],
    })
    .then(result=>{
        const response = {
        count: result.length,
        cars : result.map(doc=>{
            return{
            id:doc.id,
            userId:doc.userId,
            carName:doc.carName,
            noPlate:doc.noPlate,
            description:doc.description,
            mileage:doc.mileage,
            rating:doc.rating,
            request:{
                type:'GET',
                url:'http://localhost:3000/carImg/'+doc.carImg
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


router.get('/:quantity',checkAuth,(req,res,next)=>{

    var num = req.params.quantity;
    if(num > 0){
    db.car.findAll({
        attributes:['id','userId','carName','noPlate','description','mileage','rating','carImg'],
        limit:parseInt(num),
    })
    .then(result=>{
        const response = {
        count: result.length,
        cars : result.map(doc=>{
            return{
            id:doc.id,
            userId:doc.userId,
            carName:doc.carName,
            noPlate:doc.noPlate,
            description:doc.description,
            mileage:doc.mileage,
            rating:doc.rating,
            request:{
                type:'GET',
                url:'http://localhost:3000/carImg/'+doc.carImg
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
}else if(num == 'myCars'){
    db.car.findAll({
        attributes:['id','userId','carName','noPlate','description','mileage','rating','carImg'],
        where:{ userId:req.userData.userId}
    })
    .then(result=>{
        const response = {
        count: result.length,
        cars : result.map(doc=>{
            return{
            id:doc.id,
            userId:doc.userId,
            carName:doc.carName,
            noPlate:doc.noPlate,
            description:doc.description,
            mileage:doc.mileage,
            rating:doc.rating,
            request:{
                type:'GET',
                url:'http://localhost:3000/carImg/'+doc.carImg
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
}else{
    res.status(500).json({
        message:'invalid quantity provided!'
    });
}
});


router.patch('/:carId',checkAuth,(req,res,next)=>{

    const id = req.params.carId;

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

    console.log(updateOps);
    db.car.update(updateOps,{
        where:{
            id:id,
            userId:req.userData.userId
        }})
        .then(car=>{

             if (car.length !=0) {
            console.log(updateOps);
        res.status(200).json({
            message:'car record updated succefully',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/car/'+id
            }
        });
        }else{
            res.status(404).json({message: 'No valid entry for the ID provided'}); 
        }
        })
        .catch(err=>{
            res.status(500).json({
                error:err,
                message:'error occurred while updating!'
            });
        });




});


router.delete('/:carId',checkAuth,(req,res,next)=>{

    const id = req.params.carId;
    db.car.destroy({
        where:{
            id:id,
            userId:req.userData.userId
        }})
        .then(result=>{
            res.status(200).json({
                result:result,
                message:'deleted successfully',
                request:{
                    type: 'GET',
                    url: 'http://localhost:3000/car/'
                }
            });
        })
        .catch(err=>{
            res.status(500).json({
                error:err,
                message:'error occurred while deleting!'
            });
        });


});

    
    





module.exports = router;

