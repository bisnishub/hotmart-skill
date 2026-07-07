---
name: hotmart-produto
description: Use ao CADASTRAR/LANÇAR um produto novo na Hotmart (curso, comunidade, evento, assinatura) ou criar oferta/lote novo — prepara todos os textos nos limites certos e as imagens nas dimensões exatas ANTES de abrir o painel, guia o cadastro tela a tela (com os gotchas do painel), configura o webhook sem sustos e valida o resultado pela API. Gatilhos: "cadastrar produto na Hotmart", "criar oferta na Hotmart", "lançar na Hotmart", "subir produto na Hotmart", "lote novo na Hotmart".
---

# Lançar produto na Hotmart (preparação perfeita + cadastro guiado)

A API da Hotmart **não cria produtos** — cadastro é só no painel. O erro clássico é
abrir o painel sem nada pronto e ir inventando texto no meio do formulário. Esta
skill inverte a ordem: **prepara 100% do material primeiro** (textos dentro dos
limites reais, imagens nas medidas exatas, validados por script), depois guia o
cadastro tela a tela sem improviso, e fecha o ciclo validando pela API.

**Exemplo completo pronto** (briefing → textos → capa gerada): `examples/produto-exemplo/`.

## Fluxo principal (produto novo)

### 1. Briefing (antes de qualquer coisa)

Colete do usuário — e AVISE o que trava depois de criado:

| Campo | Observação |
|---|---|
| Nome do produto | ⚠️ se houver CRM ligado por webhook, o nome pode ser a chave de roteamento — conferir a convenção antes |
| **Formato** (curso, comunidade, evento, e-book…) | ⚠️ **BLOQUEADO após a criação** — errar = recriar o produto do zero |
| Preço + parcelamento (1x–12x) | por oferta; múltiplas ofertas = lotes |
| Assinatura ou pagamento único | muda telas disponíveis (ex.: cupons daquela tela são só de assinatura) |
| Categoria/nicho, idioma, país principal | dropdowns simples |
| Tem área de membros (Club)? | se sim, precisa do header 2700×900 |

### 2. Textos — gerar já DENTRO dos limites e validar por script

Escreva cada campo num arquivo da pasta do produto (o usuário só cola no painel):

```
textos/
├── nome.txt            (recomendado ≤60)
├── descricao.txt       (LIMITE RÍGIDO: 2000 caracteres)
├── vantagens.txt       (LIMITE RÍGIDO: 500 caracteres)
├── publico-alvo.txt    (recomendado ≤300)
├── palavras-chave.txt  (1 por linha, ≤10)
└── perfil.txt          (perfil do produtor, recomendado ≤500)
```

Depois valide — **nunca no olho**:

```bash
python3 scripts/validar-textos.py textos/
```

O script aponta o que estourou (o painel corta silenciosamente) e o que está sem
folga. Estrutura de descrição que funciona: dor → método por etapas → o que recebe
(bullets) → pra quem é / não é → garantia → fechamento com CTA.

### 3. Imagens — dimensões exatas, geradas por código

| Asset | Spec | Template pronto |
|---|---|---|
| Capa do produto | **600×600**, JPG/PNG, **≤5 MB** | `templates/capa-600.html` |
| Header área de membros (Club) | **2700×900** | `templates/header-club-2700x900.html` |

Edite as CSS vars (cores da marca) e os textos marcados com `<!-- EDITE -->`, então:

```bash
bash scripts/gerar-asset.sh templates/capa-600.html capa-600x600.png 600x600
bash scripts/gerar-asset.sh templates/header-club-2700x900.html header.png 2700x900
```

O script fotografa com Chrome headless, **confere as dimensões** e avisa se a capa
passou de 5 MB. Detalhes e gotchas do método: `references/gerar-assets.md`.

### 4. Cadastro guiado no painel

Abra `references/painel-cadastro.md` (mapa tela a tela com URLs) e conduza na ordem:

1. **Informações básicas** — nome, descrição, FORMATO (conferir 2×!), categoria
2. **Preço/ofertas** — valor, parcelamento, recuperador de vendas
3. **Checkout** — métodos de pagamento, dados exigidos, **página de agradecimento**
   (URL própria converte mais que a padrão)
4. **Página do produto/Marketplace** — vantagens, público-alvo, keywords, slug
5. Opcionais: afiliados (wizard 4 etapas), coprodução, cupons (só assinatura), impostos (ESS/não-ESS)

**Gotchas (não descobrir na hora):** o painel roda num **iframe cross-origin**
(`app-vlc.hotmart.com`) — automação de browser é best-effort; o caminho confiável
é o guiado (humano clica, agente dita o que colar). Campos com contador: cole e
confira o número exibido.

### 5. Webhook (se o produto alimenta CRM/automação)

Guia completo com tabela de eventos v2.0.0, anatomia do payload e regras do
handler: `references/webhook-eventos.md`. Resumo do que não pode errar:

- Versão **2.0.0**, um endpoint pra "Todos os produtos"
- O endpoint deve responder **200 até no ping vazio** (senão a tela recusa a URL)
- **Dedupe por `purchase.transaction`**; valores vêm **em reais**, não centavos
- O botão de teste dispara 1 evento fictício de CADA tipo (`@example.com`) —
  **filtrar e limpar** leads/membros/produtos de teste depois

### 6. Validação final pela API

Com o MCP [thaleslaray/hotmart-mcp](https://github.com/thaleslaray/hotmart-mcp)
instalado (setup em `references/api-credenciais.md`): `hotmart_products_list`
(produto no ar?) e, após compra-teste, `hotmart_sales_history_list`. Sem MCP:
conferir no painel.

## Modo rápido: nova oferta/lote num produto existente

1. `/products/manage/{id}/offers` → **Novo preço** → valor + parcelamento
2. Cada oferta tem checkout próprio (link distinto) — atualizar o botão da página
   de vendas pro link do lote novo
3. Validar: abrir o checkout em aba anônima e conferir valor/parcelas exibidos

## Checklist de saída

- [ ] Formato certo (não muda depois) e nome dentro da convenção do CRM
- [ ] `validar-textos.py` verde (descrição ≤2000, vantagens ≤500)
- [ ] Capa 600×600 ≤5MB (+ header 2700×900 se tiver Club) — dimensões conferidas
- [ ] Oferta(s) com parcelamento certo + checkout testado em aba anônima
- [ ] Página de agradecimento própria apontada
- [ ] Webhook 2.0.0 validado + eventos de teste filtrados/limpos
- [ ] Produto visível via API/painel

## Arquivos

- `references/painel-cadastro.md` — mapa completo do painel, tela a tela, com URLs
- `references/gerar-assets.md` — método HTML→Chrome headless pros assets
- `references/webhook-eventos.md` — eventos v2.0.0, payload anotado, regras do handler
- `references/api-credenciais.md` — credenciais, OAuth, o que a API cobre, MCP
- `templates/` — capa 600×600 e header 2700×900 prontos pra editar
- `scripts/` — `validar-textos.py` (limites) e `gerar-asset.sh` (assets conferidos)
- `examples/produto-exemplo/` — produto fictício completo (textos validados + capa gerada)
