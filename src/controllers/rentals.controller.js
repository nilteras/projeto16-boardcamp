import dayjs from 'dayjs'
import db from './../database/database.connection.js'

//GET listar alugueis
export async function findRentals(req, res) {

    try {

        const result = await db.query(`
        SELECT 
        rentals.*,
        customers.id AS customer_id,
        customers.name AS customer_name,
        games.id AS game_id,
        games.name AS game_name
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
        ;`)

        const rentals = result.rows.map((r) => {
            return {
                id: r.id,
                customerId: r.customerId,
                gameId: r.gameId,
                renDate: r.renDate,
                daysRented: r.daysRented,
                returnDate: r.returnDate,
                originalPrice: r.originalPrice,
                delayFee: r.delayFee,
                customer: {
                    id: r.customer_id,
                    name: r.customer_name
                },
                game: {
                    id: r.game_id,
                    name: r.game_name
                }
            }
        })

        console.log(rentals)

        res.send(rentals)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//POST inserir aluguel
export async function insertRentals(req, res) {

    const { customerId, gameId, daysRented } = req.body
    let rentDate = dayjs().format()
    try {
        const customerIdExist = await db.query("SELECT * FROM customers WHERE id=$1;", [customerId])
        if(customerIdExist.rows.length === 0) return res.status(400).send("Não existe nenhum cliente com esse ID")

        const gameIdExist = await db.query("SELECT * FROM games WHERE id=$1;", [gameId])
        if(gameIdExist.rows.length === 0) return res.status(400).send("Não existe nenhum game com esse ID")

        const gameAvailable = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId])
        if(gameIdExist.rows[0].stockTotal <= gameAvailable.rows.length) res.status(400).send("Não a quantidade disponivel para aluguel")

        let originalPrice = daysRented * gameIdExist.rows[0].pricePerDay

        await db.query(`INSERT INTO rentals (
            "customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
            VALUES ($1, $2, $3, $4, $5, $6, $7);`, [customerId, gameId, rentDate, daysRented, null, originalPrice, null])

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