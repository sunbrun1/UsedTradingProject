const db = require('../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");


/* 회원가입 모듈 */
exports.signup = (req,res) =>{
	const body = req.body;
	let inputId = body.id; // 입력한 ID
	let inputPw = body.pw; // 입력한 PW
	let inputPwCheck = body.pwCheck // 입력한 PW check
	let inputEmail = body.email; // 입력한 Email

	if(inputId.length > 5){ // ID 길이 체크
		if(inputPw.length > 5){ // PW 길이 체크
			if(inputPw == inputPwCheck){ // PW 재확인 체크
				conn.query("SELECT * FROM member WHERE member_id = ?", inputId, (err,data) =>{
					if(err) throw err;
					if(data.length < 1){ // 아이디 중복 체크
						conn.query("INSERT INTO member (member_id, member_pw, member_email) values(?, ?, ?);",[inputId, inputPw, inputEmail],(err) => {
							if(err) throw err;
							res.send({
								success:true
							})
						});	
					}
					else{
						res.send("idCheckError") // ID 중복
					}
				})
			}
			else{
				res.send("pwCheckError") // PW 재확인 에러
			}
		}
		else{
			res.send("pwLengthError") // PW 길이 에러
		}
	}
	else{
		res.send("idLengthError") // ID 길이 에러
	}
}

/* 로그인 모듈 */
exports.login = (req,res) =>{
	let body = req.body;
	let inputId = body.id // 입력한 ID
	let inputPw = body.pw // 입력한 ID
	let accessToken  = jwt.sign( //엑세스 토큰
		{
			member_id:inputId   // 토큰의 내용(payload)
		},
			secretObj.secret ,    // 비밀 키
		{
			expiresIn: '1m'    // 유효 시간은 20분
		}
	)
	let refreshToken  = jwt.sign( //리프레쉬 토큰
		{
			member_id:inputId   // 토큰의 내용(payload)
		},
			secretObj.secret ,    // 비밀 키
		{
			expiresIn: '14d'    // 유효 시간은 14일
		})
	conn.query("SELECT member_id, member_pw FROM member WHERE member_id = ?", inputId, (err,data) =>{
		if(err) throw err;
		let memberPw = data[0].member_pw
		let memberId = data[0].member_id
		if(memberId.length < 1){ // 사용자가 입력한 ID가 DB에 없다면
			res.send({success:false})
		}
		else if(memberPw === inputPw){ // 비밀번호 확인
			conn.query("UPDATE member SET refreshtoken = ? WHERE member_id = ?;",[refreshToken,inputId],(err) => { //쿼리 실행
				if(err) throw err;
				res.cookie("accessToken", accessToken, {httpOnly: true});
				res.cookie("refreshToken", refreshToken, {httpOnly: true});
				res.send({
					success:true,
					loginState:true
				})
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
						expiresIn: '1m'    // 유효 시간은 20분
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