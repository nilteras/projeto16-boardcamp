import dayjs from 'dayjs'
import db from './../database/database.connection.js'
import { format } from 'date-fns'

//GET listar alugueis
export async function findRentals(req, res) {

    try {

        const result = await db.query(`
        SELECT 
        rentals.id,"customerId","gameId","daysRented",to_char("returnDate", 'YYYY-MM-DD') as "returnDate","originalPrice","delayFee",
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
    // let rentDate = dayjs().format('YYYY-MM-DD')
    // console.log(rentDate)
    try {
        const customerIdExist = await db.query("SELECT * FROM customers WHERE id=$1;", [customerId])
        if(customerIdExist.rows.length === 0) return res.status(400).send("Não existe nenhum cliente com esse ID")

        const gameIdExist = await db.query("SELECT * FROM games WHERE id=$1;", [gameId])
        if(gameIdExist.rows.length === 0) return res.status(400).send("Não existe nenhum game com esse ID")

        const gameAvailable = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId])
        if(gameIdExist.rows[0].stockTotal <= gameAvailable.rows.length) res.status(400).send("Não a quantidade disponivel para aluguel")

        let originalPrice = daysRented * gameIdExist.rows[0].pricePerDay
        const rentDate = format(new Date(), 'yyyy-MM-dd')
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

    const { id } = req.params

    const returnDate = dayjs().format("YYYY-MM-DD")
    const returnDateObj = new Date()

    try {
        const rentalId = await db.query("SELECT * FROM rentals WHERE id = $1", [id])
        
        if(rentalId.rows.length === 0) return res.sendStatus(404)

        if(rentalId.rows[0].returnDate !== null) return res.status(400).send("Aluguel já foi finalizado")

        let newRentDate = new Date(rentalId.rows[0].rentDate)

       // let difference = returnDateObj.getTime() - newRentDate.getTime()

       // const delayDays = Math.ceil(difference / (1000 * 60 * 60 * 24))

        const price = await db.query("SELECT * FROM games WHERE id=$1;", [rentalId.rows[0].gameId])

        const delayDays = difDias(returnDateObj, newRentDate) > 0 ? difDias(returnDateObj, newRentDate) * perDay : 0;

        const realPrice = (price.rows[0].pricePerDay)

        let delayFee = (delayDays - rentalId.rows[0].daysRented) * realPrice

        if(delayFee > 0) {
            await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id= $3;`, [returnDate, delayFee, id])
            return res.status(200).send("Alguguel finalizado com taxa de atraso")
        }else {
            await db.query(`UPDATE rentals SET "returnDate"=$1 WHERE id= $2`, [returnDate, id])
            return res.status(200).send("Aluguel finalizado sem taxa de atraso")
        }



    } catch (err) {
        res.status(500).send(err.message)
    }
}

function difDias(d1, d2){
    const data1 = new Date(d1)
    const data2 = new Date(d2)

    const dif = data2 - data1
    const dias = dif / (1000 * 60 * 60 * 24);
    return dias 
}

//DELETE apagar aluguel
export async function deleteReantals(req, res) {

    const { id } = req.params

    try {
        const rentalId = await db.query("SELECT * FROM rentals WHERE id = $1", [id])
        if(rentalId.rows.length === 0) return res.sendStatus(404)

        if(rentalId.rows[0].returnDate === null) res.status(400).send("Aluguel não foi finalizado anteriormente")

        await db.query(`DELETE FROM rentals WHERE id=$1`, [id])

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}