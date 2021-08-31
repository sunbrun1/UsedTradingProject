<template>
    <section>
        <Header></Header>
        <AreaModal @close="closeModal" @areaSelect="areaSelect" v-if="modal"></AreaModal>
        <body>
            <div class="payment_wrap">
                <h2>상품결제</h2>
                <p>결제내역</p>
                <table class="table">
                    <colgroup>
                        <col width="10%" />
                        <col width="15%" />
                        <col width="60%" />
                        <col width="20%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>이미지</th>
                            <th>상품명</th>
                            <th>상품정보</th>
                            <th>가격</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><img :src="`http://localhost:3000/${thumbnail}`" width="100" height="100"/></td>
                            <td>{{title}}</td>
                            <td>{{content}}</td>
                            <td>{{price}}원</td>
                        </tr>
                    </tbody>
                </table>

                <p>주문 정보</p>
                <div class="order_name">
                    <div class="name_title">
                        주문하시는 분 <span> *</span>
                    </div>
                    <div class="name_input">
                        <input type="text" v-model="orderName">
                    </div>
                </div>
                <div class="order_address">
                    <div class="address_title">
                        주소 <span> *</span>
                    </div>
                    <div>
                        <div class="address_btn" @click="openModal">
                            주소검색
                        </div>
                        <div class="address_input">
                            <input type="text" v-model="orderDefaultAddress"> <span>기본주소</span>
                        </div>
                        <div class="address_input">
                            <input type="text" v-model="orderRemainAddress"> <span>나머지주소</span>
                        </div>
                    </div>
                </div>
                <div class="order_phone">
                    <div class="phone_title">
                        휴대전화 <span> *</span>
                    </div>
                    <div class="phone_select">
                        <select v-model="orderPhoneNum1">
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="017">017</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                        </select>
                    </div> 
                    <div class="phone_input">
                        <span>-</span> <input type="text" v-model="orderPhoneNum2" maxlength="4"> <span>-</span>
                    </div> 
                    <div class="phone_input">
                        <input type="text" v-model="orderPhoneNum3" maxlength="4">
                    </div> 
                </div>
                <div class="order_email">
                    <div class="email_title">
                        이메일 <span> *</span>
                    </div>
                    <div class="email_input">
                        <input type="text" v-model="orderEmail1"> <span>@</span>
                    </div> 
                    <div class="email_input">
                        <input type="text" v-model="orderEmail2">
                    </div> 
                    <div class="email_select">
                        <select v-model="orderEmail2">
                            <option value="naver.com">naver.com</option>
                            <option value="daum.net">daum.net</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="nate.com">nate.com</option>
                        </select>
                    </div> 
                </div>
                <!-- 배송정보 -->
                <p>배송 정보</p>
                <div class="select_destination">
                    <div class="destination_title">
                        배송지 선택
                    </div>
                    <div class="destination_input">
                        <input type="radio" name="radio" id="radio1" @click="sameInfo" v-model="deliverChoice" value="주문자 정보와 동일"/>
                        <label for="radio1" @click="sameInfo">주문자 정보와 동일</label>
                    </div>
                    <div class="destination_input">
                        <input type="radio" name="radio" id="radio2" @click="newInfo" v-model="deliverChoice" value="새로운 배송지" checked/>
                        <label for="radio2" @click="newInfo">새로운 배송지</label>
                    </div>
                </div>
                <div class="order_name">
                    <div class="name_title">
                        주문하시는 분 <span> *</span>
                    </div>
                    <div class="name_input">
                        <input type="text" v-model="deliverName">
                    </div>
                </div>
                <div class="order_address">
                    <div class="address_title">
                        주소 <span> *</span>
                    </div>
                    <div>
                        <div class="address_btn" @click="openModal">
                            주소검색
                        </div>
                        <div class="address_input">
                            <input type="text" v-model="deliverDefaultAddress"> <span>기본주소</span>
                        </div>
                        <div class="address_input">
                            <input type="text" v-model="deliverRemainAddress"> <span>나머지주소</span>
                        </div>
                    </div>
                </div>
                <div class="order_phone">
                    <div class="phone_title">
                        휴대전화 <span> *</span>
                    </div>
                    <div class="phone_select">
                        <select v-model="deliverPhoneNum1">
                            <option value="010">010</option>
                            <option value="011">011</option>
                            <option value="016">016</option>
                            <option value="017">017</option>
                            <option value="018">018</option>
                            <option value="019">019</option>
                        </select>
                    </div> 
                    <div class="phone_input">
                        <span>-</span> <input type="text" v-model="deliverPhoneNum2" maxlength="4"> <span>-</span>
                    </div> 
                    <div class="phone_input">
                        <input type="text" v-model="deliverPhoneNum3" maxlength="4">
                    </div> 
                </div>
                <div class="order_email">
                    <div class="email_title">
                        이메일 <span> *</span>
                    </div>
                    <div class="email_input">
                        <input type="text" v-model="deliverEmail1"> <span>@</span>
                    </div> 
                    <div class="email_input">
                        <input type="text" v-model="deliverEmail2">
                    </div> 
                    <div class="email_select">
                        <select v-model="deliverEmail2">
                            <option value="naver.com">naver.com</option>
                            <option value="daum.net">daum.net</option>
                            <option value="gmail.com">gmail.com</option>
                            <option value="nate.com">nate.com</option>
                        </select>
                    </div> 
                </div>
                <p>결제</p>
                <div class="total_payment">
                    <div class="total_amount">
                        총 주문 금액
                    </div>
                    <div class="won">
                        {{price.toLocaleString('ko-KR')}}원
                    </div>
                </div>
                <div class="member_point">
                    <div class="total_amount">
                        현재 포인트
                    </div>
                    <div class="won">
                        -{{memberPoint.toLocaleString('ko-KR')}}원
                    </div>
                </div>
                <div class="remain_point">
                    <div class="total_amount">
                        잔여 포인트
                    </div>
                    <div class="won">
                        {{remainPoint.toLocaleString('ko-KR')}}원
                    </div>
                </div>
                <div class="final_payment">
                    <div class="total_amount">
                        총 결제금액
                    </div>
                    <div class="won">
                        {{totalMoney.toLocaleString('ko-KR')}}원
                    </div>
                </div>
                <div class="payment_btn" @click="onPayment">
                    결제하기
                </div>
            </div>
        </body>
    </section>
 
</template>

<script>
import Header from '@/components/Header.vue'
import AreaModal from '@/components/Board/AreaModal.vue'
import axios from 'axios';
import router from '@/routes'; //설정 라우터 호출

export default {
    components: {Header,AreaModal},
    data(){
        return{
            /* 상품 정보 */
            thumbnail:"",
            title:"",
            content:"",
            price:0,
            /* 주문 정보 */
            orderName:"",
            orderDefaultAddress:"",
            orderRemainAddress:"",
            orderPhoneNum1:"010",
            orderPhoneNum2:"",
            orderPhoneNum3:"",
            orderEmail1:"",
            orderEmail2:"naver.com",
            /* 배송정보 */
            deliverChoice:"",
            deliverName:"",
            deliverDefaultAddress:"",
            deliverRemainAddress:"",
            deliverPhoneNum1:"010",
            deliverPhoneNum2:"",
            deliverPhoneNum3:"",
            deliverEmail1:"",
            deliverEmail2:"naver.com",
            /* 주소검색 모달 상태*/
            modal:false,
            /* 개인정보 */
            loginId:"",
            memberPoint:0,
            /* 총결제금액 */
            remainPoint:0,
            totalMoney:0
        }
    },
    mounted() {
        this.getProductInfo(); // 상품정보 조회
        this.getMemberInfo();
	},
    watch:{
        /* 휴대전화 입력 숫자만 입력가능 */
        orderPhoneNum2(){
            return this.orderPhoneNum2 = this.orderPhoneNum2.replace(/[^0-9]/g, '');
        },
        orderPhoneNum3(){
            return this.orderPhoneNum3 = this.orderPhoneNum3.replace(/[^0-9]/g, '');
        },
        deliverPhoneNum2(){
            return this.deliverPhoneNum2 = this.deliverPhoneNum2.replace(/[^0-9]/g, '');
        },
        deliverPhoneNum3(){
            return this.deliverPhoneNum3 = this.deliverPhoneNum3.replace(/[^0-9]/g, '');
        }
    },
    methods:{
        /* 로그인유지 */
        loginCheck(){
            this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
            .then(()=>{
                
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        /* 상품정보 조회 */
        getProductInfo(){
            const productNo = this.$route.params.no; // 상품 넘버
            /* 로그인유지 */
            this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
            .then(()=>{
                /* 상품정보 조회 */
                this.$axios.get(`http://localhost:3000/api/board/getProductInfo/${productNo}`, {withCredentials: true})
                .then((res)=>{
                    if(res.data.success){
                        const productInfo = res.data.productInfo[0]; // 상품정보
                        this.thumbnail = productInfo.thumbnail;
                        this.title = productInfo.title;
                        this.content = productInfo.content;
                        this.price = productInfo.price;
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
            })
			.catch((err)=>{
				console.log(err);
			})
        },
        /* 개인정보 조회 */
        getMemberInfo(){
            /* 로그인 여부 확인 */
            this.$axios.get("http://localhost:3000/api/member/someAPI", {withCredentials: true})
            .then(()=>{
                /* 개인정보 조회 GET */
                this.$axios.get("http://localhost:3000/api/mypage/getMyPoint", {withCredentials: true})
                .then((res)=>{
                    if(res.data.success){
                        const memberInfo = res.data.memberInfo[0];
                        this.loginId = memberInfo.member_id;
                        this.memberPoint = memberInfo.member_point;
                        this.totalPay();
                    }
                })
                .catch((err)=>{
                    console.log(err);
                }) 
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        /* 총 결제금액 계산 */
        totalPay(){
            if(this.price > this.memberPoint){
                this.remainPoint = 0;
                console.log(this.price)
                console.log(this.memberPoint)
                return this.totalMoney = this.price - this.memberPoint;
            }
            if(this.price < this.memberPoint){
                this.remainPoint = this.memberPoint - this.price;
                return this.totalMoney = 0;
            }
            if(this.price == this.memberPoint){
                this.remainPoint = 0;
                return this.totalMoney = this.price - this.memberPoint;
            }
        },
        /* 주문자 정보와 동일 */
        sameInfo(){
            this.deliverName = this.orderName;
            this.deliverDefaultAddress = this.orderDefaultAddress;
            this.deliverRemainAddress = this.orderRemainAddress;
            this.deliverPhoneNum1 = this.orderPhoneNum1;
            this.deliverPhoneNum2 = this.orderPhoneNum2;
            this.deliverPhoneNum3 = this.orderPhoneNum3;
            this.deliverEmail1 = this.orderEmail1;
            this.deliverEmail2 = this.orderEmail2;
        },
        /* 새로운 배송지 */
        newInfo(){
            this.deliverName = "";
            this.deliverDefaultAddress = "";
            this.deliverRemainAddress = "";
            this.deliverPhoneNum1 = "010";
            this.deliverPhoneNum2 = "";
            this.deliverPhoneNum3 = "";
            this.deliverEmail1 = "";
            this.deliverEmail2 = "naver.com";
        },
        /* 주소 검색 모달창 열기 */
        openModal() {
            this.modal = true;
        },
        /* 주소 검색 모달창 닫기 */
        closeModal() {
            this.modal = false;
        },
        areaSelect(area_sido, area_sigugun, area_dongeupmyeon){
            this.orderDefaultAddress = area_sido + " " + area_sigugun + " " +area_dongeupmyeon
        },
        onPayment() {
            const productNo = this.$route.params.no; // 상품 넘버
            if(this.orderName == "" ||  this.deliverName == ""){
                return alert("주문하시는 분 이름을 입력해주세요.")
            }
            if(this.orderDefaultAddress == "" ||  this.deliverDefaultAddress == ""){
                return alert("기본주소를 입력해주세요.")
            }
            if(this.orderRemainAddress == "" ||  this.deliverRemainAddress == ""){
                return alert("나머지주소를 입력해주세요.")
            }
            if(this.orderPhoneNum2 == "" ||  this.deliverPhoneNum2 == ""){
                return alert("휴대전화 번호를 입력해주세요.")
            }
            if(this.orderPhoneNum3 == "" ||  this.deliverPhoneNum3 == ""){
                return alert("휴대전화 번호를 입력해주세요.")
            }
            if(this.orderEmail1 == "" ||  this.deliverEmail1 == ""){
                return alert("이메일을 입력해주세요.")
            }
            if(this.totalMoney == 0){
                if (confirm("결제 하시겠습니까?") == true){ // 확인
                    /* 로그인유지 */
                    return this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
                    .then(()=>{
                        let data = {
                                orderPrice: this.price,
                                memberPoint: this.memberPoint,
                                loginId : this.loginId,
                                productNo : this.$route.params.no,
                                /* 주문자 정보 */
                                orderName: this.orderName,
                                orderDefaultAddress: this.orderDefaultAddress,
                                orderRemainAddress : this.orderRemainAddress,
                                orderPhoneNumber : this.orderPhoneNum1+"-"+this.orderPhoneNum2+"-"+this.orderPhoneNum3,
                                orderEmail: this.orderEmail1+"@"+this.orderEmail2,

                            }
                        /* 결제 검증 */
                        this.$axios.post("http://localhost:3000/api/onlyPointPayments/complete", data, {withCredentials: true})
                        .then((res)=>{
                            if(res.data.success){
                                console.log("거래상태 페이지로 이동")
                            }
                            else{
                                
                                console.log("위조")
                            }
                        })
                        .catch((err)=>{
                            console.log(err);
                        })
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }
                else{ // 취소
                    return false;
                }
            }
            var IMP = window.IMP;
            IMP.init('imp15190037');
            IMP.request_pay({
                pg : 'html5_inicis',
                pay_method : 'card',
                merchant_uid : 'merchant_' + new Date().getTime(),
                name : this.title,
                amount : this.totalMoney,
                buyer_email : this.orderEmail1 + "@" + this.orderEmail2,
                buyer_name : this.orderName,
                buyer_tel : this.orderPhoneNum1 + "-" + this.orderPhoneNum2 + "-" + this.orderPhoneNum3,
                buyer_addr : this.orderDefaultAddress + " " + this.orderRemainAddress,
                custom_data : [{"productNo" : this.$route.params.no,
                                "loginId" : this.loginId,
                                "memberPoint" : this.memberPoint,
                                /* 주문자 정보 */
                                "orderName": this.orderName,
                                "orderDefaultAddress": this.orderDefaultAddress,
                                "orderRemainAddress" : this.orderRemainAddress,
                                "orderPhoneNumber" : this.orderPhoneNum1+"-"+this.orderPhoneNum2+"-"+this.orderPhoneNum3,
                                "orderEmail": this.orderEmail1+"@"+this.orderEmail2,}]
            }, function (rsp) { // callback
                if (rsp.success) { // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
                    console.log("성공")
                    let data = {
                                imp_uid: rsp.imp_uid,
                                merchant_uid: rsp.merchant_uid,
                                custom_data : rsp.custom_data, 
                            }
                    axios.post("http://localhost:3000/api/directPayments/complete", data, {withCredentials: true})
                    .then((res)=>{
                        if(res.data.success){
                            alert("결제에 성공하였습니다.");
                            router.push({ path: `/product/${productNo}/sellerPage`}).catch(() => {});
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })   
                } 
                else {
                    alert("결제에 실패하였습니다. 에러 내용: " +  rsp.error_msg);        
                }
            });
        },  
    }
}

</script>

<style scoped>
    body{
        padding-top: 189px;
    }
    .payment_wrap{
        width: 1180px;
        height: auto;
        margin: auto;
        padding: 30px 0px 30px 0px;
    }
    .payment_wrap h2{
        text-align: left;
    }
    .payment_wrap p{
        text-align: left;
        padding: 30px 0px 5px 0px;
        color: black;
        border-bottom: solid 2px black;
    }
    /* 테이블 */
    .table{
        width: 1180px;
        border-top: solid 1px #DADCE0;
        border-collapse: collapse;
    }
    th, td{
        border-bottom: solid 1px #DADCE0;
        padding: 10px;
    }
    /* 주문하시는 분 */
    .order_name{
        display: flex;
        font-size: 18px;
        padding: 20px 0px 20px 0px;
        border-bottom: solid 1px #DADCE0;
    }
    .name_title{
        width: 150px;
        text-align: left;
    }
    .name_title span{
        color: red;
    }
    .name_input input{
        width: 200px;
        height: 26px;
    }
    /* 주소 */
    .order_address{
        display: flex;
        font-size: 18px;
        padding: 20px 0px 20px 0px;
        border-bottom: solid 1px #DADCE0;
        
    }
    .address_title{
        width: 150px;
        text-align: left;
    }
    .address_btn{
        width: 70px;
        height: 30px;
        padding: 6px;
        border: solid 1px #DADCE0;
        cursor: pointer;
    }
    .address_title span{
        color: red;
    }
    .address_input{
        text-align: left;
    }
    .address_input input{
        width: 400px;
        height: 26px;
        margin: 5px 0px 5px 0px;
    }
    .address_input span{
        padding-left: 10px;
    }
    /* 휴대전화 */
    .order_phone{
        display: flex;
        font-size: 18px;
        padding: 20px 0px 20px 0px;
        border-bottom: solid 1px #DADCE0;
    }
    .phone_title{
        width: 150px;
        text-align: left;
        line-height: 40px;
    }
    .phone_title span{
        color: red;
    }
    .phone_input{
        text-align: left;
    }
    .phone_select select{
        width: 54px;
        height: 30px;
        margin-top: 5px;
    }
    .phone_input input{
        width: 50px;
        height: 26px;
        margin: 5px 0px 5px 0px;
    }
    .phone_input span{
        padding: 0px 10px 0px 10px;
    }
    /* 이메일 */
    .order_email{
        display: flex;
        font-size: 18px;
        padding: 20px 0px 20px 0px;
        border-bottom: solid 1px #DADCE0;
    }
    .email_title{
        width: 150px;
        text-align: left;
        line-height: 40px;
    }
    .email_title span{
        color: red;
    }
    .email_input input{
        width: 150px;
        height: 26px;
        margin: 5px 0px 5px 0px;
    }
    .email_input span{
        padding: 0px 10px 0px 10px;
    }
    .email_select select{
        width: 100px;
        height: 30px;
        margin-top: 5px;
        margin-left: 5px;
    }
    /* 배송지 선택 */
    .select_destination{
        display: flex;
        padding: 20px 0px 20px 0px;
    }
    .destination_title{
        width: 150px;
        text-align: left;
    }
    .destination_input{
        padding-right: 10px
    }
    .destination_input input{
        margin-right: 5px
    }
    /* 결제 */
    .total_payment{
        padding: 10px 0px 0px 0px;
        display: flex;
        background: #f8fafa;
    }
    .total_amount{
        width: 150px;
        text-align: left;
    }
    .won{
        width: 150px;
        text-align: left;
    }
    .member_point{
        display: flex;
        padding: 10px 0px 0px 0px;
        background: #f8fafa;
    }
    .remain_point{
        display: flex;
        padding: 10px 0px 0px 0px;
        background: #f8fafa;
    }
    .final_payment{
        display: flex;
        padding: 10px 0px 10px 0px;
        background: #f8fafa;
        color: red;
    }
    .payment_btn{
        width: 150px;
        height: 50px;
        line-height: 50px;
        background: black;
        color: white;
        border-radius: 3px;
        cursor: pointer;
    }

</style>
