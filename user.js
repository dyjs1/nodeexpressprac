const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require("uuid"); // user pk를 위한 uuid 모듈에서 v4 함수 가져오기

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
*/




// JSON 형식의 요청 본문을 파싱하기 위해 필요
app.use(express.json());

//회원을 담기 위한 배열 생성
const users = [];

//회원가입을 위한 POST 라우터
app.post("/api/v1/sign-up", (req, res) => {
  const { id, password } = req.body;

  //id , password가 전달됐는지 확인
  if (!id || !password) {
    res.status(400).send({ message: "id, password 는 필수입니다." });
  }
  //이미 존재하는 아이디인지 확인
  const user = users.find((user) => user.id == id);
  if (user) {
    res.status(400).send({ message: "이미 존재하는 아이디입니다." });
  }

  // UUID 생성
  const pk = uuidv4();

  // 회원 객체 생성
  const newUser = {
    pk: pk,
    id: id,
    password: password,
  };
  //users 배열에 새로운 유저 전달
  users.push(newUser);
  res.status(201).send({ message: "OK", pk: pk, id: id });
});

app.post("/api/v1/log-in", (req, res) => {
  const { id, password } = req.body;
  const user = users.find((user) => user.id == id);
  //존재하는 아이디인지 확인
  if (!user) {
    res.status(400).send({ message: "존재하지 않는 아이디입니다." });
  }
  //패스워드가 일치하는지 확인
  if (user.password != password) {
    res.status(400).send({ message: "비밀번호가 일치하지 않습니다." });
  }

  res.status(200).send({ message: "OK", id: id });
});
//서버 실행
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
