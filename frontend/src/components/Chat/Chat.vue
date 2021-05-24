<template>
    <body>
        <div class ="chatBox">
            <div class="roomName">
                1번채팅방
            </div>
            <div class="chat">
                <ul v-for="(item) in testData" :key="item.id">
                    <li>
                        {{item.send_id}} : {{item.text}}
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
import io from 'socket.io-client';

export default {
    data(){
        return{
            text:'',
            name:'',
            testData:[],
            tttt:'',
            socket : io('http://localhost:3000')
        }
    },

    created(){
        this.test();
        this.chatList(); 
    },
	methods:{
        test(){
            let memberNum = this.$route.params.memberId;
            let productId = this.$route.query.product_no;
            let isDirect = this.$route.query.isDirect;
            let roomId = this.$route.query.room_no;
            this.$axios.get("http://localhost:3000/talk/user/" + memberNum, {
                withCredentials: true,
                params: {
                    isDirect: isDirect,
                    product_no : productId,
                    room_no : roomId
                }
             })
			.then((res)=>{
                if(res.data.success){
                    this.testData = res.data.msgData
                    console.log(this.testData);
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        chatList(){
            this.socket.on('update', (data) =>{
                this.testData.push({send_id:"상대방",text:data.message}); 
            })
        },
        send(){
            console.log(this.text)
            this.socket.emit('message', {type: 'message', message: this.text})
            this.testData.push({send_id:"나",text:this.text}); 
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