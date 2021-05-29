<template>
    <body>
        <div class="chatListWrap">
            <h4>채팅 리스트</h4>
            <div class="chatList" v-for="(item) in chatList" :key="item.id">
                <div class="horizontal">
                    <div class="member_id">
                        {{talkUser}}
                    </div>
                    <div class="last_message">
                        판매중이 상품에 관심있어요!
                    </div>
                </div>
                <div class="horizontal">
                    <div class="time">
                        2021.5.19 수요일
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
            talkUser:"",
            memberNum:""
        }
    },
    mounted(){
        this.test();
    },
	methods:{
        test(){
            this.$axios.get("http://localhost:3000/talk", {withCredentials: true})
			.then((res)=>{
                if(res.data.success){
                    this.chatList = res.data.chatList;
                    this.talkUser = res.data.talkUser;
                    this.memberNum = res.data.hostMemberNum;
                    console.log(this.talkUser)
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        newPage(member_num,product_id,id){
            window.open("/talk/user/" + member_num + "?isDirect=false&product_no=" + product_id + '&room_no=' + id);
        }
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
    }
    .last_message{
        color: #666666;
        font-size: 14px;
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