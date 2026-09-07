# Sprites dos personagens

O jogo procura `sprites/vito.png` e `sprites/maria.png`. Se o arquivo existir, ele usa a imagem;
se não existir, continua desenhando o personagem em vetor. Basta colocar o PNG aqui e recarregar.

## Formato da folha (sprite sheet)

Um PNG **com fundo transparente**, **768 × 192 px**, com **8 quadros de 96 × 192 px** lado a lado, nesta ordem:

| # | quadro   | o que mostra |
|---|----------|--------------|
| 0 | `idle`   | parado, de pé, olhando para a direita |
| 1 | `run1`   | correndo — passo 1 (perna direita à frente) |
| 2 | `run2`   | correndo — passo 2 (pernas se cruzando) |
| 3 | `run3`   | correndo — passo 3 (perna esquerda à frente) |
| 4 | `run4`   | correndo — passo 4 (pernas se cruzando) |
| 5 | `jump`   | no ar, joelhos dobrados, braços para cima |
| 6 | `crouch` | agachado (cabeça na metade da altura do quadro) |
| 7 | `wave`   | parado acenando com uma mão |

Regras que fazem a imagem encaixar no jogo:

- O personagem **sempre virado para a direita** (o jogo espelha sozinho quando anda para a esquerda).
- **Pés encostados na borda de baixo** do quadro; cabeça pode chegar até ~8 px do topo.
- Corpo centralizado horizontalmente no quadro; largura de uns 60–80 px.
- Mesma escala em todos os quadros (o personagem não pode "crescer" entre um quadro e outro).
- Sem sombra no chão (o jogo desenha a sombra).
- Estilo cartoon com contorno, cores chapadas e poucos detalhes — em 44 px de largura na tela, detalhe fino some.

## Prompt para gerar (Lovable, ChatGPT, Gemini, Ideogram, etc.)

> Sprite sheet de um personagem de jogo 2D estilo cartoon para crianças, fundo transparente, imagem de 768×192 px dividida em 8 quadros iguais de 96×192 px, personagem sempre de perfil virado para a direita, pés na borda inferior de cada quadro, mesma escala em todos. Quadros, da esquerda para a direita: parado; correndo passo 1; correndo passo 2; correndo passo 3; correndo passo 4; pulando; agachado; acenando. Personagem: **[menino de uns 8 anos, cabelo castanho escuro, óculos, casaco azul, calça escura, tênis branco]** / **[menina de uns 6 anos, cabelo loiro escuro em coque, flor rosa no cabelo, vestido rosa de bailarina, sapatilha]**. Contorno preto fino, cores chapadas, sem sombra, sem texto.

Geradores costumam errar a grade. Se sair torto, gere **um quadro por vez** (8 imagens de 96×192, ou maiores na mesma proporção 1:2) e monte a folha: eu monto para você a partir das 8 imagens.

## Depois de gerar

1. Salve como `sprites/vito.png` e/ou `sprites/maria.png` (o nome importa).
2. Abra o jogo — se a folha carregou, a tela "Escolha a criança" já mostra a imagem nova.
3. Faça o commit e o push; o app instalado pega na próxima abertura.
