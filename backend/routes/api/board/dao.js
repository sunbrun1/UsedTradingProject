const db = require('../../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const multer = require('multer');

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


// 메인화면 출력 모듈
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

// 카테고리데이터 출력 모듈
exports.category = (req,res) => { //리스트 모듈 router 에서 호출
	conn.query("SELECT category_large_name,group_concat(category_medium_name) as category_medium_name from category_medium group by category_large_name;",(err,category) => { //쿼리 실행
		if(err) throw err;
		const category_list = [{large:'', medium:''}];
		for(let i=0; i<category.length; i++){
			category_list.push({large:category[i].category_large_name, medium:category[i].category_medium_name.split(',')});
		}
		res.send({
			success:true,
			category_list:category_list,
		})
	})

exports.juso = (req,res) =>{
	console.log(req.data)
}

}
// 업로드 모듈
exports.upload = (req,res)  =>{
	upload2(req,res,(err) =>{
		var body = req.body;
		var date = new Date();
		console.log(date);
		conn.query("INSERT INTO product (thumbnail, title, price, state, content, category_large_name, category_medium_name, views, date) values(?, ?, ?, ?, ?, ?, ?, ?, ?);",
		[req.files[0].filename ,body.title, body.price, body.state, body.content, body.select_category_large, body.select_category_medium, 0, date],
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
// 카카오 로그인 api
exports.kakao = (req,res) => { //리스트 모듈 router 에서 호출
	console.log(req.data);
}

exports.signup = (req,res) =>{
	var body = req.body;
	if(body.id.length < 6 ){
		res.send("id_length error")
	}else{
		if(body.pw.length < 6){
			res.send("pw_length error")
		}else{
			if(body.pw != body.pwcheck){
				res.send("pwcheck error")
			}else{
				conn.query("SELECT * FROM member WHERE member_id = ?", body.id, (err,data) =>{
					console.log(data);
					if(data.length > 0){
						res.send("idcheck error")
					}
					else{
						conn.query("INSERT INTO member (member_id, pw, email) values(?, ?, ?);",
						[body.id, body.pw, body.email],
						(err,data) => { //쿼리 실행
							if(err){
								throw err;
							}
							else{
								res.send({
									success:true
								})
							}
						});	
					}
				})

			}
		}
	}
}



