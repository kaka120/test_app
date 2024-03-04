const {User,validate} = require("../models/auth.model");
const bcrypt = require('bcrypt');
const CONFIG = require("../config/config");
const helperObj = require("../helper/helper");

// console.log(typeof(helperObj.generateAuthToken));

const login = async function(req,res){
    const body = req.body;
    const result = validate(body);
    // console.log(result.error);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // Validate request
    if (!body) {
        res.status(400).send({
        message: "Content can not be empty!"
        });
    }


    User.fetchOne({user_email : body.user_email}, async (err,data) => {
        // console.log(data);
        if (err){
            res.status(500).send({
                message:
                err.message || "Some error occurred while fetching the User."
                });
        } 

        if(data.length == 0) res.status(400).end("Invalid email or password");

        else if(data.length > 0) {
            const validatePassword = await bcrypt.compare(body.user_password,data[0].userPassword);
            if(!validatePassword) res.status(400).end("Invalid email or password");
        }
        const payload = {user_id: data[0].userId , user_email : data[0].userEmail};
        const token = helperObj.generateAuthToken(payload,CONFIG.jwt_encryption);
        //res.end(token);
        res.status(200).send({message: { auth : true, token : token }})
    })
    
};


module.exports.login = login;
