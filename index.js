const express = require("express");

const app = express();
app.use(express.json());

app.use('/api/auth', require('./routes/auth'))
app.use('/api/user',require('./routes/user'))

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
