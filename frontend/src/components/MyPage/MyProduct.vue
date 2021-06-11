<template>
    <section>
        <Header></Header>
        <body>
            <div class="mypage_wrap">
                <!-- 사이드바 -->
                <div class="sidebar_wrap">
                    <MyPageSidebar></MyPageSidebar>
                </div>
                <!-- 메인 -->
                <div class="main_wrap">
                    <h2>내 상품</h2>
                    <div class="list_wrap">
                        <table class="table">
                            <colgroup>
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="20%" />
                                <col width="10%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>사진</th>
                                    <th>상품명</th>
                                    <th>가격</th>
                                    <th>찜</th>
                                    <th>등록일</th>
                                    <th>수정/삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in productInfo" :key="index">
                                    <td><img :src="`http://localhost:3000/`+item.thumbnail" width="100" height="100"/></td>
                                    <td class="title">{{item.title}}</td>
                                    <td>{{item.price.toLocaleString('ko-KR')}} 원</td>
                                    <td>{{item.dibs}}</td>
                                    <td>{{new Date(item.date).toLocaleString('ko-KR')}}</td>
                                    <td>
                                        <div class="button" @click="updatePage(item.id)">
                                            <button>수정</button>
                                        </div>
                                        <div class="button" @click="productDelete(item)">
                                            <button>삭제</button>
                                        </div>                           
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="paging">
                            <ul>
                                <!-- 이전 버튼 -->
                                <ul>
                                    <router-link :to="`/mypage/myproduct/list?no=${ (startPageIndex - 1) * listRowCount }`" @click.native="movePage(startPageIndex - 1)">
                                        <li class="page-item" v-if="prev">
                                            <span aria-hidden="true">&laquo;</span>      
                                        </li>
                                    </router-link>
                                </ul>
                                
                                <!-- 페이징 -->
                                <ul v-for="index in endPageIndex-startPageIndex + 1 " :key="index">
                                    <router-link :to="`/mypage/myproduct/list?no=${ (startPageIndex+index) -1 }`" @click.native="movePage(startPageIndex + index - 1)">
                                        <li class="page-item">    
                                            {{startPageIndex+ index -1 }}
                                        </li>
                                    </router-link>
                                </ul>

                                <!-- 다음버튼 -->
                                <ul>
                                    <router-link :to="`/mypage/myproduct/list?no=${ (endPageIndex + 1) * listRowCount }`" @click.native="movePage(endPageIndex + 1)">
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
            productInfo:'', //상품 데이터
            /* 페이징 */
            totalListItemCount: 0, //내 게시물 총개수
            listRowCount: 5, // 한 페이지당 출력할 게시물 개수
            pageLinkCount: 10, // 페이징 단위 
            currentPageIndex: 1, // 현재 페이지
            pageCount: 0, //출력할 페이지 버튼 개수
            startPageIndex: 0,
            endPageIndex: 0,
            prev: false, //이전버튼
            next: false, //다음버튼
            /* limit offset */
            pageLimit : 5, //pageLimit = listRowCount sql 2개만 출력
            pageOffset : 0 
        }
    },
    mounted() {
		this.getMyProduct();
        this.myProductCount();
	},
    watch: {
        '$route' (to, from) {
            if(to.query != from.query){
                this.getMyProduct();
                this.myProductCount();
            }
        }
    },
	methods:{
        // 페이지 이동 
        movePage( param ) {
            this.currentPageIndex = param;
            this.myProductCount();
        },
        /* 내 상품 리스트 조회 */
		async getMyProduct() {
            try{
                /* 로그인 유지 */
                await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})

                /* 내 상품 리스트 조회 */
                const productInfo = await axios.get("http://localhost:3000/api/mypage/getMyProduct/list",{
                    withCredentials: true,
                    params: {
                        no : this.$route.query.no,
                        limit : this.pageLimit,
                        offset : (this.$route.query.no - 1) * this.pageLimit
                    }
                })
                this.productInfo = productInfo.data.productInfo; // 상품 정보
                }
            catch(err){
                console.log(err);
            }
		},
        /* 페이징 */
        async myProductCount(){
            try{
                /* 로그인 유지 */
                await axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})

                /* 내 상품 총 개수 조회 */
                const count = await axios.get("http://localhost:3000/api/paging/myProductCount",{withCredentials: true})
                this.totalListItemCount = count.data.count; // 내 상품 총 개수
                this.initUI();
            }
            catch(err){
                console.log(err);
            }         
        },
        /* 페이징 계산 */
        initUI(){
            this.pageCount = Math.ceil(this.totalListItemCount/this.listRowCount); //출력될 페이지개수 = (게시물총개수/한페이지에 출력할 게시물 개수)

            if((this.currentPageIndex % this.pageLinkCount) == 0 ){ // 10,20,30... 맨마지막 
                this.startPageIndex = ((this.currentPageIndex / this.pageLinkCount)-1)*this.pageLinkCount + 1
                // ex) 10 % 10 == 0 이므로
                // startPageIndex = (10/10)-1 * 10 + 1 = 1
                // ex) 20 % 10 == 0 이므로
                // startPageIndex = (20/10)-1 * 10 + 1 = 11
                // 즉 currentPageIndex = 10 이면 startPageIndex 는 1 이다
                // 즉 currentPageIndex = 20 이면 startPageIndex 는 11 이다
            }
            else{ //1~9, 11~19 ...
                this.startPageIndex = Math.floor(this.currentPageIndex / this.pageLinkCount)*this.pageLinkCount + 1
                // ex) 1 % 10 != 0 이므로 
                // startPageIndex = math.floor(1/10) * 10 + 1 = 0 * 10 + 1 = 1
                // ex) 2 % 10 ! = 0 이므로
                // startPageIndex = math.floor(2/10) * 10 + 1 = 0 * 10 + 1 = 1
                // ex) 11 % 10 ! = 0 이므로
                // startPageIndex = math.floor(11/10) * 10 + 1 = 1 * 10 + 1 = 11
                // 즉 currentPageIndex = 1~9 이면 startPageIndex 는 1 이다
                // 즉 currentPageIndex = 11~19 이면 startPageIndex 는 11 이다
            }

            if( (this.currentPageIndex % this.pageLinkCount) == 0 ){ //10, 20...맨마지막
                this.endPageIndex = ((this.currentPageIndex / this.pageLinkCount)-1)*this.pageLinkCount + this.pageLinkCount
                // ex) 10 % 10 == 0 이므로
                // endPageIndex = (10/10)-1 * 10 + 10 = 10
                // ex) 20 % 10 == 0 이므로
                // endPageIndex = (20/10)-1 * 10 + 10 = 20
                // 즉 currentPageIndex = 10 이면 endPageIndex 는 10 이다
                // 즉 currentPageIndex = 20 이면 endPageIndex 는 20 이다
            }else{  //1~9, 11~19 ...
                this.endPageIndex =  Math.floor(this.currentPageIndex / this.pageLinkCount)*this.pageLinkCount + this.pageLinkCount;
                // ex) 1 % 10 != 0 이므로 
                // endPageIndex = Math.floor(1/10) * 10 + 10 = 0 * 10 + 10 = 10
                // ex) 2 % 10 ! = 0 이므로
                // endPageIndex = Math.floor(2/10) * 10 + 10 = 0 * 10 + 10 = 10
                // ex) 11 % 10 ! = 0 이므로
                // endPageIndex = Math.floor(11/10) * 10 + 10 = 1 * 10 + 10 = 20
                // 즉 currentPageIndex = 1~9 이면 endPageIndex 는 10 이다
                // 즉 currentPageIndex = 10~19 이면 endPageIndex 는 20 이다
            }
            if(this.endPageIndex > this.pageCount){ 
                this.endPageIndex = this.pageCount 
            }
            // 이전 버튼 
            if(this.currentPageIndex <= this.pageLinkCount ){ //현재 페이지 <= 페이지 최대개수
                this.prev = false; //이전버튼 숨기기
            }else{ 
                this.prev = true; //이전버튼 보이기
            }
            // 다음버튼
            if(this.endPageIndex >= this.pageCount){ //마지막페이지 > 페이지 최대개수
                this.endPageIndex = this.pageCount;
                this.next = false;
            }else{
                this.next = true;
            }
        },
        // 게시물 삭제
        async productDelete(product) {
            try{
                if (confirm("정말 삭제하시겠습니까?") == true){ // 확인
                    /* 삭제 */
                    const res = await axios.post("http://localhost:3000/api/mypage/myproduct/delete",product)
                    if(res.data.success){
                        this.$router.go({path:'/mypage/myproduct'});
                    }
                }else{ // 취소
                    return false;
                }
            }
            catch(err){
                console.log(err);
            }   
		},
        // 수정페이지 라우터 이동 
        updatePage(productNo){
           this.$router.push({ path: "/update/" + productNo});
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
    /* h2 내 상품 */
    .main_wrap h2{
        text-align: left;
        padding-bottom: 30px;
    }
    /* 테이블 */
    .table{
        width: 929px;
        border-top: solid 1px #DADCE0;
        border-collapse: collapse;
    }
    th, td{
        border-bottom: solid 1px #DADCE0;
        padding: 12px;
    }
    .button{
        line-height: 32px;
        margin: 5px 0px 5px 0px;
        text-align: center;
        border-radius: 2px;
        border: 1px solid rgb(195, 194, 204);
        cursor: pointer;
    }
    .button button{
        border: 0px;
        outline: 0px;
        background: white;
        cursor: pointer;
    }
    .paging{
        width: 929px;
        height: 53px;
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
        line-height: 30px;
        color: #9b99a9;
        border: solid 1px rgb(204, 204, 204);;
        margin: 10px 5px 10px 5px;
    }


</style>