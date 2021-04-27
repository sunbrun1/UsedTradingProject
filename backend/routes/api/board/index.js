const router = require('express').Router();
const dao = require('./dao'); 

/*        리스트 출력 관련        */
router.get("/",dao.list,); // 메인 상품리스트 출력 모듈(GET) 
router.get("/getcategory/:id",dao.byCategory); //카테고리별 상품리스트 출력(GET)
router.get("/getcategory",dao.getCategory); //카테고리 데이터(GET)

router.post("/upload",dao.upload); // 상품 업로드 모듈(POST)

router.get("/product/:id",dao.product); // 상품 상세보기 모듈(GET)

/*      로그인/회원가입 관련       */
router.post("/signup",dao.signup); // 회원가입 모듈(POST)
router.post("/login",dao.login); // 로그인 모듈 (POST)
router.get("/logout",dao.logout); // 로그아웃 모듈(GET)
router.get("/someAPI",dao.someAPI); // 로그인여부 확인 모듈(GET)
router.get("/loginstatuscheck",dao.loginStatusCheck); //Header 컴포넌트- 로그인/회원가입 버튼 렌더링 (로그인여부에 따라)


router.all('*',(req, res)=> {
	res.status(404).send({success:false, msg:'board unknown uri ${req.path}'});
})

module.exports = router;