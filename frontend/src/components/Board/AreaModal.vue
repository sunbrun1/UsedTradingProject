<template>
    <transition name='modal'>
        <div class="modal-mask" >
            <div class="modal-wrapper">
                <div class="modal-container">
                    <form>
                        <div class="title">
                            <h2>주소 검색 </h2> <span @click="$emit('close')">X</span>
                        </div>
                        <div class="area_input_wrap">
                            <div class="area_input_container">
                                <input type="text" @keyup.enter="areaSearch" v-model="area" placeholder="동(읍/면/리) 입력해주세요.">
                                <input type="text" class="noneinput">
                                <button type="button" class="searchBtn" @click="areaSearch"><font-awesome-icon icon="search"/></button>
                            </div>
                        </div>
                        <div class="area_select_wrap">
                            <ul v-for="item,index in areaList" :key="index">
                                <li @click="areaSelect(index)">
                                    {{item.area_sido}} {{item.area_sigugun}} {{item.area_dongeupmyeon}}
                                </li>  
                            </ul>
                            <ul>
                                <li>
                                    {{err}}
                                </li>
                            </ul>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    data(){ 
        return {
            form:"",
            area:"",
            areaList:[],
            err:""
        }
    },
    methods:{
        // 거래지역 검색
        areaSearch(){
            this.form = { 
				areaSearch:this.area,
			} 
            this.$axios.post("http://localhost:3000/api/board/areaSelect",this.form)
			.then((res)=>{
                if(res.data.success){ 
                    this.areaList = res.data.area;
                    this.err = "";
                }
                else{
                    this.areaList = "";
                    this.err = "검색결과 없음";
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        },
        // 거래지역 선택
        areaSelect(index){
            console.log(index)
            let area_sido = this.areaList[index].area_sido;
            let area_sigugun = this.areaList[index].area_sigugun;
            let area_dongeupmyeon = this.areaList[index].area_dongeupmyeon;
            this.$emit('areaSelect',area_sido,area_sigugun,area_dongeupmyeon); 
            this.$emit('close'); // 거래지역 모달창 닫기
        }
	}
}
</script>

<style scoped>
    body{
        padding-top: 200px;
    }
    .modal-enter {
        opacity: 0;
    }
    .modal-leave-active {
        opacity: 0;
    }
    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }
    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }
    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }
    .modal-container {
        width: 480px;
        height: auto;
        overflow: hidden;
        margin: auto;
        background-color: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
        position: relative;
    }
    .title{
        width: 420px;
        margin: auto;
        display: flex;
        justify-content: space-between;
        padding: 20px 0px 20px 0px;
        border-bottom: solid 2px #DADCE0;
    }
    .title span{
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 22px;
        cursor: pointer;
    }
    .area_input_wrap{
        width: 420px;
        margin: auto;
        padding: 20px 0px 20px 0px;
    }
    .area_input_container{
        width: 420px;
        height: 56px;
        margin: auto;
        border: solid 1px #DADCE0;
        display: flex;
    }
    .area_input_container input{
        width: 400px;
        height: 36px;
        padding: 10px;
        border: 0;
        outline: 0;
    }
    .searchBtn{
        border: 0;
        outline: 0;
        background: white;
        font-size: 20px;
        padding: 18px;
        cursor: pointer;
    }
    .area_select_wrap{
        width: 480px;
        height: 320px;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .area_select_wrap li{
        text-align: left;
        padding: 15px 30px 15px 30px;
        cursor: pointer;
        color: #212121;
    }
    .area_select_wrap li:hover{
        background: #DADCE0;;
    }
    .noneinput{
        display: none;
    }

    
    
</style>