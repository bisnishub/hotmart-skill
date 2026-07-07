---
name: hotmart-produto
description: Use ao CADASTRAR/LANÇAR um produto novo na Hotmart (curso, comunidade, evento, assinatura) — prepara todos os textos nos limites certos e as imagens nas dimensões exatas ANTES de abrir o painel, guia o cadastro tela a tela (com os gotchas do painel) e valida o resultado pela API. Gatilhos: "cadastrar produto na Hotmart", "criar oferta na Hotmart", "lançar na Hotmart", "subir produto na Hotmart".
---

# Lançar produto na Hotmart (preparação perfeita + cadastro guiado)

A API da Hotmart **não cria produtos** — cadastro é só no painel. O erro clássico é
abrir o painel sem nada pronto e ir inventando texto no meio do formulário. Esta
skill inverte: **prepara 100% do material primeiro** (textos dentro dos limites,
imagens nas medidas exatas), depois guia o cadastro tela a tela sem improviso.

## Fluxo

### 1. Briefing (antes de qualquer coisa)

Colete do usuário — e AVISE que dois campos travam depois de criados:

| Campo | Observação |
|---|---|
| Nome do produto | ⚠️ se houver CRM ligado por webhook, o nome pode ser a chave de roteamento — conferir convenção antes |
| **Formato** (curso, comunidade, evento, e-book…) | ⚠️ **BLOQUEADO após a criação** — errar = recriar o produto |
| Preço + parcelamento (1x–12x) | por oferta; dá pra criar múltiplas ofertas/lotes |
| Categoria/nicho, idioma, país principal | dropdowns simples |
| Assinatura ou pagamento único | define quais telas existem (ex.: cupons de assinatura) |

### 2. Textos — gerar já DENTRO dos limites

Escreva tudo em arquivo antes do painel (o usuário só cola). Limites reais do painel:

| Texto | Limite |
|---|---|
| Descrição do produto | **2000 caracteres** |
| Vantagens (marketplace) | **500 caracteres** |
| Descrição curta/resumo, público-alvo, palavras-chave, perfil do produtor | sem limite rígido — manter curtos |

**Valide a contagem por script** (`python3 -c "print(len(open('desc.txt').read()))"`),
não no olho. Estourou = o painel corta silenciosamente.

### 3. Imagens — dimensões exatas, geradas por código

| Asset | Spec |
|---|---|
| Imagem do produto (capa) | **600×600 px**, JPG/PNG, **máx 5 MB** |
| Header da área de membros (Club) | **2700×900 px** |

Método que funciona sem designer: montar um HTML com o design da marca no tamanho
exato e fotografar com Chrome headless — receita pronta em
`references/gerar-assets.md`. Sempre conferir dimensão final com `sips -g pixelWidth -g pixelHeight`.

### 4. Cadastro guiado no painel

Abra `references/painel-cadastro.md` (mapa tela a tela do painel, com URLs) e
acompanhe o usuário na ordem: Informações básicas → Preço/ofertas → Checkout →
Página do produto → (opcional) Afiliados, Coprodução, Cupons, Impostos.

**Gotchas do painel (não descobrir na hora):**
- O conteúdo carrega num **iframe cross-origin** (`app-vlc.hotmart.com`) — automação
  de browser que lê DOM externo não enxerga dentro; trate automação como best-effort
  e o modo guiado (humano clica, agente dita) como caminho confiável.
- **Formato** não muda depois. **Cupons** daquela tela só existem pra assinatura.
- Checkout: configurar página de agradecimento (URL própria de obrigado converte
  melhor que a padrão) e métodos de pagamento antes de divulgar.

### 5. Integração (se o produto alimenta CRM/automação)

- **Webhook**: Ferramentas → Webhook, versão **2.0.0**, marcar os eventos de compra,
  reembolso e chargeback no mínimo. O endpoint precisa responder **200 ao ping sem
  payload** (a validação da tela falha se der 4xx).
- Teste da Hotmart dispara **um evento de cada tipo marcado** com dados fictícios
  (`@example.com`, `teste@hotmart.com.br`) — filtrar esses e-mails no processamento
  e limpar leads/membros de teste depois.

### 6. Validação final pela API

Se o MCP da Hotmart estiver instalado (ex.: [thaleslaray/hotmart-mcp](https://github.com/thaleslaray/hotmart-mcp)),
feche o ciclo: `hotmart_products_list` (produto aparece?) e, após a primeira venda
ou compra-teste, `hotmart_sales_history_list`. Sem MCP: conferir no painel.

## Checklist de saída

- [ ] Formato certo escolhido (não muda depois)
- [ ] Descrição ≤2000, vantagens ≤500 — contados por script
- [ ] Capa 600×600 ≤5MB + header 2700×900 (se tiver Club)
- [ ] Oferta(s) criada(s) com parcelamento certo
- [ ] Página de agradecimento apontada no checkout
- [ ] Webhook 2.0.0 validado + eventos de teste filtrados/limpos
- [ ] Produto visível via API/painel

## Arquivos

- `references/painel-cadastro.md` — mapa completo do painel, tela a tela, com URLs
- `references/gerar-assets.md` — receita HTML→Chrome headless pros assets nas medidas
