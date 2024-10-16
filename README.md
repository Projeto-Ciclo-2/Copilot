# Copilot

Bem vindo ao repositório do **CopilotQuiz!**
<br>
O CopilotQuiz é uma aplicação Web para testar conhecimentos diversos em um quiz de tempo real com diversos usuários do mundo todo!
<br>

## Tecnologias usadas
- Docker
- NodeJS + Express (Servidor backend)
- Cookie + JWT (Controle de sessão)
- PostgreSQL (Banco de dados)
- React (Site)
- WebSocket (Comunicação em tempo real)

## Iniciando o projeto

### Inicie o container Docker
*Para isso é necessário ter um cliente docker instalado.*
<br>
<br>
Com a engine do docker aberta, abra o terminal de sua preferência no diretório do projeto e rode:
<br>
`docker compose build`
<br>
**Atenção:** *docker compose build está instável e pode não funcionar em alguns momentos*
<br>
<br>
Em seguida, ainda no terminal, rode o comando:
<br>
`docker compose up`
<br>
<br>
Após baixar e configurar as dependências, o servidor react iniciará no `http://localhost:3000` | `http://localhost:80`.
<br>
O servidor backend (api) iniciará no `http://localhost:5000`

## Documentação

entre em /docs para acessar as documentações disponíveis.
