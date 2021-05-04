const db = require('../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");


/* 회원가입 모듈 */
exports.signup = (req,res) =>{
	const body = req.body;
	if(body.id.length < 6 ){
		res.send("idLengthError")
	}else{
		if(body.pw.length < 6){
			res.send("pwLengthError")
		}else{
			if(body.pw != body.pwCheck){
				res.send("pwCheckError")
			}else{
				conn.query("SELECT * FROM member WHERE member_id = ?", body.id, (err,data) =>{
					if(data.length > 0){
						res.send("idCheckError")
					}
					else{
						conn.query("INSERT INTO member (member_id, pw, email) values(?, ?, ?);",[body.id, body.pw, body.email],(err,data) => {
							if(err){
								throw err;
							}else{
								res.send({
									success:true
								})
							}
						});	
					}
				})
			}
		}
	}
}

/* 로그인 모듈 */
exports.login = (req,res) =>{
	var body = req.body;
	let accessToken  = jwt.sign(
		{
			member_id:body.id   // 토큰의 내용(payload)
		},
			secretObj.secret ,    // 비밀 키
		{
			expiresIn: '20m'    // 유효 시간은 20분
		}
	)
	let refreshToken  = jwt.sign(
		{
			member_id:body.id   // 토큰의 내용(payload)
		},
			secretObj.secret ,    // 비밀 키
		{
			expiresIn: '14d'    // 유효 시간은 5분
		})
	conn.query("SELECT pw FROM member WHERE member_id = ?", body.id, (err,data) =>{
		if(data.length < 1){ //사용자가 입력한 id가 DB에 없다면
			res.send({success:false})
		}
		else if(data[0].pw === body.pw){ //비밀번호 재확인 체크
			conn.query("UPDATE member SET refreshtoken = ? WHERE member_id = ?;",[refreshToken,body.id],
			(err,data) => { //쿼리 실행
				if(err){
				    throw err;
				}
				else{
					res.cookie("accessToken", accessToken, {httpOnly: true});
					res.cookie("refreshToken", refreshToken, {httpOnly: true});
					res.send({
						success:true,
						loginState:true
					})
				}
			});	
		}
		else{
			res.send({success:false})
		}
	})                                     
}

/* 로그아웃 모듈 */
exports.logout = (req,res) =>{
	res.cookie("accessToken", '', {httpOnly: true,maxAge: 1000});
	res.cookie("refreshToken", '', {httpOnly: true,maxAge: 1000});
	res.send({success:true})
}

/* 로그인여부 확인 모듈 */
exports.someAPI = (req,res) =>{
	let accessToken = req.cookies.accessToken;
	let refreshToken = req.cookies.refreshToken;
	try{
		if(accessToken != null ){
			let accessToken_decoded = jwt.verify(accessToken, secretObj.secret);
			if(accessToken_decoded){
				res.send({success:true})
			}
			else{
				res.send({success:false})
			}
		}
		else{
			res.send({success:false})
		}
	}
	catch(err){
		let refreshToken_decoded = jwt.verify(refreshToken, secretObj.secret);
		conn.query("SELECT refreshtoken FROM member WHERE member_id = ?", refreshToken_decoded.member_id ,(err,data) => {
			if(data[0].refreshtoken == refreshToken){
				let accessToken  = jwt.sign(
					{
						member_id:refreshToken_decoded.member_id  // 토큰의 내용(payload)
					},
						secretObj.secret ,    // 비밀 키
					{
						expiresIn: '20m'    // 유효 시간은 1분
					}
				)
				res.cookie("accessToken", accessToken, {httpOnly: true});
				res.send({success:true})
			}
		})
	}
}
/* 초기 로그인/회원가입 버튼 렌더링 */
exports.loginStatusCheck = (req,res) => {
	let accessToken = req.cookies.accessToken;
	if(accessToken != null){
		res.send({success:true})
	}
	else{
		res.send({success:false})
	}
}