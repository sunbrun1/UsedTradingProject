<template>
    <section>
        <Header></Header>
        <body>
            
            <Loginmodal @close="closeModal" v-if="modal"></Loginmodal>
            <div class="product_wrap">
                <!-- 사진 슬라이드 -->
                <div class="images_container">
                    <div>
                        <!-- 이미지 -->
                        <img :src="`http://localhost:3000/`+ image[currentNumber]" width="500" height="500"/>
                    </div>
                    <!-- 이미지 슬라이드 -->
                    <div class="image_slider_container">
                        <div class="image_slider" v-for="(item,index) in imageSlider" :key="index" @click="imageClick(index)">
                            <img :src="`http://localhost:3000/`+ item" width="100" height="100" />
                        </div>
                    </div>
                    <!-- 이전버튼 -->
                    <div class="previous" v-if="image.length > 4 && sliderStartIndex > 0" @click="previous">
                        <font-awesome-icon icon="chevron-left"/>
                    </div>
                    <!-- 다음버튼 -->
                    <div class="next" v-if="image.length > 4 && sliderEndIndex < image.length" @click="next">
                        <font-awesome-icon icon="chevron-right"/>
                    </div>
                </div>
                <!-- 카테고리,제목,가격,상태,지역... -->
                <div class="info_container">
                    <!-- 카테고리 -->
                    <div class="category">
                        {{category_large_name}}<span>></span>{{category_medium_name}}
                    </div>


                    <!-- 상품이름 -->
                    <div class="name">
                        {{title}}
                    </div>
                    <!-- 상품 가격 -->
                    <div class="price">
                        {{price.toLocaleString('ko-KR')}} 원
                    </div>


                    <!-- 찜/조회수/날짜/신고하기 -->
                    <div class="views">
                        <font-awesome-icon icon="heart" class="font"/><span>{{dibs}}</span>
                        <font-awesome-icon icon="eye" class="font"/><span>{{views}}</span>
                        <font-awesome-icon icon="clock" class="font"/><span>{{date}}</span>
                    </div>

                    <!-- 상품상태 -->
                    <div class="state">
                        <span>상품 상태</span> {{state}}
                    </div>
                    <!-- 거래지역 -->
                    <div class="area">
                        <span>거래 지역</span> {{area}}
                    </div>


                    <!-- 바로구매,연락하기,찜 버튼  -->
                    <!-- 다른 유저 게시물인 경우 -->
                    
                    <div class="button_wrap" v-if="myProductCheck">
                        <!-- 바로구매 -->
                        <div class='button_wrap_item buy' @click="paymentPage">
                            바로구매
                        </div>
                        <!-- 연락하기 -->
                        <div class='button_wrap_item talk' @click="talk">
                            연락하기
                        </div>
                        <!-- 찜 -->
                        <div class='button_wrap_item wish' @click="dibsAdd" :class="{red:dibsState, blue: !dibsState}">
                            <font-awesome-icon icon="heart" class="font"/> 찜
                        </div>
                    </div>
                    <!-- 내 게시물인 경우  -->
                    <div class="button_wrap" v-else>
                        <!-- 라우터 이동 -->
                        <div class="mypage" @click="mypage">
                            <button>마이페이지 이동</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 상품정보 -->
            <div class="product_content_title">
                <h2>상품 정보</h2>
            </div>

            <!-- 얇은 구분선 -->
            <div class="long_thin_line"></div>

            <div class="product_content_content">
                {{content}}
            </div>
            
        </body>
    </section>
</template>

<script>
import Loginmodal from '@/components/Member/Login_modal'; 
import Header from '@/components/Header.vue'
import axios from 'axios';

export default {
    components:{Loginmodal,Header},
    data(){
        return{
            /* 상품정보 */
            title:'',  // 상품 제목
            price:'', // 상품 가격
            content:'', // 상품 내용
            category_large_name:'', // 상품 대분류 이름
            category_medium_name:'', // 상품 중분류 이름
            state:'', // 상품 상태 
            area:'', // 거래지역
            views:'', // 상품 조회수
            date:'', // 상품 등록 시간
            dibs:0, // 찜 개수
            image:'', //상품 이미지
            /* 이미지 슬라이드 */
            imageSlider:0,
            sliderStartIndex:0, // 시작인덱스
            sliderEndIndex:4, // 종료인덱스
            currentNumber: 0, // 현재 인덱스 값
            /* 로그인모달 상태 */
            modal:false,
            /* 상태 값*/
            myProductCheck:true, // 내 게시물인지 확인하는 변수
            memberNum:'', //유저 ID 넘버
            dibsState:false, // 찜 상태
            productCount:0
            
    
        }
    },
    mounted() {
        this.getProductInfo();   
	},
	methods:{
        /* 로그인창 열기 */
        openModal() {
            this.modal = true;
        },
        /* 로그인창 닫기 */
        closeModal() {
            this.modal = false;
        },
        /* 상품 정보 조회 */
		async getProductInfo() {
            try{
                /* 로그인여부 확인, 로그인유지 */
                await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})

                const productNo = this.$route.params.no; // 상품 넘버
                const res = await axios.get("http://localhost:3000/api/board/product/" + productNo, {withCredentials: true})
                /* 상품정보 */
                const productInfo = res.data.productInfo[0]; // 상품 데이터
                this.title = productInfo.title; // 상품 제목
                this.price = productInfo.price; // 상품 가격
                this.content = productInfo.content; // 상품 내용
                this.category_large_name = productInfo.category_large_name; // 상품 대분류 이름
                this.category_medium_name = productInfo.category_medium_name; // 상품 중분류 이름
                this.state = productInfo.state; // 상품 상태 
                this.area = productInfo.area; // 상품 거래지역 
                this.views = productInfo.views; // 상품 조회수
                this.date = this.timeForToday(productInfo.date)
                this.dibs = productInfo.dibs; // 상품 찜 개수
                this.image = productInfo.image_name.split(','); //상품 이미지
                /* 상품 이미지 슬라이드 */
                this.imageSlider = this.image.slice(this.sliderStartIndex,this.sliderEndIndex); // 상품 이미지 슬라이드
                /* 유저넘버 */
                this.memberNo = res.data.memberNo; //유저 ID 넘버

                if(res.data.myProduct){ // 내 게시물인 경우
                    this.myProductCheck = false;  
                }
                else{ // 다른 유저 게시물인 경우 
                    this.myProductCheck = true; 
                }

                if(res.data.dibsState){ // 찜하기 한 상태
                    this.dibsState = true;
                }
                else{ // 찜하기 안한 상태
                    this.dibsState = false;
                }
                this.views = this.views + 1;
            }catch(err){
                console.log(err);
            }
		},

        /* 이미지 이전 */ 
        previous(){
            this.sliderStartIndex = this.sliderStartIndex - 1;
            this.sliderEndIndex = this.sliderEndIndex - 1;
            this.imageSlider = this.image.slice(this.sliderStartIndex,this.sliderEndIndex);
        },
        /* 이미지 다음 */
        next(){
            this.sliderStartIndex = this.sliderStartIndex + 1;
            this.sliderEndIndex = this.sliderEndIndex + 1;
            this.imageSlider = this.image.slice(this.sliderStartIndex,this.sliderEndIndex);
        },
        /* 이미지 클릭 */
        imageClick(index){
            this.currentNumber = this.image.indexOf(this.imageSlider[index]);
        },
        /* 결제페이지 이동 */
        async paymentPage(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                const res = await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
                if(res.data.success){ // 로그인 상태
                    const productNo = this.$route.params.no;
                    this.$router.push({ path: `/product/${productNo}/payment`});
                }
                else{ // 비로그인 상태
                    this.openModal();
                }
            }catch(err){
                console.log(err);
            }
        },
        /* 연락하기 페이지 이동 */
        async talk(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                const res = await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
                if(res.data.success){ // 로그인 상태
                    const memberNo = this.memberNo; // 회원넘버
                    const productNo = this.$route.params.no; // 상품넘버
                    window.open('http://localhost:8081/talk/user/' + memberNo + "?isDirect=true&product_no=" + productNo, "PopupWin", "width=380,height=670");
                }
                else{ // 비로그인 상태
                    this.openModal();
                }
            }catch(err){
                console.log(err);
            }
        },
        /* 찜하기 */
        async dibsAdd(){
            try{
                /* 로그인여부 확인, 로그인유지 */
                const res = await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
                if(res.data.success){ // 로그인 상태
                    const productNo = this.$route.params.no;
                    /* 찜하기 POST */
                const res = await axios.get("http://localhost:3000/api/board/product/"+ productNo + "/dibs", {withCredentials: true})
                    if(res.data.success){ // 찜하기
                        this.dibsState = true;
                        this.dibs = this.dibs + 1
                    }
                    else{ // 찜하기 취소
                        this.dibsState = false;
                        this.dibs = this.dibs - 1
                    }   
                
                }
                else{ // 비로그인 상태
                    this.openModal();
                }
            }catch(err){
                console.log(err);
            }
        },
        /* 마이페이지 이동 */
        mypage(){
            this.$router.push({ path: "/mypage/myproduct/list?no=1"});
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
    background: #ffffff;
    font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}
/* 짧얇은 구분선 */
.short_thin_line{
    width: 700px;
    height: 1px;
    margin: auto;
    background-color: #DADCE0;
}
/* 길얇은 구분선 */
.long_thin_line{
    width: 1180px;
    height: 1px;
    margin: auto;
    background-color: #DADCE0;
}
/* === 상품 wrap === */
.product_wrap{
    width: 1180px;
    height: 630px;
    margin: auto;
    text-align: left;
    padding-top: 40px;
    display: flex;
}
/* 이미지 컨테이너 */
.images_container{
    width: 500px;
    height: 650px;
    position: relative;
}
/* 이미지 슬라이더 */
.image_slider_container{
    display: flex;
}
/* 이미지 슬라이더 img */
.image_slider{
    padding: 7px;
    border: solid 1px #DADCE0;
    cursor: pointer;
}
/* 이미지 슬라이더 img */
.image_slider:not(:nth-child(4n)){
    margin-right: 12px;
}
/* 이미지 이전버튼 */
.previous{
    width: 40px;
    height: 40px;
    background: white;
    text-align: center;
    font-size: 22px;
    border-radius: 50px;
    position: absolute;
    bottom: 65px;
    cursor: pointer;
}
/* 이미지 다음버튼 */
.next{
    width: 40px;
    height: 40px;
    text-align: center;
    background: white;
    font-size: 22px;
    border-radius: 50px;
    position: absolute;
    left: 460px;
    bottom: 65px;
    cursor: pointer;
}
/* 이미지 이전버튼 */
.previous:hover{
    color: #009fe5;
}
/* 이미지 다음버튼 */
.next:hover{
    color: #009fe5;
}
/* ==== 상품 정보 ==== */
.info_container{
    width: 580px;
    height: 630px;
    padding-left: 100px;
}
/* 메인 카테고리*/
.category{
    font-size: 16px;
    padding-bottom: 20px;
    border-bottom: solid 1px#DADCE0;
}
/* 서브 카테고리 */
.category span{
    padding: 0px 10px 0px 10px;
}
/* 상품 이름 */
.name{
    font-size: 26px;
    padding-top: 12px;
    padding-bottom: 12px;
    color: #212121;
}
/* 상품 가격 */
.price{
    font-size: 40px;
    padding-top: 12px;
    padding-bottom: 12px;
    color: #212121;
    border-bottom: solid 1px#DADCE0;
}
/* 찜/조회수/날짜/신고하기 */
.views{
    padding: 12px 0px 12px 0px;
    color: #cccccc;
}
 /* 찜/조회수/날짜/신고하기 */
.views span{
    padding: 0px 20px 0px 5px;
}
/* 상품 상태 */
.state{
    padding: 12px 0px 12px 0px;
}
.state span{
    color: #cccccc;
}
/* 거래지역 */
.area{
    padding: 12px 0px 12px 0px;
}
.area span{
    color: #cccccc;
}
.ea_container{
    padding: 12px 0px 12px 0px;
    display: flex;
}
.title{
    width: 75px;
    font-size: 22px;
}

/* 바로구매,연락하기,찜 버튼  */
.button_wrap{
    padding-top: 12px;
    padding-bottom: 12px;
}

/* 버튼 */
.button_wrap_item{
    width: 175px;
    height: 53px;
    line-height: 53px;
    border: solid 1px #19b2f5;
    color: #19b2f5;
    text-align: center;
    float: left;
    margin-right: 10px;
    cursor: pointer;
}

/* 바로구매마우스오버 */
.button_wrap_item.buy:hover{
    background: #19b2f5;
    color: white;
}
/* 연락하기 마우스오버 */
.button_wrap_item.talk:hover{
    background: #19b2f5;
    color: white;
}
/* 찜 마우스오버 */
.button_wrap_item.wish:hover{
    background: #19b2f5;
    color: red;
}
/* 마이페이지 이동 버튼 */
.mypage button{
    outline: 0;
    border: 0;
    background: white;
    font-size: 18px;
    cursor: pointer;
}
.mypage{
    width: 400px;
    height: 53px;
    line-height: 53px;
    border: solid 1px black;
    text-align: center;
    float: left;
    margin-right: 10px;
    cursor: pointer;
}
/* ============ 상품 정보 =============== */
.product_content_title{
    width: 1180px;
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
    width: 1180px;
    height: 500px;
    margin: auto;
    text-align: left;
    padding-top: 30px;
}
.red{
    color: red;
}
.blue{
    color: #19b2f5;
}
</style>