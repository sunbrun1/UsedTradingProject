const router = require('express').Router();
const dao = require('./board'); 
const member = require('./member'); 
const mypage = require('./mypage'); 

/*        리스트 출력 관련        */
router.get("/board",dao.list,); // 메인 상품리스트 출력 모듈(GET) 
router.get("/board/getcategory/:id",dao.byCategory); //카테고리별 상품리스트 출력(GET)
router.get("/board/getcategory",dao.getCategory); //카테고리 데이터(GET)

router.post("/board/upload",dao.upload); // 상품 업로드 모듈(POST)

router.get("/board/product/:id",dao.product); // 상품 상세보기 모듈(GET)


/*      로그인/회원가입 관련       */
router.post("/member/signup",member.signup); // 회원가입 모듈(POST)
router.post("/member/login",member.login); // 로그인 모듈 (POST)
router.get("/member/logout",member.logout); // 로그아웃 모듈(GET)
router.get("/member/someAPI",member.someAPI); // 로그인여부 확인 모듈(GET)
router.get("/member/loginstatuscheck",member.loginStatusCheck); //Header 컴포넌트- 로그인/회원가입 버튼 렌더링 (로그인여부에 따라)

/* 마이페이지 관련 */
router.get("/mypage/myproduct",mypage.myProduct); // 내게시물 모듈(GET)
router.post("/mypage/myproduct/delete",mypage.myProductDelete); // 내게시물 삭제(post)


router.all('*',(req, res)=> {
	res.status(404).send({success:false, msg:'board unknown uri ${req.path}'});
})

module.exports = router;