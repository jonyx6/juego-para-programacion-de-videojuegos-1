
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

/*
🧠 ¿Qué es window.MouseManager = MouseManager;?
Es una asignación de una variable global. Le estás diciendo al navegador:

"Ey, guardá esta clase llamada MouseManager en el objeto window (el espacio global del navegador) para que esté disponible en otros scripts."

👇 ¿Por qué debe ir afuera de la clase?
Porque dentro de la clase solo podés poner definiciones de métodos o propiedades estáticas, no código ejecutable.


🧭 Accesos a juego desde MouseManager
📌 Propiedades de Juego usadas directamente:
Estas se usan para leer/guardar el estado del juego o entidades.

Propiedad	        Tipo	                    Uso en MouseManager
mouse	            { x: number, y: number }	Guarda la posición actual del mouse.
isSelecting	        boolean	                    Indica si el usuario está seleccionando con el mouse.
selectionStart	    { x: number, y: number }	Guarda la posición donde comenzó la selección.
selectionBox	     PIXI.Graphics | null	    Objeto gráfico que muestra el rectángulo de selección.
app	                PIXI.Application	        Se usa para agregar selectionBox al escenario (stage).
selectedEntities	Array	                    Guarda las entidades seleccionadas por el usuario.
entidades	        Array<Entidad>	            Lista completa de todas las entidades en el juego.
grid	            Grid | null	                Usado para modificar el campo vectorial.

🧪 Métodos de Juego llamados desde MouseManager:
Método	Propósito
updateVectorFieldBasedOnPoint(x, y)	Recalcula el campo vectorial cuando el usuario hace clic derecho.

🎯 Dependencias externas (no de Juego)
Recurso	Descripción
PIXI.Graphics	Clase de PixiJS para dibujar gráficos.
*/