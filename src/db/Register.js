const  mongoose = require ('mongoose')
mongoose.set("strictQuery", false);

// mongoose.connect(process.env.MONGO_URL);
mongoose.connect("mongodb://127.0.0.1:27017/Register" ,{
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