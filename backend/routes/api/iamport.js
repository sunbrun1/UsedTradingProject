const axios = require('axios').default;
const conn = require('../../config/db'); //db설정 호출

/* 초기 로그인/회원가입 버튼 렌더링 */
exports.payments = async (req,res) => {
	try {
        const { imp_uid, merchant_uid, buyer_id} = req.body; // req의 body에서 imp_uid, merchant_uid 추출
   
        // 액세스 토큰(access token) 발급 받기
        const getToken = await axios({
          url: "https://api.iamport.kr/users/getToken",
          method: "post", // POST method
          headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
          data: {
            imp_key: "3203226771474111", // REST API키
            imp_secret: "7df725b490bb12f8a58d235eaf1fe0a41757661499bb9d336f56d1484087e8585b56c1264841eeeb" // REST API Secret
          }
        });
        const { access_token } = getToken.data.response; // 인증 토큰

        // imp_uid로 아임포트 서버에서 결제 정보 조회
        const getPaymentData = await axios({
            url: "https://api.iamport.kr/payments/" + imp_uid, // imp_uid 전달
            method: "get", // GET method
            headers: { "Authorization": access_token } // 인증 토큰 Authorization header에 추가
        });
        const paymentData = getPaymentData.data.response; // 조회한 결제 정보

        // DB에서 결제되어야 하는 금액 조회
        const [order] = await conn.query("SELECT price FROM product WHERE id = ?", product_no);
        console.log(order[0]);
        const amountToBePaid = order[0].price;
        console.log("결제 되어야 하는 금액 : " + amountToBePaid);
        

        // 결제 검증하기
        const { amount } = paymentData;
        if (amount === amountToBePaid) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            console.log("금액일치")
            await conn.query("INSERT INTO payment_info (imp_uid, merchant_uid, member_id) values(?, ?, ?);", [imp_uid, merchant_uid, buyer_id]); // DB에 결제 정보 저장
            res.send({success:true})  
        }
        else{ // 결제 금액 불일치. 위/변조 된 결제
            throw { status: "forgery", message: "위조된 결제시도" };
        }
    }
    catch (e) {
        res.status(400).send(e);
    }
}

