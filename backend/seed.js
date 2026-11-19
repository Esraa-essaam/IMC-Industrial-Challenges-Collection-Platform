const seedAdmin = require("./seeds/adminSeeder");

seedAdmin().then(() => {
  process.exit(0);
});
