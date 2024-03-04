const express = require("express");
const app = express();
const CONFIG = require("./config/config");
const bodyParser = require("body-parser");
const v1 = require("./routes/v1");
var cors = require('cors')

// console.log("Environment:", CONFIG.app);
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/v1",v1);

if(!CONFIG.jwt_encryption) 
{
    console.log("FATAL ERROR : No JWT private key");
    process.exit(1);
}

app.listen(CONFIG.port,()=>{
    console.log(`Listenning on port ${CONFIG.port} ........`);
});