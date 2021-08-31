<template>
    <section>
        <Header></Header>
        <body>
            <div class="mypage_wrap">
                <!-- 사이드바 -->
                <div class="sidebar_wrap">
                    <MyPageSidebar></MyPageSidebar>
                </div>
                <!-- 거래상태 wrap -->
                <div class="main_wrap">
                    <div class="main_title"> 
                        <h2>거래상태</h2>
                        <div class="option">
                            <select v-model="option" @click="[getTransactionStatus(),pagingCount()]">
                                <option value="전체">전체</option>
                                <option value="판매중">판매중</option>
                                <option value="구매중">구매중</option>
                                <option value="판매완료">판매완료</option>
                                <option value="구매완료">구매완료</option>
                            </select>
                        </div>
                    </div>
                    <!-- 거래상태 컨테이너 -->
                    <div class="main_container">
                        <div class="status_list" v-for="(item, index) in productInfo" :key="index" @click="sellBuyPage(index, item.product_no)">
                            <!-- 상품이미지 -->
                            <div class="image">
                                <img :src="`http://localhost:3000/`+item.thumbnail" width="212" height="212"/>
                            </div>
                            <!-- 상품 이름 -->
                            <div class="info">
                                <div class="name">
                                    {{item.title}}
                                </div>
                                <div class="status">
                                    {{transactionStatus[index]}}
                                </div>
                            </div>
                            
                            <!-- 상품 가격 -->
                            <div class="price">
                                <b>{{item.price.toLocaleString('ko-KR')}} 원</b>
                            </div>
                            <div class="area">
                                {{item.area}}
                            </div>
                            <!-- 찜/날짜 -->
                            <div class="info">
                                <!-- 찜 개수 -->
                                <div class="dibs">
                                    <font-awesome-icon icon="heart" class="heart"/> 찜 {{item.dibs}}
                                </div>
                                <!-- 날짜 -->
                                <div class="date" >
                                    {{item.date}}
                                </div>  
                            </div>
                        </div>
                        <div class="paging">
                            <ul>
                                <!-- 이전 버튼 -->
                                <ul>
                                    <router-link :to="{ path: '/mypage/transactionStatus/list', query: { no: (startPageIndex - 1) * listRowCount}}" @click.native="movePage(endPageIndex - 1)">
                                        <li class="page-item" v-if="prev">
                                            <span aria-hidden="true">&laquo;</span>      
                                        </li>
                                    </router-link>
                                </ul>
                                
                                <!-- 페이징 -->
                                <ul v-for="index in endPageIndex-startPageIndex + 1 " :key="index">
                                    <router-link :to="{ path: '/mypage/transactionStatus/list', query: { no: (startPageIndex+index) -1}}">
                                        <li class="page-item">    
                                            {{startPageIndex+ index -1 }}
                                        </li>
                                    </router-link>
                                </ul>

                                <!-- 다음버튼 -->
                                <ul>
                                    <router-link :to="{ path: '/mypage/transactionStatus/list', query: { no: (endPageIndex + 1) * listRowCount}}" @click.native="movePage(endPageIndex + 1)">
                                        <li class="page-item" v-if="next">
                                            <span aria-hidden="true">&raquo;</span>
                                        </li>
                                    </router-link>
                                </ul>  
                            </ul>
                        </div>
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
            /* 상품정보 */
            productInfo:"", 
            transactionStatus:"", // 거래상태
            /* 옵션 */
            option:"전체",
            /* 페이징 */
            totalListItemCount: 0, //내 게시물 개수
            listRowCount: 12, // 한 페이지당 출력할 게시물 개수
            pageLinkCount: 10, //페이징 단위 
            currentPageIndex: 1, //현재 페이지
            pageCount: 0, //출력할 페이지 버튼 개수
            startPageIndex: 0,
            endPageIndex: 0,
            prev: false, //이전버튼
            next: false, //다음버튼
            /* limit offset */
            pageLimit : 12, //pageLimit = listRowCount sql 2개만 출력
            pageOffset : 0 
        }
    },
    watch: {
        '$route' (to, from) { 
            if(to.query.no != from.query.no){
                this.getTransactionStatus();
                this.pagingCount();
            }
        }
    },
    mounted() {
		this.getTransactionStatus();
        this.pagingCount();
	},
	methods:{
        sellBuyPage(index, productNo){
            if(this.transactionStatus[index] == "판매중"){
                return this.$router.push({ path: `/product/${productNo}/sellerPage2`}).catch(() => {});
            }
            if(this.transactionStatus[index] == "구매중"){
                return this.$router.push({ path: `/product/${productNo}/sellerPage2`}).catch(() => {});
            }
            if(this.transactionStatus[index] == "판매완료"){
                return alert("판매완료된 상품입니다.")
            }
            if(this.transactionStatus[index] == "구매완료"){
                return alert("구매완료된 상품입니다.")
            }
        },
        /* 페이지 이동 */
        movePage( param ) {
            this.currentPageIndex = param;
            this.pagingCount();
        },
        /* 상품 데이터 조회 */
        async getTransactionStatus() {
            try{
                /* 로그인 유지 */
                await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
                /* 상품 리스트 조회 */
                const res = await axios.get("http://localhost:3000/api/mypage/getTransactionStatus/list",{
                    withCredentials: true,
                    params: {
                        no : this.$route.query.no,
                        limit : this.pageLimit,
                        offset : (this.$route.query.no - 1) * this.pageLimit,
                        orderBy : this.option
                    }
                })
                this.productInfo = res.data.productInfo; // 상품정보
                this.transactionStatus = res.data.transactionStatus; // 거래상태

                /* 상품 등록 시간 */
                for(let i=0;  i<this.productInfo.length; i++){
                    this.productInfo[i].date = this.timeForToday(this.productInfo[i].date)
                }  
            }
            catch(err){
                console.log(err);
            }
		},
        /* 페이징 */
        async pagingCount(){
            try{
                /* 로그인 유지 */
                await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
            
                const res = await axios.get("http://localhost:3000/api/paging/transactionStatusCount",{
                    withCredentials: true,
                    params: {
                        orderBy : this.option
                    }
                })
                this.totalListItemCount = res.data.count;  // 내 상품 총 개수
                this.initUI();
            }
            catch(err){
                console.log(err);
            }  
        },
      
        /* 페이징 계산 */
        initUI(){
            this.pageCount = Math.ceil(this.totalListItemCount/this.listRowCount); 

            if((this.currentPageIndex % this.pageLinkCount) == 0 ){ 
                this.startPageIndex = ((this.currentPageIndex / this.pageLinkCount)-1)*this.pageLinkCount + 1
            }
            else{ 
                this.startPageIndex = Math.floor(this.currentPageIndex / this.pageLinkCount)*this.pageLinkCount + 1
            }

            if( (this.currentPageIndex % this.pageLinkCount) == 0 ){ //10, 20...맨마지막
                this.endPageIndex = ((this.currentPageIndex / this.pageLinkCount)-1)*this.pageLinkCount + this.pageLinkCount
            }else{ 
                this.endPageIndex =  Math.floor(this.currentPageIndex / this.pageLinkCount)*this.pageLinkCount + this.pageLinkCount;
            }
            if(this.endPageIndex > this.pageCount){ 
                this.endPageIndex = this.pageCount 
            }
            if(this.currentPageIndex <= this.pageLinkCount ){ 
                this.prev = false; 
            }else{ 
                this.prev = true; 
            }
            // 다음버튼
            if(this.endPageIndex >= this.pageCount){ 
                this.endPageIndex = this.pageCount;
                this.next = false;
            }else{
                this.next = true;
            }
        },
        /* 시간 계산 */
        timeForToday(value){
            const todayTime = new Date();
            const productTime = new Date(value);
            const betweenTime = Math.floor((todayTime.getTime() - productTime.getTime()) / 1000 / 60);
            if(betweenTime < 1) return '방금전';
            if(betweenTime < 60){
                return betweenTime + '분전';
            }
            const betweenTimeHour = Math.floor((betweenTime / 60));
            if(betweenTimeHour < 24){
                return betweenTimeHour + '시간전';
            } 
            const betweenTimeDay = Math.floor((betweenTime / 60 / 24));
            if(betweenTimeDay < 365){
                return betweenTimeDay + '일전';
            } 
        },
	}
}
</script>

<style scoped>
    body{
        font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    /* 마이페이지 wrap */
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
        margin: 30px 0px 0px 30px;
        padding-top: 196px;
    }
    .main_title{
        display: flex;
    }
    /* h2 거래상태 */
    .main_wrap h2{
        text-align: left;
        padding: 0px 20px 30px 0px;
    }
    .option{
        width: 100px;
        height: 30px;
        border: solid 1px #DADCE0;
        border-radius: 3px;
    }
    .option select{
        width: 90px;
        height: 30px;
        padding: 5px;
        float: left;
        font-size: 14px;
        border: 0px;
        outline: 0px;
    }
    /* 메인 container */
    .main_container{
        width: 929px;
        height: auto;
        overflow: hidden;
        margin: auto;
        display: flex;
        flex-flow: wrap;
    }
    .status_list{
        width: 212px;
        height: 309px;
        margin-bottom: 30px;
        cursor: pointer;
    }
    /* 상품 가로정렬 */
    .status_list:not(:nth-child(4n)){
        margin-right: 27px;
    }
    /* 상품 이미지 */
    .image img{
        border-radius: 12px;
    }
    /* 상품 이름 */
    .name{
        width: 150px;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
        text-align: left;
        padding: 0px 0px 4px 0px;
    }
    /* 거래상태 */
    .status{
        width: auto;
        height: 25px;
        line-height: 25px;
        padding: 3px;
        background: #19b2f5;
        color: white;
        font-size: 12px;
        border-radius: 50px;
    }
    /* 가격 */
    .price{
        text-align: left;
        font-size: 15px;
        padding: 0px 0px 4px 0px;
    }
    /* 거래 지역 */
    .area{
        text-align: left;
        font-size: 13px;
        padding: 0px 0px 4px 0px;
    }
    /*  */
    .info{
        display: flex;
        justify-content: space-between;
        padding: 0px 0px 4px 0px;
    }
    /* 찜 개수 */
    .dibs{
        font-size: 13px;
        color: #868E96
    }
    /* 날짜 */
    .date{
        font-size: 12px;
        color: #868E96;
    }
    .heart{
        color: red;
    }
    /* 페이징 */
    .paging{
        width: 1180px;
        height: 53px;
        margin: auto;
        text-align: center;
        padding: 30px 0px 30px 0px;
    }
    .paging ul{
        display: inline-block;
        cursor: pointer;
    }
    .page-item{
        float: left;
        width: 30px;
        height: 30px;
        line-height: 30px;
        color: #9b99a9;
        border: solid 1px rgb(204, 204, 204);;
        margin: 10px 5px 10px 5px;
    }

   
</style>