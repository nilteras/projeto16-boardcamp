import db from './../database/database.connection.js'

//GET listar clientes
export async function findCustomers(req,res) {

    try {
        const customers = await db.query("SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers;")
        res.send(customers.rows)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

//GET buscar cliente por ID

export async function getCustomersById(req, res) {

    const { id } = req.params

    try {
        const customerId = await db.query("SELECT id, name, phone, cpf, to_char(birthday, 'YYYY-MM-DD') as birthday FROM customers WHERE id= $1;", [id])

        if(customerId.rows.length === 0) return res.sendStatus(404)

        res.send(customerId.rows[0])

    } catch (err) {
        res.status(500).send(err.message)
    }    
}

//POST inserir cliente

export async function insertCustomers(req,res){

    const { name, phone, cpf, birthday } = req.body

    try {
        
        const cpfExist = await db.query("SELECT * FROM customers WHERE cpf= $1;", [cpf])
        if(cpfExist.rows.length > 0) return res.status(409).send("CPF existente em nosso cadastro")

        await db.query("INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);", [name, phone, cpf, birthday])

        res.status(201).send("Cliente adicionado com sucesso")

    } catch (err) {
        res.status(500).send(err.message)
    }
}

//PUT atualizar um cliente

export async function updateCustomers(req,res){
    
    const { name, phone, cpf, birthday } = req.body
    const { id } = req.params

    try {
        
        const cpfExist = await db.query("SELECT * FROM customers WHERE cpf= $1 AND id<> $2;", [cpf,id])
        if(cpfExist.rows.length > 0) return res.status(409).send("CPF existente não corresponde ao id")

        await db.query("UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=$5", [name, phone, cpf, birthday, id])


        res.status(200).send("Cliente atualizado com sucesso")

    } catch (err) {
        res.status(500).send(err.message)
    }


}