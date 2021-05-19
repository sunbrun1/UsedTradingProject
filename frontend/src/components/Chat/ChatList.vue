<template>
    <body>
        <div class="chatListWrap">
            <h2>채팅 리스트</h2>
            <div class="chatList">
                <ul v-for="(item) in chatList" :key="item.id">
                    <router-link :to="`/chat/` + item.product_id">
                        <li>
                            {{item.id}}
                        </li>
                    </router-link>
                </ul>

            </div>
        </div>


    </body>
</template>

<script>
export default {
    data(){
        return{
            chatList:""
        }
    },
    mounted(){
        this.test();
    },
	methods:{
        test(){
            this.$axios.get("http://192.168.219.100:3000/chatList", {withCredentials: true})
			.then((res)=>{
                if(res.data.success){
                    this.chatList = res.data.chatList;
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
        padding-top: 200px;
    }
    .chatListWrap{
        width: 400px;
        height: 600px;
        margin: auto;
        border: solid 1px black;
    }
    .chatListWrap h2{
        width: 400px;
        border-bottom: solid 1px black;
    }
    .chatList li{
        width: 400px;
        height: 30px;
        line-height: 30px;
        border: solid 1px black;
    }
</style>