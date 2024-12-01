// Typy dla słownika stylów
interface StylesDictionary {
    [key: string]: string;
}

// Stan aplikacji
const appState = {
    currentStyle: 'style/styl1.css', // Ścieżka domyślnego stylu
    styles: {
        'Styl 1': 'style/styl1.css',
        'Styl 2': 'style/styl2.css',
        'Styl 3': 'style/styl3.css'
    } as StylesDictionary
};

// Funkcja do ustawiania stylu
function setStyle(style: string) {
    const head = document.head;

    // Usuń stary link
    const oldLink = document.querySelector(`link[rel="stylesheet"]`);
    if (oldLink) {
        head.removeChild(oldLink);
    }

    // Dodaj nowy link
    const newLink = document.createElement('link');
    newLink.rel = 'stylesheet';
    newLink.href = style;
    head.appendChild(newLink);

    // Aktualizuj stan aplikacji
    appState.currentStyle = style;
}

// Funkcja do generowania linków
function generateStyleLinks() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    // Usuń istniejące linki
    const existingLinks = document.querySelectorAll('.style-link');
    existingLinks.forEach(link => link.remove());

    // Dodaj nowe linki do zmiany stylów
    for (const [styleName, styleFile] of Object.entries(appState.styles)) {
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = styleName;
        link.className = 'style-link';
        link.onclick = (event) => {
            event.preventDefault();
            setStyle(styleFile);
        };

        const paragraph = document.createElement('p');
        paragraph.appendChild(link);
        mainElement.appendChild(paragraph);
    }
}

// Po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
    // Ustaw domyślny styl
    setStyle(appState.currentStyle);

    // Generuj linki
    generateStyleLinks();
});
