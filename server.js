const express =require('express')
const path = require('path')
const bodyParser= require('body-parser') 
const mongoose= require('mongoose')
const User = require('./model/user')
const Participant = require('./model/participant')
const Winner = require('./model/winner')
const Prize = require('./model/prize')
const bcrypt =require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/login-app-db',
	{useNewUrlParser:true,useUnifiedTopology:true,useCreatedIndex:true})

const app = express()
app.use('/', express.static(path.join(__dirname,'static')))
app.use(bodyParser.json())



app.get('/api/today',async (req,res)=>{
     
     const DATE=req.query.DATE;
     const prize=await Prize.find({DATE});
     return res.json({'prize':prize}); 
}) 



 app.post('/api/winner',async (req,res)=>{
     
     const {DATE}=req.body
     //console.log(DATE)

    const wi = await Winner.find({DATE})
    const pa = await Participant.find({DATE})
    const pr = await Prize.find({DATE})

    //console.log('winner') 
    //console.log(wi)
    //console.log('participant')
    //console.log(pa)
    //console.log('prize')
    //console.log(pr) 

    if(wi.length==0)
    {
     
     if(pa.length===0)
      {
        
         if(pr.length===0)	
         {
      	return res.json({winner:'no body participate',prize:'to be declared'})
         }
         else
        {
       return res.json({winner:'no body participate',prize:pr[0]['prize']})	
         }

      } 
      else
      {
       
        var x=pa.length;
        var y=Math.floor((Math.random()*x*10+10)); 
        y=y%x;

        const winner=pa[y]['username'];	


         try{const response = await Winner.create({
       winner,DATE
        })
         if(pr.length===0)	
         {
      	return res.json({winner:pa[y]['username'],prize:'to be declared'})
         }
      else
         {
       return res.json({winner:pa[y]['username'],prize:pr[0]['prize']})	
         }

      }catch(error)
      {
          if(error.code===11000)
          {
        	return res.json({status:'error',error:'something goes wrong'})
          }	
         throw error
        }
      
      }	


    } 
    else
    {
      if(pr.length===0)	
      {
      	return res.json({winner:wi[0]['winner'],prize:'to be declared'})
      }
      else
      {
       return res.json({winner:wi[0]['winner'],prize:pr[0]['prize']})	
      }

    }	
    
     res.json({status: 'ok'})
})




 app.post('/api/rewarde',async (req,res)=>{
     
     const {prize,DATE}=req.body
     //console.log(prize)
     //console.log(DATE)
     const v = await Prize.find({DATE});

     if(v.length>0)
     {
     	return res.json({status:'error',error:'prize has been set'});
     } 
     

    try{
     const response = await Prize.create({
       prize,DATE
     })
      res.json({status: 'ok'})

    }catch(error)
     {
        if(error.code===11000)
        {
        	return res.json({status:'error',error:'something goes wrong'})
        }	
       throw error
     }

     res.json({status: 'ok'})
}) 

 

 app.post('/api/luckydraw',async (req,res)=>{

     console.log(req.body)
     const {username,DATE }=req.body
     
    const user = await Participant.find({username,DATE})

    console.log(user)

    if(user.length>0)
    {
      	return res.json({status:'error',error:'you have already participated'})
    }


     try{
     const response = await Participant.create({
       username,DATE
     })
       console.log('you have register for today\'s lucky draw' ,response)
    }catch(error)
     {
        if(error.code===11000)
        {
        	return res.json({status:'error',error:'somethingselse'})
        }	
       throw error
     }

     res.json({status: 'ok'})
}) 






app.post('/api/login',async (req,res)=>{

        const {username,password}=req.body

        const user = await User.findOne({username}).lean()
        
        if(!user)
        {
        	return res.json({status:'error',error:'Invalid username or passowrd'})
        }

        if(await bcrypt.compare(password,user.password))
        {
            return res.json({status:'ok',data:''})
        }
       return res.json({status:'error',error:'Invalid username or passowrd'})
})




 

 app.post('/api/register',async (req,res)=>{
     console.log(req.body)
     const {username,password:plainTextPassword }=req.body

    if(username.length==0 || plainTextPassword.length==0)
    {
     return res.json({status:'error',error:'username or passowrd not valid'})

    }

    	

     
     const password = await bcrypt.hash(plainTextPassword,5)
    
    try{
     const response = await User.create({
       username,
       password
     })
       console.log('first time i created user',response)
    }catch(error)
     {
        if(error.code===11000)
        {
        	return res.json({status:'error',error:'Username already in use please enter different username'})
        }	
       throw error
     }

     res.json({status: 'ok'})

}) 


app.listen(9999,()=>{
        console.log('abhi hi karenge 9999')
})