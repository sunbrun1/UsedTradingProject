<template>
    <section>
        <Header></Header>
        <body>
            <div class="bysearch_wrap">
                <div class="category_container">
                    {{categoryLargeName}}
                </div>
                <div class="searchcount_container">
                    <h2>{{search}}의 검색결과 <span class="totalListItemCount">{{totalListItemCount}}개</span></h2>
                </div>
                <!-- 상품 리스트 -->
                <div class="product_container">
                    <div class="product" v-for="(item) in product" :key="item.id">
                        <!-- 라우터 이동 -->
                        <router-link :to="{ name: 'productDetail', params: { no: item.id }}">
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
                </div> 
                <div class="paging">
                    <ul>
                        <!-- 이전 버튼 -->
                        <ul>
                            <router-link :to="{ name: 'productByCategory', query: { no: (startPageIndex - 1) * listRowCount, categoryLargeId: $route.query.categoryLargeId, categoryMediumId: $route.query.categoryMediumId}}" @click.native="movePage(endPageIndex - 1)">
                                <li class="page-item" v-if="prev">
                                    <span aria-hidden="true">&laquo;</span>      
                                </li>
                            </router-link>
                        </ul>
                        
                        <!-- 페이징 -->
                        <ul v-for="index in endPageIndex-startPageIndex + 1 " :key="index">
                            <router-link :to="{ name: 'productByCategory', query: { no: (startPageIndex+index) -1, categoryLargeId: $route.query.categoryLargeId, categoryMediumId: $route.query.categoryMediumId   }}">
                                <li class="page-item">    
                                    {{startPageIndex+ index -1 }}
                                </li>
                            </router-link>
                        </ul>

                        <!-- 다음버튼 -->
                        <ul>
                            <router-link :to="{ name: 'productByCategory', query: { no: (endPageIndex + 1) * listRowCount, categoryLargeId: $route.query.categoryLargeId, categoryMediumId: $route.query.categoryMediumId}}" @click.native="movePage(endPageIndex + 1)">
                                <li class="page-item" v-if="next">
                                    <span aria-hidden="true">&raquo;</span>
                                </li>
                            </router-link>
                        </ul>  
                    </ul>
                </div>
            </div>
        </body>
    </section>
</template>

<script>
import Header from '@/components/Header.vue'

export default {
    components: {Header},
    watch: {
        '$route' (to, from) { 
            if(to.query.no != from.query.no){
                this.getCategoryList();
                this.myProductCount();
            }
            else if(to.query.categoryLargeId != from.query.categoryLargeId){
                this.getCategoryList();
                this.myProductCount();
            }
            else if(to.query.search != from.query.search){
                this.getCategoryList();
                this.myProductCount();
            }
        }
    },
    data(){
        return{
            product:'', // 상품데이터
            categoryLargeName:'', // 대분류 이름
            search:'',

            /* 페이징 */
            totalListItemCount: 0, //내 게시물 개수
            listRowCount: 30, // 한 페이지당 출력할 게시물 개수
            pageLinkCount: 10, //페이징 단위 
            currentPageIndex: 1, //현재 페이지

            pageCount: 0, //출력할 페이지 버튼 개수
            startPageIndex: 0,
            endPageIndex: 0,
            prev: false, //이전버튼
            next: false, //다음버튼

            pageLimit : 30, //pageLimit = listRowCount sql 2개만 출력
            pageOffset : 0 
        }
    },
    mounted() {
		this.getCategoryList();
        this.myProductCount();
	},
	methods:{
        /* 페이지 이동 */
        movePage( param ) {
            this.currentPageIndex = param;
            this.myProductCount();
            this.initUI();
        },
        /* 상품리스트 조회 */
        getCategoryList() {
			this.$axios.get("http://localhost:3000/api/board/bysearch/list",{
                params: {
                    categoryLargeId : this.$route.query.categoryLargeId,
                    search : this.$route.query.search,
                    limit : this.pageLimit,
                    offset : (this.$route.query.no - 1) * this.pageLimit
                }
            })
			.then((res)=>{
                if(res.data.success){ 
                    this.categoryLargeName = res.data.categoryLargeName;
                }
                else{
                    this.categoryLargeName = res.data.categoryLargeName;
                }
                this.product = res.data.product; //대분류 상품데이터
                this.search = this.$route.query.search;
                console.log(this.product)
                for(let i=0;  i<this.product.length; i++){ // 신규 상품등록 시간
                    this.product[i].date = this.timeForToday(this.product[i].date)
                }
			})
			.catch((err)=>{
				console.log(err);
			})
		},
        /* 초기 페이징 화면 */
        myProductCount(){
            this.currentPageIndex = this.$route.query.no;
            this.$axios.get("http://localhost:3000/api/paging/bysearch",{
                params: {
                    categoryLargeId : this.$route.query.categoryLargeId,
                    search : this.$route.query.search,
                }
            })
            .then((res)=>{
                this.totalListItemCount = res.data.count[0].count; 
                this.initUI();
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
        timeForToday(value){
            const todayTime = new Date();
            const product_Time = new Date(value);
            const betweenTime = Math.floor((todayTime.getTime() - product_Time.getTime()) / 1000 / 60);
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
        padding-top: 189px;
        font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    .category_container{
        width: 1180px;
        margin: auto;
        text-align: left;
        padding: 20px 0px 20px 0px;
    }
    .category_container span{
        padding: 0px 8px 0px 8px;
    }
    .searchcount_container{
        width: 1180px;
        margin: auto;
        text-align: left;
        padding: 20px 0px 20px 0px;
    }
    .totalListItemCount{
        color: #888888;
    }
    /* 신규상품 container */
    .product_container{
        width: 1180px;
      
        margin: auto;
        display: flex;
        flex-flow: wrap;
    }
    .product{
        width: 212px;
        height: 309px;
    }
    /* 상품 가로정렬 */
    .product:not(:nth-child(5n)){
        margin-right: 30px;
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