-- MyTask — Esquema do banco de dados (Iteração 2)
-- Implementa as classes do Modelo de Domínio: Usuário (1) possui (0..*) Tarefa.

CREATE TABLE IF NOT EXISTS usuarios (
  id         SERIAL PRIMARY KEY,
  nome       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  senha_hash VARCHAR(100) NOT NULL,
  criado_em  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tarefas (
  id              SERIAL PRIMARY KEY,
  usuario_id      INTEGER      NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo          VARCHAR(150) NOT NULL,
  descricao       TEXT,
  prazo           DATE,
  prioridade      VARCHAR(10)  NOT NULL DEFAULT 'media'
                  CHECK (prioridade IN ('baixa', 'media', 'alta')),
  status          VARCHAR(10)  NOT NULL DEFAULT 'pendente'
                  CHECK (status IN ('pendente', 'concluida')),
  data_conclusao  TIMESTAMPTZ,
  criado_em       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  atualizado_em   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tarefas_usuario ON tarefas (usuario_id);
