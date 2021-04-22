<template>
    <transition name='modal'>
        <div class="modal-mask" >
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="login_close">
                        <button @click="$emit('close')">x</button>
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
                    <button class="login_btn" type="button">
                        로그인
                    </button>
                    <div class="login_item">
                        <span class="span">비밀번호 찾기</span>
                        <span>/</span>
                        <span class="span" @click="openModal">회원가입</span>
                    </div>
                    <SignUpModal @close="closeModal" v-if="modal"></SignUpModal>
                    <div class="kakao_login">
                    <KakaoLogin
                        api-key="9e5ccd7c82e2dc838fd8c0ac039bdceb"
                        image="kakao_login_btn_medium" 
                        :on-success=onSuccess
                        :on-failure=onFailure>
                    </KakaoLogin>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import KakaoLogin from 'vue-kakao-login'
import SignUpModal from '@/components/SignUp_modal'; 

export default {
    components: {KakaoLogin,SignUpModal},
    data(){ 
        return {
            access_token:'',
            refresh_token:'',
            modal:false,
        }
    },
    methods:{
        onSuccess(data){
            console.log(data)
            this.access_token = data.access_token;
            this.refresh_token = data.refresh_token;
            console.log("success")
        },
        onFailure(data){
            console.log(data)
            console.log("failure")
        },
        openModal() {
            this.modal = true;
        },
        closeModal() {
            this.modal = false;
        },
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
    .login_close button{
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
    /* 로그인 타이틀 */
    .login_title{
        font-size: 22px;
        padding-top: 20px;
        padding-bottom: 20px;
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
    .span{
        padding: 0px 3px 0px 3px;
        cursor: pointer;
    }
</style>