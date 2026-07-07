# Mapa do painel Hotmart — cadastro de produto tela a tela

Referência de campos, limites e assets do fluxo de cadastro em
`app.hotmart.com/products`. Levantado por inspeção real do painel (produto tipo
"Comunidade", jul/2026). URLs relativas a `/products/manage/{id}`.

## 1. Informações básicas (`/info`)

- **Imagem do produto**: upload da capa (thumbnail) — 600×600 px, JPG/PNG, máx 5 MB.
- **Nome do produto**: texto livre. Se houver CRM/automation ligado por webhook,
  o nome costuma ser a chave de roteamento — seguir convenção antes de salvar.
- **Descrição**: textarea com contador, limite de **2000 caracteres**.
- **Idioma do produto**: dropdown (7 idiomas).
- **Principal país para vendas**: dropdown de país.
- **Formato**: ⚠️ **bloqueado após a criação** — não editável depois. Definir certo
  na primeira vez (curso, comunidade, evento, e-book…).
- **Categoria do produto**: dropdown de categoria/nicho.

## 2. Precificação e ofertas (`/offers`)

- Tela lista cards de preço + tabela de ofertas.
- **Novo preço** (`/offers/add`):
  - **Valor** (numérico) · **Parcelamento** (checkboxes 1x–12x)
  - **Recuperador automático de vendas** (toggle)
  - **Conversão de moeda** automática (opção)
- **Configurar checkout** (`/tools/checkout/settings`):
  - Métodos de pagamento aceitos (toggles)
  - Dados do comprador exigidos no checkout
  - Chat de suporte no checkout
  - **Página de agradecimento** (thank-you page — apontar URL própria)
  - Idioma do comprador
- Cada oferta é editável individualmente (menu "..." → Editar) — valor e
  parcelamento por oferta (útil pra lotes).

## 3. Área de membros (`/content`)

- Produto tipo Comunidade: seção mínima, só o link pra configurar via **Hotmart
  Club** (conteúdo gerenciado fora dessa tela).
- Header/capa da área de membros no Club: **2700×900 px**.

## 4. Página do produto / Marketplace (`/sales-page`)

Duas opções: **Hotmart Pages** (builder com IA) ou página padrão do Marketplace.
Campos do editor de Marketplace:

- **Nome**, **Preço** (exibição), **Descrição** (botão "Gerar descrição com IA")
- **Informações adicionais**:
  - Vídeo introdutório (link)
  - Público-alvo (texto)
  - Palavras-chave (tags)
  - **Vantagens**: limite de **500 caracteres**
- **Perfil para compradores**: nome do perfil + descrição do produtor
- **Avaliação de compradores**: exibição de reviews
- **Hotmart Marketplace**: listagem no marketplace público
- **Opções avançadas**: Autor(a) (dropdown) · **Endereço da página** (slug
  customizado) · "Divulgar meus outros produtos" (toggle)

## 5. Programa de afiliados (`/affiliation-setup`)

Wizard de **4 etapas** (botão "Configurar programa"):
- Comissão (%) dos afiliados
- Etapas seguintes: termos, materiais de divulgação, aprovação de afiliados —
  as opções variam por etapa, revisar ao vivo antes de finalizar.

## 6. Coproduções (`/coproduction`)

- **Convidar Coprodutor** (`/coproduction/add`): dados do coprodutor +
  participação/comissão.

## 7. Cupons (`/subscriptions/coupons`)

- ⚠️ Cupons desta tela são **só para produtos de assinatura** — produto de
  pagamento único mostra lista vazia com aviso.
- **Novo cupom** (`/coupons/add`): código, tipo de desconto (percentual/fixo),
  vigência, limite de uso e demais regras.

## 8. Coleta de impostos (`/taxes`)

- Mostra a classificação fiscal atual.
- **Editar regras fiscais**: modal com escolha **ESS** (serviço eletrônico) vs
  **não-ESS** — define o tratamento tributário das vendas.

## 9. Webhook (Ferramentas → Webhook)

- **Versão 2.0.0** (recomendada). Um webhook pode cobrir "Todos os produtos".
- Grupos de eventos: Compras (9), Assinaturas (3), Club (2), Gestão Logística (1),
  Outros (1).
- A tela **valida a URL** no cadastro — o endpoint precisa responder 200 mesmo em
  requisição sem comprador (ping).
- O botão de teste dispara **um evento fictício de cada tipo marcado** (e-mails
  `@example.com` / `teste@hotmart.com.br`) — filtrar no processamento e limpar os
  registros de teste criados.

## 10. Checklist de textos (preparar ANTES de abrir o painel)

- Nome do produto
- Descrição (≤2000 caracteres)
- Nome + descrição do perfil do produtor
- Público-alvo
- Palavras-chave
- Vantagens (≤500 caracteres)
- Vídeo introdutório (link, opcional)
- Termos do programa de afiliados (se aplicável)

## 11. Checklist de assets

- Capa do produto: **600×600**, JPG/PNG, ≤5 MB
- Header área de membros (Club): **2700×900**
- Materiais de divulgação pra afiliados (se programa ativo)
- Vídeo introdutório (opcional)

## 12. Observações técnicas

- O painel carrega o conteúdo num **iframe cross-origin** (`app-vlc.hotmart.com`):
  automação de browser que depende de ler o DOM de fora do iframe não funciona —
  interação precisa ser visual/por coordenadas dentro do iframe. Tratar automação
  como best-effort; o fluxo confiável é o guiado (humano clica, agente dita).
- Campos bloqueados após criação: **Formato**. Definir certo na primeira vez.
- Credenciais de API (pra validação via MCP): `app-vlc.hotmart.com/tools/credentials`
  → Criar Credencial (Client ID, Client Secret, Basic). Nunca versionar.
