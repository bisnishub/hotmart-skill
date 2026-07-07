# Copywriting do produto — gerar TODOS os textos a partir do briefing

O agente não pede texto pronto ao usuário: **extrai a matéria-prima com o
briefing abaixo e escreve tudo** — descrição, vantagens, nome, público-alvo,
keywords e perfil — já dentro dos limites do painel. O usuário só revisa e cola.

## O briefing que extrai a matéria-prima (10 perguntas)

Faça em conversa (não em formulário), agrupando o que o usuário já respondeu:

1. **O que é** o produto e em que formato entrega? (curso, comunidade, evento, e-book, assinatura)
2. **Pra quem** exatamente? (profissão/momento de vida — "empresário que já usa IA" > "pessoas")
3. **Qual a dor** que faz essa pessoa procurar isso HOJE? (a frase que ela diria)
4. **Qual a transformação** ao final? (antes → depois, o mais concreto possível)
5. **Como funciona** por dentro? (módulos/etapas/encontros — a espinha do método)
6. **O que a pessoa recebe** listável? (aulas, templates, comunidade, bônus, suporte)
7. **Provas REAIS**: números de alunos/clientes, resultados, tempo de mercado. ⚠️ **NUNCA
   inventar — sem prova real, escreva sem prova.** Prova falsa destrói a página e o produtor.
8. **Garantia** (dias e tipo) e **preço/parcelamento**
9. **Pra quem NÃO é?** (a exclusão certa aumenta a conversão de quem é)
10. **Diferencial honesto**: por que isso e não o concorrente/YouTube grátis?

## Princípios (valem pra todos os campos)

- **Concreto > abstrato**: "edite um episódio em 45 min" > "otimize seu fluxo".
- **Benefício > recurso**: o módulo é o meio; escreva o que a pessoa GANHA com ele.
- **Números reais dão textura**: quantidades, prazos, valores — só os verdadeiros.
- **A dor na língua do cliente**: use as palavras da pergunta 3, não jargão de marketing.
- **Sem hype vazio**: "método validado por 1.200 alunos" convence; "o MELHOR curso
  REVOLUCIONÁRIO" queima. Corte: "incrível", "revolucionário", "segredo", "único no Brasil".
- **Voz ativa, frases curtas, você > nós.**

## DESCRIÇÃO (≤2000 caracteres) — a peça principal

Estrutura que converte, na ordem (com orçamento de caracteres):

| Bloco | ~chars | O que faz |
|---|---|---|
| 1. Espelho da dor | 200–300 | 2–3 frases: a situação exata do leitor (pergunta 3). Ele precisa pensar "sou eu" |
| 2. A virada | 100–200 | O produto como o caminho — 1 frase de posicionamento |
| 3. O método por dentro | 500–700 | Etapas/módulos COM o resultado de cada um ("Semana 2 — você grava o piloto de verdade") |
| 4. O que você recebe | 300–400 | Bullets `•` — entregáveis + bônus (pergunta 6) |
| 5. Pra quem é / não é | 150–250 | Qualifica e desqualifica (perguntas 2 e 9) |
| 6. Garantia | 100–150 | Risco zero explícito (pergunta 8) |
| 7. Fechamento + CTA | 80–150 | 1 frase de futuro + comando ("Seu primeiro episódio no ar em 30 dias.") |

Regras de forma: parágrafos de 2–3 linhas; SEÇÕES EM CAIXA ALTA como divisor
(o campo não aceita markdown); bullets com `•`. **Mire 1700–1900 chars** — folga
pra editar no painel. Valide: `python3 scripts/validar-textos.py textos/`.

Exemplo completo aplicando a estrutura: `examples/produto-exemplo/textos/descricao.txt`.

## VANTAGENS (≤500 caracteres) — a compressão

Não é resumo da descrição: é **o melhor argumento isolado**. Fórmula:
`[prova real] + [transformação com prazo] + [2–3 entregáveis mais desejados] + [porta de entrada sem fricção]`.

> "Método validado por 1.200 alunos: do primeiro roteiro à publicação no Spotify
> em 30 dias. Aulas diretas, templates prontos de roteiro e checklist de
> equipamento por faixa de preço — começando com o celular que você já tem." (222)

## NOME DO PRODUTO (mire ≤60)

Padrões que funcionam no marketplace (em ordem de força):

1. **Transformação com prazo**: "Do Zero ao Podcast", "Inglês de Reunião em 90 Dias"
2. **Método nomeado**: "Método [Nome]", "Protocolo [Resultado]"
3. **Identidade da comunidade**: "[Nome da tribo]" (pra assinatura/comunidade)
4. **Descritivo + qualificador**: "Tráfego Pago para Clínicas"

Evite: siglas sem contexto, trocadilho que precisa explicar, nome que não diz o
nicho. ⚠️ Se houver CRM roteando por nome do produto, siga a convenção ANTES.

## PÚBLICO-ALVO (~300)

Fórmula: `[quem] + [momento/situação] + [o que quer] + [restrição que o produto respeita]`.
É campo de qualificação do marketplace — específico filtra melhor que amplo.

## PALAVRAS-CHAVE (≤10)

Como o comprador BUSCA, não como o produtor fala: 2–3 termos de categoria
("podcast"), 4–5 de intenção ("como criar podcast", "podcast do zero"), 2–3 de
ferramenta/subtema ("edição de podcast", "distribuição spotify"). Sem repetir
variações da mesma palavra — cada slot é uma porta de busca diferente.

## PERFIL DO PRODUTOR (~500)

Credibilidade em 3 frases: `[credencial dura com número] + [prova de resultado
alheio] + [por que ensina isso]`. Terceira pessoa. Sem "apaixonado por".

## Ajuste por tipo de produto

| Tipo | Ênfase na descrição |
|---|---|
| **Curso** | método por etapas com resultado por módulo; entregáveis; "estude no seu ritmo" |
| **Comunidade/assinatura** | o que acontece TODO MÊS (rituais, encontros, hotseats); pertencimento; "você nunca fica travado sozinho"; renovação = reforçar valor contínuo |
| **Evento presencial** | transformação NO DIA (antes das 8h → depois das 20h); escassez real de vagas; logística (data/local/inclusos); networking como entregável |
| **E-book/template** | uso imediato ("aplica hoje"); especificidade do conteúdo (nº de páginas/templates); preço-impulso pede descrição mais curta e direta |
| **Software/ferramenta** | o resultado da ferramenta, não a ferramenta; casos de uso por perfil; suporte/atualizações |

## Fluxo de trabalho do agente

1. Briefing (10 perguntas) → 2. Escrever TODOS os campos de uma vez na pasta
`textos/` → 3. `validar-textos.py` → 4. Ler a descrição EM VOZ DE CLIENTE e
cortar tudo que soa a anúncio → 5. Entregar pro usuário revisar (ele ajusta fatos,
não estrutura) → 6. Painel.
