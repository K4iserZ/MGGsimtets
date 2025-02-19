// Evento para ejecutar la búsqueda cuando el formulario se envía
document
  .getElementById('searchform')
  .addEventListener('submit', function (event) {
    event.preventDefault() // Evita la recarga de la página
    searchCSV() // Llama a la función de búsqueda
  })

// Función para buscar en el CSV
function searchCSV() {
    level = document.querySelector('input[name="Level"]').value.trim();
    const specimen = document.querySelector('input[name="Specimen"]').value.trim();
    const name = document.querySelector('input[name="Mutant"]').value.trim();
    star = document.getElementById('stars').value;

    calcbstars();

    if (!specimen) {
        alert('Por favor ingrese un código de Specimen.');
        return;
    }

    fetch('data/sts25.csv')
      .then((response) => response.text())
      .then((data) => {
        Papa.parse(data, {
          complete: function(results) {
            const rows = results.data;
            let resultRow = null;
            for (let i = 1; i < rows.length; i++) {
              if (rows[i][0].trim() === `Specimen_${specimen}`) {
                resultRow = rows[i];
                break;
              }
            }

            const resultsDiv = document.getElementById('results');
            if (resultRow) {
              extractedData = {
                code: resultRow[0]?.trim(),
                name: resultRow[1]?.trim(),
                speed: resultRow[2]?.trim(),
                life: resultRow[5]?.trim(),
                atk1p: resultRow[8]?.trim(),
                atk2p: resultRow[10]?.trim(),
                type: resultRow[13]?.trim(),
              };

              let dna = extractedData.code.split('Specimen_')[1];
              dna = dna.toLowerCase();
              let imagepath = `https://s-ak.kobojo.com/mutants/assets/thumbnails/specimen_${dna}${mainskin}.png`;

              console.log('Datos Extraídos:', extractedData);

              iconLink = category[extractedData.type] || "https://s-ak.kobojo.com/mutants/assets/mobile/hud/m_m_m/mutopedia/icon_mutopedia.png";

              resultsDiv.innerHTML = `
                <p><strong>Imagen:</strong> <img src="${imagepath}" alt="Specimen Image" /></p>
                <p><strong>Tipo:</strong> <img src="${iconLink}" alt="Type Icon" /></p>
                <p><strong>Name:</strong> ${extractedData.name}</p>
                <p><strong>Level:</strong> ${level}</p>
                <p><strong>Speed:</strong> ${extractedData.speed}</p>
                <p><strong>Life:</strong> ${extractedData.life}</p>
              `;

              const starsDropdown = document.getElementById("stars");
              const noVersionTypes = ["CAPTAINPEACE", "GAMES", "SEASONAL"];
              if (noVersionTypes.includes(extractedData.type)) {
                starsDropdown.style.display = "none";
              } else {
                starsDropdown.style.display = "inline";
              }

              calclevel();
              calcLife();
              calcspeed();
            } else {
              resultsDiv.innerHTML = '<p>No se encontró el Specimen.</p>';
            }
          },
          header: false,
          skipEmptyLines: true,
          delimiter: ';'
        });
      })
      .catch((error) => console.error('Error al leer el archivo CSV:', error));
}
