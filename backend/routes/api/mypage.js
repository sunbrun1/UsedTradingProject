const conn = require('../../config/db'); //db설정 호출
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");
var fs = require('fs');


/* 마이페이지-내게시물-초기화면 */
exports.getMyProduct = async (req,res) => {
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const loginId = decode.member_id; // 로그인 ID
	/* req.query */
	const {limit, offset} = req.query;

	/* 내 게시물 조회 쿼리 */
	const [productInfo] = await conn.query("SELECT * FROM product " +  
										  "WHERE member_id = ? " +
										  "ORDER BY id DESC LIMIT ? OFFSET ?;", 
										  [loginId, parseInt(limit), parseInt(offset)]);

	return res.send({
		success:true,
		productInfo:productInfo,
	})
}
/* 거래상태 */
exports.getTransactionStatus = async (req,res) => {
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const loginId = decode.member_id; // 로그인 ID

	/* 거래상태 조회 */
	const [productInfo] = await conn.query("SELECT A.product_no, A.seller_id, A.buyer_id, B.thumbnail, B.title, B.price, B.date, B.dibs, B.area FROM payment_info AS A " +
											"LEFT OUTER JOIN product AS B ON (A.product_no = B.id) " +
											"WHERE A.seller_id = ? OR A.buyer_id = ?;",
										    [loginId, loginId]);
	let transactionStatus = [];
	for(let i=0; i<productInfo.length; i++){
		if(productInfo[i].seller_id == loginId){
			transactionStatus.push("판매중");
		}
		else{
			transactionStatus.push("구매중");
		}
	}
	return res.send({
		success:true,
		productInfo:productInfo,
		transactionStatus:transactionStatus
	})
}
/* 마이페이지-관심목록 */
exports.getWishList = async (req,res) => {
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const loginId = decode.member_id; // 로그인 ID
	/* req.query */
	const {limit, offset} = req.query

	/* 관심목록 리스트 조회 쿼리 */
	const [wishList] = await conn.query("SELECT A.dibs_no, A.member_id, A.product_no, B.thumbnail, B.title, B.price, B.area, B.dibs, B.date " +  
									 "FROM dibs_list AS A " +
									 "LEFT OUTER JOIN product AS B ON (A.product_no = B.id) " +
									 "WHERE A.member_id = ? " +
									 "ORDER BY A.dibs_no DESC LIMIT ? OFFSET ?;", [loginId, parseInt(limit), parseInt(offset)]);
	return res.send({
		success:true,
		wishList:wishList,
	})
}
/* 내포인트 조회  */
exports.getPoint = async (req,res) => {
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const loginId = decode.member_id; // 로그인 ID

	/* 포인트 조회 쿼리 */
	const [memberInfo] = await conn.query("SELECT member_id, member_email, member_point FROM member WHERE member_id = ?", loginId);

	return res.send({
		success:true,
		memberInfo:memberInfo,
	})
}

/* 마이페이지/내게시물 삭제 */
exports.myProductDelete = async (req,res) => {
	/* req.query */
	const { id } = req.body;

	/*  */
	var [data] = await conn.query("SELECT image_name FROM product_image WHERE id = ?", id);

	/* 실제 이미지파일 삭제 */
	for(let i=0; i<data.length; i++){
		fs.unlink("./public/img/" + data[i].image_name, (err) => {
			if(err) throw err;
		})
	}

	/* 상품이미지 DB 삭제 쿼리 */
	await conn.query("DELETE FROM product_image WHERE id = ?;", id);

	/* 상품 DB 삭제 쿼리 */
	await conn.query("DELETE FROM product WHERE id = ?;", id);

	/* 채팅방 넘버 조회 쿼리 */
	var [talkNo] = await conn.query("SELECT talk_no FROM talk_room WHERE product_no = ?;", id);

	/* 상품에 대한 채팅내역 삭제 쿼리 */
	for(let i=0; i<talkNo.length; i++){
		await conn.query("DELETE FROM talk_message WHERE talk_no = ?;", talkNo[i].talk_no);
	}

	/* 상품에 대한 채팅방삭제 쿼리 */
	await conn.query("DELETE FROM talk_room WHERE product_no = ?;", id);

	/* 상품에 관심목록 삭제 쿼리 */
	await conn.query("DELETE FROM dibs_list WHERE product_no = ?;", id);

	return res.send({
		success:true,
	})
}

/* 마이페이지-개인정보-비밀번호 재확인 */
exports.pwCheck = async (req,res) => {
	/* req.body */
	const { pw } = req.body;
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const loginId = decode.member_id; // 로그인 ID
	
	/* 패스워드 찾기 쿼리 */
	const [data] = await conn.query("SELECT member_pw FROM member WHERE member_id = ?", loginId);
	const memberPw = data[0].member_pw;
	if(pw == memberPw){
		return res.send({success:true})
	}
	else{
		return res.send({success:false})
	}

}

/* 개인정보 조회 */
exports.getMemberInfo = async (req,res) => {
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const loginId = decode.member_id; // 로그인 ID

	/* 이메일 조회 쿼리 */
	const [data] = await conn.query("SELECT member_email FROM member WHERE member_id = ?", loginId);
	const memberInfo = data[0];

	return res.send({memberInfo:memberInfo})
}

/* 개인정보 수정 */
exports.MemberInfoUpdate = async (req,res) => {
	/* req.body */
	const { currentPw, newPw, newPwCheck } = req.body;
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const loginId = decode.member_id; // 로그인 ID

	if(currentPw != "" || newPw != "" || newPwCheck != ""){ // 비밀번호 변경 칸에 값이 들어온 경우
		console.log("비밀번호 수정 O")

		/* 패스워드 조회 쿼리 */
		const [data] = await conn.query("SELECT member_pw FROM member WHERE member_id = ?", loginId);
		const memberPw = data[0].member_pw;

		if(currentPw != memberPw){
			return res.send("currentPwCheckError") // 현재 비밀번호 체크 에러
		}
		if(newPw.length < 6 || newPw.length > 13){ // 새로운 비밀번호 길이 체크
			return res.send("newPwLengthError") // 새로운 비밀번호 길이 에러
		}
		if(newPw == newPwCheck){ // 새로운 비밀번호 재확인 체크
			return res.send("newPwCheckError") // 새로운 비밀번호 체크 에러
		}

		/* 비밀번호 변경 쿼리 */
		await conn.query("UPDATE member SET member_pw = ? WHERE member_id = ?;", [body.newPw, loginId]);
		/* 이메일 변경 쿼리 */
		await conn.query("UPDATE member SET member_email = ? WHERE member_id = ?;", [body.email, loginId]);

		return res.send({changePw:true})
	}
	else{ // 비밀번호를 수정하지않고 개인정보만 수정한 경우
		console.log("비밀번호 수정 x")

		/* 이메일 변경 쿼리 */
		await conn.query("UPDATE member SET member_email = ? WHERE member_id = ?;", [body.email, memberId]);

		return res.send({changePw:false})
	}
}


