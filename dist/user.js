"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mysql_1 = __importDefault(require("mysql"));
const config_1 = require("./config");
const app = (0, express_1.default)();
const port = 3000;
//mysql 연결
const connection = mysql_1.default.createConnection({
    host: config_1.config.dbHost,
    user: config_1.config.dbUser,
    password: config_1.config.dbPassword,
    database: config_1.config.dbDatabase,
});
//sql 연결 확인
connection.connect((err) => {
    if (err)
        return console.error(err.message);
    console.log('Connected to the MySQL server.');
});
// JSON 형식의 요청 본문을 파싱하기 위해 필요
app.use(express_1.default.json());
//회원을 가져오기 위한 GET 라우터
app.get("/api/v1/get-users", (req, res) => {
    const query = 'SELECT * FROM Users';
    connection.query(query, (error, result, fields) => {
        if (error)
            throw error;
        console.log('User info is : ', result);
        res.status(200).send({ message: "OK", result });
    });
});
//회원가입을 위한 POST 라우터
app.post("/api/v1/sign-up", (req, res) => {
    const { id, password } = req.body;
    //id, password가 전달됐는지 확인
    if (id && password) {
        connection.query('SELECT * FROM Users WHERE id = ?', [id], (error, result, fields) => {
            if (error)
                throw error;
            if (result.length <= 0) { //DB에 같은 아이디가 없으면 회원가입 성공
                connection.query('INSERT INTO Users (id,password) VALUES(?,?)', [id, password], (error, data) => {
                    if (error) {
                        return res.status(500).send({ message: "Database qeury error" });
                    }
                    res.status(201).send({ message: "OK", id: id });
                });
            }
            else { //DB에 같은 아이디가 존재할때
                res.status(400).send({ message: "이미 존재하는 아이디입니다." });
            }
        });
    }
    else { //아이디나 패스워드가 없을때
        res.status(400).send({ message: "id, password 는 필수입니다." });
    }
});
app.post("/api/v1/log-in", (req, res) => {
    const { id, password } = req.body;
    if (id && password) {
        connection.query('SELECT * FROM Users WHERE id = ? and password = ?', [id, password], (error, result, fields) => {
            if (error)
                throw error;
            if (result.length > 0) { //db에서 반환값이 있다면 로그인 성공
                const user = result[0];
                //오류 해결을 위한 변수 정의
                const key = config_1.config.jwtSecret;
                if (!key) {
                    throw new Error('token is not set');
                }
                //jwt토큰 생성
                const token = jsonwebtoken_1.default.sign({ id: user.id }, key, { expiresIn: config_1.config.jwtExpire });
                res.status(200).send({ message: "Welcome", id: user.id, token: token });
            }
            else { //DB에 같은 아이디가 존재할때
                res.status(400).send({ message: "로그인 정보가 일치하지 않습니다." });
            }
        });
    }
    else { //아이디나 패스워드가 없을때
        res.status(400).send({ message: "id, password 는 필수입니다." });
    }
});
//서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// connection.end();
