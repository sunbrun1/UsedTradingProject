<template>
    <body>
        <form id="zz">
            <div class="basicinfo">
                <div class="basicinfo_item title1">
                    <h2>기본정보</h2>
                </div>
                <div class="basicinfo_item title2">
                    *필수항목
                </div>
            </div>

            <!-- 굵은 구분선 -->
            <div class="thick-line"></div>

            <!-- 상품이미지 -->
            <div class="prouctimage">
                <div class="productimage-item title">
                    상품이미지<span>*</span>
                </div>
                <div class="productimage-item file" >
                    <!-- 이미지추가 -->
                    <div v-if="!files.length" class="productimage-item preview" >
                        <label for='files' >
                            +<input type="file" name='files' id='files' ref="files" @change="imageUpload" accept="image/jpeg,image/png"/>
                        </label>
                    </div>
                    <!-- 이미지 출력 -->
                    <div v-else class="productimage-item addpreview" >
                        <div class="productimage-addimage" v-for="(item,index) in files" :key="index">
                            <!-- 대표이미지 -->
                            <div v-if="index=='0'" class="mainimage">
                                대표이미지
                            </div>
                            <!-- 이미지 삭제 버튼 -->
                            <div class="file-close-button">
                                <button type="button" @click="fileDeleteButton(index)">x</button>
                            </div>
                            <img :src="item.preview" width="239" height="239"/> <!-- 이미지-->
                        </div>
                        <div class="productimage-addimage2">
                            <label for="files">+</label>
                            <input type="file" name='files' id="files" ref="files" @change="imageUpload" accept="image/jpeg,image/png"/>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 얇은 구분선 -->
            <div class="thin-line"></div>

            <!-- 제목 -->
            <div class="productname">
                <div class="productname-item title" >
                    제목<span>*</span>
                </div>
                <div class="productname-item input">
                    <input type="text" v-on:input="textLengthCheck" v-model="title" ref="title" placeholder="제목을 입력해주세요." maxlength='20' spellcheck="false">
                </div>
                <div class="productname-item limit" >
                    {{title_length}}/20
                </div>
            </div>

            <!-- 얇은 구분선 -->
            <div class="thin-line"></div>

            <!-- 카테고리 -->
            <div class="category">
                <!-- 카테고리 타이틀 -->
                <div class="category-item title">
                    카테고리<span>*</span>
                </div>
                <!-- 대분류 -->
                <div class="category-item category_large" >
                    <ul class="category_large_ul">
                        <li class="category_large_li" v-for="(largeitem,index) in categoryList" :key="index"
                        @click="[categoryList.medium = largeitem.medium, selectCategoryLarge(index)]">
                            {{largeitem.large[0][1]}}
                            
                        </li>
                    </ul>
                </div>
                <!-- 중분류 -->
                <div class="category-item category_medium">
                    <ul class="category_medium_ul">
                        <li v-for="(mediumitem,index) in categoryList.medium" :key="index" 
                        class="category_medium_li" @click="selectCategoryMedium(index)">
                            {{mediumitem[1]}}
                        </li>
                    </ul>
                </div>


            </div>
            <!-- 선택한 카테고리 -->
            <div class="select-category">
                <div class="select-category-item">
                    선택한 카테고리: <b>{{selectLargeName}}</b><span v-if="selectLargeName">></span><b>{{selectMediumName}}</b>
                </div>
            </div>

            <!-- 얇은 구분선 -->
            <div class="thin-line"></div>

            <!-- 가격 -->
            <div class="productprice">
                <div class="productprice-item title" >
                    가격<span>*</span>
                </div>
                <div class="productprice-item input">
                    <input type="text" v-model="price" ref="price" placeholder="숫자만 입력해주세요." maxlength="9">
                </div>
                <div class="productprice-item won">
                    원
                </div>
            </div>

            <!-- 얇은 구분선 -->
            <div class="thin-line"></div>

            <!-- 상품상태 -->
            <div class="productstate">
                <div class="productstate-item title" >
                    상태<span>*</span>
                </div>
                <div class="productstate-item input">
                    <input type="radio" name="radio" v-model="state" value="새상품" id="radio1" />
                    <label  for="radio1" >새상품</label>
                </div>
                <div class="productstate-item input">
                    <input type="radio" name="radio" v-model="state" value="중고상품" id="radio2" />
                    <label for="radio2">중고상품</label>
                </div>
            </div>

            <!-- 얇은 구분선 -->
            <div class="thin-line"></div>

            <div class="product_content">
                <div class="product_content_item title">
                    내용
                </div>
                <div class="product_content_item content">
                    <textarea v-model="content" spellcheck = "false" placeholder="상품 설명을 입력해주세요.">         
                    </textarea>

                </div>

            </div>

            <!-- 등록 -->
            <div class="product-upload">
                <button type="button" @click="update">등록</button>
            </div>
            
            
        </form>
    </body>
</template>


<script>
export default {
    data(){
        return{
            product:'',
            files:[],  //파일
            title:'',  //제목
            price:'',  //가격
            state:'',  //상품 상태
            content:'',  //내용 
            categoryList:[], //카테고리 데이터
            selectLargeName:'',  //선택한 카테고리 대분류
            selectMediumName:'', //선택한 카테고리 중분류
            title_length:0, //제목 글자수
            deleteImage:[], //삭제된 이미지
            test:''
        }
    },
    mounted() {
        this.getProductDate(); //접속시 상품 기존 데이터 불러오기
        this.getCategory(); //접속시 카테고리 데이터 불러오기
	},
	methods:{
        /* 상품 기존 데이터 불러오기 */
        getProductDate(){
            this.$axios.get("http://192.168.219.100:3000/api/board/product/" + this.$route.params.id)
			.then((res)=>{
                this.product = res.data.product;
                this.title = this.product[0].title;
                this.price = this.product[0].price;
                this.state = this.product[0].state;
                this.content = this.product[0].content;
                this.selectLargeName = this.product[0].category_large_name;
                this.selectMediumName = this.product[0].category_medium_name;
                this.test = this.product[0].image_name.split(',')
                for(let i=0; i<this.test.length; i++){
                    this.files.push({preview : "http://192.168.219.100:3000/" + this.test[i], image_name : this.test[i]})
                }
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
        fileDeleteButton(index) { // 이미지 삭제
            this.deleteImage.push(this.test[index])
            this.files.splice(index, 1);
            this.test.splice(index, 1);
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

        /* 상품 카테고리 관련 */
        getCategory() { // 카테고리 데이터 불러오기
			this.$axios.get("http://192.168.219.100:3000/api/board/getcategory")
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
        },

        /* 업로드 관련 */
        update(){  //상품 업로드
            var frm = new FormData()
            for(var i=0; i<this.files.length; i++){
                frm.append('files',  this.files[i].file);
            }
            frm.append('title', this.title);
            frm.append('price', this.price);
            frm.append('select_category_large', this.selectLargeName);
            frm.append('select_category_medium', this.selectLargeName);
            frm.append('state', this.state);
            frm.append('content', this.content);
            frm.append('image_name', this.test);
            frm.append('deleteImage', this.deleteImage);

            const config = {
                header: { 'content-type': 'multipart/form-data'},
                'withCredentials': true
            };

            this.$axios.post("http://192.168.219.100:3000/api/board/update/" + this.$route.params.id ,frm, config)
			.then((res)=>{
                if(res.data.success){
                    alert("수정완료");
                    this.$router.push({path:'/mypage/myproduct/list'});
                }
                else{
                    alert("등록실패");
                }
			})
			.catch((err)=>{
				console.log(err);
			})
        }
	}
}

</script>

<style scoped>
    body{
        padding-top: 196px;
    }
    /* 기본정보 h2*/
    .basicinfo{
        width: 1180px;
        height: 30px;
        line-height: 30px;
        margin: auto;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    /* 가로정렬 */
    .basicinfo_item{
        float: left;
    }
    /* 기본정보 */
    .title1{
        padding-right: 30px;
    }
    /* 필수항목 */
    .title2{
        color: red;
    }
    /* 굵은구분선 */
    .thick-line{
        width: 1180px;
        height: 2px;
        margin: auto;
        background-color: black;
    }
    /* 얇은 구분선 */
    .thin-line{
        width: 1180px;
        height: 1px;
        margin: auto;
        background-color: #DADCE0;
    }
    /*=================  상품이미지  =========================*/
    .prouctimage{
        overflow:hidden;
        width: 1180px;
		height:auto;
        margin: auto;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    /* 가로정렬 */
    .productimage-item{
        float: left;
    }
    /* 상품이미지 타이틀 */
    .productimage-item.title{
        font-size: 18px;
        padding-right: 54px;
        margin-top: 6px;
    }
    /* 별표 */
    .productimage-item.title span{
        color: red;
    }
    /* 이미지추가1 */
    .productimage-item.preview input{
        display: none;
    }
    .productimage-item.preview label{
        padding: 107px 115px;
        cursor: pointer;
        line-height: 238px;
        background: #DADCE0;
    }
    /* 이미지 */
    .productimage-item.addpreview{
        width: 1034px;
        position: relative;
    }
    .productimage-addimage{
        float: left;
        margin-bottom: 20px;
        position: relative;
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
    .file-close-button{
        text-align: right;
    }
    /* 이미지삭제버튼 */
    .file-close-button button{
        width: 20px;
        height: 20px;
        border: 0px;
        outline: 0px;
        position: absolute;
        left: 219px;
    }
    .productimage-addimage:not(:nth-child(4n)){
        margin-right: 25px;
    }
    /* 이미지추가 */
    .productimage-addimage2{
        float: left;
    }
    .productimage-addimage2 input{
        display: none;
    }
    .productimage-addimage2 label{
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
        text-align: left;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    /* 가로 정렬 */
    .productname-item{
        float: left;
    }
    /* 제목  */
    .productname-item.title{
        font-size: 18px;
        height: 50px;
        line-height: 50px;
        padding-right: 103px;
    }
    .productname-item.title span{
       color: red;
    }
    /* 상품명 input  */
    .productname-item.input{
        width: 604px;
        height: 48px;
        border: 1px solid #DADCE0;
    }
    .productname-item.input input{
        width: 584px;
        height: 28px;
        padding: 10px;
        border: 0px;
        outline: 0px;
    }
    .productname-item.input:hover{
        border: 1px solid black;
    }
    /* 글자수 제한 */
    .productname-item.limit{
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        padding-left: 25px;

    }
    /*=================  카테고리  =========================*/
    .category{
        width: 1180px;
        height: 302px;
        margin: auto;
        text-align: left;
        padding-top: 30px;
    }
    /* 가로정렬 */
    .category-item{
        float: left;
    }
    /* 카테고리 */
    .category-item.title{
        height: 302px;
        font-size: 18px;
        padding-right: 70px;
    }
    .category-item.title span{
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

    .category_large ul{
        cursor: pointer;
    }
    .category_large li{
        padding: 10px;
    }
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
    .category_medium ul{
        cursor: pointer;
    }
    .category_medium li{
        padding: 10px;
    }
    .category_medium li:hover{
        background: #DADCE0;
    }
    .category_large_li:hover > .category_medium li{
        display: block;
    }

    /* 선택한 카테고리: */
    .select-category{
        width: 1180px;
        height: 30px;
        margin: auto;
        padding-top: 30px;
        padding-bottom: 30px;
        text-align: left;
        font-size: 18px;
    }
    .select-category-item{
        padding-left: 135px;
        color: #19b2f5;
    }
    .select-category-item span{
        padding: 0px 10px 0px 10px;
    }
    
    /*=================  가격  =========================*/
    .productprice{
        width: 1180px;
        height: 50px;
        margin: auto;
        text-align: left;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    /* 가로정렬 */
    .productprice-item{
        float: left;
    }
    /* 가격 */
    .productprice-item.title{
        font-size: 18px;
        height: 50px;
        line-height: 50px;
        padding-right: 103px;
    }
    /* 별표 */
    .productprice-item.title span{
        color: red;
    }
    /* 상품가격 input창 */
    .productprice-item.input{
        width: 300px;
        height: 48px;
        border: 1px solid #DADCE0;
    }
    .productprice-item.input input{
        width: 280px;
        height: 28px;
        padding: 10px;
        border: 0px;
        outline: 0px;
    }
    .productprice-item.input:hover{
        border: 1px solid black;
    }
    /* 원 */
    .productprice-item.won{
        font-size: 18px;
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
    }
    /*=================  상품 상태  =========================*/
    .productstate{
        width: 1180px;
        height: 50px;
        margin: auto;
        text-align: left;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    /* 상태 */
    .productstate-item.title{
        font-size: 18px;
        padding-right: 103px;
        height: 50px;
        line-height: 50px;
    }
    /* 별표 */
    .productstate-item.title span{
        color: red;
    }
    /* 가로정렬 */
    .productstate-item{
        float: left;
    }
    /* 상품 상태 input(radio)창 */
    .productstate-item.input{
        font-size: 18px;
        margin-right: 50px;
        height: 50px;
        line-height: 50px;
    }
    .productstate-item.input label{
        padding-left: 10px;
    }
    /*=================  내용  =========================*/
    .product_content{
        width: 1180px;
        height: 300px;
        margin: auto;
        text-align: left;
        padding-top: 30px;
        padding-bottom: 30px;
    }
    /* 내용 */
    .product_content_item.title{
        font-size: 18px;
        padding-right: 103px;
        height: 232px;
    }
    /* 가로정렬 */
    .product_content_item{
        float: left;
    }
    /* textarea 창 */
    .product_content_item.content{
        width: 821px;
        height: 230px;
        border: solid 1px #DADCE0;
    }
    .product_content_item.content:hover{
        border: solid 1px black;
    }
    .product_content_item.content textarea{
        border: 0px;
        outline: 0px;
        width: 801px;
        height: 210px;
        padding: 10px;
        font-size: 18px;
        display: inline;
        vertical-align: top;
        resize: none;
        font-family: 'Noto Sans KR', sans-serif;
    }
    /*=================  등록버튼  =========================*/
    .product-upload button{
        width: 960px;
        height: 200px;
    }


</style>
