<template>
    <header>
        <!-- =======상단바======= -->
        <div class="topbar">
            <ul class="topbar_item">
                <li @click="openModal" @loginstate="loginOk" v-if="logincheck">로그인/회원가입</li>
                <li @click="logOut" v-else>로그아웃</li>
                <Loginmodal @close="closeModal" v-if="modal"></Loginmodal>
                <router-link to="/test">
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
                <div class="logobar_item sell" @click="checkId">
                    <div>
                        <font-awesome-icon icon="won-sign" class="font"/> 
                    </div>
                    <div>
                        판매하기
                    </div>
                </div>
                <!-- 마이페이지 -->
                <div class="logobar_item mypage">
                    <router-link to="/upload">
                        <div>
                            <font-awesome-icon icon="user" class="font"/> 
                        </div>
                        <div>
                            마이페이지
                        </div>
                    </router-link>
                </div>
                <!-- 채팅 -->
                <div class="logobar_item chat">
                    <router-link to="/upload">
                        <div>
                            <font-awesome-icon icon="comments" class="font"/> 
                        </div>
                        <div>
                            채팅
                        </div>
                    </router-link>
                </div>

            </div>
            
        </div>

        <!-- ======카테고리바======= -->
        <div class="category">
            <div class="categorybar">
                <div class="categorybar_item category_all">
                    <ul class="maincategory">
                        <li>
                            <font-awesome-icon icon="list-ul" class="list-ul"/>
                            <span>전체 카테고리 </span>
                            <div class="subcategory">
                                <ul class="subcategory_item">
                                    <li>디지털/가전</li>
                                    <li v-for="(item) in category[0].medium[0].a" :key="item" >
                                        <a href="#">{{item}}</a>
                                    </li>
                                
                                </ul>
                                <ul class="subcategory_item">
                                    <li>여성의류</li>
                                    <li v-for="(item) in category[0].medium[0].b" :key="item" >
                                        <a href="#">{{item}}</a>
                                    </li>
                                </ul>
                                <ul class="subcategory_item">
                                    <li>남성의류</li>
                                    <li v-for="(item) in category[0].medium[0].c" :key="item" >
                                        <a href="#">{{item}}</a>
                                    </li>
                                </ul>
                                <ul class="subcategory_item">
                                    <li>패션잡화</li>
                                    <li v-for="(item) in category[0].medium[0].d" :key="item" >
                                        <a href="#">{{item}}</a>
                                    </li>
                                </ul>
                                <ul class="subcategory_item">
                                    <li>뷰티/미용</li>
                                    <li v-for="(item) in category[0].medium[0].e" :key="item" >
                                        <a href="#">{{item}}</a>
                                    </li>
                                </ul>
                                <ul class="subcategory_item">
                                    <li>도서/티켓/<br>
                                        취미/애완</li>
                                    <li v-for="(item) in category[0].medium[0].f" :key="item" >
                                        <a href="#">{{item}}</a>
                                    </li>
                                </ul>
                                <ul class="subcategory_item">
                                    <li>스포츠/레저</li>
                                    <li v-for="(item) in category[0].medium[0].g" :key="item" >
                                        <a href="#">{{item}}</a>
                                    </li>
                                </ul>
                                <ul class="subcategory_item">
                                    <li>생활/문구/<br>가구/식품</li>
                                    <li v-for="(item) in category[0].medium[0].i" :key="item" >
                                        <a href="#">{{item}}</a>
                                    </li>
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
            category:[{
                large:['디지털/가전','여성의류','남성의류','패션잡화','뷰티/미용','도서/티켓/취미/애완',
                       '스포츠/레저','차량/오토바이','생활/문구/가구/식품','기타'],
                medium:[{
                    a:['모바일','가전제품','pc/모니터','노트북/넷북','카메라','주변기기'],
                    b:['원피스','스커트/치마','블라우스','니트/스웨터','자켓','티셔츠','맨투맨/후드티','가디건','청바지/스키니','트레이닝'],
                    c:['맨투맨/후드티','티셔츠','자켓','점퍼/야상','셔츠/남방','니트/스웨터','가디건','청바지','면/캐주얼바지','트레이닝','정장'],
                    d:['엑세서리','모자','지갑','신발','시계','안경/선글라스','가방','벨트/장갑'],
                    e:['스킨케어','향수','미용기기','헤어/바디','네일아트/케어','다이어트','남성 화장품','메이크업'],
                    f:['도서/책','희귀/수집품','애완용품','상품권','예술/악기'],
                    g:['축구','농구','야구','골프','볼링','자전거','등산/클라이밍','헬스/요가','캠핑','낚시','스케이트보드'],
                    i:['생활용품','주방용품','가구','식품']
                }],
            }],
            logincheck:true
        }
    },
    mounted() {
	
	},
	methods:{
        // 로그인창 열기
        openModal() {
            this.modal = true;
        },
        // 로그인창 닫기
        closeModal() {
            this.modal = false;
            this.logincheck = false;
        },
        loginOk(){
            this.logincheck = false;
        },
        // 로그인여부 확인
        checkId(){
            this.$axios.get("http://192.168.219.100:3000/api/board/someAPI",{withCredentials: true})
            .then((res)=>{
                if(res.data == 'check success'){
                    this.$router.push({path:'./upload'});
                }
                else if(res.data == 'check fail'){
                    this.openModal();
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        logOut(){
            this.$axios.get("http://192.168.219.100:3000/api/board/logout",{withCredentials: true})
            .then((res)=>{
                if(res.data == 'logout success'){
                    console.log("로그아웃 성공");
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
        }
        .mypage{
            border-left:1px solid #DADCE0;
            padding-right: 20px;
            padding-left: 20px;
        }
        .chat{
            border-left:1px solid #DADCE0;
            padding-left: 20px;
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
        /* 전체 카테고리 */
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
        }
        .subcategory{
            width: 1180px;
            height: 335px;
            background: #ffffff;
            display: none;
            border: 1px solid #c8c8c8;
            position: relative;
           

        }
        /* 서브카테고리 */
        .subcategory_item{
            float: left;
            color: black;
            line-height: 20px;
        }
        .list-ul{
            padding-left: 15px;
        }
        .category_all :hover >.subcategory{
            display: block;
        }
        .subcategory_item{
            padding: 20px 0px 10px 20px;
        }
        .subcategory_item:not(:last-child){
            padding-right: 38px;
        }
        .subcategory_item li:first-child{
            font-size: 20px;
            padding-bottom: 20px;
        }
        .subcategory_item li:not(first-child){
            font-size: 15px;
            padding-bottom: 5px;
        }
        .subcategory_item li:hover a{
            color: #1b5ac2;
        }

</style>

       