// Créditos oficiales de cada ramo
const creditos = {
  'iic1103': 10,
  'iic1001': 5,
  'mat1107': 10,
  'mat1207': 10,
  'fil2001': 10,
  'iic1253': 10,
  'iic2233': 10,
  'iic2343': 10,
  'mat1610': 10,
  'teologico': 10,
  'iic2133': 10,
  'iic2413': 10,
  'mat1620': 10,
  'mat1203': 10,
  'ofg1': 10,
  'eyp1025': 10,
  'iic2143': 10,
  'iic2224': 10,
  'iic2333': 10,
  'ofg2': 10,
  'iic2560': 10,
  'iic2214': 10,
  'iic2513': 10,
  'ciencias': 10,
  'ofg3': 10,
  'iic2613': 10,
  'iic2283': 10,
  'iic2531': 10,
  'eti1001': 10,
  'ofg4': 10,
  'iic2523': 10,
  'iic2182': 10,
  'opt1': 10,
  'opt2': 10,
  'ofg5': 10,
  'iic2001': 5,
  'iic2164': 10,
  'opt3': 10,
  'opt4': 10,
  'opt5': 10,
  'ofg6': 10
};

// Prerrequisitos de cada ramo (ramos que deben estar aprobados para desbloquear este)
const prerequisitos = {
  'iic1253': [],
  'iic2233': ['iic1103'],
  'mat1610': ['mat1107'],
  'iic2133': ['iic1253', 'iic2233'],
  'iic2413': ['iic1253', 'iic2233'],
  'mat1620': ['mat1610'],
  'mat1203': ['mat1207'],
  'eyp1025': ['iic1253', 'mat1620'],
  'iic2143': ['iic2413'],
  'iic2224': ['iic1253', 'iic2133'],
  'iic2333': ['iic2343'],
  'iic2560': ['iic2343', 'iic2224'],
  'iic2214': ['iic1253'],
  'iic2513': ['iic2143'],
  'iic2613': ['eyp1025', 'iic2233'],
  'iic2283': ['iic2133'],
  'iic2531': [],
  'eti1001': ['iic2143', 'iic2513'],
  'iic2523': ['iic2333'],
  'iic2182': ['iic2513'],
  'iic2001': ['iic2143'],
  'iic2164': ['eti1001', 'iic2182', 'iic2531']
};

// Funciones para guardar y cargar progreso en localStorage
function obtenerAprobados() {
  const data = localStorage.getItem('mallaAprobados');
  return data ? JSON.parse(data) : [];
}

function guardarAprobados(aprobados) {
  localStorage.setItem('mallaAprobados', JSON.stringify(aprobados));
}

// Calcula el total de créditos de ramos aprobados
function calcularCreditosAprobados() {
  const aprobados = obtenerAprobados();
  return aprobados.reduce((sum, ramo) => sum + (creditos[ramo] || 0), 0);
}

// Actualiza qué ramos están desbloqueados o bloqueados según prerrequisitos y créditos especiales
function actualizarDesbloqueos() {
  const aprobados = obtenerAprobados();
  const totalCreditos = calcularCreditosAprobados();

  for (const [destino, reqs] of Object.entries(prerequisitos)) {
    const elem = document.getElementById(destino);
    if (!elem) continue;

    // Verificar si se cumplen prerrequisitos normales
    let puedeDesbloquear = reqs.every(r => aprobados.includes(r));

    // Reglas casos especiales de uno u otro requisito
    if (destino === 'iic1253') {
      puedeDesbloquear = aprobados.includes('mat1207') && aprobados.includes('iic1001') ||
      aprobados.includes('mat1203');
    }
    if (destino === 'iic2531') {
      puedeDesbloquear = aprobados.includes('iic2333') || aprobados.includes('iic2133');
    }

    if (!elem.classList.contains('aprobado')) {
      if (puedeDesbloquear) elem.classList.remove('bloqueado');
      else elem.classList.add('bloqueado');
    } else {
      // Si está aprobado, no debe estar bloqueado
      elem.classList.remove('bloqueado');
    }
  }
}

// Maneja el clic para aprobar o desaprobar un ramo (solo si no está bloqueado)
function aprobar(e) {
  const ramo = e.currentTarget;
  if (ramo.classList.contains('bloqueado')) return;

  ramo.classList.toggle('aprobado');

  const aprobados = obtenerAprobados();
  if (ramo.classList.contains('aprobado')) {
    if (!aprobados.includes(ramo.id)) aprobados.push(ramo.id);
  } else {
    const idx = aprobados.indexOf(ramo.id);
    if (idx > -1) aprobados.splice(idx, 1);
  }
  guardarAprobados(aprobados);

  actualizarDesbloqueos();
}

// Al cargar la página, asignar eventos, cargar progreso y actualizar desbloqueos
window.addEventListener('DOMContentLoaded', () => {
  const todosRamos = document.querySelectorAll('.ramo');

  const aprobados = obtenerAprobados();
  todosRamos.forEach(ramo => {
    if (aprobados.includes(ramo.id)) {
      ramo.classList.add('aprobado');
    }
  });

  todosRamos.forEach(ramo => {
    ramo.addEventListener('click', aprobar);
  });

  actualizarDesbloqueos();
});