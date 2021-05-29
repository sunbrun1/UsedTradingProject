<template>
    <section>
        <Header></Header>
        <body>
            <form>
                <div class="mypage">
                    <!-- 사이드바 -->
                    <div class="mypage_item sidebar">
                        <MyPageSidebar></MyPageSidebar>
                    </div>
                    <div class="mypage_item main">
                        <h1>비밀번호 재확인</h1>
                        <p>고객님의 개인정보 보호를 위해 본인확인을 진행합니다.</p>
                        <p>비밀번호를 다시한번 입력해주세요.</p>
                        <div class="input_wrap">
                            <div class="input title">
                                비밀번호 확인
                            </div>
                            <div class="input pw">
                                <input type="password" v-model="pw"  ref="pw" placeholder="비밀번호">
                            </div>
                            <div class="input ok_btn"  @click="pwCheck">
                                <button type="button">확인</button>
                            </div>
                        </div>   
                    </div>
                </div>
            </form>
        </body>
    </section>
</template>

<script>
import Header from '@/components/Header.vue'
import MyPageSidebar from '@/components/MyPage/MyPageSidebar.vue'

export default {
    components: {Header,MyPageSidebar},
    data(){
        return{
            form:'',
            pw:''
        }
    },
	methods:{
        /* 비밀번호 재확인 */
		pwCheck() {
            /* 로그인 여부 확인 */
            this.$axios.get("http://localhost:3000/api/member/someAPI", {withCredentials: true})
            .then(()=>{
                this.form = {
                    pw:this.pw
                }
                /* 비밀번호 재확인 */
                this.$axios.post("http://localhost:3000/api/mypage/memberinfo/pwcheck", this.form, {withCredentials: true})
                .then((res)=>{
                    if(res.data.success){
                        this.$router.push({path:'/mypage/memberinfo'});
                    }
                    else{
                        alert("비밀번호가 일치하지 않습니다.")
                        console.log("실패");
                    }
                })
                .catch((err)=>{
                    console.log(err);
                }) 
            })
            .catch((err)=>{
                console.log(err);
            })
		},
        
	}
}
</script>

<style scoped>
    .mypage{
        width: 1180px;
        height: 800px;
        margin: auto;
    }
    /* 가로정렬 */
    .mypage_item{
        float: left;
    }
    /* 메인 */
    .main{
        width: 929px;
        height: 140px;
        margin-top: 30px;
        margin-left: 30px;
        padding-top: 196px;
    }
    .main h1{
        padding: 0px 0px 20px 0px;
    }
    .input_wrap{
        width: 525px;
        height: 60px;
        margin: auto;
        padding: 25px 0px 0px 0px;
    }
    .input{
        float: left;
    }
    .title{
        width: 100px;
        height: 50px;
        line-height: 50px;
        margin-right: 10px;
    }
    .pw{
        width: 300px;
        height: 50px;
        border: 1px solid #bbb;
        margin-right: 10px;
    }
    .pw input{
        width: 280px;
        height: 30px;
        padding: 10px;
        outline: 0;
        border: 0;
    }
    .ok_btn{
        width: 95px;
        height: 50px;
        line-height: 50px;
        border: 1px solid #bbb;
        cursor: pointer;
        background: #19b2f5;
    }
    .ok_btn button{
        outline: 0;
        border: 0;
        background: white;
        cursor: pointer;
        background: #19b2f5;
        color: white;
        font-size: 15px;
    }
</style>