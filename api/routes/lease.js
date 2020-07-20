const db = require('../../models');
const express = require('express');
const checkAuth = require('../middleware/check-auth');


const router = express.Router();


router.post('/',checkAuth,(req, res, next)=>{
    
        db.car.findAll({
            attributes:['id'],
            where:{
                userId:req.userData.userId
        }})
        .then(result=>{

            if(result.length !=0){
                var i = 0;
                var update = false;
              while(i<result.length){
                  if(req.body.carId==result[i].id){
                    update = true;
                  }
                  i++;
              }  
            if(update){
            db.lease.create({
                carId: req.body.carId,
                rate:req.body.rate,
                description:req.body.description
            })
            .then(result=>{
                console.log(result);
            res.status(201).json({
                message: 'lease created!',
                order: result
            });
            }).catch(err =>{
                console.log(err);
            res.status(500).json({
                error:err.errors
            });
    
            });
        }else{
            res.status(409).json({
                message:'You can not lease this car'
            })
        }
        
        }else{
            console.log(myCars.length)
            res.status(500).json({
                message:'Please add a car first :)'
            })
        }

        })
        .catch(err=>{
            return res.status(500).json({
                error:err
            })
        });   
});

router.get('/',checkAuth,(req,res,next)=>{

    

    db.lease.findAll({
        attributes:['id','carId','description','rate'],
        where:{isActive:1}
    }).then(result=>{
        const response = {
            count: result.length,
            lease : result.map(doc=>{
                return{
                id:doc.id,
                carId:doc.carId,
                description:doc.description,
                rate:doc.rate,
            }
            })
    
        };
    
        res.status(200).json(response);
    }).catch(err=>{
            res.status(500).json({
                error:err
            })
    })


});

router.patch('/:carId',checkAuth,(req,res,next)=>{
    const id = req.params.carId;


    db.car.findAll({
        attributes:['id'],
        where:{
            userId:req.userData.userId
    }})
    .then(result=>{
        if(result.length != 0){
            var i = 0;
                var update = false;
              while(i<result.length){
                  if(id==result[i].id){
                    update = true;
                  }
                  i++;
              }  
            if(update){

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
            
                db.lease.update(updateOps,{
                    where:{
                        id:id
                    }
                })
                .then(result=>{
                    if (result.length !=0) {
                        console.log(updateOps);
                    res.status(200).json({
                        message:'lease record updated succefully',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/lease/'
                        }
                    });
                    }else{
                        res.status(404).json({message: 'No valid entry for the ID provided'}); 
                    }
                })
                .catch(err=>{
                    res.status(400).json({error:err})

                });

            }else{res.status(401).json({message:'You are not authorized to perform this action :('})}
        }else{res.status(400).json({message:'Please add a car first :)'})}
    })
    .catch(err=>{
        res.status(400).json({error:err})
    });
    

});

router.delete('/:carId',checkAuth,(req,res,next)=>{
    const id = req.params.carId;
    db.car.findAll({
        attributes:['id'],
        where:{
            userId:req.userData.userId
    }})
    .then(result=>{
        if(result.length != 0){
            var i = 0;
                var del = false;
              while(i<result.length){
                  if(id==result[i].id){
                    del = true;
                  }
                  i++;
              }  
            if(del){

                db.lease.destroy({where:{carId:id}})
                .then(result=>{
                    if (result.length !=0) {
                    res.status(200).json({
                        message:'lease record deleted succefully',
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/lease/'
                        }
                    });
                    }else{
                        res.status(404).json({message: 'No valid entry for the ID provided'}); 
                    }
                })
                .catch(err=>{
                    res.status(400).json({error:err})

                });


            }else{res.status(401).json({message:'You are not authorized to perform this action :('})}
        }else{res.status(400).json({message:'Please add a car first :)'})}
    })
    .catch(err=>{
        res.status(400).json({error:err})
    });

})


module.exports = router;

