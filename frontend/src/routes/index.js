import Vue from 'vue';
import Router from 'vue-router';
import Content from '@/components/Content_main'; //메인 컴포넌트 호출
import Product_upload from '@/components/Product_upload'; //게시판 리스트 컴포넌트 호출
import hello from '@/components/HelloWorld'; //게시판 리스트 컴포넌트 호출
import product_detail from '@/components/product_detail'; //게시판 리스트 컴포넌트 호출
import Login from '@/components/Login'; //게시판 리스트 컴포넌트 호출
import test from '@/components/TEST';
Vue.use(Router); //vue 라우터 사용

export default new Router({ //라우터 연결
	mode: 'history',
	routes:[
		{
			path:'/'
			,name:Content
			,component:Content
		}
		,{
			path:'/upload'
			,name:Product_upload
			,component:Product_upload
		}
		,{
			path:'/hello'
			,name:hello
			,component:hello
		}
		,{
			path:'/product/:id'
			,name:product_detail
			,component:product_detail
		}
		,{
			path:'/login'
			,name:Login
			,component:Login
		}
		,{
			path:'/test'
			,name:test
			,component:test
		}
	]
	
})