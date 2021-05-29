const mysql = require('mysql2/promise');

const dbInfo = {    //db정보 객체로 설정
    host:'localhost'
    ,user:'root'
    ,password:'1234'
    ,database:'testdb'
  }

const pool = mysql.createPool(dbInfo)
  
module.exports = pool
