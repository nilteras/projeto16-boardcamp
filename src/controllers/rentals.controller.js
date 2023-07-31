import db from './../database/database.connection.js'

//GET listar alugueis
export async function findRentals(req, res) {

    try {

        const rentals = await db.query(`
        SELECT 
        rentals.*,
        customers.id AS customer_id,
        customers.name AS customer_name,
        games.id AS game_id,
        games.name AS game_name
        FROM rentals
        JOIN customers ON rentals."customersId = customers.id
        JOIN games ON rentals."gameId" = games.id
        ;`)
        
        res.send(rentals.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//POST inserir aluguel
export async function insertRentals(req, res) {

    try {

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//POST finalizar aluguel
export async function finishRentals(req, res) {
    try {

    } catch (err) {
        res.status(500).send(err.message)
    }
}

//DELETE apagar aluguel
export async function deleteReantals(req, res) {

    try {

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}