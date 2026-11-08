const express = require("express");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

function isValidMenu(name, price, category) {
  if (typeof name !== "string" || typeof price !== "string") {
    return false;
  }
  if (name.trim() === "" || name.trim().length > 100) {
    return false;
  }
  if (price.trim() === "") {
    return false;
  }
  if (!Number.isInteger(Number(price)) || Number(price) < 0 || Number(price) > 2147483647) {
    return false;
  }
  if (category !== "커피" && category !== "티" && category !== "디저트") {
    return false;
  }
  return true;
}

function showError(res, err) {
  console.log(err);
  res.status(500).send("DB 오류가 발생했습니다.");
}

app.get("/", function (req, res) {
  res.redirect("/menus");
});

app.get("/menus", async function (req, res) {
  try {
    const result = await db.execute("SELECT * FROM menus ORDER BY category, price");
    res.render("menu", { menus: result[0] });
  } catch (err) {
    showError(res, err);
  }
});

app.post("/menus", async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;

  if (!isValidMenu(name, price, category)) {
    res.redirect("/menus");
    return;
  }

  try {
    await db.execute("INSERT INTO menus (name, price, category) VALUES (?, ?, ?)", [name.trim(), Number(price), category]);
    res.redirect("/menus");
  } catch (err) {
    showError(res, err);
  }
});

app.get("/menus/:id/edit", async function (req, res) {
  try {
    const result = await db.execute("SELECT * FROM menus WHERE id = ?", [req.params.id]);
    const menu = result[0][0];

    if (!menu) {
      res.redirect("/menus");
      return;
    }

    res.render("edit", { menu: menu });
  } catch (err) {
    showError(res, err);
  }
});

app.post("/menus/:id/edit", async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const category = req.body.category;

  if (!isValidMenu(name, price, category)) {
    res.redirect("/menus");
    return;
  }

  try {
    await db.execute("UPDATE menus SET name = ?, price = ?, category = ? WHERE id = ?", [name.trim(), Number(price), category, req.params.id]);
    res.redirect("/menus");
  } catch (err) {
    showError(res, err);
  }
});

app.post("/menus/:id/delete", async function (req, res) {
  try {
    await db.execute("DELETE FROM menus WHERE id = ?", [req.params.id]);
    res.redirect("/menus");
  } catch (err) {
    showError(res, err);
  }
});

app.listen(PORT, function () {
  console.log("서버 실행: http://localhost:" + PORT + "/menus");
});
