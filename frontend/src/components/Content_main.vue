<template>
    <body>
        <!-- 신규 상품 -->
        <div class="newproduct-title">
            <h2><span>NEW ARRIVAL</span> 신규 상품 </h2>
        </div>
        
        <div class="newproduct">
            <div class="newproduct-item" v-for="(item) in new_product" :key="item.id">
                <router-link :to="`/product/` + item.id">
                    <div class="newproduct-image">
                        
                            <img :src="`http://192.168.219.100:3000/`+item.thumbnail" width="214" height="200"/>
                        
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
        
        <!-- 인기상품 -->
        <div class="popular_product-title">
            <h2>인기 상품 </h2>
        </div>

        <div class="popular_product">
            <div class="popular_product-item" v-for="(item) in popular_product" :key="item.id">
                <router-link :to="`/product/` + item.id">
                    <div class="popular_product-image">
                        
                            <img :src="`http://192.168.219.100:3000/`+item.thumbnail" width="214" height="200"/>
                        
                    </div>
                    <div class="popular_product_info">
                        <div class="popular_product-name">
                            {{item.title}}
                        </div>
                        <div class="popular_product_item_div">
                            <div class="popular_product_item3 popular_product-price">
                                <b>{{item.price.toLocaleString('ko-KR')}} 원</b>
                            </div>
                            <div class="popular_product_item3 popular_product-date" >
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
    data(){
        return{
            new_product:'',
            popular_product:'',
            thumbnail:'',
            title:'',
            price:'',
            date:''
        }
    },
    mounted() {
		this.getList();
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
		getList() {
			this.$axios.get("http://localhost:3000/api/board/")
			.then((res)=>{
                this.new_product = res.data.new_product; //신규상품
                this.popular_product = res.data.popular_product; //인기상품
                this.thumbnail = this.new_product.thumbnail; //썸네일
                this.title = this.new_product.title; //상품 이름
                this.price = this.new_product.price; //상품 가격
                console.log(this.new_product)
                // 신규 상품등록 시간
                for(let i=0;  i<this.new_product.length; i++){
                    this.new_product[i].date = this.timeForToday(this.new_product[i].date)
                }
                // 인기 상품등록 시간
                for(let i=0;  i<this.popular_product.length; i++){
                    this.popular_product[i].date = this.timeForToday(this.popular_product[i].date)
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
    padding-top: 186px;
    background: #ffffff;
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
    height: 44px;
}
/* price,date 가로정렬 */
.newproduct_item3{
    float: left;
}
.newproduct-name{
    padding: 8px 10px 0px 10px;
    text-align: left;
    font-size: 14px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    
}
.newproduct-price{
    padding: 10px 10px 10px 10px;
    float: left;
}
.newproduct-date{
    height: 24px;
    line-height: 24px;
    padding: 10px 10px 10px 36px;
    float: right;
    font-size: 12px;
}

/* 인기상품 */
/* 인기상품 타이틀 */
.popular_product-title{
    width: 1180px;
    margin: auto;
    text-align: left;
    padding-top: 40px;
    padding-bottom: 20px;
}
.popular_product{
    width: 1180px;
    height: 500px;
    margin: auto;
}
.popular_product-item{
    float: left;
    border:1px solid #DADCE0;
    margin-bottom: 20px;
}
.popular_product-item:not(:nth-child(5n)){
    margin-right: 25px;
}
.popular_product_info{
    width: 214px;
    height: 44px;
}
/* price,date 가로정렬 */
.popular_product_item3{
    float: left;
}
.popular_product-name{
    padding: 8px 10px 0px 10px;
    text-align: left;
    font-size: 14px;
    
}
.popular_product-price{
    padding: 10px 10px 10px 10px;
    float: left;
}
.popular_product-date{
    height: 24px;
    line-height: 24px;
    padding: 10px 10px 10px 36px;
    float: right;
    font-size: 12px;
}
</style>