const express = require('express')
require('./db/mongoose.js')
const userRouter=require('./routers/user.js')
const taskRouter=require('./routers/task')

const app = express();
const PORT = process.env.PORT;


//express medileware to check auth

//maintainence middleware
// app.use((req,res,next)=>{
//     res.status(503).send('Site under maintainence now')
// })


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)



app.listen(PORT, () => {
    console.log('server is on port', PORT);
})


