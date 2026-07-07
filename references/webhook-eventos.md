# Webhook Hotmart v2.0.0 — eventos, payload e armadilhas

Referência prática pra ligar a Hotmart no seu CRM/automação. Baseado em
integração real (jul/2026), incluindo o comportamento do botão de teste.

## Cadastro (Ferramentas → Webhook)

- **Versão:** 2.0.0 (a v1 manda `hottok` no corpo; a v2 manda no header
  `X-HOTMART-HOTTOK` — valide se quiser autenticar).
- Um webhook pode cobrir **"Todos os produtos"** — prefira UM endpoint central
  a um por produto.
- ⚠️ A tela **valida a URL na hora**: seu endpoint precisa responder **200 até
  em requisição vazia/sem comprador**. Se responder 4xx no ping, o cadastro falha.

## Eventos (grupos da tela)

| Grupo | Eventos |
|---|---|
| Compras (9) | `PURCHASE_APPROVED` · `PURCHASE_COMPLETE` · `PURCHASE_CANCELED` · `PURCHASE_REFUNDED` · `PURCHASE_CHARGEBACK` · `PURCHASE_BILLET_PRINTED` · `PURCHASE_EXPIRED` · `PURCHASE_DELAYED` · `PURCHASE_PROTEST` |
| Assinaturas (3) | `SUBSCRIPTION_CANCELLATION` · `SWITCH_PLAN` · `UPDATE_SUBSCRIPTION_CHARGE_DATE` |
| Club (2) | `CLUB_FIRST_ACCESS` · `CLUB_MODULE_COMPLETED` |
| Logística (1) | `ORDER_FULFILLMENT` |
| Outros (1) | `PURCHASE_OUT_OF_SHOPPING_CART` (carrinho abandonado) |

## Mapeamento sugerido → CRM

| Evento Hotmart | Significado pro funil |
|---|---|
| `PURCHASE_BILLET_PRINTED` / `PURCHASE_DELAYED` | aguardando pagamento (boleto/Pix) |
| `PURCHASE_OUT_OF_SHOPPING_CART` | carrinho abandonado (recuperação!) |
| `PURCHASE_APPROVED` | **venda** → lead fechado + liberar acesso |
| `PURCHASE_COMPLETE` | fim do período de garantia (idempotente com APPROVED) |
| `PURCHASE_CANCELED` / `PURCHASE_EXPIRED` | não completou |
| `PURCHASE_REFUNDED` / `PURCHASE_CHARGEBACK` | **revogar acesso** + marcar no CRM |
| `PURCHASE_PROTEST` | reclamação/pedido de reembolso — alerta, não ação |
| `SUBSCRIPTION_CANCELLATION` | churn de assinatura |

## Anatomia do payload v2 (campos que importam)

```jsonc
{
  "id": "uuid-do-evento",
  "event": "PURCHASE_APPROVED",
  "version": "2.0.0",
  "data": {
    "product":  { "id": 123456, "name": "Nome do Produto" },
    "buyer":    { "email": "...", "name": "...", "checkout_phone": "+55...",
                  "address": { "country_iso": "BR" } },
    "purchase": {
      "transaction": "HP0123456789",          // chave de dedupe!
      "status": "APPROVED",
      "price":   { "value": 497.0, "currency_value": "BRL" },  // EM REAIS (não centavos)
      "payment": { "type": "CREDIT_CARD", "installments_number": 12 },
      "offer":   { "code": "abc123" }
    },
    "commissions": [
      { "value": 31.8,  "source": "MARKETPLACE" },   // taxa da Hotmart
      { "value": 465.2, "source": "PRODUCER" }       // sua comissão
    ]
  }
}
```

**Regras de ouro do handler:**
1. **Dedupe por `purchase.transaction`** — o mesmo pedido gera APPROVED e depois
   COMPLETE; reprocessar não pode duplicar venda.
2. **Valores vêm em unidade monetária** (497.0 = R$ 497), diferente de gateways
   que mandam centavos.
3. Responda **200 sempre que possível** (logue e ignore o que não conhece) —
   4xx/5xx repetidos fazem a Hotmart reentregar e eventualmente desativar.
4. Grave TUDO num log de webhooks (tabela `webhook_logs` com o payload bruto) —
   é sua fonte de auditoria e a base pra métricas por transação.

## O botão de teste (importante!)

O teste da Hotmart dispara **um evento fictício de CADA tipo marcado**, com
dados de mentira: e-mails `...@example.com`, `teste@hotmart.com.br`, nomes
"John Doe", transações de amostra. Consequências:

- Seu handler **vai criar leads/membros de teste** — filtre esses e-mails no
  processamento OU limpe depois (leads, membros, acessos E produtos criados).
- Métricas de receita devem **excluir os eventos de teste** (filtre por e-mail
  de teste e/ou marque a origem).

## Segurança

- Setar e validar o **hottok** (header `X-HOTMART-HOTTOK`) é a única
  autenticação disponível — sem ela, qualquer um que descubra a URL pode
  injetar "vendas". Em produção séria: valide.
- O endpoint é público por natureza (`verify_jwt=false` em edge functions) —
  toda a segurança está no hottok + na idempotência do handler.
