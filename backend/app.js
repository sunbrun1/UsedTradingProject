var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var conn = require('./config/db'); //db 연결 모듈 호출
var cors = require('cors'); //교차통신 모듈 호출
const jwt = require("jsonwebtoken");
const secretObj = require("./config/jwt");

var index = require('./routes/api/index');

var app = express();
app.io = require('socket.io')({cors:{origin:"*"}});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors({origin: "http://localhost:8081", credentials: true})); // config 추가
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './public/img')));

app.use('/api', index);

app.get("/talk", async (req,res) => { //채팅 리스트 조회
  let accessToken = req.cookies.accessToken; //엑세스토큰
  let Decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
  let loginId = Decode.member_id; // 로그인한 아이디
  let productImage = [];
  let productTitle = [];
  let productPrice = [];
  let msgText = [];
  let msgTime = [];
  let talkUser = [];

  let [chatList] = await conn.query("SELECT A.*, B.member_no AS seller_no, C.last_message FROM talk_room A " +
                                    "LEFT OUTER JOIN member B ON (seller_id = ? OR buyer_id = ?) AND A.seller_id = B.member_id " +
                                    "LEFT OUTER JOIN (SELECT talk_no, MAX(message_time) AS last_message FROM talk_message GROUP BY talk_no) C ON A.talk_no = C.talk_no " +
                                    "ORDER BY C.last_message DESC;",[loginId,loginId]);

  for(let i=0; i<chatList.length; i++){
    let productNo = chatList[i].product_no;
    let talkSellerId = chatList[i].seller_id; 
    let talkBuyerId = chatList[i].buyer_id;
    let talkNo = chatList[i].talk_no;

    try{
      /* 상품정보 조회 쿼리 */
      let [product] = await conn.query("SELECT thumbnail,title,price FROM product WHERE id = ?;", productNo);
      productImage.push(product[0].thumbnail);
      productTitle.push(product[0].title);
      productPrice.push(product[0].price);
    }
    catch(err){
      console.log(err);
    }

    try{
      /* 최근 메시지/시간 조회 쿼리 */
      let [MsgInfo] = await conn.query("SELECT message_text, message_time FROM talk_message WHERE talk_no = ? ORDER BY message_no DESC limit 1;", talkNo);
      let recentText = MsgInfo[0].message_text;
      let recentTime = MsgInfo[0].message_time;
      msgText.push(recentText);
      msgTime.push(recentTime);
    }
    catch(err){
      console.log(err);
    }

    /* 상품 판매자 ID 조회 쿼리 */
    try{
      let [memberInfo] = await conn.query("SELECT member_id FROM product WHERE id = ?", productNo);
      let productSellerId = memberInfo[0].member_id; 

      if(loginId == productSellerId){  // 로그인한 ID가 판매자인 경우
        talkUser.push(talkBuyerId);
      }
      else{ // 로그인한 ID가 구매자인 경우
        talkUser.push(talkSellerId);
      }
    }
    catch(err){
      console.log(err);
    }
  }
  res.send({
    success:true,
    chatList:chatList,
    productImage:productImage,
    productTitle:productTitle,
    productPrice:productPrice,
    msgText:msgText,
    msgTime:msgTime,
    talkUser:talkUser,
  })
})


var currentLoginId;
var recevieId; //상품 판매자
var roomNo; //채팅방 넘버

/*        채팅관련             */
app.get("/talk/user/:memberNum", async (req,res) => {
  /* jwt토큰 로그인ID 추출 */
  let accessToken = req.cookies.accessToken; // 엑세스토큰
  let Decode = jwt.verify(accessToken, secretObj.secret); // 엑세스토큰 복호화
  currentLoginId = Decode.member_id; // 현재 로그인 ID
  let date = new Date();

  /* req.query */
  let productNo = req.query.product_no; // 상품 ID
  let isDirect = req.query.isDirect; // 상품페이지에서 바로 채팅했는지 유무

  /* 판매자 ID 조회 쿼리 */
  let [memberInfo] = await conn.query("SELECT member_id FROM product WHERE id = ?;", productNo);
  let sellerId = memberInfo[0].member_id; // 판매자 ID
  recevieId = sellerId;

  if(isDirect == 'true'){ // 상품페이지에서 판매자에게 채팅한 경우
    console.log("=== 상품 페이지에서 채팅 ===")

    /* 채팅내역(채팅방) 조회 쿼리 */
    let [data] = await conn.query("SELECT talk_no FROM talk_room WHERE seller_id = ? and buyer_id = ? and product_no = ?",[sellerId, currentLoginId, productNo]);
    
    if(data[0] != null){ // 기존 채팅방이 있다면 채팅방으로 이동
      console.log("=== 기존 채팅방으로 이동 ===");
      roomNo = data[0].talk_no; // 채팅방 ID
    }
    else{ // 기존 채팅방이 없다면 새로운 방 생성후 채팅방 이동
      console.log("=== 새로운 채팅방 생성후 이동 ===");
      console.log("=== 방생성 ===")

      /* 채팅방 생성 쿼리 */
      let [data] = await conn.query("INSERT INTO talk_room (seller_id, buyer_id, product_no) value(?, ?, ?);",[sellerId, currentLoginId, productNo]);
      let lastInsertId = data.insertId;
      roomNo = lastInsertId;
      await conn.query("INSERT INTO talk_message (send_id, receive_id, message_text, message_time, talk_no) values(?, ?, ?, ?, ?)",[currentLoginId, sellerId, "상품에 관심있습니다!" , date, roomNo]);
    } 
    /* 채팅 내역 조회 쿼리*/
    let [msgData] = await conn.query("SELECT * FROM talk_message WHERE talk_no = ?", roomNo);
    res.send({
      msgData:msgData,
      success:true
    })
  }
  else{ // 채팅리스트에서 채팅한 경우
    /* req.query */
    roomNo = parseInt(req.query.room_no); // 채팅방 ID
    /* 구매자 ID 조회 쿼리 */
    let [roomInfo] = await conn.query("SELECT buyer_id, seller_id FROM talk_room WHERE talk_no = ?;" , roomNo);
    console.log("===채팅 페이지에서 채팅===")

    if(currentLoginId == sellerId){ // 현재 로그인 유저가 판매자인 경우
      console.log("판매자 ID : " + sellerId)
      console.log("로그인 ID : " + currentLoginId)
      console.log("로그인한 유저는 판매자입니다")
      recevieId = roomInfo[0].buyer_id; // 구매자 ID
    }
    else{
      console.log("판매자 ID : " + sellerId)
      console.log("로그인 ID : " + currentLoginId)
      console.log("로그인한 유저는 구매자입니다.")
      recevieId = roomInfo[0].seller_id; // 판매자 ID
    }
    /* 채팅 내역 조회 쿼리 */
    let [msgData] = await conn.query("SELECT * FROM talk_message WHERE talk_no = ?", roomNo);
    res.send({
      msgData:msgData,
      success:true
    })
  }
})

  /* 소켓 */
    app.io.on('connection', function(socket) {
      console.log("=== socket connect! ===");
      let date = new Date();
      socket.sendId = currentLoginId; // 메시지 보낸 ID
      socket.recevieId = recevieId; // 메시지 받는 ID
      socket.roomNo = roomNo;
  
      console.log("socket.sendId : " + socket.sendId)
      console.log("socket.recevieId : " + socket.recevieId)
      console.log("room_no : " + socket.roomNo)

      socket.join(socket.roomNo); // 방 입장
  
      /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
      socket.broadcast.to(socket.roomNo).emit('update', {message: socket.sendId  + "님이 접속하였습니다."})
  
      /* 전송한 메세지 받기 */
      socket.on('message', (data) => {
        /* 받은 데이터에 누가 보냈는지 이름 추가 */
        data.send_id = socket.sendId;
        data.recevieId = socket.recevieId
        data.roomNo = socket.roomNo
        console.log(data);
  
        conn.query("INSERT INTO talk_message (send_id, receive_id, message_text, message_time, talk_no) values(?, ?, ?, ?, ?)",[socket.sendId, socket.recevieId, data.message , date, socket.roomNo],(err) => { //메세지 내용 DB 저장
          if(err) throw err;
        })
  
        /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
        socket.broadcast.to(socket.roomNo).emit('update', data)
  
        
      });
      /* 접속 종료 */
      socket.on('disconnect',() => {
        console.log("socket disconnect!");
        console.log(currentLoginId + "님이 나가셨습니다");
      })
    })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
