'use strict';

const CONFIG = require("../config/config");
const mysql      = require('mysql');

let connection = "";
if(!connection){
  connection = mysql.createConnection({
    host     : CONFIG.db_host,
    user     : CONFIG.db_user,
    password : CONFIG.db_password,
    database : CONFIG.db_name
  });
}

 
const wrapper = require('node-mysql-wrapper'); 
const db = wrapper.wrap(connection);
 
module.exports = db;






