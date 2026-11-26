# Cardápio Digital — Sabor da Casa

Trabalho da disciplina **N695 — Desenvolvimento de Plataformas Web** (UNIFOR), cenário 3: **Marmitaria com cardápio digital**.

Sistema web para a marmitaria manter o cardápio organizado por categorias. A interface consome uma API própria, e os dados ficam gravados em um banco PostgreSQL.

- **Entidades:** Categoria e Prato (uma categoria tem vários pratos; cada prato pertence a uma categoria)
- **Operações:** cadastrar, listar, editar e excluir categorias e pratos
- **Aplicação publicada:** _[inserir link]_

## Tecnologias

| Parte | Tecnologia |
|---|---|
| Interface | HTML, CSS e JavaScript (sem frameworks, usando a Fetch API) |
| Serviço web | Node.js + Express 5 |
| Banco de dados | PostgreSQL, acessado com a biblioteca `pg` |
| Configuração | `dotenv` (variáveis de ambiente) |

## Estrutura do projeto

```
menu-de-marmitaria/
├── db/
│   └── schema.sql            # criação das tabelas categorias e pratos
├── public/                   # interface (servida pelo próprio Express)
│   ├── index.html            # lista de categorias
│   ├── categoria-form.html   # cadastro/edição de categoria
│   ├── pratos.html           # lista de pratos de uma categoria
│   ├── prato-form.html       # cadastro/edição de prato
│   ├── css/estilo.css
│   └── js/                   # api.js, componentes.js, mensagens.js e scripts de cada tela
├── src/
│   ├── app.js                # servidor Express
│   ├── database.js           # conexão com o PostgreSQL
│   ├── routes/               # rotas da API
│   ├── services/             # regras de negócio e validações
│   ├── repositories/         # consultas SQL
│   ├── middlewares/          # tratamento de erros
│   └── errors/
├── .env.example
└── package.json
```

## Como rodar o projeto

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) **18 ou superior**
- Um banco **PostgreSQL**, que pode ser:
  - local (instalado na máquina ou via Docker), **ou**
  - na nuvem (por exemplo, [Neon](https://neon.tech/))

### 2. Clonar e instalar as dependências

```bash
git clone https://github.com/MFelipe-dev/menu-de-marmitaria.git
cd menu-de-marmitaria
npm install
```

### 3. Criar o banco e as tabelas

Crie um banco vazio e execute o arquivo `db/schema.sql` nele.

**PostgreSQL local:**

```bash
createdb marmitaria
psql -d marmitaria -f db/schema.sql
```

**Neon (ou outro banco na nuvem):** abra o *SQL Editor* do painel, cole o conteúdo de `db/schema.sql` e execute.

> Se preferir Docker para o banco local:
> ```bash
> docker run --name marmitaria-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=marmitaria -p 5432:5432 -d postgres:16
> docker exec -i marmitaria-db psql -U postgres -d marmitaria < db/schema.sql
> ```

### 4. Configurar o arquivo `.env`

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

E coloque em `DATABASE_URL` o endereço do seu banco:

```env
# Banco local
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/marmitaria

# Banco na nuvem (Neon) — mantenha o ?sslmode=require no final
DATABASE_URL=postgresql://usuario:senha@host/banco?sslmode=require
```

Opcionalmente, defina `PORT` para trocar a porta (o padrão é `3000`).

### 5. Iniciar o servidor

```bash
npm start
```

Para desenvolvimento, com reinício automático ao salvar os arquivos:

```bash
npm run dev
```

### 6. Acessar

Abra **http://localhost:3000** no navegador. A interface e a API rodam no mesmo servidor, e a API responde em `http://localhost:3000/api`.

## Rotas da API

Todas as requisições e respostas usam JSON.

**Categorias**

| Método | Rota | Função |
|---|---|---|
| GET | `/api/categorias` | Listar categorias |
| GET | `/api/categorias/:id` | Buscar uma categoria |
| POST | `/api/categorias` | Cadastrar categoria |
| PUT | `/api/categorias/:id` | Editar categoria |
| DELETE | `/api/categorias/:id` | Excluir categoria |

**Pratos**

| Método | Rota | Função |
|---|---|---|
| GET | `/api/categorias/:id/pratos` | Listar os pratos de uma categoria |
| POST | `/api/categorias/:id/pratos` | Cadastrar prato na categoria |
| GET | `/api/pratos/:id` | Buscar um prato |
| PUT | `/api/pratos/:id` | Editar prato |
| DELETE | `/api/pratos/:id` | Excluir prato |

Exemplo de cadastro de prato:

```bash
curl -X POST http://localhost:3000/api/categorias/1/pratos \
  -H "Content-Type: application/json" \
  -d '{"nome": "Frango grelhado", "descricao": "Arroz, feijão e salada", "preco": 18.90, "disponivel": true}'
```

## Regras de validação

| Regra | Resposta da API |
|---|---|
| Nome obrigatório (categoria e prato) | `400` — O campo "nome" é obrigatório. |
| Preço maior que zero | `400` — O preço deve ser maior que zero. |
| Nome de categoria sem repetição (ignora maiúsculas/minúsculas) | `409` — Já existe uma categoria com esse nome. |
| Não excluir categoria que ainda tem pratos | `409` — Não é possível excluir: a categoria ainda possui pratos. |
| Registro inexistente | `404` — Categoria não encontrada. / Prato não encontrado. |

As regras de preço, nome único e exclusão também são garantidas pelo banco (`CHECK`, índice `UNIQUE` e `ON DELETE RESTRICT` em `db/schema.sql`).

## Problemas comuns

- **`The server does not support SSL connections`**: o `?sslmode=require` está na `DATABASE_URL` de um banco local. Remova-o.
- **Erro de conexão com banco na nuvem**: confira se a `DATABASE_URL` termina com `?sslmode=require`.
- **`relation "categorias" does not exist`**: o `db/schema.sql` ainda não foi executado no banco.
- **Porta 3000 ocupada**: rode com outra porta, por exemplo `PORT=3001 npm start`.

## Equipe

| Nome | Matrícula |
|---|---|
| Petrus Galvão Fernandes Sobreira | 2631627 |
| _[Nome completo]_ | _[Matrícula]_ |
| _[Nome completo]_ | _[Matrícula]_ |
| Renato Clemente de Araújo Neto_ | 2514949 |

## Uso de IA generativa

A equipe utilizou o ChatGPT e o Claude (Anthropic) como ferramentas de apoio, conforme descrito na seção 11 do relatório entregue.
