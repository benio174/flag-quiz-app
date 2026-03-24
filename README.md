# 🏳️ Quiz o Flagach Świata (Full-Stack App)

Interaktywna aplikacja do nauki flag państw z całego świata, podzielona na regiony, z systemem logowania i tabelą najlepszych wyników.

## 🚀 Technologie
* **Frontend:** React
* **Backend:** Java Spring Boot
* **Baza danych:** MySQL (XAMPP)
* **Stylizacja:** CSS

## 📋 Funkcje
* Tryby gry: Wybór nazwy państwa, wybór flagi państwa i wpisywanie nazwy z klawiatury.
* Filtrowanie według kontynentów (Europa, Azja, Afryka, Ameryki, Oceania, Świat).
* System użytkowników: Rejestracja i logowanie.
* Profil gracza: Historia gier i Top 10 najlepszych wyników dla każdego regionu.
* Wielojęzyczność: Obsługa języka polskiego i angielskiego.

## 🛠️ Jak uruchomić projekt lokalnie?

### 1. Baza danych
1. Uruchom MySQL w panelu XAMPP.
2. Zaimportuj plik znajdujący się w `/database/flags.sql` do swojego phpMyAdmin.

### 2. Backend (Java)
1. Wejdź do folderu `/backend`.
2. Upewnij się, że masz zainstalowane JDK 17 lub nowsze.
3. Uruchom aplikację przez VS Code (Spring Boot Dashboard) lub komendą `./mvnw spring-boot:run`.

### 3. Frontend (React)
1. Wejdź do folderu `/frontend`.
2. Wykonaj `npm install`, aby pobrać biblioteki.
3. Uruchom aplikację komendą `npm run dev`.