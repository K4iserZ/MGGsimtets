<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $lvl = $_POST['Level'];
    $specimen = $_POST['Specimen'];
    $name = $_POST['Mutant'];

    // Ruta del archivo CSV
    $file = "../data/sts25.csv"; 

    // Comprobamos si el archivo CSV existe
    if (file_exists($file)) {
        // Abrimos el archivo CSV
        $data = fopen($file, "r");

        // Leemos el encabezado (opcional, si deseas ignorarlo)
        $encabezado = fgetcsv($data, 1000, ";");  // Especificamos el delimitador ";"

        // Inicializamos una bandera para saber si encontramos la fila
        $encontrado = false;

        // Recorremos las filas del archivo CSV
        while (($fila = fgetcsv($data, 1000, ";")) !== false) {  // También especificamos el delimitador aquí
            // Comprobamos si el dato2 (specimen) coincide con el valor buscado
            if ($fila[1] == $specimen) {
                // Si encontramos la fila, mostramos los datos
                echo "Fila encontrada:<br>";
                echo "Dato 1: " . $fila[0] . "<br>";
                echo "Dato 2: " . $fila[1] . "<br>";
                echo "Dato 3: " . $fila[2] . "<br>";
                $encontrado = true;
                break; // Terminamos el bucle después de encontrar la fila
            }
        }

        // Si no encontramos la fila, mostramos un mensaje
        if (!$encontrado) {
            echo "No se encontró ninguna fila con el dato2 '$specimen'.";
        }

        // Cerramos el archivo CSV
        fclose($data);
    } else {
        echo "El archivo CSV no existe.";
    }
}
?>