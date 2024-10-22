const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database('./heatmap_data.db', sqlite3.OPEN_READWRITE);

function addUser(user) {
    const timeNow = new Date().toISOString();
    console.log("Inserting user:", user); // Log the user data

    sql = `INSERT INTO users(location, rating, signal_strength, time_of_reporting) VALUES (?,?,?,?)`;
    db.run(sql, [user.location, user.rating, user.signal_strength, timeNow], (err) => {
        if (err) {
            console.log("Error inserting user:", err.message);
            return;
        }
        console.log("User successfully inserted with!" + timeNow);
    });
    return { success: true };
}


async function getAllUsers() {
    sql = `SELECT location, rating, signal_strength, time_of_reporting FROM users`;
    return new Promise((resolve, reject) => {
        db.all(sql, [], (err, rows) => {
            if (err) reject(err.message);
            resolve(rows);
        });
    });
}

module.exports = {
    addUser,
    getAllUsers
};
