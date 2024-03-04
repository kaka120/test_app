'use strict';
// global.db = require("./index");
global.db = require("../dbconn/conn");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");
const { result } = require("lodash");

const User = {};

User.create = (newUser,result) => {
    db.ready(function(){
        db.table("user_details").save(newUser)
        .then((res) => {
            console.log("created user: ", { id: res.userId, ...newUser });
            result(null,{ user_id: res.userId,user_email:newUser.user_email});
            return;
        })
        .catch((err) => {
            if (err) 
            {
                result(err, null);
                return;
            }
        });
    });
};

User.fetchAll = (result) => {
    db.ready(function(){
        db.table("user_details").findAll()
        .then((res) => {
            //db_close();
            result(null,res);
            return;
        
        })
        .catch( (err) => {
            if (err) 
            {
                result(err,null);
                return;
            }
        })
    });
};

User.fetchOne = (criteria,result) => {
    db.ready(function(){
        db.table("user_details").find(criteria)
        .then((res) => {
            //console.log(res);
            result(null,res);
            return;
        })
        .catch( (err) => {
            if (err) 
            {
                result(err,null);
                return;
            }
        })   
    });
}

const complexityOptions = {
    min: 5,
    max: 100,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 3,
};

function validateUser(userObj){
    const UserSchema = Joi.object({
        user_first_name : Joi.string().required(),
        user_last_name  : Joi.string().required(),
        user_email : Joi.string().required().email(),
        user_phone : Joi.number().min(10),
        user_password: passwordComplexity(complexityOptions).required()

    });
    return UserSchema.validate(userObj);

};
User.delete = (criteria,result) => {
    console.log(criteria)
    db.ready(function(){
        db.table("user_details").delete(criteria)
        .then((res) => {
            console.log(res);
            result(null,res);
            return;
        })
        .catch( (err) => {
            if (err) 
            {
                console.log(err);
                result(err,null);
                return;
            }
        })   
    });
}

// User.update = (query, user, id, result) => {
//   console.log(query);
//   console.log(user);
//   console.log(id);

//   db.ready(function () {
//     new Promise((resolve, reject) => {
//       return db
//         .query(query, function (error, results) {
//           console.log(results);
//           resolve(results);
//         }).catch(err=>reject(err))
//     });
//   });
// };
User.update = (query) => {
  return new Promise((resolve, reject) => {
    return db.query(query, function (error, results) {
      console.log(results);
      if (!error) {
        resolve(results);
      } else {
        reject(error);
      }
    });
  });
};

module.exports.User = User;
module.exports.validate = validateUser;
