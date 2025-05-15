function obtenerCambios(base = 'EUR', fecha = 'latest') {
    const API_URL = 'https://api.frankfurter.app';
    return fetch(`${API_URL}/${fecha}?base=${base}`)
        .then((respuesta) => respuesta.json())
        .then((respuesta) => respuesta.rates);    
}

function obtenerMonedas() {
    return obtenerCambios().then(resultado => Object.keys(resultado).concat('EUR'));
}

function mostrarMonedas(monedas) {
    const $selectMonedas = document.getElementById('monedas');
    $selectMonedas.innerHTML = '';

    monedas.sort().forEach(moneda => {
        const $opcion = document.createElement('option');
        $opcion.value = moneda;
        $opcion.textContent = moneda;
        $selectMonedas.appendChild($opcion);
    });
}

function configurarFecha() {
    const $fecha = document.querySelector('#fecha');
    const fechaMax = (new Date()).toISOString().split('T')[0];
    $fecha.setAttribute('max', fechaMax);
}

function obtenerMonedaSeleccionada() {
    const $monedaSeleccionada = document.getElementById('monedas').value;
    return $monedaSeleccionada || undefined;
}

function obtenerFechaSeleccionada() {
    const $fechaSeleccionada = document.querySelector('#fecha').value;
    return $fechaSeleccionada || undefined;
}

function conversion() {
    const $botonConvertir = document.getElementById('convertir');
    $botonConvertir.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarCartelCargando();
        obtenerCambios(obtenerMonedaSeleccionada(), obtenerFechaSeleccionada())
        .then((cambios) => {
            mostrarCambios(cambios);
        });
    }) 
}

function mostrarCartelCargando() {
    const $cartelCargando = document.querySelector('#resultado-conversion tbody');
    $cartelCargando.innerHTML = '<div class="cartel">Cargando...</div>';
}

// function ocultarCartelCargando() {
//     const $cartel = document.querySelector('.cartel');
//     if ($cartel) {
//         $cartel.remove();
//     }
// }

function mostrarCambios(cambios) {
    const $resultadoConversion = document.querySelector('#resultado-conversion tbody');
    $resultadoConversion.innerHTML = '';

    Object.keys(cambios).sort().forEach((moneda) => {
        const $fila = document.createElement('tr');
        const $moneda = document.createElement('td');
        const $cambio = document.createElement('td');
        $moneda.textContent = moneda;
        $cambio.textContent = cambios[moneda];
        $fila.appendChild($moneda);
        $fila.appendChild($cambio);
        $resultadoConversion.appendChild($fila);
    });

}

function inicializar() {
    configurarFecha();
    obtenerMonedas().then((monedas) => {
        mostrarMonedas(monedas);
    });
    conversion();
}

inicializar();