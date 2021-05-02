<template>
    <header>
        <!-- =======상단바======= -->
        <div class="topbar">
            <ul class="topbar_item">
                <li @click="openModal" v-if="loginStatus">로그인/회원가입</li>
                <li @click="logout" v-else>로그아웃</li>
                <Loginmodal @close="closeModal" @loginCheck="login" v-if="modal"></Loginmodal>
                <router-link to="/Test">
                <li><a href="#">앱 다운로드</a></li>
                </router-link>
            </ul>
       </div>

       <!-- 구분선 -->
       <div class="line"></div>

       <!-- =========로고바======== -->
       <div class="logobar">
           <!-- 로고 -->
            <div class="logobar_item logo">
                <router-link to="/">
                    <img alt='logo' src="@/assets/junho.png" width="225px" height="46px">
                </router-link>
            </div>
            <!-- 검색창 -->
            <div class="logobar_item searchbar">                
                <select name="job">
                    <option value="">카테고리 전체</option>
                    <option value="학생">학생</option>
                    <option value="회사원">회사원</option>
                    <option value="기타">기타</option>
                </select>
                <input type="text">
                <button type="submit">
                    <font-awesome-icon icon="search" />
                </button>
            </div>
            <!-- 판매하기,마이페이지,채팅 -->
            <div class='logobar_item_menu'>
                <!-- 판매하기 -->
                <div class="logobar_item sell" @click="loginCheckSell">
                    <div>
                        <font-awesome-icon icon="won-sign" class="font"/> 
                    </div>
                    <div>
                        판매하기
                    </div>
                </div>
                <!-- 마이페이지 -->
                <div class="logobar_item mypage" @click="loginCheckMypage">
                    <div>
                        <font-awesome-icon icon="user" class="font"/> 
                    </div>
                    <div>
                        마이페이지
                    </div>
                </div>
                <!-- 채팅 -->
                <div class="logobar_item chat" @click="loginCheckMypage">
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
        <div class="category">
            <div class="categorybar">
                <div class="categorybar_item category_all">
                    <ul class="maincategory">
                        <li>
                            <font-awesome-icon icon="list-ul" class="list-ul"/><span>전체 카테고리 </span>
                            <div class="subcategory">
                                <ul class="category_large" v-for="(largeitem,index) in categoryList" :key="index">
                                    <router-link :to="`/getcategory/` + largeitem.large[0][0]">
                                        <li class="category_large_item">
                                            {{largeitem.large[0][1]}}                                        
                                        </li>
                                    </router-link>
                                    <ul class="category_medium" v-for="(mediumitem,index1) in largeitem.medium" :key="index1">
                                        <router-link :to="`/getcategory/` +mediumitem[0]">
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
                <div class="categorybar_item home">
                    HOME
                </div>
            </div>
        </div>
        <!-- 구분선 -->
        <div class="line"></div>
    </header>
</template>

<script>
import Loginmodal from '@/components/Login_modal'; 
export default {
    components:{Loginmodal},
    data(){
        return{
            modal:false,
            loginStatus:'',
            categoryList:[],
        }
    },
    mounted() {
        this.getCategory();
        this.loginStatusCheck();
	},
	methods:{
        // 로그인창 열기
        openModal() {
            this.modal = true;
        },
        // 로그인창 닫기
        closeModal() {
            this.modal = false;
        },
        login(){
            this.loginStatus = false;
        },
        // 판매하기 로그인여부 확인
        loginCheckSell(){
            this.$axios.get("http://192.168.219.100:3000/api/member/someAPI",{withCredentials: true})
            .then((res)=>{
                if(res.data.success){
                    this.$router.push({path:'/upload'});
                }
                else{
                    this.openModal();
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        // 판매하기 로그인여부 확인
        loginCheckMypage(){
            this.$axios.get("http://192.168.219.100:3000/api/member/someAPI",{withCredentials: true})
            .then((res)=>{
                if(res.data.success){
                    this.$router.push({path:'/mypage'});
                }
                else{
                    this.openModal();
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        // 카테고리 데이터 불러오기
        getCategory() {
			this.$axios.get("http://192.168.219.100:3000/api/board/getcategory")
			.then((res)=>{
                this.categoryList = res.data.categoryList; //카테고리 리스트 데이터
			})
			.catch((err)=>{
				console.log(err);
			})
		},
        logout(){
            this.$axios.get("http://192.168.219.100:3000/api/member/logout",{withCredentials: true})
            .then((res)=>{
                if(res.data.success){
                    alert("로그아웃 되었습니다")
                    this.loginStatus = true;
                    this.$router.push({path:'/'}).catch(()=>{});
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        loginStatusCheck(){
            this.$axios.get("http://192.168.219.100:3000/api/member/loginstatuscheck",{withCredentials: true})
            .then((res)=>{
                if(res.data.success){
                    this.loginStatus = false; 
                }
                else{
                    this.loginStatus = true;
                }
                
			})
			.catch((err)=>{
				console.log(err);
			})
        }
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
       /* ========상단바======= */
       .topbar{
            width: 1180px;
            height: 40px;
            line-height: 40px;
            margin: auto;
            font-size: 12px; 
        }
        /* 오른쪽정렬 */
        .topbar_item{
            float: right;
        }
        /* 가로정렬 */
        .topbar_item li{
            float: left;
            padding-left: 15px;
            cursor: pointer;
        }

        /* =======구분선====== */
        .line{
            width: 1920px;
            height: 1px;
            background-color: #DADCE0;
        }

        /*========로고바======== */
        .logobar{
            width: 1180px;
            height: 46px;
            margin: auto;
            padding-top: 30px;
            padding-bottom: 30px;
        }
        /* 로고 */
        .logo{
            width: 225px;
            height: 46px;
        }
        /* 가로정렬 */
        .logobar_item{
            float: left;
        }
        /* 검색창 */
        .searchbar{
            width: 580px;
            height: 40px;
            border: 3px solid #19b2f5;
            border-radius: 5px;
            margin-left: 60px;
            margin-right: 40px;
        }
        /* 검색창 셀렉트 */
        .searchbar select{
            float: left;
            width: 166px;
            height: 40px;
            border: 0px;
            outline: 0px;

        }
        /* 검색창 input */
        .searchbar input{
            width: 345px;
            height: 20px;
            padding: 10px;
            border: 0px;
            outline: 0px;
            float: left;
        }
        /* 검색창 button */
        .searchbar button{
            float: right;
            width: 35px;
            height: 40px;
            border: 0px;
            outline: 0px;
            cursor: pointer;
            background: #19b2f5;
            color: #ffffff;
            
        }
        .logobar_item_menu{
            float: right;
        }
        .sell{
            padding-right: 20px;
            cursor: pointer;
        }
        .mypage{
            border-left:1px solid #DADCE0;
            padding-right: 20px;
            padding-left: 20px;
            cursor: pointer;
        }
        .chat{
            border-left:1px solid #DADCE0;
            padding-left: 20px;
            cursor: pointer;
        }
        .font{
            color: #19b2f5;
        }
        
        /* =========카테고리바========= */
        .category{
            height: 50px;
            background: #19b2f5;
            color: #ffffff;
        }
        .categorybar{
            width: 1180px;
            height: 50px;
            line-height: 50px;
            margin: auto;
            text-align: left;
        }
        .categorybar_item{
            float: left;
        }
        /* 전체카테고리 */
        .category_all{
            width: 220px;
            height: 50px;
            background: #009fe5;  
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
        .category_medium_item{
            color: #696969;
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
        .category_large_item:hover{
            color: #19b2f5;
        }
        .category_medium_item:hover{
            color: #19b2f5;
        }
        
</style>

