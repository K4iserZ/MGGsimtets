let extractedData = {} //general key
let adjust = 100;
let typeLink, star, level, levelF;
let bonusstars;

let stars = {
  platinum: 100,
  gold: 75,
  silver: 30,
  bronze: 10
}

let stats = {
  life: 0,
  speed: 0,
  atk1p: 0,
  atk2p: 0,
  ability: 0
}

let category = {
  LEGEND: "https://s-ak.kobojo.com/mutants/assets/mobile/hud/m_m_m/icon_legend.png",
  HEROIC: "https://s-ak.kobojo.com/mutants/assets/mobile/hud/m_m_m/icon_heroic.png",
  RECIPE: "https://s-ak.kobojo.com/mutants/assets/mobile/hud/m_m_m/icon_recipe.png"
};

// Evento para ejecutar la búsqueda cuando el formulario se envía
document
  .getElementById('searchform')
  .addEventListener('submit', function (event) {
    event.preventDefault() // Evita la recarga de la página
    searchCSV() // Llama a la función de búsqueda
  })

// Función para buscar en el CSV
function searchCSV() {
  // Obtenemos los valores de los campos del formulario
  level = document.querySelector('input[name="Level"]').value.trim()
  const specimen = document.querySelector('input[name="Specimen"]').value.trim()
  const name = document.querySelector('input[name="Mutant"]').value.trim()
  star = document.getElementById('stars').value;

  calcbstars()

  if (!specimen) {
    alert('Por favor ingrese un código de Specimen.')
    return
  }

  fetch('data/sts25.csv')
    .then((response) => response.text()) // Convierte la respuesta en texto
    .then((data) => {
      const rows = data.split('\n').map((row) => row.split(';')) // Divide en filas y columnas
      const headers = rows[0] // Extrae encabezados (primera fila)

      let resultRow = null
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0].trim() === specimen) {
          // Suponiendo que "Specimen" está en la primera columna
          resultRow = rows[i]
          break
        }
       
      }

      const resultsDiv = document.getElementById('results')
      if (resultRow) {
        // Almacenar solo las columnas que nos interesan
        extractedData = {
          code: resultRow[0]?.trim(), //Code
          name: resultRow[1]?.trim(), // Name
          speed: resultRow[2]?.trim(), // Speed
          life: resultRow[5]?.trim(), // Life
          atk1p: resultRow[8]?.trim(), // atk1p
          atk2p: resultRow[10]?.trim(), // atk2p
          type: resultRow[13]?.trim(), // type
        }

        // Extraemos y procesamos la información del Specimen
        let dna = extractedData.code.split('Specimen_')[1]
        dna = dna.toLowerCase()

        // URL de la imagen con la interpolación correcta
        let imagepath = `https://s-ak.kobojo.com/mutants/assets/thumbnails/specimen_${dna}.png`

        console.log('Datos Extraídos:', extractedData) // Ver en consola

        //Icon show
        iconLink = category[extractedData.type] || "https://s-ak.kobojo.com/mutants/assets/mobile/hud/m_m_m/mutopedia/icon_mutopedia.png";


        // Mostrar los resultados y la imagen
        resultsDiv.innerHTML = `
                    <p><strong>Imagen:</strong> <img src="${imagepath}" alt="Specimen Image" /></p>
                    <p><strong>Imagen:</strong> <img src="${iconLink}" alt="Type" /></p>
                    <p><strong>Name:</strong> ${extractedData.name}</p>
                `
                /*<p><strong>Speed:</strong> ${extractedData.speed}</p>
                  <p><strong>Life:</strong> ${extractedData.life}</p>*/

                calclevel()
                calcLife()
                calcspeed()

      } else {
        resultsDiv.innerHTML = '<p>No se encontró el Specimen.</p>'
      }
    })
    .catch((error) => console.error('Error al leer el archivo CSV:', error))
}

function calcspeed(){
    if (extractedData.speed) {
      let speed = parseFloat(extractedData.speed);
      stats.speed = 10/(speed/100);
      console.log('Speed:', stats.speed);
      document.getElementById('speedf').innerHTML = 'Speed: ' + stats.speed.toFixed(2);
    } else {
      console.log('Not found');
    }
}

function calclevel(){
  if (level) {
    let leveli = parseFloat(level);
    levelF = parseFloat(100+10*(level-1));
    /*console.log('Nivel:', leveli);
    document.getElementById('level').innerHTML = 'Level: ' + levelF;*/
  } else {
    console.log('Not found');
  }
}

function calcbstars(){
  switch (star) {
    case 'platinum':
      // Si es platinum, multiplicamos por un número específico
      bonusstars = 100 + stars.platinum; // Aquí puedes reemplazar 10 por el número que quieras
      console.log('Platinum: El valor multiplicado es', bonusstars);
      break;
      
    case 'gold':
      // Si es gold, multiplicamos por 50
      bonusstars = 100 + stars.gold;
      console.log('Gold: El valor multiplicado es', bonusstars);
      break;
      
    case 'silver':
      // Si es silver, multiplicamos por 30
      bonusstars = 100 + stars.silver;
      console.log('Silver: El valor multiplicado es', bonusstars);
      break;
      
    case 'bronze':
      // Si es bronze, multiplicamos por 10
      bonusstars = 100 + stars.bronze;
      console.log('Bronze: El valor multiplicado es', bonusstars);
      break;
      
    default:
      // Si el valor no es ninguno de los anteriores
      console.log('Valor no reconocido para star:', star);
      bonusstars = 0; // Puedes asignar un valor por defecto si no se encuentra en el switch
      break;
  }
}

function calcLife() {
    if (extractedData.life) {
        let life = parseFloat(extractedData.life);  // Extrae y convierte el valor de vida
        let lifeF = (life * bonusstars * levelF * adjust) / 1000000;  // Realiza el cálculo con el valor de vida
        console.log('Life Calculado:', lifeF);  // Puedes imprimirlo para ver el resultado en consola
        document.getElementById('calculatedLife').innerHTML = 'Life: ' + lifeF.toFixed(0);
    } else {
        console.error('No se encontró el valor de vida en extractedData.');
    }
}