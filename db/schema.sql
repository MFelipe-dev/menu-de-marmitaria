CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  descricao VARCHAR(200)
);
CREATE UNIQUE INDEX ux_categorias_nome ON categorias (LOWER(nome));

CREATE TABLE pratos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao VARCHAR(300),
  preco NUMERIC(10,2) NOT NULL CHECK (preco > 0),
  disponivel BOOLEAN NOT NULL DEFAULT TRUE,
  categoria_id INTEGER NOT NULL REFERENCES categorias(id) ON DELETE RESTRICT
);