const sqlite3 = require('sqlite3').verbose();
let sql;

const db = new sqlite3.Database('./heatmap_data.db', sqlite3.OPEN_READWRITE);

const locationCoordinates = {
    "Doe Library": { latitude: 37.8722, longitude: -122.2592 },
    "East Asian Library": { latitude: 37.873570000000001, longitude: -122.26034 },
    "ASUC Student Union: Martin Luther King Jr. Building": { latitude: 37.869137, longitude: -122.259614 }
};

function addUser(user) {
    const timeNow = new Date().toISOString();
    console.log("Inserting user:", user);

    sql = `INSERT INTO users(location, rating, signal_strength, time_of_reporting) VALUES (?,?,?,?)`;
    db.run(sql, [user.location, user.rating, user.signal_strength, timeNow], (err) => {
        if (err) {
            console.log("Error inserting user:", err.message);
            return;
        }
        console.log("User successfully inserted with time " + timeNow);
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

async function getAggregatedScores() {
    return new Promise((resolve, reject) => {
        sql = `SELECT location, AVG(signal_strength) as aggregate_score FROM users GROUP BY location`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err.message);
                return;
            }
            const resultsWithCoordinates = rows.map(row => {
                const coords = locationCoordinates[row.location];
                if (coords) {
                    return {
                        ...row,
                        latitude: coords.latitude,
                        longitude: coords.longitude
                    };
                } else {
                    console.warn(`Coordinates not found for location: ${row.location}`);
                    return null; 
                }
            }).filter(result => result !== null);  

            resolve(resultsWithCoordinates);
        });
    });
}


module.exports = {
    addUser,
    getAllUsers,
    getAggregatedScores
};