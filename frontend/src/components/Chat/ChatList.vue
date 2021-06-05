<template>
    <body>
        <div class="chatListWrap">
            <h4>채팅 리스트</h4>
            <div class="chatList" v-for="(item, index) in chatList" :key="index">
                <div class="productInfo_wrap">
                    <div class="productInfo_container" @click="talk(item.seller_no, item.product_no, item.talk_no, index)">
                        <div class="image">
                            <img :src="`http://localhost:3000/` + productImage[index]" width="50" height="50"/>
                        </div>
                        <div class="product_info">
                            <div class="title">
                                {{productTitle[index]}}
                            </div>
                            <div class="won">
                                {{productPrice[index].toLocaleString('ko-KR')}} 원
                            </div>
                        </div>
                        <div class="talk_info">
                            <div class="member_id">
                                {{talkUser[index]}}
                            </div>
                            <div class="last_message">
                                {{msgText[index]}}
                            </div>
                        </div>
                        <div class="time">
                            {{msgTime[index]}}
                        </div>
                    </div>
                    <div class="ellipsis" @click="talkDelete(item.talk_no)">
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
            productImage:"",
            productTitle:"",
            productPrice:"",
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
                    this.productImage = res.data.productImage;
                    this.productTitle = res.data.productTitle;
                    this.productPrice = res.data.productPrice;
                    this.msgText = res.data.msgText;
                    this.msgTime = res.data.msgTime;
                    this.talkUser = res.data.talkUser;
                    let date = [];
                    for(let i=0; i<this.msgTime.length; i++){
                        let dateSplit = new Date(this.msgTime[i]).toLocaleString('ko-KR').split(".");
                        date.push(dateSplit[0] + "." + dateSplit[1] + "." + dateSplit[2])
                    }
                    this.msgTime = date;
                    console.log( this.msgTime)
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        talk(member_num,product_id,id,index){
            window.open("/talk/user/" + member_num + "?isDirect=false&product_no=" + product_id + '&room_no=' + id, index, "width=380,height=670");
        },
        talkDelete(talk_no){
            console.log(talk_no)
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
    body{
        font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
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
        width: 380px;
        height: 70px;
        border-bottom: solid 1px #DADCE0;
        background: white;
        cursor: pointer;
    }

    /* 상품 정보 wrap */
    .productInfo_wrap{
        width: 360px;
        height: 50px;
        text-align: left;
        display: flex;
        padding: 10px;
        position: relative;
    }   
    .productInfo_container{
        width: 340px;
        height: 50px;
        display: flex;
    }
    .image img{
        border-radius: 50px;
    }
    .product_info{
        width: 80px;
        height: 50px;
        padding: 0px 0px 0px 5px;
        font-size: 12px;
    }
    .title{
        width: 80px;
        height: 17px;
        padding-top: 3px;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
    }
    .won{
        width: 80px;
        height: 17px;
        padding-top: 7px;
    }
    .talk_info{
        width: 140px;
        height: 50px;
        padding-left: 3px;
    }
    .member_id{
        width: 130px;
        height: 16px;
        line-height: 16px;
        padding-bottom: 10px;
        color: #212121;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
    }
    .last_message{
        width: 130px;
        height: 24px;
        color: #666666;
        font-size: 14px;
        overflow:hidden; 
        text-overflow:ellipsis; 
        white-space:nowrap;
    }
    .time{
        color: #999999;
        font-size: 12px;
    }
    .ellipsis{
        width: 30px;
        height: 50px;
        line-height: 50px;
        position: absolute;
        left: 350px;
        top: 10px;
        font-size: 20px;
        color: #999999;
        cursor: pointer;
        text-align: left;
       

    }
</style>