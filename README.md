# MyTask — Front-end (React)

Front-end da aplicação **MyTask**, sistema de gerenciamento de tarefas pessoais, desenvolvido em **React + Vite**.

## Versão desta entrega (Iteração 1 — simplificada)

Para permitir a demonstração completa da aplicação sem depender de um back-end externo,
esta versão **guarda os dados no `localStorage` do navegador** em vez de se conectar a uma
API real. Ou seja: **não é necessário instalar banco de dados nem rodar um servidor separado** —
basta o React.

Isso significa que:
- Cadastro, login, criação/edição/conclusão/exclusão de tarefas e logout funcionam de ponta a ponta;
- Os dados ficam salvos apenas naquele navegador/computador (se limpar o cache do navegador, os dados somem);
- Senhas são guardadas em texto simples no navegador — aceitável apenas para fins acadêmicos/demonstração, nunca em produção.

O Diagrama de Implantação do projeto descreve a arquitetura-alvo (React + API REST em Node.js/Express + PostgreSQL),
planejada para as próximas iterações. Os arquivos `src/api/authService.js` e `src/api/taskService.js` já
contêm, comentado, o código equivalente usando chamadas HTTP reais — basta descomentar e apontar
para o back-end quando ele estiver pronto (veja a seção "Evoluindo para um back-end real" abaixo).

## Pré-requisitos

- Node.js 18 ou superior (inclui o npm)

## Instalação

```bash
npm install
```

## Executando em desenvolvimento

```bash
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

## Estrutura do projeto

```
src/
  api/
    localDb.js       → "banco de dados" simulado no localStorage
    authService.js    → cadastro, login e logout (usa localDb.js nesta versão)
    taskService.js     → CRUD de tarefas (usa localDb.js nesta versão)
    client.js          → cliente HTTP (axios) pronto para uso com um back-end real
  context/            → estado global de autenticação (AuthContext)
  components/         → componentes reutilizáveis (Navbar, TaskForm, TaskItem, ConfirmDialog, PrivateRoute)
  pages/              → páginas da aplicação (Login, Register, Dashboard)
```

## Mapeamento dos casos de uso

| Caso de uso                     | Onde está implementado                              |
|----------------------------------|--------------------------------------------------------|
| Cadastrar-se                     | `pages/Register.jsx` + `api/authService.js`             |
| Fazer login                      | `pages/Login.jsx` + `api/authService.js`                |
| Criar tarefa                     | `components/TaskForm.jsx` + `pages/Dashboard.jsx`       |
| Visualizar tarefas                | `pages/Dashboard.jsx` (abas: pendentes/concluídas/atrasadas/todas) |
| Editar tarefa                    | `components/TaskForm.jsx` (modo edição) + `pages/Dashboard.jsx` |
| Marcar tarefa como concluída      | `components/TaskItem.jsx` (checkbox) + `pages/Dashboard.jsx` |
| Excluir tarefa                   | `components/ConfirmDialog.jsx` + `pages/Dashboard.jsx`  |
| Sair do sistema (logout)          | `components/Navbar.jsx` + `context/AuthContext.jsx`     |

## Evoluindo para um back-end real

Quando o back-end (API REST em Node.js/Express + PostgreSQL) estiver pronto:

1. Abra `src/api/authService.js` e `src/api/taskService.js`.
2. Substitua as funções que usam `localDb.js` pelo bloco comentado no final de cada
   arquivo, que já usa `client.js` (axios) para chamar a API real.
3. Copie `.env.example` para `.env` e configure `VITE_API_URL` com o endereço do back-end.

Contrato de API esperado por `client.js`:

| Método | Rota                     | Descrição                          |
|--------|---------------------------|-------------------------------------|
| POST   | `/auth/register`          | Cria um novo usuário                |
| POST   | `/auth/login`              | Autentica e retorna `{ token, user }` |
| POST   | `/auth/logout`             | (Opcional) invalida a sessão no servidor |
| GET    | `/tasks`                   | Lista as tarefas do usuário logado  |
| POST   | `/tasks`                   | Cria uma nova tarefa                |
| PUT    | `/tasks/:id`               | Atualiza uma tarefa existente       |
| PATCH  | `/tasks/:id/complete`      | Marca a tarefa como concluída       |
| DELETE | `/tasks/:id`               | Remove uma tarefa                   |

## Próximos passos sugeridos

- Implementar o back-end (API REST) conforme o contrato acima
- Migrar a persistência do localStorage para o banco de dados real
- Adicionar testes automatizados (ex.: Vitest + React Testing Library)
- Implementar "Recuperar senha" (fora do escopo da Iteração 1)

## Iteração 2

Branch iteracao2 criado para o desenvolvimento da Iteração 2.
