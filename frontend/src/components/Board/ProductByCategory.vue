<template>
    <body>
        <div class="category">
            여성의류 > 블라우스
        </div>
        <div class="category_title">
            <h2>블라우스</h2>
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

    </body>
</template>

<script>
export default {
    watch: {
        '$route' (to, from) {
            if(to.path != from.path){
                this.getCategoryList();
            }
        }
    },
    data(){
        return{
            product:'',
            thumbnail:'',
            title:'',
            price:'',
            date:''
        }
    },
    mounted() {
		this.getCategoryList();
	},
	methods:{
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
		getCategoryList() {
			this.$axios.get("http://localhost:3000/api/board/getcategory/" + this.$route.params.id)
			.then((res)=>{
                this.product = res.data.product; //대분류 상품데이터
                this.thumbnail = this.product.thumbnail; //썸네일
                this.title = this.product.title; //상품 이름
                this.price = this.product.price; //상품 가격

                // 신규 상품등록 시간
                for(let i=0;  i<this.product.length; i++){
                    this.product[i].date = this.timeForToday(this.product[i].date)
                }
			})
			.catch((err)=>{
				console.log(err);
			})
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
        height: 595px;
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
</style>