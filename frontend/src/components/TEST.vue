<template>
    <body>
        <input type="text" v-model="text" >
        <button @click="send">전송</button>

    
    </body>
</template>

<script>
export default {
    data(){
        return{
            text:'',
            name:''
        }
    },
    mounted(){
        this.nickName();
        this.chatList();
    },
	methods:{
        nickName(){
            this.$socket.on('connect', function(){
            this.name = prompt("반갑습니다. 닉네임을 입력해주세요","")
            
                if(!this.name){
                    this.name = "익명";
                }
                this.emit('newUser', this.name);
                //this.$socket.emit('newUser', this.name); -> 오류남 이유모름 소켓객체를 덮어쓴걸로 보임
            })
        },
        chatList(){
            this.$socket.on('update', function(data){
                console.log(`${data.name}: ${data.message}`);     
            })
        },
        send(){
            this.$socket.emit('message', {type: 'message', message: this.text})
            console.log("나: " + this.text)
        }
	}
}
</script>

<style scoped>
    body{
        padding-top: 200px;
    }
  

</style>

