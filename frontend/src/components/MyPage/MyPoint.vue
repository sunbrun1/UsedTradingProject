<template>
    <section>
        <Header></Header>
        <body>
            <form>
                <div class="mypage">
                    <!-- 사이드바 -->
                    <div class="mypage_item sidebar">
                        <MyPageSidebar></MyPageSidebar>
                    </div>
                    <div class="mypoint_wrap">
                        <div class="title">
                            <h2>내 포인트</h2>
                        </div>
                        <div class="mypoint_container">
                            <div class="point_title">
                                포인트 잔액 
                            </div>
                            <div class="point_icon">
                                <font-awesome-icon icon="coins" class="coins"/>
                            </div>
                            <div class="point_won">
                                {{memberPoint.toLocaleString('ko-KR')}} 원
                            </div>
                        </div>
                        <div class="title">
                            <h2>충전하기</h2>
                        </div>
                        <div class="charging_container">
                            <div class="charging_title">
                                충전금액
                            </div>
                            <div class="charging_input">
                                <input type="text" v-model="price" placeholder="숫자만 입력해주세요."> 
                            </div>
                            <div class="charging_won">
                                원
                            </div>
                            <div class="charging_button" @click="onPayment">
                                충전
                            </div>
                           
                        </div>

                    </div>
                </div>
            </form>
        </body>
    </section>
</template>

<script>
import Header from '@/components/Header.vue'
import MyPageSidebar from '@/components/MyPage/MyPageSidebar.vue'
import axios from 'axios';

export default {
    components: {Header,MyPageSidebar},
    data(){
        return{
            memberInfo: "",
            memberId:"",
            memberPoint:0,
            memberEmail:"",
            price:0
        }
    },
    mounted() {
		this.getMemberInfo();
	},
	methods:{
        /* 개인정보 조회 */
        getMemberInfo(){
            /* 로그인 여부 확인 */
            this.$axios.get("http://localhost:3000/api/member/someAPI", {withCredentials: true})
            .then(()=>{
                /* 개인정보 조회 GET */
                this.$axios.get("http://localhost:3000/api/mypage/mypoint", {withCredentials: true})
                .then((res)=>{
                    if(res.data.success){
                        this.memberInfo = res.data.memberInfo[0];
                        this.memberId = this.memberInfo.member_id;
                        this.memberPoint = this.memberInfo.member_point;
                        this.memberEmail = this.memberInfo.member_email;
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
        onPayment() {
            var IMP = window.IMP;
            IMP.init('imp15190037');
            IMP.request_pay({
                pg : 'html5_inicis',
                pay_method : 'card',
                merchant_uid : 'merchant_' + new Date().getTime(),
                name : "포인트 충전",
                amount : this.price,
                buyer_email : this.memberEmail,
                buyer_name : this.memberId,
                buyer_tel : '010-2403-5208',
            }, function (rsp) { // callback
                if (rsp.success) { // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
                    console.log("성공")
                    let data = {
                                imp_uid: rsp.imp_uid,
                                merchant_uid: rsp.merchant_uid,
                                buyer_id : rsp.buyer_name, 
                            }
                    axios.post("http://localhost:3000/api/payments/complete", data)
                    .then((res)=>{
                        if(res.data.success){
                            alert("결제에 성공하였습니다.");
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
    .mypage{
        width: 1180px;
        height: 800px;
        margin: auto;
        display: flex;
    }
    .mypoint_wrap{
        margin-left: 30px;
        padding-top: 189px;
    }
    .title{
        margin-top: 30px;
        padding-bottom: 30px;
        text-align: left;
    }
    .mypoint_container{
        width: 550px;
        height: 80px;
        padding: 0px 10px 0px 10px;
        border: solid 1px #DADCE0;
        display: flex;
        align-items: center;
    }
    .point_title{
        width: 100px;
        font-size: 20px;
        color: #555555;
    }
    .point_icon{
        width: 100px;
        font-size: 20px;
    }
    .point_won{
        width: 300px;
        font-size: 20px;
        text-align: left;
        color: #222222;
    }
    .charging_container{
        width: 550px;
        height: 80px;
        border: solid 1px #DADCE0;
        display: flex;
        align-items: center;
    }
    .charging_title{
        width: 100px;
    }
    .charging_input{
        width: 200px;
        margin-right: 20px;
        border: solid 1px #DADCE0;
    }
    .charging_input input{
        width: 180px;
        padding: 10px;
        border: 0;
        outline: 0;
    }
    .charging_won{
        width: 100px;
        text-align: left;
    }
    .charging_button{
        width: 100px;
        height: 40px;
        line-height: 40px;
        border: solid 1px #DADCE0;
        border-radius: 3px;
        background: #19b2f5;
        color:white;
        cursor: pointer;
    }
    
  
   

   
</style>