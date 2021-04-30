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
                    <router-link to="/mypage/myproduct">
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
                                    <div class="button">
                                        <button>수정</button>
                                    </div>
                                    <div class="button" @click="productDelete(item)">
                                        <button>삭제</button>
                                    </div>
                                   
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    </body>
</template>

<script>
export default {
    data(){
        return{
            myProduct:'',
            thumbnail:'',
            title:'',
            price:'',
            pick:'',
            date:'',
            productId:''
        }
    },
    mounted() {
		this.getList();
	},
	methods:{
		getList() {
			this.$axios.get("http://192.168.219.100:3000/api/board/mypage/myproduct",{withCredentials: true})
			.then((res)=>{
                this.myProduct = res.data.myProduct; //신규상품
			})
			.catch((err)=>{
				console.log(err);
			})
		},
        productDelete(product) {
			this.$axios.post("http://192.168.219.100:3000/api/board/mypage/myproduct/delete",product)
			.then((res)=>{
                if(res.data.success){
                    alert("삭제되었습니다.")
                    this.$router.push({path:'/mypage/myproduct'})
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
    


</style>