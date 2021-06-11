const axios = require('axios').default;
const conn = require('../../config/db'); //db설정 호출

/* payments */
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
        
        // 결제 검증하기
        const { amount } = paymentData;
        console.log(amount)

        /* DB에 결제 정보 저장 */
        await conn.query("INSERT INTO payment_info (imp_uid, merchant_uid, member_id) values(?, ?, ?);", [imp_uid, merchant_uid, buyer_id]);

        /* 포인트 조회 */
        const [data] = await conn.query("SELECT member_point FROM member WHERE member_id = ?", buyer_id);
        const point = data[0].member_point;

        /* 포인트 추가 */
        await conn.query("UPDATE member SET member_point = ? WHERE member_id = ?", [point + amount, buyer_id]);
            
        return res.send({success:true})  
    }
    catch (e) {
        res.status(400).send(e);
    }
}

/* payments */
exports.directPayments = async (req,res) => {
	try {
        /* req.body */
        const { imp_uid, merchant_uid, custom_data} = req.body; // req의 body에서 imp_uid, merchant_uid 추출
        const { productNo, loginId } = custom_data[0];
   
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
        const [order] = await conn.query("SELECT price FROM product WHERE id = ?", productNo);
        const amountToBePaid = order[0].price;

        /* 포인트 조회 */
        var [data] = await conn.query("SELECT member_point FROM member WHERE member_id = ?;", loginId);
        const point = data[0].member_point; // 포인트
        const totalPay = amountToBePaid - point
        console.log("결제 되어야 하는 금액 : " + totalPay);
        

        // 결제 검증하기
        const { amount } = paymentData;
        if (amount === totalPay) { // 결제 금액 일치. 결제 된 금액 === 결제 되어야 하는 금액
            console.log("금액일치")

            await conn.query("INSERT INTO payment_info (imp_uid, merchant_uid, member_id) values(?, ?, ?);", [imp_uid, merchant_uid, loginId]); // DB에 결제 정보 저장
            /* 포인트 차감 */
            await conn.query("UPDATE member SET member_point = ? WHERE member_id = ?", [0, loginId]);

            /* 상품 상태 변경 */
            await conn.query("UPDATE product SET transaction_status = ? WHERE id = ?", ["판매중", productNo]);
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

/* 포인트로만 결제 */
exports.onlyPointPayments = async (req,res) => {
    try{
        console.log("통신성공")
        /* req.body */
        const { orderPrice, currentPoint, loginId, productNo } = req.body; 
        console.log("req.orderPrice: " + orderPrice)
        console.log("req.currentPoint: " + currentPoint)
        console.log("req.loginId: " + loginId)
        console.log("req.productNo: " + productNo)

        /* 포인트 조회 */
        var [data] = await conn.query("SELECT member_point FROM member WHERE member_id = ?;", loginId);
        const point = data[0].member_point; // 포인트
        console.log("포인트: " + point)

        // DB에서 결제되어야 하는 금액 조회
        const [order] = await conn.query("SELECT price FROM product WHERE id = ?", productNo);
        const amountToBePaid = order[0].price;
        console.log("amountToBePaid: " + amountToBePaid)

        /* 포인트 검증 */
        if(currentPoint != point){
            return res.send({success:false}) 
        }
        /* 주문금액 검증 */
        if(orderPrice != amountToBePaid){
            return res.send({success:false}) 
        }
        if(orderPrice > currentPoint){
            return res.send({success:false}) 
        }
        const remainPoint = currentPoint - orderPrice; // 잔여포인트
        console.log("remainPoint: " + amountToBePaid)
        /* 포인트 차감 */
        await conn.query("UPDATE member SET member_point = ? WHERE member_id = ?", [remainPoint, loginId]);

        /* 상품 상태 변경 */
        await conn.query("UPDATE product SET transaction_status = ? WHERE id = ?", ["판매중", productNo]);

        return res.send({success:true}) 
    }
    catch(err){
        return res.status(500).send(err)
    }
    

}



