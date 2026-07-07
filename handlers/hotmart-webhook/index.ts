// ─────────────────────────────────────────────────────────────
// Handler de referência — Webhook Hotmart v2.0.0 (Supabase Edge Function)
//
// Destilado de um handler em PRODUÇÃO. Cobre as regras que derrubam
// integrações de primeira viagem:
//   ✓ responde 200 ao ping de validação (senão a tela da Hotmart recusa a URL)
//   ✓ valida o hottok (se o secret HOTMART_HOTTOK estiver setado)
//   ✓ loga TODO evento bruto em webhook_logs (auditoria + métricas)
//   ✓ filtra os eventos FICTÍCIOS do botão de teste (@example.com etc.)
//   ✓ dedupe por purchase.transaction (APPROVED + COMPLETE não duplicam)
//   ✓ valores em REAIS (a Hotmart não manda centavos)
//
// Instalação:
//   1. supabase/functions/hotmart-webhook/index.ts  ← este arquivo
//   2. schema.sql neste diretório → rode no seu banco
//   3. config.toml:  [functions.hotmart-webhook]\n verify_jwt = false
//   4. supabase functions deploy hotmart-webhook --project-ref SEU_REF
//   5. (opcional, recomendado) secret HOTMART_HOTTOK com o token do webhook
//
// Os blocos marcados com "// SEU CRM:" são onde você pluga sua lógica.
// ─────────────────────────────────────────────────────────────
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-hotmart-hottok",
};

interface HotmartPayload {
  id?: string;
  event?: string;
  version?: string;
  hottok?: string; // v1 legado (v2 usa o header)
  data?: {
    product?: { id?: number | string; name?: string };
    buyer?: {
      email?: string;
      name?: string;
      checkout_phone?: string;
      address?: { country_iso?: string };
    };
    purchase?: {
      transaction?: string;
      status?: string;
      price?: { value?: number; currency_value?: string };
      payment?: { type?: string; installments_number?: number };
      offer?: { code?: string };
    };
    commissions?: { value?: number; source?: string }[];
  };
}

// Evento Hotmart → evento interno do seu funil
const EVENT_MAP: Record<string, string> = {
  PURCHASE_BILLET_PRINTED: "waiting_payment",
  PURCHASE_DELAYED: "waiting_payment",
  PURCHASE_OUT_OF_SHOPPING_CART: "abandoned",
  PURCHASE_APPROVED: "approved",
  PURCHASE_COMPLETE: "approved", // fim da garantia — dedupe cuida da duplicidade
  PURCHASE_CANCELED: "refused",
  PURCHASE_EXPIRED: "refused",
  PURCHASE_REFUNDED: "refunded",
  PURCHASE_CHARGEBACK: "chargeback",
  SUBSCRIPTION_CANCELLATION: "subscription_canceled",
  // PURCHASE_PROTEST, CLUB_*, SWITCH_PLAN, ORDER_FULFILLMENT → só log
};

// E-mails fictícios que o BOTÃO DE TESTE da Hotmart dispara
function isTestBuyer(email: string, transaction: string): boolean {
  return (
    email.includes("@example.com") ||
    email.startsWith("teste@hotmart") ||
    transaction.includes("TEST")
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const payload: HotmartPayload = await req.json().catch(() => ({}));

    // ── Autenticação opcional: header X-HOTMART-HOTTOK ──
    const expected = Deno.env.get("HOTMART_HOTTOK");
    if (expected) {
      const got = req.headers.get("x-hotmart-hottok") || payload.hottok || "";
      if (got !== expected) {
        return new Response(JSON.stringify({ error: "invalid hottok" }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const rawEvent = (payload.event || "").toUpperCase();
    const eventType = EVENT_MAP[rawEvent] || "log_only";

    // ── 1. Loga TUDO (auditoria; base pra métricas por transação) ──
    await supabase.from("webhook_logs").insert({
      source: "hotmart",
      event_type: rawEvent || "ping",
      payload,
    });

    const buyer = payload.data?.buyer;
    const email = (buyer?.email || "").toLowerCase();
    const transaction = String(payload.data?.purchase?.transaction || payload.id || "");
    const productName = payload.data?.product?.name || "";

    // ── 2. Ping de validação / evento sem comprador → 200 SEMPRE ──
    if (!email) {
      return new Response(
        JSON.stringify({ success: true, message: "received (no buyer)" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ── 3. Eventos do botão de teste: loga e NÃO processa ──
    if (isTestBuyer(email, transaction)) {
      return new Response(
        JSON.stringify({ success: true, message: "test event logged (not processed)" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Valores em REAIS (não centavos)
    const value = payload.data?.purchase?.price?.value ?? null;
    const producerCommission =
      payload.data?.commissions?.find((c) => c.source === "PRODUCER")?.value ?? null;

    switch (eventType) {
      case "approved": {
        // ── 4. Dedupe: APPROVED + COMPLETE da mesma transação = 1 venda ──
        const { data: dup } = await supabase
          .from("webhook_logs")
          .select("id")
          .eq("source", "hotmart")
          .eq("processed_transaction", transaction)
          .limit(1);
        if (dup && dup.length > 0) break; // já processada

        await supabase
          .from("webhook_logs")
          .update({ processed_transaction: transaction })
          .eq("source", "hotmart")
          .eq("event_type", rawEvent)
          .order("created_at", { ascending: false })
          .limit(1);

        // SEU CRM: registrar a venda ─────────────────────────────
        // upsert do lead/cliente por e-mail com: status "purchased",
        // productName, value, producerCommission, transaction…
        // e liberar acesso (criar membro, matrícula, etc.)
        console.log(`✅ venda: ${email} · ${productName} · R$ ${value}`);
        break;
      }

      case "refunded":
      case "chargeback": {
        // SEU CRM: revogar acesso + marcar o cliente ────────────
        console.log(`🔴 ${eventType}: ${email} · ${productName}`);
        break;
      }

      case "waiting_payment": {
        // SEU CRM: lead aguardando pagamento (fluxo de recuperação de boleto/Pix)
        break;
      }

      case "abandoned": {
        // SEU CRM: carrinho abandonado (fluxo de recuperação)
        break;
      }

      case "subscription_canceled": {
        // SEU CRM: churn de assinatura
        break;
      }

      default:
        break; // eventos informativos ficam só no log
    }

    return new Response(JSON.stringify({ success: true, event: rawEvent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("hotmart-webhook error:", error);
    // 500 faz a Hotmart REENTREGAR — bom pra falha transitória sua,
    // ruim se o erro for permanente (loop). Logue e monitore.
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
