const db = require('../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const multer = require('multer'); 
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");

// 업로드를위한 multer 모듈
const storage = multer.diskStorage({ 
	destination: (req, res, cb) => {
		cb(null, "./images/");
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}_${file.originalname}`);
	},
	 fileFilter: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		if (ext !== ".jpeg" || ".png" || ".jpg"){
			return cb(null, false);
		}
		cb(null, true); 
	}, 
	limits: { fileSize: 20 * 1024 * 1024 },
});
const upload2 = multer({ storage }).array("files",12);


/* 메인화면 출력 모듈 */
exports.list = (req,res) => { //리스트 모듈 router 에서 호출
	conn.query("SELECT * FROM product ORDER BY id DESC LIMIT 10 ;",(err,new_product) => { //쿼리 실행
		if(err) throw err;
		conn.query("SELECT * FROM product ORDER BY views DESC LIMIT 10 ; ;",(err,popular_product) => { //쿼리 실행
			if(err) throw err;
			res.send({
				success:true,
				new_product:new_product,
				popular_product:popular_product
			})
		})
	})
}

/* 카테고리별 상품 리스트 출력 */
exports.byCategory = (req,res) => { 
	const categoryId = req.params.id; // 카테고리 분류 id
	//대분류 클릭시
	if(categoryId < 20000){ 
		conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?",categoryId,(err,data) => { 
			if(err) throw err;
			const categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
			conn.query("SELECT * FROM product  WHERE category_large_name = ? ORDER BY id DESC LIMIT 30;",categoryLargeName,(err,data) => {
				if(err) throw err;
				res.send({
					success:true,
					product:data
				})
			})
		})
	}
	//중분류 클릭시
	else if(categoryId < 30000){
		conn.query("SELECT category_medium_name FROM category_medium WHERE category_medium_id = ?",categoryId,(err,data) => { 
			if(err) throw err;
			const categoryMediumName = data[0].category_medium_name; //카테고리 중분류 name
			conn.query("SELECT * FROM product  WHERE category_medium_name = ? ORDER BY id DESC LIMIT 30;",categoryMediumName,(err,data) => { 
				if(err) throw err;
				res.send({
					success:true,
					product:data
				})
			})
		})
	}
}

/* 카테고리데이터 출력 모듈 */
exports.getCategory = (req,res) => { //리스트 모듈 router 에서 호출
	conn.query("SELECT category_large_id,category_large_name,group_concat(category_medium_name) as category_medium_name ,group_concat(category_medium_id) as category_medium_id from category_medium group by category_large_id;  ",(err,data) => { //쿼리 실행
		if(err) throw err;
		let zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]); 

		let categoryList = data.map((data) => {
			let large = zip(
				data.category_large_id.split(","),
				data.category_large_name.split(","),
			);
			let medium= zip(
				data.category_medium_id.split(","),
				data.category_medium_name.split(","),
			);
			return {
				large: large,
				medium: medium,
			};
		});

		res.send({
			success:true,
			categoryList:categoryList,
		})
	})
}
/* 업로드 모듈 */
exports.upload = (req,res)  =>{
	upload2(req,res,(err) =>{
		let body = req.body;
		let date = new Date();
		let accessToken = req.cookies.accessToken;
		let accessTokenDecoded = jwt.verify(accessToken, secretObj.secret);

		conn.query("INSERT INTO product (member_id,thumbnail, title, price, state, content, category_large_name, category_medium_name, views, date) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
		[accessTokenDecoded.member_id, req.files[0].filename ,body.title, body.price, body.state, body.content, body.select_category_large, body.select_category_medium, 0, date],
		(err,data) => { //쿼리 실행
			if(err){
				throw err;
			}
			else{
				for(var i=0; i<req.files.length; i++){
					conn.query("INSERT INTO product_image (image_name,id) values(?,LAST_INSERT_ID());",
					[req.files[i].filename],
					(err,data) => { //쿼리 실행
						if(err){
							throw err;
						}
					});
				}
				res.send({
					success:true
				})
			}
		});	
	})
}

// 상품 상세페이지 모듈
exports.product = (req,res) => { //리스트 모듈 router 에서 호출
	conn.query("SELECT a.title, a.price, a.state, a.content, a.category_large_name, a.category_medium_name, b.image_name FROM product a, product_image b WHERE a.id=b.id AND a.id=?",req.params.id,(err,product) => { //쿼리 실행
		if(err) throw err;
		res.send({
			success:true,
			product:product
		})
	})
	conn.query("SELECT views FROM product WHERE id=?",req.params.id,(err,views) => { //쿼리 실행
		if(err) throw err;
		else{
			conn.query("UPDATE product SET views=? WHERE id=?",[views[0].views+1,req.params.id],
			(err,data) => { //쿼리 실행
				if(err){
					throw err;
				}
			});	
		}
	})
	
}






