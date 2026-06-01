# 🏁 Mario Kart Race 🏁
Projeto da disciplina de Sistemas Operacionais 1 na Fatec Itapetininga.

## 🏆 Objetivos do projeto
- Versionamento com Git
- Sistemas operacionais Linux
- Pipeline CI/CD
- Testes automatizados
- Docker
- Logs e monitoramento
- Gerenciamento de configuração

## 🏁 Objetivos do jogo
- Selecionar dois personagens distintos
- Iniciar uma corrida baseada em rolagem de dados
- Retornar um vencedor baseado nas regras de negócio
### Regras de negócio

**Jogadores** :

- O computador deve receber dois personagens para disputar a corrida em um objeto cada

**Pistas**:

- Os personagens irão correr em uma pista aleatória de 5 rodadas
- A cada rodada, será sorteado um bloco da pista que pode ser uma reta, curva ou confronto
   -  Caso o bloco da pista seja uma RETA, o jogador deve rolar um dado de 6 lados e somar o atributo VELOCIDADE, quem vence ganha um ponto
   -  Caso o bloco da pista seja uma CURVA, o jogador deve rolar um dado de 6 lados e somar o atributo MANOBRABILIDADE, quem vence ganha um ponto
   - Caso o bloco da pista seja um CONFRONTO, o jogador deve rolar um dado de 6 lados e somar o atributo PODER, quem perde perde um ponto
   -  Nenhum jogador pode ter pontuação negativa
   - Em caso de empate, ninguém pontua

**Condição de vitória**:

- Ao final, vence quem acumulou mais pontos

## 🚥 Tecnologias utilizadas 
 | Camada | Tecnologia |
|------|------|
|Backend| Node.js + Express|
|Lógica do jogo| JavaScript|
|Frontend| HTML + CSS + JavaScript|
|Testes | Jest + Supertest|
|Container | Docker|
|CI | GitHub Actions|
|Deploy | Render|

## 🚥 Estrutura da aplicação
```
mariokart/
├── src/
│   ├── index.js
│   └── gameEngine.js 
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── tests/
│   ├── gameEngine.test.js
│   └── api.test.js
├── .github/
│   └── workflows/
│       └── ci.yml
├── Dockerfile
├── render.yaml
└── package.json
```

## 🚥 Automação
- ci.yaml dispara GitHub Actions para testagem
- Dois arquivos de teste diferentes
 - gameengine.test.js testa as regras de negócio do jogo
 -api.test.js testa o servidor


## 🚥 Pipeline
O arquivo ci.yaml automatiza os testes com o uso do GitHub Actions.
Sempre que há um novo push, executa as seguintes funções:
1. Fornece uma nova VM Ubuntu
2. Roda os testes de regras do jogo e servidor
3. _**Se**_ os dois testes forem bem-sucedidos, builda o Docker
4. Faz o health check 


## 🐳 Docker

| Camada | Conteúdo |
|--------|----------|
|Primeira| Imagem base do Node.js|
|Segunda| package.json + package-lock.json|
|Terceira| Módulos Node necessários|
|Quarta| Aplicação Mario Kart Race|



