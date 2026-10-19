# Własny TMS w stylu iSPEED — plan

Cel: chmurowy system TMS dla transportu i spedycji, inspirowany funkcjami iSPEED (interLAN).
Własna implementacja: bez kopiowania kodu, grafik ani interfejsu 1:1.

## Co robi iSPEED (z publicznych opisów)
- TMS w przeglądarce (chmura)
- AI do automatycznego wczytywania zleceń
- przewozy FTL, LTL, FCL, promowe
- extranet dla klientów i przewoźników
- aplikacja mobilna mSPEED (kierowcy, skanowanie w magazynie)
- fakturowanie + KSeF
- weryfikacja dokumentów w CEPiK, trasy na mapach HERE

Obserwacje ze strony logowania wersji testowej (ispeedtest.omidait.pl):
Angular SPA, logowanie e-mail/hasło lub Azure AD, Google reCAPTCHA, wybór języka.

## Stos (propozycja)
- Web: Next.js + TypeScript
- Backend: NestJS lub FastAPI, PostgreSQL + PostGIS
- Mobile: React Native (Expo), tryb offline
- AI import zleceń: Claude API (mail/PDF → JSON zlecenia)
- Mapy: HERE lub OSRM/Mapbox
- Multi-tenant SaaS

## Etapy
| # | Etap | Zakres |
|---|---|---|
| 0 | Fundament | logowanie, role, firmy, kontrahenci, flota, kierowcy |
| 1 | Zlecenia FTL | zlecenie od klienta → własne auto / podzlecenie przewoźnikowi, statusy, PDF, marża |
| 2 | Faktury + KSeF | faktury, korekty, kursy NBP, wysyłka do KSeF (FA(3)) |
| 3 | AI import zleceń | mail/PDF → zlecenie do zatwierdzenia |
| 4 | Aplikacja kierowcy | statusy, zdjęcia CMR, GPS, dokumenty |
| 5 | Extranet | portal klienta i przewoźnika |
| 6 | Integracje | Trans.eu, Timocom, telematyka, księgowość, CEPiK (wymagają umów/dostępów) |
| 7 | Reszta | LTL/FCL/promy, magazyn, raporty, koszty i opłaty drogowe |

## Następny krok
Przejrzeć wersję testową iSPEED (Claude in Chrome, lokalnie) i spisać moduły, pola
formularzy i procesy → na tej podstawie model danych i ekrany etapów 0–1.
