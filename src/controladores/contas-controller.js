const dados = require('../bancoDeDados/bancodedados')
const funcao = require('./funcoes')
let contas = dados.contas
const depositos = dados.depositos
const saques = dados.saques
const transferencias = dados.transferencias
let numero_conta = 0

module.exports = {
    criarContaBancaria(req, res) {
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body.usuario
        const { usuario } = req.body

        if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
            return res.status(400).json({ mensagem: "Por favor, preencha todos os campos." })
        }

        const verificaCpf = contas.find(conta => { return conta.usuario.cpf === cpf })
        const verificaEmail = contas.find(conta => { return conta.usuario.email === email })

        if (verificaCpf || verificaEmail) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
        }

        contas.push({
            numero_conta,
            saldo: 0.0,
            usuario
        })

        numero_conta = contas[contas.length - 1].numero_conta = contas[contas.length - 1].numero_conta + 1

        return res.status(201).json()
    },

    listarContaBancaria(req, res) {
        if (contas.length === 0) return res.status(404).json({ mensagem: "Nenhuma conta cadastrada." })
        return res.status(200).json(contas)
    },

    atualizarUsuarioConta(req, res) {
        const { numero_conta } = req.params
        const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

        if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
            return res.status(400).json({ mensagem: "Por favor, preencha todos os campos." })
        }

        if (!numero_conta) {
            return res.status(400).json({ mensagem: "Número da Conta inválido, por favor corrija." })
        }

        const conta = contas.find(conta => { return conta.numero_conta == numero_conta })

        if (!conta) {
            return res.status(404).json({ mensagem: "Número da Conta não encontrado." })
        }

        const verificaCpf = contas.find(conta => { return conta.usuario.cpf === cpf })
        const verificaEmail = contas.find(conta => { return conta.usuario.email === email })

        if (verificaCpf || verificaEmail) {
            return res.status(400).json({ mensagem: "Já existe uma conta com o cpf ou e-mail informado!" })
        }

        conta.usuario.nome = nome
        conta.usuario.cpf = cpf
        conta.usuario.data_nascimento = data_nascimento
        conta.usuario.telefone = telefone
        conta.usuario.email = email
        conta.usuario.senha = senha

        return res.status(201).json()
    },

    excluirConta(req, res) {
        const { numero_conta } = req.params

        if (!numero_conta) {
            return res.status(400).json({ mensagem: "Número da Conta inválido, por favor corrija." })
        }

        const conta = contas.find(conta => { return conta.numero_conta == numero_conta })

        if (!conta) {
            return res.status(404).json({ mensagem: "Número da Conta não encontrado." })
        }

        if (conta.saldo != 0) {
            return res.status(403).json({ mensagem: "A conta só pode ser removida se o saldo for zero!" })
        }

        contas = contas.filter(conta => { return conta.numero_conta != numero_conta })

        return res.status(204).json()
    },

    emitirSaldo(req, res) {
        const { numero_conta, senha } = req.query

        if (!numero_conta || !senha) {
            return res.status(400).json({ mensagem: "Todos os dados são obrigatórios!" })
        }
        const conta = contas.find(conta => { return conta.numero_conta == numero_conta })

        if (!conta) {
            return res.status(404).json({ mensagem: "Número da Conta não encontrado." })
        }

        if (conta.usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" })
        }

        return res.status(200).json({ Saldo: `${conta.saldo}` })
    },

    emitirExtrato(req, res) {
        const { numero_conta, senha } = req.query

        if (!numero_conta || !senha) {
            return res.status(400).json({ mensagem: "Todos os dados são obrigatórios!" })
        }

        const conta = contas.find(conta => { return conta.numero_conta == numero_conta })

        if (!conta) {
            return res.status(404).json({ mensagem: "Número da Conta não encontrado." })
        }

        if (conta.usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" })
        }

        const listaDepositos = depositos.filter(deposito => deposito.numero_conta == numero_conta)
        const listaSaques = saques.filter(saque => saque.numero_conta == numero_conta)
        const listaTransferenciasEnviadas = transferencias.filter(transfer => transfer.numero_conta_origem == numero_conta)
        const listaTransferenciasRecebidas = transferencias.filter(transfer => transfer.numero_conta_destino == numero_conta)

        const extrato = {
            listaDepositos,
            listaSaques,
            listaTransferenciasEnviadas,
            listaTransferenciasRecebidas
        }

        if (!extrato) return res.status(400).json({ mensagem: "Nenhuma transação foi realizada nesta conta." })

        return res.status(200).json(extrato)
    },

    depositar(req, res) {
        let { numero_conta, valor } = req.body
        valor = Number(valor)

        if (isNaN(valor)) {
            return res.status(400).json({ mensagem: "Valor inválido" })
        }

        if (!numero_conta || !valor) {
            return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" })
        }

        const conta = contas.find((conta) => { return conta.numero_conta === Number(numero_conta) })

        if (!conta) {
            return res.status(404).json({ mensagem: "Número da Conta não encontrado." })
        }

        if (valor <= 0) {
            return res.status(400).json({ mensagem: "Valor depositado não pode ser menor ou igual a zero" })
        }

        conta.saldo += valor

        depositos.push({
            data: funcao.formartarData(new Date()),
            numero_conta: conta.numero_conta,
            valor
        })
        return res.status(204).json()
    },

    sacar(req, res) {
        let { numero_conta, valor, senha } = req.body
        valor = Number(valor)

        if (isNaN(valor)) {
            return res.status(400).json({ mensagem: "Valor inválido" })
        }
        if (!numero_conta || !valor || !senha) {
            return res.status(400).json({ mensagem: "O número da conta, valor e senha são obrigatórios!" })
        }

        const conta = contas.find((conta) => { return conta.numero_conta === Number(numero_conta) })

        if (!conta) {
            return res.status(404).json({ mensagem: "Número da Conta não encontrado." })
        }

        if (conta.usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" })
        }

        if (conta.saldo < valor) {
            return res.status(400).json({ mensagem: "Saldo insuficiente!" })
        }

        conta.saldo -= valor

        saques.push({
            data: funcao.formartarData(new Date()),
            numero_conta,
            valor
        })

        return res.status(204).json()
    },

    transferir(req, res) {
        let { numero_conta_origem, numero_conta_destino, valor, senha } = req.body
        valor = Number(valor)
        numero_conta_destino = Number(numero_conta_destino)
        numero_conta_origem = Number(numero_conta_origem)

        if (isNaN(valor)) {
            return res.status(400).json({ mensagem: "Valor inválido" })
        }

        if (!numero_conta_origem || !numero_conta_destino || !valor || !senha) {
            return res.status(400).json({ mensagem: "Todos os dados são obrigatórios!" })
        }

        const conta_origem = contas.find(conta => { return conta.numero_conta == numero_conta_origem })
        const conta_destino = contas.find(conta => { return conta.numero_conta == numero_conta_destino })

        if (!conta_origem) return res.status(404).json({ mensagem: "Número da Conta Origem não encontrado." })
        if (!conta_destino) return res.status(404).json({ mensagem: "Número da Conta Destino não encontrado." })

        if (conta_origem.usuario.senha !== senha) {
            return res.status(401).json({ mensagem: "Senha incorreta!" })
        }

        if (numero_conta_origem === numero_conta_destino) {
            return res.status(400).json({ mensagem: "Não é possível fazer transferência entre contas iguais." })
        }

        if (conta_origem.saldo < valor) {
            return res.status(400).json({ mensagem: "Saldo insuficiente!" })
        }

        conta_origem.saldo -= valor
        conta_destino.saldo += valor

        transferencias.push({
            data: funcao.formartarData(new Date()),
            numero_conta_origem,
            numero_conta_destino,
            valor
        })

        return res.status(204).json()
    },
}