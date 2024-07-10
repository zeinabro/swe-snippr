const route = require("express").Router();
const bcrypt = require("bcrypt");

const users = [];

route.post("/signup", async (req, res) => {
  const [authType, authString] = req.headers.authorization.split(" ");
  const [username, password] = Buffer.from(authString, "base64")
    .toString("utf-8")
    .split(":");
  const hashedPassword = await bcrypt.hash(password, 8);
  users.push({ username, password: hashedPassword });

  console.log(users);

  res.send("Account created!");
});

route.post("/login", async (req, res) => {
  const [authType, authString] = req.headers.authorization.split(" ");
  const [username, password] = Buffer.from(authString, "base64")
    .toString("utf-8")
    .split(":");
  const user = users.find((user) => user.username === username);
  if (user) {
    const authResult = await bcrypt.compare(password, user.password);
    if (authResult) {
      res.send("Logged in");
    } else {
      res.send("Go Away");
    }
  } else {
    res.send("Go away!");
  }
});

module.exports = route;