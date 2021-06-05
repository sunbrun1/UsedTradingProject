<template>
    <body>
        <div class ="talk_wrap">
            <div class="seller_id">
                {{sellerId}} <span @click="talkDelete"> <font-awesome-icon icon="sign-out-alt" class="font"/> </span>
            </div>
            <div class="productInfo">
                <div class="info image">
                    <img :src="`http://localhost:3000/` + image" width="40" height="40"/>
                </div>
                <div class="info">
                    <div class="title">
                        {{title}}
                    </div>
                    <div class="price">
                        {{price}} 원
                    </div>
                </div>
            </div>
            <div class="talk" refs="talk">
                <ul v-for="(item) in msgData" :key="item.id">
                    <li class = "you" v-if="item.send_id == you">
                        <div class="you_username">{{item.send_id}}</div>
                        <div class="you_msg">{{item.message_text}}</div>
                    </li>
                    <li class = "me" v-if="item.send_id == me">
                        <div class="me_username">{{item.send_id}}</div>
                        <div class="me_msg">{{item.message_text}}</div>
                    </li>
                </ul>
            </div>
            <div class="sendBox send_input">
                <input type="text" v-model="text" @keyup.enter="send" placeholder="메시지를 입력해주세요..">
            </div>
            <div class="sendBox send_btn">
                <button @click="send"><font-awesome-icon icon="paper-plane" class="font"/></button>
            </div>
        </div>
    </body>
</template>

<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
<script >
import io from 'socket.io-client';

export default {
    data(){
        return{
            msgData:[],
            product:"",
            image:"",
            title:"",
            price:"",
            sellerId:"",
            text:"",
            you:"",
            me:"",
            socket : io("http://localhost:3000")
        }
    },
    mounted() {
		this.loginCheck();

    },
    updated(){
        this.scroll();
    },
	methods:{
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
                    this.msgData = res.data.msgData;
                    this.product = res.data.product[0];
                    this.image = this.product.thumbnail;
                    this.title = this.product.title;
                    this.price = this.product.price;
                    this.sellerId = this.product.member_id;
                    this.you = res.data.you;
                    this.me = res.data.me;
                    console.log(this.you)
                    console.log(this.me)
                    console.log(this.msgData)
                    this.socket = io("http://localhost:3000");
                    this.socket.on('update', (data) => {
                        console.log(data.message);
                        this.msgData.push({send_id:this.you, message_text:data.message}); 
                    })
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        // 방 나가기
        talkDelete(){ 
            Swal.fire({
                text: "대화방을 나가면 대화 내용이 모두 삭제됩니다.",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '확인',
                cancelButtonText: '취소'
            })
            .then((result) => {
                if (result.value) {
                    let info = {
                        productNo : this.$route.query.product_no,
                        isDirect: this.$route.query.isDirect,
                        roomNo : this.$route.query.room_no
                    }
                    this.$axios.post("http://localhost:3000/talk/delete", info, {withCredentials: true})
                    .then((res)=>{
                        if(res.data.success){
                            window.close();
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                    })
                }
            })
         
        },
        send(){
            this.socket.emit('message', {message: this.text})
            this.msgData.push({send_id:this.me, message_text:this.text}); 
            this.text = '';
        },
        scroll(){
            let objDiv = document.getElementsByClassName("talk");
            objDiv[0].scrollTop = objDiv[0].scrollHeight;
        },
        
	}
}
</script>

<style scoped>
body{
    font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.talk_wrap{
    width: 380px;
    height: 665px;
}
.talk{
    width: 360px;
    height: 486px;
    background: rgb(244, 244, 250);
    padding: 10px;
    overflow:auto;
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
    left: 140px;
    cursor: pointer;
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
    width: 100px;
    height: 20px;
    padding: 0px 10px 0px 10px;
    text-align: left;
    font-size: 14px;
    overflow:hidden; 
    text-overflow:ellipsis; 
    white-space:nowrap;
}
.price{
    width: 100px;
    height: 20px;
    padding: 0px 10px 0px 10px;
    text-align: left;
    font-size: 14px;
    overflow:hidden; 
    text-overflow:ellipsis; 
    white-space:nowrap;
}

.you{
    padding: 10px 0px 10px 0px;
    height: auto;
    overflow: hidden;
}
.you_username{
    text-align: left;
    font-size: 12px;
    padding-bottom: 3px;
}
.you_msg{
    max-width: 200px;
    height: auto;
    background: white;
    float: left;
    text-align: left;
    padding: 3px;
    font-size: 14px;
    border: solid 1px #DADCE0;
    border-radius: 5px;
}
.me{
    
    padding: 10px 0px 10px 0px;
    height: auto;
    overflow: hidden;
}
.me_username{
    text-align: right;
    font-size: 12px;
    padding-bottom: 3px;
}
.me_msg{
    max-width: 200px;
    height: auto;
    background: #19b2f5;
    color: white;
    float: right;
    padding: 3px;
    font-size: 14px;
    text-align: left;
    border: solid 1px #DADCE0;
    border-radius: 5px;
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