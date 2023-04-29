const mongoose = require('mongoose');
const express= require('express');
const app= express();
const validator = require ('validator')
app.use(express.json())
var crypto = require('crypto');
mongoose.set("strictQuery", false);

// mongoose.connect(process.env.MONGO_URL);

mongoose.connect("mongodb://127.0.0.1:27017/reg" ,{
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


const userSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true
  },
  LastName: {
    type: String,
    required: true
  },
  Email : {
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
  Password: {
    type: String,
    required: true,
    trim: true
  },
  ConfirmPassword: {
    type: String,
    required: true,
    trim: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;



app.post('/register', (req, res) => {
  const { FirstName,LastName, Email, Password ,ConfirmPassword } = req.body;
  const newUser = new User({FirstName,LastName, Email, Password ,ConfirmPassword });

  newUser.save((err, savedUser) => {
    if (err) {
      console.log(err);
      res.status(500).send(`Error creating user: ${err}`);
    } else {
      console.log(`User created: ${savedUser}`);
      res.status(201).json(savedUser);
    }
  });
})

app.get('/register', (req, res) => {
    User.find((err, users) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error fetching users: ${err}`);
      } else {
        console.log(`Found ${users.length} users`);
        res.status(200).json(users);
      }
    });
  });
  
  app.get('/register/:userId', (req, res) => {
    User.findById(req.params.userId, (err, user) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error fetching user: ${err}`);
      } else if (!user) {
        res.status(404).send(`User with id ${req.params.userId} not found`);
      } else {
        console.log(`Found user: ${user}`);
        res.status(200).json(user);
      }
    });
  });

  app.put('/register/:userId', (req, res) => {
    User.findByIdAndUpdate(req.params.userId, req.body, { new: true }, (err, updatedUser) => {
      
      if (err) {
        console.log(err);
        res.status(500).send(`Error updating user: ${err}`);
      } else if (!updatedUser) {
        res.status(404).send(`User with id ${req.params.userId} not found`);
      } else {
        console.log(`Updated user: ${updatedUser}`);
        res.status(200).json(updatedUser);
      }
    });
  });


  app.delete('/register/:userId', (req, res) => {
    User.findByIdAndRemove(req.params.userId, (err, deletedUser) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error deleting user: ${err}`);
      } else if (!deletedUser) {
        res.status(404).send(`User with id ${req.params.userId} not found`);
      } else {
        console.log(`Deleted user with id ${deletedUser._id}`);
        // res.send("deleted successfully")
        res.status(204).end();
      }
    });
  });



  app.listen(3000,()=>{
    console.log("listenning on port 3000")
})