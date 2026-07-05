# Relatorio de branches e testes - Collab Travel

Data da analise: 2026-07-05

## Estado do repositorio

- Branch inicial: `backend/create-tables`
- `git status`: working tree limpo antes dos testes
- `git fetch --all`: executado com sucesso apos permissao de rede
- Branches locais criadas/atualizadas para rastrear remotas:
  - `backend/auth`
  - `backend/create-tables`
  - `backend/viagens-crud`
  - `backend/despesas-resumo`
  - `backend/setup-inicial`
  - `main`
- Nenhum `merge`, `push`, `reset --hard` ou remocao de branch foi executado.
- `npm install` foi executado para permitir os testes; nao alterou arquivos versionados.

## Docker e PostgreSQL

- Container verificado: `viagens_db`
- Imagem: `postgres:16`
- Porta: `5432`
- Database: `collabtravel`
- Usuario: `root`
- Tabelas confirmadas com `docker exec viagens_db psql -U root -d collabtravel -c "\dt"`:
  - `usuarios`
  - `viagens`
  - `participantes`
  - `votacoes`
  - `opcoes`
  - `votos`
  - `despesas`

## Variaveis de ambiente

Nao existe `.env` nem `.env.example` nas branches analisadas. Para rodar localmente, use:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_NAME=collabtravel
PORT=3001
JWT_SECRET=collabtravel_secret_dev
```

O `.env` nao deve ser commitado.

## Branch `backend/setup-inicial`

- Objetivo aparente: estrutura inicial do backend Express.
- Arquivos principais:
  - `index.js`
  - `src/config/db.js`
  - `package.json`
- Scripts:
  - `npm start`
  - `npm run dev`
- Dependencias principais:
  - `express`
  - `cors`
  - `dotenv`
  - `pg`
  - tambem ja aparecem `bcrypt` e `jsonwebtoken`, embora nao haja auth implementado nesta branch.
- Rotas encontradas:
  - `GET /health`
- Teste executado:
  - servidor iniciado na porta temporaria `3105`
  - `GET http://localhost:3105/health`
- Resultado:
  - passou, retornou `{ "status": "ok", "mensagem": "Servidor rodando!" }`
- Problemas encontrados:
  - nao ha migrations nesta branch
  - nao ha rotas de auth, viagens ou despesas
- O que falta implementar:
  - estrutura modular de rotas/controllers/services/repositories
  - `.env.example`
  - endpoints reais da API

## Branch `backend/create-tables`

- Objetivo aparente: adicionar migrations SQL e manter backend minimo.
- Arquivos principais:
  - `index.js`
  - `src/config/db.js`
  - `migrations/001_create_usuarios.sql`
  - `migrations/002_create_viagens.sql`
  - `migrations/003_create_participantes.sql`
  - `migrations/004_create_votacoes.sql`
  - `migrations/005_create_opcoes.sql`
  - `migrations/006_create_votos.sql`
  - `migrations/007_create_despesas.sql`
- Scripts:
  - `npm start`
  - `npm run dev`
- Rotas encontradas:
  - `GET /health`
- Teste executado:
  - servidor iniciado na porta temporaria `3104`
  - `GET http://localhost:3104/health`
  - `docker exec viagens_db psql -U root -d collabtravel -c "\dt"`
- Resultado:
  - `/health` passou
  - as 7 tabelas principais existem no banco
- Ordem correta das migrations:
  - `001_create_usuarios.sql`
  - `002_create_viagens.sql`
  - `003_create_participantes.sql`
  - `004_create_votacoes.sql`
  - `005_create_opcoes.sql`
  - `006_create_votos.sql`
  - `007_create_despesas.sql`
- Como recriar o banco do zero, se necessario:
  - subir o Postgres com `docker compose up -d`
  - aplicar as migrations em ordem numerica usando `psql`
  - nao execute drop/reset sem backup ou autorizacao, pois isso apaga dados
- Problemas encontrados:
  - `viagens.status` usa default `Planejamento`, enquanto o contrato documenta `planejamento`
  - nao ha `UNIQUE (id_usuario, id_viagem)` em `participantes`
  - nao ha restricao clara contra voto duplicado por participante/votacao
  - nao ha coluna de organizador direto em `viagens`; a regra fica em `participantes`
- O que falta implementar:
  - rotas de auth, viagens e despesas
  - mecanismo automatizado para executar migrations

## Branch `backend/auth`

- Objetivo aparente: implementar cadastro e login com JWT.
- Arquivos principais:
  - `index.js`
  - `src/routes/authRoutes.js`
  - `src/controllers/authController.js`
  - `src/services/authService.js`
  - `src/repositories/authRepository.js`
  - `src/config/db.js`
- Scripts:
  - `npm start`
  - `npm run dev`
- Rotas encontradas:
  - `GET /health`
  - `POST /api/auth/registro`
  - `POST /api/auth/login`
- Payload de cadastro:

```json
{
  "nome": "Codex Auth Test",
  "email": "codex.auth.20260705@example.com",
  "senha": "Senha123456"
}
```

- Payload de login:

```json
{
  "email": "codex.auth.20260705@example.com",
  "senha": "Senha123456"
}
```

- Testes executados:
  - servidor iniciado na porta temporaria `3101`
  - `GET /health`
  - `POST /api/auth/registro`
  - `POST /api/auth/login`
  - consulta SQL na tabela `usuarios`
- Resultado:
  - `/health` passou
  - cadastro criou usuario `id_usuario = 1`
  - login retornou JWT
  - usuario confirmado no banco
- Problemas encontrados:
  - erros de login retornam `400`, mas o contrato espera `401` para credenciais invalidas
  - mensagem diferencia email nao cadastrado de senha incorreta, o que o contrato recomenda evitar
  - login retorna apenas `{ "token": "..." }`, sem objeto `usuario`
  - nao ha validacao explicita de campos obrigatorios antes de chamar service/repository
- O que falta implementar:
  - middleware de auth nesta branch
  - logout, se o contrato for seguido
  - padronizacao de respostas conforme `doc/endpoints.md`

## Branch `backend/viagens-crud`

- Objetivo aparente: adicionar CRUD de viagens protegido por JWT.
- Arquivos principais:
  - `src/routes/authRoutes.js`
  - `src/routes/viagensRoutes.js`
  - `src/controllers/authController.js`
  - `src/controllers/viagensController.js`
  - `src/services/authService.js`
  - `src/services/viagensService.js`
  - `src/repositories/authRepository.js`
  - `src/repositories/viagensRepository.js`
  - `src/repositories/participantesRepository.js`
  - `src/middlewares/authMiddleware.js`
  - `migrations/008_alter_participantes_cascade.sql`
- Scripts:
  - `npm start`
  - `npm run dev`
- Rotas encontradas:
  - `POST /api/auth/registro`
  - `POST /api/auth/login`
  - `GET /api/teste-auth`
  - `POST /api/viagens`
  - `GET /api/viagens`
  - `PUT /api/viagens/:id_viagem`
  - `DELETE /api/viagens/:id_viagem`
- Payload de criar viagem:

```json
{
  "titulo_viagem": "Viagem Codex Test"
}
```

- Testes executados:
  - servidor iniciado na porta temporaria `3102`
  - cadastro e login para obter JWT
  - `POST /api/viagens`
  - `GET /api/viagens`
  - `PUT /api/viagens/:id_viagem`
  - `DELETE /api/viagens/:id_viagem`
  - consulta SQL em `viagens` e `participantes`
- Resultado:
  - cadastro/login passaram
  - criacao de viagem passou
  - listagem passou
  - atualizacao passou
  - exclusao falhou com erro de foreign key em `participantes`
- Dado criado:
  - viagem `id_viagem = 1`, titulo final `Viagem Codex Test Atualizada`
  - participante organizador associado
- Problemas encontrados:
  - `DELETE /api/viagens/:id_viagem` depende da migration `008_alter_participantes_cascade.sql`
  - o banco atual nao esta com cascade aplicado na FK `participantes_id_viagem_fkey`
  - nao ha `GET /api/viagens/:id`
  - campo esperado no payload e `titulo_viagem`, diferente do contrato que usa `titulo`
  - funcao do participante e salva como `Organizador`, diferente do contrato que usa `organizador`
  - `status` retorna `Planejamento`, diferente de `planejamento`
- O que falta implementar:
  - endpoint de detalhe por ID
  - padronizacao dos nomes de campos/respostas
  - aplicar/registrar migration 008 no ambiente local
  - tratamento de `404` para viagem inexistente

## Branch `backend/despesas-resumo`

- Objetivo aparente: adicionar despesas e resumo financeiro sobre auth + viagens.
- Arquivos principais:
  - todos os arquivos de auth e viagens
  - `src/routes/despesasRoutes.js`
  - `src/controllers/despesasController.js`
  - `src/services/despesasService.js`
  - `src/repositories/despesasRepository.js`
- Scripts:
  - `npm start`
  - `npm run dev`
- Rotas encontradas:
  - `POST /api/auth/registro`
  - `POST /api/auth/login`
  - `POST /api/viagens`
  - `GET /api/viagens`
  - `PUT /api/viagens/:id_viagem`
  - `DELETE /api/viagens/:id_viagem`
  - `POST /api/viagens/:id_viagem/despesas`
  - `GET /api/viagens/:id_viagem/despesas`
  - `GET /api/viagens/:id_viagem/despesas/resumo`
- Observacao:
  - esta branch nao expoe `GET /health`
- Payload de criar despesa:

```json
{
  "descricao_despesa": "Gasolina Codex",
  "categoria_despesa": "transporte",
  "valor_despesa": 123.45
}
```

- Testes executados:
  - servidor iniciado na porta temporaria `3103`
  - cadastro e login para obter JWT
  - criacao de viagem
  - criacao de despesa
  - listagem de despesas
  - resumo financeiro
  - consulta SQL em `despesas`
- Resultado:
  - cadastro/login passaram
  - criacao de viagem passou
  - criacao de despesa passou
  - listagem retornou 1 item
  - resumo retornou 1 participante com `total_pago = 123.45` e `diferenca = 0`
  - despesa confirmada no banco
- Dado criado:
  - usuario `codex.despesas.20260705@example.com`
  - viagem `id_viagem = 2`
  - despesa `id_despesa = 1`
- Problemas encontrados:
  - endpoint de resumo real e `/api/viagens/:id_viagem/despesas/resumo`, diferente do contrato que sugere `/api/viagens/:id/resumo`
  - payload usa nomes do banco (`descricao_despesa`, `categoria_despesa`, `valor_despesa`) em vez de nomes de API (`descricao`, `categoria`, `valor`)
  - `id_pagador` esperado e `id_participante`, nao `id_usuario`
  - resposta do resumo e uma lista simples, nao o objeto com `totalGeral`, `mediaPorPessoa` e `porParticipante` descrito no contrato
  - se uma viagem nao tiver participantes, o calculo de media pode dividir por zero
- O que falta implementar:
  - padronizacao do contrato de despesas
  - editar/remover despesa
  - resumo financeiro completo
  - validacoes de valor, categoria e participante pagador

## Branch `main`

- Objetivo aparente: branch principal com documentacao, sem backend Node no checkout atual.
- Arquivos presentes:
  - `README.md`
  - `LICENSE`
  - `app/`
  - `doc/`
- Resultado:
  - nao ha `package.json`, `index.js`, `src/` ou `migrations/`
  - nao foi possivel rodar backend nesta branch

## Como rodar o backend localmente

Use uma branch que contenha backend, por exemplo:

```bash
git switch backend/despesas-resumo
docker compose up -d
npm install
npm run dev
```

Com PowerShell, se `npm` for bloqueado por execution policy, use:

```bash
npm.cmd install
npm.cmd run dev
```

Crie um `.env` local, nao versionado:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_NAME=collabtravel
PORT=3001
JWT_SECRET=collabtravel_secret_dev
```

Para conferir o banco:

```bash
docker ps
docker exec viagens_db psql -U root -d collabtravel -c "\dt"
```

## Como conectar meu front-end

- URL base local padrao: `http://localhost:3001`
- Header para rotas protegidas:

```http
Authorization: Bearer SEU_TOKEN
```

### Endpoints disponiveis por branch mais completa

Na branch `backend/despesas-resumo`:

- `POST /api/auth/registro`
- `POST /api/auth/login`
- `POST /api/viagens`
- `GET /api/viagens`
- `PUT /api/viagens/:id_viagem`
- `DELETE /api/viagens/:id_viagem`
- `POST /api/viagens/:id_viagem/despesas`
- `GET /api/viagens/:id_viagem/despesas`
- `GET /api/viagens/:id_viagem/despesas/resumo`

### Exemplo de login com fetch

```js
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@email.com',
    senha: 'Senha123456'
  })
});

const data = await response.json();
const token = data.token;
```

### Exemplo de listar viagens com fetch

```js
const response = await fetch('http://localhost:3001/api/viagens', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data.viagens);
```

### Exemplo de login com axios

```js
const { data } = await axios.post('http://localhost:3001/api/auth/login', {
  email: 'usuario@email.com',
  senha: 'Senha123456'
});

const token = data.token;
```

### Exemplo de listar viagens com axios

```js
const { data } = await axios.get('http://localhost:3001/api/viagens', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

console.log(data.viagens);
```

## Recomendacoes proximas

- Aplicar ou revisar a migration `008_alter_participantes_cascade.sql` antes de testar exclusao de viagens.
- Criar `.env.example` com as variaveis necessarias.
- Definir se a API vai seguir o contrato em `doc/endpoints.md` ou os nomes atuais baseados no schema.
- Consolidar as branches em uma branch de integracao apenas depois de corrigir divergencias de contrato.
