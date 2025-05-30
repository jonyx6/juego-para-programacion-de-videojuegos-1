
//original
/*
class MouseManager {
  constructor(juego) {
    this.juego = juego;
    this.initListeners();
  }

  initListeners() {
    // Mouse move
    window.onmousemove = (e) => {
      this.juego.mouse = { x: e.x, y: e.y };

      if (this.juego.isSelecting && this.juego.selectionBox) {
        const width = this.juego.mouse.x - this.juego.selectionStart.x;
        const height = this.juego.mouse.y - this.juego.selectionStart.y;

        this.juego.selectionBox.clear();
        this.juego.selectionBox.lineStyle(2, 0xffffff, 1);
        this.juego.selectionBox.beginFill(0xffffff, 0.2);
        this.juego.selectionBox.drawRect(
          this.juego.selectionStart.x,
          this.juego.selectionStart.y,
          width,
          height
        );
        this.juego.selectionBox.endFill();
      }
    };

    // Right-click → actualizar campo vectorial
    window.oncontextmenu = (e) => {
      e.preventDefault();
      if (this.juego.grid) {
        //this.juego.updateVectorFieldBasedOnPoint(e.x, e.y);
        //this.juego.vectorFieldManager.updateVectorFieldBasedOnPoint(e.x, e.y);// ---------------no lo usa A*
        e.preventDefault();
        this.juego.selectedEntities.forEach(ent => ent.irA?.(e.x, e.y));
        
      }
    };

    // Mouse down → comenzar selección
    window.onmousedown = (e) => {
      if (e.button !== 0) return;

      this.juego.selectionStart = { x: e.x, y: e.y };
      this.juego.isSelecting = true;

      if (!this.juego.selectionBox) {
        this.juego.selectionBox = new PIXI.Graphics();
        this.juego.app.stage.addChild(this.juego.selectionBox);
      }

      this.juego.selectionBox.clear();
      this.juego.selectedEntities = [];
    };

    // Mouse up → terminar selección
    window.onmouseup = (e) => {
      if (this.juego.isSelecting) {
        const x1 = Math.min(this.juego.selectionStart.x, this.juego.mouse.x);
        const y1 = Math.min(this.juego.selectionStart.y, this.juego.mouse.y);
        const x2 = Math.max(this.juego.selectionStart.x, this.juego.mouse.x);
        const y2 = Math.max(this.juego.selectionStart.y, this.juego.mouse.y);
        
        //19/05
        // Limpiar selección anterior visualmente
        this.juego.entidades.forEach(ent => ent.setSeleccionado?.(false));
        // Actualizar selección
        this.juego.selectedEntities = this.juego.entidades.filter((entity) => {
          return entity.x >= x1 && entity.x <= x2 && entity.y >= y1 && entity.y <= y2;
        });
        // Marcar visualmente los seleccionados
        this.juego.selectedEntities.forEach(ent => ent.setSeleccionado?.(true));
        ////////

        this.juego.selectedEntities = this.juego.entidades.filter((entity) => {
          return entity.x >= x1 && entity.x <= x2 && entity.y >= y1 && entity.y <= y2;
        });

        console.log(`Selected ${this.juego.selectedEntities.length} entities`);

        if (this.juego.selectionBox) {
          this.juego.selectionBox.clear();
        }

        this.juego.isSelecting = false;
      }

      /////
    };
  }
}

window.MouseManager = MouseManager;
*/
//convinacion v1-------------------------------------------------
/*
class MouseManager {
  constructor(juego) {
    this.juego = juego;
    this.personajesSeleccionados = [];
    this.objetosSeleccionados = [];
    this.iniciandoSeleccion = false;
    this.puntoInicioSeleccion = null;
    this.umbralArrastre = 5; // Para distinguir entre clic y arrastre
    
    this.initListeners();
    this.initSelectionBox();
  }

  initSelectionBox() {
    if (!this.juego.selectionBox) {
      this.juego.selectionBox = new PIXI.Graphics();
      this.juego.app.stage.addChild(this.juego.selectionBox);
    }
  }

  initListeners() {
    // Usar eventos de PIXI en lugar de eventos del DOM para mejor precisión
    this.juego.app.stage.eventMode = 'static';
    
    // Mouse down - iniciar selección
    this.juego.app.stage.on('pointerdown', (e) => {
      this.handleMouseDown(e);
    });

    // Mouse move - actualizar selección
    this.juego.app.stage.on('pointermove', (e) => {
      this.handleMouseMove(e);
    });

    // Mouse up - finalizar selección
    this.juego.app.stage.on('pointerup', (e) => {
      this.handleMouseUp(e);
    });

    // También mantener compatibilidad con coordenadas globales para el juego
    this.juego.app.stage.on('pointermove', (e) => {
      this.juego.mouse = { x: e.global.x, y: e.global.y };
    });
  }

  handleMouseDown(evento) {
    const esClicIzquierdo = evento.data.originalEvent.button === 0;
    const esClicDerecho = evento.data.originalEvent.button === 2;

    if (esClicIzquierdo) {
      this.iniciarSeleccion(evento);
      this.detectarClicEnEntidad(evento);
    } else if (esClicDerecho) {
      this.detectarClicDerecho(evento);
    }
  }

  handleMouseMove(evento) {
    this.juego.mouse = { x: evento.global.x, y: evento.global.y };
    this.actualizarRectanguloSeleccion(evento);
  }

  handleMouseUp(evento) {
    if (evento.data.originalEvent.button === 0) {
      this.finalizarSeleccion(evento);
    }
  }

  detectarClicEnEntidad(evento) {
    const posicion = evento.global;

    if (this.juego && (this.juego.entidades || this.juego.personajes)) {
      // Primero limpiar selecciones anteriores
      this.deseleccionarEntidades();

      // Buscar en entidades (nueva estructura)
      let entidadClickeada = null;
      if (this.juego.entidades) {
        entidadClickeada = this.juego.entidades.find(e => {
          return this.estaDentroDelSprite(posicion, e);
        });
      }

      // Buscar en personajes (estructura original de Puntero)
      let personajeClickeado = null;
      if (!entidadClickeada && this.juego.personajes) {
        personajeClickeado = this.juego.personajes.find(p => {
          const areaDelSprite = p.sprite?.getBounds();
          if (areaDelSprite) {
            return this.estaDentroDelSprite(posicion, areaDelSprite);
          }
          return false;
        });
      }

      // Buscar en objetos de escenario
      let objetoClickeado = null;
      if (!entidadClickeada && !personajeClickeado && this.juego.objetosDeEscenario) {
        objetoClickeado = this.juego.objetosDeEscenario.find(o => {
          const areaDelSpriteDelObjeto = o.sprite?.getBounds();
          if (areaDelSpriteDelObjeto) {
            return this.estaDentroDelSprite(posicion, areaDelSpriteDelObjeto);
          }
          return false;
        });
      }

      // Seleccionar la entidad encontrada
      if (entidadClickeada) {
        this.juego.selectedEntities = [entidadClickeada];
        this.personajesSeleccionados = [entidadClickeada];
        if (entidadClickeada.setSeleccionado) {
          entidadClickeada.setSeleccionado(true);
        }
      } else if (personajeClickeado) {
        this.personajesSeleccionados = [personajeClickeado];
        this.juego.selectedEntities = [personajeClickeado];
        if (personajeClickeado.seleccionar) {
          personajeClickeado.seleccionar();
        }
      } else if (objetoClickeado) {
        this.objetosSeleccionados = [objetoClickeado];
        if (objetoClickeado.seleccionar) {
          objetoClickeado.seleccionar();
        }
      }
    }
  }

  estaDentroDelSprite(unaPosicion, entidadOBounds) {
    let bounds;
    
    // Si es una entidad con sprite
    if (entidadOBounds.sprite && entidadOBounds.sprite.getBounds) {
      bounds = entidadOBounds.sprite.getBounds();
    }
    // Si es un bounds directo
    else if (entidadOBounds.x !== undefined && entidadOBounds.width !== undefined) {
      bounds = entidadOBounds;
    }
    // Si es una entidad con coordenadas directas (compatibilidad con MouseManager original)
    else if (entidadOBounds.x !== undefined && entidadOBounds.y !== undefined) {
      // Usar un área pequeña alrededor del punto para entidades sin sprite
      const margen = 20;
      bounds = {
        x: entidadOBounds.x - margen,
        y: entidadOBounds.y - margen,
        width: margen * 2,
        height: margen * 2
      };
    }
    else {
      return false;
    }

    return (
      unaPosicion.x >= bounds.x &&
      unaPosicion.x <= bounds.x + bounds.width &&
      unaPosicion.y >= bounds.y &&
      unaPosicion.y <= bounds.y + bounds.height
    );
  }

  deseleccionarEntidades() {
    // Deseleccionar entidades (nueva estructura)
    if (this.juego.selectedEntities && this.juego.selectedEntities.length > 0) {
      this.juego.selectedEntities.forEach(ent => {
        if (ent.setSeleccionado) {
          ent.setSeleccionado(false);
        }
      });
    }

    // Deseleccionar personajes (estructura original)
    if (this.personajesSeleccionados && this.personajesSeleccionados.length > 0) {
      this.personajesSeleccionados.forEach(p => {
        if (p.deseleccionar) {
          p.deseleccionar();
        }
      });
    }

    // Deseleccionar objetos
    if (this.objetosSeleccionados && this.objetosSeleccionados.length > 0) {
      this.objetosSeleccionados.forEach(o => {
        if (o.deseleccionar) {
          o.deseleccionar();
        }
      });
    }

    // Limpiar arrays
    this.juego.selectedEntities = [];
    this.personajesSeleccionados = [];
    this.objetosSeleccionados = [];
  }

  detectarClicDerecho(evento) {
    evento.data.originalEvent.preventDefault();
    const posicion = evento.global;

    // Ordenar movimiento con formación circular (mejorado de Puntero)
    if (this.personajesSeleccionados.length > 0) {
      this.ordenarMover(posicion);
    }

    // Mantener compatibilidad con el código original
    if (this.juego.selectedEntities && this.juego.selectedEntities.length > 0) {
      this.juego.selectedEntities.forEach(ent => {
        if (ent.irA) {
          ent.irA(posicion.x, posicion.y);
        }
      });
    }

    // Mantener funcionalidad original del grid
    if (this.juego.grid) {
      // Código comentado del original mantenido por compatibilidad
      //this.juego.updateVectorFieldBasedOnPoint(posicion.x, posicion.y);
      //this.juego.vectorFieldManager.updateVectorFieldBasedOnPoint(posicion.x, posicion.y);
    }
  }

  ordenarMover(posicion) {
    const cantidad = this.personajesSeleccionados.length;
    if (cantidad === 0) return;

    const radio = 30; // distancia del centro

    for (let i = 0; i < cantidad; i++) {
      const angulo = (2 * Math.PI * i) / cantidad;
      const offsetX = Math.cos(angulo) * radio;
      const offsetY = Math.sin(angulo) * radio;

      const destino = {
        x: posicion.x + offsetX,
        y: posicion.y + offsetY,
      };

      const personaje = this.personajesSeleccionados[i];
      if (personaje.moverA) {
        personaje.moverA(destino.x, destino.y);
      } else if (personaje.irA) {
        personaje.irA(destino.x, destino.y);
      }
    }
  }

  iniciarSeleccion(evento) {
    if (evento.data.originalEvent.button !== 0) return;

    this.iniciandoSeleccion = true;
    this.puntoInicioSeleccion = evento.global.clone();
    this.juego.selectionStart = { x: evento.global.x, y: evento.global.y };
    this.juego.isSelecting = true;

    if (this.juego.selectionBox) {
      this.juego.selectionBox.clear();
    }
  }

  actualizarRectanguloSeleccion(evento) {
    if (!this.iniciandoSeleccion || !this.juego.isSelecting) return;

    const actual = evento.global;
    const inicio = this.puntoInicioSeleccion;

    const x = Math.min(inicio.x, actual.x);
    const y = Math.min(inicio.y, actual.y);
    const width = Math.abs(inicio.x - actual.x);
    const height = Math.abs(inicio.y - actual.y);

    if (this.juego.selectionBox) {
      this.juego.selectionBox.clear();
      this.juego.selectionBox.lineStyle(2, 0x00ff00, 1); // Changed to green like Puntero
      this.juego.selectionBox.beginFill(0x00ff00, 0.1);
      this.juego.selectionBox.drawRect(x, y, width, height);
      this.juego.selectionBox.endFill();
    }
  }

  finalizarSeleccion(evento) {
    if (!this.iniciandoSeleccion) return;

    this.iniciandoSeleccion = false;
    this.juego.isSelecting = false;

    const actual = evento.global;
    const inicio = this.puntoInicioSeleccion;

    const deltaX = Math.abs(actual.x - inicio.x);
    const deltaY = Math.abs(actual.y - inicio.y);

    // Si es un clic (movimiento mínimo), no hacer selección múltiple
    if (deltaX < this.umbralArrastre && deltaY < this.umbralArrastre) {
      if (this.juego.selectionBox) {
        this.juego.selectionBox.clear();
      }
      return;
    }

    // Selección múltiple mejorada
    const x1 = Math.min(inicio.x, actual.x);
    const y1 = Math.min(inicio.y, actual.y);
    const x2 = Math.max(inicio.x, actual.x);
    const y2 = Math.max(inicio.y, actual.y);
    const rectSeleccion = new PIXI.Rectangle(x1, y1, x2 - x1, y2 - y1);

    this.deseleccionarEntidades();

    // Seleccionar entidades (nueva estructura)
    if (this.juego.entidades) {
      for (let entidad of this.juego.entidades) {
        let dentroDelRect = false;
        
        if (entidad.sprite && entidad.sprite.getBounds) {
          const bounds = entidad.sprite.getBounds();
          dentroDelRect = rectSeleccion.contains(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
        } else if (entidad.x !== undefined && entidad.y !== undefined) {
          dentroDelRect = rectSeleccion.contains(entidad.x, entidad.y);
        }

        if (dentroDelRect) {
          this.juego.selectedEntities.push(entidad);
          this.personajesSeleccionados.push(entidad);
          if (entidad.setSeleccionado) {
            entidad.setSeleccionado(true);
          }
        }
      }
    }

    // Seleccionar personajes (estructura original)
    if (this.juego.personajes) {
      for (let personaje of this.juego.personajes) {
        const bounds = personaje.sprite?.getBounds();
        if (bounds && rectSeleccion.contains(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)) {
          this.personajesSeleccionados.push(personaje);
          if (!this.juego.selectedEntities.includes(personaje)) {
            this.juego.selectedEntities.push(personaje);
          }
          if (personaje.seleccionar) {
            personaje.seleccionar();
          }
        }
      }
    }

    console.log(`Selected ${this.juego.selectedEntities.length} entities`);

    if (this.juego.selectionBox) {
      this.juego.selectionBox.clear();
    }
  }
}

// Mantener compatibilidad global
window.MouseManager = MouseManager;
*/

//v3 con practicas 2-----------------------------------------------
/**
 * MouseManager - Gestiona la selección y control de entidades en un juego 2D
 * Combina funcionalidades de selección individual, múltiple y movimiento en formación
 */
class MouseManager {
  // Constantes de configuración
  static DRAG_THRESHOLD = 5;
  static FORMATION_RADIUS = 30;
  static ENTITY_MARGIN = 20;
  static SELECTION_COLOR = 0x00ff00;
  static SELECTION_ALPHA = 0.1;
  static SELECTION_LINE_WIDTH = 2;

  constructor(juego) {
    this._validateGameObject(juego);
    this.juego = juego;
    
    // Estado de selección
    this.personajesSeleccionados = [];
    this.objetosSeleccionados = [];
    
    // Estado de arrastre
    this.iniciandoSeleccion = false;
    this.puntoInicioSeleccion = null;
    
    this._initializeComponents();
  }

  /**
   * Valida que el objeto juego tenga las propiedades mínimas requeridas
   */
  _validateGameObject(juego) {
    if (!juego) {
      throw new Error('MouseManager requiere un objeto juego válido');
    }
    if (!juego.app || !juego.app.stage) {
      throw new Error('El objeto juego debe tener una propiedad app con stage válido');
    }
  }

  /**
   * Inicializa los componentes del MouseManager
   */
  _initializeComponents() {
    try {
      this._initSelectionBox();
      this._initEventListeners();
      this._initMouseTracking();
    } catch (error) {
      console.error('Error inicializando MouseManager:', error);
      throw error;
    }
  }

  /**
   * Inicializa el rectángulo de selección
   */
  _initSelectionBox() {
    if (!this.juego.selectionBox) {
      this.juego.selectionBox = new PIXI.Graphics();
      this.juego.app.stage.addChild(this.juego.selectionBox);
    }
  }

  /**
   * Configura todos los event listeners
   */
  _initEventListeners() {
    this.juego.app.stage.eventMode = 'static';
    
    // Usar arrow functions para mantener el contexto
    this.juego.app.stage.on('pointerdown', this._handlePointerDown.bind(this));
    this.juego.app.stage.on('pointermove', this._handlePointerMove.bind(this));
    this.juego.app.stage.on('pointerup', this._handlePointerUp.bind(this));
  }

  /**
   * Convierte coordenadas de evento a coordenadas locales del canvas
   * Soluciona problemas de desplazamiento cuando el canvas no está en (0,0)
   */
  _getLocalCoordinates(evento) {
    // Si el evento ya tiene coordenadas locales correctas, usarlas
    if (evento.global) {
      return evento.global;
    }

    // Obtener el canvas de PIXI
    const canvas = this.juego.app.view;
    if (!canvas) {
      console.warn('No se pudo obtener el canvas de PIXI');
      return { x: 0, y: 0 };
    }

    // Obtener las coordenadas del evento nativo
    const nativeEvent = evento.data?.originalEvent || evento;
    let clientX = nativeEvent.clientX;
    let clientY = nativeEvent.clientY;

    // Si no hay coordenadas del cliente, usar pageX/pageY
    if (clientX === undefined) {
      clientX = nativeEvent.pageX;
      clientY = nativeEvent.pageY;
    }

    // Obtener el rectángulo del canvas
    const rect = canvas.getBoundingClientRect();
    
    // Calcular coordenadas locales considerando:
    // - Posición del canvas en la página
    // - Scroll de la página
    // - Escalado del canvas
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const localX = (clientX - rect.left) * scaleX;
    const localY = (clientY - rect.top) * scaleY;

    return { x: localX, y: localY };
  }

  /**
   * Inicializa el seguimiento del mouse
   */
  _initMouseTracking() {
    this.juego.mouse = this.juego.mouse || { x: 0, y: 0 };
  }

  /**
   * Maneja eventos de pointer down
   */
  _handlePointerDown(evento) {
    try {
      const buttonType = this._getButtonType(evento);
      
      switch (buttonType) {
        case 'left':
          this._handleLeftClick(evento);
          break;
        case 'right':
          this._handleRightClick(evento);
          break;
        default:
          // Ignorar otros botones
          break;
      }
    } catch (error) {
      console.error('Error manejando pointer down:', error);
    }
  }

  /**
   * Maneja eventos de pointer move
   */
  _handlePointerMove(evento) {
    try {
      this._updateMousePosition(evento);
      this._updateSelectionRectangle(evento);
    } catch (error) {
      console.error('Error manejando pointer move:', error);
    }
  }

  /**
   * Maneja eventos de pointer up
   */
  _handlePointerUp(evento) {
    try {
      if (this._getButtonType(evento) === 'left') {
        this._finalizeSelection(evento);
      }
    } catch (error) {
      console.error('Error manejando pointer up:', error);
    }
  }

  /**
   * Determina el tipo de botón presionado
   */
  _getButtonType(evento) {
    const button = evento.data?.originalEvent?.button;
    switch (button) {
      case 0: return 'left';
      case 2: return 'right';
      default: return 'unknown';
    }
  }

  /**
   * Maneja clic izquierdo
   */
  _handleLeftClick(evento) {
    this._startSelection(evento);
    this._detectEntityClick(evento);
  }

  /**
   * Maneja clic derecho
   */
  _handleRightClick(evento) {
    if (evento.data?.originalEvent?.preventDefault) {
      evento.data.originalEvent.preventDefault();
    }
    
    const position = this._getLocalCoordinates(evento);
    this._executeMovementCommands(position);
  }

  /**
   * Actualiza la posición del mouse
   */
  _updateMousePosition(evento) {
    const localCoords = this._getLocalCoordinates(evento);
    this.juego.mouse.x = localCoords.x;
    this.juego.mouse.y = localCoords.y;
  }

  /**
   * Detecta clic en entidad individual
   */
  _detectEntityClick(evento) {
    const position = this._getLocalCoordinates(evento);
    this._clearAllSelections();

    const entity = this._findEntityAtPosition(position);
    if (entity) {
      this._selectSingleEntity(entity);
    }
  }

  /**
   * Busca entidad en la posición dada
   */
  _findEntityAtPosition(position) {
    // Buscar en entidades (estructura nueva)
    const entity = this._findInCollection(this.juego.entidades, position);
    if (entity) return { entity, type: 'entity' };

    // Buscar en personajes (estructura original)
    const personaje = this._findInCollection(this.juego.personajes, position, true);
    if (personaje) return { entity: personaje, type: 'personaje' };

    // Buscar en objetos de escenario
    const objeto = this._findInCollection(this.juego.objetosDeEscenario, position, true);
    if (objeto) return { entity: objeto, type: 'objeto' };

    return null;
  }

  /**
   * Busca en una colección de entidades
   */
  _findInCollection(collection, position, hasSprite = false) {
    if (!Array.isArray(collection)) return null;

    return collection.find(item => {
      return this._isPositionInsideEntity(position, item, hasSprite);
    });
  }

  /**
   * Verifica si una posición está dentro de una entidad
   */
  _isPositionInsideEntity(position, entity, hasSprite = false) {
    const bounds = this._getEntityBounds(entity, hasSprite);
    return bounds && this._isPositionInsideBounds(position, bounds);
  }

  /**
   * Obtiene los bounds de una entidad
   */
  _getEntityBounds(entity, hasSprite = false) {
    // Si tiene sprite con getBounds
    if (hasSprite && entity.sprite?.getBounds) {
      return entity.sprite.getBounds();
    }
    
    // Si es un bounds directo
    if (entity.x !== undefined && entity.width !== undefined) {
      return entity;
    }
    
    // Si tiene coordenadas pero no sprite, crear área pequeña
    if (entity.x !== undefined && entity.y !== undefined) {
      return {
        x: entity.x - MouseManager.ENTITY_MARGIN,
        y: entity.y - MouseManager.ENTITY_MARGIN,
        width: MouseManager.ENTITY_MARGIN * 2,
        height: MouseManager.ENTITY_MARGIN * 2
      };
    }
    
    return null;
  }

  /**
   * Verifica si una posición está dentro de unos bounds
   */
  _isPositionInsideBounds(position, bounds) {
    return (
      position.x >= bounds.x &&
      position.x <= bounds.x + bounds.width &&
      position.y >= bounds.y &&
      position.y <= bounds.y + bounds.height
    );
  }

  /**
   * Selecciona una entidad individual
   */
  _selectSingleEntity({ entity, type }) {
    switch (type) {
      case 'entity':
        this.juego.selectedEntities = [entity];
        this.personajesSeleccionados = [entity];
        this._callMethod(entity, 'setSeleccionado', true);
        break;
      case 'personaje':
        this.personajesSeleccionados = [entity];
        this.juego.selectedEntities = [entity];
        this._callMethod(entity, 'seleccionar');
        break;
      case 'objeto':
        this.objetosSeleccionados = [entity];
        this._callMethod(entity, 'seleccionar');
        break;
    }
  }

  /**
   * Limpia todas las selecciones
   */
  _clearAllSelections() {
    this._clearEntitiesSelection();
    this._clearPersonajesSelection();
    this._clearObjetosSelection();
    this._resetSelectionArrays();
  }

  /**
   * Limpia selección de entidades
   */
  _clearEntitiesSelection() {
    if (Array.isArray(this.juego.selectedEntities)) {
      this.juego.selectedEntities.forEach(entity => {
        this._callMethod(entity, 'setSeleccionado', false);
      });
    }
  }

  /**
   * Limpia selección de personajes
   */
  _clearPersonajesSelection() {
    if (Array.isArray(this.personajesSeleccionados)) {
      this.personajesSeleccionados.forEach(personaje => {
        this._callMethod(personaje, 'deseleccionar');
      });
    }
  }

  /**
   * Limpia selección de objetos
   */
  _clearObjetosSelection() {
    if (Array.isArray(this.objetosSeleccionados)) {
      this.objetosSeleccionados.forEach(objeto => {
        this._callMethod(objeto, 'deseleccionar');
      });
    }
  }

  /**
   * Reinicia arrays de selección
   */
  _resetSelectionArrays() {
    this.juego.selectedEntities = [];
    this.personajesSeleccionados = [];
    this.objetosSeleccionados = [];
  }

  /**
   * Ejecuta comandos de movimiento
   */
  _executeMovementCommands(position) {
    // Movimiento en formación para personajes seleccionados
    if (this.personajesSeleccionados.length > 0) {
      this._executeFormationMovement(position);
    }

    // Movimiento individual para entidades seleccionadas
    if (Array.isArray(this.juego.selectedEntities)) {
      this.juego.selectedEntities.forEach(entity => {
        this._callMethod(entity, 'irA', position.x, position.y);
      });
    }

    // Compatibilidad con funcionalidad del grid
    this._executeGridFunctionality(position);
  }

  /**
   * Ejecuta movimiento en formación
   */
  _executeFormationMovement(centerPosition) {
    const count = this.personajesSeleccionados.length;
    if (count === 0) return;

    this.personajesSeleccionados.forEach((personaje, index) => {
      const targetPosition = this._calculateFormationPosition(centerPosition, index, count);
      
      // Intentar diferentes métodos de movimiento
      if (!this._callMethod(personaje, 'moverA', targetPosition.x, targetPosition.y)) {
        this._callMethod(personaje, 'irA', targetPosition.x, targetPosition.y);
      }
    });
  }

  /**
   * Calcula posición en formación circular
   */
  _calculateFormationPosition(center, index, total) {
    if (total === 1) {
      return { x: center.x, y: center.y };
    }

    const angle = (2 * Math.PI * index) / total;
    const offsetX = Math.cos(angle) * MouseManager.FORMATION_RADIUS;
    const offsetY = Math.sin(angle) * MouseManager.FORMATION_RADIUS;

    return {
      x: center.x + offsetX,
      y: center.y + offsetY
    };
  }

  /**
   * Ejecuta funcionalidad del grid (compatibilidad)
   */
  _executeGridFunctionality(position) {
    if (this.juego.grid) {
      // Funcionalidad comentada del código original mantenida por compatibilidad
      // this.juego.updateVectorFieldBasedOnPoint(position.x, position.y);
      // this.juego.vectorFieldManager.updateVectorFieldBasedOnPoint(position.x, position.y);
    }
  }

  /**
   * Inicia proceso de selección múltiple
   */
  _startSelection(evento) {
    const localCoords = this._getLocalCoordinates(evento);

    this.iniciandoSeleccion = true;
    this.puntoInicioSeleccion = { x: localCoords.x, y: localCoords.y };
    
    // Compatibilidad con código original
    this.juego.selectionStart = { x: localCoords.x, y: localCoords.y };
    this.juego.isSelecting = true;

    if (this.juego.selectionBox) {
      this.juego.selectionBox.clear();
    }
  }

  /**
   * Actualiza rectángulo de selección durante arrastre
   */
  _updateSelectionRectangle(evento) {
    if (!this.iniciandoSeleccion || !this.juego.isSelecting) {
      return;
    }

    const currentCoords = this._getLocalCoordinates(evento);
    const bounds = this._calculateSelectionBounds(this.puntoInicioSeleccion, currentCoords);
    this._drawSelectionRectangle(bounds);
  }

  /**
   * Calcula bounds del rectángulo de selección
   */
  _calculateSelectionBounds(start, current) {
    return {
      x: Math.min(start.x, current.x),
      y: Math.min(start.y, current.y),
      width: Math.abs(start.x - current.x),
      height: Math.abs(start.y - current.y)
    };
  }

  /**
   * Dibuja el rectángulo de selección
   */
  _drawSelectionRectangle(bounds) {
    if (!this.juego.selectionBox) return;

    this.juego.selectionBox.clear();
    this.juego.selectionBox.lineStyle(
      MouseManager.SELECTION_LINE_WIDTH, 
      MouseManager.SELECTION_COLOR, 
      1
    );
    this.juego.selectionBox.beginFill(
      MouseManager.SELECTION_COLOR, 
      MouseManager.SELECTION_ALPHA
    );
    this.juego.selectionBox.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
    this.juego.selectionBox.endFill();
  }

  /**
   * Finaliza proceso de selección
   */
  _finalizeSelection(evento) {
    if (!this.iniciandoSeleccion) return;

    this._resetSelectionState();

    const currentCoords = this._getLocalCoordinates(evento);
    if (this._isDragGesture(this.puntoInicioSeleccion, currentCoords)) {
      this._performMultipleSelection(this.puntoInicioSeleccion, currentCoords);
    }

    this._clearSelectionBox();
  }

  /**
   * Reinicia estado de selección
   */
  _resetSelectionState() {
    this.iniciandoSeleccion = false;
    this.juego.isSelecting = false;
  }

  /**
   * Determina si el gesto fue un arrastre válido
   */
  _isDragGesture(start, end) {
    const deltaX = Math.abs(end.x - start.x);
    const deltaY = Math.abs(end.y - start.y);
    return deltaX >= MouseManager.DRAG_THRESHOLD || deltaY >= MouseManager.DRAG_THRESHOLD;
  }

  /**
   * Realiza selección múltiple
   */
  _performMultipleSelection(start, end) {
    const selectionRect = this._createSelectionRectangle(start, end);
    
    this._clearAllSelections();
    this._selectEntitiesInRectangle(selectionRect);
    
    console.log(`Selected ${this.juego.selectedEntities.length} entities`);
  }

  /**
   * Crea rectángulo de selección PIXI
   */
  _createSelectionRectangle(start, end) {
    const x1 = Math.min(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const x2 = Math.max(start.x, end.x);
    const y2 = Math.max(start.y, end.y);
    
    return new PIXI.Rectangle(x1, y1, x2 - x1, y2 - y1);
  }

  /**
   * Selecciona entidades dentro del rectángulo
   */
  _selectEntitiesInRectangle(rect) {
    this._selectFromCollection(this.juego.entidades, rect, 'entity');
    this._selectFromCollection(this.juego.personajes, rect, 'personaje');
  }

  /**
   * Selecciona entidades de una colección específica
   */
  _selectFromCollection(collection, rect, type) {
    if (!Array.isArray(collection)) return;

    collection.forEach(entity => {
      if (this._isEntityInRectangle(entity, rect, type === 'personaje')) {
        this._addToSelection(entity, type);
      }
    });
  }

  /**
   * Verifica si una entidad está dentro del rectángulo
   */
  _isEntityInRectangle(entity, rect, hasSprite = false) {
    const bounds = this._getEntityBounds(entity, hasSprite);
    if (!bounds) return false;

    // Verificar si el centro de la entidad está dentro del rectángulo
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    
    return rect.contains(centerX, centerY);
  }

  /**
   * Agrega entidad a la selección
   */
  _addToSelection(entity, type) {
    switch (type) {
      case 'entity':
        this.juego.selectedEntities.push(entity);
        this.personajesSeleccionados.push(entity);
        this._callMethod(entity, 'setSeleccionado', true);
        break;
      case 'personaje':
        this.personajesSeleccionados.push(entity);
        if (!this.juego.selectedEntities.includes(entity)) {
          this.juego.selectedEntities.push(entity);
        }
        this._callMethod(entity, 'seleccionar');
        break;
    }
  }

  /**
   * Limpia el rectángulo de selección
   */
  _clearSelectionBox() {
    if (this.juego.selectionBox) {
      this.juego.selectionBox.clear();
    }
  }

  /**
   * Llama un método de forma segura en un objeto
   */
  _callMethod(obj, methodName, ...args) {
    if (obj && typeof obj[methodName] === 'function') {
      try {
        obj[methodName](...args);
        return true;
      } catch (error) {
        console.warn(`Error llamando método ${methodName}:`, error);
        return false;
      }
    }
    return false;
  }

  /**
   * Limpia recursos y event listeners
   */
  destroy() {
    try {
      // Limpiar selecciones
      this._clearAllSelections();
      
      // Remover event listeners
      if (this.juego.app?.stage) {
        this.juego.app.stage.off('pointerdown');
        this.juego.app.stage.off('pointermove');
        this.juego.app.stage.off('pointerup');
      }
      
      // Limpiar referencias
      this.juego = null;
      this.personajesSeleccionados = null;
      this.objetosSeleccionados = null;
      this.puntoInicioSeleccion = null;
      
    } catch (error) {
      console.error('Error destruyendo MouseManager:', error);
    }
  }
}

// Mantener compatibilidad global
window.MouseManager = MouseManager;