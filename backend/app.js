var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/db'); //db 연결 모듈 호출
var cors = require('cors'); //교차통신 모듈 호출
const jwt = require("jsonwebtoken");
const secretObj = require("./config/jwt");

var index = require('./routes/api/index');

var app = express();
app.io = require('socket.io')({cors:{origin:"*"}});

var conn = db.init();  //db 모듈 커넥션 실행
db.conn(conn); //db 연결 확인

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cors({origin: true, credentials: true})); // config 추가
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, './public/images')));

app.use('/api', index);

app.get("/chatList", (req,res) =>{ //채팅 리스트 조회
  let accessToken = req.cookies.accessToken; //엑세스토큰
  let Decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
  let loginId = Decode.member_id; // 로그인한 아이디
  console.log(loginId);

  conn.query("SELECT * FROM chat_room WHERE host = ? or guest = ?;",[loginId,loginId],(err,data) =>{ //로그인한 ID 채팅 리스트
    if(err) throw err;
    res.send({
      success:true,
      chatList:data,
    })

  })
})

/*        채팅관련             */
app.get("/chat/:productId",(req,res) => {
  let accessToken = req.cookies.accessToken; //엑세스토큰
  let Decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
  let buyerId = Decode.member_id; // 구매자 ID
  let productId = req.params.productId; //판매글 ID
  let sellerId;
  let room_id;

  let selectSql = "SELECT member_id FROM product WHERE id = ?;" //판매자 ID SELECT 쿼리
  let insertSql = "INSERT INTO chat_room (id, host, guest, title, product_id) values(?, ?, ?, ?, ?);" // 채팅 방 INSERT 쿼리
 
  conn.query(selectSql,productId,(err,data) =>{ //판매자 ID SELECT 쿼리
    if(err) throw err;
    sellerId = data[0].member_id; // 판매자 ID
    room_id = sellerId + buyerId;
    if(buyerId == sellerId){
      console.log("내 상품 입니다.");
    }
    else{
      conn.query("SELECT id FROM chat_room WHERE id = ?", room_id, (err,data) => {
        if(data[0] != null){ // 데이터가 있다면
          console.log("채팅방 이동");
          conn.query("SELECT * FROM chat_message WHERE room_id = ?", room_id, (err,data) => { //메시지 리스트 조회
            res.send({
              success:true,
              msgData:data,
            })
          })
        }
        else{ // 데이터가 없다면
          conn.query(insertSql,[room_id, sellerId, buyerId,"제목이다", productId],(err) =>{ // 채팅 방 INSERT 쿼리
            if(err) throw err;
          })
        }
      })
    }
  })

   /* 소켓 */
  app.io.once('connection',(socket) => {
    console.log("socket connect!");
    socket.join(room_id);
    /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
    socket.to(room_id).emit('update', {type: 'connect', name: "SERVER", message: buyerId + "님이 접속하였습니다."})

    /* 전송한 메세지 받기 */
    socket.on('message', (data) => {
      /* 받은 데이터에 누가 보냈는지 이름 추가 */
      data.name = buyerId;

      console.log(data);

      /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
      socket.broadcast.to(room_id).emit('update', data)

      conn.query("INSERT INTO chat_message (send_id, send_time, text, room_id, unidentified_id) values(?, ?, ?, ?, ?)",[buyerId, "gd", data.message ,room_id, sellerId],(err) => { //메세지 내용 DB 저장
        if(err) throw err;
      })
    });
    /* 접속 종료 */
    socket.on('disconnect',() => {
      console.log("socket disconnect!");
      console.log(buyerId + "님이 나가셨습니다");
    })
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
