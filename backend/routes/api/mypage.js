const db = require('../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");
var fs = require('fs');


/* 마이페이지-내게시물-초기화면 */
exports.myProduct = (req,res) => {
	let accessToken = req.cookies.accessToken; //엑세스 토큰
	let accessToken_decoded = jwt.verify(accessToken, secretObj.secret); //복호화
	let limit = parseInt(req.query.limit);
	let offset = parseInt(req.query.offset);
	if(req.query.no == null){
		conn.query("SELECT * FROM product WHERE member_id = ? ORDER BY id DESC LIMIT ? OFFSET ?;",[accessToken_decoded.member_id, limit, offset],(err,myProduct) => {
			if(err) throw err;
			res.send({
				success:true,
				myProduct:myProduct,
			})
		})
	}
	else{
		conn.query("SELECT * FROM product WHERE member_id = ? ORDER BY id DESC LIMIT ? OFFSET ?;",[accessToken_decoded.member_id, limit, offset],(err,myProduct) => {
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
	conn.query("SELECT image_name FROM product_image WHERE id = ?", req.body.id,(err,data) => {
		if(err) throw err;
		for(let i=0; i<data.length; i++){
			fs.unlink("./public/img/" + data[i].image_name, (err) => {
				if(err) throw err;
			})
		}
		conn.query("DELETE FROM product_image WHERE id = ?;", req.body.id ,(err) => {
			if(err) throw err;
			conn.query("Delete FROM product WHERE id = ?;", req.body.id ,(err) => {
				if(err) throw err;
				res.send({
					success:true,
				})
			})
		})
	})
}

/* 마이페이지-개인정보-비밀번호 재확인 */
exports.pwCheck = (req,res) => {
	console.log(req.body)
	let inputPw = req.body.pw;
	let accessToken = req.cookies.accessToken;
	let decode = jwt.verify(accessToken, secretObj.secret);
	let memberId = decode.member_id
	
	conn.query("SELECT member_pw FROM member WHERE member_id = ?", memberId, (err,data) =>{
		if(err) throw err;
		let memberPw = data[0].member_pw;
		if(inputPw == memberPw){
			res.send({success:true})
		}
		else{
			res.send({success:false})
		}
	})
}

/* 개인정보 조회 */
exports.getMemberInfo = (req,res) => {
	let accessToken = req.cookies.accessToken;
	let decode = jwt.verify(accessToken, secretObj.secret);
	let memberId = decode.member_id

	conn.query("SELECT member_email FROM member WHERE member_id = ?", memberId, (err,data) =>{
		if(err) throw err;
		let memberInfo = data[0];
		res.send({memberInfo:memberInfo})
	})
}

/* 개인정보 수정 */
exports.MemberInfoUpdate = (req,res) => {
	let body = req.body;
	console.log(body)
	let accessToken = req.cookies.accessToken;
	let decode = jwt.verify(accessToken, secretObj.secret);
	let memberId = decode.member_id

	if(body.currentPw != "" || body.newPw != "" || body.newPwCheck != ""){ // 비밀번호 변경 칸에 값이 들어온 경우
		console.log("비밀번호 수정 O")
		conn.query("SELECT member_pw FROM member WHERE member_id = ?", memberId, (err,data) => {
			if(err) throw err;
			let memberPw = data[0].member_pw;
			console.log("현재비밀번호: " + body.currentPw)
			console.log("현재비밀번호: " + memberPw)
			if(body.currentPw == memberPw){ // 현재 비밀번호 체크
				if(body.newPw.length > 5){ // 새로운 비밀번호 길이 체크
					if(body.newPw == body.newPwCheck){ // 새로운 비밀번호 재확인 체크
						conn.query("UPDATE member SET member_pw = ? WHERE member_id = ?;", [body.newPw, memberId], (err,data) => {
							if(err) throw err;
							conn.query("UPDATE member SET member_email = ? WHERE member_id = ?;", [body.email, memberId], (err,data) => {
								if(err) throw err;
								res.send({changePw:true})
								
							})
						})
					}
					else{
						res.send("newPwCheckError") // 새로운 비밀번호 체크 에러
					}
				}
				else{
					res.send("newPwLengthError") // 새로운 비밀번호 길이 에러
				}
			}
			else{
				res.send("currentPwCheckError") // 현재 비밀번호 체크 에러
			}
		})
	}
	else{ // 비밀번호를 수정하지않고 개인정보만 수정한 경우
		console.log("비밀번호 수정 x")
		conn.query("UPDATE member SET member_email = ? WHERE member_id = ?;", [body.email, memberId], (err,data) => {
			if(err) throw err;
			res.send({changePw:false})
		})
	}
}


