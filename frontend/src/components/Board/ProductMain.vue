<template>
    <section>
        <Header></Header>
        <!-- 신규 상품 -->
        <body>
            <!-- 신규 상품 wrap -->
            <div class="newproduct_wrap">
                <div class="title">
                    <h2>신규 상품</h2>
                </div>
                <!-- 신규상품 리스트 -->
                <div class="newproduct_container">
                    <div class="newproduct" v-for="(item) in newProduct" :key="item.id">
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
                <!-- 신규 상품 더보기 -->
                <div class="more_wrap">
                    <div class="more">
                        <b>신규 상품</b> 더보기 >
                    </div>
                </div>
            </div>
            
            <!-- 인기 상품 wrap -->
            <div class="bestproduct_wrap">
                <div class="title">
                    <h2>인기 상품</h2>
                </div>
                <!-- 인기상품 리스트 -->
                <div class="bestproduct_container">
                    <div class="bestproduct" v-for="(item) in bestProduct" :key="item.id">
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
                <!-- 인기 상품 더보기 -->
                <div class="more_wrap">
                    <div class="more">
                        <b>인기 상품</b> 더보기 >
                    </div>
                </div>
            </div>
        </body>
    </section>
</template>
<script>
import Header from '@/components/Header.vue'
import axios from 'axios';

export default {
    components: {Header},
    data(){
        return{
            newProduct:'', // 신규상품 정보
            bestProduct:'', // 인기상품 정보
        }
    },
    mounted() {
		this.getProductList();
	},
	methods:{
        /* 상품 리스트 조회 */
        async getProductList() {
            try{
                const res = await axios.get("http://localhost:3000/api/board/getMainList");
                this.newProduct = res.data.newProduct; // 신규상품
                this.bestProduct = res.data.bestProduct; // 인기상품

                /* 신규상품 등록 시간 */
                for(let i=0;  i<this.newProduct.length; i++){
                    this.newProduct[i].date = this.timeForToday(this.newProduct[i].date)
                }
                /* 인기상품 등록 시간 */
                for(let i=0;  i<this.bestProduct.length; i++){
                    this.bestProduct[i].date = this.timeForToday(this.bestProduct[i].date)
                }
            }
            catch(err){
                console.log(err);
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
    padding-top: 189px;
    font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
/* === 신규상품 wrap === */
.newproduct_wrap{
    height: 920px;
    background: #f8f9fa;
}
.title{
    width: 1180px;
    margin: auto;
    text-align: left;
    padding-top: 40px; 
    padding-bottom: 30px;
}
/* 신규상품 container */
.newproduct_container{
    width: 1180px;
    margin: auto;
    display: flex;
    flex-flow: wrap;
}
.newproduct{
    width: 212px;
    height: 309px;
    margin-bottom: 30px;
}
/* 상품 가로정렬 */
.newproduct:not(:nth-child(5n)){
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
    color: #696969;
}
/* 가격 */
.price{
    text-align: left;
    font-size: 15px;
    padding: 0px 0px 4px 0px;
    color: black;
}
/* 거래 지역 */
.area{
    text-align: left;
    font-size: 13px;
    padding: 0px 0px 4px 0px;
    color: #696969;
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

/* 더보기 */
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
/* === 신규상품 wrap === */
.bestproduct_wrap{
    height: 800px;
}
/* 인기상품 container */
.bestproduct_container{
    width: 1180px;
    height: 697px;
    margin: auto;
    display: flex;
    flex-direction: row;
    flex-flow: wrap;
}
.bestproduct{
    width: 212px;
    height: 309px;
}
/* 상품 가로정렬 */
.bestproduct:not(:nth-child(5n)){
    margin-right: 30px;
}
</style>