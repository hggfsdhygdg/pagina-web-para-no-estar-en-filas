/* =========================================================
   NO MÁS FILAS - script.js
   Controla la lista de trámites, filtros y la ventana de detalle
   ========================================================= */

/* ---------- 1. DATOS DE LOS TRÁMITES ---------- */
/* Cada objeto tiene las mismas propiedades para que el código funcione igual con todos */
const tramites = [
  {
    id: 1,
    titulo: "Cédula de ciudadanía (primera vez o duplicado)",
    categoria: "identificacion",
    resumen: "Documento de identidad para mayores de 18 años.",
    pasos: [
      "Reúne los documentos necesarios (ver checklist).",
      "Agenda cita en la Registraduría Nacional (si aplica en tu ciudad).",
      "Asiste el día de la cita con los documentos originales.",
      "Paga el valor correspondiente (duplicado o trámite especial).",
      "Recibe el comprobante y espera la entrega según indicaciones."
    ],
    documentos: [
      "Registro civil de nacimiento (original o copia autenticada)",
      "Foto tamaño 3x4 fondo blanco (si la piden en tu sede)",
      "Comprobante de pago (cuando aplique)",
      "Documento de identidad anterior o denuncia por pérdida (duplicado)"
    ],
    costo: "Varía según el trámite (consulta en la página oficial).",
    tiempo: "Depende de la sede y el tipo de trámite.",
    enlace: "https://www.registraduria.gov.co/"
  },
  {
    id: 2,
    titulo: "Licencia de conducción",
    categoria: "movilidad",
    resumen: "Obtener o renovar el pase de conducir.",
    pasos: [
      "Presenta el examen teórico y práctico en un centro autorizado (si es primera vez).",
      "Realiza el examen de aptitud física, mental y de coordinación motriz.",
      "Reúne los documentos y paga los derechos.",
      "Solicita el trámite en la Secretaría de Movilidad o entidad autorizada.",
      "Recibe la licencia según el procedimiento de tu ciudad."
    ],
    documentos: [
      "Cédula de ciudadanía",
      "Certificado de aptitud física y mental",
      "Certificado de aprobación del curso / exámenes (primera vez)",
      "Comprobante de pago"
    ],
    costo: "Varía por ciudad y categoría de licencia.",
    tiempo: "Puede demorar varios días hábiles.",
    enlace: "https://www.runt.gov.co/"
  },
  {
    id: 3,
    titulo: "Cita médica EPS",
    categoria: "salud",
    resumen: "Agendar cita con médico general o especialista.",
    pasos: [
      "Ingresa a la página o app de tu EPS.",
      "Inicia sesión con tu documento y datos.",
      "Elige el tipo de cita (general o especialista).",
      "Selecciona sede, fecha y hora disponible.",
      "Confirma y guarda el comprobante de la cita."
    ],
    documentos: [
      "Número de documento de identidad",
      "Datos de contacto actualizados en la EPS"
    ],
    costo: "Según el régimen y la cobertura de tu plan.",
    tiempo: "Depende de la disponibilidad de agendas.",
    enlace: "https://www.minsalud.gov.co/"
  },
  {
    id: 4,
    titulo: "Impuesto predial",
    categoria: "impuestos",
    resumen: "Consulta y pago del impuesto predial de tu municipio.",
    pasos: [
      "Ingresa a la página de la Alcaldía o Secretaría de Hacienda de tu ciudad.",
      "Busca la opción de consulta de predial con el código del predio o cédula catastral.",
      "Revisa el valor a pagar y las fechas de descuento.",
      "Genera el recibo y paga en los canales autorizados (bancos, PSE, corresponsales).",
      "Guarda el comprobante de pago."
    ],
    documentos: [
      "Número de identificación del predio / cédula catastral",
      "Documento de identidad del propietario"
    ],
    costo: "Según el avalúo del inmueble y la tarifa municipal.",
    tiempo: "El pago suele ser inmediato; la actualización puede tardar unos días.",
    enlace: "https://www.gov.co/"
  },
  {
    id: 5,
    titulo: "Registro civil de nacimiento",
    categoria: "identificacion",
    resumen: "Inscripción del nacimiento de un menor.",
    pasos: [
      "Reúne el certificado de nacido vivo y documentos de los padres.",
      "Acude a la Registraduría o notaría autorizada.",
      "Diligencia el formulario correspondiente.",
      "Entrega los documentos y firma.",
      "Recibe la copia del registro civil."
    ],
    documentos: [
      "Certificado de nacido vivo",
      "Cédulas de los padres",
      "Registro civil de matrimonio (si aplica)"
    ],
    costo: "Consulta en la Registraduría (puede tener costo según el caso).",
    tiempo: "Generalmente el mismo día o en pocos días.",
    enlace: "https://www.registraduria.gov.co/"
  },
  {
    id: 6,
    titulo: "SOAT",
    categoria: "movilidad",
    resumen: "Seguro Obligatorio de Accidentes de Tránsito.",
    pasos: [
      "Ingresa a una aseguradora autorizada o plataforma habilitada.",
      "Ingresa la placa del vehículo y tus datos.",
      "Elige la vigencia y realiza el pago.",
      "Descarga o recibe el SOAT digital / físico.",
      "Verifica que quede registrado en el RUNT."
    ],
    documentos: [
      "Placa del vehículo",
      "Documento de identidad del tomador",
      "Datos del vehículo"
    ],
    costo: "Según el tipo de vehículo y la tarifa vigente.",
    tiempo: "Emisión casi inmediata en línea.",
    enlace: "https://www.runt.gov.co/"
  }
];

/* ---------- 2. REFERENCIAS A ELEMENTOS DEL HTML ---------- */
/* Guardamos en variables los elementos que vamos a usar varias veces */
const grid = document.getElementById("tramites-grid");       // Contenedor de las tarjetas
const modal = document.getElementById("modal");               // Ventana emergente
const modalTitulo = document.getElementById("modal-titulo");  // Título dentro del modal
const modalBody = document.getElementById("modal-body");      // Contenido del modal
const modalClose = document.getElementById("modal-close");    // Botón X para cerrar
const filterBtns = document.querySelectorAll(".filter-btn");  // Botones de filtro

/* ---------- 3. MOSTRAR LAS TARJETAS DE TRÁMITES ---------- */
/**
 * Dibuja en pantalla las tarjetas de trámites.
 * Si se pasa un filtro (ej: "salud"), solo muestra esa categoría.
 * Si el filtro es "todos", muestra todos los trámites.
 */
function mostrarTramites(filtro = "todos") {
  // Limpiamos el contenedor para no duplicar tarjetas
  grid.innerHTML = "";

  // Filtramos la lista según la categoría elegida
  const lista = filtro === "todos"
    ? tramites
    : tramites.filter(function (tramite) {
        return tramite.categoria === filtro;
      });

  // Creamos una tarjeta por cada trámite
  lista.forEach(function (tramite) {
    const card = document.createElement("div");
    card.className = "tramite-card";

    card.innerHTML =
      '<div class="categoria">' + tramite.categoria + "</div>" +
      "<h3>" + tramite.titulo + "</h3>" +
      "<p>" + tramite.resumen + "</p>";

    // Al hacer clic en la tarjeta, abrimos el detalle
    card.addEventListener("click", function () {
      abrirDetalleTramite(tramite);
    });

    grid.appendChild(card);
  });
}

/* ---------- 4. ABRIR EL DETALLE DE UN TRÁMITE ---------- */
/**
 * Muestra la ventana emergente con:
 * - Resumen
 * - Checklist de documentos (se pueden marcar)
 * - Pasos a seguir
 * - Costo y tiempo
 * - Enlace al sitio oficial
 */
function abrirDetalleTramite(tramite) {
  // Ponemos el título del trámite
  modalTitulo.textContent = tramite.titulo;

  // Creamos el checklist de documentos (cada uno con un checkbox)
  let listaDocumentos = "";
  tramite.documentos.forEach(function (documento, indice) {
    listaDocumentos +=
      '<label class="checklist-item">' +
      '<input type="checkbox" data-index="' + indice + '" />' +
      "<span>" + documento + "</span>" +
      "</label>";
  });

  // Creamos la lista numerada de pasos
  let listaPasos = "<ol>";
  tramite.pasos.forEach(function (paso) {
    listaPasos += "<li>" + paso + "</li>";
  });
  listaPasos += "</ol>";

  // Insertamos todo el contenido en el modal
  modalBody.innerHTML =
    "<p><strong>Resumen:</strong> " + tramite.resumen + "</p>" +
    "<h3>Documentos (checklist)</h3>" +
    '<div id="checklist">' + listaDocumentos + "</div>" +
    "<h3>Pasos</h3>" +
    listaPasos +
    "<p><strong>Costo aproximado:</strong> " + tramite.costo + "</p>" +
    "<p><strong>Tiempo estimado:</strong> " + tramite.tiempo + "</p>" +
    '<a class="btn-oficial" href="' + tramite.enlace + '" target="_blank" rel="noopener">' +
    "Ir al sitio oficial</a>";

  // Mostramos el modal (quitamos la clase "hidden")
  modal.classList.remove("hidden");
}

/* ---------- 5. CERRAR EL MODAL ---------- */
/**
 * Cierra la ventana emergente cuando el usuario hace clic en la X
 * o cuando hace clic fuera del contenido (en el fondo oscuro).
 */
function cerrarModal() {
  modal.classList.add("hidden");
}

// Cerrar al hacer clic en el botón X
modalClose.addEventListener("click", cerrarModal);

// Cerrar al hacer clic en el fondo oscuro
modal.addEventListener("click", function (evento) {
  if (evento.target === modal) {
    cerrarModal();
  }
});

/* ---------- 6. FILTROS POR CATEGORÍA ---------- */
/**
 * Cuando el usuario hace clic en un botón de filtro:
 * 1. Quita la clase "active" de todos los botones
 * 2. Se la pone al botón que se clicó
 * 3. Vuelve a dibujar las tarjetas con ese filtro
 */
filterBtns.forEach(function (boton) {
  boton.addEventListener("click", function () {
    // Quitar "active" de todos
    filterBtns.forEach(function (b) {
      b.classList.remove("active");
    });

    // Activar el botón actual
    boton.classList.add("active");

    // Mostrar solo los trámites de esa categoría
    const categoria = boton.getAttribute("data-filter");
    mostrarTramites(categoria);
  });
});

/* ---------- 7. INICIAR LA PÁGINA ---------- */
/* Al cargar la página, mostramos todos los trámites */
mostrarTramites("todos");
