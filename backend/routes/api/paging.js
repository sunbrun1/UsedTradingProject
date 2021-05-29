const db = require('../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");
var fs = require('fs');

/* 카테고리별 상품 리스트 페이징 */
exports.byCategoryCount = (req,res) => {
    let categoryLargeId = req.query.categoryLargeId; // 대분류 ID
	let categoryMediumId = req.query.categoryMediumId; // 중분류 ID
    //대분류 클릭시
	if(categoryMediumId == null){ 
		conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?;", categoryLargeId, (err,data) => { 
			if(err) throw err;
			const categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
			conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ?;", categoryLargeName ,(err,data) => {
				if(err) throw err;
				res.send({
					count:data,
				})
			})
		})
	}
	//중분류 클릭시
	else{
		conn.query("SELECT category_large_name, category_medium_name FROM category_medium WHERE category_medium_id = ?",categoryMediumId,(err,data) => { 
			if(err) throw err;
			const categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
			const categoryMediumName = data[0].category_medium_name; //카테고리 중분류 name
			conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ? AND category_medium_name = ?;",[categoryLargeName,categoryMediumName],(err,data) => { 
				if(err) throw err;
				res.send({
					count:data,
				})
			})
		})
	}
}

/* 검색별 상품 리스트 페이징 */
exports.bySearchCount = (req,res) => {
    let categoryLargeId = req.query.categoryLargeId; // 대분류 ID
	let search = req.query.search; // 검색 text
    //대분류 클릭시
	if(categoryLargeId == "all"){ 
		conn.query("SELECT COUNT(*) AS count FROM product WHERE title LIKE ?;", "%"+search+"%" ,(err,data) => {
			if(err) throw err;
			res.send({
				count:data,
			})
		})
	}
	//중분류 클릭시
	else{
		conn.query("SELECT category_large_name FROM category_medium WHERE category_Large_id = ?",categoryLargeId,(err,data) => { 
			if(err) throw err;
			let categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
			conn.query("SELECT COUNT(*) AS count FROM product WHERE category_large_name = ? AND title LIKE ?;",[categoryLargeName,"%"+search+"%" ],(err,data) => { 
				if(err) throw err;
				res.send({
					count:data,
				})
			})
		})
	}
}