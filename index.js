const express = require("express");
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true,
//   })
// );
// app.use(
//   cors({
//     origin: 'http://localhost:5173',
//     credentials: true,
//   })
// );
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')))

const router = require('./routes/routes');
app.use('/', router);

app.listen(3001, () => {
  console.log("Server started on port 3001. Ctrl^c to quit.");
});
