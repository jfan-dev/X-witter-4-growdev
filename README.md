# X-uitter API

API REST de uma rede social estilo Twitter/X, desenvolvida com **Node.js**, **TypeScript**, **Express.js**, **PostgreSQL** e **Prisma ORM**.

## Visão Geral

O X-uitter é uma API back-end em que usuários autenticados podem:

- se cadastrar e fazer login
- criar xweets
- responder xweets
- seguir e deixar de seguir outros usuários
- curtir e descurtir xweets
- visualizar um feed personalizado

Este projeto foi construído como um MVP, com foco em uma estrutura de back-end limpa, princípios REST, persistência relacional e autenticação por token.

---

## Funcionalidades

- Cadastro de usuários
- Autenticação de usuários com JWT
- Hash de senha com bcrypt
- Consulta de perfil de usuário
- Criação de xweets
- Resposta a xweets
- Seguir e deixar de seguir usuários
- Curtir e remover curtidas de xweets
- Feed personalizado
- Endpoint de health check

---

## Regras de Negócio

- Um usuário pode criar xweets
- Um xweet pertence exatamente a um usuário
- Um xweet pode ter zero ou muitas respostas
- Um usuário pode seguir outros usuários
- Um usuário não pode seguir a si mesmo
- Um usuário pode curtir qualquer xweet, inclusive os próprios
- Um usuário pode remover a curtida de um xweet
- O feed de um usuário inclui:
  - os próprios xweets
  - os xweets dos usuários que ele segue

---

## Tecnologias

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **Prisma ORM**
- **JWT**
- **bcrypt**

---

## Estrutura do Projeto

```bash
src/
  app.ts
  server.ts
  config/
  controllers/
  dtos/
  errors/
  middlewares/
  prisma/
  routes/
  services/
```

### Arquitetura

Este projeto segue uma estrutura em camadas:

- **routes**: definem os endpoints
- **controllers**: recebem as requisições HTTP e retornam as respostas HTTP
- **services**: concentram a lógica de negócio e as regras do sistema
- **middlewares**: autenticação, validação e tratamento de erros
- **dtos**: modelam a saída de dados
- **prisma**: acesso ao banco de dados com Prisma Client

---

## URL Base da API

Local:

```bash
http://localhost:3002
```

Produção:

```bash
<sua-url-no-render>
```

---

## Autenticação

Todas as rotas exigem autenticação, exceto:

- `POST /auth/signup`
- `POST /auth/signin`

A autenticação é baseada em JWT.

Envie o token no cabeçalho da requisição:

```http
Authorization: Bearer <seu_token>
```

---

## Rotas

### Rotas Públicas

#### Cadastrar usuário
`POST /auth/signup`

#### Fazer login
`POST /auth/signin`

### Rotas Privadas

#### Buscar perfil de usuário
`GET /users/:id`

#### Seguir usuário
`POST /users/:id/follow`

#### Deixar de seguir usuário
`DELETE /users/:id/follow`

#### Criar xweet
`POST /xweets`

#### Responder xweet
`POST /xweets/:id/reply`

#### Curtir xweet
`POST /xweets/:id/like`

#### Remover curtida de xweet
`DELETE /xweets/:id/like`

#### Buscar feed personalizado
`GET /feed`

### Health Check

#### Status da API
`GET /health`

---

## Exemplos de Requisição

### 1. Cadastro de usuário

**Requisição**

```http
POST /auth/signup
Content-Type: application/json
```

**Body**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "birthdate": "2000-01-01"
}
```

**Exemplo de resposta**

```json
{
  "id": "generated-user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "birthdate": "2000-01-01T00:00:00.000Z",
  "profileImage": "https://ui-avatars.com/api/?name=John%20Doe",
  "createdAt": "2026-04-22T12:00:00.000Z",
  "updatedAt": "2026-04-22T12:00:00.000Z"
}
```

### 2. Login

**Requisição**

```http
POST /auth/signin
Content-Type: application/json
```

**Body**

```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Exemplo de resposta**

```json
{
  "token": "<jwt-token>"
}
```

### 3. Criar xweet

**Requisição**

```http
POST /xweets
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body**

```json
{
  "content": "Hello world from X-uitter 🚀"
}
```

**Exemplo de resposta**

```json
{
  "id": "generated-xweet-id",
  "content": "Hello world from X-uitter 🚀",
  "createdAt": "2026-04-22T12:10:00.000Z",
  "authorId": "generated-user-id",
  "parentId": null
}
```

### 4. Responder xweet

**Requisição**

```http
POST /xweets/:id/reply
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Body**

```json
{
  "content": "Esta é uma resposta"
}
```

**Exemplo de resposta**

```json
{
  "id": "generated-reply-id",
  "content": "Esta é uma resposta",
  "createdAt": "2026-04-22T12:20:00.000Z",
  "authorId": "generated-user-id",
  "parentId": "parent-xweet-id"
}
```

### 5. Buscar feed

**Requisição**

```http
GET /feed
Authorization: Bearer <jwt-token>
```

**Exemplo de resposta**

```json
[
  {
    "id": "xweet-id-1",
    "content": "Meu primeiro xweet",
    "createdAt": "2026-04-22T12:00:00.000Z",
    "authorId": "user-id-1",
    "parentId": null,
    "author": {
      "id": "user-id-1",
      "name": "John Doe",
      "profileImage": "https://example.com/avatar.png"
    }
  }
]
```

### 6. Seguir usuário

**Requisição**

```http
POST /users/:id/follow
Authorization: Bearer <jwt-token>
```

**Exemplo de resposta**

```json
{
  "message": "User followed successfully"
}
```

### 7. Deixar de seguir usuário

**Requisição**

```http
DELETE /users/:id/follow
Authorization: Bearer <jwt-token>
```

**Exemplo de resposta**

```json
{
  "message": "User unfollowed successfully"
}
```

### 8. Curtir xweet

**Requisição**

```http
POST /xweets/:id/like
Authorization: Bearer <jwt-token>
```

**Exemplo de resposta**

```json
{
  "message": "Xweet liked"
}
```

### 9. Remover curtida de xweet

**Requisição**

```http
DELETE /xweets/:id/like
Authorization: Bearer <jwt-token>
```

**Exemplo de resposta**

```json
{
  "message": "Like removed"
}
```

### 10. Buscar perfil de usuário

**Requisição**

```http
GET /users/:id
Authorization: Bearer <jwt-token>
```

**Exemplo de resposta**

```json
{
  "id": "user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "profileImage": "https://example.com/avatar.png",
  "createdAt": "2026-04-22T12:00:00.000Z",
  "xweets": [
    {
      "id": "xweet-id",
      "content": "Hello world",
      "createdAt": "2026-04-22T12:10:00.000Z"
    }
  ],
  "followers": [],
  "following": []
}
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.

Exemplo:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>?schema=public"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3002
```

---

## Instalação e Execução

### 1. Clone o repositório

```bash
git clone <url-do-seu-repositorio-publico>
cd <nome-da-pasta-do-projeto>
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie o arquivo `.env` com base no exemplo acima.

### 4. Rode as migrations do Prisma

```bash
npx prisma migrate dev
```

### 5. Gere o Prisma Client

```bash
npx prisma generate
```

### 6. Inicie o servidor em desenvolvimento

```bash
npm run dev
```

### 7. Acesse a API

```bash
http://localhost:3002
```

---

## Scripts Disponíveis

```bash
npm run dev
npm run build
npm start
npm test
```

> Ajuste esta seção se os scripts do seu `package.json` tiverem nomes diferentes.

---

## Health Check

Use o endpoint abaixo para verificar se a API está rodando corretamente:

```http
GET /health
```

**Exemplo de resposta**

```json
{
  "status": "ok"
}
```

---

## Tratamento de Erros

A API utiliza códigos HTTP padrão.

Exemplos comuns:

- `200 OK`
- `201 Created`
- `400 Bad Request`
- `401 Unauthorized`
- `404 Not Found`
- `409 Conflict`
- `500 Internal Server Error`

Exemplo de resposta de erro:

```json
{
  "error": "Invalid credentials"
}
```

---

## Banco de Dados

Este projeto utiliza **PostgreSQL** com **Prisma ORM**.

Entidades principais do domínio:

- **User**
- **Xweet**
- **Follow**
- **Like**

Relacionamentos principais:

- um usuário tem muitos xweets
- um xweet pertence a um usuário
- um xweet pode responder outro xweet
- um usuário pode seguir muitos usuários
- um usuário pode ser seguido por muitos usuários
- um usuário pode curtir muitos xweets

---

## Observações da Implementação Atual

- As senhas são armazenadas com hash usando **bcrypt**
- A autenticação é feita com **JWT**
- O `profileImage` é gerado automaticamente a partir do nome do usuário no fluxo atual de cadastro
- O feed é ordenado por `createdAt` em ordem decrescente
- A resposta de perfil do usuário inclui os xweets, seguidores e usuários seguidos

---

## Deploy

Esta API foi pensada para ser publicada no **Vercel**.

### Checklist de produção

- configurar as variáveis de ambiente de produção
- conectar o banco PostgreSQL de produção
- rodar as migrations do Prisma
- gerar o Prisma Client
- configurar corretamente os comandos de build e start
- testar todas as rotas protegidas após o deploy
- adicionar no README o link do repositório público e o link do deploy

URL de produção:

```bash
https://x-witter-4-growdev.vercel.app/
```

---

## Testes

Se os testes automatizados estiverem configurados, documente-os aqui.

Exemplo:

```bash
npm test
```

Escopo sugerido de testes:

- auth
- perfil de usuário
- criação de xweet
- replies
- likes
- follows
- feed

Se você estiver usando Jest + Supertest, também pode documentar:

- `.env.test`
- banco isolado para testes
- `--runInBand`
- `NODE_OPTIONS=--experimental-vm-modules`

---

## Melhorias Futuras

Possíveis próximos passos após o MVP:

- paginação do feed
- documentação com Swagger / OpenAPI
- suporte a Docker
- pipeline de CI
- estratégia de refresh token
- padronização mais forte de validações
- aumento da cobertura de testes automatizados

---

## Repositório

GitHub:

```bash
https://github.com/jfan-dev/X-witter-4-growdev
```

---

## Autor

**Jaime Fernandes**

- GitHub: [`https://github.com/jfan-dev`](https://github.com/jfan-dev)
- LinkedIn: [`www.linkedin.com/in/jfan-dev`](https://www.linkedin.com/in/jfan-dev)

---

## Licença

Este projeto foi desenvolvido para fins educacionais.
