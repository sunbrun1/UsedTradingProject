<template>
    <body>
        <div class="product_info">
            <!-- 사진 슬라이드 -->
            <div class="product_info_item images">
                <div>
                    <img :src="`http://192.168.219.100:3000/`+image[currentNumber]" width="400" height="400"/>
                    <div class="previous" v-if='currentNumber>0' @click="previous">
                        <font-awesome-icon icon="arrow-alt-circle-left"/>
                    </div>
                    <div class="next" v-if='currentNumber<image.length-1' @click="next">
                        <font-awesome-icon icon="arrow-alt-circle-right"/>
                    </div>
                </div>
            </div>
            <!-- 카테고리,제목,가격,상태,지역... -->
            <div class="product_info_item info">
                <div class="product_category">
                    {{category_large_name}}<span>></span>{{category_medium_name}}
                </div>

                <!-- 얇은 구분선 -->
                <div class="short_thin-line"></div>

                <div class="product_name">
                    {{title}}
                </div>
                <div class="product_price">
                    {{price.toLocaleString('ko-KR')}} 원
                </div>

                <!-- 얇은 구분선 -->
                <div class="short_thin-line"></div>

                <div class="product_state">
                    상품 상태 {{state}}
                </div>
                <div class="product_area">
                    거래 지역 경기도 / 수원시 / 권선구
                </div>

                <!-- 얇은 구분선 -->
                <div class="short_thin-line"></div>

                <div class="product_btn">
                    <div class>
                        <button class='product_btn_item buy'>구매하기</button>
                    </div>
                    <div>
                        <button class='product_btn_item chat'>연락하기 </button>
                    </div>
                    <div>
                        <button class='product_btn_item wish'>관심목록 추가 </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="image_slide">
            <div class="image_slide_item" v-for="(item) in image" :key="item.id">
                <button></button>
            </div>
        </div>

        <!-- 상품정보 -->
        <div class="product_content_title">
            <h2>상품 정보</h2>
        </div>


        <!-- 얇은 구분선 -->
        <div class="long_thin-line"></div>


        <div class="product_content_content">
            {{content}}
        </div>
        

        
        

    </body>
</template>


<script>
export default {
    data(){
        return{
            product:'',
            image:[],
            title:'',
            category_large_name:'',
            category_medium_name:'',
            state:'',
            price:'',
            content:'',
            currentNumber: 0
        }
    },
    mounted() {
		this.getList();
	},
	methods:{
        previous(){
            this.currentNumber -= 1
        },
        next(){
            this.currentNumber += 1
        }
        ,
		getList() {
			this.$axios.get("http://localhost:3000/api/board/product/" + this.$route.params.id)
			.then((res)=>{
                this.product = res.data.product;
                for(var i=0; i<this.product.length; i++){
                    this.image.push(this.product[i].image_name);
                }
                this.title = this.product[0].title;
                this.price = this.product[0].price;
                this.category = this.product[0].category;
                this.content = this.product[0].content;
                this.category_large_name = this.product[0].category_large_name;
                this.category_medium_name = this.product[0].category_medium_name;
                this.state = this.product[0].state;
			})
			.catch((err)=>{
				console.log(err);
			})
		}
	}
}
</script>


<style scoped>
body{
    padding-top: 186px;
    background: #ffffff;
}
.product_info{
    width: 960px;
    height: 400px;
    margin: auto;
    text-align: left;
    padding-top: 30px;
}
.product_info_item{
    float: left;
}
.product_info_item.images{
    width: 400px;
    height: 400px;
}
.product_info_item.info{
    width: 500px;
    height: 400px;
    float: right;
}
.product_category{
    font-size: 15px;
    padding-bottom: 12px;
}
.product_category span{
    padding: 0px 10px 0px 10px;
}
.product_name{
    font-size: 25px;
    padding-top: 12px;
    padding-bottom: 12px;
}
.product_price{
    font-size: 30px;
    padding-top: 12px;
    padding-bottom: 12px;
}
.previous{
    padding-left: 10px;
    font-size: 50px;
    float: left;
    position: relative;
    bottom: 240px;
    opacity: 60%;
    cursor: pointer;
}
.next{
    padding-right: 10px;
    font-size: 50px;
    float: right;
    position: relative;
    bottom: 240px;
    opacity: 60%;
    cursor: pointer;
}
/* 짧얇은 구분선 */
    .short_thin-line{
        width: 500px;
        height: 1px;
        margin: auto;
        background-color: #DADCE0;
    }
    /* 길얇은 구분선 */
    .long_thin-line{
        width: 960px;
        height: 1px;
        margin: auto;
        background-color: #DADCE0;
    }
    .product_state{
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .product_area{
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .product_btn{
        padding-top: 10px;
        padding-bottom: 10px;
    }
    .product_btn_item{
        float: left;
        padding: 10px;
        margin-right: 5px;
        
    }
    /* 이미지 슬라이드 */
    .image_slide{
        width: 400px;
        height: 30px;
        margin: auto;

    }
    .image_slide_item{
        float: left;
      

    }
    .image_slide button{
        width: 10px;
        height: 10px;
        cursor: pointer;
        outline: none;
        border: 1px solid rgb(136, 136, 136);
        border-radius: 50%;
        margin-right: 10px;
        

    }
    /* ============ 상품 정보 =============== */
    .product_content_title{
        width: 960px;
        margin: auto;
        text-align: left;
        padding-top: 30px;
    }
    /* 상품정보 */
     .product_content_title h2{
         padding-bottom: 30px;
     }
     /* 내용 */
     .product_content_content{
        width: 960px;
        margin: auto;
        text-align: left;
        padding-top: 30px;
     }
</style>