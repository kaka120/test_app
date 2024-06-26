
require("dotenv").config();

let CONFIG = {}

CONFIG.app          = process.env.APP   || 'dev';
CONFIG.port         = process.env.PORT  || '3000';

CONFIG.db_dialect   = process.env.DB_DIALECT    || 'mysql';
CONFIG.db_host      = process.env.DB_HOST       || 'localhost';
CONFIG.db_port      = process.env.DB_PORT       || '3306';
CONFIG.db_name      = process.env.DB_NAME       || 'chikankari';
CONFIG.db_user      = process.env.DB_USER       || 'root';
CONFIG.db_password  = process.env.DB_PASSWORD   || '';


CONFIG.jwt_encryption  = process.env.JWT_ENCRYPTION || 'JWT';
CONFIG.jwt_expiration  = process.env.JWT_EXPIRATION || '10000';

CONFIG.uncaught_exception_handler = (err) => console.log('Unhandled exception ', err);


// console.log(CONFIG.db_host);

module.exports = CONFIG;
