const mysql2 = require("mysql2");

const DB = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "wintersummer"
})


module.exports = DB