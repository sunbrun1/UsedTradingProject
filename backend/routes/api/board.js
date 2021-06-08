const conn = require('../../config/db'); //db설정 호출
const multer = require('multer'); 
const jwt = require("jsonwebtoken");
const secretObj = require("../../config/jwt");
let fs = require('fs');

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

/* 업로드 */
exports.upload = async (req,res)  =>{ 
	multertUpload (req,res, async (err) => { //multer
		/* req.body */
		const { title, price, state, content, select_category_large, select_category_medium, area, ea} = req.body; 
		/* req.files */
		const files = req.files; // 파일
		/* 시간 */
		const date = new Date(); // 현재 시간
		/* jwt토큰 */
		const accessToken = req.cookies.accessToken; // 엑세스 토큰
		const decode = jwt.verify(accessToken, secretObj.secret); // 엑세스토큰 복호화
		const loginId = decode.member_id; //로그인 ID

		if(files.length < 1){ // 이미지공백 체크
			return res.send("imageCheckError"); 
		}
		if(title.length < 2 || title.length > 13){ // 제목 2 ~ 13자 체크
			return res.send("titleCheckError"); 
		}
		if(select_category_large.length < 1 && select_category_medium.length < 1){ // 카테고리 선택 공백 체크
			return res.send("categoryCheckError");
		}
		if(area.length < 1){ // 거래지역 선택 공백 체크
			return res.send("areaCheckError") ;
		}
		if(price < 100){ // 가격 100원 이상 체크
			return res.send("priceCheckError");
		}
		if(state.length < 1){ // 상품상태 선택 공백 체크
			return res.send("stateCheckError") ;
		}
		if(ea < 1){ // 상품수량 체크
			return res.send("eaCheckError") ;
		}
		
		try{
			/* 상품 업로드 쿼리 */
			const [data] = await conn.query("INSERT INTO product (member_id, thumbnail, title, price, content, category_large_name, category_medium_name, area, state, date, ea, views, dibs) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
			[loginId, files[0].filename ,title , price, content, select_category_large, select_category_medium, area, state, date, ea, 0, 0]);
			const productNo = data.insertId // 상품 넘버

			/* 상품 이미지 업로드 쿼리 */
			for(let i=0; i<files.length; i++){
				await conn.query("INSERT INTO product_image (image_name,id) values(?, ?);",[files[i].filename, productNo]);
			}

			return res.send({success:true})
		}
		catch(err){
			console.log(err);
		}
	})
}

/* 거래지역 조회 */
exports.areaSelect = async (req,res)  =>{ 
	/* req.body */
	const { areaSearch } = req.body; 
	try{
		/* 거래지역 조회 쿼리 */
		const [data] = await conn.query("SELECT * FROM area WHERE CONCAT(area_sido,area_sigugun,area_dongeupmyeon) REGEXP ?;", areaSearch)
		const area = data;
		if(area.length < 1){ // 검색결과 없음
			return res.send({success:false, area:area})
		}

		return res.send({success:true, area:area})
		
	}
	catch(err){
		return res.send({success:false})
	}
}

/* Read */
/* 메인화면 상품 리스트 조회 */
exports.list = async (req,res) => { //리스트 모듈 router 에서 호출
	try{
		const [newProduct] = await conn.query("SELECT * FROM product ORDER BY id DESC LIMIT 10;");
		const [bestProduct] = await conn.query("SELECT * FROM product ORDER BY dibs DESC LIMIT 10;");
		return res.send({
			success:true,
			newProduct:newProduct,
			bestProduct:bestProduct
		})
	}
	catch(err){
		return res.status(500).send(err)
	}
}

/* 검색별 상품 리스트 조회 */
exports.bySearch = async (req,res) => { 
	/* req.query */
	const { categoryLargeId, search, limit, offset } = req.query; 

	//카테고리 전체로 검색한 경우
	if(categoryLargeId == "all"){ 
		/* 검색별 상품리스트 조회 */
		const [product] = await conn.query("SELECT * FROM product WHERE title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?;",["%"+search+"%", parseInt(limit), parseInt(offset)]);

		return res.send({
			success:true,
			product:product,
			categoryLargeName:"카테고리 전체"
		})
	}
	//카테고리 선택후 검색한 경우
	else{
		/* 카테고리 대분류 이름 조회 */
		const [data] = await conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?",categoryLargeId);
		const categoryLargeName = data[0].category_large_name; // 카테고리 대분류 이름

		/* 카테고리,검색별 상품리스트 조회 */
		const [product] = await conn.query("SELECT * FROM product WHERE category_large_name = ? AND title LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?;",[categoryLargeName, "%"+search+"%", parseInt(limit), parseInt(offset)]);

		return res.send({
			success:false,
			product:product,
			categoryLargeName:categoryLargeName,
		})
	}
}


/* 카테고리별 상품 리스트 조회 */
exports.byCategory = async (req,res) => { 
	/* req.query */
	const { categoryLargeId, categoryMediumId, limit, offset } = req.query; 

	//대분류 클릭시
	if(categoryMediumId == null){ 
		console.log("대분류선택")
		/* 카테고리 대분류 이름 조회 */
		const [data] = await conn.query("SELECT category_large_name FROM category_large WHERE category_large_id = ?;", categoryLargeId);
		const categoryLargeName = data[0].category_large_name; //카테고리 대분류 이름

		/* 카테고리별 상품 리스트 조회 */
		const [product] = await conn.query("SELECT * FROM product  WHERE category_large_name = ? ORDER BY id DESC LIMIT ? OFFSET ?;",[categoryLargeName, parseInt(limit), parseInt(offset)]);

		return res.send({
			success:true,
			product:product,
			categoryLargeName:categoryLargeName
		})
	}
	//중분류 클릭시
	else{
		console.log("중분류선택")
		/* 카테고리 대분류,중분류 이름 조회 */
		const [data] = await conn.query("SELECT category_large_name, category_medium_name FROM category_medium WHERE category_medium_id = ?", categoryMediumId);
		const categoryLargeName = data[0].category_large_name; //카테고리 대분류 이름
		const categoryMediumName = data[0].category_medium_name //카테고리 중분류 이름

		/* 카테고리별 상품 리스트 조회 */
		const [product] = await conn.query("SELECT * FROM product WHERE category_large_name = ? AND category_medium_name = ? ORDER BY id DESC LIMIT ? OFFSET ?;",[categoryLargeName,categoryMediumName, parseInt(limit), parseInt(offset)]);

		return res.send({
			success:false,
			product:product,
			categoryLargeName:categoryLargeName,
			categoryMediumName:categoryMediumName
		})
	
	}
}

/* 카테고리데이터 출력 모듈 */
exports.getCategory = async (req,res) => { 
	/* 카테고리 데이터 조회 */
	const [data] = await conn.query("SELECT category_large_id,category_large_name,group_concat(category_medium_name) as category_medium_name ,group_concat(category_medium_id) as category_medium_id from category_medium group by category_large_id;");
	const zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]); 

	const categoryList = data.map((data) => {
		const large = zip(
			data.category_large_id.split(","),
			data.category_large_name.split(","),
		);
		const medium= zip(
			data.category_medium_id.split(","),
			data.category_medium_name.split(","),
		);
		return {
			large: large,
			medium: medium,
		};
	});

	return res.send({
		success:true,
		categoryList:categoryList,
	})

}

/* 상품 상세페이지 모듈 */
exports.product = async (req,res) => { 
	/* jwt토큰 */
	const accessToken = req.cookies.accessToken; //엑세스 토큰
	/* req.params */
	const productNo = req.params.no; // 상품 ID

	/* 유저ID 넘버 조회 쿼리 */
	var [data] = await conn.query("SELECT a.member_no FROM member AS a, product AS b WHERE a.member_id = b.member_id and b.id =?;", productNo);
	const memberNo = data[0].member_no // 유저 넘버

	/* 상품정보 조회 쿼리 */
	const [product] = await conn.query("SELECT a.*, group_concat(b.image_name) AS image_name FROM product a, product_image b WHERE b.id = a.id AND a.id = ?;",productNo);

	/* 조회수 조회 쿼리 */
	var [data] = await conn.query("SELECT views FROM product WHERE id = ?", productNo);
	const viewsCount = data[0].views;

	/* 조회수 증가 쿼리 */
	await conn.query("UPDATE product SET views=? WHERE id = ?",[viewsCount + 1, productNo]);

	/* 로그인상태인 경우 */
	if(accessToken != null){ 
		console.log("로그인 상태입니다")
		const decode = jwt.verify(accessToken, secretObj.secret); // 엑세스토큰 복호화
		const loginId =  decode.member_id;  // 로그인 ID

		/* 내 게시물인지 아닌지 확인하는 쿼리 */
		const [data] = await conn.query("SELECT member_id FROM product WHERE id = ?", productNo);
		const memberId = data[0].member_id; // 상품 판매자 ID
		
		/* 내 게시물이라면 */
		if(memberId == loginId) { 
			return res.send({
				myProduct:true, 
				product:product,
			})
		}
		/* 다른유저의 게시물이라면 */
		else{ 
			/* 로그인 ID 찜하기 상태 확인 쿼리 */
			const [data] = await conn.query("SELECT count(*) AS count FROM dibs_list WHERE product_no = ? AND member_id = ?;", [productNo, loginId]);
			const count = data[0].count;

			/* 현재 상품 찜하기 안한상태 */
			if(count < 1){
				return res.send({
					myProduct:false, // 다른유저 게시물
					dibsState:false,  // 찜하기 안한상태
					product:product,
					memberNo:memberNo
				})
			}
			/* 현재 상품 찜하기 한상태 */
			else{
				return res.send({
					myProduct:false, // 다른유저 게시물
					dibsState:true,  // 찜하기 한 상태
					product:product,
					memberNo:memberNo
				})
			}
		}
	}
	/* 비로그인 상태인 경우 */
	else{
		console.log("비로그인 상태입니다")
		return res.send({
			myProduct:false, 
			product:product
		})

	}
}
/* 찜하기 모듈 */
exports.dibs = async (req,res) => {
	/* jwt토큰 */
	const accessToken = req.cookies.accessToken; //엑세스 토큰
	const decode = jwt.verify(accessToken, secretObj.secret); //복호화
	const loginId =  decode.member_id;  //현재 로그인된 ID
	/* req.params */
	const productNo = req.params.no // 상품 넘버

	/* 현재 상품 찜 개수 조회 쿼리 */
	var [data] = await conn.query("SELECT dibs FROM product WHERE id = ?;", productNo);
	const dibsCount = data[0].dibs; // 찜 개수

	/* 찜 상태 확인 쿼리 */
	var [data] = await conn.query("SELECT count(*) AS count FROM dibs_list WHERE product_no = ? AND member_id = ?", [productNo, loginId]);
	const dibsData = data[0].count;

	/* 찜하기 안되있는 경우 */
	if(dibsData < 1){ 
		/* 찜 추가 쿼리 */
		await conn.query("INSERT INTO dibs_list (product_no, member_id) values(?, ?);",[productNo, loginId]);

		/* 현재 상품 찜 개수 추가 */
		await conn.query("UPDATE product SET dibs = ? WHERE id = ?;", [dibsCount+1, productNo]);

		return res.send({
			success:true
		})
	}
	/* 이미 찜하기 되있는 경우 */
	else{
		/* 찜 삭제 쿼리*/
		await conn.query("DELETE FROM dibs_list WHERE product_no = ? AND member_id = ?;",[productNo, loginId]);

		/* 현재 상품 찜 개수 감소 */
		await conn.query("UPDATE product SET dibs = ? WHERE id = ?;", [dibsCount-1, productNo]);

		return res.send({
			success:false
		})
	}
}
        

/* Update */
/* 게시물 수정 */
exports.update = async (req,res) => {
	multertUpload(req,res, async (err) =>{ //multer
		/* req.body */
		const { title, price, state, content, select_category_large, select_category_medium, area, ea} = req.body; 
		/* req.files */
		const files = req.files; // 파일
		/* req.params */
		const productId = req.params.id; // 상품 넘버

		const remainImage = req.body.remainImage.split(","); //남아있는 기존 이미지
		const deleteImage = req.body.deleteImage.split(","); //삭제된 기존 이미지

		if(files.length < 1 && remainImage == ""){ // 이미지공백 체크
			return res.send("imageCheckError"); 
		}
		if(title.length < 2 || title.length > 20){ // 제목 2 ~ 20자 체크
			return res.send("titleCheckError"); 
		}
		if(select_category_large.length < 1 && select_category_medium.length < 1){ // 카테고리 선택 공백 체크
			return res.send("categoryCheckError");
		}
		if(area.length < 1){ // 거래지역 선택 공백 체크
			return res.send("areaCheckError") ;
		}
		if(parseInt(price) < 100){ // 가격 100원 이상 체크
			return res.send("priceCheckError");
		}
		if(state.length < 1){ // 상품상태 선택 공백 체크
			return res.send("stateCheckError") ;
		}
		if(parseInt(ea) < 1){ // 상품상태 선택  체크
			return res.send("stateCheckError") ;
		}

		/* 기존 이미지가 남아있는경우 */
		if(remainImage != ''){ 
			/* 수정하기 쿼리 */
			await conn.query("UPDATE product SET thumbnail = ?, title = ?, price = ?, content = ?, category_large_name = ?, category_medium_name = ?, area = ?, state = ?, ea = ? WHERE id = ?;",
			[remainImage[0], title, price, content, select_category_large, select_category_medium, area, state, ea, productId]);			
		}
		/* 기존 이미지가 남아있지 않은경우 */
		else{
			/* 수정하기 쿼리 */
			await conn.query("UPDATE product SET thumbnail = ?, title = ?, price = ?, content = ?, category_large_name = ?, category_medium_name = ?, area = ?, state = ?, ea = ? WHERE id = ?;",
			[files[0].filename, title, price, content, select_category_large, select_category_medium, area, state, ea, productId]);
		}

		/* 추가된 이미지 INSERT 쿼리 */
		for(let i=0; i<req.files.length; i++){  
			await conn.query("INSERT INTO product_image (image_name,id) values(?,?);",[files[i].filename, productId]);
		}
		/* 실제 이미지 파일 삭제 */
		if(deleteImage != ''){
			for(let i=0; i<deleteImage.length; i++){
				fs.unlink("./public/img/" + deleteImage[i], (err) => { //실제파일 삭제
					if(err) throw err;
				})			
				/* DB에있는 이미지 데이터 삭제 */
				await conn.query("Delete FROM product_image WHERE image_name = ?;", deleteImage[i]);
			}
		}

		return res.send({
			success:true
		})

		
	})
}






