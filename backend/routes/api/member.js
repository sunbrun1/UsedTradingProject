const conn = require('../../config/db'); //db설정 호출
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");


/* 회원가입 모듈 */
exports.signup = async (req,res) =>{
	const body = req.body;
	let inputId = body.id; // 입력한 ID
	let inputPw = body.pw; // 입력한 PW
	let inputPwCheck = body.pwCheck // 입력한 PW check
	let inputEmail = body.email; // 입력한 Email

	if(inputId.length > 5){ // ID 길이 체크
		if(inputPw.length > 5){ // PW 길이 체크
			if(inputPw == inputPwCheck){ // PW 재확인 체크
				let [data] = await conn.query("SELECT count(*) AS count FROM member WHERE member_id = ?", inputId);
				let count = data[0].count;
				if(count < 1){ // 아이디 중복 체크
					await conn.query("INSERT INTO member (member_id, member_pw, member_email, member_point) values(?, ?, ?);",[inputId, inputPw, inputEmail, 0]);
					res.send({
						success:true
					})
				}
				else{
					res.send("idCheckError") // ID 중복
				}
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
exports.login = async (req,res) =>{
	let inputId = req.body.id // 입력한 ID
	let inputPw = req.body.pw // 입력한 PW


	if(inputId.length > 5){ // ID 길이 체크
		if(inputPw.length > 5){ // PW 길이 체크
			let [memberInfo] = await conn.query("SELECT member_id, member_pw FROM member WHERE member_id = ?", inputId);
			let memberId = memberInfo[0].member_id
			let memberPw = memberInfo[0].member_pw
			if(memberId.length < 1){ // 사용자가 입력한 ID가 DB에 없다면
				res.send({success:false})
			}
			else if(memberPw === inputPw){ // 비밀번호 확인
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
				await conn.query("UPDATE member SET refreshtoken = ? WHERE member_id = ?;",[refreshToken,inputId]);
				res.cookie("accessToken", accessToken, {httpOnly: true});
				res.cookie("refreshToken", refreshToken, {httpOnly: true});
				res.send({
					success:true,
					loginState:true
				})
			}	
			else{
				res.send({success:false})
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

/* 로그아웃 모듈 */
exports.logout = (req,res) =>{
	res.cookie("accessToken", '', {httpOnly: true,maxAge: 10});
	res.cookie("refreshToken", '', {httpOnly: true,maxAge: 10});
	res.send({success:true})
}

/* 로그인여부 확인 모듈 */
exports.someAPI = async (req,res) =>{
	let accessToken = req.cookies.accessToken;
	let refreshToken = req.cookies.refreshToken;
	try{
		if(accessToken != null ){
			let decode = jwt.verify(accessToken, secretObj.secret);
			if(decode){
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
		let decode = jwt.verify(refreshToken, secretObj.secret);
		let [data] = await conn.query("SELECT refreshtoken FROM member WHERE member_id = ?", decode.member_id);
		if(data[0].refreshtoken == refreshToken){
			let accessToken  = jwt.sign(
				{
					member_id:decode.member_id  // 토큰의 내용(payload)
				},
					secretObj.secret ,    // 비밀 키
				{
					expiresIn: '1m'    // 유효 시간은 20분
				}
			)
			res.cookie("accessToken", accessToken, {httpOnly: true});
			res.send({success:true})
		}
	
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