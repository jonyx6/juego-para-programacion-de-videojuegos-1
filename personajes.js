class Personaje {
  constructor(x, y, app, i, juego) {
    this.app = app;
    this.juego = juego;
    this.i = i;

    this.x = x;
    this.y = y;
    this.vida = 5;
    this.velocidad = 3;
    this.listo = false;

    this.estadoActual = 'idle';
    this.animaciones = {};
    this.camino = [];

    this.crearContainer();
    //this.crearTextoVida();
    this.atacando = false;
    this.objetivoAtaque = null;
    //this.destinoFijado = null; // { x, y }

    this.distanciaMinima = 25;

  }

  // === Inicialización ===
  crearContainer() {
    this.container = new PIXI.Container();
    this.juego.containerPrincipal.addChild(this.container);
  }

  crearTextoVida() {
    this.textoVida = new PIXI.Text('', {
      fontSize: 16,
      fill: '#ffffff',
    });
    this.textoVida.anchor.set(0, 1);
    this.app.stage.addChild(this.textoVida);
  }

  // === Ciclo de vida ===
  update() {
    if (!this.listo) return;

    this.actualizarMovimiento();
    this.evitarSuperposicion();
    this.actualizarSprite();
    //this.actualizarTextoVida();
    this.cambiarOrdenEnZ();
    //this.limitarAlMapa();

    // Si tiene enemigos definidos, luchar
    if (this.enemigos) {
      const enemigos = typeof this.enemigos === 'function'
        ? this.enemigos()
        : this.enemigos;

      this.lucharContra(enemigos);
    }
  }

  // === Movimiento ===
  actualizarMovimiento() {
    if (this.camino.length === 0) {
      this.cambiarEstado('idle');
      return;
    }

    const objetivo = this.camino[0];
    const dx = objetivo.centerX - this.x;
    const dy = objetivo.centerY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist < this.velocidad) {
      this.x = objetivo.centerX;
      this.y = objetivo.centerY;
      this.camino.shift();
    } else {
      const dirX = dx / dist;
      const dirY = dy / dist;
      this.x += dirX * this.velocidad;
      this.y += dirY * this.velocidad;
      this.manejarAnimacion(dirX, dirY);
      this.orientarSprite(dirX);
    }
  }

  irA(destX, destY) {
    const origen = this.juego.grid.getCellAt(this.x, this.y);
    const destino = this.juego.grid.getCellAt(destX, destY);
    if (origen && destino) {
      this.camino = this.juego.grid.calcularCaminoDesdeHasta(origen, destino);
    }
  }

  irA_v2(destX, destY) {
    const origen = this.juego.grid.getCellAt(this.x, this.y);
    const destino = this.juego.grid.getCellAt(destX, destY);

    if (origen && destino) {
      this.destinoFijado = { x: destX, y: destY }; // ← Guardamos destino
      this.camino = this.juego.grid.calcularCaminoDesdeHasta(origen, destino);
    }
  }


  // === Apariencia ===
  actualizarSprite() {
    if (this.sprite) {
      this.sprite.x = this.x;
      this.sprite.y = this.y;
    }
  }

  cambiarEstado(nuevoEstado) {
    if (this.estadoActual === nuevoEstado || !this.animaciones[nuevoEstado]) return;
    this.estadoActual = nuevoEstado;
    this.sprite.textures = this.animaciones[nuevoEstado];
    this.sprite.play();
  }

  manejarAnimacion(vx, vy) {
    if (vx !== 0 && vy === 0) this.cambiarEstado('deLadoMov');
    else if (vx === 0 && vy > 0) this.cambiarEstado('abajoMov');
    else if (vx === 0 && vy < 0) this.cambiarEstado('arribaMov');
    else if (vx !== 0 && vy > 0) this.cambiarEstado('digAbajoMov');
    else if (vx !== 0 && vy < 0) this.cambiarEstado('digArribaMov');
  }

  orientarSprite(vx) {
    if (!this.sprite) return;
    this.sprite.scale.x = vx >= 0 ? 1 : -1;
  }

  // === Información/UI ===
  actualizarTextoVida() {
    this.textoVida.text = `${this.constructor.name}\nVida: ${this.vida}`;
    this.textoVida.x = 200;
    this.textoVida.y = this.app.screen.height - 10;
  }

  setSeleccionado(estado) {
    if (this.sprite) {
      this.sprite.tint = estado ? 0xff0000 : 0xFFFFFF;
    }
  }

  // === Utilidades ===
  cambiarOrdenEnZ() {
    this.container.zIndex = this.y + 100;
  }

  limitarAlMapa() {
    const maxX = this.juego.ancho * 2;
    const maxY = this.juego.alto * 2;

    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  /**
   * Busca un enemigo cercano dentro del array y ataca si lo encuentra.
   * @param {Array<Personaje>} enemigos - Lista de enemigos a considerar.
   */
  lucharContra(enemigos) {
    if (this.atacando || enemigos.length === 0) return;

    const RANGO_ATAQUE = 40;

    for (const enemigo of enemigos) {
      if (!enemigo || enemigo.vida <= 0) continue;

      const d = distancia(this, enemigo);
      if (d < RANGO_ATAQUE) {
        this.camino = []; // Detener movimiento
        this.objetivoAtaque = enemigo;
        this.atacando = true;

        const dx = enemigo.x - this.x;
        const dy = enemigo.y - this.y;

        const anim = this.obtenerAnimacionDeAtaque(dx, dy);
        this.orientarSprite(dx);
        this.reproducirAnimacionDeAtaque(anim, enemigo);
        break;
      }
    }
  }

  /**
   * Reproduce una animación de ataque y aplica daño al completarla.
   * @param {string} nombreAnimacion - Nombre de la animación a usar.
   * @param {Personaje} enemigo - Enemigo objetivo del ataque.
   */
  reproducirAnimacionDeAtaque(nombreAnimacion, enemigo) {
    if (!this.animaciones[nombreAnimacion]) return;

    this.sprite.textures = this.animaciones[nombreAnimacion];
    this.sprite.loop = false;
    this.sprite.gotoAndPlay(0);

    this.sprite.onComplete = () => {
      if (enemigo?.vida > 0) {
        enemigo.recibirDanio(1);
      }

      this.atacando = false;
      this.objetivoAtaque = null;

      this.sprite.loop = true;
      this.cambiarEstado('idle');
      this.sprite.onComplete = null;
    };
  }
  reproducirAnimacionDeAtaque_v2(nombreAnimacion, enemigo) {
    const animacion = this.animaciones[nombreAnimacion];

    // ⚠️ Validamos que la animación exista y que el sprite esté listo
    if (!animacion || !this.sprite) {
      console.warn(`⚠️ Animación ${nombreAnimacion} no encontrada`);
      this.atacando = false; // ← importante, si no, queda colgado
      return;
    }

    // 🔁 Asignamos la animación al sprite
    this.sprite.textures = animacion;
    this.sprite.loop = false;         // Solo se reproduce una vez
    this.sprite.gotoAndPlay(0);       // Iniciar desde el primer frame

    // 🧹 Cancelamos cualquier animación pendiente anterior
    this.sprite.onComplete = null;

    // ✅ Cuando la animación termina, se llama esta función:
    this.sprite.onComplete = () => {

      // ✅ Validamos que el atacante siga vivo y que aún tenga objetivo
      if (!this.objetivoAtaque || this.vida <= 0) return;

      // 🩸 Aplicamos daño solo si el enemigo sigue vivo
      if (this.objetivoAtaque.vida > 0) {
        this.objetivoAtaque.recibirDanio(1);
      }

      // 🔄 Restauramos el estado del atacante
      this.atacando = false;
      this.objetivoAtaque = null;

      // ✅ Solo si el sprite sigue existiendo (puede haber muerto)
      if (this.sprite) {
        this.sprite.loop = true;            // futuras animaciones pueden repetirse
        this.cambiarEstado('idle');         // volver a idle
        this.sprite.onComplete = null;      // limpiar para evitar conflictos
      }

      // 🧭 Si el atacante tenía un destino guardado, retomá el camino
      if (this.destinoFijado && this.vida > 0) {
        this.irA(this.destinoFijado.x, this.destinoFijado.y);
      }
    };
  }

  /**
   * Devuelve el nombre de la animación de ataque según la dirección.
   * Este método puede ser sobrescrito por las subclases (como CaballeroAzul).
   * @param {number} dx - Diferencia en X hacia el enemigo.
   * @param {number} dy - Diferencia en Y hacia el enemigo.
   * @returns {string|null}
   */
  obtenerAnimacionDeAtaque(dx, dy) {
    return null; // por defecto no hay animación, subclases pueden sobrescribir
  }

  /**
   * Aplica daño a este personaje y verifica si debe morir.
   * @param {number} cantidad - Cuánta vida perder.
   */
  recibirDanio(cantidad) {
    this.vida -= cantidad;

    if (this.vida <= 0) {
      this.morir();
    } else {
      // 👇 ESTA LÍNEA NO:
      // this.setSeleccionado(true);

      // ✅ Opcional: pequeño efecto visual para "recibir daño"
      this.sprite.tint = 0xffaaaa;
      setTimeout(() => {
        this.sprite.tint = 0xFFFFFF;
      }, 100);
    }
  }

  /**
   * Elimina al personaje de todos los arrays donde está y destruye sus gráficos.
   */
  morir() {
    if (this.sprite) {
      this.sprite.stop();
      this.sprite.visible = false;
      this.sprite.onComplete = null; // ✅ Cancelar animaciones pendientes
    }

    const listas = [
      this.juego.entidades,
      this.juego.caballerosAzules,
      this.juego.caballerosRojos,
      this.juego.trabajadoresRojos,
    ];

    for (const lista of listas) {
      const index = lista.indexOf(this);
      if (index !== -1) {
        lista.splice(index, 1);
      }
    }

    this.container?.destroy();
    this.textoVida?.destroy();

    console.log(`${this.constructor.name} ha muerto.`);
  }

  /**
   * Evita que este personaje se superponga con otros personajes.
   * Se aplica una fuerza suave para separarlos.
   */
  evitarSuperposicion() {
    for (const otro of this.juego.entidades) {
      if (otro === this) continue;

      const dx = this.x - otro.x;
      const dy = this.y - otro.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 0 && dist < this.distanciaMinima) {
        const fuerza = (this.distanciaMinima - dist) / dist * 0.5;
        this.x += dx * fuerza;
        this.y += dy * fuerza;
      }
    }
  }


}