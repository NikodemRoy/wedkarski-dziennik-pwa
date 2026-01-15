# Wędkarski Dziennik (PWA)

Wędkarski Dziennik to prosta progresywna aplikacja webowa (PWA) do zapisywania wypraw wędkarskich oraz złowionych ryb. Aplikacja działa w całości po stronie klienta, bez backendu, zapisuje dane lokalnie i obsługuje tryb offline.

Projekt wykonany w czystym HTML, CSS i JavaScript.

**Demo (HTTPS):** https://dziennik-wedkarski-pwa.netlify.app/

---

## Cel projektu

Celem projektu było stworzenie aplikacji PWA, która:

- działa offline,
- może być zainstalowana na urządzeniu,
- wykorzystuje natywne API przeglądarki,
- posiada kilka widoków i prosty routing,
- zapisuje dane lokalnie,
- osiąga wysokie wyniki w Lighthouse.

---

## Funkcje

- dodawanie, edycja i usuwanie wypraw,
- dodawanie, edycja i usuwanie ryb,
- notatki do wpisów i ryb,
- zdjęcia (tło wpisu, zdjęcie ryby),
- pobieranie lokalizacji GPS,
- działanie offline,
- instalacja jako aplikacja.

---

## Widoki

Routing oparty o hash (`#`).

- Start (Home)
- Lista wpisów
- Dodawanie wpisu
- Szczegóły wpisu
- Edycja wpisu
- Edycja ryby

Każdy widok ma jasno określony cel i jest połączony z pozostałymi w spójny sposób.

---

## Podgląd wybranych widoków

- Lista wpisów
![Wynik Lighthouse](.IMG/lista_wpisow.png)

- Dodawanie wpisu
![Wynik Lighthouse](.IMG/dodawanie_wpisow.png)

- Szczegóły wpisu
![Wynik Lighthouse](.IMG/szczegoly_wpisu.png)
![Wynik Lighthouse](.IMG/ryby_w_wpisie.png)

- Edycja wpisu
![Wynik Lighthouse](.IMG/edycja_wpisu.png)

- Edycja ryby
![Wynik Lighthouse](.IMG/edycja_ryby.png)

---

## Natywne API

Aplikacja wykorzystuje:

**Geolocation API**  
Pobieranie aktualnej pozycji użytkownika przy dodawaniu i edycji wpisu.

**Dostęp do aparatu/galerii (input file)**  
Dodawanie zdjęć z urządzenia. Obrazy są skalowane i kompresowane za pomocą Canvas API.

---

## PWA i tryb offline

- manifest aplikacji (name, short_name, ikony, tryb standalone),
- ręcznie napisany Service Worker (bez Workboxa),
- cache zasobów statycznych,
- fallback na `index.html` dla routingu SPA,
- działanie aplikacji bez dostępu do internetu,
- informacja o stanie online/offline.

---

## Strategie cache

- zasoby statyczne (HTML, CSS, JS, ikony): cache-first,
- nawigacja: fallback do `index.html` w trybie offline.

---

## Wydajność

Aplikacja osiąga bardzo wysokie wyniki w Lighthouse (100 w trybie incognito).

![Wynik Lighthouse](.IMG/wynik_lighthouse.png)

---

## Technologie

- HTML
- CSS
- JavaScript (Vanilla)
- Service Worker
- Cache API
- LocalStorage
- Canvas API
- Geolocation API

---

## Uruchomienie lokalne

Ze względu na Service Worker wymagane jest HTTPS lub serwer lokalny.

Przykład:

```
python -m http.server 5000
```

Następnie:

```
http://localhost:5000
```

---

## Status wymagań

- [x] Minimum 3 widoki
- [x] Routing
- [x] Manifest
- [x] Service Worker (ręczny)
- [x] Instalowalność
- [x] Offline
- [x] Geolokalizacja
- [x] Dostęp do aparatu/galerii
- [x] Strategia cache
- [x] Lighthouse 80+
- [x] Responsywność
- [x] Hosting HTTPS
