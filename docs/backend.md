# Subindo backend isoladamente
Caso seja necessário subir o backend de forma independente (para fins de teste), use esse guia.

## Requisitos
- Cliente PostgreSQL instalado localmente.
- NodeJS & NPM

## Passo a passo
1. Dentro do diretório, acesse a pasta backend.
Crie um arquivo `.env` seguindo o padrão do arquivo `.env.example`, dentro do .env insira suas credencias.

2. abra o terminal ainda no diretório /backend e execute `npm install`.

3. confira se seu banco de dados postgres está em execução e então rode `npm run migrate`.

4. após isso finalmente rode `npm run dev` e um servidor node express irá começar a rodar em http://localhost:5000 ou nas configurações que você colocar.
