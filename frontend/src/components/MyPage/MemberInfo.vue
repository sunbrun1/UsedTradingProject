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
                        <div class="pwupdate_wrap">
                            <h2><font-awesome-icon icon="lock" class="font"/> 비밀번호 변경</h2>
                            <div class="pw_wrap title">
                                비밀번호
                            </div>
                            <div class="pw_wrap input">
                                <div class="currentPw">
                                    <input type="password" v-model="currentPw" placeholder="현재 비밀번호">
                                </div>
                                <div class="newPw">
                                    <input type="password" v-model="newPw" placeholder="새 비밀번호">
                                </div>
                                <div class="newPwCheck">
                                    <input type="password" v-model="newPwCheck" placeholder="새 비밀번호 확인">
                                </div>
                            </div>
                        </div>
                        <div class="memberinfo_wrap">
                            <h2><font-awesome-icon icon="user" class="font"/> 개인정보 수정</h2>
                            <div class="email_wrap title">
                                이메일
                            </div>
                            <div class="email_wrap input">
                                <div class="email">
                                    <input type="text" v-model="email" placeholder="이메일">
                                </div>
                            </div>
                        </div>
                        <div class="submit" @click="update">
                            <button type="button">확인</button>
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
            memberInfo:'',
            form:'',
            currentPw:'',
            newPw:'',
            newPwCheck:'',
            email:''
        }
    },
    mounted() {
		this.getMemberInfo();
	},
	methods:{
        /* 개인정보 조회 */
        getMemberInfo(){
            /* 로그인 여부 확인 */
            this.$axios.get("http://localhost:3000/api/member/someAPI", {withCredentials: true})
            .then(()=>{
                /* 개인정보 조회 GET */
                this.$axios.get("http://localhost:3000/api/mypage/memberinfo", {withCredentials: true})
                .then((res)=>{
                    this.memberInfo = res.data.memberInfo;
                    this.email = this.memberInfo.member_email;
                })
                .catch((err)=>{
                    console.log(err);
                }) 
            })
            .catch((err)=>{
                console.log(err);
            })

        },
        /* 개인정보 수정 */
		update() {
            /* 로그인 여부 확인 */
            this.$axios.get("http://localhost:3000/api/member/someAPI", {withCredentials: true})
            .then(()=>{
                this.form = {
                    currentPw:this.currentPw,
                    newPw:this.newPw,
                    newPwCheck:this.newPwCheck,
                    email:this.email
                }
                /* 수정 POST */
                this.$axios.post("http://localhost:3000/api/mypage/memberinfo/update", this.form, {withCredentials: true})
                .then((res)=>{
                    if(res.data == "currentPwCheckError"){
                        alert("현재 비밀번호가 일치하지 않습니다.");
                    }
                    else if(res.data == "newPwLengthError"){
                        alert("새로운 비밀번호는 6~13자로 입력해주세요.");
                    }
                    else if(res.data == "newPwCheckError"){
                        alert("비밀번호 재확인을 정확히 입력해주세요.");
                    }
                    else if(res.data.changePw){ // 비밀번호 변경한 경우 로그아웃후 메인화면 이동
                        alert("수정되었습니다.");
                        this.$router.go({path:'/mypage/memberinfo'});
                    }
                    else{ // 개인 정보만 변경한 경우
                     alert("수정되었습니다.");
                        this.$router.go({path:'/mypage/memberinfo'});
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
        margin-top: 30px;
        margin-left: 30px;
        padding-top: 196px;
    }
    .pwupdate_wrap{
        width: 929px;
        height: auto;
        overflow:hidden;
    }
    /* 비밀번호 변경 h2 */
    .pwupdate_wrap h2{
        width: 929px;
        padding: 0px 0px 20px 0px;
        border-bottom: solid 1px #DADCE0;
        text-align: left;
    }
    /* 가로정렬 */
    .pw_wrap{
        float: left;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .pw_wrap.input{
        width: 820px;      
    }
    .pw_wrap.title{
        padding-right: 50px;
    }
    /* 현재 비밀번호 */
    .currentPw{
        width: 300px;
        height: 50px;
        border: solid 1px #bbb;;
        margin-bottom: 10px;
    }
    .currentPw input{
        width: 280px;
        height: 30px;
        padding: 10px;
        outline: 0;
        border: 0;
    }
    /* 새 비밀번호 */
    .newPw{
        width: 300px;
        height: 50px;
        border: solid 1px #bbb;;
        margin-bottom: 10px;
    }
    .newPw input{
        width: 280px;
        height: 30px;
        padding: 10px;
        outline: 0;
        border: 0;
    }
    /* 새 비밀번호 확인 */
    .newPwCheck{
        width: 300px;
        height: 50px;
        border: solid 1px #bbb;;
    }
    .newPwCheck input{
        width: 280px;
        height: 30px;
        padding: 10px;
        outline: 0;
        border: 0;
    }
    /* 비밀번호 변경 h2 */
    .memberinfo_wrap h2{
        width: 929px;
        padding: 0px 0px 20px 0px;
        border-bottom: solid 1px #DADCE0;
        text-align: left;
    }
    /* 가로정렬 */
    .email_wrap{
        float: left;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    .memberinfo_wrap{
        width: 929px;
        height: auto;
        overflow:hidden;
    }
    .email_wrap.input{
        width: 820px;      
    }
    .email_wrap.title{
        padding-right: 50px;
    }
    /* 이메일 */
    .email{
        width: 300px;
        height: 50px;
        border: solid 1px #bbb;;
        margin-bottom: 10px;
    }
    .email input{
        width: 280px;
        height: 30px;
        padding: 10px;
        outline: 0;
        border: 0;
    }
    .submit{
        width: 100px;
        height: 50px;
        margin: auto;
        line-height: 50px;
        border: solid 1px #bbb;
        background: #19b2f5;
        cursor: pointer;
    }
    .submit button{
        outline: 0;
        border: 0;
        background: #19b2f5;
        color: white;
        font-size: 16px;
        cursor: pointer;
    }
    
</style>