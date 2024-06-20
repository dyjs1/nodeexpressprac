// const express = require('express') // require 파일을 불러옴
// const app = express()
// const port = 3000


// app.use(express.json()); // JSON 형식의 요청 본문을 파싱하기 위해 필요


// let items = []; // 항목을 저장할 배열
// let idCounter = 1; // ID 카운터

// // GET 라우터
// app.get("/api/v1/items", (req, res) => {
//   res.json(items);
// });

// // POST 라우터
// app.post("/api/v1/items", (req, res) => {
//   const item = req.body;
//   item.id = idCounter++;
//   items.push(item);
//   // res.send(item)
//   res.status(201).json(item);
// });

// // PUT 라우터
// app.put("/api/v1/items/:id", (req, res) => {
//   //url에서 id 값을 가져옴
//   const id = parseInt(req.params.id);
//   const itemIndex = items.findIndex((item) => item.id === id);
//   //item index가 없다면 
//   if (itemIndex === -1) {
//     return res.status(404).send(`Item with id ${id} not found`);
//   }
//   //item index가 있다면 item index에 맞는 item을 찾아서 업데이트
//   const updatedItem = { ...items[itemIndex], ...req.body };
//   items[itemIndex] = updatedItem;
//   res.json(updatedItem);
// });

// // DELETE 라우터
// app.delete("/api/v1/items/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const itemIndex = items.findIndex((item) => item.id === id);
//   //에러 핸들링
//   if (itemIndex === -1) {
//     return res.status(404).send(`Item with id ${id} not found`);
//   }
//   //해당 item 삭제
//   items.splice(itemIndex, 1);
//   res.status(201).json(items);
// });
//  //서버 실행
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
