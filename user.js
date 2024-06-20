const express = require("express");
const app = express();
const port = 3000;
const { v4: uuidv4 } = require("uuid"); // user pk를 위한 uuid 모듈에서 v4 함수 가져오기

// **회원가입 / 로그인 api 만들기 ** //


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
  res.status(200).send({ message: "OK", pk: pk, id: id });
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
