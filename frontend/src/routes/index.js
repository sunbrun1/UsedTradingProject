import Vue from 'vue';
import Router from 'vue-router';

import Test from '@/components/Test';
/* 상품 CRUD 관련 */
import productMain from '@/components/Board/ProductMain'; 
import productUpload from '@/components/Board/ProductUpload'; 
import productUpdate from '@/components/Board/ProductUpdate';
import producDetail from '@/components/Board/ProductDetail'; 
import productByCategory from '@/components/Board/ProductByCategory';

/* 마이페이지 관련 */
import myPage from '@/components/MyPage/MyPage';
import myProdcut from '@/components/MyPage/MyProduct';

/* 채팅 관련 */
import chat from '@/components/Chat/Chat';


Vue.use(Router); //vue 라우터 사용

export default new Router({ //라우터 연결
	mode: 'history',
	routes:[
		/* 상품 CRUD 관련 */
		{
			path:'/'  // 메인화면(신규상품/인기상품 리스트)
			,name:productMain
			,component:productMain
		}
		,{
			path:'/upload'  // 상품 업로드
			,name:productUpload
			,component:productUpload
		}
		,{ 
			path:'/update/:id'  //상품 수정
			,name:productUpdate
			,component:productUpdate,
		}
		,{
			path:'/product/:id'  // 상품 상세보기
			,name:producDetail 
			,component:producDetail
		}
		,{
			path:'/getcategory/:id'  // 카테고리별 상품리스트
			,name:productByCategory
			,component:productByCategory,
			props:true 
		}

		/* 마이페이지 관련 */
		,{
			path:'/mypage'
			,name:myPage
			,component:myPage,
			props:true 
		}
		,{
			path:'/mypage/myproduct/list'
			,name:myProdcut
			,component:myProdcut,
			props:true 
		}
		/* 채팅 관련 */
		,{
			path:'/chat'
			,name:chat
			,component:chat,
			props:true 
		}
		/* 테스트 */
		,{
			path:'/Test'
			,name:Test
			,component:Test,
			props:true 
		}

	]
	
})