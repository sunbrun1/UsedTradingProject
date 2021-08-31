import Vue from 'vue';
import Router from 'vue-router';

import Test from '@/components/Test';
/* 상품 CRUD 관련 */
import productMain from '@/components/Board/ProductMain'; 
import productUpload from '@/components/Board/ProductUpload'; 
import productUpdate from '@/components/Board/ProductUpdate';
import productDetail from '@/components/Board/ProductDetail'; 
import productByCategory from '@/components/Board/ProductByCategory';
import productBySearch from '@/components/Board/ProductBySearch';
import payment from '@/components/Board/payment';
import sellerPage from '@/components/Board/SellerPage';
import sellerPage2 from '@/components/Board/SellerPage2';

/* 마이페이지 관련 */
import myPage from '@/components/MyPage/MyPage';
import myProdcut from '@/components/MyPage/MyProduct';
import myWishList from '@/components/MyPage/MyWishList';
import myPoint from '@/components/MyPage/MyPoint';
import pwcheck from '@/components/MyPage/PwCheck';
import memberInfo from '@/components/MyPage/MemberInfo';
import transactionStatus from '@/components/MyPage/transactionStatus';

/* 채팅 관련 */
import chat from '@/components/Chat/Chat';
import chatList from '@/components/Chat/ChatList';


Vue.use(Router); //vue 라우터 사용

export default new Router({ //라우터 연결
	mode: 'history',
	routes:[
		/* 상품 CRUD 관련 */
		{
			path:'/'  // 메인화면(신규상품/인기상품 리스트)
			,name:"productMain"
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
			path:'/product/:no'  // 상품 상세보기
			,name:"productDetail" 
			,component:productDetail
		}
		,{
			path:'/bycategory/list'  // 카테고리별 상품리스트
			,name:"productByCategory"
			,component:productByCategory,
		}
		,{
			path:'/bySearch/list'  // 검색별 상품리스트
			,name:"productBySearch"
			,component:productBySearch,
		}
		,{
			path:'/product/:no/payment'  // 결제하기
			,name:"payment"
			,component:payment,
		}
		,{
			path:'/product/:no/sellerPage'  // 결제하기
			,name:"sellerPage"
			,component:sellerPage,
		}
		,{
			path:'/product/:no/sellerPage2'  // 결제하기
			,name:"sellerPage2"
			,component:sellerPage2,
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
		,{
			path:'/mypage/mywishlist' // 관심목록
			,name:myWishList
			,component:myWishList,
		}
		,{
			path:'/mypage/mypoint' //  내포인트
			,name:myPoint
			,component:myPoint,
		}
		,{
			path:'/mypage/memberinfo/pwcheck' // 개인정보 비밀번호 재확인
			,name:pwcheck
			,component:pwcheck,
		}
		,{
			path:'/mypage/memberinfo' // 개인정보 확인/수정
			,name:memberInfo
			,component:memberInfo,
		}
		,{
			path:'/mypage/transactionStatus/list' // 개인정보 확인/수정
			,name:transactionStatus
			,component:transactionStatus,
		}
		/* 채팅 관련 */
		,{
			path:'/talk/user/:memberId'
			,name:chat
			,component:chat,
		}
		,{
			path:'/talk'
			,name:chatList
			,component:chatList,
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