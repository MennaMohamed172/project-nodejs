const express= require('express');
const { date } = require('joi');
// const { number } = require('joi');
const app= express();
const mongoose=require("mongoose");
app.use(express.json());

// DB connection

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

//Schema

const donationSchema = new mongoose.Schema({
    Name: {
      type: String,
      unique: true,
      required: true
    },
    DrugName: {
      type: String,
      required: true
    },
    ExpirationDate: {
        type: Date ,
        required: true,
        // default: function() {
        //     const now = new Date();
        //     return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        //   }
      },
      Quantity:{
        type: Number,
        required: true
      },
      Phone:{
        type: String,
        required: true
      },

      Address:{
        type: String,
      required: true
      }

  });
const donat=mongoose.model("donat",donationSchema);


// post fun

app.post("/donate" , async(req,res)=>{

    console.log("inside post fun");

    const data= new donat({
        Name:req.body.Name,
        DrugName:req.body.DrugName,
        ExpirationDate:req.body.ExpirationDate,
        Quantity:req.body.Quantity,
        Phone:req.body.Phone,
        Address:req.body.Address
        
    })
const val =await data.save();

res.send("Saved Data");
})

//  PUT
app.put("/donate/:userId",async(req,res)=>{
    
    let Name =req.body.Name;
    let DrugName=req.body.DrugName;
    let ExpirationDate=req.body.ExpirationDate;
    let Quantity=req.body.Quantity;
    let Phone=req.body.Phone;
    let Address=req.body.Address;
    // find id 
    // update

    donat.findOneAndUpdate({userId:req.params.userId},{$set:{Name:Name,DrugName:DrugName,ExpirationDate:ExpirationDate,Quantity:Quantity,Phone:Phone,Address:Address}},
        {new:true},(err,data)=>{

//  donat.findByIdAndUpdate(req.params.userId, req.body, { new: true }, (err, update) => {

            if (err){
                res.send("ERROR")
            }
            else{

        if(data==null){
            res.send("nothing found")
        }
        else{
            res.send(data)
        }
    }
    })
})

// GET

app.get('/donate', (req, res) => {
    donat.find((err, val) => {
      if (err) {
        console.log(err);
        res.status(500).send(`Error fetching users: ${err}`);
      } else {
        console.log(`Found ${val.length} val`);
        res.status(200).json(val);
      }
    });
  });



app.get('/donate/:userId', function(req,res){
// getid= req.params.id;

// donat.find(({id:getid}),function (err,val){
    donat.findById(req.params.userId, (err, val) => {

    if(err){
        res.send("ERROR")
    }

    else{

   if(val.length==0){
    res.send("data dose not found")
   }
else{
    res.send(val);
}
    }
})
})


// DELETE

app.delete('/donate/:userId' , function(req,res){

    // let delid=req.params.id;
    donat.findByIdAndRemove(req.params.userId, (err, docs) => {


    // donat.findOneAndDelete(({id:delid}),function(err,docs){

      if (err){
        res.send("ERROR")
      }
      else{

        if(docs==null){

            res.send("WRONG ID")
        }
        else{
            res.send(docs);
        }
    }
    
    })
})

app.listen(3000,()=>{
    console.log("listenning on port 3000")
})