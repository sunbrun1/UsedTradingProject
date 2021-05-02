const db = require('../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");

/* 마이페이지/내게시물 */
exports.myProduct = (req,res) => {
	let accessToken = req.cookies.accessToken;
	let accessToken_decoded = jwt.verify(accessToken, secretObj.secret);
	conn.query("SELECT * FROM product WHERE member_id = ? ORDER BY id DESC;", accessToken_decoded.member_id ,(err,myProduct) => {
		if(err) throw err;
		res.send({
			success:true,
			myProduct:myProduct,
		})
	})
}

/* 마이페이지/내게시물 삭제 */
exports.myProductDelete = (req,res) => {
	conn.query("DELETE FROM product_image WHERE id = ?;", req.body.id ,(err) => {
		if(err) throw err;
		conn.query("Delete FROM product WHERE id = ?;", req.body.id ,(err) => {
			if(err) throw err;
			res.send({
				success:true,
			})
		})
	})
	
}
