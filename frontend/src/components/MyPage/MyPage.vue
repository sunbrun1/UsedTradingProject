<template>
    <body>
        <div class="mypage">
            <!-- 사이드바 -->
            <div class="mypage_item sidebar">
                <!-- 마이페이지 제목 -->
                <h3 class="sidebar_title">
                    마이페이지
                </h3>
                <!-- 마이페이지 메뉴 -->
                <ul class="sidebar_item">
                    <router-link to="/mypage">
                        <li class="home">마이페이지 홈</li>
                    </router-link>
                    <router-link to="/mypage/myproduct/list">
                        <li class="myproduct">내 상품</li>
                    </router-link>
                    <li>거래상태</li>
                    <li>관심목록</li>
                    <li>포인트</li>
                    <router-link to="/mypage/memberinfo/pwcheck">
                        <li>개인정보</li>
                    </router-link>
                    <li>회원탈퇴</li>
                </ul>
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
                    <div class="mainitem point">
                        사용가능 포인트 <span>10,000 원</span>
                    </div>
                    <!-- 알림 -->
                    <div class="mainitem notice">
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
</template>

<style scoped>
    body{
        padding-top: 196px;
    }
    .mypage{
        width: 1180px;
        height: 800px;
        margin: auto;
    }
    /* 가로정렬 */
    .mypage_item{
        float: left;
    }
    /* 사이드바 */
    .sidebar{
        width: 179px;
        height: 400px;
        padding: 19px;
        border: solid 2px #DADCE0;
        margin-top: 30px;
    }
    /* 사이드바 제목 */
    .sidebar_title{
        width: 179px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding: 0px 0px 20px 0px;
        border-bottom: 1px #666 solid;
        font-size: 20px;
    }
    /* 사이드바 메뉴 */
    .sidebar_item{
        text-align: left;
        padding: 10px 0px 0px 0px;
    }
    .sidebar_item li{
        padding: 10px 0px 10px 0px;
        border-bottom: 1px solid #DADCE0;
        cursor: pointer;
    }
    .home{
        color: #19b2f5;
    }
    /* 메인 */
    .main{
        width: 929px;
        height: 140px;
        background: #F9F9FA;
        margin-top: 30px;
        margin-left: 30px;
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
</style>