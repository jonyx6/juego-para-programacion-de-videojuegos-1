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
// pertenece al utils del profe, es para que funcione los nuevos archivos(vectorfield,mousemanager,grid,cell)
function normalizeVector(vector) {
  // Calcula la magnitud del vector
  const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  // Si la magnitud es 0, devuelve el vector original (o maneja el caso de magnitud cero de otra manera)
  if (magnitude === 0) {
    return vector;
  }

  // Divide cada componente del vector por la magnitud
  return {
    x: vector.x / magnitude,
    y: vector.y / magnitude,
  };
}
function randomGaussBounded(media, dispersion) {
  let min = media - dispersion;
  let max = media + dispersion;
  let z;

  do {
    let u = Math.random();
    let v = Math.random();
    z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v); // z ~ N(0, 1)
  } while (z < -3 || z > 3); // Limita a ±3 desviaciones estándar

  // Escala de [-3, 3] a [min, max]
  let t = (z + 3) / 6; // Normaliza a [0,1]
  return min + t * (max - min);
}

function generateRandomID(length = 8) {
  // Conjunto de caracteres alfanuméricos (mayúsculas, minúsculas y dígitos)
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  // Genera un ID al azar
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

function limitMagnitude(vector, maxMagnitude) {
  // Calcular la magnitud actual del vector
  const currentMagnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  // Si la magnitud actual es mayor que la máxima permitida, limitar el vector
  if (currentMagnitude > maxMagnitude) {
    const scale = maxMagnitude / currentMagnitude;
    vector.x *= scale;
    vector.y *= scale;
  }

  return vector;
}

function distancia(obj1, obj2) {
  return Math.sqrt((obj1.x - obj2.x) ** 2 + (obj1.y - obj2.y) ** 2);
}

function lerp(a, b, t) {
  // Asegúrate de que t esté en el rango [0, 1]
  t = Math.max(0, Math.min(1, t));

  return a + (b - a) * t;
}
