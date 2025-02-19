let extractedData = {} //general key
let adjust = 100
let typeLink, star, level, levelF
let bonusstars, mainskin, geneValue
let gene1, gene2

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
  star = document.getElementById('stars').value

  calcbstars()

  if (!specimen) {
    alert('Insert a valid code for Specimen')
    return
  }

  fetch('data/sts25.csv')
    .then((response) => response.text()) // Convierte la respuesta en texto
    .then((data) => {
      // Usamos PapaParse para convertir el CSV en objetos
      Papa.parse(data, {
        complete: function (results) {
          const rows = results.data

          let resultRow = null
          for (let i = 1; i < rows.length; i++) {
            if (rows[i][0].trim() === 'Specimen_' + specimen) {
              resultRow = rows[i]
              break
            }
          }

          const resultsDiv = document.getElementById('results')
          if (resultRow) {
            // Almacenar solo las columnas que nos interesan
            extractedData = {
              code: resultRow[0]?.trim(), // Code
              name: resultRow[1]?.trim(), // Name
              speed: resultRow[2]?.trim(), // Speed
              dna: resultRow[4]?.trim(), // dna
              life: resultRow[5]?.trim(), // Life
              atk1p: resultRow[8]?.trim(), // atk1p
              atk2p: resultRow[10]?.trim(), // atk2p
              type: resultRow[13]?.trim(), // Type (LEGEND, HEROIC, RECIPE, etc.)
              ability: resultRow[17]?.trim(),
            }

            document.querySelector('input[name="Level"]').disabled = true
            document.querySelector('input[name="Specimen"]').disabled = true

            document.getElementById('new-search-btn').style.display =
              'inline-block'

            // Extraemos y procesamos la información del Specimen
            let dna = extractedData.code.split('Specimen_')[1]
            dna = dna.toLowerCase()

            // URL de la imagen con la interpolación correcta
            let imagepath = `https://s-ak.kobojo.com/mutants/assets/thumbnails/specimen_${dna}${mainskin}.png`

            console.log('Extracted Data:', extractedData) // Ver en consola

            // Icono según el tipo del specimen
            iconLink =
              category[extractedData.type] ||
              'https://s-ak.kobojo.com/mutants/assets/mobile/hud/m_m_m/mutopedia/icon_mutopedia.png'

            // Mostrar los resultados y la imagen
            resultsDiv.innerHTML = `
                <p><strong>Picture:</strong> <img src="${imagepath}" alt="Specimen Image" /></p>
                <p><strong>Type:</strong> <img src="${iconLink}" alt="Type Icon" /></p>
                <p><strong>Name:</strong> ${extractedData.name}</p>
                <p><strong>Level:</strong> ${level}</p>
              `

            // Aquí comenzamos a verificar si el specimen tiene versiones
            const starsDropdown = document.getElementById('stars')

            // Si el tipo de specimen es uno de los que no tiene versiones adicionales (como "CAPTAINPEACE", "GAMES", "SEASONAL")
            const noVersionTypes = ['CAPTAINPEACE', 'GAMES', 'SEASONAL']
            if (noVersionTypes.includes(extractedData.type)) {
              starsDropdown.style.display = 'none' // Ocultamos el selector de estrellas
            } else {
              starsDropdown.style.display = 'inline' // Mostramos el selector de estrellas
            }

            if (noVersionTypes.includes(extractedData.type)) {
              starsDropdown.value = 'basic' // Seleccionamos la opción "No Stars" por defecto
            }

            // Funciones
            calclevel()
            calcLife()
            getGeneImages(extractedData.dna)
            calcatkp()
            calcspeed()
          } else {
            resultsDiv.innerHTML = '<p>Specimen not found</p>'
          }
        },
        header: false, // No utilizamos la primera fila como encabezado (headers)
        skipEmptyLines: true, // Ignoramos las líneas vacías
        delimiter: ';', // Establecemos el delimitador como punto y coma
      })
    })
    .catch((error) => console.error('Error read file CSV:', error))
}

function resetSearch() {
  // Desbloquear los campos para permitir nuevas modificaciones
  document.querySelector('input[name="Level"]').disabled = false
  document.querySelector('input[name="Specimen"]').disabled = false
  document.getElementById('stars').disabled = false

  // Limpiar los campos y resultados previos
  document.querySelector('input[name="Level"]').value = ''
  document.querySelector('input[name="Specimen"]').value = ''
  document.querySelector('input[name="Mutant"]').value = ''
  document.getElementById('stars').value = 'basic' // Resetear a "No Stars"
  document.getElementById('stars').style.display = 'none'
  document.getElementById('results').innerHTML = '' // Limpiar los resultados

  // Ocultar el botón de nueva búsqueda y volver a mostrar los campos
  document.getElementById('new-search-btn').style.display = 'none'
}

// Luego, en el evento del botón "Nueva búsqueda", solo llamas a la función
document.getElementById('new-search-btn').addEventListener('click', resetSearch)

function calcspeed() {
  if (extractedData.speed) {
    let speed = parseFloat(extractedData.speed)
    stats.speed = 10 / (speed / 100)
    //console.log('Speed:', stats.speed)
    let contspeed = `
      <img src="${
        iconstats.speed
      }" alt="Speed Icon" style="width: 30px; height: 30px; margin-right: 10px;">
      ${stats.speed.toFixed(2)}
    `

    // Actualiza el HTML con el contenido generado
    document.getElementById('speedf').innerHTML = contspeed
  } else {
    console.log('Not found')
  }
}

function calclevel() {
  if (level) {
    let leveli = parseFloat(level)
    levelF = parseFloat(100 + 10 * (leveli - 1))
    /*console.log('Nivel:', leveli);
    document.getElementById('level').innerHTML = 'Level: ' + levelF;*/
  } else {
    console.log('Not found')
  }
}

function calcbstars() {
  switch (star) {
    case 'platinum':
      // Si es platinum, multiplicamos por un número específico
      bonusstars = 100 + stars.platinum // Aquí puedes reemplazar 10 por el número que quieras
      mainskin = '_platinum'
      //console.log('Platinum: El valor multiplicado es', bonusstars)
      break

    case 'gold':
      // Si es gold, multiplicamos por 50
      bonusstars = 100 + stars.gold
      mainskin = '_gold'
      //console.log('Gold: El valor multiplicado es', bonusstars)
      break

    case 'silver':
      // Si es silver, multiplicamos por 30
      bonusstars = 100 + stars.silver
      mainskin = '_silver'
      //console.log('Silver: El valor multiplicado es', bonusstars)
      break

    case 'bronze':
      // Si es bronze, multiplicamos por 10
      bonusstars = 100 + stars.bronze
      mainskin = '_bronze'
      //console.log('Bronze: El valor multiplicado es', bonusstars)
      break

    default:
      // Si el valor no es ninguno de los anteriores
      //console.log('Valor no reconocido para star:', star)
      bonusstars = 100 + 0 // Puedes asignar un valor por defecto si no se encuentra en el switch
      mainskin = ''
      break
  }
}

function calcLife() {
  if (extractedData.life) {
    let life = parseFloat(extractedData.life) // Extrae y convierte el valor de vida
    stats.life = (life * bonusstars * levelF * adjust) / 1000000 // Realiza el cálculo con el valor de vida
    console.log('Life Calculado:', stats.life) // Puedes imprimirlo para ver el resultado en consola

    let conthp = `
    <img src="${
      iconstats.hp
    }" alt="Hp Icon" style="width: 30px; height: 30px; margin-right: 10px;">
    ${stats.life.toFixed(0)}
  `
    document.getElementById('calculatedLife').innerHTML = conthp
  } else {
    console.error('No se encontró el valor de vida en extractedData.')
  }
}

/*  let geneValue = extractedData.dna

  for (let i = 0; i < geneValue.length; i++) {
    const caracter = geneValue[i];  // Extraer el carácter

    // Crear un elemento de imagen
    const img = document.createElement('img');

    // Establecer la fuente de la imagen usando el objeto gene
    img.src = gene[caracter];  // Obtener la URL de la imagen desde el objeto gene
    img.alt = `Imagen de ${caracter}`;
}*/

// Función para obtener imágenes de genes
function getGeneImages(inputdna) {
  if (!inputdna) return { gene1: gene.all, gene2: gene.all }

  let chars = inputdna.split('') // Separa la cadena en caracteres
  let gene1 = chars[0] || 'all' // Primer carácter
  let gene2 = chars[1] || 'all' // Segundo carácter

  return {
    gene1: gene[gene1] || gene['all'],
    gene2: gene[gene2] || gene['all'],
  }
}

function calcatkp() {
  if (extractedData.atk1p && extractedData.atk2p) {
    let input1 = extractedData.atk1p
    let input2 = extractedData.atk2p

    let value1 = input1.split(':')[0].trim() // Obtenemos solo el número
    let value2 = input2.split(':')[0].trim() // Obtenemos solo el número

    let atk1pi = parseFloat(value1)
    let atk2pi = parseFloat(value2)

    let abi = parseFloat(extractedData.ability)

    stats.atk1p = (atk1pi * bonusstars * levelF * adjust) / 1000000
    stats.atk2p = (atk2pi * bonusstars * levelF * adjust) / 1000000

    stats.ability = ((stats.atk1p * (100 + abi)) / 100).toFixed(0)

    let genes = getGeneImages(extractedData.dna)
    document.getElementById('calculatedatk').innerHTML = `
  <div>
    <img src="${genes.gene1}" alt="Gene1" width="30"> 
    <span>atk1p: ${stats.atk1p.toFixed(0)}</span>
    <br>
    <span>ability: ${stats.ability}</span>
    <br>
    <img src="${genes.gene2}" alt="Gene2" width="30"> 
    <span>atk2p: ${stats.atk2p.toFixed(0)}</span>
  </div>
`
  } else {
    console.error('No data of atk1p or atk2p.')
  }
}
