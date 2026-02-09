# 🏭 Factory Manager - Inventory & Production Optimizer

Sistema Full Stack desenvolvido para o controle inteligente de produção industrial. O projeto resolve o desafio de **otimização de estoque**, sugerindo a produção de itens baseando-se no maior valor agregado para garantir o faturamento máximo com os insumos disponíveis.


## 🎯 O Problema Resolvido

Uma indústria possui diversos produtos que compartilham as mesmas matérias-primas. Quando o estoque é limitado, o sistema precisa decidir: **o que produzir primeiro?**

Este software utiliza um **Algoritmo Ganancioso (Greedy Algorithm)** para priorizar a produção de itens com o maior valor unitário. Ele realiza uma simulação em memória do estoque e apresenta ao gestor um plano de produção otimizado, permitindo a efetivação da baixa de estoque em tempo real.


## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologia |
| :--- | :--- |
| **Back-end** | Java 17+, Quarkus, Hibernate Panache, PostgreSQL |
| **Front-end** | React 18+, Vite, Redux Toolkit, Tailwind CSS v4 |
| **Testes E2E** | Cypress |
| **Testes Unitários** | JUnit 5 (Back) & Vitest + MSW (Front) |
| **Icons** | Lucide React |
| **API Client** | Axios |


## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Java 17** ou superior.
* **Node.js** (v18 ou superior).
* **PostgreSQL** rodando (ou Docker).

### 1. Configurando o Back-end (Quarkus)
Navegue até a pasta do servidor:
```powershell
cd inventory-management
```

Configure o banco de dados no arquivo src/main/resources/application.properties. Depois, execute em modo de desenvolvimento:

```powershell
./mvnw quarkus:dev
```
O servidor estará disponível em `http://localhost:8080`.

O Swagger UI pode ser acessado em `http://localhost:8080/q/swagger-ui`.

### 2. Configurando o Front-end (React)
Navegue até a pasta do cliente:

```powershell
cd inventory-frontend
```

Instale as dependências:

```powershell
npm install
```
Inicie a aplicação:

```powershell
npm run dev
```
Acesse em `http://localhost:5173`.

🧪 Testes Automatizados
O projeto possui uma pirâmide de testes para garantir a confiabilidade:

Testes de Integração e Unitários
Para rodar os testes de lógica no Back-end e Front-end:

```powershell
# No Back-end
./mvnw test


# No Front-end
# Testes de Ponta a Ponta (E2E)
# Valida o fluxo completo desde o cadastro até a baixa de estoque no Dashboard:
npx cypress open
```

## 📋 Requisitos Atendidos
- Cadastro completo (CRUD) de Produtos e Matérias-Primas com edição e exclusão.

- Associação dinâmica de matérias-primas e produtos com definição de quantidades ("Receitas").

- Algoritmo de sugestão de produção baseado em priorização por valor (Greedy).

- Dashboard de sugestão com cálculo de faturamento total e botão de confirmação de produção.

- Interface totalmente responsiva com menu lateral para Desktop e Drawer para Mobile.

- Internacionalização técnica (Código, Variáveis e Interface em Inglês).

## 👤 Autora
Camila – Desenvolvedora Full Stack.

Estudante de Tecnologia em Sistemas para Internet (IFSul).