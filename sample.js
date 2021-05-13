
const  express = require('express');
const morgan = require('morgan')
const bcrypt = require('bcrypt');
//  @initialis express app
const app = express();
// port
const PORT =3000
//jason passer
app.use(express.json());
// logger
app.use(morgan('dev'));
// array where we will be keeping users
const users = [];
//@POST creat a user in array
app.post('/create',async(req,res)=>{
    const password = req.body.password
    const name = req.body.name
    const hash =  await hashPassword(password);
    const user = {
        name:name,
        password: hash
    }
    users.push(user);
});
// @POST login 
app.post('/login', async(req,res)=>{
     // user password from req
     const password = req.body.password
// hashed password from DB
const hash = users[0].password
 console.log(hash)
    const isValide = await comperPassword(password,hash)
        console.log(isValide);
    console.log(`passwors is ${isValide ? '':'not'} valide!!`)

    if(!isValide){
      console.log('true',isValide)
    }else{
        console.log('false',isValide);
    }

});

  // @GET all users in array
app.get('/users',(req,res)=>{
    res.status(200).json({
        success:true,
        msg: 'showing all the users in DB',
        count: users.length,
        data:users
    })
})


  //  # Hash password
const hashPassword = async (password,saltRounds = 10) =>{
    try {
       //Generate a salt
  const salt = await bcrypt.genSalt(saltRounds);
       // HashPassword & return it  
  return await bcrypt.hash(password,salt);
    } catch (error) {
        console.log(error);
    }
       // return null
       return null
}
 
//  # Comparing passwords
const comperPassword = async(password,hash) =>{

    try {
          //compare password
        return  await bcrypt.compare(password,hash);
    } catch (error) {
        console.log(error);
    }
    // if error  return false   
    return false     
}
      

// listening 
app.listen(PORT,console.log(`runing on prot ${PORT}`));