<template>
    <section>
        <Header></Header>
        <AreaModal @close="closeModal" @areaSelect="areaSelect" v-if="modal"></AreaModal>
        <body>
            <form>
                <!-- 기본정보 -->
                <div class="basicinfo_container">        
                    <h2>기본정보</h2>
                    <span>*필수항목</span>
                </div>

                <!-- 상품이미지 -->
                <div class="addimage_container">
                    <div class="addimage_title">
                        상품이미지<span>*</span>
                    </div>
                    <div class="file">
                        <!-- 이미지추가 -->
                        <div class="addimage" v-if="!files.length">
                            <label for='files' >
                                +<input type="file" name='files' id='files' ref="files" @change="imageUpload" accept="image/jpeg,image/png"/>
                            </label>
                        </div>
                        <!-- 이미지 출력 -->
                        <div class="image" v-else >
                            <div class="image_item" v-for="(item,index) in files" :key="index">
                                <!-- 이미지 -->
                                <img :src="item.preview" width="239" height="239"/>
                                <!-- 대표이미지 -->
                                <div class="mainimage" v-if="index == '0'">
                                    대표이미지 
                                </div>
                                <!-- 이미지 삭제 버튼 -->
                                <div class="close_button">
                                    <button type="button" @click="fileDeleteButton(index)">x</button>
                                </div>
                            </div>
                            <div class="addimage2">
                                <label for="files">+</label>
                                <input type="file" name='files' id="files" ref="files" @change="imageUpload" accept="image/jpeg,image/png"/>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 제목 -->
                <div class="productname">
                    <div class="productname_title" >
                        제목<span>*</span>
                    </div>
                    <div class="productname_input">
                        <input type="text" v-on:input="textLengthCheck" v-model="title" ref="title" placeholder="제목을 입력해주세요." maxlength='20' spellcheck="false">
                    </div>
                    <div class="productname_limit" >
                        {{title_length}}/20
                    </div>
                </div>

                <!-- 카테고리 -->
                <div class="category_wrap">
                    <!-- 카테고리 타이틀 -->
                    <div class="category_title">
                        카테고리<span>*</span>
                    </div>
                    <!-- 대분류 -->
                    <div class="category_large" >
                        <ul>
                            <li v-for="(largeitem,index) in categoryList" :key="index" @click="[categoryList.medium = largeitem.medium, selectCategoryLarge(index)]">
                                {{largeitem.large[0][1]}}
                            </li>
                        </ul>
                    </div>
                    <!-- 중분류 -->
                    <div class="category_medium">
                        <ul>
                            <li v-for="(mediumitem,index) in categoryList.medium" :key="index" class="category_medium_li" @click="selectCategoryMedium(index)">
                                {{mediumitem[1]}}
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 선택한 카테고리 -->
                <div class="select_category_wrap">
                    <div class="select-category-item">
                        선택한 카테고리: <b>{{selectLargeName}}</b><span v-if="selectLargeName">></span><b>{{selectMediumName}}</b>
                    </div>
                </div>

                <div class="area_wrap">
                    <div class="area_container">
                        <div class="area_title">
                            거래지역<span>*</span>
                        </div>
                        <div class="area_select" @click="openModal">
                            주소 검색
                        </div>
                    </div>
                    <div class="area_input">
                        <input type="text" v-model="area" placeholder="지역을 선택해주세요" readonly >
                    </div>

                </div>

                <!-- 가격 -->
                <div class="productprice_wrap">
                    <div class="productprice_title" >
                        가격<span>*</span>
                    </div>
                    <div class="productprice_input">
                        <input type="text" v-model="price" ref="price" placeholder="숫자만 입력해주세요." maxlength="9">
                    </div>
                    <div class="productprice_won">
                        원
                    </div>
                </div>

                <!-- 상품상태 -->
                <div class="productstate_wrap">
                    <div class="productstate_title" >
                        상태<span>*</span>
                    </div>
                    <div class="productstate_input">
                        <input type="radio" name="radio" v-model="state" value="새상품" id="radio1" />
                        <label  for="radio1" >새상품</label>
                    </div>
                    <div class="productstate_input">
                        <input type="radio" name="radio" v-model="state" value="중고상품" id="radio2" />
                        <label for="radio2">중고상품</label>
                    </div>
                </div>

                <!-- 상품 내용 -->
                <div class="product_content_wrap">
                    <div class="product_content_container">
                        <div class="content_title">
                            내용
                        </div>
                        <div class="content">
                            <textarea v-model="content" v-on:input="contentLengthCheck" spellcheck = "false" placeholder="상품 설명을 입력해주세요."></textarea>
                        </div>
                    </div>
                     <div class="content_limit" >
                        {{content_length}}/1000
                    </div>
                </div>

                <!-- 상품 개수 -->
                <div class="product_EA_wrap">
                    <div class="product_EA_title" >
                        수량
                    </div>
                    <div class="product_EA_input">
                        <input type="text" v-model="ea">
                    </div>
                    <div class="product_EA">
                        개
                    </div>
                </div>

                <!-- 등록 -->
                <div class="product-upload">
                    <button type="button" @click="update">등록</button>
                </div>
                
                
            </form>
        </body>
    </section>
</template>


<script>
import Header from '@/components/Header.vue'
import AreaModal from '@/components/Board/AreaModal.vue'

export default {
    components: {Header, AreaModal},
    data(){
        return{
            product:'', //상품 데이터
            files:[],  //파일
            title:'',  //제목
            price:'',  //가격
            state:'',  //상품 상태
            content:'',  //내용 
            categoryList:[], //카테고리 데이터
            selectLargeName:'',  //선택한 카테고리 대분류
            selectMediumName:'', //선택한 카테고리 중분류
            area:'',
            ea:1,
            remainImage:"",
            title_length:0, //제목 글자수
            content_length:0, //내용 글자수
            deleteImage:[], //삭제된 이미지
            modal:false, // 거래지역 검색 모달 상태 
        }
    },
    mounted() {
        this.getProductDate(); //접속시 상품 기존 데이터 불러오기
        this.getCategory(); //접속시 카테고리 데이터 불러오기
	},
	methods:{
        /* 상품 기존 데이터 불러오기 */
        getProductDate(){
            // 로그인여부 확인
            this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
            .then(()=>{
                let productNo = this.$route.params.id;
                // 상품데이터 조회
                this.$axios.get("http://localhost:3000/api/board/product/" + productNo,{withCredentials: true})
                .then((res)=>{
                    this.product = res.data.product[0];
                    console.log(this.product)
                    this.title = this.product.title;
                    this.price = this.product.price;
                    this.state = this.product.state;
                    this.content = this.product.content;
                    this.selectLargeName = this.product.category_large_name;
                    this.selectMediumName = this.product.category_medium_name;
                    this.area = this.product.area;
                    this.ea = this.product.ea;
                    this.remainImage = this.product.image_name.split(',');
                    for(let i=0; i<this.remainImage.length; i++){
                        this.files.push({preview : "http://localhost:3000/" + this.remainImage[i], image_name : this.remainImage[i]})
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        /* 상품 이미지 관련 */
        imageUpload(){  //이미지 업로드 
            if(this.files.length < 12){
                for (let i = 0; i < this.$refs.files.files.length; i++) {
                    this.files = [
                        ...this.files, //이미지 추가
                        {
                            file: this.$refs.files.files[i], //실제 파일
                            preview: URL.createObjectURL(this.$refs.files.files[i]), //이미지 미리보기
                        }
                    ];           
                    console.log(this.files);  
                }
            }
            else{
                alert("이미지는 최대 12개 까지 업로드 할 수 있습니다.");
            }
        },
        /* 이미지삭제 */
        fileDeleteButton(index) { 
            this.deleteImage.push(this.remainImage[index])
            this.files.splice(index, 1);
            this.remainImage.splice(index, 1);
        },

        /* 상품 제목 관련 */
        textLengthCheck(e){ // 제목 글자수 체크(v-model 한글 처리)
            console.log(this.title.length)
            if(e.target.value.length > e.target.maxLength){
                e.target.value = e.target.value.substr(0, e.target.maxLength);
            }
            else if(e.target.value.length <= e.target.maxLength){
                this.title_length = e.target.value.length;
            }
        },
        /* 상품 내용 길이체크 */
        contentLengthCheck(e){ // 제목 글자수 체크(v-model 한글 처리)
            if(e.target.value.length > 1000){
                e.target.value = e.target.value.substr(0, 1000);
                this.content_length = e.target.value.length;
            }
            else if(e.target.value.length <= 1000){
                this.content_length = e.target.value.length;
            }
        },

        /* 상품 카테고리 관련 */
        getCategory() { // 카테고리 데이터 불러오기
			this.$axios.get("http://localhost:3000/api/board/getcategory")
			.then((res)=>{
                this.categoryList = res.data.categoryList; 
			})
			.catch((err)=>{
				console.log(err);
			})
		},
        selectCategoryLarge(index){ // 대분류 카테고리 선택 함수
            this.selectMediumName = '';
            this.selectLargeName=this.categoryList[index].large[0][1];
        },
        selectCategoryMedium(index){ // 중분류 카테고리 선택 함수
            this.selectMediumName=this.categoryList.medium[index][1];
            console.log(this.selectMediumName)
        },
        // 주소 검색 모달창 열기
        openModal() {
            this.modal = true;
        },
        // 주소 검색 모달창 닫기
        closeModal() {
            this.modal = false;
        },
        areaSelect(area_sido, area_sigugun, area_dongeupmyeon){
            this.area = area_sido + " " + area_sigugun + " " +area_dongeupmyeon
        },

        /* 업로드 */
        update(){  
            /* 로그인여부 확인 */
            console.log(this.files)

            this.$axios.get("http://localhost:3000/api/member/someAPI",{withCredentials: true})
            .then(()=>{
                if(this.files.length < 1){
                    return alert("상품 사진을 등록해주세요.");
                }
                if(this.title.length < 2 || this.title.length > 20){
                    this.$refs.title.focus();
                    return alert("상품명을 2~20자 이내로 입력해주세요.")
                }
                if(this.selectLargeName.length < 1 && this.selectMediumName.length < 1){
                    return alert("카테고리를 선택해주세요.")
                }
                if(this.area.length < 1){
                    return alert("거래지역을 선택해주세요.")
                }
                if(this.price < 100){
                    this.$refs.price.focus();
                    return alert("상품 가격을 100원이상 입력해주세요.")
                }
                if(this.state.length < 1){
                    return alert("상품 상태를 선택해주세요.")
                }
                if(this.ea < 1){
                    return alert("상품 수량을 입력해주세요.")
                }

                let frm = new FormData()
                for(let i=0; i<this.files.length; i++){
                    frm.append('files',  this.files[i].file);
                }
                frm.append('title', this.title);
                frm.append('price', this.price);
                frm.append('select_category_large', this.selectLargeName);
                frm.append('select_category_medium', this.selectMediumName);
                frm.append('state', this.state);
                frm.append('content', this.content);
                frm.append('area', this.area);
                frm.append('ea', this.ea);
                frm.append('remainImage', this.remainImage);
                frm.append('deleteImage', this.deleteImage);

                const config = {
                    header: { 'content-type': 'multipart/form-data'},
                    'withCredentials': true
                };
                /* 업로드 POST */
                this.$axios.post("http://localhost:3000/api/board/update/" + this.$route.params.id ,frm, config)
                .then((res)=>{
                    if(res.data.success){
                        alert("등록완료");
                        this.$router.push({path:'/mypage/myproduct/list'});
                    }
                    else if(res.data == "imageCheckError"){
                        alert("상품 사진을 등록해주세요.")
                    }
                    else if(res.data == "titleCheckError"){
                        alert("상품명을 2자 이상 입력해주세요.")
                        this.$refs.title.focus();
                    }
                    else if(res.data == "categoryCheckError"){
                        alert("카테고리를 선택해주세요.")
                    }
                    else if(res.data == "priceCheckError"){
                        alert("상품 가격을 입력해주세요.")
                        this.$refs.price.focus();
                    }
                    else if(res.data == "stateCheckError"){
                        alert("상품 상태를 선택해주세요.")
                    }
                    else{
                        alert("등록실패");
                    }
                })
                .catch((err)=>{
                    console.log(err);
                })
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
        padding-top: 189px;
        
    }
    /* === 기본정보 h2 ===*/
    .basicinfo_container{
        width: 1180px;
        height: 30px;
        margin: auto;
        padding: 30px 0px 30px 0px;
        border-bottom: solid 2px #696969;
        display: flex;
    }
    /* 기본정보 h2 */
    .basicinfo_container h2{
        line-height: 30px;
    }
    /* *필수항목 */
    .basicinfo_container span{
        line-height: 30px;
        color: red;
        padding-left: 30px;
    }

    /* 얇은 구분선 */
    .thin-line{
        width: 1180px;
        height: 1px;
        margin: auto;
        background-color: #DADCE0;
    }
    /*=================  상품이미지  =========================*/
    .addimage_container{
        width: 1180px;
		height:auto;
        margin: auto;
        overflow:hidden;
        padding: 30px 0px 30px 0px;
        display: flex;
        border-bottom: solid 1px #DADCE0;
    }

    /* 상품이미지 타이틀 */
    .addimage_title{
        width: 145px;
        text-align: left;
        font-size: 18px;
    }
    /* 별표 */
    .addimage_title span{
        color: red;
    }
    /* file input 숨기기 */
    .addimage input{
        display: none;
    }
    /* 이미지추가 label */
    .addimage label{
        padding: 107px 115px;
        cursor: pointer;
        line-height: 238px;
        background: #DADCE0;
    }
    /* 이미지 */
    .image{
        width: 1050px;
        height: auto;
        overflow: hidden;
        position: relative;
        display: flex;
        flex-flow: wrap;
    }
    .image_item{
        width: 239px;
        height: 239px;
        position: relative;
    }
    .image_item:not(:nth-child(4n)){
        padding: 0px 31px 31px 0px;

    }
    /* 대표이미지 */
    .mainimage{
        padding: 3px;
        border: 1px solid #1e1d2952;
        background: #1e1d2952;
        border-radius: 20px;
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 12px;
        color: #ffffff;
    }
    /* 이미지 삭제버튼 오른쪽 정렬 */
    .close_button{
        text-align: right;
        position: absolute;
        top: 0;
    }
    /* 이미지삭제버튼 */
    .close_button button{
        width: 20px;
        height: 20px;
        border: 0px;
        outline: 0px;
        position: absolute;
        left: 219px;
    }
    .image_add:not(:nth-child(4n)){
        margin-right: 25px;
    }
    /* 이미지추가 */
    .addimage2 input{
        display: none;
    }
    .addimage2 label{
        padding: 107px 115px;
        cursor: pointer;
        line-height: 238px;
        background: #DADCE0;
    }
    /*=================  제목  =========================*/
    .productname{
        width: 1180px;
        height: 50px;
        margin: auto;
        padding: 30px 0px 30px 0px;
        display: flex;
        border-bottom: solid 1px #DADCE0;
    }
    /*  제목  */
    .productname_title{
        width: 145px;
        line-height: 50px;
        text-align: left;
        font-size: 18px;
    }
    /* 별표 */
    .productname_title span{
       color: red;
    }
    /* 제목 input  */
    .productname_input{
        width: 604px;
        height: 48px;
        border: 1px solid #DADCE0;
    }
    /* 제목 input 테두리 제거 */
    .productname_input input{
        width: 584px;
        height: 28px;
        padding: 10px;
        border: 0px;
        outline: 0px;
    }
    /* 제목 input 호버시 강조 */
    .productname_input:hover{
        border: 1px solid black;
    }
    /* 제목 글자수 제한 */
    .productname_limit{
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        padding-left: 25px;
    }
    /*=================  카테고리  ================*/
    .category_wrap{
        width: 1180px;
        height: 302px;
        margin: auto;
        text-align: left;
        padding-top: 30px;
        display: flex;
    }
    /* 카테고리 title*/
    .category_title{
        width: 145px;
        font-size: 18px;
    }
    /* 별표 */
    .category_title span{
        color: red;
    }
    /* 카테고리 대분류 */
    .category_large{
        width: 300px;
        height: 300px;
        border: 1px solid #DADCE0;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    /* 카테고리 대분류 ul */
    .category_large ul{
        cursor: pointer;
    }
    /* 카테고리 대분류 li */
    .category_large li{
        padding: 10px;
    }
    /* 카테고리 대분류 li 호버시 색변경 */
    .category_large li:hover{
        background: #DADCE0;
    }
    /* 카테고리 중분류 */
    .category_medium{
        width: 300px;
        height: 300px;
        border: 1px solid #DADCE0;
        overflow-x: hidden;
        overflow-y: scroll; 
    }
    /* 카테고리 중분류 ul */
    .category_medium ul{
        cursor: pointer;
    }
    /* 카테고리 중분류 li */
    .category_medium li{
        padding: 10px;
    }
    /* 카테고리 중분류 li 호버시 색변경 */
    .category_medium li:hover{
        background: #DADCE0;
    }
    /* 선택한 카테고리: */
    .select_category_wrap{
        width: 1180px;
        height: 30px;
        margin: auto;
        padding: 30px 0px 30px 0px;
        text-align: left;
        font-size: 18px;
        border-bottom: solid 1px #DADCE0;
    }
    .select-category-item{
        padding-left: 135px;
        color: #19b2f5;
    }
    .select-category-item span{
        padding: 0px 10px 0px 10px;
    }
    /* ==== 거래지역 ==== */
    .area_wrap{
        width: 1180px;
        margin: auto;
        padding: 30px 0px 30px 0px;
        border-bottom: solid 1px #DADCE0;
    }
    .area_container{
        display: flex;
    }
    /* 거래지역 title */
    .area_title{
        width: 145px;
        height: 50px;
        line-height: 50px;
        font-size: 18px;
        text-align: left;
    }
    /* 별표 */
    .area_title span{
        color: red;
    }
    /* 거래지역 선택버튼 */
    .area_select{
        width: 104px;
        height: 50px;
        line-height: 50px;
        border: solid 1px #DADCE0;
        border-radius: 2px;
        cursor: pointer;
    }
    /* 호버시 색변경 */
    .area_select:hover{
        background: #DADCE0;
    }
    /* 거래지역 input */
    .area_input{
        width: 604px;
        height: 48px;
        border: solid 1px #DADCE0;  
        margin: 15px 0px 0px 145px;
    }
    .area_input input{
        width: 584px;
        height: 28px;
        padding: 10px;
        border: 0;
        outline: 0;
        background: rgb(244, 244, 250);
    }

    /*=================  가격  =========================*/
    .productprice_wrap{
        width: 1180px;
        height: 50px;
        margin: auto;
        padding: 30px 0px 30px 0px;
        display: flex;
        border-bottom: solid 1px #DADCE0;
    }
    /* 가로정렬 */
    .productprice-item{
        float: left;
    }
    /* 가격 */
    .productprice_title{
        width: 145px;
        text-align: left;
        font-size: 18px;
        line-height: 50px;
    }
    /* 별표 */
    .productprice_title span{
        color: red;
    }
    /* 상품가격 input창 */
    .productprice_input{
        width: 300px;
        height: 48px;
        border: 1px solid #DADCE0;
    }
    .productprice_input input{
        width: 280px;
        height: 28px;
        padding: 10px;
        border: 0px;
        outline: 0px;
    }
    .productprice_input:hover{
        border: 1px solid black;
    }
    /* 원 */
    .productprice_won{
        font-size: 18px;
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
    }
    /*=================  상품 상태  =========================*/
    .productstate_wrap{
        width: 1180px;
        height: 50px;
        margin: auto;
        padding: 30px 0px 30px 0px;
        display: flex;
        border-bottom: 1px solid #DADCE0;
    }
    /* 상태 */
    .productstate_title{
        font-size: 18px;
        padding-right: 103px;
        height: 50px;
        line-height: 50px;
    }
    /* 별표 */
    .productstate_title span{
        color: red;
    }
    /* 상품 상태 input(radio)창 */
    .productstate_input{
        font-size: 18px;
        margin-right: 50px;
        height: 50px;
        line-height: 50px;
    }
    .productstate_input label{
        padding-left: 10px;
    }
    /*=================  내용  =========================*/
    .product_content_wrap{
        width: 1180px;
        margin: auto;
        position: relative;
    }
    .product_content_container{
        width: 1180px;
        margin: auto;
        padding: 30px 0px 30px 0px;
        display: flex;
    }
    /* 내용 */
    .content_title{
        width: 145px;
        font-size: 18px;
        text-align: left;
    }
    .content{
        width: 821px;
        height: 230px;
        border: solid 1px #DADCE0;
    }
    .content:hover{
        border: solid 1px black;
    }
    .content textarea{
        border: 0px;
        outline: 0px;
        width: 801px;
        height: 210px;
        padding: 10px;
        font-size: 18px;
        display: inline;
        vertical-align: top;
    }
    .content_limit{
        position: absolute;
        bottom: -30px;
        left: 910px;
        padding: 0px 0px 30px 0px;
    }
    /* 상품 수량 */
    .product_EA_wrap{
        width: 1180px;
        margin: auto;
        padding: 30px 0px 30px 0px;
        display: flex;
        border-bottom: solid 1px #DADCE0;
        border-top: solid 1px #DADCE0;
    }
    .product_EA_title{
        width: 145px;
        height: 48px;
        line-height: 48px;
        font-size: 18px;
        text-align: left;
    }
    .product_EA_input{
        width: 240px;
        height: 48px;
        border: solid 1px #DADCE0;
    }
    .product_EA_input input{
        width: 220px;
        height: 28px;
        padding: 10px;
        font-size: 18px;
        border: 0;
        outline: 0;
    }
    .product_EA{
        line-height: 48px;
        padding-left: 20px;
        font-size: 20px;
    }
    /*=================  등록버튼  =========================*/
    .product-upload button{
        width: 960px;
        height: 200px;
        margin-top: 30px;        
    }
</style>