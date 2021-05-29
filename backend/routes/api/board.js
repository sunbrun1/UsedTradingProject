const db = require('../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const multer = require('multer'); 
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");
let fs = require('fs');
const { Console } = require('console');

/* Create */
const storage = multer.diskStorage({  // 업로드를위한 multer 모듈
	destination: (req, res, cb) => {
		cb(null, "./public/img/");
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
const multertUpload = multer({ storage }).array("files",12);

/* 업로드 모듈 */
exports.upload = (req,res)  =>{ /* 업로드 모듈 */
	multertUpload(req,res,(err) =>{ //multer
		let body = req.body;
		let files = req.files;
		let date = new Date();
		let accessToken = req.cookies.accessToken;
		let accessTokenDecoded = jwt.verify(accessToken, secretObj.secret);
		console.log(body)
		console.log(files)

		if(files.length > 0){ // 이미지공백 체크
			if(body.title.length > 2){ // 제목 2글자 이하 체크 
				if(body.select_category_large.length > 0 && body.select_category_medium.length > 0){ // 카테고리 선택 공백 체크
					if(body.price.length > 0 ){ // 가격 공백 체크
						if(body.state.length > 0){
							/* 상품 업로드 쿼리 */
							conn.query("INSERT INTO product (member_id,thumbnail, title, price, state, content, category_large_name, category_medium_name, views, date, dibs) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
							[accessTokenDecoded.member_id, req.files[0].filename ,body.title, body.price, body.state, body.content, body.select_category_large, body.select_category_medium, 0, date, 0],(err) => { 
								if(err) throw err;
								for(let i=0; i<req.files.length; i++){
									/* 상품 이미지 업로드 쿼리 */
									conn.query("INSERT INTO product_image (image_name,id) values(?,LAST_INSERT_ID());",[req.files[i].filename],(err,) => { 
										if(err) throw err;
									});
								}
								res.send({
									success:true
								})
								
							});	
						}
						else{
							res.send("stateCheckError") 
						}
					} 
					else{
						res.send("priceCheckError") 
					}
				}
				else{
					res.send("categoryCheckError");
				}
			}
			else{
				res.send("titleCheckError"); 
			}
		}
		else{
			res.send("imageCheckError"); 
		}
	})
}

/* Read */
/* 메인화면 출력 모듈 */
exports.list = (req,res) => { //리스트 모듈 router 에서 호출
	conn.query("SELECT * FROM product ORDER BY id DESC LIMIT 10 ;",(err,newProduct) => { //쿼리 실행
		if(err) throw err;
		conn.query("SELECT * FROM product ORDER BY views DESC LIMIT 10 ; ;",(err,bestProduct) => { //쿼리 실행
			if(err) throw err;
			res.send({
				success:true,
				newProduct:newProduct,
				bestProduct:bestProduct
			})
		})
	})
}

/* 검색별 상품 리스트 조회 */
exports.bySearch = (req,res) => { 
	let categoryLargeId = req.query.categoryLargeId; // 대분류 ID
	let search = req.query.search; // 검색 text
	let limit = parseInt(req.query.limit);
	let offset = parseInt(req.query.offset);
	//카테고리 전체로 검색한 경우
	if(categoryLargeId == "all"){ 
		console.log("카테고리 전체선택")
		conn.query("SELECT * FROM product WHERE title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?;",["%"+search+"%", limit, offset],(err,data) => {
			if(err) throw err;
			res.send({
				success:true,
				product:data,
				categoryLargeName:"카테고리 전체"
			})
		})
	}
	//카테고리 선택후 검색한 경우
	else{
		console.log("카테고리 분류 선택")
		conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?",categoryLargeId,(err,data) => { 
			if(err) throw err;
			let categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
			console.log(categoryLargeName)
			conn.query("SELECT * FROM product WHERE category_large_name = ? AND title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?;",[categoryLargeName, "%"+search+"%", limit, offset],(err,data) => { 
				if(err) throw err;
				res.send({
					success:false,
					product:data,
					categoryLargeName:categoryLargeName,
				})
			})
		})
	}
}


/* 카테고리별 상품 리스트 출력 */
exports.byCategory = (req,res) => { 
	let categoryLargeId = req.query.categoryLargeId; // 대분류 ID
	let categoryMediumId = req.query.categoryMediumId; // 중분류 ID
	let limit = parseInt(req.query.limit);
	let offset = parseInt(req.query.offset);
	//대분류 클릭시
	if(categoryMediumId == null){ 
		console.log("대분류선택")
		conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?;", categoryLargeId, (err,data) => { 
			if(err) throw err;
			const categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
			conn.query("SELECT * FROM product  WHERE category_large_name = ? ORDER BY id DESC LIMIT ? OFFSET ?;",[categoryLargeName, limit, offset],(err,data) => {
				if(err) throw err;
				res.send({
					success:true,
					product:data,
					categoryLargeName:categoryLargeName
				})
			})
		})
	}
	//중분류 클릭시
	else{
		console.log("중분류선택")
		conn.query("SELECT category_large_name, category_medium_name FROM category_medium WHERE category_medium_id = ?",categoryMediumId,(err,data) => { 
			if(err) throw err;
			const categoryLargeName = data[0].category_large_name; //카테고리 대분류 name
			const categoryMediumName = data[0].category_medium_name; //카테고리 중분류 name
			conn.query("SELECT * FROM product WHERE category_large_name = ? AND category_medium_name = ? ORDER BY id DESC LIMIT ? OFFSET ?;",[categoryLargeName,categoryMediumName, limit, offset],(err,data) => { 
				if(err) throw err;
				res.send({
					success:false,
					product:data,
					categoryLargeName:categoryLargeName,
					categoryMediumName:categoryMediumName
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
		console.log(categoryList)

		res.send({
			success:true,
			categoryList:categoryList,
		})
	})
}

/* 상품 상세페이지 모듈 */
exports.product = (req,res) => { 
	let accessToken = req.cookies.accessToken; //엑세스 토큰
	let productNo = req.params.no; // 상품 ID
	let memberNo;

	/* 유저ID 넘버 조회 쿼리 */
	conn.query("SELECT a.member_no FROM member AS a, product AS b WHERE a.member_id = b.member_id and b.id =?;", productNo, (err,data) =>{ 
		if(err) throw err;
		memberNo = data[0].member_no;
	})

	if(accessToken != null){ // 로그인상태인 경우
		console.log("로그인 상태입니다")
		let decode = jwt.verify(accessToken, secretObj.secret);
		let loginId =  decode.member_id;  //현재 로그인된 ID

		// 상품정보 조회 쿼리
		conn.query("SELECT a.*, group_concat(b.image_name) AS image_name FROM product a, product_image b WHERE b.id = a.id AND a.id = ?;",productNo,(err,product) => {
			if(err) throw err;
			//내 게시물인지 아닌지 확인하는 쿼리
			conn.query("SELECT member_id FROM product WHERE id = ?",productNo,(err,data) =>{ 
				if(err) throw err;
				if(data[0].member_id == loginId) { // 내 게시물이라면
					res.send({
						myProduct:true, 
						product:product,
					})
				}
				else{ // 다른유저의 게시물이라면
					conn.query("SELECT count(*) AS count FROM dibs_list WHERE product_no = ? AND member_id = ?;", [productNo, loginId], (err,data) => {
						if(err) throw err;
						let count = data[0].count;
						if(count < 1){ // 현재 상품 찜하기 안한상태
							res.send({
								myProduct:false, // 다른유저 게시물
								dibsState:false,  // 찜하기 안한상태
								product:product,
								memberNo:memberNo
							})
						}
						else{ // 현재 상품 찜하기 한상태
							res.send({
								myProduct:false, // 다른유저 게시물
								dibsState:true,  // 찜하기 한 상태
								product:product,
								memberNo:memberNo
							})
						}
					})
				}
			})
		})
	}
	else{ // 비로그인 상태인 경우
		console.log("비로그인 상태입니다")
		// 상품정보 조회 쿼리
		conn.query("SELECT a.*, group_concat(b.image_name) AS image_name FROM product a, product_image b WHERE b.id = a.id AND a.id = ?;",productNo,(err,product) => {
			if(err) throw err;
			res.send({
				myProduct:false, 
				product:product
			})
		})
	}
	// 조회수 증가 쿼리
	conn.query("SELECT views FROM product WHERE id = ?", productNo, (err,data) => { //쿼리 실행
		if(err) throw err;
		let views = data[0].views;
		conn.query("UPDATE product SET views=? WHERE id = ?",[views+1, productNo], (err) => { 
			if(err) throw err;
		});	
	})
}
/* 찜하기 모듈 */
exports.dibs = (req,res) => {
	let accessToken = req.cookies.accessToken; //엑세스 토큰
	let decode = jwt.verify(accessToken, secretObj.secret); //복호화
	let loginId =  decode.member_id;  //현재 로그인된 ID
	let productNo = req.params.no // 상품 넘버

	/* 찜 상태 확인 쿼리 */
	conn.query("SELECT count(*) AS count FROM dibs_list WHERE product_no = ? AND member_id = ?", [productNo, loginId], (err,data) => {
		if(err) throw err;
		let count = data[0].count;
		if(count < 1){ // 찜하기 안되있는 경우
			/* 찜 추가 */
			conn.query("INSERT INTO dibs_list (product_no, member_id) values(?, ?);",[productNo, loginId], (err) => {
				if(err) throw err;
				/* 현재 상품 찜 개수 조회 쿼리 */
				conn.query("SELECT dibs FROM product WHERE id = ?;", productNo, (err,data) => {
					if(err) throw err;
					let dibsCount = data[0].dibs; // 찜 개수
					/* 현재 상품 찜 개수 추가 */
					conn.query("UPDATE product SET dibs = ? WHERE id = ?;", [dibsCount+1, productNo], (err,data) =>{
						if(err) throw err;
						res.send({
							success:true
						})
					})
				})
			})
		}
		else{ // 이미 찜하기 되있는 경우
			/* 찜 삭제 */
			conn.query("DELETE FROM dibs_list WHERE product_no = ? AND member_id = ?;",[productNo, loginId], (err) => {
				if(err) throw err;
				/* 현재 상품 찜 개수 조회 쿼리 */
				conn.query("SELECT dibs FROM product WHERE id = ?;", productNo, (err,data) => {
					if(err) throw err;
					let dibsCount = data[0].dibs; // 찜 개수
					/* 현재 상품 찜 개수 감소 */
					conn.query("UPDATE product SET dibs = ? WHERE id = ?;", [dibsCount-1, productNo], (err,data) =>{
						if(err) throw err;
						res.send({
							success:false
						})
					})
				})
			})
		}
	})
}
        

/* Update */
/* 게시물 수정 모듈 */
exports.update = (req,res) => {
	multertUpload(req,res,(err) =>{ //multer
		let body = req.body
		let files = req.files;
		let image_name = req.body.image_name.split(","); //남아있는 기존 이미지
		let deleteImage = req.body.deleteImage.split(","); //삭제된 기존 이미지
		console.log(image_name);
		console.log(deleteImage);

		if(files.length > 0 || image_name.length > 0){ // 이미지공백 체크
			if(body.title.length > 2){ // 제목 2글자 이하 체크 
				if(body.select_category_large.length > 0 && body.select_category_medium.length > 0){ // 카테고리 선택 공백 체크
					if(body.price.length > 0 ){ // 가격 공백 체크
						if(body.state.length > 0){
							/* 상품 업로드 쿼리 */
							if(body.image_name != ''){ // 기존 이미지가 남아있는경우
								//수정하기쿼리
								conn.query("UPDATE product SET thumbnail = ?, title = ?, price = ?, state = ?, content = ?, category_large_name = ?, category_medium_name = ? WHERE id = ?;",
								[image_name[0], body.title, body.price, body.state, body.content, body.select_category_large, body.select_category_medium, req.params.id],(err) => { //쿼리 실행
									if(err) throw err;
									//추가된 이미지 INSERT
									for(let i=0; i<req.files.length; i++){  
										conn.query("INSERT INTO product_image (image_name,id) values(?,?);",[req.files[i].filename, req.params.id],(err,data) => { //쿼리 실행
											if(err) throw err;
										});
									}
									/* 이미지 삭제관련 */
									if(deleteImage != ''){
										for(let i=0; i<deleteImage.length; i++){
											fs.unlink("./public/img/" + deleteImage[i], (err) => { //실제파일 삭제
												if(err) throw err;
											})			
											conn.query("Delete FROM product_image WHERE image_name = ?;", deleteImage[i] ,(err) => {  //DB에있는 이미지 데이터 삭제
												if(err) throw err;
											})
										}
									}
									res.send({
										success:true
									})
								})
							}
							else{ // 기존 이미지가 남아있지 않은경우
								conn.query("UPDATE product SET thumbnail = ?,title = ?,price = ?,state = ?,content = ?,category_large_name = ?, category_medium_name = ? WHERE id = ?;",
								[req.files[0].filename, body.title, body.price, body.state, body.content, body.category_large_name, body.category_medium_name, req.params.id],(err) => { //쿼리 실행
									if(err) throw err;
									//추가된 이미지 INSERT
									for(let i=0; i<req.files.length; i++){  
										conn.query("INSERT INTO product_image (image_name,id) values(?,?);",[req.files[i].filename, req.params.id],(err,data) => { //쿼리 실행
											if(err) throw err;
										});
									}
									/* 이미지 삭제관련 */
									if(deleteImage != ''){
										for(let i=0; i<deleteImage.length; i++){
											fs.unlink("./public/img/" + deleteImage[i], (err) => { //실제파일 삭제
												if(err) throw err;
											})			
											conn.query("Delete FROM product_image WHERE image_name = ?;", deleteImage[i] ,(err) => {  //DB에있는 이미지 데이터 삭제
												if(err) throw err;
											})
										}
									}
									res.send({
										success:true
									})
								})
							}
						}
						else{
							res.send("stateCheckError") 
						}
					} 
					else{
						res.send("priceCheckError") 
					}
				}
				else{
					res.send("categoryCheckError");
				}
			}
			else{
				res.send("titleCheckError"); 
			}
		}
		else{
			res.send("imageCheckError"); 
		}
	})
}






