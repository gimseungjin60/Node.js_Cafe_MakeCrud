const db = require("./db");

async function main() {
  try {
    await db.execute("DROP TABLE IF EXISTS menus");
    await db.execute(`
      CREATE TABLE menus (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INT UNSIGNED NOT NULL,
        category VARCHAR(20) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const menus = [
      ["아메리카노", 4500, "커피"],
      ["카페라떼", 5000, "커피"],
      ["바닐라라떼", 5500, "커피"],
      ["얼그레이 티", 4800, "티"],
      ["치즈케이크", 6500, "디저트"],
      ["크루아상", 4000, "디저트"],
    ];

    for (let i = 0; i < menus.length; i++) {
      await db.execute("INSERT INTO menus (name, price, category) VALUES (?, ?, ?)", menus[i]);
    }

    console.log("DB 초기화 완료");
  } catch (err) {
    console.log(err);
  }

  await db.end();
}

main();
