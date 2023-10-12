const { banco } = require('../bancoDeDados/bancodedados')

function autentica(req, res, next) {

    const { senha_banco } = req.query
    if (!senha_banco) {
        return res.status(403).json({ mensagem: "O usuário não tem permissão de acessar o recurso solicitado, por favor digite a senha de acesso." })
    }

    if (senha_banco !== banco.senha) {
        return res.status(401).json({ mensagem: "SENHA INCORRETA!" })
    }

    next()
}

module.exports = {
    autentica,
}