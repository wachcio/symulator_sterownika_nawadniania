
## 1. Zakres projektu
- Stworzenie szkieletu backendu w Node.js + Express.js.
- Implementacja komunikacji po **UDP na porcie 7000**.
- Brak implementacji logiki sterownika – tylko skeleton API.
- Zastosowanie prostego silnika „bazy danych” – plik JSON na dysku.
- Konfiguracja środowiska za pomocą **Docker** i **docker-compose** (tylko do lokalnego uruchomienia).
- Dokumentacja w pliku `readme.md`.


## 2. Wymagania Docker

### Ogólne
- Do uruchomienia lokalnie: **docker-compose**.
- Nie tworzyć docker-compose dla produkcji.
- sieć w Docker połączona z hostem
- Skonfigurować wolumeny lokalne (dla bazy JSON).
- Pliki Dockerfile w formie **multi-stage build** (development + production).
- Zastosować kompatybilność `--platform=linux/amd64` dla:
  - Backend



### Backend
- Stała nazwa kontenera `backend-api`.
- Port 7000/udp.
- Wolumen na `db.json`.

---

## 3. Technologia

### Backend API
- **Środowisko:** Node.js 22+
- **Język:** JavaScript
- **Framework:** Express.js
- **Port:** UDP 7000
- **Katalog:** `backend-api/`

### Baza danych
- **Silnik:** plik JSON
- **Ścieżka:** `backend-api/data/db.json`


---

## 4. Architektura systemu

Struktura katalogów:
```
project-root/
│── backend-api/
│   │── src/
│   │   └── index.js        # Główny plik backendu
│   │── data/
│   │   └── db.json         # Pseudo-baza danych JSON
│   │── package.json
│   │── Dockerfile
│
│── docker-compose.yml
│── readme.md
│── PRD.md
```

---
