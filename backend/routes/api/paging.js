const conn = require('../../config/db'); //db설정 호출
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");
var fs = require('fs');

/* 카테고리별 상품 리스트 페이징 */
exports.byCategoryCount = async (req,res) => {
	/* req.query */
	const { categoryLargeId, categoryMediumId } = req.query;

    //대분류 클릭시
	if(categoryMediumId == null){ 
		/* 카테고리 이름 조회 쿼리 */
		var [data] = await conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?;", categoryLargeId);
		const categoryLargeName = data[0].category_large_name; //카테고리 대분류 name

		/* 상품 개수 조회 쿼리 */
		var [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ?;", categoryLargeName);

		return res.send({count:count})
	}
	//중분류 클릭시
	else{
		/* 카테고리 이름 조회 쿼리 */
		var [data] = await conn.query("SELECT category_large_name, category_medium_name FROM category_medium WHERE category_medium_id = ?",categoryMediumId);
		const categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
		const categoryMediumName = data[0].category_medium_name; //카테고리 중분류 name

		/* 상품 개수 조회 쿼리 */
		let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ? AND category_medium_name = ?;",[categoryLargeName,categoryMediumName]);
		
		return res.send({count:count})
	}
}

/* 검색별 상품 리스트 페이징 */
exports.bySearchCount = async (req,res) => {
	/* req.query */
	const { categoryLargeId, search } = req.query;

    // 카테고리 전체선택 검색
	if(categoryLargeId == "all"){ 
		/* 상품 개수 조회 쿼리 */
		let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE title LIKE ?;", "%"+search+"%");
	
		return res.send({count:count})
	}
	// 카테고리 대분류 선택 검색
	else{
		/* 카테고리 이름 조회 쿼리 */
		let [data] = await conn.query("SELECT category_large_name FROM category_medium WHERE category_Large_id = ?",categoryLargeId);
		let categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
		
		/* 상품 개수 조회 쿼리 */
		let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ? AND title LIKE ?;",[categoryLargeName,"%"+search+"%" ]);

		return res.send({count:count})
	}
}

/* 내 상품 리스트 페이징 */
exports.myProductCount = async (req,res) => {
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const memberId = decode.member_id; // 로그인 ID

	/* 상품 개수 조회 */
	let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE member_id = ?;", memberId);

	return res.send({
		success:true,
		count:count
	})
}

/* 관심목록 리스트 페이징 */
exports.myWishListCount = async (req,res) => {
	/* jwt 토큰 */
	const accessToken = req.cookies.accessToken; // 엑세스토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
	const memberId = decode.member_id; // 로그인 ID

	let [count] = await conn.query("SELECT COUNT(*) AS count " +  
								   "FROM dibs_list AS A " +
								   "LEFT OUTER JOIN product AS B ON (A.product_no = B.id) " +
								   "WHERE A.member_id = ?", memberId);
	return res.send({
		success:true,
		count:count
	})
}