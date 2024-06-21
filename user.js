
// **회원가입 / 로그인 api 만들기 ** //




// ** 요구사항  **//
/*
## 회원가입 / 로그인 api 만들기

# 회원가입 요구사항
- id / password로 로그인한다.
- id는 중복될 수 없다.
- password 제한조건은 없다.
- pk는 단순 숫자말고 uuid를 사용해본다. 
- signup (post) - id, password
  성공 -> ok:회원가입 성공 status=200
  실패 -> error:이미 존재하는 아이디 입니다. status=400
- request -> id password
- response -> message 성공 + pk,id return

## uuid란?

UUID는 'Universally Unique Identifier'의 약자로 128-bit의 고유 식별자
다른 고유 ID 생성 방법과 다르게 UUID는 중앙 시스템에 등록하고 발급하는 과정이 없어서 상대적으로 더 빠르고 간단하게 만들 수 있다는 장점

## uuid 사용방법

npm install uuid
const { v4: uuidv4 } = require("uuid"); // uuid 모듈에서 v4 함수 가져오기
// UUID 생성
const userId = uuidv4();

# 로그인

- 존재하는 아이디인지 확인
- 아이디가 존재한다면 비밀번호가 일치하는지 확인
- log-in (post) - id, password
  성공 -> ok:로그인 성공 status=200
  실패 -> error:이미 존재하는 아이디 입니다. status=400
  
- request -> id password
- response -> message 성공 + id return


## 추가 요구사항
- 구현한 회원가입 / 로그인을 mysql과 연결
- jwt 토큰 
  - jwt 토큰이란 ? 
    jwt(json web token)은 클라이언트와 서버간의 정보를 안전하게 전달하기 위한 간편한 방법 중 하나
    디지털 서명이 되어있어 전송 중 정보가 조작되지 않았음을 검증 가능!!
*/



const express = require("express");
const app = express();
const port = 3000;
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

require('dotenv').config();

//mysql 연결
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) return console.error(err.message);

  console.log('Connected to the MySQL server.');
  });



// JSON 형식의 요청 본문을 파싱하기 위해 필요
app.use(express.json());

// //회원을 담기 위한 배열 생성
// const users = [];

//회원을 가져오기 위한 GET 라우터
app.get("/api/v1/get-users", (req,res)=>{
  const query = 'SELECT * FROM Users'
  connection.query(query,  (error, result, fields)=>{
    if (error) throw error;
    console.log('User info is : ', result);
    res.status(200).send({ message: "OK", result });
  });
  
});

//회원가입을 위한 POST 라우터
app.post("/api/v1/sign-up", (req, res) => {
  const { id, password } = req.body;

  //id, password가 전달됐는지 확인
  if (id && password){

    connection.query('SELECT * FROM Users WHERE id = ?',[id],(error, result, fields)=>{
      if (error) throw error;
      if (result.length <=0) {//DB에 같은 아이디가 없으면 회원가입 성공
        connection.query('INSERT INTO Users (id,password) VALUES(?,?)', [id,password], (error,data)=>{
          if(error) throw error2;
          res.status(201).send({ message: "OK",  id: id });
        })
      }
      else{ //DB에 같은 아이디가 존재할때
        res.status(400).send({ message: "이미 존재하는 아이디입니다." });
      }
    }
  )

  }
  else{ //아이디나 패스워드가 없을때
    res.status(400).send({ message: "id, password 는 필수입니다." });
  }

});

app.post("/api/v1/log-in", (req, res) => {
  const { id, password } = req.body;
  if (id && password){
    connection.query('SELECT * FROM Users WHERE id = ? and password = ?',[id,password],(error, result, fields)=>{
      if (error) throw error;
      if (result.length >0) {//db에서 반환값이 있다면 로그인 성공
        const user = result[0]
        //jwt토큰 생성
        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET_KEY, {expiresIn : process.env.JWT_EXPIRE});
        res.status(200).send({ message: "Welcome", id: user.id, token:token });
      }
      else{ //DB에 같은 아이디가 존재할때
        res.status(400).send({ message: "로그인 정보가 일치하지 않습니다." });
      }
    }
  )
  }
  else{ //아이디나 패스워드가 없을때
    res.status(400).send({ message: "id, password 는 필수입니다." });
  }


});
//서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


// connection.end();