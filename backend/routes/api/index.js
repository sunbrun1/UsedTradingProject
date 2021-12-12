const router = require('express').Router();
const dao = require('./board'); 
const member = require('./member'); 
const mypage = require('./mypage'); 
const paging = require('./paging'); 
const iamport = require('./iamport'); 

/* 배포 */
router.get('/zz', function(req, res, next) {
	console.log("성공")
	res.sendFile(path.join(__dirname, '../../public', 'index.html'));
  })

/*        CRUD 관련        */
router.get("/board/getMainList",dao.getMainList,); // 메인 상품리스트 출력 모듈(GET) 
router.get("/board/bysearch/list",dao.bySearch); //검색별 상품리스트 출력(GET)
router.get("/board/bycategory/list",dao.byCategory); //카테고리별 상품리스트 출력(GET)
router.get("/board/getCategoryInfo",dao.getCategoryInfo); //카테고리 데이터(GET)
router.get("/board/product/:no",dao.product); // 상품 데이터 불러오기 모듈(GET)
router.get("/board/product/:no/dibs",dao.dibs); // 찜하기 기능 모듈(POST)
router.post("/board/upload",dao.upload); // 상품 업로드 모듈(POST)
router.post("/board/areaSelect",dao.areaSelect); // 거래지역 선택 모듈(POST)
router.post("/board/update/:id",dao.update); // 상품 수정 모듈(POST)
router.get("/board/getProductInfo/:no",dao.getProductInfo); // 상품정보 조회(GET)
router.get("/board/product/:no/getOrderInfo",dao.getOrderInfo); // 주문정보 조회(GET)
router.post("/board/product/:no/getPaymentInfo",dao.getPaymentInfo); // 주문정보 조회(GET)


/*      로그인/회원가입 관련       */
router.post("/member/signup",member.signup); // 회원가입 모듈(POST)
router.post("/member/login",member.login); // 로그인 모듈 (POST)
router.get("/member/logout",member.logout); // 로그아웃 모듈(GET)
router.get("/member/someAPI",member.someAPI); // 로그인여부 확인 모듈(GET)
router.get("/member/loginstatuscheck",member.loginStatusCheck); //Header 컴포넌트- 로그인/회원가입 버튼 렌더링 (로그인여부에 따라)

/*       마이페이지 관련        */
router.get("/mypage/getMyProduct/list", mypage.getMyProduct); // 내 상품 리스트 조회 (GET)
router.get("/mypage/getTransactionStatus/list", mypage.getTransactionStatus); // 거래상태 조회 (GET)
router.get("/mypage/wishlist", mypage.getWishList); // 관심목록 조회모듈(get)
router.get("/mypage/getMyPoint", mypage.getMyPoint); // 내 포인트 조회 모듈(GET)
router.post("/mypage/myproduct/delete", mypage.myProductDelete); // 내게시물 삭제(post)
router.post("/mypage/memberinfo/pwcheck", mypage.pwCheck); // 마이페이지-개인정보-비밀번호 재확인
router.get("/mypage/memberinfo", mypage.getMemberInfo); // 마이페이지-개인정보-조회
router.post("/mypage/memberinfo/update", mypage.MemberInfoUpdate); // 마이페이지-개인정보-수정

/* 페이징 관련 */
router.get("/paging/bycategory",paging.byCategoryCount); // 카테고리별 게시물 카운트(get)
router.get("/paging/bysearch",paging.bySearchCount); // 검색별 게시물 카운트(get)
router.get("/paging/myProductCount",paging.myProductCount); // 게시물 카운트(get)
router.get("/paging/myWishListCount",paging.myWishListCount); // 관심목록 리스트 카운트(get)
router.get("/paging/transactionStatusCount",paging.transactionStatusCount); // 거래상태 카운트(get)

/* 아임포트 api */
router.post("/payments/complete", iamport.payments); //아임포트
router.post("/directPayments/complete", iamport.directPayments); // 
router.post("/onlyPointPayments/complete", iamport.onlyPointPayments); // 포인트로만 결제




router.all('*',(req, res)=> {
	res.status(404).send({success:false, msg:'board unknown uri ${req.path}'});
})

module.exports = router;