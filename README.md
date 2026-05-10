# Calculadora AFK

Calculadora/farm tracker de gemas para estimar quanto o jogador ganha ate o horario final do farm.

O projeto foi mantido simples: HTML, CSS e JavaScript puro, pronto para rodar como site estatico no GitHub Pages.

## Funcionalidades

- Calculo de tempo AFK considerando horas, minutos e segundos atuais.
- Estimativa de ciclos completos, gemas ganhas e gemas totais.
- Modo normal com 3 gemas por ciclo.
- Modo VIP com 6 gemas por ciclo.
- Validacao de campos vazios, negativos e valores invalidos.
- Resultado exibido em blocos legiveis.
- Preferencias salvas no navegador com `localStorage`.
- Suporte preparado para musica de fundo local com botao de mutar.
- Layout responsivo inspirado em visual energetico de jogo/anime.

## Como usar

1. Abra `index.html` no navegador.
2. Informe suas gemas atuais.
3. Escolha a hora final do farm.
4. Marque o modo VIP se estiver usando o bonus.
5. Clique em **Calcular farm** ou pressione Enter.

## Audio

O projeto usa uma trilha local em MP3 neste caminho:

```text
assets/
  audio/
    theme.mp3
```

Use somente arquivos com permissao, criados por voce ou royalty-free. Nao envie musicas oficiais/protegidas do jogo para o repositorio sem autorizacao.

Para trocar a musica, substitua `assets/audio/theme.mp3` por outro MP3 seguro mantendo o mesmo nome.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- GitHub Pages

## Publicar no GitHub Pages

1. Abra o repositorio no GitHub.
2. Entre em **Settings**.
3. Acesse **Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha a branch `main` e a pasta `/root`.
6. Salve e aguarde o link publico ser gerado.

Todos os caminhos do projeto sao relativos, entao CSS, JS, favicon e audio funcionam corretamente no GitHub Pages.

## Screenshot


```md
![Screenshot da Calculadora AFK](<img width="1135" height="799" alt="image" src="https://github.com/user-attachments/assets/7786b824-903a-40fe-820d-1d219019eca7" />
)
```

## Licenca

Este projeto esta sob a licenca MIT. Consulte o arquivo `LICENSE`.
