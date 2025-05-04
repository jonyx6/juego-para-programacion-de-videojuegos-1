function colision(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const distancia = Math.sqrt(dx * dx + dy * dy);
    return distancia < 30; // Podés ajustar este valor según el tamaño de tus sprites
}

function crearCaballerosAzules(cantidad, array, app, juego) {
    for (let i = 0; i < cantidad; i++) {
        array.push(new CaballeroAzul(Math.random() * 500, Math.random() * 500, app, i, juego));
        //"push()"carga en el array los personajes 10 veces
    }
}

function crearCaballerosRojos(cantidad, array, app, juego) {
    for (let i = 0; i < cantidad; i++) {
        array.push(new CaballeroRojo(Math.random() * 500, Math.random() * 500, app, i, juego));
        //"push()"carga en el array los personajes 10 veces
    }
}

function hacerDamageA(personaje){
    personaje.vida -=1
}
/*
function morir2(personaje, array) {
    if (personaje.vida <= 0) {
        const index = array.indexOf(personaje);
        if (index !== -1) {
            array.splice(index, 1);
            personaje.container.destroy();
        }
    }
}*/
/*
function morir2(personaje, array) {
    if (personaje.vida <= 0) {
        // Reproducir la animación de muerte        
        personaje.cambiarEstado('digArribaMuerte');
        //personaje.sprite.textures = personaje.animaciones['digArribaMuerte'];
        personaje.sprite.loop = true;
        //personaje.sprite.play();
        personaje.sprite.gotoAndPlay(0);
        
        // Esperar 2 segundos antes de eliminar el personaje
        setTimeout(() => {
            // Eliminar el personaje del array y destruir el contenedor después del retraso
            const index = array.indexOf(personaje);
            if (index !== -1) {
                array.splice(index, 1);
                personaje.container.destroy();
            }
        }, 2000); // 2000 milisegundos = 2 segundos
    }
}*/

function morir2(personaje, array) {
    if (personaje.vida <= 0) {
        // Detener cualquier animación actual que pueda estar reproduciéndose
        personaje.sprite.stop();
        
        // Cambiar al estado de muerte
        personaje.sprite.textures = personaje.animaciones['digArribaMuerte'];
        //personaje.cambiarEstado('digArribaMuerte');
        
        // Asegurarse de que las texturas correctas estén asignadas (descomenta si es necesario)
        // personaje.sprite.textures = personaje.animaciones['digArribaMuerte'];
        
        // Configurar la animación para que se reproduzca una vez (no en loop)
        personaje.sprite.loop = false;
        
        // Asegurarse de que la animación comienza desde el principio
        //personaje.sprite.gotoAndPlay(0);
        
        // Iniciar la animación
        personaje.sprite.play();
        

        console.log("Iniciando animación de muerte");
        
        // Esperar a que termine la animación antes de eliminar el personaje
        setTimeout(() => {
            const index = array.indexOf(personaje);
            if (index !== -1) {
                console.log("Eliminando personaje");
                array.splice(index, 1);
                personaje.container.destroy();
            }
        }, 2000);
    }
}
/*
function crearUnCaballeroRojo(array, app, juego) {
    let i = 0
    array = new CaballeroRojo(500,500, app, i, juego);
}*/

function verSihayEnemigoCerca(personaje,enemigo){}
function acercarceAlEnemigo(personaje,enemigo){}
function atacarEnemigo(personaje,enemigo){}
function moverseAlLugar(x,y){}
function defender(x,y){}
function volverAlLugar(x,y){}
function crear(personaje){}


//--------------------------------------------------------------------------------viejos---
/* //////morir(this, this.juego.chaboncitos, this.container);
function morir(personaje, array, container) {
    const index = array.indexOf(personaje);
    if (index !== -1) {
        array.splice(index, 1);
        container.destroy();
    }
}*/
//       morir2(this, this.juego.chaboncitos);

/*
function recibirDamage(personaje){
    personaje.vida -=1
    if (personaje.vida <= 0) {
        morir(personaje, personaje.juego.chaboncitos, personaje.container);
    }
}*/