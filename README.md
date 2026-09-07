# Corre Corre Rosário

Jogo de plataforma em HTML5 (canvas, arquivo único) para jogar no celular.
Ajude o Vito ou a Maria a correr do Bom Fim até o Marista Rosário — e depois voltar pra casa.

## Jogar

**No celular:** abra https://rambond123.github.io/CorreCorreRosario/ no navegador e use
"Adicionar à tela inicial" (Chrome: menu ⋮ → *Instalar app* / *Adicionar à tela inicial*; Safari: compartilhar → *Adicionar à Tela de Início*).
O jogo vira um app com ícone próprio, abre em tela cheia na horizontal e funciona sem internet.

**No computador:** abra a mesma URL, ou o arquivo `index.html` direto do disco.

- **Celular:** joystick à esquerda (andar / agachar), botões PULAR e ATIRAR à direita, ❚❚ para pausar.
- **Teclado:** setas ou WASD para andar, ↓ agachar, Espaço/↑ pular, Z/X/Enter atirar, P/Esc pausar.

## Arquivos

- `index.html` — o jogo inteiro (HTML + CSS + JS).
- `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` — o que faz o jogo ser instalável e funcionar offline (PWA). Ao publicar uma versão nova, troque o nome do `CACHE` no `sw.js`.
- `sprites/` — figuras dos personagens (Vito e Maria com 8 quadros), dos inimigos e dos chefões (2 quadros cada), geradas no Lovable; `sprites/README.md` explica o formato. Sem o arquivo, o jogo volta ao desenho em vetor.
- `BACKLOG.md` — diagnóstico do código, bugs corrigidos e itens de melhoria priorizados.

## Histórico

- **v0.1** — versão original feita no chat (`correcontra.html`).
- **v0.2** — nome novo, casa na Fase 2, medalhas alcançáveis, recorde persistente, joystick corrigido.
- **v0.3** — passo fixo de 60 Hz (mesma velocidade em telas de 120 Hz), limpeza de código morto, pausa, vibração, aviso de retrato e tela cheia.
- **v0.4** — publicado no GitHub Pages como app instalável (PWA, offline); arquivo renomeado para `index.html`.
- **v0.5–v0.7** — tela cheia no celular, telas que cabem com a barra do navegador, chefão entrando de fora da tela, aura no power-up.
- **v0.8–v0.9** — sprites gerados no Lovable para as crianças, os 13 inimigos e os 3 chefões.
