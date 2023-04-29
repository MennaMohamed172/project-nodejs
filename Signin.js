const mongoose = require('mongoose');
const express= require('express');
const app= express();
const validator = require ('validator')
app.use(express.json())

const port = process.env.PORT || 3000

mongoose.connect("mongodb://127.0.0.1:27017/donation" ,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},(err)=>{
     if(!err){
        console.log("connected to db")
     }
     else{
        console.log("ERROR")
     }
})

mongoose.set("strictQuery", false);

// mongoose.connect(process.env.MONGODB_URL);


const loginSchema = new mongoose.Schema({
  email : {
    type: String,
    required: true,
    trim: true,
    lowercase : true,
    unique: true,
    validate(val){
        if(!validator.isEmail(val)){
            throw new Error ('Email is INVALID')
        }
    }
},
  password: {
    type: String,
    required: true,
    trim: true
  }
});


const Login=mongoose.model("login",loginSchema);

module.exports = Login;


app.post('/users', async(req,res) => {
  const {  email, password } = req.body;
  const newUser = new Login({email, password });

  newUser.save((err, savedUser) => {
    if (err) {
      console.log(err);
      res.status(500).send(`Error creating user: ${err}`);
    } else {
      console.log(`Login created: ${savedUser}`);
      res.status(201).json(savedUser);
    }
  });
})

app.get('/users', async(req,res) => {
    Login.find((err, users) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error fetching users: ${err}`);
      } else {
        console.log(`Found ${users.length} users`);
        res.status(200).json(users);
      }
    });
  });
  
  app.get('/users/:userId',async(req,res) => {
    Login.findById(req.params.userId, (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error fetching user: ${err}`);
      } else if (!user) {
        res.status(404).send(`Login with id ${req.params.userId} not found`);
      } else {
        console.log(`Found user: ${user}`);
        res.status(200).json(user);
      }
    });
  });

  app.put('/users/:userId', async(req,res) => {
    Login.findByIdAndUpdate(req.params.userId, req.body, { new: true }, (err, updatedUser) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error updating user: ${err}`);
      } else if (!updatedUser) {
        res.status(404).send(`Login with id ${req.params.userId} not found`);
      } else {
        res.send(`Updated user: ${updatedUser}`);
        res.status(200).json(updatedUser);
      }
    });
  });



  app.delete('/users/:userId', async(req,res) => {
    Login.findByIdAndRemove(req.params.userId, (err, deletedUser) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error deleting user: ${err}`);
      } else if (!deletedUser) {
        res.status(404).send(`Login with id ${req.params.userId} not found`);
      } else {
        res.send("Successfully deleted");
        res.status(204).end();
      }
    });
  });



  app.listen(port, () => {
    console.log(` app listening on port ${port}`)
    })