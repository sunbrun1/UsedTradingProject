<template>
    <body>
        <div class="category">
            {{categoryLargeName}} <span v-if="categoryMediumName.length > 0">></span> {{categoryMediumName}}
        </div>
        <div class="category_title">
            <h2 v-if="categoryMediumName == ''">{{categoryLargeName}}</h2>
            <h2 v-else>{{categoryMediumName}}</h2>
        </div>
        <div class="newproduct">
            <div class="newproduct-item" v-for="(item) in product" :key="item.id">
                <router-link :to="`/product/` + item.id">
                    <div class="newproduct-image">
                        <img :src="`http://localhost:3000/`+item.thumbnail" width="214" height="200"/>
                    </div>
                    <div class="newproduct_info">
                        <div class="newproduct-name">
                            {{item.title}}
                        </div>
                        <div class="newproduct_item_div">
                            <div class="newproduct_item3 newproduct-price">
                                <b>{{item.price.toLocaleString('ko-KR')}} 원</b>
                            </div>
                            <div class="newproduct_item3 newproduct-date" >
                                {{item.date}}
                            </div>
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
    </body>
</template>

<script>
export default {
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
            else if(to.query.categoryMediumId != from.query.categoryMediumId){
                this.getCategoryList();
                this.myProductCount();
            }
        }
    },
    data(){
        return{
            product:'', // 상품데이터
            categoryLargeName:'', // 대분류 이름
            categoryMediumName:'', // 중분류 이름

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
    computed:{
        

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
        /* 초기 상품리스트 조회 */
        getCategoryList() {
			this.$axios.get("http://localhost:3000/api/board/bycategory/list",{
                params: {
                    categoryLargeId : this.$route.query.categoryLargeId,
                    categoryMediumId : this.$route.query.categoryMediumId,
                    limit : this.pageLimit,
                    offset : (this.$route.query.no - 1) * this.pageLimit
                }
            })
			.then((res)=>{
                this.product = res.data.product; //대분류 상품데이터
                for(let i=0;  i<this.product.length; i++){ // 신규 상품등록 시간
                    this.product[i].date = this.timeForToday(this.product[i].date)
                }
                if(res.data.success){ 
                    this.categoryLargeName = res.data.categoryLargeName;
                    this.categoryMediumName = "";

                }
                else{
                    this.categoryLargeName = res.data.categoryLargeName;
                    this.categoryMediumName = res.data.categoryMediumName;
                }
			})
			.catch((err)=>{
				console.log(err);
			})
		},
        /* 초기 페이징 화면 */
        myProductCount(){
            this.currentPageIndex = this.$route.query.no;
            this.$axios.get("http://localhost:3000/api/paging/bycategory",{
                params: {
                    categoryLargeId : this.$route.query.categoryLargeId,
                    categoryMediumId : this.$route.query.categoryMediumId
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
        padding-top: 200px;
    }
    .category{
        width: 1180px;
        margin: auto;
        text-align: left;
        padding: 40px 0px 20px 0px;
    }
    .category span{
        padding: 0px 8px 0px 8px;
    }
    .category_title{
        width: 1180px;
        margin: auto;
        text-align: left;
        padding: 20px 0px 20px 0px;
    }
    /* 신규상품 타이틀 */
    .newproduct-title{
        width: 1180px;
        margin: auto;
        text-align: left;
        padding-top: 40px; 
        padding-bottom: 20px;
    }
    .newproduct{
        width: 1180px;
        height: auto;
        overflow:hidden;
        margin: auto;
    }
    /* 상품 가로정렬 */
    .newproduct-item{
        float: left;
        border:1px solid #DADCE0;
        margin-bottom: 20px;
    }
    .newproduct-item:not(:nth-child(5n)){
        margin-right: 25px;
    }
    .newproduct_info{
        width: 214px;
        height: 70px;
    }
    .newproduct-name{
        width: 194px;
        text-align: left;
        padding: 8px 10px 8px 10px;
        font-size: 14px;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
    }
    .newproduct_item_div{
        width: 194px;
        height: 15px;
        line-height: 15px;
        padding: 8px 10px 0px 10px;
    }
    /* price date 가로정렬 */
    .newproduct_item3{
        float: left;
    }
    .newproduct-price{
        float: left;
    }
    .newproduct-date{
        float: right;
        font-size: 12px;
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