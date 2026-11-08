const db = require("./db");

async function main() {
  try {
    const result = await db.execute("SELECT * FROM menus ORDER BY category, price");
    console.log("메뉴 개수: " + result[0].length);
    console.table(result[0]);
  } catch (err) {
    console.log(err);
  }

  await db.end();
}

main();
