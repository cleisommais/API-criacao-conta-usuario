# API-criacao-conta-usuario utilizada no curso - Implementando APIs com Apigee + Node.js + Docker + Heroku

## API para criação da conta de usuário

### Link dos curso na plataforma udemy com um cupom de desconto

- link curso 01 - [ https://www.udemy.com/course/ ]

---

### Para executar o projeto

- Modo desenvolvimento - `npm run dev`
- Gerar build para fazer deploy no heroku - `npm run build`
- Definir os valores para as variáveis de ambiente usadas pela API
  - `SET PORT={PORTA_SERVIDOR}`
  - `SET MONGODB_URI=mongodb://{URL_PORTA_BANCO_MONGODB}`
  - `SET SECRET={CHAVE_SECRETA_JWT}`

### Para fazer deploy no heroku rodar os scripts em sequência (No diretório raíz do projeto rodar):

- `heroku login`
- `heroku container:login`
- `heroku create --app={NOME_DA_API}`
- `heroku config:set SECRET={CHAVE_SECRETA} --app={NOME_DA_API}`
- `heroku config:set NODE_ENV=production --app={NOME_DA_API}`
- `heroku pipelines:create {NOME_PIPELINE} --app={NOME_DA_API}`
- `heroku addons:create mongolab --name={NOME_BANCO_MONGO} --app={NOME_DA_API}`
- `heroku container:push web --app={NOME_DA_API}`
- `heroku container:release web --app={NOME_DA_API}`

##### [ OBS ] = Para executar os comandos do Heroku no seu computador, você deve instalar o CLI do Heroku instalado e com uma conta ativa criada no PaaS Heroku
