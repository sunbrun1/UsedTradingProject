<template>
    <body>
        <div class="chatListWrap">
            <h4>채팅 리스트</h4>
            <div class="chatList" v-for="(item, index) in chatList" :key="index" @click="talk(item.seller_id, item.product_no, item.talk_no)">
                <div class="horizontal">
                    <div class="member_id">
                        {{talkUser[index]}}
                    </div>
                    <div class="last_message">
                        {{msgText[index]}}
                    </div>
                </div>
                <div class="horizontal">
                    <div class="time">
                        {{msgTime[index]}}
                    </div>
                </div>
                <div class="horizontal">
                    <div class="ellipsis">
                        <font-awesome-icon icon="ellipsis-v" class="font"/>
                    </div>
                </div>
            </div>
        </div>


    </body>
</template>

<script>
export default {
    data(){
        return{
            chatList:"",
            talkMsgInfo:"",
            msgText:"",
            msgTime:"",
            talkUser:"",
            memberNum:""
        }
    },
    mounted(){
        this.loginCheck();
    },
	methods:{
        getTalkList(){
            this.$axios.get("http://localhost:3000/talk", {withCredentials: true})
			.then((res)=>{
                if(res.data.success){
                    this.chatList = res.data.chatList;
                    this.msgText = res.data.msgText;
                    this.msgTime = res.data.msgTime;
                    this.talkUser = res.data.talkUser;
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        talk(member_num,product_id,id){
            window.open("/talk/user/" + member_num + "?isDirect=false&product_no=" + product_id + '&room_no=' + id, "PopupWin", "width=380,height=670");
        },
        // 로그인여부 확인
        loginCheck(){
            this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
            .then(()=>{
                this.getTalkList();
			})
			.catch((err)=>{
				console.log(err);
			})
        },
	}
}
</script>

<style scoped>
    .chatListWrap{
        width: 380px;
        height: 650px;
        background: rgb(244, 244, 250);
    }
    .chatListWrap h4{
        width: 380px;
        height: 50px;
        line-height: 50px;
        background: white;
        border-bottom: solid 1px #DADCE0;
    }
    .chatList{
        width: 360px;
        height: 50px;
        padding: 10px;
        border-bottom: solid 1px #DADCE0;
        background: white;
        cursor: pointer;
    }
    .horizontal{
        float: left;
    }
    .member_id{
        width: 166px;
        height: 24px;
        text-align: left;
        color: #212121;
        font-size: 16px;
        padding-bottom: 3px;
        
    }
    .last_message{
        color: #666666;
        font-size: 14px;
        text-align: left;
        padding-top: 3px;
    
    }
    .time{
        width: 166px;
        height: 24px;
        text-align: right;
        color: #999999;
        font-size: 12px;
    }
    .ellipsis{
        position: relative;
        left: 20px;
        top: 15px;
        font-size: 20px;
        color: #999999;
        cursor: pointer;
    }
</style>