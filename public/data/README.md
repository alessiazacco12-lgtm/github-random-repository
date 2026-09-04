# Programming Language Data

La consegna originale indica come sorgente dei linguaggi il file
"Programming Language Data".

Durante lo svolgimento dell'esercizio, aprendo questo file viene restituito
un errore 404 e dunque non risulta più disponibile.

Per questo motivo è stato creato un file locale `languages.json`,
mantenendo la stessa struttura prevista dal file originale:

- `title`: nome del linguaggio mostrato nel menu a tendina;
- `value`: valore utilizzato per effettuare la ricerca tramite la GitHub Repository Search API.

I linguaggi sono quindi gestiti localmente per garantire il corretto
funzionamento dell'applicazione anche in assenza del file originale.
