<template>
  <div id="app">
    <KakaoLogin
      api-key="9e5ccd7c82e2dc838fd8c0ac039bdceb"
      image="kakao_login_btn_large"
      :on-success=onSuccess
      :on-failure=onFailure
      />
  </div>
</template>
 
<script>
import KakaoLogin from 'vue-kakao-login'
 
let onSuccess = (data) => {
  console.log(data)
  console.log("success")
}
let onFailure = (data) => {
  console.log(data)
  console.log("failure")
}
 
export default {
  name: 'App',
  components: {
    KakaoLogin
  },
  methods: {
    onSuccess,
    onFailure
  }
}
</script>
 
<style>
#app{
   padding-top: 300px;

}
</style>