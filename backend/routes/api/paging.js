const conn = require('../../config/db'); //db설정 호출
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");
var fs = require('fs');

/* 카테고리별 상품 리스트 페이징 */
exports.byCategoryCount = async (req,res) => {
    let categoryLargeId = req.query.categoryLargeId; // 대분류 ID
	let categoryMediumId = req.query.categoryMediumId; // 중분류 ID
    //대분류 클릭시
	if(categoryMediumId == null){ 
		/* 카테고리 이름 조회 쿼리 */
		let [category] = await conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?;", categoryLargeId);
		let categoryLargeName = category[0].category_large_name; //카테고리 대분류 name

		/* 상품 개수 조회 쿼리 */
		let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ?;", categoryLargeName);

		res.send({
			count:count,
		})


	}
	//중분류 클릭시
	else{
		/* 카테고리 이름 조회 쿼리 */
		let [category] = await conn.query("SELECT category_large_name, category_medium_name FROM category_medium WHERE category_medium_id = ?",categoryMediumId);
		let categoryLargeName = category[0].category_large_name; //카테고리 대분류 name
		let categoryMediumName = category[0].category_medium_name; //카테고리 중분류 name

		/* 상품 개수 조회 쿼리 */
		let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ? AND category_medium_name = ?;",[categoryLargeName,categoryMediumName]);
		
		res.send({
			count:count,
		})
		
	
	}
}

/* 검색별 상품 리스트 페이징 */
exports.bySearchCount = async (req,res) => {
    let categoryLargeId = req.query.categoryLargeId; // 대분류 ID
	let search = req.query.search; // 검색 text
    //대분류 클릭시
	if(categoryLargeId == "all"){ 
		/* 상품 개수 조회 쿼리 */
		let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE title LIKE ?;", "%"+search+"%");
	
		res.send({
			count:count,
		})
	
	}
	//중분류 클릭시
	else{
		/* 카테고리 이름 조회 쿼리 */
		let [category] = await conn.query("SELECT category_large_name FROM category_medium WHERE category_Large_id = ?",categoryLargeId);
		let categoryLargeName = category[0].category_large_name; //카테고리 대분류 name
		
		/* 상품 개수 조회 쿼리 */
		let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ? AND title LIKE ?;",[categoryLargeName,"%"+search+"%" ]);

		res.send({
			count:count,
		})
	}
}

exports.myProductCount = async (req,res) => {
	let accessToken = req.cookies.accessToken;
	let accessToken_decoded = jwt.verify(accessToken, secretObj.secret);

	let [count] = await conn.query("SELECT COUNT(*) AS count FROM product WHERE member_id = ?;", accessToken_decoded.member_id);
	res.send({
		success:true,
		count:count
	})

}