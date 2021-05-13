const express = require('express');
const morgan = require('morgan');
const bcrypt = require('bcrypt');
//  @initialis express app
const app = express();
// port
const PORT = 3000
//jason passer
app.use(express.json())

// logger
app.use(morgan('dev'));
// array where we will be keeping users
const users = []

//@POST creat a user in array
app.post('/create', async(req,res)=>{
    const name = req.body.name
    const password = req.body.password
    const hashedPassword = await hashPassword(password);
    const user = {
        name: name,
        password: hashedPassword
    }
    users.push(user);

})

// @POST login 
app.post('/login',async(req,res)=>{
     // user password from req
    const  password = req.body.password;
   // hashed password from DB
   hash = users[1].password;
  // console.log(hashedPassword)
try{
   const validatPassword = await comperPassword(password,hash);

  if( !validatPassword == false){
    return res.status(400).json({
         success: false,
         msg: `password is ${!validatPassword ? 'not' : ''} valid!`
     })
    }else{
        res.status(200).json({
            success: true,
            msg: `password is ${!validatPassword ? 'not': ''} valid!`
          });
    }
}catch(error){
     console.log(error);
  }
  
})

// @GET all users in array
app.get('/users',(req,res)=>{
    res.status(200).json({
        success:true,
        msg: 'showing all users',
        count: users.length,
        data: users
    })
})



//  # Hash password
const hashPassword = async (password,saltRounds = 10)=>{
     try {
         //Generate a salt
         const salt = await bcrypt.genSalt(saltRounds)
         // HashPassword & return it
         return await bcrypt.hash(password,salt);
     } catch (error) {
         console.log(error);
     }
     // return null
     return null
}

//  # Comparing passwords
const comperPassword = async (password,DbHashedPassword) => {
    try {
        //compare password
     return   await bcrypt.compare(password,DbHashedPassword)
    } catch (error) {
        console.log(error)
    }
    // if error  return false
    return false
}
// @listening
app.listen(PORT,console.log(`server runing on port:${PORT}`));


