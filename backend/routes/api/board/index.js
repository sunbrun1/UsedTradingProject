const router = require('express').Router();
const dao = require('./dao'); //데이터 모듈 호출

router.get("/",dao.list,); // GET방식으로 접근 시 dao.list 모듈 실행
router.get("/category",dao.category); // get 접근 시 dao.category 모듈 실행
router.post("/upload",dao.upload); // POST방식으로 접근 시 dao.upload 모듈 실행
router.get("/product/:id",dao.product); // POST방식으로 접근 시 dao.upload 모듈 실행
router.get("/oauth/callback",dao.kakao);
router.post("/signup",dao.signup);
router.post("/login",dao.login);
router.get("/someAPI",dao.someAPI);
router.get("/logout",dao.logout);
router.get("/ProductByCategory/:id",dao.ProductByCategory);

router.all('*',(req, res)=> {
	res.status(404).send({success:false, msg:'board unknown uri ${req.path}'});
})



module.exports = router;