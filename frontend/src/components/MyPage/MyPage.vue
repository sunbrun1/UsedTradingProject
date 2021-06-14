<template>
    <section>
        <Header></Header>
        <body>
            <div class="mypage_wrap">
                <!-- 사이드바 -->
                <div class="sidebar">
                    <MyPageSidebar></MyPageSidebar>
                </div>
                <!-- 메인 -->
                <div class="main_wrap">
                    <!-- 포인트,알림 -->
                    <div class="main_container">
                        <!-- 인사말 -->
                        <div class="greetings">
                            {{loginId}}님 안녕하세요!
                        </div>
                        <!-- 사용 가능한 포인트 -->
                        <div class="point">
                            사용가능 포인트 <span>{{memberPoint.toLocaleString('ko-KR')}} 원</span>
                        </div>
                        <!-- 알림 -->
                        <div class="notice">
                            <div class="Registration">
                                판매등록 <span>{{sellRegisterCount}}</span>
                            </div>
                            <div class ="icon">
                                <font-awesome-icon icon="chevron-right"/>
                            </div>
                            <div class="status">
                                <div>
                                    판매중 <span>{{sellCount}}</span>
                                </div>
                                <div>   
                                    구매중 <span>{{buyCount}}</span>
                                </div>
                            </div>
                            <div class ="icon">
                                <font-awesome-icon icon="chevron-right"/>
                            </div>
                            <div class="finish">
                                거래종료
                            </div>
                        </div>
                    </div>
                    <!-- 최근거래내역 -->
                    <div class="recent_trade">
                        <h3>
                            최근 거래내역
                        </h3>
                    </div>
                    <div class="recent_trade_item">
                        최근 거래내역이 없습니다.
                    </div>
                    <div class="recent_trade_item">
                        최근 거래내역이 없습니다.
                    </div>
                </div>
            </div>
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
            loginId: "", // 로그인ID
            memberPoint:0, // 포인트
            sellRegisterCount:0, // 판매등록
            sellCount:"", // 판매중
            buyCount:0  // 구매중
        }
    },
    mounted() {
        this.getLoginId();
		this.getMyPoint();
        this.productCount();
        this.myProductCount();
	},
	methods:{
        /* 로그인 ID 조회 */
        async getLoginId(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                const res = await axios.get("http://localhost:3000/api/member/someAPI", {withCredentials: true});
                this.loginId = res.data.loginId;
            }
            catch(err){
                console.log(err);
            }  
        },

        /* 포인트 조회 */
        async getMyPoint(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                await axios.get("http://localhost:3000/api/member/someAPI", {withCredentials: true});

                /* 포인트 조회 GET */
                const res = await axios.get("http://localhost:3000/api/mypage/getMyPoint", {withCredentials: true})
                if(res.data.success){
                    this.memberPoint = res.data.memberInfo[0].member_point;
                }
            }
            catch(err){
                console.log(err);
            }  
        },

        /* 판매등록 상품 카운트 */
        async myProductCount(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})

                /* 내 상품 총 개수 조회 */
                const res = await axios.get("http://localhost:3000/api/paging/myProductCount",{withCredentials: true})
                this.sellRegisterCount = res.data.count; // 내 상품 총 개수
            }
            catch(err){
                console.log(err);
            }         
        },

        /* 판매/구매중인 상품 카운트 */
        async productCount(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
                /* 판매중인 상품 카운트 */
                var res = await axios.get("http://localhost:3000/api/paging/transactionStatusCount",{
                    withCredentials: true,
                    params: {
                        orderBy : "판매중"
                    }
                })
                this.sellCount = res.data.count;
                /* 구매중인 상품 카운트 */
                var res = await axios.get("http://localhost:3000/api/paging/transactionStatusCount",{
                    withCredentials: true,
                    params: {
                        orderBy : "구매중"
                    }
                })
                this.buyCount = res.data.count;
            }
            catch(err){
                console.log(err);
            }  
        },

    }
}
</script>

<style scoped>
    body{
        font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    .mypage_wrap{
        width: 1180px;
        height: auto;
        margin: auto;
        display: flex;
    }
    /* 메인 */
    .main_wrap{
        width: 929px;
        height: auto;
        margin-top: 30px;
        margin-left: 30px;
        padding-top: 196px;
    }
    .main_container{
        width: 929px;
        height: auto;
        background: #F9F9FA;
    }
    /* 인사말 */
    .greetings{
        height: 30px;
        line-height: 30px;
        background: #19b2f5;
        color: #ffffff;
        text-align: left;
        padding: 5px 20px 5px 20px;
    }
    /* 포인트 */
    .point{
        text-align: left;
        padding: 20px 20px 10px 20px;
        font-size: 18px;
    }
    .point span{
        margin-left: 30px;
    }
    /* 알림 */
    .notice{
        text-align: left;
        padding: 10px 20px 10px 20px;
        font-size: 18px;
        display: flex;
    }
    .Registration{
        line-height: 50px;
    }
    .Registration span{
        margin-left: 30px;
    }
    .status{
        margin-left: 60px;
    }
    .status span{
        margin-left: 30px;
    }
    .icon{
        line-height: 50px;
        margin-left: 50px;
    }
    .finish{
        line-height: 50px;
        margin-left: 50px;
    }

    /* 최근거래내역 */
    .recent_trade{
        width: 929px;
        height: 30px;
        text-align: left;
        padding: 30px 0px 15px 0px;
        border-bottom: 1px solid #DADCE0;
    }
    .recent_trade_item{
        width: 929px;
        height: 200px;
        background: #F9F9FA;
        margin: 20px 0px 10px 0px;
    }

</style>