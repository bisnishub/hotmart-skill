<p align="center">
  <img src="assets/banner.png" alt="hotmart-produto — Hotmart has no API for creating products. So the AI learned the dashboard." width="100%">
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-F04E23?style=flat-square" alt="MIT"></a>
  <img src="https://img.shields.io/badge/Claude%20Code-skill-131013?style=flat-square" alt="Claude Code skill">
  <img src="https://img.shields.io/badge/docs-PT--BR%20%2B%20EN-FFB800?style=flat-square" alt="PT-BR + EN">
  <img src="https://img.shields.io/badge/PRs-welcome-52B572?style=flat-square" alt="PRs welcome">
</p>

> 🇧🇷 **[Versão em português](README.md)** — the skill itself speaks PT-BR (Hotmart's home turf); this page is the English overview.

# hotmart-produto

**The Claude Code skill that launches products on Hotmart the right way.**
Hotmart's API can't create products — registration only happens in the dashboard,
by hand. This skill teaches the AI to do all the work BEFORE: every text written
within each field's real character limit, every image in the exact required
dimensions, webhook wired without surprises — then it walks you through the
dashboard screen by screen with zero improvisation.

> 💬 **You:** "register my new course on Hotmart"
>
> 🤖 **Claude:** interviews you with 10 questions (and warns you that the
> *Format* field locks forever), **writes ALL the copy** — the description in
> ≤2000 chars block by block, benefits in ≤500, name, audience, keywords,
> producer bio — validated by script, not by eyeball; generates the 600×600
> cover and the 2700×900 members-area header in YOUR brand; guides you through
> the dashboard field by field; validates the webhook; **installs the Hotmart
> MCP if you don't have it** — and finally confirms via API that the product is
> live. You just answered questions and clicked.

## What's inside

| Piece | What it does |
|---|---|
| 📋 `SKILL.md` | The full flow: briefing → copy → assets → guided registration → webhook → API validation |
| ✍️ `references/copywriting.md` | **The copy engine**: a 10-question briefing plus a framework for EVERY field — description with a per-block character budget, benefits formula, product-name patterns, buyer-intent keywords, per-product-type adjustments |
| 🗺️ `references/painel-cadastro.md` | Screen-by-screen dashboard map (URLs, fields, limits, what locks after creation) |
| 🔔 `references/webhook-eventos.md` | Webhook v2.0.0 in full: all 16 events, annotated payload, dedupe rules, and the test button's behavior (it pollutes your CRM if you don't filter) |
| 🔑 `references/api-credenciais.md` | Credentials, OAuth, what the API covers vs. doesn't, and the MCP to operate your account by chatting |
| 🖼️ `references/gerar-assets.md` | The HTML → headless Chrome method for pixel-perfect assets without a designer |
| 🎨 `templates/` | Product cover **600×600**, Club header **2700×900**, affiliate banner **1200×628**, Club module poster **600×900**, story **1080×1920** — swap two CSS vars and the marked texts |
| ⚙️ `scripts/` | `validar-textos.py` (validates all copy against the real limits, CI-friendly exit code) and `gerar-asset.sh` (screenshots the HTML, **verifies dimensions**, warns at 5 MB) |
| 🔌 `handlers/hotmart-webhook/` | **Reference webhook handler** (Supabase Edge Function, distilled from production): validation-ping 200, hottok check, raw event log, test-event filtering, transaction dedupe — with `// YOUR CRM:` markers where you plug in |
| 📦 `examples/produto-exemplo/` | A complete fictional product: briefing, validated copy and generated cover |

## Install

```bash
git clone https://github.com/bisnishub/hotmart-skill ~/.claude/skills/hotmart-produto
```

Then just ask Claude Code: **"register a new product on Hotmart"**.

## The 5 mistakes this skill prevents

1. **Wrong Format** — the one field you can NEVER edit after creation
2. **Blown description limit** — the dashboard silently cuts at 2000 chars
3. **Off-spec images** — non-square cover? Cropped. Header off 2700×900? Stretched
4. **Webhook failing validation** — the form requires a 200 on an empty ping
5. **CRM polluted by tests** — Hotmart's test button creates fake buyers (`@example.com`) that become ghost leads if unfiltered

## What this skill is NOT

- ❌ Not 100% dashboard automation — Hotmart renders registration inside a
  cross-origin iframe that breaks DOM automation. The mode is **guided**: you
  click, the AI dictates perfect content.
- ❌ Not a replacement for [hotmart-mcp](https://github.com/thaleslaray/hotmart-mcp)
  by Thales Laray — it **complements and installs it**: the MCP operates your
  account through the API; this skill covers registration, which the API can't
  reach. **The skill launches, the MCP operates.**

---

Made with 🦞 by **[Eduardo Cavalcanti](https://instagram.com/eduardocavalcanti)** ·
[Comunidade Claw Brasil](https://comunidadeopenclawbrasil.com.br) — Brazil's tribe
of Hyperagent Maestros. Credits to [@thaleslaray](https://github.com/thaleslaray)
for the MCP that closes the other half of the loop.
