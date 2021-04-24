const db = require('../../../config/db'); //db설정 호출
const conn =  db.init(); //db 연결
const multer = require('multer');
const jwt = require("jsonwebtoken");
const secretObj = require("../../../config/jwt");

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
	conn.query("SELECT category_large_id,category_large_name,group_concat(category_medium_name) as category_medium_name ,group_concat(category_medium_id) as category_medium_id from category_medium group by category_large_id;  ",(err,category) => { //쿼리 실행
		if(err) throw err;
		const category_list = [{
			large:[{
				category_large_id:'',
				category_large_name:''
			}],
			medium:[{
				category_medium_id:'',
				category_medium_name:''
			}]
		}];
		for(let i=0; i<category.length; i++){
			category_list.push({
				large:{
					category_large_id:category[i].category_large_id,
					category_large_name:category[i].category_large_name},
				medium:{
					category_medium_id:category[i].category_medium_id.split(','),
				    category_medium_name:category[i].category_medium_name.split(',')}
				})
		}
		res.send({
			success:true,
			category_list:category_list,
		})
	})
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
	const body = req.body;
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

exports.login = (req,res) =>{
	var body = req.body;
	let accesstoken  = jwt.sign(
		{
			member_id:body.id   // 토큰의 내용(payload)
		},
			secretObj.secret ,    // 비밀 키
		{
			expiresIn: '1m'    // 유효 시간은 5분
		}
	)
	let refreshtoken  = jwt.sign(
		{
			member_id:body.id   // 토큰의 내용(payload)
		},
			secretObj.secret ,    // 비밀 키
		{
			expiresIn: '14d'    // 유효 시간은 5분
		})
	conn.query("SELECT pw FROM member WHERE member_id = ?", body.id, (err,data) =>{
		if(data.length < 1){
			res.send("login fail");
		}
		else if(data[0].pw === body.pw){
			conn.query("UPDATE member SET refreshtoken = ? WHERE member_id = ?;",[refreshtoken,body.id],
			(err,data) => { //쿼리 실행
				if(err){
				    throw err;
				}
				else{
					res.cookie("accesstoken", accesstoken, {httpOnly: true});
					res.cookie("refreshtoken", refreshtoken, {httpOnly: true});
					res.send("login success");
				}
			});	
		}else{
			res.send("login fail");
		}

	})                                     
}

exports.someAPI = (req,res) =>{
	let accesstoken = req.cookies.accesstoken;
	let refreshtoken = req.cookies.refreshtoken;
	console.log(accesstoken)
	try{
		if(accesstoken.length > 0){
			let accesstoken_decoded = jwt.verify(accesstoken, secretObj.secret);
			if(accesstoken_decoded){
				res.send("check success")
			}
			else{
				res.send("check fail")
			}
		}
		else{
			res.send("check fail")
		}
	}
	catch(err){
		let refreshtoken_decoded = jwt.verify(refreshtoken, secretObj.secret);
		conn.query("SELECT refreshtoken FROM member WHERE member_id = ?", refreshtoken_decoded.member_id ,(err,data) => {
			if(data[0].refreshtoken == refreshtoken){
				let accesstoken  = jwt.sign(
					{
						member_id:refreshtoken_decoded.member_id  // 토큰의 내용(payload)
					},
						secretObj.secret ,    // 비밀 키
					{
						expiresIn: '1m'    // 유효 시간은 5분
					}
				)
				res.cookie("accesstoken", accesstoken, {httpOnly: true});
				res.send("check success")
			}
		})
	}
}

exports.logout = (req,res) =>{
	res.cookie("accesstoken", '', {httpOnly: true});
	res.cookie("refreshtoken", '', {httpOnly: true});
	res.send("logout success");
}


// 메인화면 출력 모듈
exports.ProductByCategory = (req,res) => { //리스트 모듈 router 에서 호출
	console.log(req.params.id)
	conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?",req.params.id,(err,data) => { //쿼리 실행
		if(err) throw err;
		conn.query("SELECT * FROM product  WHERE category_large_name = ? ORDER BY id DESC LIMIT 30;",data[0].category_large_name,(err,new_product) => { //쿼리 실행
			if(err) throw err;
			res.send({
				success:true,
				new_product:new_product
			})
		})
	})
}


