// In questo esercizio, utilizzerai Promise.all() per creare la funzione getDashboardData(query), che accetta una città come input e recupera simultaneamente:

//     Nome completo della città e paese da  /destinations?search=[query]
//     (result.name, result.country, nelle nuove proprietà city e country).
//     Il meteo attuale da /weathers?search={query}
//     (result.temperature e result.weather_description nella nuove proprietà temperature e weather).
//     Il nome dell’aeroporto principale da /airports?search={query}
//     (result.name nella nuova proprietà airport).

// Utilizzerai Promise.all() per eseguire queste richieste in parallelo e poi restituirai un oggetto con i dati aggregati.

//endpoint Home
//http://localhost:5000/destinations

//PER LA QUERY (Nome completo della città e paese da)
// http://localhost:5000/destinations?search=London

//PER IL METEO
//http://localhost:5000/weathers?search=london

//Il nome dell’aeroporto principale
//http://localhost:5000/airports?search=london

async function getDashboardData(query) {
  try {
    // Primo gruppo di chiamate API parallele usando Promise.all
    // Effettua tre richieste HTTP contemporaneamente
    const [destinationsRes, weatherRes, airportRes] = await Promise.all([
      fetch(`http://localhost:5000/destinations?search=${query}`),
      fetch(`http://localhost:5000/weathers?search=${query}`),
      fetch(`http://localhost:5000/airports?search=${query}`),
    ]);

    // Secondo gruppo di Promise.all per convertire le risposte in JSON
    // Processa i dati delle tre risposte in parallelo
    const [destinationsData, weatherData, airportData] = await Promise.all([
      destinationsRes.json(),
      weatherRes.json(),
      airportRes.json(),
    ]);

    // Estrae il primo risultato da ogni array di risposta
    const destination = destinationsData[0];
    const weather = weatherData[0];
    const airport = airportData[0];

    // Crea l'oggetto finale con i dati formattati
    const dashboardData = {
      city: destination.name,
      country: destination.country,
      temperature: weather.temperature,
      weather: weather.weather_description,
      airport: airport.name,
    };

    // Restituisce l'oggetto con i dati aggregati
    return dashboardData;
  } catch (error) {
    // Gestione degli errori: logga qualsiasi errore si verifichi durante l'esecuzione
    console.error(error);
  }
}

// Esegue la funzione con "london" come parametro di ricerca
getDashboardData("london")
  // Gestisce la risposta positiva
  .then((data) => {
    // Stampa l'oggetto dati completo
    console.log("Oggetto:", data);
    // Formatta e stampa un messaggio con tutte le informazioni
    console.log(
      `${data.city} is in ${data.country}.\n` +
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
        `The main airport is ${data.airport}.\n`
    );
  })
  // Gestisce eventuali errori durante l'esecuzione
  .catch((error) => console.error("An error occurred:", error));
