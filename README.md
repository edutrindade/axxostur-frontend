# AxxosTur - Frontend

Plataforma multitenant para gestão de viagens, pacotes e operações de turismo.

## 🚀 Começando

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd nexxustur-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com as configurações corretas:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### Build

Para gerar a build de produção:
```bash
npm run build
```

## 📁 Estrutura do Projeto

```
src/
├── pages/              # Páginas da aplicação
│   ├── Login.tsx      # Página de login
│   └── Home.tsx       # Dashboard principal
├── components/        # Componentes reutilizáveis
│   ├── AppSidebar.tsx     # Menu lateral
│   ├── Dashboard.tsx       # Layout principal
│   └── ui/                 # Componentes UI base
├── services/          # Serviços de API
│   ├── api.ts         # Configuração do axios
│   └── auth.ts        # Endpoints de autenticação
├── contexts/          # Contextos React
│   ├── auth.ts        # Tipos do contexto de auth
│   └── AuthContext.tsx # Provider de autenticação
├── hooks/             # Hooks customizados
│   └── useAuth.ts     # Hook para usar o contexto de auth
└── lib/               # Utilitários
    └── utils.ts       # Funções auxiliares
```

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. Os tokens são armazenados no localStorage e cookies.

### Endpoints de Autenticação

- `POST /auth/login` - Fazer login
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/logout` - Fazer logout
- `GET /auth/profile` - Obter perfil do usuário
- `PATCH /auth/profile` - Atualizar perfil
- `POST /auth/change-password` - Alterar senha
- `POST /auth/refresh` - Renovar token

## 🛠️ Endpoints da API

A API está documentada na collection do Insomnia: `AxxosTurCollection.yaml`

### Módulos Principais

1. **Auth** - Autenticação e gerenciamento de usuários
2. **Companies** - Gerenciamento de empresas
3. **Addresses** - Gerenciamento de endereços
4. **Users** - Gerenciamento de usuários das empresas
5. **Clients** - Gerenciamento de clientes
6. **Travelers** - Gerenciamento de viajantes
7. **Buses** - Gerenciamento de ônibus
8. **Hotels** - Gerenciamento de hotéis
9. **Packages** - Gerenciamento de pacotes de viagem
10. **Package-Trips** - Gerenciamento de viagens (datas)
11. **Sales** - Gerenciamento de vendas
12. **Sale-Travelers** - Viajantes de cada venda
13. **Cash Flows** - Fluxo de caixa
14. **Receivables** - Contas a receber
15. **Payables** - Contas a pagar

## 🎨 Design System

O projeto utiliza:
- Tailwind CSS para estilização
- Shadcn/ui para componentes base
- Lucide React para ícones

## 📦 Dependências Principais

- React 18+
- React Router DOM - Roteamento
- Axios - Cliente HTTP
- TanStack Query - Gerenciamento de estado assíncrono
- Tailwind CSS - Estilização
- Shadcn/ui - Componentes UI
- Sonner - Notificações toast
- Zod - Validação de schemas

## ⚙️ Configuração API

A URL base da API pode ser configurada via variável de ambiente:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Em produção, atualize este valor para apontar para sua API.

## 🔄 Fluxo de Autenticação

1. Usuário faz login com email e senha
2. Backend retorna `accessToken` e `refreshToken`
3. Tokens são armazenados no localStorage e cookies
4. `accessToken` é enviado em todas as requisições (header Authorization)
5. Quando `accessToken` expira, `refreshToken` é usado para renovar
6. Em caso de erro 401, usuário é redirecionado para login
- **Temas Personalizáveis**: Suporte a modo claro e escuro

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca para construção de interfaces de usuário
- **TypeScript 5.8.3** - Superset do JavaScript com tipagem estática
- **Vite 7.1.0** - Build tool e dev server ultra-rápido
- **React Router DOM 7.8.0** - Roteamento para aplicações React

### UI/UX
- **TailwindCSS 4.1.11** - Framework CSS utilitário
- **Radix UI** - Componentes acessíveis e customizáveis
- **Lucide React** - Biblioteca de ícones moderna
- **Sonner** - Sistema de notificações toast
- **Next Themes** - Gerenciamento de temas

### Estado e Dados
- **TanStack React Query 5.84.1** - Gerenciamento de estado do servidor
- **TanStack React Table 8.21.3** - Tabelas poderosas e flexíveis
- **Axios 1.11.0** - Cliente HTTP para requisições à API
- **React Hook Form 7.62.0** - Gerenciamento de formulários
- **Zod 4.0.15** - Validação de esquemas TypeScript

### Utilitários
- **Date-fns 4.1.0** - Manipulação de datas
- **Class Variance Authority** - Gerenciamento de variantes de classes CSS
- **CLSX & Tailwind Merge** - Utilitários para classes CSS condicionais

## 🚀 Como Executar o Projeto

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd drone-flow-admin
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local` com as configurações necessárias:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_NAME=Drone Flow Admin
   ```

4. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse a aplicação**
   
   Abra seu navegador e acesse: `http://localhost:5173`

### Scripts Disponíveis

- `npm run dev` - Executa a aplicação em modo de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Executa o linter para verificar problemas no código

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base da interface
│   ├── users/          # Componentes específicos de usuários
│   ├── AppHeader.tsx   # Cabeçalho da aplicação
│   └── AppSidebar.tsx  # Barra lateral de navegação
├── contexts/           # Contextos React (Auth, Theme)
├── hooks/              # Hooks customizados
├── pages/              # Páginas da aplicação
├── routes/             # Configuração de rotas
├── services/           # Serviços de API
├── utils/              # Funções utilitárias
└── lib/                # Configurações de bibliotecas
```

## 🔐 Autenticação

O sistema utiliza autenticação baseada em JWT (JSON Web Tokens) com as seguintes funcionalidades:
- Login seguro
- Recuperação de senha
- Refresh token automático
- Proteção de rotas privadas

## 🎨 Design System

O projeto utiliza um design system baseado em:
- **Radix UI** para componentes acessíveis
- **TailwindCSS** para estilização
- **Variantes de componentes** com Class Variance Authority
- **Temas personalizáveis** (claro/escuro)

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- 📱 Dispositivos móveis
- 📟 Tablets
- 💻 Desktops
- 🖥️ Telas grandes

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  Desenvolvido com ❤️ para o ecossistema Drone Flow
</div>
