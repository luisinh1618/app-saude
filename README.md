# 🏥 Saúde App

Aplicativo completo de gerenciamento médico desenvolvido com:

- 📱 React Native + Expo
- ⚡ Expo Router
- 🔥 Node.js + Express
- 🗄️ SQLite + Drizzle ORM
- 🔐 JWT Authentication
- 🎨 Interface moderna e responsiva

---

# 🚀 Funcionalidades

## 👨‍⚕️ Médico

- Login médico
- Aprovação pelo admin
- Dashboard
- Gerenciamento de horários
- Visualização de consultas
- Criação de prontuários
- Emissão de receitas
- Solicitação de exames
- Perfil do médico

---

## 🧑‍🦱 Paciente

- Cadastro/Login
- Dashboard
- Visualização de médicos
- Agendamento de consultas
- Histórico médico
- Visualização de receitas
- Visualização de exames
- Perfil do paciente

---

## 👑 Admin

- Dashboard administrativo
- Aprovação de médicos
- Gerenciamento de usuários
- Gerenciamento de especialidades
- Tela financeira
- Controle completo do sistema

---

# 🔑 Usuários de Teste

## 👑 Admin

Email:
```txt
admin@saude.com
```

Senha:
```txt
123456
```

---

## 🧑‍🦱 Paciente

Email:
```txt
cle@gmail.com
```

Senha:
```txt
123456
```

---

## 👨‍⚕️ Médico

Email:
```txt
joaomedico@gmail.com
```

Senha:
```txt
123456
```

---

# ⚠️ IMPORTANTE — CONFIGURAÇÃO DO IP

Sempre que rodar o projeto em outra máquina ou outra rede Wi-Fi, é necessário trocar o IP local.

---

# 📱 MOBILE (.env)

No projeto mobile:

Arquivo:
```txt
mobile/.env
```

Troque:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:3000/api
```

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.15.80:3000/api
```

---

# ⚙️ api.service.ts

Arquivo:

```txt
mobile/services/api.service.ts
```

Troque:

```ts
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://SEU_IP:3000/api";
```

Exemplo:

```ts
const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.15.80:3000/api";
```

---

# 🌐 Como descobrir o IPv4 da máquina

No Windows:

```bash
ipconfig
```

Procure por:

```txt
IPv4 Address
```

Exemplo:

```txt
192.168.15.80
```

---

# 📦 Instalação Backend

## Entrar na pasta server

```bash
cd server
```

## Instalar dependências

```bash
npm install
```

## Rodar backend

```bash
npm run dev
```

Servidor:

```txt
http://SEU_IP:3000
```

---

# 📱 Instalação Mobile

## Entrar na pasta mobile

```bash
cd mobile
```

## Instalar dependências

```bash
npm install
```

## Rodar Expo

```bash
npx expo start
```

---

# 🗂️ Estrutura do Projeto

## Backend

```txt
server/
├── src/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middlewares/
│   ├── db/
│   ├── utils/
│   └── index.ts
```

---

## Mobile

```txt
mobile/
├── app/
├── components/
├── services/
├── viewmodels/
├── assets/
└── .env
```

---

# 🔐 Autenticação

O projeto utiliza:

- JWT Token
- SecureStore
- Middleware de autenticação
- Middleware de roles

---

# 📚 Tecnologias

## Frontend

- React Native
- Expo
- Expo Router
- Axios

---

## Backend

- Node.js
- Express
- TypeScript
- Drizzle ORM
- SQLite

---

# 🧠 Fluxo de Aprovação do Médico

1. Médico realiza cadastro
2. Status inicial:
```txt
pending
```

3. Admin aprova médico
4. Status:
```txt
approved
```

5. Médico consegue acessar área médica

---

# 💰 Sistema Financeiro

Tela administrativa de finanças:

- Simulação de pagamentos
- Taxa da plataforma
- Valor do profissional

---

# 🎨 Interface

- Cabeçalho padrão
- Logo personalizada
- Navegação com Expo Router
- Cards reutilizáveis
- Inputs reutilizáveis
- Loading states
- Design responsivo

---

# ✅ Status do Projeto

Projeto funcional contendo:

- Backend
- Mobile
- Autenticação
- CRUD completo
- Fluxo médico/paciente/admin
