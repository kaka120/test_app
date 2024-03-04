const Joi = require("joi");

const User = function(user){
    this.user_email = user.user_email,
    this.user_password = user.user_password
};

User.fetchOne = (criteria,result) => {
    db.ready(function(){
        db.table("user_details").find(criteria)
        .then((res) => {
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

function validateUser(userObj){
    const UserSchema = Joi.object({
        user_email : Joi.string().required().email(),
        user_password: Joi.string().required()

    });
    return UserSchema.validate(userObj);

}

module.exports.User = User;
module.exports.validate = validateUser;