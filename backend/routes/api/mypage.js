const db = require('../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");


/* 마이페이지-내게시물-초기화면 */
exports.myProduct = (req,res) => {
	let accessToken = req.cookies.accessToken;
	let accessToken_decoded = jwt.verify(accessToken, secretObj.secret);
	let limit = parseInt(req.query.limit);
	let offset = parseInt(req.query.offset);
	if(req.query.no == null){
		conn.query("SELECT * FROM product ORDERS WHERE member_id = ? LIMIT ? OFFSET ?;",
		[accessToken_decoded.member_id, limit, offset] ,
		(err,myProduct) => {
			if(err) throw err;
			res.send({
				success:true,
				myProduct:myProduct,
			})
		})
	}
	else{
		conn.query("SELECT * FROM product ORDERS WHERE member_id = ? LIMIT ? OFFSET ?;",
		[accessToken_decoded.member_id, limit, offset] ,
		(err,myProduct) => {
			if(err) throw err;
			res.send({
				success:true,
				myProduct:myProduct,
			})
		})
	}
}

exports.myProductCount = (req,res) => {
	let accessToken = req.cookies.accessToken;
	let accessToken_decoded = jwt.verify(accessToken, secretObj.secret);
	conn.query("SELECT COUNT(*) AS count FROM product WHERE member_id = ?;", accessToken_decoded.member_id, (err, data) => {
		if(err) throw err;
		res.send({
			success:true,
			count:data
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
