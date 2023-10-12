const express = require('express')
const contas = require('./controladores/contas-controller')
const { autentica } = require('./middlewares/autenticacao-banco')
const rotas = express.Router()

rotas.use(autentica)

rotas.get('/contas', contas.listarContaBancaria)
rotas.post('/contas', contas.criarContaBancaria)
rotas.put('/contas/:numero_conta/usuario', contas.atualizarUsuarioConta)
rotas.delete('/contas/:numero_conta', contas.excluirConta)

rotas.post('/transacoes/depositar', contas.depositar)
rotas.post('/transacoes/sacar', contas.sacar)
rotas.post('/transacoes/transferir', contas.transferir)

rotas.get('/contas/saldo', contas.emitirSaldo)
rotas.get('/contas/extrato', contas.emitirExtrato)

module.exports = rotas