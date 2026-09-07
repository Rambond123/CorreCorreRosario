# CORRE CORRE ROSÁRIO — Backlog

> Projeto: jogo HTML5 (canvas, arquivo único) para jogar no celular.
> Arquivo base: `index.html` (ex-`corre-corre-rosario.html`, ex-`correcontra.html`). Publicado em https://rambond123.github.io/CorreCorreRosario/
> Data do diagnóstico: 07/09/2026.
> **Atualização 07/09/2026 (v0.2):** concluídos CCR-01, CCR-03, CCR-04, CCR-05, CCR-06, CCR-08 (parcial: só fallback de fonte) e os bugs BUG-02 a BUG-11. Pendentes em P0: CCR-02 (delta-time) e CCR-07 (limpeza).
> **v0.3 (07/09/2026):** CCR-02 (passo fixo de 60 Hz, independente do refresh), CCR-07 (≈330 linhas de código morto removidas), CCR-11 (vibração), CCR-12 (pausa com botão, P/Esc e ao sair do app), CCR-13 (aviso de retrato + botão de tela cheia). P0 concluído exceto embutir fontes.
> **v0.9–v0.12 (07/09/2026):** sprites de todos os personagens, inimigos e chefões (Lovable); chefões com bote telegrafado, cansaço com dano dobrado, lob e fúria; SW rede-primeiro com versão na tela; **mapa sorteado a cada partida** (inimigos, obstáculos, aéreos, bueiro e power-ups) e power-ups novos: guaraná (velocidade), bolha de chiclete (escudo) e coração (vida extra).

---

## 1. Estado atual do jogo (o que o código faz hoje)

O arquivo é a evolução "estilo Contra" do `sapo-pulador.html` (runner automático). O que mudou e o que existe:

- **Mundo de largura fixa** (`LEVEL_W = 4200`) com câmera seguindo a criança; **movimento livre** para esquerda/direita (`WALK = 4.2`), pulo, agachar e tiro nas duas direções (`frog.face`).
- **Controles mobile**: joystick analógico à esquerda (esquerda/direita/agachar) + botões PULAR e ATIRAR à direita; teclado no desktop (setas/WASD, espaço, Z/X/Enter).
- **Vidas**: 5 corações; cada dano tira 1 e dá 80 quadros de invencibilidade; zerar corações = tela "OPA!".
- **Pontuação**: `score = progresso máximo na fase / LEVEL_W × 1000`; abates somam em unidades de mundo (inimigo +60, drone +40, chefão +200).
- **Inimigos fixos por posição** (9 pontos de spawn), tipo sorteado a cada partida: rua (cachorro, patinete), esgoto (barata, rato, aranha), céu (unicórnio, coelho, ursinho, gatinho, cupcake). Patrulham em torno de uma âncora.
- **Obstáculos sólidos** só na rua (lata, banco, banca): são parede, bloqueiam tiros, só passa pulando por cima (e dá para pousar em cima).
- **Aéreos**: drone / morcego / fadinha, a 78 px do chão; escapa agachando.
- **Power-up pipoca** (3 por fase, no alto): tiro duplo por 360 quadros.
- **Bueiro** em `wx = 1700` (só na rua): Vito → esgoto, Maria → céu (mantém tempo e vidas).
- **Chefão** aparece em `frog.x ≥ 3480`, fixo em `x = 3680`: adolescente (HP 8, figurinhas), frango-rato (HP 8, ovos), ursão (HP 12, bolhas). Projéteis retos na altura das pernas.
- **Chegada**: após o chefão, ao alcançar a saída a criança caminha sozinha e entra (escola) / sobe escada (esgoto) / desce corda (céu).
- **Duas fases** (ida e volta), medalhas, tela de vitória com total.

---

## 2. Bugs e problemas encontrados no código

Tudo abaixo foi verificado diretamente no fonte (número de linha aproximado do arquivo atual).

| ID | Gravidade | Problema | Onde |
|---|---|---|---|
| BUG-01 | **Alta** | **Velocidade depende do refresh do celular.** O loop usa `requestAnimationFrame` sem delta-time; em telas de 90/120 Hz o jogo roda 1,5×/2× mais rápido e o cronômetro (`frames/60`) marca tempo errado. | `loop()`, `fmtTime()` |
| BUG-02 | **Alta** | **Prata e ouro são inalcançáveis.** Medalhas exigem 1300/1600 pts, mas o máximo teórico numa fase é ≈ 1000 (chegada) + 9 inimigos × ~14 + 4 aéreos × ~10 + chefão ~48 ≈ **1.210**. Todo mundo sempre ganha bronze. | `medalFor()`, cálculo de `score` |
| BUG-03 | **Alta** | **Fase 2 mostra a escola, não a casa.** `draw()` sempre chama `drawSchool` na rua; `drawHome` existe mas só é referenciado dentro de um `if(false)`. | `draw()` linha ~1628; `destInfo()` |
| BUG-04 | Média | Textos fixos com "Vito" mesmo jogando com a Maria ("Vito voltou pra casa", "O Vito fez…"). | `#winScreen`, `#interScreen` |
| BUG-05 | Média | **Recorde não persiste**: `localStorageGet` é um stub que retorna 0 (herança do artifact). Fora do artifact, `localStorage` funciona. | linha ~262 |
| BUG-06 | Média | **Joystick solta ao arrastar o dedo para fora da base** (`pointerleave` reseta). Falta `setPointerCapture`. | listeners de `joyBase` |
| BUG-07 | Média | Toque em qualquer ponto do canvas = pulo. Com dois dedos na tela, um toque acidental fora dos botões faz a criança pular. | `cv.addEventListener('pointerdown')` |
| BUG-08 | Baixa | `<title>` ainda é "Corre, Vito"; nome do jogo precisa virar **Corre Corre Rosário** em título, tela inicial e HUD. | `<head>`, `#startScreen` |
| BUG-09 | Baixa | Fontes vêm do Google Fonts: **sem internet o visual cai** para a fonte padrão. | `<link>` no head |
| BUG-10 | Baixa | Game over reinicia da Fase 1 sempre (perde a Fase 1 concluída). | `start()` força `phase = 1` |
| BUG-11 | Baixa | Barra de progresso usa `frog.x`, logo **anda para trás** quando a criança volta; o placar usa o máximo. Inconsistente. | `update()` |

### Código morto (herança do runner) — limpar
`startViaduct/drawViaduct/viaductHeightAt/viaductTopY/drawCar/drawCarAway`, `spawn/nextType/poolFor/TYPES/SEWER_TYPES/SKY_TYPES`, `penalize`, `hit`, `effHeight`, `startFall/updateFall/enterSky` (o estado `falling` nunca é acionado; `enterSewerLevel` substituiu), `drawFairy` (a fada), `destInfo`, `school.x`, `eBullets` (nunca é populado). São ~400 linhas que hoje só confundem. Decidir: apagar ou reaproveitar (viaduto e fada eram bons e podem voltar — ver FEAT-07 e FEAT-08).

---

## 3. Backlog priorizado

Legenda de esforço: **P** (até 1h), **M** (uma sessão), **G** (várias sessões).

### P0 — Base estável (fazer antes de qualquer feature)

| ID | Item | Esforço |
|---|---|---|
| ~~CCR-01~~ ✅ | Renomear para **Corre Corre Rosário** (title, tela inicial, textos), trocar "Vito" fixo pelo nome da criança escolhida (BUG-04, BUG-08) | P |
| ~~CCR-02~~ ✅ | **Delta-time** no loop: física e cronômetro em segundos, independentes do refresh (BUG-01) | M |
| ~~CCR-03~~ ✅ | Desenhar a **casa na Fase 2** e ajustar `exitPointX` para a porta da casa (BUG-03) | P |
| ~~CCR-04~~ ✅ | Rebalancear **pontuação e medalhas**: feito — inimigo +30, aéreo +20, chefão +150 (máx. ≈1500/fase); ouro ≥1300 e <100s, prata ≥1150 e <150s (BUG-02) | P |
| ~~CCR-05~~ ✅ | **Persistir recorde** e progresso com `localStorage` (BUG-05) | P |
| ~~CCR-06~~ ✅ | Joystick com `setPointerCapture` + zona morta; remover pulo por toque no canvas ou restringir à metade direita (BUG-06, BUG-07) | P |
| ~~CCR-07~~ ✅ | **Limpar código morto** e organizar o fonte em blocos (constantes → estado → input → update → draw → telas) | M |
| CCR-08 | Embutir fontes em base64 para jogar offline — por ora só o fallback (Arial Rounded/Trebuchet) foi feito (BUG-09) | P |

### P1 — Experiência no celular

| ID | Item | Esforço |
|---|---|---|
| CCR-10 | **Sons e música** (Web Audio, sem arquivos externos): pulo, tiro, dano, moeda, chefão, vitória; botão de mudo | M |
| ~~CCR-11~~ ✅ | **Vibração** ao levar dano (`navigator.vibrate`) | P |
| ~~CCR-12~~ ✅ | **Botão de pausa** e pausa automática ao sair do app (`visibilitychange`) | P |
| ~~CCR-13~~ ✅ | Aviso "vire o celular" quando estiver em retrato + botão de tela cheia | P |
| ~~CCR-14~~ ✅ | **PWA**: manifest + service worker para instalar na tela inicial e jogar offline com ícone próprio | M |
| CCR-15 | Tela de **"como jogar"** com os controles ilustrados (para as crianças aprenderem sozinhas) | P |
| ~~CCR-16~~ ✅ | Continuar da Fase 2 após game over (BUG-10) e barra de progresso consistente (BUG-11) | P |

### P2 — Conteúdo e jogabilidade

| ID | Item | Esforço |
|---|---|---|
| CCR-20 | **Fases em dados** (JSON com posições de inimigos/obstáculos/power-ups) em vez de listas fixas no código — pré-requisito para novas fases e editor | M |
| CCR-21 | **Fase 2 realmente diferente**: layout próprio da volta pra casa (hoje é a mesma fase com labels trocados) | M |
| CCR-22 | **Curva de dificuldade**: mais inimigos e patrulha mais rápida perto do fim; Fase 2 mais difícil que a 1 | P |
| CCR-23 | **Moedas/figurinhas colecionáveis** pelo caminho (pontuação que faz sentido pras medalhas + motivo para explorar) | M |
| ~~CCR-24~~ ◐ | **Vida extra** feita (coração, v0.12); falta o **checkpoint** no meio da fase | P |
| CCR-25 | Inimigos que **atiram** (a estrutura `eBullets` já existe e está ociosa) | P |
| CCR-26 | **Plataformas** flutuantes/andares para dar verticalidade (hoje o mundo é só o chão) | M |
| ~~CCR-27~~ ✅ | Chefões com padrões: bote telegrafado, cansaço (dano 2×), lob em arco e fúria no último terço (v0.10) | M |
| CCR-28 | Trazer de volta o **Viaduto Ildo Meneghetti** como trecho da fase (código já existe, precisa converter para coordenadas de mundo) | M |
| CCR-29 | Trazer de volta a **fada** na queda do bueiro da Maria (animação já existe em `drawFairy`) | P |
| CCR-30 | **Novos personagens** e cenários (ideias a definir com as crianças) | G |
| CCR-31 | **Mochila a jato** 🎒🔥 — power-up de pulo duplo/voo curto (~8 s); abre espaço para segredos no alto do mapa (combina com CCR-26, plataformas) | P |
| CCR-32 | **Fase do Papai** 👨🩴 — novo cenário com o **papai como chefão** que arremessa o **chinelo teleguiado** (projétil que faz curva e persegue a criança; agachar não basta, tem que despistar). Depois de derrotado, o chinelo pode virar power-up do jogador nessa fase | G |
| CCR-33 | **Apito** — power-up que congela todos os inimigos da tela por ~3 s | P |
| CCR-34 | **Ímã de figurinhas** — atrai colecionáveis próximos (depende do CCR-23) | P |
| CCR-35 | **Cachorro amigo** 🐶 — companheiro que corre junto e bloqueia um projétil antes de fugir | M |

### P3 — Polimento

| ID | Item | Esforço |
|---|---|---|
| CCR-40 | Parallax e detalhes de fundo na rua também na Fase 2 (sol se pondo, luzes acesas) | P |
| CCR-41 | Animações: entrada do chefão, tela de vitória com confete, transição entre fases | M |
| CCR-42 | Sprites em vez de desenho procedural (opcional; permitiria arte feita pelas crianças) | G |
| CCR-43 | Ranking local com nome (várias crianças no mesmo celular) | P |
| CCR-44 | Modo 2 jogadores no mesmo aparelho (metade da tela cada) | G |

---

## 4. Sugestão de primeira rodada (Sprint 1)

CCR-01, CCR-03, CCR-05, CCR-06 e CCR-08 são rápidos e juntos deixam o jogo "certo" no celular. CCR-02 (delta-time) e CCR-04 (medalhas) são os dois que mais mudam a sensação de jogo e valem entrar logo em seguida. CCR-07 (limpeza) antes de qualquer feature de P2, senão a dívida só cresce.

---

## 5. Decisões em aberto (perguntar ao Lucas)

1. Onde o jogo vai rodar: navegador do celular, PWA instalado, ou empacotar (Capacitor) para APK?
2. Sons: sintetizados no código (zero dependência) ou arquivos de áudio?
3. Manter desenho procedural (tudo em canvas, como hoje) ou migrar para sprites?
4. Quais novos cenários/personagens as crianças pediram?
