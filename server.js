const port = 3090; // constante para atribuir o valor da porta para conexão
const express = require('express') // Importa o modulo do express
const app = express() // cria a variavel app para utilizar o express
const bodyparser = require('body-parser')
const objectID = require('mongodb').ObjectID // Importa um modulo do mongodb
const MongoClient = require('mongodb').MongoClient // Importa um modulo do mongodb
const conexaoMongodb = "mongodb+srv://w0ng:TW1C9EyguFIlzHcB@cluster0.icspx.mongodb.net/crud?retryWrites=true&w=majority"
const fs = require('fs')

app.use(express.json({extended: true}))

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

const readFile = () => {
    const content = fs.readFileSync(`itens.json`, `utf-8`);
    return (JSON.parse(content));
}
const writeFile = (content) => {
    const updateFile = JSON.stringify(content);
    fs.writeFileSync('itens.json', updateFile, 'utf-8');
}
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
// função de post, ela recupera os campos do formulario e envia para o banco de dados dira para a coleção cliente
app.post('/show', (req, res) => {
    db.collection('clientes').save(req.body, (err, results) => {
        const currentContent = readFile()////////////////////////////////////////// Crio uma copia para um arquivo Json
        const { nome, sobrenome, dataNascimento, cep, telefone } = req.body;////// da Linha 51 a linha 54
        currentContent.push({ nome, sobrenome, dataNascimento, cep, telefone }); // Na hora de renderizar da um erro mas logo volta preciso corrigir
        writeFile(currentContent);
        console.log('Salvo no Banco de dados Json ')
        if (err) return console.log(err)
        console.log('Salvo no Banco de dados Mongo')
        res.redirect('/show')
    })
})




