# Sistema de Controle de Visitantes e Veículos  
**Gabinete do Prefeito de Fortaleza**  

Sistema simples para registro de visitantes e veículos na sede da prefeitura de fortaleza, com frontend em React (Vite) e backend em Node.js + Express + SQLite.  

### O sistema registra:  
- Nome e CPF do visitante  
- Setor e Anfitrião  
- Observações  
- Placa e modelo do veículo  
- Horário de entrada (automático) e saída (botão)  

O sistema também gera relatórios diários e mensais em CSV.

## Estrutura do Projeto

sistema-visitantes/
* server.js # Backend Node.js + Express + SQLite
* visitantes.db # Banco SQLite (criado automaticamente)
* package.json # Dependências e scripts
* index.html # Entrada do Vite
* src/
** index.css # Estilos CSS
** main.jsx # Entrada do React
** App.jsx # App React

---
## Instalação

1. Clone ou copie o projeto:
```bash
git clone <https://github.com/FDiegoRocha/sistema-visitantes>
cd sistema-visitantes

```
2. Instale dependencias:
```bash
npm install

```

3. Backend (Node.js + SQLite)
```bash
npm run start

```
* Servidor roda em: http://localhost:3001

4. Frontend (React + Vite)
```bash
npm run dev

```
* Aplicação React roda em: http://localhost:5173

## Funcionalidades

* Formulário de Entrada

* Registro de visitante e veículo

* Entrada de informações: nome, CPF, setor, Anfitriao, veículo, modelo, observações

* Registro automático do horário de entrada

* Registro de Saída

* Botão “Registrar Saída” para cada visitante em tempo real

* Atualiza a tabela de visitantes ativos

### Relatórios CSV

* Diário: http://localhost:3001/relatorio/diario

* Mensal: http://localhost:3001/relatorio/mensal

## Dependências Principais

- Node.js 18+

- React 19+

- Express 5+

- SQLite3

- Vite 7+

## Observações

- O arquivo visitantes.db é criado automaticamente na primeira execução do backend

- Relatórios CSV são gerados dinamicamente e baixados pelo navegador