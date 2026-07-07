#!/usr/bin/env python3
"""Valida os textos do produto contra os limites REAIS do painel da Hotmart.

Uso:
    python3 scripts/validar-textos.py pasta/dos/textos/

A pasta deve conter (os que existirem são validados):
    descricao.txt       -> máx 2000 caracteres (Informações básicas)
    vantagens.txt       -> máx  500 caracteres (Página do produto/Marketplace)
    nome.txt            -> recomendado <= 60 (corta no card do marketplace)
    publico-alvo.txt    -> recomendado <= 300
    palavras-chave.txt  -> 1 por linha, recomendado <= 10
    perfil.txt          -> recomendado <= 500

Sai com código 1 se algum limite RÍGIDO estourar (pra usar em automação).
"""
import sys
from pathlib import Path

# (arquivo, limite, rígido?)  — rígido = o painel corta/recusa
CAMPOS = [
    ("descricao.txt",      2000, True),
    ("vantagens.txt",       500, True),
    ("nome.txt",             60, False),
    ("publico-alvo.txt",    300, False),
    ("perfil.txt",          500, False),
]

VERDE, AMARELO, VERMELHO, FIM = "\033[32m", "\033[33m", "\033[31m", "\033[0m"


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    pasta = Path(sys.argv[1])
    if not pasta.is_dir():
        print(f"{VERMELHO}✗ pasta não encontrada: {pasta}{FIM}")
        return 2

    estourou = False
    achou_algum = False
    print(f"\n  {'campo':<22}{'tamanho':>9}{'limite':>9}   veredito")
    print("  " + "-" * 58)

    for nome, limite, rigido in CAMPOS:
        arq = pasta / nome
        if not arq.exists():
            continue
        achou_algum = True
        n = len(arq.read_text(encoding="utf-8").strip())
        pct = n / limite
        if n > limite:
            cor, veredito = VERMELHO, "ESTOUROU" + (" (o painel corta!)" if rigido else " (recomendado)")
            estourou = estourou or rigido
        elif pct > 0.95:
            cor, veredito = AMARELO, "no limite — sem folga pra editar no painel"
        else:
            cor, veredito = VERDE, "ok"
        print(f"  {nome:<22}{n:>9}{limite:>9}   {cor}{veredito}{FIM}")

    kw = pasta / "palavras-chave.txt"
    if kw.exists():
        achou_algum = True
        linhas = [l for l in kw.read_text(encoding="utf-8").splitlines() if l.strip()]
        cor = VERDE if len(linhas) <= 10 else AMARELO
        print(f"  {'palavras-chave.txt':<22}{len(linhas):>9}{'10':>9}   {cor}{'ok' if len(linhas) <= 10 else 'muitas — foca nas 10 melhores'}{FIM}")

    if not achou_algum:
        print(f"  {AMARELO}nenhum arquivo de texto encontrado em {pasta}{FIM}")
        return 2

    print()
    if estourou:
        print(f"  {VERMELHO}✗ Limite rígido estourado — ajuste antes de abrir o painel.{FIM}\n")
        return 1
    print(f"  {VERDE}✓ Todos os textos prontos pra colar no painel.{FIM}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
