function generarCodigo(tope = 999999999) {
    return Math.floor(Math.random() * tope);
}

const TIEMPO = 40;
const pitidoBomba = new Audio("./SFX/BombBeep.mp3");
const musicaDeFondo = new Audio("./SFX/BackgroundMusic.mp3");
const sonidoExplosion = new Audio("./SFX/Explosion.mp3");
const controlPartida = document.getElementById("controlPartida");
const luz = document.getElementsByClassName("luz")[0];

var codigo = generarCodigo();
var tiempoRestante;
var completado;

window.onload = (ev) => {
    let directorioIMG = "./IMG/";
    let fondos = [directorioIMG + "A_Floor.jpg", directorioIMG + "A_Site.jpg", directorioIMG + "B_Floor.jpg", directorioIMG + "B_Site.jpg"]
    let fondo = fondos[Math.floor(Math.random() * fondos.length)];
    document.body.style.backgroundImage = "url('" + fondo + "')"
}


const cambiarTonoLuz = () => {
    let brillando = luz.style.background === "red";
    luz.style.background = (brillando ? "#460F0FFF" : "red");
};

function bajarTiempo() {
    if (tiempoRestante % 5 === 0 && tiempoRestante !== TIEMPO) {
        console.log("Long. Codigo " + codigo.toString().length)
        let longitudAdivinada = document.getElementById("respuesta").innerText.length;
        let numero = "";
        for (let i = 0; i < (codigo.toString().length - longitudAdivinada); i++) {
            numero += "9";
        }
        console.log("Long valor: " + numero.length)
        console.log("Divisible de 5")
        numero = parseInt(numero);
        let nuevosValores = generarCodigo(numero);
        console.log(nuevosValores)
        codigo = parseInt(document.getElementById("respuesta").innerText + nuevosValores);
        console.log(codigo)
        document.getElementById("codigo").innerText = codigo;
    }
    pitidoBomba.currentTime = 0;
    pitidoBomba.play();
    setTimeout(cambiarTonoLuz, 500);
    tiempoRestante--;
    document.getElementById("tiempo").innerText = tiempoRestante;
    setTimeout(cambiarTonoLuz, 1000);
    if (tiempoRestante <= 0) terminarPartida();
    else if (!completado) setTimeout(bajarTiempo, 1000);

}

document.addEventListener("keypress", (event) => {
    let tecla = event.key;
    console.log(tecla)
    if (tecla.match(/^\d$/)) {
        pulsar(event.key)
    }
});

function pulsar(numero) {
    if (!completado) {
        document.getElementById("respuesta").innerText += numero;
        comprobarResultado(document.getElementById("respuesta").innerText);
    }

}

function comprobarResultado(comprobacion) {
    var objetivo = document.getElementById("codigo").innerText.substring(0, comprobacion.length);
    console.log(objetivo);

    if (comprobacion !== objetivo) terminarPartida(true);
    else if (document.getElementById("codigo").innerText === comprobacion) {
        terminarPartida(false);
    }

}

function terminarPartida(partidaPerdida) {
    completado = true;
    musicaDeFondo.pause();
    musicaDeFondo.currentTime = 0;
    if (partidaPerdida) {
        sonidoExplosion.volume = 0.07;
        sonidoExplosion.currentTime = 0;
        sonidoExplosion.play();
        setTimeout(window.close, 2000)
    } else {
        controlPartida.style.display = "block";
    }
    // alert("Explotar");
    let anuncio = new Audio((partidaPerdida ? "./SFX/TWin.mp3" : "./SFX/CTWin.mp3"));
    anuncio.currentTime = 0;
    anuncio.volume = 0.1;
    anuncio.play();
}

const empezarPartida = () => {
    musicaDeFondo.volume = 0.05;
    musicaDeFondo.currentTime = 0;
    musicaDeFondo.play();
    codigo = generarCodigo();
    document.getElementById("codigo").innerText = codigo;
    document.getElementById("tiempo").innerText = TIEMPO;
    document.getElementById("respuesta").innerText = "";
    tiempoRestante = TIEMPO;
    completado = false;
    bajarTiempo();
    // Los navegadores no les gusta que haya autoplay al cargar la página
    controlPartida.style.display = "none";
}