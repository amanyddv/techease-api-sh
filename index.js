const connectDB = require("./db/index.js");
const  app =require('./app.js')
const dotenv =require('dotenv')
dotenv.config({
    path: './.env'
})



connectDB()
    .then(() => {
        const PORT = 8000;
        app.listen(PORT, () => {
            console.log(`⚙️ Server is running at port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    });