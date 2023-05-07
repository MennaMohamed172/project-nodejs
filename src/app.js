const express = require ('express')

     const app = express()

     const port = process.env.PORT || 3000


    require('./db/donation')
    // to parse automatically 
    app.use(express.json())

    const donateRouter = require("./routers/donation")
    app.use(donateRouter)

    require('./db/Register')

//     
app.use(express.json())
    const registerRouter = require("./routers/register")
    app.use(registerRouter)

///////////////////////////////////////////////////////

const productRouter = require("./routers/search")
    app.use(productRouter)


    app.listen( port , () => {console.log("All Done Successfully")})
