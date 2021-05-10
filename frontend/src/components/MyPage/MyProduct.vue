<template>
    <body>
        <div class="mypage">
            <!-- 사이드바 -->
            <div class="mypage_item sidebar">
                <!-- 마이페이지 제목 -->
                <h3 class="sidebar_title">
                    마이페이지
                </h3>
                <!-- 마이페이지 메뉴 -->
                <ul class="sidebar_item">
                    <router-link to="/mypage">
                        <li class="home">마이페이지 홈</li>
                    </router-link>
                    <router-link to="/mypage/myproduct/list">
                        <li class="myproduct">내게시물</li>
                    </router-link>
                    <li>거래상태</li>
                    <li>관심목록</li>
                    <li>포인트</li>
                    <li>개인정보</li>
                    <li>회원탈퇴</li>
                </ul>
            </div>
            <!-- 메인 -->
            <div class="mypage_item main">
                <div class="list_wrap">
                    <table class="tbList">
                        <colgroup>
                            <col width="214px" />
                            <col width="248px" />
                            <col width="160px" />
                            <col width="72px" />
                            <col width="160px" />
                            <col width="100px" />
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
                            <tr v-for="(item, index) in myProduct" :key="index">
                                <td><img :src="`http://192.168.219.100:3000/`+item.thumbnail" width="150" height="100"/></td>
                                <td class="title">{{item.title}}</td>
                                <td>{{item.price.toLocaleString('ko-KR')}} 원</td>
                                <td>{{item.zzim}}</td>
                                <td>{{new Date(item.date).toLocaleString('ko-KR')}}</td>
                                <td class="option">
                                    <router-link :to="`/update/` + item.id">
                                        <div class="button">
                                            <button @click="myProductCount">수정</button>
                                        </div>
                                    </router-link>
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
                            <li class="page-item" v-if="prev">
                                <router-link :to="`/mypage/myproduct/list?no=${ (startPageIndex - 1) * listRowCount }`" @click.native="movePage(startPageIndex - 1)">
                                    <span aria-hidden="true">&laquo;</span>
                                </router-link>
                            </li>
                            <!-- 페이징 -->
                            <li class="page-item" v-for="index in endPageIndex-startPageIndex + 1 " :key="index">
                                <router-link :to="`/mypage/myproduct/list?no=${ (startPageIndex+index) -1 }`" @click.native="movePage(startPageIndex + index - 1)">
                                    {{startPageIndex+ index -1 }}
                                </router-link>
                            </li>

                            <!-- 다음버튼 -->
                            <li class="page-item" v-if="next">
                                <router-link :to="`/mypage/myproduct/list?no=${ (endPageIndex + 1) * listRowCount }`" @click.native="movePage(endPageIndex + 1)">
                                    <span aria-hidden="true">&raquo;</span>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
    
        </div>
    </body>
</template>

<script>
export default {
    watch: {
        '$route' (to, from) {
            if(to.query != from.query){
                this.getListByPage();
            }
        }
    },
    data(){
        return{
            myProduct:'', //상품 데이터
            totalListItemCount: 0, //내 게시물 개수
            listRowCount: 5, // 한 페이지당 출력할 게시물 개수
            pageLinkCount: 10, //페이징 단위 
            currentPageIndex: 1, //현재 페이지

            pageCount: 0, //출력할 페이지 버튼 개수
            startPageIndex: 0,
            endPageIndex: 0,
            prev: false, //이전버튼
            next: false, //다음버튼

            pageLimit : 5, //pageLimit = listRowCount sql 2개만 출력
            pageOffset : 0 
        }
    },
    mounted() {
		this.getList();
        this.myProductCount();
	},
	methods:{
        // 페이지 이동 
        movePage( param ) {
            this.currentPageIndex = param;
            this.myProductCount();
            this.initUI();
        },
        // 내 게시물 불러오기(초기화면)
		getList() {
			this.$axios.get("http://192.168.219.100:3000/api/mypage/myproduct/list",{
                withCredentials: true,
                params: {
                    limit : this.pageLimit,
                    offset : this.pageOffset
                }
             })
			.then((res)=>{
                this.myProduct = res.data.myProduct; 
			})
			.catch((err)=>{
				console.log(err);
			})
		},
        // 초기 페이징 화면
        myProductCount(){
            this.$axios.get("http://192.168.219.100:3000/api/mypage/myproduct/myProductCount",{withCredentials: true})
            .then((res)=>{
                this.totalListItemCount = res.data.count[0].count; 
                this.initUI();
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        // 초기 페이징 UI
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
        // 페이지별 게시물 불러오기
        getListByPage() {
			this.$axios.get("http://192.168.219.100:3000/api/mypage/myproduct/list",{
                withCredentials: true,
                params: {
                    no : this.$route.query.no,
                    limit : this.pageLimit,
                    offset : (this.$route.query.no - 1) * this.pageLimit
                }
             })
			.then((res)=>{
                this.myProduct = res.data.myProduct; 
			})
			.catch((err)=>{
				console.log(err);
			})
		},
        // 게시물 삭제
        productDelete(product) {
			this.$axios.post("http://192.168.219.100:3000/api/mypage/myproduct/delete",product)
			.then((res)=>{
                if(res.data.success){
                    alert("삭제되었습니다.")
                    this.$router.go({path:'/mypage/myproduct'});
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
        padding-top: 196px;
    }
    .mypage{
        width: 1180px;
        height: 800px;
        margin: auto;
    }
    /* 가로정렬 */
    .mypage_item{
        float: left;
    }
    /* 사이드바 */
    .sidebar{
        width: 179px;
        height: 400px;
        padding: 19px;
        border: solid 2px #DADCE0;
        margin-top: 30px;
    }
    /* 사이드바 제목 */
    .sidebar_title{
        width: 179px;
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding: 0px 0px 20px 0px;
        border-bottom: 1px #666 solid;
        font-size: 20px;
    }
    /* 사이드바 메뉴 */
    .sidebar_item{
        text-align: left;
        padding: 10px 0px 0px 0px;
    }
    .sidebar_item li{
        padding: 10px 0px 10px 0px;
        border-bottom: 1px solid #DADCE0;
        cursor: pointer;
    }
    .myproduct{
        color: #19b2f5;
    }
    /* 메인 */
    .main{
        width: 929px;
        height: 140px;
        margin-top: 30px;
        margin-left: 30px;
    }

    .tbList{
        padding: 5px 0px 5px 0px;
        border-top: 1px solid #DADCE0;
        border-bottom: 1px solid #DADCE0;
    }
    
    .tbList th{
        padding-bottom: 5px;
    }
    .tbList td{
        padding: 10px 0px 10px 0px;
        border-top: 1px solid #DADCE0;
    }
    .tbList td:not(:last-child){
        cursor: pointer;
    }
    .option{
        font-size: 23px;
    }
    .option button{
        font-size: 18px;
        border: 0px;
        outline: 0px;
        background: white;
        cursor: pointer;
        
    }
    .button{
        width: 53px;
        height: 32px;
        line-height: 32px;
        margin: auto;
        border-radius: 2px;
        border: 1px solid rgb(195, 194, 204);
        cursor: pointer;
    }
    .paging{
        width: 929px;
        height: 53px;
        text-align: center;
    }
    .paging > ul{
        display: inline-block;
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