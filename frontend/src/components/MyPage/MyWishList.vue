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
                    <!-- 관심목록 wrap -->
                    <div class="wishlist_wrap">
                        <div class="title">
                            <h2>관심목록</h2>
                        </div>
                        <!-- 신규상품 리스트 -->
                        <div class="wishlist_container" v-if="wishList.length > 0">
                            <div class="wishlist" v-for="(item) in wishList" :key="item.id">
                                <!-- 라우터 이동 -->
                                <router-link :to="{ name: 'productDetail', params: { no: item.product_no }}">
                                    <!-- 상품이미지 -->
                                    <div class="image">
                                        <img :src="`http://localhost:3000/`+item.thumbnail" width="212" height="212"/>
                                    </div>
                                    <!-- 상품 이름 -->
                                    <div class="name">
                                        {{item.title}}
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
                                </router-link>
                            </div>
                            <div class="paging">
                                <ul>
                                    <!-- 이전 버튼 -->
                                    <ul>
                                        <router-link :to="{ path: '/mypage/mywishlist', query: { no: (startPageIndex - 1) * listRowCount}}" @click.native="movePage(endPageIndex - 1)">
                                            <li class="page-item" v-if="prev">
                                                <span aria-hidden="true">&laquo;</span>      
                                            </li>
                                        </router-link>
                                    </ul>
                                    
                                    <!-- 페이징 -->
                                    <ul v-for="index in endPageIndex-startPageIndex + 1 " :key="index">
                                        <router-link :to="{ path: '/mypage/mywishlist', query: { no: (startPageIndex+index) -1}}">
                                            <li class="page-item">    
                                                {{startPageIndex+ index -1 }}
                                            </li>
                                        </router-link>
                                    </ul>

                                    <!-- 다음버튼 -->
                                    <ul>
                                        <router-link :to="{ path: '/mypage/mywishlist', query: { no: (endPageIndex + 1) * listRowCount}}" @click.native="movePage(endPageIndex + 1)">
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
            </form>
        </body>
    </section>
</template>

<script>
import Header from '@/components/Header.vue'
import MyPageSidebar from '@/components/MyPage/MyPageSidebar.vue'

export default {
    components: {Header,MyPageSidebar},
    data(){
        return{
            wishList:"",

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

            pageLimit : 12, //pageLimit = listRowCount sql 2개만 출력
            pageOffset : 0 
        }
    },
    watch: {
        '$route' (to, from) { 
            if(to.query.no != from.query.no){
                this.getWishList();
                this.myProductCount();
            }
        }
    },
    mounted() {
		this.getWishList();
        this.myProductCount();
	},
	methods:{
        /* 페이지 이동 */
        movePage( param ) {
            this.currentPageIndex = param;
            this.myProductCount();
            this.initUI();
        },
        /* 상품 데이터 조회 */
        getWishList() {
            /* 로그인 여부 확인 */
            this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
            .then(()=>{
                this.$axios.get("http://localhost:3000/api/mypage/wishlist",{
                    withCredentials: true,
                    params: {
                        limit : this.pageLimit,
                        offset : (this.$route.query.no - 1) * this.pageLimit
                    }
                })
                .then((res)=>{
                    this.wishList = res.data.wishList; // 신규상품

                    // 신규상품 등록 시간
                    for(let i=0;  i<this.wishList.length; i++){
                        this.wishList[i].date = this.timeForToday(this.wishList[i].date)
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
        /* 초기 페이징 화면 */
        myProductCount(){
            /* 로그인 여부 확인 */
            this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
                .then(()=>{
                this.$axios.get("http://localhost:3000/api/paging/myWishListCount",{withCredentials: true})
                .then((res)=>{
                    this.totalListItemCount = res.data.count[0].count; 
                    console.log(this.totalListItemCount)
                    this.initUI();
                })
                .catch((err)=>{
                    console.log(err);
                })
            })
            .catch((err)=>{
                console.log(err);
            })
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
    .mypage{
        width: 1180px;
        height: 800px;
        margin: auto;
        display: flex;
    }
    .wishlist_wrap{
        margin-top: 30px;
        margin-left: 30px;
        padding-top: 189px;
    }
    .title{
        text-align: left;
        padding-bottom: 30px;
    }
    /* 신규상품 container */
    .wishlist_container{
        width: 929px;
        height: auto;
        overflow: hidden;
        margin: auto;
        display: flex;
        flex-flow: wrap;
    }
    .wishlist{
        width: 212px;
        height: 309px;
        margin-bottom: 30px;
    }
    /* 상품 가로정렬 */
    .wishlist:not(:nth-child(4n)){
        margin-right: 27px;
    }
    /* 상품 이미지 */
    .image img{
        border-radius: 12px;
    }
    /* 상품 이름 */
    .name{
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
        text-align: left;
        padding: 0px 0px 4px 0px;
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
        color: #9b99a9;
        border: solid 1px rgb(204, 204, 204);;
        margin: 10px 5px 10px 5px;
    }

   
</style>