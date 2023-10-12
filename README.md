# API Banco Digital

Este projeto é uma API de banco digital que oferece funcionalidades essenciais para gerenciar contas, transações e informações dos clientes. A API foi desenvolvida utilizando tecnologias modernas e boas práticas de programação, visando proporcionar uma experiência eficiente e segura aos usuários.
  </p>

[Acesse o projeto em produção](https://projetocss-jesscoder.netlify.app/)

## :man_mechanic: Linguagens e Ferramentas

![Skills](https://skillicons.dev/icons?i=nodejs,js,express,rest)

## :ladder: Fucionalidades do Projeto

- [x] Contas
  - [x] Listar
  - [x] Cadastrar
  - [x] Excluir
  - [x] Atualizar
- [x] Transações
  - [x] Depositar
  - [x] Sacar
  - [x] Transferir
  - [x] Emitir Saldo
  - [x] Emitir Extrato

## :triangular_flag_on_post: Contribua com o projeto

- Realize o Fork
- Faça as modificações necessárias
- Realize a Pull Request (PR)

## :computer: Rodando o Projeto

```shell
# 1. Clone o projeto

git clone git@github.com:MateusRangel1101/Projeto-Sistema-Bancario.git

# 2. Instale as dependências

npm install express
npm install -D nodemon
npm install data-fns --save

# 3. Execute o backend

npm run dev

```

## :sassy_man: Endpoints

- GET /contas - Lista todos as contas
- POST /contas - Cadastra nova conta
- PUT /contas/:numero_conta/usuario - Atualiza dados de um usuário de uma conta
- DELETE /contas/:numero_conta - Exclui uma conta
- POST /transacoes/depositar - Deposita um valor em uma conta
- POST /transacoes/sacar - Saca um valor de uma conta
- POST /transacoes/transferir - Transfere um valor de uma conta para outra
- GET /contas/saldo - Mostra o saldo de uma conta
- GET /contas/extrato - Mostra o extrato de uma conta
