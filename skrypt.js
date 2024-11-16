// Pobranie zgody na lokalizację
function requestGeolocationPermission() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Dodanie znacznika na mapę
                L.marker([lat, lon]).addTo(map)
                    .bindPopup("Twoja lokalizacja")
                    .openPopup();

                // Centrowanie mapy
                map.setView([lat, lon], 13);

                alert('Twoje współrzędne: ' + lat + ', ' + lon);
            },
            (error) => {
                // Obsługa błędów
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        alert('Nie udzielono zgody na lokalizację.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        alert('Informacje o lokalizacji są niedostępne.');
                        break;
                    case error.TIMEOUT:
                        alert('Przekroczono czas oczekiwania na lokalizację.');
                        break;
                    default:
                        alert('Wystąpił nieznany błąd.');
                }
            },
            {
                enableHighAccuracy: true, // Używaj GPS, jeśli dostępny
                timeout: 10000, // Maksymalny czas oczekiwania
                maximumAge: 0, // Nie używaj pamięci podręcznej
            }
        );
    } else {
        alert('Geolokalizacja nie jest wspierana w tej przeglądarce.');
    }
}


// Pobranie zgody na wyświetlanie powiadomień
function requestNotificationPermission() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                alert('Zgoda na powiadomienia została udzielona!');
            } else {
                alert('Zgoda na powiadomienia została odrzucona!');
            }
        });
    } else {
        console.log('Powiadomienia są już ustawione na: ' + Notification.permission);
    }
}

// Inicjalizacja mapy interaktywnej
const map = L.map('map').setView([52.2297, 21.0122], 13); // Warszawa

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Dodanie eventów do przycisków
document.getElementById('my-location').addEventListener('click', () => {
    requestGeolocationPermission();
});

document.getElementById('download-map').addEventListener('click', () => {
    generateRasterMap();
});

// Generowanie mapy rastrowej za pomocą leaflet-image
function generateRasterMap() {
    leafletImage(map, function(err, canvas) {
        if (err) {
            console.error('Błąd podczas generowania obrazu mapy:', err);
            return;
        }

        // Wyświetlenie obrazu mapy rastrowej
        const rasterMapContainer = document.getElementById('raster-map');
        rasterMapContainer.innerHTML = ''; // Wyczyść kontener
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        rasterMapContainer.appendChild(img);

        // Rozpoczęcie procesu tworzenia puzzli
        createPuzzle(canvas);
    });
}

// Tworzenie puzzli z mapy rastrowej
function createPuzzle(canvas) {
    const puzzlePiecesContainer = document.getElementById('puzzle-pieces');
    puzzlePiecesContainer.innerHTML = '';
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';

    const pieces = [];
    const gridSizeX = canvas.width / 4;
    const gridSizeY = canvas.height / 4;

    // Dzielenie obrazu na 16 części
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            const pieceCanvas = document.createElement('canvas');
            pieceCanvas.width = gridSizeX;
            pieceCanvas.height = gridSizeY;
            const context = pieceCanvas.getContext('2d');
            context.drawImage(canvas, x * gridSizeX, y * gridSizeY, gridSizeX, gridSizeY, 0, 0, gridSizeX, gridSizeY);
            const piece = {
                img: pieceCanvas.toDataURL(),
                correctX: x * gridSizeX,
                correctY: y * gridSizeY
            };
            pieces.push(piece);
        }
    }

    // Mieszanie elementów
    pieces.sort(() => Math.random() - 0.5);

    // Dodawanie elementów do kontenera rozsypanych puzzli
    pieces.forEach((piece) => {
        const pieceElement = document.createElement('div');
        pieceElement.classList.add('game-piece');
        pieceElement.style.backgroundImage = `url(${piece.img})`;

        // Ustawienie rozmiarów elementu
        pieceElement.style.width = gridSizeX + 'px';
        pieceElement.style.height = gridSizeY + 'px';

        // Losowe położenie początkowe
        const puzzlePiecesRect = puzzlePiecesContainer.getBoundingClientRect();
        const maxLeft = puzzlePiecesRect.width - gridSizeX;
        const maxTop = puzzlePiecesRect.height - gridSizeY;

        const randomLeft = Math.random() * maxLeft;
        const randomTop = Math.random() * maxTop;

        pieceElement.style.left = randomLeft + 'px';
        pieceElement.style.top = randomTop + 'px';

        // Przechowywanie danych o pozycji
        pieceElement.dataset.correctX = piece.correctX;
        pieceElement.dataset.correctY = piece.correctY;

        // Ustawienie obsługi drag & drop
        pieceElement.addEventListener('mousedown', dragStart);

        puzzlePiecesContainer.appendChild(pieceElement);
    });
}

// Funkcje drag & drop
let currentPiece = null;
let offsetX = 0;
let offsetY = 0;

function dragStart(e) {
    e.preventDefault();
    e.stopPropagation();
    currentPiece = e.target;

    // Oblicz przesunięcie kursora względem elementu
    const rect = currentPiece.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Zmiana kursora na "grabbing"
    currentPiece.style.cursor = 'grabbing';

    // Zmiana pozycji na fixed, aby element był zawsze pod kursorem
    currentPiece.style.position = 'fixed';
    currentPiece.style.zIndex = 1000; // Ustawienie najwyższego z-index

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
}

function dragMove(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!currentPiece) return;

    // Pozycja kursora względem okna przeglądarki
    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;

    // Aktualizacja pozycji elementu
    currentPiece.style.left = left + 'px';
    currentPiece.style.top = top + 'px';
}

function dragEnd(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!currentPiece) return;

    // Przywrócenie pozycji absolutnej
    currentPiece.style.position = 'absolute';
    currentPiece.style.zIndex = '';

    // Obliczenie pozycji kursora względem dokumentu
    const cursorX = e.clientX + window.pageXOffset;
    const cursorY = e.clientY + window.pageYOffset;

    // Obliczenie pozycji gameBoard względem dokumentu
    const gameBoard = document.getElementById('game-board');
    const gameBoardRect = gameBoard.getBoundingClientRect();
    const gameBoardLeft = gameBoardRect.left + window.pageXOffset;
    const gameBoardTop = gameBoardRect.top + window.pageYOffset;

    if (
        cursorX >= gameBoardLeft &&
        cursorX <= gameBoardLeft + gameBoardRect.width &&
        cursorY >= gameBoardTop &&
        cursorY <= gameBoardTop + gameBoardRect.height
    ) {
        // Przeniesienie elementu na stół do układania
        gameBoard.appendChild(currentPiece);

        // Obliczenie pozycji względem gameBoard
        const left = cursorX - offsetX - gameBoardLeft;
        const top = cursorY - offsetY - gameBoardTop;

        // Zaokrąglanie pozycji do najbliższej kratki siatki
        const gridSizeX = gameBoardRect.width / 4;
        const gridSizeY = gameBoardRect.height / 4;

        const snappedLeft = Math.round(left / gridSizeX) * gridSizeX;
        const snappedTop = Math.round(top / gridSizeY) * gridSizeY;

        currentPiece.style.left = Math.round(snappedLeft) + 'px';
        currentPiece.style.top = Math.round(snappedTop) + 'px';

        // Sprawdzanie poprawności ułożenia
        checkPlacement(currentPiece);
    } else {
        // Przeniesienie elementu z powrotem do kontenera rozsypanych puzzli
        const puzzlePiecesContainer = document.getElementById('puzzle-pieces');
        puzzlePiecesContainer.appendChild(currentPiece);

        // Obliczenie pozycji względem puzzlePiecesContainer
        const puzzlePiecesRect = puzzlePiecesContainer.getBoundingClientRect();
        const puzzlePiecesLeft = puzzlePiecesRect.left + window.pageXOffset;
        const puzzlePiecesTop = puzzlePiecesRect.top + window.pageYOffset;

        const left = cursorX - offsetX - puzzlePiecesLeft;
        const top = cursorY - offsetY - puzzlePiecesTop;

        currentPiece.style.left = left + 'px';
        currentPiece.style.top = top + 'px';
    }

    // Usunięcie eventów
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);

    // Przywrócenie kursora
    currentPiece.style.cursor = 'grab';

    currentPiece = null;
}


// Sprawdzanie, czy element jest na właściwej pozycji
function checkPlacement(piece) {
    const correctX = parseInt(piece.dataset.correctX);
    const correctY = parseInt(piece.dataset.correctY);
    const currentX = parseInt(piece.style.left);
    const currentY = parseInt(piece.style.top);

    // Definiujemy tolerancję (np. 5 pikseli)
    const tolerance = 5;

    if (Math.abs(correctX - currentX) <= tolerance && Math.abs(correctY - currentY) <= tolerance) {
        piece.classList.add('correct');
    } else {
        piece.classList.remove('correct');
    }

    checkIfAllPiecesPlaced();
}


// Sprawdzanie, czy wszystkie elementy są na swoim miejscu
function checkIfAllPiecesPlaced() {
    const allPieces = document.querySelectorAll('#game-board .game-piece');
    const allCorrect = Array.from(allPieces).every(piece => piece.classList.contains('correct'));

    console.log('All pieces placed correctly:', allCorrect);

    if (allCorrect && allPieces.length === 16) {
        console.log('Wyświetlanie powiadomienia...');
        const notification = document.getElementById('notification');
        notification.textContent = 'Wszystkie elementy zostały ułożone!';
        notification.style.display = 'block';

        if (Notification.permission === 'granted') {
            new Notification('Gratulacje!', {
                body: 'Ułożyłeś wszystkie elementy poprawnie!',
            });
        }
    }
}

// Pobranie zgody na wyświetlanie powiadomień przy załadowaniu strony
document.addEventListener('DOMContentLoaded', () => {
    requestNotificationPermission();
});
