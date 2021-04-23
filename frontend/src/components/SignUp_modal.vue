<template>
    <transition name='modal'>
        <div class="modal-mask" >
            <div class="modal-wrapper">
                <div class="modal-container">
                    <form>
                        <div class="signup_close">
                            <button @click="$emit('close')">x</button>
                        </div>
                        <div class="signup_title">
                            회원가입
                        </div>
                        <div class="signup_id">
                            <input type="text" id="id" name="id" v-model="id" placeholder="ID"/>
                        </div>
                        <div class="signup_pw">
                            <input type="password" id="pw" name="pw" v-model="pw" placeholder="PassWord"/>
                        </div>
                        <div class="signup_pwCheck">
                            <input type="password" id="pwcheck" name="pwcheck" v-model="pwcheck" placeholder="PassWord Check"/>
                        </div>
                        <div class="signup_email">
                            <input type="text" id="email" name="email" v-model="email" placeholder="Email"/>
                        </div>
                        <button class="signup_btn" type="button" @click="signup">
                            회원가입
                        </button>
                        <button class="signup_cancle" @click="$emit('close')" type="button">
                            취소
                        </button>
                    </form>

                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data(){ 
        return {
            form:'',
            id:'',  
            pw:'',  
            pwcheck:'',
            email:'',  
        }
    },
    methods:{
        // 업로드
        signup(){
            this.form = { //backend로 전송될 POST 데이터
				id:this.id,
                pw:this.pw,
                pwcheck:this.pwcheck,
                email:this.email
			} 

            this.$axios.post("http://192.168.219.100:3000/api/board/signup",this.form,{withCredentials: true})
			.then((res)=>{
                if(res.data == "id_length error"){
                    alert("ID 6자~13자로 입력해주세요");
                }
                else if(res.data == "pw_length error"){
                    alert("PW 6자~13자로 입력해주세요");
                }
                else if(res.data == "pwcheck error"){
                    alert("비밀번호가 일치하지 않습니다.");
                }
                else if(res.data == "idcheck error"){
                    alert(this.id + "는 이미 사용 중입니다.");
                }
                else if(res.data.success){
                    alert("등록완료");
                    this.$emit('close');
                }
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
        padding-top: 200px;
    }
    .modal-enter {
        opacity: 0;
    }
    .modal-leave-active {
        opacity: 0;
    }
    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }
    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }
    .modal-container {
        width: 500px;
        margin: auto;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        position: relative;
    }
    /* 로그인창 닫기 */
    .signup_close button{
        width: 44px;
        height: 44px;
        border: 0px;
        outline: 0px;
        background: white;
        font-size: 30px;
        cursor: pointer;
        position: absolute;
        left: 456px;
    }
    /* 회원가입 타이틀 */
    .signup_title{
        font-size: 22px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    /*ID input*/
    .signup_id{
        width: 460px;
        height: 40px;
        margin: auto;
        border: 1px solid #DADCE0;
        margin-bottom: 10px;
    }
    .signup_id input{
        width: 440px;
        height: 20px;
        padding: 10px;
        border: 0px;
        outline: 0px;
    }
    /*PW input*/
    .signup_pw{
        width: 460px;
        height: 40px;
        margin: auto;
        margin-bottom: 10px;
        border: 1px solid #DADCE0;
    }
    .signup_pw input{
        width: 440px;
        height: 20px;
        padding: 10px;
        border: 0px;
        outline: 0px;
    }
    /*PwChek input*/
    .signup_pwCheck{
        width: 460px;
        height: 40px;
        margin: auto;
        margin-bottom: 10px;
        border: 1px solid #DADCE0;
    }
    .signup_pwCheck input{
        width: 440px;
        height: 20px;
        padding: 10px;
        border: 0px;
        outline: 0px;
    }
    /*Email input*/
    .signup_email{
        width: 460px;
        height: 40px;
        margin: auto;
        border: 1px solid #DADCE0;
    }
    .signup_email input{
        width: 440px;
        height: 20px;
        padding: 10px;
        border: 0px;
        outline: 0px;
    }
    /* 회원가입 버튼 */
    .signup_btn{
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
    /* 회원가입 버튼 */
    .signup_cancle{
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
   
  
</style>