<template>
    <header>
        <Loginmodal @close="closeModal"  v-if="modal"></Loginmodal>
        <!-- =======상단바======= -->
        <div class="topbar_wrap">
            <div class="topbar_container">
                <ul class="topbar_item">
                    <li @click="openModal" v-if="loginStatus">로그인/회원가입</li>
                    <li @click="logout" v-else>로그아웃</li>
                    <li @click="homePage"><a href="#">앱 다운로드</a></li>
                </ul>
            </div>
        </div>

       <!-- =========로고바======== -->
       <div class="logobar_wrap">
           <!-- 로고 -->
            <div class="logo_container" @click="homePage">
                <img alt="logo" src="@/assets/근본거래11.jpg">
            </div>
            <!-- 검색창 -->
            <div class="search_container">
                <!-- 카테고리 선택창 -->
                <select name="category" v-model="categoryLargeId">
                    <option value="all">카테고리 전체</option>
                    <option value="10001">디지털/가전</option>
                    <option value="10002">여성의류</option>
                    <option value="10003">남성의류</option>
                    <option value="10004">패션잡화</option>
                    <option value="10005">뷰티미용</option>
                    <option value="10006">취미애완</option>
                    <option value="10007">스포츠레저</option>
                    <option value="10008">생활문구가구식품</option>
                </select>
                <!-- 검색 input -->
                <input type="text" v-model="search" @keyup.enter="searchPage">
                <!-- 검색 button -->
                <button type="submit" @click="searchPage">
                    <font-awesome-icon icon="search" />
                </button>
            </div>
            <!-- 판매하기,마이페이지,채팅 -->
            <div class="menu_container">
                <!-- 판매하기 -->
                <div class="sell" @click="sellPage">
                    <div>
                        <font-awesome-icon icon="won-sign" class="font"/> 
                    </div>
                    <div>
                        판매하기
                    </div>
                </div>
                <!-- 마이페이지 -->
                <div class="mypage" @click="myPage">
                    <div>
                        <font-awesome-icon icon="user" class="font"/> 
                    </div>
                    <div>
                        마이페이지
                    </div>
                </div>
                <!-- 채팅 -->
                <div class="chat" @click="talkPage">
                    <div>
                        <font-awesome-icon icon="comments" class="font"/> 
                    </div>
                    <div>
                        채팅
                    </div>
                </div>
            </div>
        </div>
         
        <!-- ======카테고리바======= -->
        <div class="categorybar_wrap">
            <div class="categorybar_container">
                <!-- 전체 카테고리 메뉴 -->
                <div class="category_all">
                    <!-- 메인 카테고리 -->
                    <ul class="maincategory">
                        <li>
                            <font-awesome-icon icon="list-ul" class="list-ul"/><span>전체 카테고리 </span>
                            <!-- 서브 카테고리 -->
                            <div class="subcategory">
                                <ul class="category_large" v-for="(largeitem,index) in categoryInfo" :key="index">
                                    <router-link :to="{ path: '/bycategory/list', query: {no: 1, categoryLargeId: largeitem.large[0][0] }}">
                                        <li class="category_large_item">
                                            {{largeitem.large[0][1]}}                                        
                                        </li>
                                    </router-link>
                                    <ul class="category_medium" v-for="(mediumitem,index1) in largeitem.medium" :key="index1">
                                  
                                        <router-link :to="{ path: '/bycategory/list', query: {no: 1, categoryLargeId: largeitem.large[0][0], categoryMediumId: mediumitem[0] }}">
                                            <li class="category_medium_item">
                                                {{mediumitem[1]}}
                                            </li>    
                                        </router-link>
                                    </ul>
                                </ul>                          
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 홈 -->
                <div class="home" @click="homePage">
                    HOME
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import Loginmodal from "@/components/Member/Login_modal"; 
import axios from 'axios';

export default {
    components:{Loginmodal},
    data(){
        return{
            modal:false, // 로그인 모달 상태 
            loginStatus:"", // 로그인 상태 (로그인/로그아웃)
            categoryInfo:[], // 카테고리데이터
            search:"", // 검색값
            categoryLargeId:"all" // 검색 카테고리 값
        }
    },
    mounted() {
        this.getCategoryInfo();
        this.loginStatusCheck();
	},
	methods:{
        /* 로그인창 열기 */
        openModal() {
            this.modal = true;
        },
        /* 로그인창 닫기 */
        closeModal() {
            this.modal = false;
        },
        /* 로그아웃 */
        async logout(){
            try{
                const res = await axios.get("http://localhost:3000/api/member/logout",{withCredentials: true})
                if(res.data.success){
                    alert("로그아웃 되었습니다")               
                    this.$router.push({path:"/"}).catch(()=>{});
                    this.loginStatusCheck();
                }
            }catch(err){
                console.log(err);
            }
        },
        // 로그인 상태 확인 렌더링
        async loginStatusCheck(){
            try{
                const res = await axios.get("http://localhost:3000/api/member/loginstatuscheck",{withCredentials: true})
                if(res.data.success){
                    this.loginStatus = false;      
                }
                else{
                    this.loginStatus = true;
                }         
            }catch(err){
                console.log(err);
            }      
        },
        /* 카테고리 정보 조회 */
        async getCategoryInfo() {
            try{
                /* 카테고리 정보 조회 */
                const res = await axios.get("http://localhost:3000/api/board/getCategoryInfo")
                this.categoryInfo = res.data.categoryInfo; //카테고리 정보 
            }catch(err){
                console.log(err);
            }
		},
        /* 판매하기 라우터 이동 */
        async sellPage(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                const res = await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true});
                if(res.data.success){
                    this.$router.push({path:"/upload"}).catch(() => {});
                }
                else{
                    this.openModal();
                }
            }catch(err){
                console.log(err);
            }
        },
        /* 마이페이지 라우터 이동 */
        async myPage(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                const res = await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true});
                if(res.data.success){
                    this.$router.push({path:"/mypage"}).catch(() => {});
                }
                else{
                    this.openModal();
                }
            }catch(err){
                console.log(err);
            }
        },
        /* 채팅페이지 라우터 이동 */
        async talkPage(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                const res = await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true});
                if(res.data.success){
                    window.open("http://localhost:8081/talk", "talkList", "width=380,height=670");
                }
                else{
                    this.openModal();
                }
            }catch(err){
                console.log(err);
            }
        },
        // 검색 라우터 이동 
        searchPage(){
           this.$router.push({ path: "/bySearch/list", query: {no: 1, categoryLargeId: this.categoryLargeId, search: this.search}}).catch(() => {});
        },
        // 홈 라우터 이동
        homePage(){
            this.$router.push({ path: "/"}).catch(() => {});
        }
        // 홈 라우터 이동
	}
}
</script>

<style scoped>      
       header{
            width: 100%;
            position: fixed;
            z-index: 999;
            background: #ffffff;
       }
       /* 상단바 wrap */
       .topbar_wrap{
            border-bottom: solid 1px #DADCE0;
       }
       /* 상단바 container  */
       .topbar_container{
            width: 1180px;
            height: 39px;
            line-height: 39px;
            margin: auto;
        }
        /* 상단바 로그인/로그아웃, 앱다운로드 오른쪽정렬 */
        .topbar_item{
           float: right;
        }
        /* 상단바 가로정렬 */
        .topbar_item li{
            float: left;
            padding-left: 15px;
            font-size: 12px;
            cursor: pointer;
        }
        /* === 로고바-wrap === */
        .logobar_wrap{
            width: 1180px;
            height: 49px;
            margin: auto;
            padding: 25px 0px 25px 0px;
            display: flex;
        }
        /* 로고바-로고 컨테이너 */
        .logo_container{
            width: 165px;
            height: 49px;
            padding: 0px 100px 0px 0px;
            cursor: pointer;
        }
        /* 로고바-검색 컨테이너 */
        .search_container{
            width: 580px;
            height: 43px;
            border: 3px solid #19b2f5;
            border-radius: 5px;
        }
        /* 로고바-검색창-셀렉트 */
        .search_container select{
            width: 170px;
            height: 43px;
            padding: 10px;
            float: left;
            font-size: 14px;
            border: 0px;
            outline: 0px;
        }
        /* 로고바-검색창-input */
        .search_container input{
            width: 355px;
            height: 23px;
            padding: 10px;
            border: 0px;
            outline: 0px;
        }
        /* 로고바-검색창-button */
        .search_container button{
            float: right;
            width: 35px;
            height: 43px;
            border: 0px;
            outline: 0px;
            cursor: pointer;
            background: #19b2f5;
            color: #ffffff;
        }
        /* === 메뉴(판매하기/마이페이지/채팅) 컨테이너 === */
        .menu_container{
            width: 244px;
            height: 49px;
            padding: 0px 0px 0px 85px;
            display: flex;
        }
        /* 메뉴-판매하기 */
        .sell{
            padding-right: 20px;
            cursor: pointer;
        }
        /* 메뉴-마이페이지 */
        .mypage{
            padding: 0px 20px 0px 20px;
            border-left:1px solid #DADCE0;
            cursor: pointer;
        }
        /* 메뉴-채팅 */
        .chat{
            padding-left: 20px;
            border-left:1px solid #DADCE0;
            cursor: pointer;
        }
        /* 메뉴-아이콘 */
        .font{
            color: #19b2f5;
        }
        
        /* === 카테고리바 wrap === */
        .categorybar_wrap{
            height: 50px;
            background: #19b2f5;
            color: #ffffff;
        }
        /* 카테고리바 container  */
        .categorybar_container{
            width: 1180px;
            height: 50px;
            margin: auto;
            line-height: 50px;
            text-align: left;
            display: flex;
        }
        /* 전체 카테고리 메뉴 */
        .category_all{
            width: 220px;
            height: 50px;
            background: #009fe5;
            cursor: pointer;  
        }
        .category_all span{
            padding-left: 12px;
        }
        /* HOME */
        .home{
            padding: 0px 30px 0px 30px;
            cursor: pointer;
        }
        .subcategory{
            width: 1180px;
            height: 320px;
            background: #ffffff;
            display: none;
            border: 1px solid #c8c8c8;
            position: relative;
        }
        /* 아이콘 */
        .list-ul{
            padding-left: 15px;
        }
        /* 대분류 카테고리 */
        .category_large{
            float: left;
            line-height: 20px;
            font-size: 22px;
            padding: 10px 21px 10px 21px;
        }
        .category_large_item{
            padding-bottom: 15px;
        }
        /* 중분류 카테고리 */
        .category_medium{
            font-size: 15px;
            padding: 4px 0px 0px 0px;
        }
        /* 호버시 서브카테고리 보이기 */
        .category_all :hover >.subcategory{
            display: block;
        }
        /* 호버시 대분류 색변경 */
        .category_large_item:hover{
            color: #19b2f5;
        }
        /* 호버시 중분류 색변경 */
        .category_medium_item:hover{
            color: #19b2f5;
        }
        
</style>

