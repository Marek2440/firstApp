# Minigry targowe iSPEED - prototypy wideo

10 pomysłów na krótkie gry na stoisko, każdy pokazany jako film 10 lub 20 s (1152 x 768, 25 kl/s, H.264, format ekranu LED).
Otwórz `index.html`, żeby obejrzeć wszystkie na jednej stronie. Filmy są w `wideo/`.

To **schematy poglądowe**, nie zrzuty z iSPEED i nie gry grywalne. W każdym kadrze jest napis
„Koncepcja - nie jest gotową funkcjonalnością iSPEED". Zgodnie z wytycznymi filmowych iSPEED
(Notion: „Wytyczne: Filmy i animacje iSPEED") ekrany systemu w wersji finalnej mają pochodzić
z prawdziwych zrzutów z DEV, więc gry 1-3 trzeba będzie przerobić na realne ekrany.

| # | Gra | Czas | Blok | Czego uczy / co pokazuje |
|---|-----|------|------|---------------------------|
| 1 | Pierwsze zlecenie | 20 s | iSPEED | Zlecenie z e-maila, Asystent ze źródłem, zapis klika człowiek |
| 2 | Gdzie to jest? | 10 s | iSPEED | Menu: Spedycja FTL, Zlecenia, Finanse, Faktury |
| 3 | Mail kontra PDF | 20 s | iSPEED | Kontrola zgodności maila i PDF (różnica daty, liczby palet) |
| 4 | Załaduj naczepę | 20 s | Spedycja | Plan załadunku, kolejność rozładunku, wypełnienie |
| 5 | Trasa dnia | 20 s | Spedycja | Trasa z oknami czasowymi, oszczędność km |
| 6 | Magazynier | 20 s | Magazyn | Kompletacja najkrótszą drogą |
| 7 | Rampa | 20 s | Magazyn | Okna dostaw, wykorzystanie ramp |
| 8 | Dyspozytor 112 | 20 s | Spedycja | Awaria i korek, Asystent proponuje, człowiek decyduje |
| 9 | Przetarg | 10 s | Spedycja | Wybór przewoźnika: cena, terminowość, OC |
| 10 | Sortownia | 10 s | Magazyn | Chłodnia, ADR, delikatne, standard |

Zasady z Notion zachowane w filmach: Asystent pokazuje źródło i niczego nie zapisuje (gry 1, 3, 8),
zieleń CI tylko w ramie, tekst min. 17 px, pisownia iSPEED.

## Silnik

`silnik/` to HTML + canvas, jedna funkcja `render(gra, czas)` na klatkę.

```
cd silnik
node render.js ../wideo            # wszystkie 10 filmów
node render.js ../wideo 4,5 25     # wybrane gry, 25 kl/s
node podglad.js <katalog> <gra> 3,6.5   # PNG z wybranych sekund
```

Wymaga Node + Playwright (Chromium) i ffmpeg. Ten sam kod da się zamienić w grywalną wersję (zamiast osi czasu: zdarzenia myszy/dotyku).
