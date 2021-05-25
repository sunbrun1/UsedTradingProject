const router = require('express').Router();
const dao = require('./board'); 
const member = require('./member'); 
const mypage = require('./mypage'); 
const paging = require('./paging'); 


/* 배포 */
router.get('/zz', function(req, res, next) {
	console.log("성공")
	res.sendFile(path.join(__dirname, '../../public', 'index.html'));
  })

/*        CRUD 관련        */
router.get("/board",dao.list,); // 메인 상품리스트 출력 모듈(GET) 
router.get("/board/bycategory/list",dao.byCategory); //카테고리별 상품리스트 출력(GET)
router.get("/board/getcategory",dao.getCategory); //카테고리 데이터(GET)
router.get("/board/product/:no",dao.product); // 상품 데이터 불러오기 모듈(GET)
router.post("/board/upload",dao.upload); // 상품 업로드 모듈(POST)
router.post("/board/update/:id",dao.update); // 상품 수정 모듈(POST)


/*      로그인/회원가입 관련       */
router.post("/member/signup",member.signup); // 회원가입 모듈(POST)
router.post("/member/login",member.login); // 로그인 모듈 (POST)
router.get("/member/logout",member.logout); // 로그아웃 모듈(GET)
router.get("/member/someAPI",member.someAPI); // 로그인여부 확인 모듈(GET)
router.get("/member/loginstatuscheck",member.loginStatusCheck); //Header 컴포넌트- 로그인/회원가입 버튼 렌더링 (로그인여부에 따라)

/*       마이페이지 관련        */
router.get("/mypage/myproduct/list",mypage.myProduct); // 내게시물 모듈(GET)
router.get("/mypage/myproduct/myProductCount",mypage.myProductCount); // 게시물 카운트(get)
router.post("/mypage/myproduct/delete",mypage.myProductDelete); // 내게시물 삭제(post)
router.post("/mypage/memberinfo/pwcheck",mypage.pwCheck); // 마이페이지-개인정보-비밀번호 재확인

/* 페이징 관련 */
router.get("/paging/bycategory",paging.byCategoryCount); // 게시물 카운트(get)




router.all('*',(req, res)=> {
	res.status(404).send({success:false, msg:'board unknown uri ${req.path}'});
})

module.exports = router;