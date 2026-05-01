# X-uitter API

[🇺🇸 English Version](./README.md)

## 🌐 Descrição

O **X-uitter API** é uma API REST inspirada no Twitter/X, desenvolvida como projeto MVP para permitir que usuários se cadastrem, façam login, publiquem xweets, respondam publicações, curtam conteúdos, sigam outros usuários e visualizem um feed personalizado.

A aplicação foi construída com foco em uma arquitetura monolítica simples, organizada em camadas de **routes**, **controllers**, **services**, **middlewares** e integração com banco de dados relacional usando **PostgreSQL** e **Prisma ORM**.

O objetivo principal do projeto é demonstrar a construção de uma API backend funcional, com autenticação, persistência de dados, regras de negócio e deploy em ambiente público.

![API Backend]
<p align="center">
  <img src="./docs/assets/x-uitter-banner.png" alt="X-uitter banner" width="800" />
</p>

## 🌐 Pré-requisitos para rodar o projeto

- Backend: **Node.js + TypeScript + Express.js**
- Banco de dados: **PostgreSQL**
- ORM: **Prisma ORM**
- Autenticação: **JWT + bcrypt**
- Gerenciador de pacotes: **npm**
- Ambiente recomendado: **Ubuntu 22.04 ou superior**

### Clonando o repositório

```bash
> git clone https://github.com/jfan-dev/X-witter-4-growdev.git
> cd X-witter-4-growdev
```

### Configurando as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
> touch .env
```

Exemplo de configuração:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="1d"
PORT=3002
```

> Nunca envie o arquivo `.env` para o GitHub. Mantenha apenas um `.env.example` versionado.

### Instalando as dependências

```bash
> npm install
```

### Configurando o Prisma

```bash
# Gerar o Prisma Client
> npx prisma generate

# Executar as migrations no banco de dados
> npx prisma migrate dev
```

### Executando o Backend

```bash
# Iniciar o servidor em ambiente de desenvolvimento
> npm run dev
```

A API ficará disponível em:

```bash
http://localhost:3002
```

Para verificar se o servidor está funcionando:

```bash
GET http://localhost:3002/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

### Executando com Docker

> Use esta opção caso queira subir a API e o banco PostgreSQL em containers, sem depender de uma instalação local do PostgreSQL.

#### Pré-requisitos para Docker

- Docker instalado
- Docker Compose instalado
- Arquivo `.env` configurado na raiz do projeto

Exemplo de `.env` para uso com Docker Compose:

```env
DATABASE_URL="postgresql://postgres:postgres@db:5432/xuitter?schema=public"
JWT_SECRET="sua_chave_secreta"
JWT_EXPIRES_IN="1d"
PORT=3002
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="xuitter"
```

> No Docker Compose, o host do banco normalmente deve ser o nome do serviço do PostgreSQL, por exemplo `db`, e não `localhost`.

#### Subindo a aplicação

```bash
# Construir as imagens e iniciar os containers
> docker compose up --build
```

A API ficará disponível em:

```bash
http://localhost:3002
```

Para rodar em segundo plano:

```bash
> docker compose up --build -d
```

#### Executando migrations dentro do container

Depois que o banco estiver rodando, execute as migrations do Prisma:

```bash
> docker compose exec api npx prisma migrate dev
```

Caso o serviço da API tenha outro nome no `docker-compose.yml`, substitua `api` pelo nome correto do serviço.

Também é possível gerar novamente o Prisma Client dentro do container:

```bash
> docker compose exec api npx prisma generate
```

#### Verificando se a API está funcionando

```bash
> curl http://localhost:3002/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

#### Comandos úteis com Docker

```bash
# Ver logs dos containers
> docker compose logs -f

# Ver logs apenas da API
> docker compose logs -f api

# Parar os containers
> docker compose down

# Parar os containers e remover volumes do banco
> docker compose down -v

# Acessar o shell do container da API
> docker compose exec api sh
```

> Use `docker compose down -v` com cuidado, pois esse comando remove o volume do PostgreSQL e apaga os dados locais do banco usado pelos containers.


### Executando os testes

```bash
> npm run test
```

Caso o projeto esteja usando Jest com TypeScript em ESM, o comando pode precisar rodar com:

```bash
> NODE_OPTIONS="--experimental-vm-modules" npx jest --runInBand
```

#### ✍🏻️ Features adicionais

| 🔐 Autenticação JWT | 🐦 Xweets e replies | 📰 Feed personalizado |
| --- | --- | --- |
| Login seguro com senha criptografada usando bcrypt e geração de token JWT. | Usuários autenticados podem criar publicações e responder a outras publicações. | O feed retorna xweets próprios e xweets dos usuários seguidos. |

| ❤️ Likes | 🤝 Sistema de follows | 🛡️ Validações e erros |
| --- | --- | --- |
| Usuários podem curtir e remover curtidas de xweets, inclusive os próprios. | Usuários podem seguir e deixar de seguir outros usuários, exceto a si mesmos. | Middlewares de autenticação, validação de entrada e tratamento centralizado de erros. |

#### ✍🏻️ Recursos e Tecnologias Utilizadas

| Tecnologia | Uso | Site |
|---|---|---|
| Node.js | Ambiente de execução JavaScript no backend | [Link](https://nodejs.org/) |
| TypeScript | Tipagem estática para maior segurança e clareza no código | [Link](https://www.typescriptlang.org/) |
| Express.js | Framework para criação da API REST | [Link](https://expressjs.com/) |
| PostgreSQL | Banco de dados relacional usado na persistência | [Link](https://www.postgresql.org/) |
| Prisma ORM | ORM para modelagem, migrations e acesso ao banco de dados | [Link](https://www.prisma.io/) |
| JWT | Autenticação baseada em token | [Link](https://jwt.io/) |
| bcrypt | Criptografia/hash de senhas | [Link](https://www.npmjs.com/package/bcrypt) |
| Jest | Testes automatizados | [Link](https://jestjs.io/) |
| Supertest | Testes de integração de endpoints HTTP | [Link](https://www.npmjs.com/package/supertest) |
| Vercel | Deploy da API | [Link](https://vercel.com/) |
| GitHub | Versionamento e hospedagem do repositório público | [Link](https://github.com/) |

## 📌 Principais Entidades

| Entidade | Responsabilidade |
|---|---|
| User | Representa o usuário da aplicação, com dados de login, perfil e relações sociais. |
| Xweet | Representa uma publicação criada por um usuário. Também pode ser uma reply. |
| Like | Representa a curtida de um usuário em um xweet. |
| Follow | Representa a relação entre um usuário seguidor e um usuário seguido. |
| Session | Representa sessões válidas de autenticação, caso o projeto esteja usando controle de sessões no banco. |

## 📘 Documentação da API com Swagger

Após iniciar o servidor, acesse a documentação interativa da API pelo Swagger.

Ambiente local:

```bash
http://localhost:3002/docs
```

Ambiente de produção/deploy:

```bash
https://https://x-witter-4-growdev-9jsfwcxis-jfan-test.vercel.app/docs
```

> Substitua `https://SEU-LINK-DE-DEPLOY` pela URL real da API publicada, por exemplo a URL gerada pela Vercel ou Render.

Com o Swagger, você pode:

- Visualizar todas as rotas disponíveis da API
- Conferir exemplos de corpo das requisições
- Testar endpoints diretamente pelo navegador
- Informar o token JWT para acessar rotas protegidas

### Autenticando no Swagger

1. Acesse a documentação local ou a documentação publicada no deploy
2. Crie um usuário em `POST /auth/signup`, caso ainda não tenha um usuário cadastrado
3. Faça login em `POST /auth/signin`
4. Copie o token JWT retornado pela API
5. Clique no botão **Authorize** no Swagger
6. Informe o token no seguinte formato:

```bash
Bearer SEU_TOKEN_AQUI
```

Depois disso, as rotas protegidas, como `/xweets`, `/feed`, `/users/:id/follow` e `/xweets/:id/like`, poderão ser testadas diretamente pelo Swagger no ambiente local ou no deploy.

> Caso o endpoint de documentação esteja diferente no projeto, atualize `/docs` conforme a configuração usada no Express.

## 🔗 Rotas da API

> Todas as rotas exigem autenticação via Bearer Token, exceto cadastro e login.

### Autenticação

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/auth/signup` | Cadastra um novo usuário | Não |
| POST | `/auth/signin` | Realiza login e retorna um token JWT | Não |

### Usuários

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| GET | `/users/:id` | Retorna perfil, xweets, seguidores e seguindo | Sim |
| POST | `/users/:id/follow` | Segue um usuário | Sim |
| DELETE | `/users/:id/follow` | Deixa de seguir um usuário | Sim |

### Xweets

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| POST | `/xweets` | Cria um novo xweet | Sim |
| POST | `/xweets/:id/reply` | Cria uma reply para um xweet | Sim |
| POST | `/xweets/:id/like` | Curte um xweet | Sim |
| DELETE | `/xweets/:id/like` | Remove a curtida de um xweet | Sim |

### Feed

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| GET | `/feed` | Retorna xweets próprios e de usuários seguidos | Sim |

## 🧪 Exemplos de Requisições

### Criar usuário

```bash
curl -X POST http://localhost:3002/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jaime Fernandes",
    "email": "jaime@example.com",
    "password": "Senha@123",
    "birthdate": "1995-01-01"
  }'
```

### Fazer login

```bash
curl -X POST http://localhost:3002/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jaime@example.com",
    "password": "Senha@123"
  }'
```

### Criar xweet

```bash
curl -X POST http://localhost:3002/xweets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "content": "Meu primeiro xweet 🚀"
  }'
```

### Buscar feed

```bash
curl -X GET http://localhost:3002/feed \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

## 🛠 Desafios e Soluções Enfrentados

### Configuração do Jest com TypeScript e ESM

- Durante a configuração dos testes, foi necessário ajustar o Jest para funcionar corretamente com TypeScript em modo ESM.
- A solução utilizada foi executar os testes com `NODE_OPTIONS="--experimental-vm-modules"` e configurar o `jest.config.ts` para mapear imports `.js` para arquivos TypeScript durante os testes.

### Execução dos testes em sequência

- Alguns testes falhavam quando executados em paralelo por compartilharem estado de banco de dados.
- A solução foi usar `--runInBand`, garantindo que os arquivos de teste sejam executados um por vez.

### Compatibilidade do Prisma Client

- Durante o desenvolvimento, houve problemas de sincronização entre Prisma Client e o banco remoto.
- A solução aplicada foi manter uma versão compatível do Prisma Client com o ambiente usado no projeto.

### Tipagem do JWT com TypeScript

- A tipagem do `jsonwebtoken` exigiu cuidado com o campo `expiresIn`, especialmente com `exactOptionalPropertyTypes` ativo no TypeScript.
- A solução foi garantir que as opções passadas para o `jwt.sign` fossem compatíveis com os tipos esperados pela biblioteca.

### Controle de autenticação em rotas privadas

- A API exige que todas as rotas privadas validem o token JWT antes de acessar os controllers.
- A solução foi criar um middleware de autenticação reutilizável e aplicá-lo nas rotas de usuários, xweets, likes, follows e feed.

## 🚀 Deploy

A API deve ser publicada em uma plataforma como Render ou Vercel.

### Checklist de deploy

- [ ] Criar banco PostgreSQL em produção
- [ ] Configurar `DATABASE_URL`
- [ ] Configurar `JWT_SECRET`
- [ ] Configurar `JWT_EXPIRES_IN`
- [ ] Executar migrations em produção
- [ ] Configurar comando de build
- [ ] Configurar comando de start
- [ ] Validar rota `/health`
- [ ] Adicionar link do deploy no README

### Links do projeto

| Recurso | Link |
|---|---|
| Repositório | [GitHub](https://github.com/jfan-dev/X-witter-4-growdev) |
| Deployment | [Vercel](https://x-witter-4-growdev-9jsfwcxis-jfan-test.vercel.app) |

## ✅ Status do MVP

| Funcionalidade | Status |
|---|---|
| Cadastro de usuário | ✅ Implementado |
| Login com JWT | ✅ Implementado |
| Middleware de autenticação | ✅ Implementado |
| Criar xweet | ✅ Implementado |
| Criar reply | ✅ Implementado |
| Curtir xweet | ✅ Implementado |
| Remover curtida | ✅ Implementado |
| Seguir usuário | ✅ Implementado |
| Deixar de seguir usuário | ✅ Implementado |
| Feed personalizado | ✅ Implementado |
| Deploy | ✅ Implementado |

## 🐼 Desenvolvido por

**Jaime Fernandes**  
📧 jfernan10@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/jfan-dev)  
🐙 [GitHub](https://github.com/jfan-dev)
