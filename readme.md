# Symulator sterownika nawadniania ogrodu

Aplikacja backendowa symulująca sterownik nawadniania ogrodu działający na mikrokontrolerze Atmega644p.

## Opis projektu

Symulator nadaje co sekundę ramkę tekstową przez UDP na porcie 7000, zgodną z formatem oryginalnego sterownika. Aplikacja jest kompatybilna z aplikacją na Androida w B4A.

## Wymagania wstępne

- Docker
- docker-compose

## Uruchomienie

```bash
docker-compose up --build
```

## Struktura katalogów

```
.
├── backend-api/
│   ├── server.js      # Główny serwer UDP/HTTP
│   ├── package.json   # Konfiguracja Node.js
│   └── Dockerfile     # Konfiguracja kontenera
├── docker-compose.yml # Konfiguracja Docker Compose
└── readme.md         # Dokumentacja
```

## Opis backendu

- **Node.js** - środowisko uruchomieniowe
- **UDP Port 7000** - nadawanie ramek sterownika co sekundę
- **HTTP Port 3000** - serwer Express.js do monitorowania statusu
- **Kontener**: `backend-api`

## Format ramki

Symulator nadaje ramkę tekstową zgodną z formatem opisanym w FRAMES.md, zawierającą:
- Identyfikator urządzenia
- Status systemu i sekcji nawadniania
- Dane czasowe (data, godzina, dzień tygodnia)
- Ustawienia pamięci i grup sekcji
- Informacje o firmware

## Status

Aplikacja działa w trybie read-only - tylko nadaje ramki, nie przyjmuje komend.