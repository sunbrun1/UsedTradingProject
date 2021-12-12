<template>
    <section>
        <Header></Header>
        <body>
            <div class="orderPage">
                <h2>주문상세페이지</h2>
            </div>
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
            <div class="orderInfo_container">
                <h2>주문정보</h2>
                <div class="orderInfo_wrap">
                    <div class="order_title">주문번호</div>
                    <div class="orderInfo">{{paymentNo}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">주문일자</div>
                    <div class="orderInfo">{{paymentDate}}</div>
                </div>
            </div>

            <div class="orderInfo_container">
                <h2>주문자 정보</h2>
                <div class="orderInfo_wrap">
                    <div class="order_title">주문자명</div>
                    <div class="orderInfo">{{orderName}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">기본 주소</div>
                    <div class="orderInfo">{{orderDefaultAddress}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">나머지 주소</div>
                    <div class="orderInfo">{{orderRemainAddress}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">휴대폰 번호</div>
                    <div class="orderInfo">{{orderPhoneNum}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">이메일</div>
                    <div class="orderInfo">{{orderEmail}}</div>
                </div>
                
            </div>

            <div class="orderInfo_container">
                <h2>배송지 정보</h2>
                <div class="orderInfo_wrap">
                    <div class="order_title">주문자명</div>
                    <div class="orderInfo">{{orderName}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">기본 주소</div>
                    <div class="orderInfo">{{orderDefaultAddress}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">나머지 주소</div>
                    <div class="orderInfo">{{orderRemainAddress}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">휴대폰 번호</div>
                    <div class="orderInfo">{{orderPhoneNum}}</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">이메일</div>
                    <div class="orderInfo">{{orderEmail}}</div>
                </div>
                
            </div>

            <div class="orderInfo_container">
                <h2>결제 정보</h2>
                <div class="orderInfo_wrap">
                    <div class="order_title">상품금액</div>
                    <div class="orderNo">{{price}}원</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">차감 포인트</div>
                    <div class="orderDate">-{{paymentPoint}} point</div>
                </div>
                <div class="orderDate_wrap">
                    <div class="order_title">총 결제 금액</div>
                    <div class="orderDate">{{paymentFinal}}원</div>
                </div>
            </div>

            <div class="buyCheck_container" @click="buyCheck">
                <button>구매확정</button>
            </div>
            
        </body>
    </section>
</template>

<script>
import Header from '@/components/Header.vue'
import axios from 'axios';
export default {
    components:{Header},
    data(){
        return{
            /* 상품정보 */
            title:'',  // 상품 제목
            price:'', // 상품 가격
            content:'', // 상품 내용
            thumbnail:'', //상품 이미지
            /* 주문 정보, 배송지 정보*/
            orderName:'',
            orderDefaultAddress:'',
            orderRemainAddress:'',
            orderPhoneNum:'',
            orderEmail:'',
            /* 결제 정보 */
            paymentNo:'',
            paymentDate:'',
            paymentPoint:'',
            paymentFinal:''

        }
    },
    mounted() {
        this.getOrderInfo();
	},
	methods:{
        async getOrderInfo() {
            await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})

            const productNo = this.$route.params.no;
            const res = await axios.get(`http://localhost:3000/api/board/product/${productNo}/getOrderInfo`, {withCredentials: true})
            if(res.data.success){
                const orderInfo = res.data.orderInfo[0];
                /* 상품정보 */
                this.title = orderInfo.title;
                this.price = orderInfo.price;
                this.content = orderInfo.content;
                this.thumbnail = orderInfo.thumbnail;
                /* 주문 정보, 배송지 정보*/
                this.orderName = orderInfo.order_name;
                this.orderDefaultAddress = orderInfo.order_default_address;
                this.orderRemainAddress = orderInfo.order_remain_address;
                this.orderPhoneNum = orderInfo.order_phone_number;
                this.orderEmail = orderInfo.order_email;
                /* 결제 정보 */
                this.paymentNo = orderInfo.payment_no;
                this.paymentDate = orderInfo.payment_date;
                this.paymentPoint = orderInfo.payment_point;
                this.paymentFinal = orderInfo.payment_final;
            }

        },
        async buyCheck() {
            if (confirm("구매를 확정하시겠습니까?? ")) {
                 await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
                const productNo = this.$route.params.no;
                const res = await axios.post(`http://localhost:3000/api/board/product/${productNo}/getPaymentInfo`, {withCredentials: true})
                if(res.data.success){
                    this.$router.push({path:"/mypage/transactionStatus/list"}).catch(() => {});
                }
            }
        }
    }
}
</script>


<style scoped>
    body{
        padding-top: 189px;
        background: #ffffff;
        font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    .orderPage h2{
        width: 1180px;
        margin: auto;
        text-align: left;
        padding: 20px 0px 10px 0px;
        border-bottom: solid 2px #DADCE0;
    }
    .table{
        width: 1180px;
        margin: auto;
        padding: 20px 0px 20px 0px;
    }
    .orderInfo_container h2{
        width: 1180px;
        margin: auto;
        text-align: left;
        padding: 20px 0px 10px 0px;
        border-bottom: solid 2px #DADCE0;
    }
    .orderInfo_wrap{
        width: 1180px;
        height: 20px;
        line-height: 20px;
        margin: auto;
        padding: 20px 0px 20px 0px;
        display: flex;
        border-bottom: solid 1px #DADCE0;
    }
    .orderDate_wrap{
        width: 1180px;
        height: 20px;
        line-height: 20px;
        margin: auto;
        padding: 20px 0px 20px 0px;
        display: flex;
        border-bottom: solid 1px #DADCE0;   
    }
    .order_title{
        width: 200px;
        text-align: left;
        padding-right: 50px;
    }
    .buyCheck_container{
        margin: 20px 0px 50px 0px;
    }
    .buyCheck_container button{
        width: 100px;
        height: 50px;
    }

</style>