// Función para calcular la velocidad
function calcspeed() {
    if (extractedData.speed) {
      let speed = parseFloat(extractedData.speed);
      stats.speed = 10/(speed/100);
      console.log('Speed:', stats.speed);
      document.getElementById('speedf').innerHTML = 'Speed: ' + stats.speed.toFixed(2);
    } else {
      console.log('Not found');
    }
}

// Función para calcular la vida
function calcLife() {
    if (extractedData.life) {
        let life = parseFloat(extractedData.life);  
        let lifeF = (life * bonusstars * levelF * adjust) / 1000000;
        console.log('Life Calculado:', lifeF);
        document.getElementById('calculatedLife').innerHTML = 'Life: ' + lifeF.toFixed(0);
    } else {
        console.error('No se encontró el valor de vida en extractedData.');
    }
}

// Función para calcular el nivel
function calclevel() {
  if (level) {
    let leveli = parseFloat(level);
    levelF = parseFloat(100+10*(level-1));
  } else {
    console.log('Not found');
  }
}

// Calculando las estrellas
function calcbstars() {
  switch (star) {
    case 'platinum':
      bonusstars = 100 + stars.platinum;
      mainskin = "_platinum";
      break;
    case 'gold':
      bonusstars = 100 + stars.gold;
      mainskin = "_gold";
      break;
    case 'silver':
      bonusstars = 100 + stars.silver;
      mainskin = "_silver";
      break;
    case 'bronze':
      bonusstars = 100 + stars.bronze;
      mainskin = "_bronze";
      break;
    default:
      bonusstars = 100 + 0;
      mainskin = "";
      break;
  }
}

function calcatkp() {
  if (extractedData.atk1p && extractedData.atk2p) {
    let input1 = extractedData.atk1p
    let input2 = extractedData.atk2p
    
    // Utilizamos split y comprobamos si existe texto después del ":"
    let value1 = input1.split(':')[0].trim()  // Obtenemos solo el número
    let value2 = input2.split(':')[0].trim()  // Obtenemos solo el número
    
    // Parseamos los valores a float
    let atk1pi = parseFloat(value1)
    let atk2pi = parseFloat(value2)

    let abi = parseFloat(extractedData.ability)

    console.log(value1, value2) // Imprime los valores numéricos obtenidos

    // Realizamos los cálculos con los valores numéricos
    stats.atk1p = (atk1pi * bonusstars * levelF * adjust) / 1000000
    stats.atk2p = (atk2pi * bonusstars * levelF * adjust) / 1000000

    stats.ability = (stats.atk1p*(100 + abi)/100).toFixed(0)

    console.log('Atak1p:', stats.atk1p) // Imprime el resultado del cálculo de atk1p
    console.log('Atak2p:', stats.atk2p) // Imprime el resultado del cálculo de atk2p
    
    // Muestra el resultado en el HTML
    document.getElementById('calculatedatk').innerHTML =
      'atk1p: ' + stats.atk1p.toFixed(0) + 'ability: ' + stats.ability + '<br>' + 'atk2p: ' + stats.atk2p.toFixed(0)
  } else {
    console.error('No se encontraron los valores de atk1p y atk2p en extractedData.')
  }
}

function updateStarOptions(specimen) {
  const starsDropdown = document.getElementById("stars");

  // Limpiar opciones previas
  starsDropdown.innerHTML = `
    <option value="basic">No Stars</option>
    <option value="bronze">Bronze</option>
    <option value="silver">Silver</option>
    <option value="gold">Gold</option>
    <option value="platinum">Platinum</option>
  `;

  // Buscar en el archivo gacha.csv para añadir nuevas opciones
  fetch('data/gacha.csv')
    .then(response => response.text())
    .then(data => {
      Papa.parse(data, {
        complete: function(results) {
          const rows = results.data;

          // Buscar todas las coincidencias del Specimen en el CSV
          const uniqueOptions = new Set();

          for (let i = 1; i < rows.length; i++) {
            if (rows[i][0].includes(`Specimen_${specimen}`)) {
              const optionName = rows[i][3]?.trim(); // Suponiendo que la versión esté en la columna 3
              if (optionName) {
                uniqueOptions.add(optionName);
              }
            }
          }

          // Agregar opciones únicas encontradas al combobox
          uniqueOptions.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option.toLowerCase();
            optionElement.textContent = option;
            starsDropdown.appendChild(optionElement);
          });

          // Mostrar el combobox actualizado
          starsDropdown.style.display = "inline";
        },
        header: false,
        skipEmptyLines: true,
        delimiter: ';'
      });
    })
    .catch(error => console.error('Error al leer el archivo gacha.csv:', error));
}