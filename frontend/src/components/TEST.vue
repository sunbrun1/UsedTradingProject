<template>
    <body>
        <!-- 상품이미지 -->
        <div class="prouctimage">
            <div class="productimage-item title">
                이미지
            </div>
            <div class="productimage-item file" >
                <!-- 이미지추가 버튼-->
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
                        <img :src="item.preview" width="239" height="239"/>
                    </div>
                    <!-- 이미지추가 버튼2 -->
                    <div class="productimage-addimage2">
                        <label for="files">+</label>
                        <input type="file" name='files' id="files" ref="files" @change="imageUpload" accept="image/jpeg,image/png"/>
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
            files:[],  //파일
        }
    },
	methods:{
        // 이미지 추가
        imageUpload(){
            if(this.files.length < 12){
                for (let i = 0; i < this.$refs.files.files.length; i++) {
                    this.files = [
                        ...this.files,
                        //이미지 추가
                        {
                            //실제 파일
                            file: this.$refs.files.files[i],
                            //이미지 프리뷰
                            preview: URL.createObjectURL(this.$refs.files.files[i]),
                        }
                    ];
                }
            }
            else{
                alert("이미지는 최대 12개 까지 업로드 할 수 있습니다.");
            }
        },
        // 이미지 삭제
        fileDeleteButton(index) {
            this.files.splice(index, 1);
        },
	}
}
</script>

<style scoped>
    body{
        padding-top: 200px;
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

</style>

