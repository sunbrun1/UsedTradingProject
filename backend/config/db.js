const mysql = require('mysql');

const dbInfo = {    //db정보 객체로 설정
    host:'localhost'
    ,user:'root'
    ,password:'1234'
    ,database:'testdb'
  }

  let dbcon = {
	init:function() {
		return mysql.createConnection(dbInfo);
	},
	conn:function(con) {
		con.connect(function(err){
			if(err) {
				console.log("mysql connection error :"+err);
				setTimeout(init, 2000);

			} else {
				console.log("mysql connection sucessfully");
			}
		})
	}
}
module.exports = dbcon; //모듈 등록