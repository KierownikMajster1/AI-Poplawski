document.addEventListener('DOMContentLoaded', function() {
    let zadania = [];
    
    const listaZadan = document.getElementById('listaZadan');
    const poleSzukaj = document.getElementById('poleSzukaj');
    const noweZadanieInput = document.getElementById('noweZadanieInput');
    const noweZadanieData = document.getElementById('noweZadanieData');
    const dodajZadanieButton = document.getElementById('dodajZadanieButton');

    // Wczytaj zadania z Local Storage
    if (localStorage.getItem('zadania')) {
        zadania = JSON.parse(localStorage.getItem('zadania'));
    }

    // Funkcja zapisywania zadań do Local Storage
    function zapiszZadania() {
        localStorage.setItem('zadania', JSON.stringify(zadania));
    }

    // Funkcja wyświetlania listy zadań
    function wyswietlZadania() {
        listaZadan.innerHTML = '';
        const frazaSzukana = poleSzukaj.value.toLowerCase();
        zadania.forEach(function(zadanie) {
            if (frazaSzukana.length >= 2 && !zadanie.nazwa.toLowerCase().includes(frazaSzukana)) {
                return; // Pomiń zadania, które nie pasują do frazy
            }
            const li = document.createElement('li');
            
            // Nazwa zadania
            const nazwaZadaniaSpan = document.createElement('span');
            nazwaZadaniaSpan.innerHTML = wyroznijFraze(zadanie.nazwa, frazaSzukana);
            nazwaZadaniaSpan.addEventListener('click', function(event) {
                edytujNazweZadania(event, zadanie);
            });
            li.appendChild(nazwaZadaniaSpan);

            // Data wykonania
            const dataZadaniaSpan = document.createElement('span');
            dataZadaniaSpan.classList.add('data-zadania');
            dataZadaniaSpan.textContent = zadanie.dataWykonania ? ` - ${zadanie.dataWykonania}` : ' - Dodaj datę';
            dataZadaniaSpan.addEventListener('click', function(event) {
            edytujDateZadania(event, zadanie);
            });
            li.appendChild(dataZadaniaSpan);


            // Przycisk usuwania
            const usunButton = document.createElement('button');
            usunButton.textContent = 'Usuń';
            usunButton.addEventListener('click', function() {
                usunZadanie(zadanie.id);
            });
            li.appendChild(usunButton);

            listaZadan.appendChild(li);
        });
    }

    // Funkcja wyróżniania frazy
    function wyroznijFraze(tekst, fraza) {
        if (fraza && fraza.length >= 2) {
            const regex = new RegExp(`(${fraza})`, 'gi');
            return tekst.replace(regex, '<mark>$1</mark>');
        }
        return tekst;
    }

    // Kliknięcie przycisku dodaj zadanie
    dodajZadanieButton.addEventListener('click', function() {
        const nazwa = noweZadanieInput.value.trim();
        const dataWykonania = noweZadanieData.value;
        if (walidujZadanie(nazwa, dataWykonania)) {
            const zadanie = {
                id: Date.now(),
                nazwa: nazwa,
                dataWykonania: dataWykonania ? dataWykonania : null
            };
            zadania.push(zadanie);
            zapiszZadania();
            wyswietlZadania();
            noweZadanieInput.value = '';
            noweZadanieData.value = '';
        }
    });

    // Walidacja zadania
    function walidujZadanie(nazwa, dataWykonania) {
        if (nazwa.length < 3 || nazwa.length > 255) {
            alert('Nazwa zadania musi mieć od 3 do 255 znaków.');
            return false;
        }
        if (dataWykonania) {
            const wybranaData = new Date(dataWykonania);
            const dzisiaj = new Date();
            dzisiaj.setHours(0,0,0,0);
            if (wybranaData < dzisiaj) {
                alert('Data musi być dzisiejsza lub w przyszłości.');
                return false;
            }
        }
        return true;
    }

    // Obsługa pola wyszukiwarki
    poleSzukaj.addEventListener('input', function() {
        wyswietlZadania();
    });

    // Usuwanie zadania
    function usunZadanie(id) {
        zadania = zadania.filter(function(zadanie) {
            return zadanie.id !== id;
        });
        zapiszZadania();
        wyswietlZadania();
    }

    // Edycja nazwy zadania
    function edytujNazweZadania(event, zadanie) {
        const span = event.target;
        const input = document.createElement('input');
        input.type = 'text';
        input.value = zadanie.nazwa;
        input.addEventListener('blur', function() {
            if (input.value.trim().length >= 3 && input.value.trim().length <= 255) {
                zadanie.nazwa = input.value.trim();
                zapiszZadania();
                wyswietlZadania();
            } else {
                alert('Nazwa zadania musi mieć od 3 do 255 znaków.');
                wyswietlZadania();
            }
        });
        span.parentNode.replaceChild(input, span);
        input.focus();
    }

    // Edycja daty zadania
    function edytujDateZadania(event, zadanie) {
        const span = event.target;
        const input = document.createElement('input');
        input.type = 'date';
        input.value = zadanie.dataWykonania;
        input.addEventListener('blur', function() {
            if (input.value) {
                const wybranaData = new Date(input.value);
                const dzisiaj = new Date();
                dzisiaj.setHours(0,0,0,0);
                if (wybranaData < dzisiaj) {
                    alert('Data musi być dzisiejsza lub w przyszłości.');
                } else {
                    zadanie.dataWykonania = input.value;
                }
            } else {
                zadanie.dataWykonania = null;
            }
            zapiszZadania();
            wyswietlZadania();
        });
        span.parentNode.replaceChild(input, span);
        input.focus();
    }

    // Inicjalne wyświetlenie zadań
    wyswietlZadania();
});
