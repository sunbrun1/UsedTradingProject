<template>
    <body>
        <!-- 신규 상품 -->
        <div class="newproduct_h2">
            <h2>신규 상품</h2>
        </div>
        <!-- 신규상품 리스트 -->
        <div class="newproduct_wrap">
            <div class="newproduct" v-for="(item) in newProduct" :key="item.id">
                <!-- 라우터 이동 -->
                <router-link :to="{ name: 'productDetail', params: { no: item.id }}">
                    <!-- 상품이미지 -->
                    <div class="image">
                        <img :src="`http://localhost:3000/`+item.thumbnail" width="214" height="200"/>
                    </div>
                    <!-- 상품 정보(상품이름,가격,날짜) -->
                    <div class="info">
                        <!-- 상품이름 -->
                        <div class="info_name">
                            {{item.title}}
                        </div>
                        <div class="bottom_info">
                            <!-- 가격 -->
                            <div class="item info_price">
                                <b>{{item.price.toLocaleString('ko-KR')}} 원</b>
                            </div>
                            <!-- 날짜 -->
                            <div class="item info_date" >
                                {{item.date}}
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div> 
        <!-- 신규 상품 더보기 -->
        <div class="more_wrap">
            <div class="more">
                <b>신규 상품</b> 더보기 >
            </div>
        </div>
        
        <!-- 인기상품 -->
        <div class="bestproduct_h2">
            <h2>인기 상품 </h2>
        </div>
        <!-- 인기상품 리스트 -->
        <div class="bestproduct_wrap">
            <div class="bestproduct" v-for="(item) in bestProduct" :key="item.id">
                <!-- 라우터 이동 -->
                <router-link :to="{ name: 'productDetail', params: { no: item.id }}">
                    <!-- 상품이미지 -->
                    <div class="image">            
                        <img :src="`http://localhost:3000/`+item.thumbnail" width="214" height="200"/>              
                    </div>
                    <!-- 상품 정보(상품이름,가격,날짜) -->
                    <div class="info">
                        <!-- 상품이름 -->
                        <div class="info_name">
                            {{item.title}}
                        </div>
                        <div class="bottom_info">
                            <!-- 가격 -->
                            <div class="item info_price">
                                <b>{{item.price.toLocaleString('ko-KR')}} 원</b>
                            </div>
                            <!-- 날짜 -->
                            <div class="item info_date" >
                                {{item.date}}
                            </div>
                        </div>
                    </div>
                </router-link>
            </div>
        </div> 
        <!-- 인기 상품 더보기 -->
        <div class="more_wrap">
            <div class="more">
                <b>인기 상품</b> 더보기 >
            </div>
        </div>
    </body>
</template>
<script>
export default {
    data(){
        return{
            newProduct:'', // 신규상품 데이터
            bestProduct:'', // 인기상품 데이터
        }
    },
    mounted() {
		this.getList();
	},
	methods:{
        /* 상품 데이터 조회 */
        getList() {
			this.$axios.get("http://localhost:3000/api/board/")
			.then((res)=>{
                this.newProduct = res.data.newProduct; // 신규상품
                this.bestProduct = res.data.bestProduct; // 인기상품

                // 신규상품 등록 시간
                for(let i=0;  i<this.newProduct.length; i++){
                    this.newProduct[i].date = this.timeForToday(this.newProduct[i].date)
                }
                // 인기상품 등록 시간
                for(let i=0;  i<this.bestProduct.length; i++){
                    this.bestProduct[i].date = this.timeForToday(this.bestProduct[i].date)
                }
			})
			.catch((err)=>{
				console.log(err);
			})
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
    padding-top: 186px;
    background: #ffffff;
}
/* 신규상품 */
/* 신규상품 h2 */
.newproduct_h2{
    width: 1180px;
    margin: auto;
    text-align: left;
    padding-top: 40px; 
    padding-bottom: 20px;
}
/* 신규상품 wrap */
.newproduct_wrap{
    width: 1180px;
    height: 575px;
    margin: auto;
}
/* 상품 가로정렬 */
.newproduct{
    float: left;
    border:1px solid #DADCE0;
    margin-bottom: 20px;
}
.newproduct:not(:nth-child(5n)){
    margin-right: 25px;
}
/* 상품정보 */
.info{
    width: 214px;
    height: 70px;
}
/* 상품이름 */
.info_name{
    width: 194px;
    text-align: left;
    padding: 8px 10px 8px 10px;
    font-size: 14px;
    overflow:hidden; 
    text-overflow:ellipsis; 
    white-space:nowrap;
}
/* 가격,날짜 info */
.bottom_info{
    width: 194px;
    height: 15px;
    line-height: 15px;
    padding: 8px 10px 0px 10px;
}
/* price date 가로정렬 */
.item{
    float: left;
}
/* 가격 */
.info_price{
    float: left;
}
/* 날짜 */
.info_date{
    float: right;
    font-size: 12px;
}
.more_wrap{
    width: 1180px;
    height: 50px;
    margin: auto;
    padding: 30px 0px 30px 0px;

    
}
.more{
    width: 320px;
    height: 50px;
    margin: auto;
    line-height: 50px;
    border: solid 1px #cfd0d4;;
    cursor: pointer;
}

/* 인기상품 */
/* 인기상품 h2 */
.bestproduct_h2{
    width: 1180px;
    margin: auto;
    text-align: left;
    padding-bottom: 20px;
}
.bestproduct_wrap{
    width: 1180px;
    height: 575px;
    margin: auto;
}
.bestproduct{
    float: left;
    border:1px solid #DADCE0;
    margin-bottom: 20px;
}
.bestproduct:not(:nth-child(5n)){
    margin-right: 25px;
}
.info{
    width: 214px;
    height: 70px;
}
.info_name{
    width: 194px;
    text-align: left;
    padding: 8px 10px 8px 10px;
    font-size: 14px;
    overflow:hidden; 
    text-overflow:ellipsis; 
    white-space:nowrap;
}
.bottom_info{
    width: 194px;
    height: 15px;
    line-height: 15px;
    padding: 8px 10px 0px 10px;
}
/* price date 가로정렬 */
.item{
    float: left;
}
.info_price{
    float: left;
}
.info_date{
    float: right;
    font-size: 12px;
}
</style>