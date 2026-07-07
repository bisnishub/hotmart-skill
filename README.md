# 🧡 hotmart-produto — skill de lançamento de produto na Hotmart

**Skill de Claude Code** pra cadastrar/lançar produto na Hotmart do jeito certo:
a IA prepara **todos os textos dentro dos limites reais do painel** e **as imagens
nas dimensões exatas** ANTES de você abrir a Hotmart — e depois te guia tela a
tela no cadastro, com os gotchas mapeados (o campo que trava pra sempre, o iframe
que quebra automação, o webhook que precisa responder o ping).

> A API da Hotmart não cria produtos — cadastro é só no painel. Quem já perdeu
> uma tarde inventando descrição no meio do formulário sabe por que esta skill existe.

## O que ela faz

1. **Briefing estruturado** — inclusive os campos que ficam BLOQUEADOS depois da criação (Formato!)
2. **Textos prontos nos limites**: descrição ≤2000 caracteres, vantagens ≤500 — contados por script, não no olho
3. **Assets nas medidas exatas**: capa 600×600 (≤5MB) e header do Club 2700×900, gerados por código (HTML → Chrome headless, receita inclusa)
4. **Cadastro guiado tela a tela** com o mapa completo do painel (URLs, campos, avisos)
5. **Webhook configurado sem susto** (versão 2.0.0, ping de validação, eventos de teste filtrados)
6. **Validação final pela API** via [thaleslaray/hotmart-mcp](https://github.com/thaleslaray/hotmart-mcp) (complementar — o MCP opera a conta; esta skill cobre o cadastro, que a API não faz)

## Instalar

```bash
git clone https://github.com/bisnishub/hotmart-skill ~/.claude/skills/hotmart-produto
```

Pronto. No Claude Code, é só pedir: **"cadastra um produto novo na Hotmart"**.

## Estrutura

```
hotmart-produto/
├── SKILL.md                        # o fluxo (o que o agente segue)
└── references/
    ├── painel-cadastro.md          # mapa tela a tela do painel (campos, limites, URLs)
    └── gerar-assets.md             # receita dos assets por código (600×600, 2700×900)
```

## Por que confiar nos limites daqui

Tudo foi levantado **por inspeção real do painel** (jul/2026) e validado num
cadastro de verdade — não é chute de documentação. Painel mudou? Abre uma issue
ou PR.

---

Feito com 🦞 por [Eduardo Cavalcanti](https://instagram.com/eduardocavalcanti) ·
[Comunidade Claw Brasil](https://comunidadeopenclawbrasil.com.br) — a tribo dos
Maestros de Hiperagentes.
