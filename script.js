// Datos de ejemplo. Se puede reemplazar por los definitivos
const materias = [
  { codigo: "AMI", nombre: "Análisis Matemático I", anio: 1, creditos: 5, correlativas: [] },
  { codigo: "AGA", nombre: "Álgebra y Geometría Analítica", anio: 1, creditos: 5, correlativas: [] },
  { codigo: "FIS1", nombre: "Física I", anio: 1, creditos: 5, correlativas: ["AMI", "AGA"] },
  { codigo: "QUI-GRAL", nombre: "Química General", anio: 1, creditos: 6, correlativas: [] },
  { codigo: "IYS", nombre: "Ingeniería y Sociedad", anio: 1, creditos: 2, correlativas: [] },
];

const ESTADOS = ["desactivado", "activado", "aprobado"];

function obtenerEstado(codigo) {
  return localStorage.getItem(`materia_${codigo}`) || "desactivado";
}

function guardarEstado(codigo, estado) {
  localStorage.setItem(`materia_${codigo}`, estado);
}

function cambiarEstado(elem, codigo) {
  let estadoActual = obtenerEstado(codigo);
  let index = ESTADOS.indexOf(estadoActual);
  let nuevoEstado = ESTADOS[(index + 1) % ESTADOS.length];
  guardarEstado(codigo, nuevoEstado);
  elem.className = `materia ${nuevoEstado}`;
  actualizarResumen();
}

function crearMateria(m) {
  const div = document.createElement("div");
  const estado = obtenerEstado(m.codigo);
  div.className = `materia ${estado}`;
  div.innerHTML = `
    <strong>${m.nombre}</strong>
    <div class="carga">${m.creditos} hs</div>
  `;
  div.onclick = () => cambiarEstado(div, m.codigo);
  return div;
}

function renderizarMalla() {
  const malla = document.getElementById("malla-container");
  malla.innerHTML = "";

  const niveles = [...new Set(materias.map(m => m.anio))].sort((a, b) => a - b);
  niveles.forEach(nivel => {
    const divNivel = document.createElement("div");
    divNivel.className = "nivel";
    divNivel.innerHTML = `<h3>${nivel}° Nivel</h3>`; // cambio aplicado

    const materiasDelNivel = materias.filter(m => m.anio === nivel);
    materiasDelNivel.forEach(m => {
      divNivel.appendChild(crearMateria(m));
    });

    malla.appendChild(divNivel);
  });

  actualizarResumen();
}

function actualizarResumen() {
  let total = 0;
  let acumulado = 0;

  materias.forEach(m => {
    if (obtenerEstado(m.codigo) === "aprobado") {
      acumulado += m.creditos;
    }
    total += m.creditos;
  });

  const porcentaje = total ? Math.round((acumulado / total) * 100) : 0;

  const resumen = document.getElementById("resumen-container");
  resumen.innerHTML = `
    <div class="carga">Carga horaria acumulada: ${acumulado} hs</div>
    <div class="carga">Progreso: ${porcentaje}%</div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderizarMalla();
});
