# MyTask — Sistema de Gerenciamento de Tarefas Pessoais

Projeto do **Grupo 7** — Prática Profissional em Análise e Desenvolvimento de Sistemas (Universidade Presbiteriana Mackenzie).

O MyTask é uma aplicação web para cadastrar, visualizar, editar, concluir e excluir tarefas pessoais. Cada usuário cria sua conta, faz login e gerencia apenas as próprias tarefas.

## Versão atual: Iteração 2 (tag `v2`)

Na Iteração 1 (tag `v1`), o front-end guardava os dados no `localStorage` do navegador. Na **Iteração 2**, a aplicação passou a seguir a arquitetura completa prevista no Diagrama de Implantação:

| Camada | Tecnologia | Pasta |
|---|---|---|
| Front-end (Interface Web) | React 18 + Vite | raiz do repositório (`src/`) |
| Servidor da aplicação (API REST) | Node.js + Express | `server/` |
| Banco de dados | PostgreSQL | esquema em `server/db/schema.sql` |

Principais mudanças da Iteração 2:

- API REST em Node.js/Express com os oito casos de uso (cadastro, login, CRUD de tarefas, conclusão e logout).
- Persistência em PostgreSQL (tabelas `usuarios` e `tarefas`), substituindo o `localStorage`.
- Senhas armazenadas com hash (bcrypt) e autenticação por token JWT; o logout invalida o token no servidor.
- Validações no servidor: e-mail único e válido, senha com no mínimo 8 caracteres (letras e números), título obrigatório, prazo não retroativo e acesso apenas às próprias tarefas.
- Ordenação da lista de tarefas por data de criação, prazo ou prioridade.
- Testes automatizados da API baseados no Plano de Testes (TST-001 a TST-008).

---

## 1. Pré-requisitos

Instale no seu computador:

| Ferramenta | Versão | Download |
|---|---|---|
| Git | qualquer versão recente | https://git-scm.com/downloads |
| Node.js (já inclui o npm) | **18 ou superior** (recomendado: 20 LTS ou 22 LTS) | https://nodejs.org |
| PostgreSQL | **14 ou superior** | https://www.postgresql.org/download/ |

> **Alternativa ao PostgreSQL:** se você já usa Docker, pode pular a instalação do PostgreSQL e usar o `docker-compose.yml` do projeto (veja a opção B do passo 3).

Para conferir as versões instaladas, abra um terminal (no Windows, use o **Git Bash** ou o **PowerShell**) e rode:

```bash
git --version
node -v
npm -v
psql --version      # só se instalou o PostgreSQL localmente
```

---

## 2. Baixar o código-fonte

```bash
git clone https://github.com/walissonrubens/MyTask-ToDo-List.git
cd MyTask-ToDo-List
git checkout v2
```

O comando `git checkout v2` posiciona o código exatamente na versão entregue na Iteração 2. Para acompanhar o desenvolvimento mais recente, use `git checkout master`.

---

## 3. Preparar o banco de dados

Escolha **uma** das opções abaixo.

### Opção A — PostgreSQL instalado no computador

1. Durante a instalação do PostgreSQL, anote a senha definida para o usuário `postgres`.
2. Crie o banco `mytask`:

   ```bash
   psql -U postgres -c "CREATE DATABASE mytask;"
   ```

   No Windows, se o comando `psql` não for reconhecido, use o **SQL Shell (psql)** que vem com o PostgreSQL (menu Iniciar), entre com o usuário `postgres` e execute `CREATE DATABASE mytask;`. Também é possível criar o banco pelo **pgAdmin** (botão direito em *Databases* → *Create* → *Database…*).

As tabelas são criadas no passo 4, com o comando `npm run db:init`.

### Opção B — PostgreSQL via Docker

Na raiz do repositório:

```bash
docker compose up -d
```

Isso sobe um PostgreSQL 16 na porta `5432`, com usuário `postgres`, senha `postgres`, banco `mytask` e as tabelas já criadas. Para parar: `docker compose down` (os dados ficam guardados no volume `mytask-data`).

---

## 4. Configurar e iniciar a API (back-end)

Em um terminal, a partir da raiz do repositório:

```bash
cd server
cp .env.example .env          # no Windows (PowerShell): copy .env.example .env
```

Abra o arquivo `server/.env` e confira as variáveis:

| Variável | O que é | Valor padrão |
|---|---|---|
| `PORT` | Porta da API | `3000` |
| `DATABASE_URL` | Conexão com o banco, no formato `postgresql://usuario:senha@host:porta/banco` | `postgresql://postgres:postgres@localhost:5432/mytask` |
| `JWT_SECRET` | Chave usada para assinar os tokens de login | troque por um texto longo e aleatório |
| `JWT_EXPIRES_IN` | Validade do login | `8h` |
| `CORS_ORIGIN` | Endereço do front-end autorizado a chamar a API | `http://localhost:5173` |

> Se a senha do seu usuário `postgres` não for `postgres`, altere-a em `DATABASE_URL`. Exemplo com a senha `minhaSenha`: `postgresql://postgres:minhaSenha@localhost:5432/mytask`.

Instale as dependências, crie as tabelas e inicie a API:

```bash
npm install
npm run db:init     # cria as tabelas usuarios e tarefas (pode ser executado mais de uma vez)
npm start
```

A mensagem `API do MyTask rodando em http://localhost:3000/api` indica que deu certo. Para confirmar que a API está conectada ao banco, abra no navegador:

```
http://localhost:3000/api/health
```

A resposta esperada é `{"status":"ok","database":"ok"}`.

> Durante o desenvolvimento, use `npm run dev` no lugar de `npm start`: a API reinicia sozinha a cada alteração no código.

**Deixe este terminal aberto** enquanto usa a aplicação.

---

## 5. Configurar e iniciar o front-end

Abra **um segundo terminal**, na raiz do repositório:

```bash
cp .env.example .env          # no Windows (PowerShell): copy .env.example .env
npm install
npm run dev
```

O arquivo `.env` da raiz contém `VITE_API_URL=http://localhost:3000/api`, o endereço da API iniciada no passo 4. Só é preciso alterá-lo se você mudou a porta da API.

Acesse a aplicação em **http://localhost:5173**.

---

## 6. Usando a aplicação

1. Clique em **Cadastrar-se** e crie uma conta (senha com no mínimo 8 caracteres, contendo letras e números).
2. Faça login com o e-mail e a senha cadastrados.
3. No painel, use **+ Nova Tarefa** para criar tarefas, o ícone ✏️ para editar, a caixa de seleção para concluir e o ícone 🗑️ para excluir.
4. Use as abas (Pendentes, Concluídas, Atrasadas, Todas) e o seletor **Ordenar por** para organizar a lista.
5. Clique em **Sair** para encerrar a sessão.

Os dados ficam salvos no PostgreSQL: continuam disponíveis depois de recarregar a página, fechar o navegador ou entrar por outro navegador.

---

## 7. Testes automatizados da API

Com o banco configurado (passos 3 e 4), na pasta `server`:

```bash
npm test
```

Os testes cobrem os cenários do Plano de Testes (TST-001 a TST-008): cadastro válido e duplicado, login com credenciais válidas e inválidas, criação de tarefa com e sem título e com prazo retroativo, listagem, edição (inclusive tentativa de editar tarefa de outro usuário), conclusão, exclusão e logout. Os usuários criados durante os testes são removidos ao final.

---

## 8. Build de produção do front-end

```bash
npm run build      # gera a pasta dist/
npm run preview    # serve o build em http://localhost:4173
```

Para usar o `preview`, inclua `http://localhost:4173` em `CORS_ORIGIN` no `server/.env` — ou rode a API com `CORS_ORIGIN=http://localhost:4173`.

---

## 9. Estrutura do projeto

```
MyTask-ToDo-List/
├── src/                          → front-end React
│   ├── api/
│   │   ├── client.js             → cliente HTTP (axios) que envia o token JWT
│   │   ├── authService.js        → cadastro, login e logout
│   │   └── taskService.js        → CRUD de tarefas
│   ├── context/AuthContext.jsx   → estado global de autenticação
│   ├── components/               → Navbar, TaskForm, TaskItem, ConfirmDialog, PrivateRoute
│   └── pages/                    → Login, Register, Dashboard
├── server/                       → back-end (API REST)
│   ├── db/schema.sql             → criação das tabelas usuarios e tarefas
│   ├── scripts/initDb.js         → comando npm run db:init
│   ├── src/
│   │   ├── app.js                → configuração do Express e das rotas
│   │   ├── server.js             → inicialização da API
│   │   ├── config/db.js          → conexão com o PostgreSQL
│   │   ├── controllers/          → AutenticacaoController e TarefaController
│   │   ├── repositories/         → UsuarioRepository e TarefaRepository
│   │   ├── routes/               → rotas /api/auth e /api/tasks
│   │   ├── middlewares/          → autenticação JWT e tratamento de erros
│   │   └── utils/                → validações e utilitários
│   └── tests/api.test.js         → testes automatizados da API
├── docker-compose.yml            → PostgreSQL opcional via Docker
├── .env.example                  → modelo de configuração do front-end
└── server/.env.example           → modelo de configuração da API
```

A organização do back-end segue o Diagrama de Classes de Projeto: as telas React são as classes de fronteira, os *controllers* são as classes de controle e os *repositories* fazem a persistência das entidades Usuário e Tarefa.

---

## 10. Endpoints da API

Todas as rotas começam com `http://localhost:3000/api`. As rotas de tarefas exigem o cabeçalho `Authorization: Bearer <token>`, obtido no login.

| Método | Rota | Caso de uso | Respostas principais |
|---|---|---|---|
| POST | `/auth/register` | Cadastrar-se | 201 criado · 400 dados inválidos · 409 e-mail já cadastrado |
| POST | `/auth/login` | Fazer Login | 200 `{ token, user }` · 401 credenciais inválidas |
| POST | `/auth/logout` | Sair do Sistema | 204 sessão encerrada |
| GET | `/tasks` | Visualizar Tarefas | 200 lista de tarefas do usuário |
| POST | `/tasks` | Criar Tarefa | 201 criada · 400 título vazio ou prazo inválido |
| PUT | `/tasks/:id` | Editar Tarefa | 200 atualizada · 400 inválida · 403 de outro usuário · 404 inexistente |
| PATCH | `/tasks/:id/complete` | Marcar Tarefa como Concluída | 200 (concluir registra a data de conclusão; repetir a ação reabre a tarefa) |
| DELETE | `/tasks/:id` | Excluir Tarefa | 204 removida · 403 de outro usuário · 404 inexistente |
| GET | `/health` | — | 200 API e banco funcionando |

Erros sempre retornam um JSON no formato `{ "message": "descrição do erro" }`.

---

## 11. Solução de problemas

| Sintoma | Causa provável e solução |
|---|---|
| `npm run db:init` mostra `password authentication failed` | A senha em `DATABASE_URL` (`server/.env`) não é a do usuário `postgres`. Corrija e rode de novo. |
| `database "mytask" does not exist` | O banco não foi criado. Volte ao passo 3. |
| `connect ECONNREFUSED 127.0.0.1:5432` | O PostgreSQL não está rodando. Inicie o serviço (ou `docker compose up -d`). |
| Tela de login mostra erro ao entrar ou o painel diz que não foi possível carregar as tarefas | A API não está rodando ou `VITE_API_URL` aponta para o endereço errado. Confira o terminal da API e acesse `http://localhost:3000/api/health`. |
| Erro de CORS no console do navegador | O endereço do front-end não é o mesmo de `CORS_ORIGIN` no `server/.env`. |
| `Port 3000 is already in use` / `Port 5173 is in use` | Outro programa usa a porta. Mude `PORT` no `server/.env` (e `VITE_API_URL` no `.env` da raiz) ou feche o outro programa. |
| Alterou um arquivo `.env` e nada mudou | Pare (Ctrl+C) e inicie novamente a API ou o front-end; as variáveis são lidas só na inicialização. |

---

## Histórico de versões

| Tag | Descrição |
|---|---|
| `v1` | Iteração 1 — front-end React com persistência temporária no `localStorage`. |
| `v2` | Iteração 2 — API REST (Node.js/Express) + PostgreSQL, autenticação JWT, validações no servidor, ordenação de tarefas e testes automatizados. |

## Integrantes do Grupo 7

| Nome | RA |
|---|---|
| Alexandre Carraleiro Martins | 10720279 |
| Camila Sayuri Yoshioka | 10442938 |
| Gustavo Soares da Cunha | 10415230 |
| Leonardo Silva Silveira | 10433530 |
| Walisson Rubens Lopes de Oliveira | 10433526 |
