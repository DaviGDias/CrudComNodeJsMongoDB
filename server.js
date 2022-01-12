const port = 3090; // constante para atribuir o valor da porta para conexão
const express = require('express') // Importa o modulo do express
const app = express() // cria a variavel app para utilizar o express
const bodyparser = require('body-parser')
const objectID = require('mongodb').ObjectID // Importa um modulo do mongodb
const MongoClient = require('mongodb').MongoClient // Importa um modulo cliente do MongoDB
const conexaoMongodb = "UTILEZE SUA STRING DE CONEXÃO" //String de conexão do mongodb
const { ObjectId } = require('mongodb');

app.use(express.json({ extended: true }))

// Funcão de conexão com o banco de dados
MongoClient.connect(conexaoMongodb, (err, client) => {
    if (err) // condição para verificar se houve algum erro
        return console.log(err) // retorna o erro impresso no console
    db = client.db('crud')
    // Conexão LocalHost
    app.listen(port, () => {
        console.log('Server Conectado')
    })
})
//O body-parser é um módulo capaz de converter o body da requisição para vários formatos.
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.set('view engine', 'ejs')

// Rota de leitura dos dados
app.get('/', function (req, res) {
    res.render('home')
});
// esta função recupera os arquivos do banco de dados
app.get('/show', (req, res) => {
    db.collection('clientes').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show', { data: results })
        // console.log(results)
    })
})
// função de post, ela recupera os campos do formulario e envia para o banco de dados, savando na coleção cliente
app.post('/show', (req, res) => {
    db.collection('clientes').save(req.body, (err, results) => {
        if (err) return console.log(err)
        console.log('Salvo no Banco de dados Mongo')
        res.redirect('/show')
    })
})
// Rota que busca o id 
app.route('/edit/:id').get((req, res) => {
    let id = req.params.id // parametros enviados do formulario
    db.collection('clientes').find(ObjectId(id)).toArray( //busca o objeto e transforma em um Arrey
        (err, result) => {
            if (err) return console.log(err)
            res.render('edit', { data: result }) // Renderiza a pagina para editar os itens que estão no DB
        })
}).post((req, res) => { // pega as informações
    let id = req.params.id
    let nome = req.body.nome
    let sobrenome = req.body.sobrenome
    let endereco = req.body.endereco
    let dataNascimento = req.body.dataNascimento
    let telefone = req.body.telefone
    let cidade = req.body.cidade
    let estado = req.body.estado
    let cep = req.body.cep
    db.collection('clientes').updateOne(
        {
            _id: ObjectId(id) // Id que vai ser alterado
        },
        { //campos que receberão a atualização
            $set: { 
                nome: nome,
                sobrenome: sobrenome,
                dataNascimento: dataNascimento,
                telefone: telefone,
                endereco: endereco,
                cidade: cidade,
                estado: estado,
                cep: cep
            }
        }, (err, result) => {
            if (err) return console.log(err)
            console.log('Banco Atualizado com Sucesso')
            res.redirect('/show')

        }
    )
})

app.route('/delete/:id').get((req, res) => {
    let id = req.params.id // pega o id

    db.collection('clientes').deleteOne({ _id: ObjectId(id) }, (err, result) => { // exclui do banco de dados 
        if (err) return res.send(500, err)
        console.log('Deletado do Banco de Dados!')
        res.redirect('/show')
    })
})
