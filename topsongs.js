const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Redkorn@1",
    database: "top_songsdb"
});

// A query which returns all data for songs sung by a specific artist
const getDataByArtist = () => {
    connection.query("SELECT * FROM top_songsdb.top5000 WHERE ?", {
            artist_name: "Usher"
        },
        (err, res) => {
            if (err) {
                throw err;
            }

            res.forEach(row => console.log(`Artist: ${row.artist_name}\nsong: ${row.song_name}\n`));
        })
        getDataByMultEntry();
}

// A query which returns all artists who appear within the top 5000 more than once
const getDataByMultEntry = () => {
    connection.query(`SELECT artist_name, COUNT(artist_name) as occurrence 
    FROM top5000
    GROUP BY ARTIST_NAME HAVING occurrence > 1
    ORDER BY occurrence ASC`,
        (err, res) => {
            if (err) {
                throw (err);
            }
            res.forEach(row => console.log(`Artist: ${row.artist_name} | ${row.occurrence}\n`));
        }
    )
    getArtistByRange();
};

// A query which returns all data contained within a specific range
const getArtistByRange = () => {
    connection.query(`SELECT artist_name, year, song_name FROM top5000 
    WHERE year 
    BETWEEN 1987 AND 1996
    ORDER BY artist_name ASC
    `,
        (err, res) => {
            if (err) {
                throw err
            }
            res.forEach(row => {
                console.log(`Artist: ${row.artist_name} | ${row.song_name} | ${row.year}`)

            });
        });
        getSongData();
};

// A query which searches for a specific song in the top 5000 and returns the data for it

const getSongData = () => {
    connection.query(`SELECT * FROM top5000 WHERE lower(song_name) = ?
    `, ["California Love"],
        (err, res) => {
            if (err) {
                throw err
            }
            res.forEach(row => {
                    console.log(`Position: ${row.position}\nArtist: ${row.artist_name}\nSong: ${row.song_name}\nYear: ${row.year}`)
                }

            )
        });
        connection.end();
}

connection.connect(function (error) {
    if (error) {
        throw (error);
    }
    getDataByArtist();
});



