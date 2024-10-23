const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./heatmap_data.db');

db.run(`ALTER TABLE users ADD COLUMN signal_strength INTEGER`, (err) => {
  if (err) {
    console.log("signal_strength column already exists or another error: ", err.message);
  } else {
    console.log("signal_strength column added");
  }
});

db.run(`ALTER TABLE users ADD COLUMN time_of_reporting TEXT`, (err) => {
  if (err) {
    console.log("time_of_reporting column already exists or another error: ", err.message);
  } else {
    console.log("time_of_reporting column added");
  }
});

db.close();
