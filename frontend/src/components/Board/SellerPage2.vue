<template>
    <section>
        <Header></Header>
        <body>
            <div class="orderPage">
                <h2>주문상세페이지</h2>
            </div>
            <table class="table">
                    <colgroup>
                        <col width="10%" />
                        <col width="15%" />
                        <col width="60%" />
                        <col width="20%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>이미지</th>
                            <th>상품명</th>
                            <th>상품정보</th>
                            <th>가격</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><img :src="`http://localhost:3000/${thumbnail}`" width="100" height="100"/></td>
                            <td>{{title}}</td>
                            <td>{{content}}</td>
                            <td>{{price}}원</td>
                        </tr>
                    </tbody>
                </table>
        </body>
    </section>
</template>

<script>
import Header from '@/components/Header.vue'
export default {
    components:{Header},
    data(){
        return{
        }
    },
    mounted() {
	},
	methods:{
    }
}
</script>


<style scoped>
    body{
        padding-top: 189px;
        background: #ffffff;
        font-family: apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
    .orderPage h2{
        width: 1180px;
        margin: auto;
        text-align: left;
        padding: 30px 0px 30px 0px;
    }
    .table{
        width: 1180px;
        margin: auto;
    }
</style>