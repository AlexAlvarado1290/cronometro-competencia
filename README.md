# Cronómetro de Competencia

Aplicación web que permite capturar y comparar tiempos entre competidores en una competencia.

**URL:** https://alexalvarado1290.github.io/cronometro-competencia/

## Funcionalidades

- Cronómetro con precisión de milisegundos (Iniciar, Pausar, Reiniciar)
- Captura del tiempo de cada competidor por nombre
- Tabla de resultados ordenada automáticamente por tiempo
- Diferencia de tiempo de cada competidor respecto al 1er lugar
- Diferencia de tiempo respecto al competidor anterior
- Eliminación individual de competidores o limpieza total de resultados

## Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)

## Estructura del proyecto

```
├── index.html           # Estructura de la aplicación
├── styles.css           # Estilos
├── app.js               # Lógica (clases Stopwatch, Competitor, Competition, App)
├── diagramas-uml.html   # Documento con 6 diagramas UML (exportable a PDF)
└── README.md
```

## Diagramas UML

El archivo `diagramas-uml.html` contiene los siguientes diagramas renderizados con Mermaid.js:

1. **Casos de Uso** — Interacciones del usuario con el sistema
2. **Clases** — Estructura estática con atributos, métodos y relaciones
3. **Secuencia** — Flujo temporal de captura de tiempos
4. **Objetos** — Instantánea del sistema en ejecución
5. **Componentes** — Arquitectura por capas del sistema
6. **Actividad** — Flujo de trabajo completo del usuario

## Asignatura

Análisis de sistemas 1 — Tarea 2
