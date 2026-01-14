# Wędkarski Dziennik (PWA)

Wędkarski Dziennik to progresywna aplikacja webowa (PWA) do zapisywania
wypraw wędkarskich oraz złowionych ryb. Aplikacja działa w pełni po
stronie klienta, bez backendu, zapisuje dane lokalnie i obsługuje tryb
offline.

Projekt wykonany w czystym HTML, CSS i JavaScript.

## Cel projektu

Celem projektu było stworzenie aplikacji PWA, która:
-   Działa offline 
-   Może być zainstalowana na urządzeniu
-   Wykorzystuje natywne API przeglądarki 
-   Posiada kilka widoków i routing
-   Zapisuje dane lokalnie
-   Osiąga wyniki 80+ w Lighthouse.

## Funkcje

-   Dodawanie, edycja i usuwanie wypraw
-   Dodawanie, edycja i usuwanie ryb
-   Notatki do wpisów i ryb
-   Zdjęcia (tło wpisu, zdjęcie ryby)
-   Pobieranie lokalizacji GPS
-   Działanie offline
-   Instalacja jako aplikacja

## Widoki

Routing oparty o hash (`#`).

-   Home
-   Lista wpisów
-   Dodawanie wpisu
-   Szczegóły wpisu
-   Edycja wpisu
-   Edycja ryby

## Natywne API

Aplikacja wykorzystuje:

GPS
Pobieranie pozycji użytkownika przy dodawaniu i edycji wpisu.

Kamera/galeria
Dodawanie zdjęć przez input file. Obrazy są skalowane i kompresowane za
pomocą canvas.

## PWA i offline

-   Manifest (name, short_name, ikony, standalone)
-   Ręcznie napisany Service Worker (bez Workboxa)
-   Cache zasobów statycznych
-   Fallback na index.html dla routingu SPA
-   Działanie offline
-   Informacja o stanie online/offline

## Technologie

-   HTML
-   CSS
-   JavaScript (Vanilla)
-   Service Worker
-   Cache API
-   LocalStorage
-   Canvas API
-   Geolocation API

## Uruchomienie lokalne

python -m http.server 5000

http://localhost:5000

## Status wymagań

-   [x] Minimum 3 widoki
-   [x] Routing
-   [x] Manifest
-   [x] Service Worker (ręczny)
-   [x] Instalowalność
-   [x] Offline
-   [x] Geolokalizacja
-   [x] Kamera
-   [x] Strategia cache
-   [x] Lighthouse 80+
-   [ ] Responsywność
-   [ ] Hosting HTTPS
