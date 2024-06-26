const { User, validate } = require("../models/user.model");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const CONFIG = require("../config/config");
const helperObj = require("../helper/helper");

const get = async function (req, res) {
  let user_id = req.params.id;
  if (user_id == undefined) {
    User.fetchAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching the Users.",
        });
      else res.send(data);
    });
  } else {
    User.fetchOne({ user_id: user_id }, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching the User.",
        });
      else res.send(data);
    });
  }
};

const create1 = async function (req, res) {
  const body = req.body;
  console.log(body);
  // Validate request
  if (!body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const result = validate(body);
  // console.log(result.error);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(body.user_password, salt);
  body.user_password = hashed;

  // console.log(body);

  User.fetchOne({ user_email: body.user_email }, (err, data) => {
    console.log(data);
    console.log(err);
    if (err) {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while fetching the User.",
      });
    }

    if (data.length > 0) res.status(400).send("User already exist");
    else {
      const user = _.pick(body, [
        "user_email",
        "user_first_name",
        "user_last_name",
        "user_password",
        "user_phone",
      ]);
      //console.log("use"+user);
      // Save User in the database
      User.create(user, (err, data) => {
        console.log("1" + data);
        if (err) {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        } else {
          const payload = {
            user_id: data.user_id,
            user_email: data.user_email,
          };
          const token = helperObj.generateAuthToken(
            payload,
            CONFIG.jwt_encryption
          );
          res
            .header("x-auth-token", token)
            .send(_.pick(data, ["user_id", "user_email"]));
        }
      });
    }
  });
};
const update = async function (req, res) {
  console.log("Update", req);
  const body = req.body;
  // Validate request
  if (!body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const result = validate(body);
  // console.log(result.error);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(body.user_password, salt);
  body.user_password = hashed;

  // console.log(body);

  User.fetchOne({ user_email: body.user_email }, (err, data) => {
    //console.log(data);
    if (err) {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while fetching the User.",
      });
    }

    if (data.length > 0) {
      //res.status(400).send("User already exist");
      //else
      const user = _.pick(body, [
        "user_email",
        "user_first_name",
        "user_last_name",
        "user_password",
        "user_phone",
      ]);
      let query =
        "UPDATE user_details SET user_email = ?, user_first_name =?,user_last_name = ?, user_phone =?, .. WHERE user_id=?";

      // Save User in the database
      User.update(
        query,
        [
          user.user_email,
          user.user_first_name,
          user.user_last_name,
          user.user_email,
        ],
        (err, data) => {
          console.log(data);
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          else {
            console.log(data);
            //const payload = {user_id: data.user_id , user_email : data.user_email};
            //const token = helperObj.generateAuthToken(payload,CONFIG.jwt_encryption);
            //res.header('x-auth-token',token).send(_.pick(data,['user_id','user_email']));
          }
        }
      );
    }
  });
};
const create = async function (req, res) {
  const body = req.body;
  console.log(body);

  console.log(req.body.user_email);
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(body.user_password, salt);
  body.user_password = hashed;
  var selectQuery =
    "select count(*) as userCount from user_details where user_email= '" +
    req.body.user_email +
    "'";
  console.log(selectQuery);
  User.update(selectQuery)
    .then((result) => {
      let dataCount = JSON.parse(JSON.stringify(result))["0"]["userCount"];
      console.log(JSON.parse(JSON.stringify(result))["0"]["userCount"]);
      let insert =
        "INSERT INTO user_details (user_password, user_first_name, user_last_name, user_phone, user_email) VALUES ('" +
        req.body.user_password +
        "', '" +
        req.body.user_first_name +
        "', '" +
        req.body.user_last_name +
        "', '" +
        req.body.user_phone +
        "', '" +
        req.body.user_email +
        "')";
      if (dataCount === 0) {
        User.update(insert)
          .then((res1) => {
            console.log(res1);
            res.send({
              message: req.body.user_email + " sccuessfully registared ",
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.send({
          message: "User previously present",
        });
      }
    })
    .catch((err) => {
      // res.status(500).send({
      //   message:
      //     err.message || "Some error occurred while creating the User.",
      // });
    });
};

const updateUpdated = async function (req, res) {
  let parse_user_id = req.params.id;
  if (parse_user_id == undefined) {
    User.fetchAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching the Users.",
        });
      else res.send(data);
    });
  } else {
    User.fetchOne({ user_id: parse_user_id }, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching the User.",
        });
      }

      if (data.length > 0) {
        let query =
          "UPDATE user_details SET user_email = '" +
          req.body.user_email +
          "', user_first_name = '" +
          req.body.user_first_name +
          "',user_last_name = '" +
          req.body.user_last_name +
          "', user_phone ='" +
          req.body.user_phone +
          "'  WHERE user_id= " +
          parse_user_id;

        User.update(query)
          .then((result) => {
            console.log("Executed");
            res.send({
              message: "User updated",
              affectedRows: result.affectedRows,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
      }
    });
  }
};

const del = async function (req, res) {
  let parse_user_id = req.params.id;
  if (parse_user_id == undefined) {
    User.fetchAll((err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching the Users.",
        });
      else res.send(data);
    });
  } else {
    User.fetchOne({ user_id: parse_user_id }, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while fetching the User.",
        });
      }

      if (data.length > 0) {
        let query = "DELETE FROM user_details WHERE user_id= " + parse_user_id;
        User.update(query)
          .then((result) => {
            res.send({
              message: "User created",
              affectedRows: result.affectedRows,
            });
          })
          .catch((err) => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the User.",
            });
          });
      }
    });
  }
};

module.exports.del = del;
module.exports.get = get;
module.exports.create = create;
module.exports.update = update;
module.exports.updateUpdated = updateUpdated;
