// Este array no se puede modificar
var posibilidades = ["piedra", "papel", "tijera"];

// —————————————————————————
// 1) Atamos los tres botones JUGAR, ¡YA! y RESET
// —————————————————————————
var botones = document.getElementsByTagName("button");
botones[0].addEventListener("click", introducirUsuario, false);  // ¡JUGAR!
botones[1].addEventListener("click", generarTirada, false);       // ¡YA!
botones[2].addEventListener("click", resetear, false);            // RESET

// —————————————————————————
// 2) Preparamos las imágenes del jugador
// —————————————————————————
var opciones = document.getElementsByTagName("img");
// las primeras 3 son jugador, la última es la máquina
for (var i = 0; i < opciones.length - 1; i++) {
  // les asigno id y ruta según “piedra”, “papel” o “tijera”
  opciones[i].id  = posibilidades[i];
  opciones[i].src = "img/" + posibilidades[i] + "Jugador.png";
  // al darles click, guardo cuál escoges
  opciones[i].addEventListener("click", seleccionaTiradaJugador, false);
}

// punto de partida
var nombre = "";

// —————————————————————————
// 3) Funciones de validación y comienzo de partida
// —————————————————————————
function comprobarNombre(n) {
  // más de 3 letras y no empiece con número
  return (n.length > 3 && isNaN(n[0]));
}

function introducirUsuario() {
  var inpNombre  = document.getElementsByTagName("input")[0];
  var inpPartida = document.getElementsByTagName("input")[1];

  // nombre ok?
  if (!comprobarNombre(inpNombre.value)) {
    inpNombre.classList.add("fondoRojo");
    return;
  }

  // partidas > 0?
  if (inpPartida.value <= 0) {
    inpNombre.classList.remove("fondoRojo");
    inpPartida.classList.add("fondoRojo");
    return;
  }

  // todo bien, guardo nombre, bloqueo campos y muestro total
  inpNombre.classList.remove("fondoRojo");
  inpPartida.classList.remove("fondoRojo");
  nombre = inpNombre.value;
  // Aquí actualizo el span “total” con el número de partidas introducido
  document.getElementById("total").innerHTML = inpPartida.value;
  // Y ahora desactivo ambos inputs para que no se puedan volver a tocar
  inpNombre.disabled  = true;
  inpPartida.disabled = true;
}

// —————————————————————————
// 4) Selección de la tirada del jugador
// —————————————————————————
function seleccionaTiradaJugador(e) {
  // marco la que has clicado
  e.target.classList.add("seleccionado");
  e.target.classList.remove("noSeleccionado");

  // y al resto le quito el “seleccionado”
  for (var j = 0; j < opciones.length - 1; j++) {
    if (opciones[j] !== e.target) {
      opciones[j].classList.remove("seleccionado");
      opciones[j].classList.add("noSeleccionado");
    }
  }
}

// —————————————————————————
// 5) Tirada aleatoria de la máquina y cálculo
// —————————————————————————
var maquina = opciones[opciones.length - 1]; // la última img del HTML

function valorAleatorio(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generarTirada() {
  var actual = document.getElementById("actual");
  var total  = document.getElementById("total");

  // solo si aún no llegamos al total
  if (Number(actual.innerHTML) < Number(total.innerHTML)) {
    // elijo jugada
    var tiradaMaquina = valorAleatorio(posibilidades);
    maquina.id  = tiradaMaquina;
    maquina.src = "img/" + tiradaMaquina + "Ordenador.png";

    // incremento contador
    actual.innerHTML = Number(actual.innerHTML) + 1;

    // calculo resultado y lo apunto en historial
    calcularResultado();
  }
}

function calcularResultado() {
  // averiguo qué seleccionó el jugador
  var seleccionado = "";
  for (var i = 0; i < opciones.length - 1; i++) {
    if (opciones[i].classList.contains("seleccionado")) {
      seleccionado = opciones[i].id;
    }
  }

  var idxJug  = posibilidades.indexOf(seleccionado);
  var idxMac  = posibilidades.indexOf(maquina.id);
  var historial = document.getElementById("historial");

  // lógica circular: piedra(0) vence a tijera(2), i gana a i-1
  if ((idxMac === (idxJug + 1) % posibilidades.length)) {
    // máquina vence
    historial.innerHTML += "<li>Gana la máquina</li>";
  }
  else if (idxMac === idxJug) {
    // empate
    historial.innerHTML += "<li>Empate</li>";
  }
  else {
    // jugador vence
    historial.innerHTML += "<li>Gana " + nombre + "</li>";
  }
}

// —————————————————————————
// 6) Reset para empezar de nuevo
// —————————————————————————
function resetear() {
  // reactivo campos y pongo todo a cero
  var inpNombre  = document.getElementsByTagName("input")[0];
  var inpPartida = document.getElementsByTagName("input")[1];
  inpNombre.disabled  = false;
  inpPartida.disabled = false;
  inpPartida.value    = 0;
  document.getElementById("total").innerHTML  = "0";
  document.getElementById("actual").innerHTML = "0";

  // quito clases y dejo la primera img “seleccionada” de nuevo
  for (var j = 0; j < opciones.length - 1; j++) {
    opciones[j].classList.remove("seleccionado", "noSeleccionado");
  }
  opciones[0].classList.add("seleccionado");

  // devuelvo imagen máquina a la por defecto
  maquina.src = "img/defecto.png";

  // y añado entrada al historial
  document.getElementById("historial")
          .innerHTML += "<li>Nueva partida</li>";
}
