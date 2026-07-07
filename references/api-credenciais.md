# API da Hotmart — credenciais, o que cobre (e o que NÃO cobre)

## Criar credenciais (2 minutos)

1. Logado na Hotmart, acesse **app-vlc.hotmart.com/tools/credentials**
2. **Criar Credencial** → nome livre (ex.: "Claude") → **Sandbox DESMARCADO**
   pra dados reais
3. Copie os 3 valores: **Client ID**, **Client Secret**, **Basic**

⚠️ Quem tem esses 3 valores **opera sua conta inteira** (inclusive reembolsar
venda e cancelar assinatura). Guarde em cofre/secret manager — nunca em texto,
nunca em repositório.

## Autenticação (OAuth client-credentials)

```
POST https://api-sec-vlc.hotmart.com/security/oauth/token
Authorization: Basic {SEU_BASIC}
Content-Type: application/x-www-form-urlencoded

grant_type=client_credentials&client_id={ID}&client_secret={SECRET}
```

Retorna `access_token` (Bearer) usado contra `https://developers.hotmart.com`.

## O que a API cobre vs o que é só painel

| Área | API? |
|---|---|
| Histórico/sumário de vendas, comissões, participantes | ✅ |
| Assinaturas (listar, cancelar, reativar) | ✅ |
| Cupons (listar/criar) | ✅ |
| Reembolso de venda | ✅ |
| Club (módulos, progresso de alunos) | ✅ |
| **Criar/editar produto, ofertas, checkout, página, afiliação** | ❌ **só painel** — por isso esta skill existe |

## O jeito mais fácil de usar a API com IA: MCP

Em vez de programar contra a API, instale o MCP open source
**[thaleslaray/hotmart-mcp](https://github.com/thaleslaray/hotmart-mcp)**
(auditado: só fala com os endpoints oficiais da Hotmart, credenciais ficam
locais). No Claude Code:

```
/plugin marketplace add thaleslaray/plugins
/plugin install hotmart
/hotmart:configure
```

Depois é conversa: *"quanto vendi esse mês?"*, *"lista assinaturas atrasadas"*.

⚠️ O MCP expõe ferramentas de **escrita** (`hotmart_sale_refund`,
`hotmart_batch_subscriptions_cancel`) — poder real sobre dinheiro real. Trate
pedidos de estorno/cancelamento com confirmação humana.

## Uso nesta skill

A API entra no **passo final**: validar que o produto cadastrado aparece
(`hotmart_products_list`) e, depois da primeira venda, conferir o registro
(`hotmart_sales_history_list`). Cadastro em si = painel, com o mapa em
`painel-cadastro.md`.
