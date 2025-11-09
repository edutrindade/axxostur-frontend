# 🚁 Drone Flow Admin

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-7.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.1.11-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS" />
</div>

## 📋 Sobre o Projeto

O **Drone Flow Admin** é um sistema de gerenciamento administrativo desenvolvido para o cadastro e controle de empresas e parceiros que utilizam o sistema Drone Flow. Esta aplicação oferece uma interface moderna e intuitiva para administradores gerenciarem usuários, empresas parceiras e todas as operações relacionadas ao ecossistema de drones.

### 🎯 Principais Funcionalidades

- **Gerenciamento de Usuários**: Cadastro, edição e controle de status de usuários do sistema
- **Autenticação Segura**: Sistema completo de login com recuperação de senha
- **Interface Responsiva**: Design moderno e adaptável para diferentes dispositivos
- **Gestão de Empresas**: Controle de empresas parceiras e seus dados
- **Dashboard Administrativo**: Visão geral das operações e métricas do sistema
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
