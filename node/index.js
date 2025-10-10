const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};

const connection = mysql.createConnection(config)

connection.query("SHOW COLUMNS FROM `people` LIKE 'name'", (err) => {
    if (err === null) return

    if(err.code === 'ER_NO_SUCH_TABLE') {
        connection.query(`CREATE TABLE people(id int not null auto_increment, name varchar(255), primary key(id))`, (errMessage) => console.log("errMessage", errMessage))
        return
    }

    console.log(err)
})

const sql = `INSERT INTO people(name) values('Wesley')`

connection.query(sql)

app.get('/', (req,res) => {
    connection.query(`SELECT * FROM people`, (err, results) => {
        if(err) {
            console.log("err", err)
            return res.status(500).send('<h1>Houve um erro inesperado!</h1>')
        }
        
        res.send(`
            <h1>Full Cycle Rocks!</h1>
            <ul>
              ${results.map((item) => `<li>id [${item.id}] - name [${item.name}]</li>`)}
            </ul>
        `)
    })
})

app.listen(port, () => console.log('Rodando na porta ' + port))