<template>
    <body>
        <div id="app">
            <!-- #1 : Button trigger modal -->
            <button @click="handle_toggle" type="button">
                모달창 띄우기
            </button>

            <!-- #2 : Modal Window -->
            <div class="login" v-show="is_show">
                <div class="login_close">
                    <button @click="handle_toggle">x</button>
                </div>
                <div class="login_title">
                    로그인
                </div>
                <div class="login_id">
                    <input type="text" placeholder="ID"/>
                </div>
                <div class="login_pw">
                    <input type="text" placeholder="PassWord"/>
                </div>
                <button class="login_btn" @click="handle_toggle" type="button">
                    로그인
                </button>
                <div class="login_item">
                    <span>비밀번호 찾기</span> <span>/</span> <span>회원가입</span>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
export default {
    data(){ 
        return {
            is_show: false 
        }
    },
  methods:{
    handle_toggle: function(){ 
      this.is_show = !this.is_show; 
    },
  }
}
</script>

<style scoped>
body{
    padding-top: 200px;
}
/* 로그인 박스 */
.login{
    width: 500px;
    height: 300px;
    margin: auto;
    border: 1px solid #DADCE0;
}
/* 로그인창 닫기 */
.login_close button{
    width: 44px;
    height: 44px;
    border: 0px;
    outline: 0px;
    background: white;
    font-size: 30px;
    cursor: pointer;
    position: absolute;
    left: 1035px;
}
/* 로그인 타이틀 */
.login_title{
    font-size: 22px;
    margin-top: 20px;
    margin-bottom: 20px;
}
/*ID input*/
.login_id{
    width: 460px;
    height: 40px;
    margin: auto;
    border: 1px solid #DADCE0;
    margin-bottom: 10px;
}
.login_id input{
    width: 440px;
    height: 20px;
    padding: 10px;
    border: 0px;
    outline: 0px;
}
/*PW input*/
.login_pw{
    width: 460px;
    height: 40px;
    margin: auto;
    border: 1px solid #DADCE0;
}
.login_pw input{
    width: 440px;
    height: 20px;
    padding: 10px;
    border: 0px;
    outline: 0px;
}
/* 로그인 버튼 */
.login_btn{
    margin-top: 10px;
    margin-bottom: 10px;
    width: 460px;
    height: 40px;
    color: white;
    background: #19b2f5;
    border: 0px;
    outline: 0px;
    cursor: pointer;
}
.login_item span{
    color: #696969;
}

</style>