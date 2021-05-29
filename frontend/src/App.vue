<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap');
body,html,*{
  margin: 0;
  padding: 0;
}
/*a태그 파란색,밑줄 제거*/
a:link{
    color: black;    
    text-decoration: none; 
}
a:visited{
    color: black;
    text-decoration: none; 
}
li,ul{
    list-style: none;
}

#app {
  font-family: 'Noto Sans KR', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
