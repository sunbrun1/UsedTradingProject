<template>
    <section>
        <Header></Header>
        <body>
            <div class="mypage">
                <!-- 사이드바 -->
                <div class="mypage_item sidebar">
                    <MyPageSidebar></MyPageSidebar>
                </div>
                <!-- 메인 -->
                <div class="mypage_item main">
                    <!-- 포인트,알림 -->
                    <div>
                        <!-- 인사말 -->
                        <div class="greetings">
                            김준호님 안녕하세요!
                        </div>
                        <!-- 사용 가능한 포인트 -->
                        <div class="point">
                            사용가능 포인트 <span>10,000 원</span>
                        </div>
                        <!-- 알림 -->
                        <div class="notice">
                            알림 <span>5 건</span>
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

export default {
    components: {Header,MyPageSidebar},
}
</script>

<style scoped>
    .mypage{
        width: 1180px;
        height: 800px;
        margin: auto;
    }
    /* 가로정렬 */
    .mypage_item{
        float: left;
    }
    /* 메인 */
    .main{
        width: 929px;
        height: 140px;
        background: #F9F9FA;
        margin-top: 30px;
        margin-left: 30px;
        padding-top: 196px;
    }
    /* 인사말 */
    .greetings{
        width: 889px;
        height: 30px;
        background: #19b2f5;
        color: #ffffff;
        text-align: left;
        padding: 5px 20px 5px 20px;
    }
    /* 포인트 */
    .point{
        text-align: left;
        padding: 10px 20px 10px 20px;
        font-size: 18px;
    }
    .point span{
        margin-left: 50px;
    }
    /* 알림 */
    .notice{
        text-align: left;
        padding: 10px 20px 10px 20px;
        font-size: 18px;
    }
    .notice span{
        margin-left: 140px;
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
     .sidebar_menu li{
        padding: 12px 0px 12px 0px;
        border-bottom: 5px solid #DADCE0;
        cursor: pointer;
    }
</style>