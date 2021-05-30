<template>
    <body>
        <div class ="talk_wrap">
            <div class="seller_id">
                asdasd <span> <font-awesome-icon icon="sign-out-alt" class="font"/> </span>
            </div>
            <div class="productInfo">
                <div class="info image">
                    <img alt='logo' src="@/assets/근본거래11.jpg" width="40" height="40">
                </div>
                <div class="info">
                    <div class="title">
                        컴퓨터
                    </div>
                    <div class="price">
                        900000 원
                    </div>
                </div>
            </div>
            <div class="talk">
                <ul v-for="(item) in msgData" :key="item.id">
                    <li>
                        {{item.send_id}} : {{item.message_text}}
                    </li>
                </ul>
            </div>
            <div class="sendBox send_input">
                <input type="text" v-model="text" placeholder="메시지를 입력해주세요..">
            </div>
            <div class="sendBox send_btn">
                <button @click="send"><font-awesome-icon icon="paper-plane" class="font"/></button>
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
            msgData:[],
            socket : io("http://localhost:3000")
        }
    },
    mounted() {
		this.loginCheck();
	},
    created(){
    },
	methods:{
        getMsg(){
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
                    this.msgData = res.data.msgData
                    this.socket = io("http://localhost:3000");
                    this.socket.on('update', (data) => {
                        console.log(data.message);
                        this.msgData.push({send_id:"판매자",message_text:data.message}); 
                    })
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        send(){
            this.socket.emit('message', {message: this.text})
            this.msgData.push({send_id:"나",message_text:this.text}); 
            this.text = '';
        },
        // 로그인여부 확인
        loginCheck(){
            this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
            .then(()=>{
                this.getMsg();
			})
			.catch((err)=>{
				console.log(err);
			})
        },
	}
}
</script>

<style scoped>

.talk_wrap{
    width: 380px;
    height: 665px;
}
.talk{
    width: 380px;
    height: 506px;
    background: rgb(244, 244, 250);
}
.seller_id{
    width: 380px;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    border-bottom: solid 1px #DADCE0;
}
.seller_id span{
    position: relative;
    left: 130px;
}
.productInfo{
    width: 360px;
    height: 40px;
    padding: 5px 10px 5px 10px;
}
.info{
   float: left;
}
.image{
   width: 40px;
   height: 40px;
}
.title{
    width: 200px;
    height: 20px;
    padding: 0px 10px 0px 10px;
    text-align: left;
    font-size: 14px;
}
.price{
    width: 200px;
    height: 20px;
    padding: 0px 10px 0px 10px;
    text-align: left;
    font-size: 14px;
}
/* 메시지 입력창 */
.send_input{
    width: 300px;
    height: 40px;
    border: solid 1px #DADCE0;
    background: #DADCE0;
    border-radius: 15px;
    margin: 10px;
}
.send_input input{
    width: 280px;
    height: 30px;
    padding: 5px 10px 5px 10px;
    border-radius: 15px;
    background: #DADCE0;
    outline: 0;
    border: 0;
}
.sendBox{
    float: left;
}
.send_btn{
    width: 30px;
    height: 30px;
    line-height: 40px;
    text-align: center;
    margin: 10px;
    cursor: pointer;
  
    
}
.send_btn button{
    outline: 0;
    border: 0;
    background: white;
    color: #DADCE0;
    font-size: 20px;
    cursor: pointer;
}
</style>