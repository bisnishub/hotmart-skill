# Gerar os assets da Hotmart por código (sem designer)

Método: montar um HTML no tamanho EXATO do asset, com o design system da sua
marca, e fotografar com Chrome headless. Resultado determinístico, editável e
versionável (mudou o texto? regenera em 5s).

## Receita (macOS/Linux, só precisa do Chrome)

1. **HTML no tamanho exato do asset** — o `body` é o canvas:

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<!-- fontes da marca via Google Fonts funcionam no headless -->
<link href="https://fonts.googleapis.com/css2?family=SuaFonte&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{width:600px;height:600px;overflow:hidden;position:relative;
       background:#111; color:#fff; font-family:'SuaFonte',serif;}
  /* monte a arte com HTML/CSS normal: gradientes, SVG inline, grids */
</style>
</head>
<body>
  <!-- arte aqui -->
</body>
</html>
```

2. **Fotografar com o Chrome headless** (janela = tamanho do asset):

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"  # ou google-chrome no Linux
"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --window-size=600,600 --virtual-time-budget=6000 \
  --screenshot=capa-600x600.png "file:///caminho/para/capa.html"
```

3. **Conferir dimensão e peso** (a Hotmart rejeita >5 MB na capa):

```bash
sips -g pixelWidth -g pixelHeight capa-600x600.png   # macOS
du -h capa-600x600.png
```

## Os dois assets da Hotmart

| Asset | `--window-size` | Dica de composição |
|---|---|---|
| Capa do produto 600×600 | `600,600` | logo/mascote + promessa curta em type grande; vai aparecer PEQUENA no marketplace — menos texto, mais contraste |
| Header do Club 2700×900 | `2700,900` | layout panorâmico: wordmark + tagline à esquerda, arte à direita; fontes 2–3× maiores do que parece necessário |

## Gotchas

- `--virtual-time-budget=6000` dá tempo das webfonts carregarem antes do click.
- Janela menor que ~100px sai em branco no Chrome — pra ícones pequenos, gere
  grande e reduza (`sips -z ALTURA LARGURA arquivo.png`).
- Texto pequeno em 600×600 fica ilegível no thumbnail do marketplace — teste
  olhando a imagem em 150×150.
- PNG de foto pode passar de 5 MB — se acontecer, exporte JPG ou reduza o fundo.
