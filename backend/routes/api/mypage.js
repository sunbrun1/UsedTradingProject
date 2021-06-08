const conn = require('../../config/db'); //db설정 호출
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");
var fs = require('fs');


/* 마이페이지-내게시물-초기화면 */
exports.myProduct = async (req,res) => {
	let accessToken = req.cookies.accessToken; //엑세스 토큰
	let accessToken_decoded = jwt.verify(accessToken, secretObj.secret); //복호화
	let limit = parseInt(req.query.limit);
	let offset = parseInt(req.query.offset);

	if(req.query.no == null){
		/* 내 게시물 조회 쿼리 */
		let [myProduct] = await conn.query("SELECT * FROM product WHERE member_id = ? ORDER BY id DESC LIMIT ? OFFSET ?;",[accessToken_decoded.member_id, limit, offset]);
		res.send({
			success:true,
			myProduct:myProduct,
		})

	}
	else{
		/* 내 게시물 조회 쿼리 */
		let [myProduct] = await conn.query("SELECT * FROM product WHERE member_id = ? ORDER BY id DESC LIMIT ? OFFSET ?;",[accessToken_decoded.member_id, limit, offset]);
		res.send({
			success:true,
			myProduct:myProduct,
		})
	
	}
}

/* 마이페이지-관심목록 */
exports.getWishList = async (req,res) => {
	console.log("성공")
	let accessToken = req.cookies.accessToken; //엑세스 토큰
	let decode = jwt.verify(accessToken, secretObj.secret); //복호화
	let loginId = decode.member_id
	console.log(loginId)
	let limit = parseInt(req.query.limit);
	let offset = parseInt(req.query.offset);
	let [wishList] = await conn.query("SELECT A.dibs_no, A.member_id, A.product_no, B.thumbnail, B.title, B.price, B.area, B.dibs, B.date " +  
									 "FROM dibs_list AS A " +
									 "LEFT OUTER JOIN product AS B ON (A.product_no = B.id) " +
									 "WHERE A.member_id = ? " +
									 "ORDER BY A.dibs_no DESC LIMIT ? OFFSET ?;",
									 [loginId, limit, offset]);
	res.send({
		success:true,
		wishList:wishList,
	})
}
/* 내포인트 조회  */
exports.getPoint = async (req,res) => {
	let accessToken = req.cookies.accessToken; //엑세스 토큰
	let decode = jwt.verify(accessToken, secretObj.secret); //복호화
	let loginId = decode.member_id // 로그인 ID
	console.log(loginId)
	let [memberInfo] = await conn.query("SELECT member_id, member_email, member_point FROM member WHERE member_id = ?", loginId);

	res.send({
		success:true,
		memberInfo:memberInfo,
	})
}

/* 마이페이지/내게시물 삭제 */
exports.myProductDelete = async (req,res) => {
	let [data] = await conn.query("SELECT image_name FROM product_image WHERE id = ?", req.body.id);
	/* 실제 이미지파일 삭제 */
	for(let i=0; i<data.length; i++){
		fs.unlink("./public/img/" + data[i].image_name, (err) => {
			if(err) throw err;
		})
	}

	/* 상품이미지 DB 삭제 쿼리 */
	await conn.query("DELETE FROM product_image WHERE id = ?;", req.body.id);
	/* 상품 DB 삭제 쿼리 */
	await conn.query("DELETE FROM product WHERE id = ?;", req.body.id);

	res.send({
		success:true,
	})
}

/* 마이페이지-개인정보-비밀번호 재확인 */
exports.pwCheck = async (req,res) => {
	let inputPw = req.body.pw;
	let accessToken = req.cookies.accessToken;
	let decode = jwt.verify(accessToken, secretObj.secret);
	let memberId = decode.member_id
	
	/* 패스워드 찾기 쿼리 */
	let [data] = await conn.query("SELECT member_pw FROM member WHERE member_id = ?", memberId);
	let memberPw = data[0].member_pw;
	if(inputPw == memberPw){
		res.send({success:true})
	}
	else{
		res.send({success:false})
	}

}

/* 개인정보 조회 */
exports.getMemberInfo = async (req,res) => {
	let accessToken = req.cookies.accessToken;
	let decode = jwt.verify(accessToken, secretObj.secret);
	let memberId = decode.member_id

	/* 이메일 조회 쿼리 */
	let [data] = await conn.query("SELECT member_email FROM member WHERE member_id = ?", memberId);
	let memberInfo = data[0];
	res.send({memberInfo:memberInfo})

}

/* 개인정보 수정 */
exports.MemberInfoUpdate = async (req,res) => {
	let body = req.body;
	let accessToken = req.cookies.accessToken;
	let decode = jwt.verify(accessToken, secretObj.secret);
	let memberId = decode.member_id

	if(body.currentPw != "" || body.newPw != "" || body.newPwCheck != ""){ // 비밀번호 변경 칸에 값이 들어온 경우
		console.log("비밀번호 수정 O")

		/* 패스워드 조회 쿼리 */
		let [data] = await conn.query("SELECT member_pw FROM member WHERE member_id = ?", memberId);
		let memberPw = data[0].member_pw;

		if(body.currentPw == memberPw){ // 현재 비밀번호 체크
			if(body.newPw.length > 5){ // 새로운 비밀번호 길이 체크
				if(body.newPw == body.newPwCheck){ // 새로운 비밀번호 재확인 체크
					/* 비밀번호 변경 쿼리 */
					await conn.query("UPDATE member SET member_pw = ? WHERE member_id = ?;", [body.newPw, memberId]);
					/* 이메일 변경 쿼리 */
					await conn.query("UPDATE member SET member_email = ? WHERE member_id = ?;", [body.email, memberId]);
					res.send({changePw:true})
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
	}
	else{ // 비밀번호를 수정하지않고 개인정보만 수정한 경우
		console.log("비밀번호 수정 x")

		/* 이메일 변경 쿼리 */
		await conn.query("UPDATE member SET member_email = ? WHERE member_id = ?;", [body.email, memberId]);

		res.send({changePw:false})
	
	}
}


