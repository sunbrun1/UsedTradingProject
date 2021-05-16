<template>
    <body>
        <div class ="chatBox">
            <div class="roomName">
                1번채팅방
            </div>
            <div class="chat">
                <ul v-for="(item) in testData" :key="item.id">
                    <li>
                        {{item.name}} : {{item.msg}}
                    </li>
                </ul>

            </div>
             <div >
                <input type="text" v-model="text" placeholder="메시지를 입력해주세요..">
                <button @click="send">전송</button>
            </div>
        </div>
    </body>
</template>

<script>
export default {
    data(){
        return{
            text:'',
            name:'',
            testData:[],
            tttt:''
        }
    },
    mounted(){
        this.test();
        this.chatList();
    },
	methods:{
        test(){
            this.$axios.get("http://192.168.219.100:3000/chat",{withCredentials: true})
			.then((res)=>{
                console.log(res);
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        chatList(){
            this.$socket.on('update', (data) =>{
                console.log(data.name + " : " + data.message);
                if(data.message != null){
                    this.testData.push({name:"상대방",msg:data.message}); 
                    console.log(this.testData);
                }
            })
        },
        send(){
            this.$socket.emit('message', {type: 'message', message: this.text})
            this.testData.push({name:"나",msg:this.text}); 
            console.log("나: " + this.text)
            this.text = '';
        }
	}
}
</script>

<style scoped>
body{
    padding-top: 190px;
    background: #ffffff;
}
.chatBox{
    width: 400px;
    height: 500px;
    margin: auto;
    margin-top: 10px;
    border: solid 1px black;
}
.chat{
    width: 400px;
    height: 450px;
}
</style>