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

app.get("/talk", (req,res) =>{ //채팅 리스트 조회
  let accessToken = req.cookies.accessToken; //엑세스토큰
  let Decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
  let loginId = Decode.member_id; // 로그인한 아이디
  conn.query("SELECT a.*, b.member_num AS host_member_num FROM chat_room AS a, member AS b WHERE (host = ? OR guest = ?) AND a.host = b.member_id ;",[loginId,loginId],(err,data) =>{ //로그인한 ID 채팅 리스트
    if(err) throw err;
    res.send({
      success:true,
      chatList:data,
    })
  })
})

/*        채팅관련             */
app.get("/talk/user/:memberNum",(req,res) => {
  let accessToken = req.cookies.accessToken; //엑세스토큰
  let Decode = jwt.verify(accessToken, secretObj.secret); //엑세스토큰 복호화
  let loginId = Decode.member_id; // 로그인한 ID

  let productId = req.query.product_no; //판매글 ID
  let isDirect = req.query.isDirect; //상품페이지에서 바로 채팅

  let sellerId;
  let roomId;
  console.log(req.query);

  if(isDirect == 'true'){ // 상품페이지에서 바로 채팅
    conn.query("SELECT member_id FROM product WHERE id = ?;" , productId, (err,data) =>{ //판매자 ID SELECT 쿼리
      if(err) throw err;
      sellerId = data[0].member_id; // 판매자 ID

      conn.query("SELECT id FROM chat_room WHERE host = ? and guest = ? and product_id = ?",[sellerId,loginId,productId], (err,data) =>{
        if(data[0] != null){ // 데이터가 있다면
          console.log("채팅방 이동");
          roomId = data[0].id; // 채팅방 ID
          conn.query("SELECT * FROM chat_message WHERE room_id = ?", roomId, (err,data) => { //채팅 데이터 조회
            if(err) throw err;
            res.send({
              msgData:data,
              success:true
            })
          })
        }
        else{ //데이터가 없다면
          console.log("방 생성");
          conn.query("INSERT INTO chat_room (host, guest, title, product_id) value(?, ?, ?, ?);",[sellerId, loginId, "방입니다", productId], (err) => {
            if(err) throw err;
            conn.query("SELECT id FROM chat_room WHERE id = LAST_INSERT_ID();", (err,data) => {
              if(err) throw err;
              roomId = data[0].id
            })
          })
        } 
      })
    })
  }
  else{ //채팅페이지에서 채팅
    console.log("채팅페이지에서 채팅")
    roomId = req.query.room_no; 
    conn.query("SELECT * FROM chat_message WHERE room_id = ?", roomId, (err,data) => {
      if(err) throw err;
      res.send({
        msgData:data,
        success:true
      })
    })
  }

  /* 소켓 */
  app.io.once('connection',(socket) => {
    console.log("socket connect!");
    socket.join(roomId);
    /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
    socket.to(roomId).emit('update', {type: 'connect', name: "SERVER", message: loginId + "님이 접속하였습니다."})

    /* 전송한 메세지 받기 */
    socket.on('message', (data) => {
      /* 받은 데이터에 누가 보냈는지 이름 추가 */
      data.name = loginId;

      console.log(data);

      /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
      socket.broadcast.to(roomId).emit('update', data)

      conn.query("INSERT INTO chat_message (send_id, send_time, text, room_id, unidentified_id) values(?, ?, ?, ?, ?)",[loginId, "gd", data.message ,roomId, sellerId],(err) => { //메세지 내용 DB 저장
        if(err) throw err;
      })
    });
    /* 접속 종료 */
    socket.on('disconnect',() => {
      console.log("socket disconnect!");
      console.log(loginId + "님이 나가셨습니다");
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
