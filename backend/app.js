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

/*        채팅관련             */
app.get("/chat",(req,res) => {
  let accessToken = req.cookies.accessToken;
  let Decode = jwt.verify(accessToken, secretObj.secret);
  let name = Decode.member_id;
  console.log(name);

   /* 소켓 */
  app.io.once('connection',(socket) => {
    console.log("socket connect!");
    /* 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌 */
    socket.emit('update', {type: 'connect', name: "SERVER", message: name + "님이 접속하였습니다."})

    /* 전송한 메세지 받기 */
    socket.on('message', (data) => {
      /* 받은 데이터에 누가 보냈는지 이름 추가 */
      data.name = name;

      console.log(data);

      /* 보낸 사람을 제외한 나머지 유저에게 메시지 전송 */
      socket.broadcast.emit('update', data)
    });
    /* 접속 종료 */
    socket.on('disconnect',() => {
      console.log("socket disconnect!");
      console.log(name + "님이 나가셨습니다");
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
