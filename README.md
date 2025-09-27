# Symulator sterownika nawadniania ogrodu

Aplikacja backendowa symulująca sterownik nawadniania ogrodu działający na mikrokontrolerze Atmega644p. Komunikacja odbywa się przez protokół UDP na porcie 7000.

## Opis projektu

Symulator zapewnia kompatybilność z:
- Kodem źródłowym mikrokontrolera: [wachcio_nawadnianie_ATmega644p](https://github.com/wachcio/wachcio_nawadniania_ATmega644p)
- Aplikacją Android B4A: [wachcio_nawadnianie_B4A_v3](https://github.com/wachcio/wachcio_nawadnianie_B4A_v3.git)

## Wymagania wstępne

- Docker
- docker-compose

## Uruchomienie

```bash
docker-compose up --build
```

Uruchomienie w tle:
```bash
docker-compose up --build -d
```

Zatrzymanie:
```bash
docker-compose down
```

## Struktura katalogów

```
├── backend-api/
│   ├── src/
│   │   └── index.js          # Główny serwer UDP
│   ├── data/
│   │   └── db.json           # Baza danych JSON
│   ├── package.json          # Zależności Node.js
│   └── Dockerfile            # Multi-stage build
├── docker-compose.yml        # Konfiguracja kontenerów
├── PRD.md                   # Dokument wymagań
└── README.md                # Ten plik
```

## Backend (Node.js)

- **Port UDP**: 7000
- **Baza danych**: `db.json` (JSON)
- **Hot reload**: Włączony w trybie development
- **Kontener**: `backend-api`

## Testowanie UDP

Symulator obsługuje format komunikacji zgodny z Atmega644p (CSV z semicolonem):

```bash
# Status systemu (pusta wiadomość lub GET_STATUS)
echo "" | nc -u localhost 7000

# Włączenie sekcji 1
echo "SET_SECTION,1,1" | nc -u localhost 7000

# Wyłączenie sekcji 1
echo "SET_SECTION,1,0" | nc -u localhost 7000

# Włączenie grupy 1
echo "SET_GROUP,1,1" | nc -u localhost 7000

# Wyłączenie grupy 1
echo "SET_GROUP,1,0" | nc -u localhost 7000
```

## Format odpowiedzi

### Status systemu (CSV)
```
wachcio_nawodnienie_v3,0,0,2,2025-09-27,01:21:22,sob,2,14,8,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,16,0,1,1,-1,22,0,22,20,20,1,2,1,-1,22,25,22,45,20,2,3,1,-1,22,50,23,10,20,3,4,1,-1,23,14,23,59,45,4,5,1,-1,1,0,1,20,20,5,2,1,-1,1,25,1,45,20,6,3,1,-1,1,50,2,10,20,7,4,1,-1,2,15,3,15,60,8,-1,-1,-1,-1,-1,-1,-1,-1,9,-1,-1,-1,-1,-1,-1,-1,-1,10,-1,-1,-1,-1,-1,-1,-1,-1,11,-1,-1,-1,-1,-1,-1,-1,-1,12,-1,-1,-1,-1,-1,-1,-1,-1,13,-1,-1,-1,-1,-1,-1,-1,-1,14,-1,-1,-1,-1,-1,-1,-1,-1,15,-1,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,1,0,0,2,0,0,1,1,0,0,0,0,0,3,0,0,0,0,1,1,0,0,0,4,0,0,0,0,0,0,0,1,1,5,0,0,0,0,1,0,1,0,0,6,0,0,0,0,0,1,1,0,0,7,0,0,0,0,0,0,0,0,0,8,0,0,0,0,0,0,0,0,0,1.2.0,8,02.06.2020,15:44:20, , ;
```

### Odpowiedzi na komendy
```
OK,SECTION_1_ON;
OK,SECTION_1_OFF;
OK,GROUP_1_ON;
OK,GROUP_1_OFF;
```

## Logi

Podgląd logów kontenera:
```bash
docker-compose logs backend-api
```

Podgląd logów na żywo:
```bash
docker-compose logs -f backend-api
```

## Status kontenerów

```bash
docker-compose ps
```