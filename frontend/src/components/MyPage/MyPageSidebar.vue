<template>
    <body>
        <div class="sidebar_wrap">
            <!-- 마이페이지 제목 -->
            <h3 class="sidebar_title">
                마이페이지
            </h3>
            <!-- 마이페이지 메뉴 -->
            <ul class="sidebar_menu" v-for="(item, index) in sidebarMenu" :key="index">
                <router-link :to = item.menuPath >
                    <li :class="{blue : item.color, black : !item.color}">{{item.menuName}}</li>
                </router-link>
            </ul>
        </div>
    </body>
</template>
<script>
    export default {
        data(){
            return{ 
                sidebarMenu: [
                    { menuName : "마이페이지 홈", menuPath : "/mypage", color : false},
                    { menuName : "내 상품", menuPath : "/mypage/myproduct/list", color : false},
                    { menuName : "거래상태", menuPath : "/abcd", color : false},
                    { menuName : "관심목록", menuPath : "/mypage/mywishlist?no=1", color : false},
                    { menuName : "포인트", menuPath : "/mypage/mypoint", color : false},
                    { menuName : "개인정보", menuPath : "/mypage/memberinfo/pwcheck", color : false},
                    { menuName : "회원탈퇴", menuPath : "/abcass", color : false},
                ],   
            }
        },
        mounted(){
            this.abcde();
        },
        methods: {
            abcde(){
                if(this.$route.path == "/mypage"){
                    this.sidebarMenu[0].color = true;
                }
                else if(this.$route.path == "/mypage/myproduct/list"){
                    this.sidebarMenu[1].color = true;
                }
                else if(this.$route.path == "/abcd"){
                    this.sidebarMenu[2].color = true;
                }
                else if(this.$route.path == "/mypage/mywishlist"){
                    this.sidebarMenu[3].color = true;
                }
                else if(this.$route.path == "/mypage/mypoint"){
                    this.sidebarMenu[4].color = true;
                }
                else if(this.$route.path == "/mypage/memberinfo/pwcheck"){
                    this.sidebarMenu[5].color = true;
                }
                else if(this.$route.path == "/mypage/memberinfo"){
                    this.sidebarMenu[5].color = true;
                }
                else if(this.$route.path == "/abcass"){
                    this.sidebarMenu[6].color = true;
                }
            }
            
        }
    }
</script>
<style scoped>
    body{
        padding-top: 196px;
    }
    /* 사이드바 */
    .sidebar_wrap{
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
        padding: 0px 0px 15px 0px;
        border-bottom: 1px #666 solid;
        font-size: 20px;
    }
    /* 사이드바 메뉴 */
    .sidebar_menu{
        text-align: left;
    }
    .sidebar_menu li{
        padding: 12px 0px 12px 0px;
        border-bottom: 1px solid #DADCE0;
        cursor: pointer;
    }
    .blue{
        color: #19b2f5;
    }
    .black{
        color: black;
    }

</style>