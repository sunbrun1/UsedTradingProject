const conn = require('../../config/db'); //db설정 호출
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");


/* 회원가입 모듈 */
exports.signup = async (req,res) =>{
	const { id, pw, pwCheck, email } = req.body;

	if(id.length < 6 || id.length > 13){ // ID 6~13자 체크
		return res.send("idLengthError")
	}
	if(pw.length < 6 || pw.length > 13){ // PW 6~13자 체크
		return res.send("pwLengthError") 
	}
	if(pw != pwCheck){ // PW 재확인 체크
		return res.send("pwCheckError") 
	}
	try{
		/* ID 중복체크 쿼리 */
		var [data] = await conn.query("SELECT count(*) AS count FROM member WHERE member_id = ?", id);
		const count = data[0].count;

		if(count > 0){ // 아이디 중복 
			return res.send("idCheckError") 
		}

		/* 회원가입 쿼리 */
		await conn.query("INSERT INTO member (member_id, member_pw, member_email, member_point) values(?, ?, ?, ?);",[id, pw, email, 0]);

		return res.send({success:true})
	}
	catch{
		return res.status(500).send(err)
	}
			

}

/* 로그인 모듈 */
exports.login = async (req,res) =>{
	const { id, pw } = req.body;

	if(id.length < 6 || id.length > 13){ // ID 6~13자 체크
		return res.send({success:false})
	}
	if(pw.length < 6 || pw.length > 13){ // PW 6~13자 체크
		return res.send({success:false})
	}
	try{
		/* DB에 저장되어있는 ID인지 확인하는 쿼리 */
		var [data] = await conn.query("SELECT member_id, member_pw FROM member WHERE member_id = ?", id);
		const memberId = data[0].member_id  // ID
		const memberPw = data[0].member_pw	// PW

		if(memberId.length < 1){ // 사용자가 입력한 ID가 DB에 없다면
			return res.send({success:false})
		}
		if(memberPw != pw){ // 비밀번호 확인
			return res.send({success:false})
		}

		const accessToken  = jwt.sign( //엑세스 토큰
			{
				member_id:id   // 토큰의 내용(payload)
			},
				secretObj.secret ,    // 비밀 키
			{
				expiresIn: '1m'    // 유효 시간은 20분
			}
		)
		const refreshToken  = jwt.sign( //리프레쉬 토큰
			{
				member_id:id   // 토큰의 내용(payload)
			},
				secretObj.secret ,    // 비밀 키
			{
				expiresIn: '14d'    // 유효 시간은 14일
			})
		/*	리프레쉬 토큰 DB저장 쿼리 */
		await conn.query("UPDATE member SET refreshtoken = ? WHERE member_id = ?;",[refreshToken, id]);

		res.cookie("accessToken", accessToken, {httpOnly: true});
		res.cookie("refreshToken", refreshToken, {httpOnly: true});

		return res.send({
			success:true,
			loginState:true
		})
	}
	catch{
		return res.status(500).send(err)
	}
}

/* 로그아웃 모듈 */
exports.logout = (req,res) =>{
	res.cookie("accessToken", '', {httpOnly: true,maxAge: 10});
	res.cookie("refreshToken", '', {httpOnly: true,maxAge: 10});

	return res.send({success:true})
}

/* 로그인여부 확인 모듈 */
exports.someAPI = async (req,res) =>{
	const { accessToken, refreshToken } = req.cookies;

	try{
		/* 엑세스토큰 없으면 false */
		if(accessToken == null){
			return res.send({success:false})
		}
	
		const decode = jwt.verify(accessToken, secretObj.secret); // 엑세스토큰 복호화
		const loginId = decode.member_id

		/* 엑세스토큰 복호화 못하면 false */
		if(!decode){
			return res.send({success:false})
		}
	
		return res.send({
			success:true,
			loginId:loginId
		})
		
	}
	/* 토큰 유효시간 만료 */
	catch(err){
		console.log("토큰 유효시간 만료")
		const decode = jwt.verify(refreshToken, secretObj.secret); // 리프레쉬 토큰 복호화
		const loginId = decode.member_id; // 로그인 ID

		/* 리프레시 토큰 조회 쿼리 */
		var [data] = await conn.query("SELECT refreshtoken FROM member WHERE member_id = ?", loginId);
		const DBrefreshToken = data[0].refreshtoken

		if(DBrefreshToken == refreshToken){
			const accessToken  = jwt.sign(
				{
					member_id:loginId  // 토큰의 내용(payload)
				},
					secretObj.secret ,    // 비밀 키
				{
					expiresIn: '1m'    // 유효 시간은 20분
				}
			)
			res.cookie("accessToken", accessToken, {httpOnly: true});
			
			return res.send({
				success:true,
				loginId:loginId
			})
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