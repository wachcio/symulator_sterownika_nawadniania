# PRD – Symulator sterownika nawadniania ogrodu

---

## 1. Cel projektu
Celem projektu jest stworzenie aplikacji backendowej, która będzie symulatorem sterownika nawadniania ogrodu.  
Sterownik w rzeczywistości działa na mikrokontrolerze **Atmega644p**. Kod źródłowy mikrokontrolera dostępny jest w repozytorium:  
👉 [wachcio_nawadnianie_ATmega644p](https://github.com/wachcio/wachcio_nawadnianie_ATmega644p)

Aplikacja powinna zachowywać się **jak fizyczny sterownik** – odpowiadać na komunikację poprzez port **UDP**.
Symulator powinien być zgodny z aplikacją na Androida w b4a Kod źródłowy aplikacji znajduje się 
https://github.com/wachcio/wachcio_nawadnianie_B4A_v3.git 
---


## 6. Plan działania
1. **Analiza kodu sterownika (C na Atmega644p):**
   - Zrozumieć, jak działa komunikacja po UDP.
   - Zidentyfikować strukturę pakietów i odpowiedzi.
2. **Stworzenie szkieletu aplikacji:**
   - Utworzenie projektu Node.js w `backend-api/`.
   - Instalacja Express.js i wymaganych paczek.
   - Obsługa serwera UDP (`dgram` w Node.js).
   - Przygotowanie struktury `db.json`.
3. **Konfiguracja Docker:**
   - Multi-stage Dockerfile dla backendu.
   - Konfiguracja `docker-compose.yml` z wolumenami.
4. **Testy lokalne:**
   - Uruchomienie `docker-compose up`.
   - Sprawdzenie czy backend nasłuchuje na porcie UDP 7000.
5. **Dokumentacja:**
   - Stworzenie pliku `readme.md` z instrukcjami:
     ```bash
     docker-compose up --build
     ```

---

## 7. readme.md (plan treści)
Plik `readme.md` będzie zawierał:
- Opis projektu
- Wymagania wstępne (Docker, docker-compose)
- Instrukcja uruchomienia:
  ```bash
  docker-compose up --build
  ```
- Struktura katalogów
- Opis backendu (Node.js UDP 7000, Express.js)
- Informacja o bazie (db.json)

---

## 8. Ograniczenia
- Brak implementacji logiki sterownika – tylko skeleton.
- Nie twórz żadnych funkcji do przyj,owania komend. Dopóki nie dam Ci wyraźnie znać program ma jedynie co senukndę nadawać ramkę teksową w formacie podanym w @FRAMES
- Brak UI (frontend).
- Brak produkcyjnego `docker-compose`.

---

## 9. Nazwy kontenerów (stałe)
- `backend-api`

---

## 10. Podsumowanie
Projekt zapewnia kompletny szkielet aplikacji symulującej sterownik nawadniania ogrodu.  
Gotowa baza pozwala w kolejnym etapie na implementację logiki komunikacji zgodnej z firmware Atmegi.
