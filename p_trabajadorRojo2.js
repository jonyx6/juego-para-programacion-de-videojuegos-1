class TrabajadorRojo2 extends Personaje {
  constructor(x, y, app, i, juego) {
    super(x, y, app, i, juego);
    this.velocidad = 1.5;
    this.estadoActual = 'idle';
    this.dirImagen = "assets/hud/obreroOrco.jpg";

    //this.recursoAsignado = null;//05/07/2025
    this.recursoAsignado = null;

    //this.cargarSpriteAnimado();

    this.cargarSpriteAnimado().then(() => {
        this.hacerCicloDeRecoleccion();
    });
  }

  async cargarSpriteAnimado() {
    const jsonBase = await PIXI.Assets.load('assets/peonNew/texture.json');
    const jsonMuerte = await PIXI.Assets.load('assets/peonmuriendo/texture.json');
    const jsonPicando = await PIXI.Assets.load('assets/peonpicando/texture.json');
    const jsonMadera = await PIXI.Assets.load('assets/peonrecolectandomadera/texture.json');
    const jsonOro = await PIXI.Assets.load('assets/peonrecolectandomadera/texture.json');

    this.animaciones = {
      // Movimiento
      abajoMov: jsonBase.animations["walk_down"],
      arribaMov: jsonBase.animations["walk_up"],
      deLadoMov: jsonBase.animations["walk_right"],
      digAbajoMov: jsonBase.animations["walk_right_down"],
      digArribaMov: jsonBase.animations["walk_right_up"],

      // Idle reutiliza "idle"
      idleAbaj: jsonBase.animations["idleAbaj"],
      idleArri: jsonBase.animations["idleArri"],
      idleLado: jsonBase.animations["idleLado"],
      idleDiaAbaj: jsonBase.animations["idleDiaAbaj"],
      idleDiaArri: jsonBase.animations["idleDiaArri"],

      // Muerte
      muerte1: jsonMuerte.animations["muerte1"],
      muerte2: jsonMuerte.animations["muerte2"],

      // Picando
      picandoAbajo: jsonPicando.animations["picando_down"],
      picandoArriba: jsonPicando.animations["picando_up"],
      picandoLado: jsonPicando.animations["picando_right"],
      picandoDiaAbajo: jsonPicando.animations["picando_right_down"],
      picandoDiaArriba: jsonPicando.animations["picando_right_up"],

      // Recolectando Madera
      recolectandoMaderaAbajo: jsonMadera.animations["recolectandoMadera_down"],
      recolectandoMaderaArriba: jsonMadera.animations["recolectandoMadera_up"],
      recolectandoMaderaLado: jsonMadera.animations["recolectandoMadera_right"],
      recolectandoMaderaDiaAbajo: jsonMadera.animations["recolectandoMadera_right_down"],
      recolectandoMaderaDiaArriba: jsonMadera.animations["recolectandoMadera_right_up"],

      // Recolectando Oro
      recolectandoOroAbajo: jsonOro.animations["recolectandoOro_down"],
      recolectandoOroArriba: jsonOro.animations["recolectandoOro_up"],
      recolectandoOroLado: jsonOro.animations["recolectandoOro_right"],
      recolectandoOroDiaAbajo: jsonOro.animations["recolectandoOro_right_down"],
      recolectandoOroDiaArriba: jsonOro.animations["recolectandoOro_right_up"],
    };

    this.sprite = new PIXI.AnimatedSprite(this.animaciones['idleAbaj']);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.animationSpeed = 0.125;
    this.sprite.loop = true;
    this.sprite.play();
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.sprite.zIndex = 9999;

    this.container.addChild(this.sprite);
    this.listo = true;
  }
  
  //irA() {}//blanquea los metodos para que no use los del mouse
  //irA_v2() {}
  
  irA(destX, destY) {
    // Si el destino actual es básicamente el mismo, no recalcular A*
    if (
      this.destinoFijado &&
      Math.abs(this.destinoFijado.x - destX) < 4 &&
      Math.abs(this.destinoFijado.y - destY) < 4
    ) {
      return;
    }

    const dx = destX - this.x;
    const dy = destY - this.y;

    // Si lleva recurso y está disponible → mostrar animación de transporte
    if (this.recursoAsignado && this.recursoAsignadoEstaDisponible()) {
      const tipo = this.recursoAsignado.tipoRecurso;
      const anim = this.obtenerAnimacionDeTransporte(tipo, dx, dy);
      if (this.animaciones[anim]) {
        this.sprite.textures = this.animaciones[anim];
        this.sprite.play();
      }
    } else {
      // Movimiento normal usando el método base
      this.manejarAnimacion(dx, dy); // ya existe en la clase base
    }

    // Recalcular camino A*
    const origen = this.juego.grid.getCellAt(this.x, this.y);
    const destino = this.juego.grid.getCellAt(destX, destY);

    if (origen && destino) {
      this.destinoFijado = { x: destX, y: destY };
      this.camino = this.juego.grid.calcularCaminoDesdeHasta(origen, destino);
    }
  }

  obtenerAnimacionDeTrabajoV1(tipo, dx, dy) {
    const direccion = this._direccionDesdeVector(dx, dy);
    if (tipo === 'piedra') return `picando${direccion}`;
    if (tipo === 'madera') return `recolectandoMadera${direccion}`;
    if (tipo === 'oro') return `recolectandoOro${direccion}`;
    return null;
  }

  obtenerAnimacionDeTrabajo(tipo, dx, dy) {
    const direccion = this._direccionDesdeVector(dx, dy);
    return `picando${direccion}`;
  }

  _direccionDesdeVector(dx, dy) {
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY) return 'Lado';
    if (dy > 0 && absX < dy * 0.5) return 'Abajo';
    if (dy < 0 && absX < -dy * 0.5) return 'Arriba';
    if (dx > 0 && dy > 0) return 'DiaAbajo';
    if (dx > 0 && dy < 0) return 'DiaArriba';
    if (dx < 0 && dy > 0) return 'DiaAbajo';
    if (dx < 0 && dy < 0) return 'DiaArriba';
    return 'Abajo';
  }

  async hacerCicloDeRecoleccion() {
    while (true) {
      // Buscar piedra si no tengo una (NO cambiamos si ya hay una)
      if (!this.recursoAsignado /* || this.recursoAsignado.estadoActual === 'muerta' */) {
        this.recursoAsignado = this.encontrarRecursoMasCercano();
        //console.log("🪓 recurso encontrado:", this.recursoAsignado);
        if (this.recursoAsignado) {
          //this.recursoAsignado.trabajadoresAsignados ??= [];
          //this.recursoAsignado.trabajadoresAsignados.push(this);
          this.recursoAsignado.asignarTrabajador(this);
          //console.log(`⚒️ Trabajador ${this.i} asignado a ${this.recursoAsignado.tipoRecurso} en (${this.recursoAsignado.x}, ${this.recursoAsignado.y})`);
        }
      }

      const castillo = this.juego.objetosDeEscenarioRojos.find(e => e instanceof CentralRoja);
      if (!this.recursoAsignado || !castillo) {
        await this.esperarTiempo(1000);
        continue;
      }
      const celdaRecurso = this.obtenerCeldaVecinaMasCercana(this.recursoAsignado);
      const celdaCastillo = this.obtenerCeldaVecinaMasCercana(castillo);

      if (!celdaRecurso || !celdaCastillo) {
        await this.esperarTiempo(1000);
        continue;
      }

      await this.irYRecolectarDeRecurso(this.recursoAsignado, celdaRecurso);

      if (!this.recursoAsignadoEstaDisponible()) {//06/07/2025
        this.liberarAsignacionDeRecurso();
        continue;
      }
      await this.irYEntregarAlCastillo(castillo);
      await this.esperarTiempo(500);
    }
  }

  encontrarRecursoMasCercano() {
    const recursos = this.juego.objetosDeEscenario.filter(e =>
      e instanceof Recolectable &&
      e.estaDisponible() &&
      (e.trabajadoresAsignados?.length || 0) < 2
    );

    let masCercano = null;
    let menorDistancia = Infinity;

    for (const recurso of recursos) {
      const dx = recurso.container.x - this.x;
      const dy = recurso.container.y - this.y;
      const dist = dx * dx + dy * dy;

      if (dist < menorDistancia) {
        menorDistancia = dist;
        masCercano = recurso;
      }
    }

    return masCercano;
  }

  async irYRecolectarDeRecurso(recurso, celda) {
    this.irA(celda.centerX, celda.centerY);
    await this.esperarALlegar();

    if (!this.recursoAsignadoEstaDisponible()) {
      //console.log(`❌ Trabajador ${this.i} llegó pero el recurso ya no existe`);
      this.liberarAsignacionDeRecurso();
      return;
    }

    const dx = recurso.container.x - this.x;
    const dy = recurso.container.y - this.y;
    const anim = this.obtenerAnimacionDeTrabajo(recurso.tipoRecurso, dx, dy);
    this.sprite.textures = this.animaciones[anim];
    this.sprite.play();

    await this.esperarTiempo(1000);
    recurso.recibirDanio(1);
  }

  async irYEntregarAlCastillo(castillo) {
    const LIMITE_ENTREGA = 96;

    const globalPos = castillo.sprite.getGlobalPosition();
    const centroX = globalPos.x;
    const centroY = globalPos.y - castillo.sprite.height / 2;

    const dx = centroX - this.x;
    const dy = centroY - this.y;
    const distancia = Math.hypot(dx, dy);

    // Cambiar animación a "cargando" si tiene recurso
    if (this.recursoAsignado && ['madera', 'oro'].includes(this.recursoAsignado.tipoRecurso)) {//07/07/2025
      const animTransporte = this.obtenerAnimacionDeTransporte(this.recursoAsignado.tipoRecurso, dx, dy);
      if (animTransporte && this.animaciones[animTransporte]) {
        this.sprite.textures = this.animaciones[animTransporte];
        this.sprite.play();
      }
    }

    if (distancia <= LIMITE_ENTREGA) {
      this.camino = [];
      this.cambiarEstadoIdlePorDireccion();
      await this.esperarTiempo(500);
      return;
    }

    const angulo = Math.atan2(dy, dx);
    const objetivoX = centroX - Math.cos(angulo) * LIMITE_ENTREGA;
    const objetivoY = centroY - Math.sin(angulo) * LIMITE_ENTREGA;

    this.irA(objetivoX, objetivoY);
    await this.esperarALlegar();

    this.cambiarEstadoIdlePorDireccion();
    await this.esperarTiempo(500);

    if (castillo.sumarRecurso) {
      castillo.sumarRecurso();
    }

  }

  esperarALlegar() {
    return new Promise(resolve => {
      const check = () => {
        if (this.camino.length === 0) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  esperarTiempo(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  liberarAsignacionDeRecurso() {
    if (this.recursoAsignado?.liberarTrabajador) {
      this.recursoAsignado.liberarTrabajador(this);
    }
    this.recursoAsignado = null;
  }

  /**
 * Devuelve la celda vecina más cercana del objeto pasado.
 * @param {ObjetoEscenario} objeto - Debe tener método obtenerCeldasVecinasLibres().
 * @returns {Celda|null}
 */
  obtenerCeldaVecinaMasCercana(objeto) {
    const celdas = objeto.obtenerCeldasVecinasLibres();
    let mejorCelda = null;
    let menorDist = Infinity;

    for (const celda of celdas) {
      const dx = celda.centerX - this.x;
      const dy = celda.centerY - this.y;
      const dist = dx * dx + dy * dy;

      if (dist < menorDist) {
        menorDist = dist;
        mejorCelda = celda;
      }
    }

    return mejorCelda;
  }

  recursoAsignadoEstaDisponible() {
    return this.recursoAsignado &&
          this.recursoAsignado.estadoActual !== 'muerta';
  }

  obtenerAnimacionDeTransporte(tipo, dx, dy) {//07/07/2025
    const direccion = this._direccionDesdeVector(dx, dy);
    if (tipo === 'madera') return `recolectandoMadera${direccion}`;
    if (tipo === 'oro') return `recolectandoOro${direccion}`;
    return null;
  }
  /*
  manejarAnimacionV1(vx, vy) {//07/07/2025
    if (this.recursoAsignado && this.recursoAsignadoEstaDisponible()) {
      const tipo = this.recursoAsignado.tipoRecurso;
      const anim = this.obtenerAnimacionDeTransporte(tipo, vx, vy);
      if (this.animaciones[anim]) {
        this.sprite.textures = this.animaciones[anim];
        this.sprite.play();
        this.orientarSprite(vx); // mantener el flip horizontal
        return;
      }
    }

    // Si no transporta recurso, usar comportamiento original
    super.manejarAnimacion(vx, vy);
  }

  manejarAnimacion(vx, vy) {
    if (this.recursoAsignado && this.recursoAsignadoEstaDisponible()) {
      const tipo = this.recursoAsignado.tipoRecurso;
      const anim = this.obtenerAnimacionDeTransporte(tipo, vx, vy);
      const frames = this.animaciones[anim];

      if (frames) {
        this.sprite.textures = frames;
        this.sprite.animationSpeed = 0.125;
        this.sprite.loop = true;
        this.sprite.gotoAndPlay(0);
        this.orientarSprite(vx);
        return;
      }
    }

    // Si no transporta recurso, usar el comportamiento base
    super.manejarAnimacion(vx, vy);
  }
*/

}
 
