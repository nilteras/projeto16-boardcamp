import db from './../database/database.connection.js'

export async function createGames(req, res) {

    const { name, image, stockTotal, pricePerDay } = req.body;

    try {

        const nameExist = await db.query("SELECT * FROM games WHERE name= $1;", [name])
        if(nameExist.rows.length > 0) return res.status(409).send("Já existe um jogo com esse nome") 
        
        await db.query(`INSERT INTO games (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`, [name,image,stockTotal, pricePerDay] )
        res.status(201).send("Jogo criado com sucesso")
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function findGames(req, res) {
    try {
        
        const games = await db.query("SELECT * FROM games;");
        res.send(games.rows);

    }catch(err) {
        res.status(500).send(err.message);
    }
}