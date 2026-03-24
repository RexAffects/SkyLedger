const en = {
  nav: {
    trackFlights: "Track Flights",
    learn: "Learn",
    getInvolved: "Get Involved",
    funders: "Funders",
    about: "About",
  },

  home: {
    hero: {
      title: "What's flying over you?",
      subtitle: "You might be surprised.",
      description:
        "SkyLedger gives everyday citizens a real way to do something about our sky being manipulated \u2014 track flights, build evidence, follow the money, and join the movement passing laws across America.",
    },
    pillars: {
      track: {
        title: "Track & Tag",
        description:
          "See something overhead? Track it live. Identify the operator. Tag known cloud seeders. Submit photo evidence \u2014 we cross-reference your photo\u2019s time and location with live flight data automatically.",
        cta: "Track it now \u2192",
      },
      action: {
        title: "Take Action",
        description:
          "Ready-to-send legislator letters. Printable flyers. Request government records. Support the federal lawsuit. Donate to the organizations on the front lines.",
        cta: "Get involved \u2192",
      },
      learn: {
        title: "See the Evidence",
        description:
          "Follow the money. Read the congressional testimony. See who\u2019s funding this. Every claim cited with government records and primary sources.",
        cta: "Follow the money \u2192",
      },
    },
    disclaimer:
      "Every claim on this site links to its government source.",
    disclaimerLink: "See for yourself.",

    urgent: {
      badge: "APRIL 2026",
      title: "Experiments Starting Now",
      description:
        "An Israeli company is preparing to release secret, patented particles into the stratosphere \u2014 and they won\u2019t tell anyone what\u2019s in them.",
      bullet1Label: "Zero published data.",
      bullet1:
        "No peer-reviewed research. No public safety assessment. No public consultation.",
      bullet2Label: "Suspiciously funded.",
      bullet2:
        "$75M raised in under two years \u2014 more than all other geoengineering startups combined.",
      bullet3Label: "Intelligence and defense ties.",
      bullet3:
        "Their lead investor\u2019s advisory board includes a former Mossad Chief of Intelligence, a former IDF Unit 8200 commander, and former directors of the CIA, FBI, and MI5.",
      bullet4Pre: "A Cornell scientist says their safety claims",
      bullet4Quote1: "\u201Ccannot be trusted.\u201D",
      bullet4Mid:
        "The Center for International Environmental Law calls their plans",
      bullet4Quote2: "\u201Creckless.\u201D",
      cta: "Read the full investigation \u2192",
    },

    stats: {
      bansLabel: "States with bans enacted",
      bansValue: "3",
      bansDetail: "Tennessee, Florida, Louisiana",
      billsLabel: "States with pending bills",
      billsValue: "30+",
      billsDetail: "Bills introduced across the U.S.",
      federalLabel: "Federal bill introduced",
      federalValue: "Clear Skies Act",
      federalDetail: "H.R. 4403 \u2014 119th Congress",
      hearingLabel: "Congressional hearing",
      hearingValue: "Sept 2025",
      hearingDetail: "\u201CPlaying God with the Weather\u201D",
    },

    tracker: {
      title: "One click. Full transparency.",
      description:
        "Click any aircraft in the live tracker and instantly see everything public data can tell you about it.",
      ownerLabel: "Who owns it",
      ownerDetail:
        "FAA-registered owner name, city, state. See who\u2019s behind the LLC.",
      destLabel: "Where it\u2019s going",
      destDetail: "Departure & arrival airports when available",
      typeLabel: "What type it is",
      typeDetail: "Aircraft make, model, year, photo",
      liveLabel: "Live tracking",
      liveDetail:
        "Real-time position, speed, heading + flight trail drawn on the map",
      taggedLabel: "Tagged & logged",
      taggedDetail:
        "Known weather modification operators are tagged and logged in the public ledger. Orange = low-mid altitude (where cloud seeding operates), purple = upper altitude (cruise & SAI range), red = known weather modification operator.",
      tamperLabel: "Tamper-proof record",
      tamperDetail:
        "Every data point from government sources. SHA-256 hashed \u2014 the same integrity standard used in federal court.",
      button: "Open Flight Tracker",
    },

    photo: {
      title: "See something? Photograph it.",
      descriptionPre:
        "Your phone is a documentation tool. Every photo submitted to SkyLedger is automatically GPS-tagged, timestamped, and",
      sha256: "SHA-256 hashed",
      tooltipTitle: "What does this mean?",
      tooltipBody:
        "Every photo gets a unique digital fingerprint (SHA-256 hash) at the moment of upload. If anyone changes even one pixel, the hash changes \u2014 proving the image is unaltered. This is the same integrity standard used in federal digital evidence proceedings (FRE 902(13)/(14)).",
      descriptionPost:
        "\u2014 creating a tamper-proof record that can\u2019t be altered after the fact.",
      caption:
        "Real observations from citizens across the country. Photos like these help build the public record.",
      button: "Submit an Observation",
    },

    knowledge: {
      title: "The facts, cited and sourced",
      description:
        "Whether you\u2019re skeptical or concerned, start here. Every claim links to its source \u2014 congressional records, state legislation, government databases, peer-reviewed science.",
      factsTitle: "The Facts",
      factsDescription:
        "Every claim cited. 70 years of programs, 9 active states, sworn testimony, GAO audit. One page, downloadable, shareable.",
      moneyTitle: "Follow the Money",
      moneyDescription:
        "$150M+ from a small network of connected investors. Defense ties. Epstein connections. Political access. The funding pipeline mapped.",
      operatorsTitle: "Who\u2019s Doing It",
      operatorsDescription:
        "9 operator profiles with founders, funding rounds, investors, and red flags. Including Stardust Solutions \u2014 secret particles, nuclear scientists, $75M.",
      legislationTitle: "Legislation Tracker",
      legislationDescription:
        "3 states have enacted bans. 30+ have bills pending. A federal ban is on the table. Track every bill, every vote, every penalty.",
      readMore: "Read more \u2192",
    },

    help: {
      title: "How you can help",
      description:
        "This fight is being won by everyday people showing up. Here\u2019s how to get involved.",
      trackTitle: "Track & Document",
      trackDescription:
        "Use the flight tracker. Submit observations with photos. Every data point builds the picture.",
      trackButton: "Start Tracking",
      learnTitle: "Learn & Share",
      learnDescription:
        "Read the facts. Share them. Send someone the congressional hearing page. Knowledge is the first step.",
      learnButton: "Read the Facts",
      legalTitle: "Support Legal Action",
      legalDescription:
        "Organizations like The GeoFight are building federal lawsuits. Your state may have a bill pending right now.",
      legalButton: "See Your State",
    },

    dataSources: {
      title: "Our data sources",
      description:
        "Every data point comes from a verifiable public source. We aggregate \u2014 the government already collected it.",
      adsb: "ADS-B Exchange (unfiltered flight tracking)",
      faa: "FAA Aircraft Registry (ownership records)",
      noaa: "NOAA Weather Modification Reports",
      usa: "USASpending.gov (federal contracts)",
      epa: "EPA Air Quality System",
      state: "State weather modification permits",
    },

    finalCta: {
      title: "Pick one thing. Do it today.",
      description:
        "The data exists. The people just aren\u2019t connected yet. SkyLedger brings it together so citizens can see, prove, and act.",
      trackButton: "Track a Flight",
      evidenceButton: "See the Evidence",
      actionButton: "Take Action",
    },
  },

  footer: {
    description:
      "Citizen-powered transparency for weather modification accountability. Open source. Open data. Open skies.",
    platform: "Platform",
    liveMap: "Live Map",
    evidenceLedger: "Evidence Ledger",
    submitObservation: "Submit Observation",
    operatorProfiles: "Operator Profiles",
    takeAction: "Take Action",
    legalHub: "Legal Action Hub",
    foiaGenerator: "FOIA Generator",
    supportFight: "Support the Fight",
    testingGuide: "Testing Guide",
    protectYourself: "Protect Yourself",
    about: "About",
    missionMethodology: "Mission & Methodology",
    sourceCode: "Source Code",
    disclaimer:
      "All data sourced from public government databases and citizen observations. AGPL-3.0 Licensed. This platform does not make accusations \u2014 it presents documented observations and public records.",
  },
};

const es: typeof en = {
  nav: {
    trackFlights: "Rastrear Vuelos",
    learn: "Aprender",
    getInvolved: "Invol\u00FAcrate",
    funders: "Financiadores",
    about: "Acerca de",
  },

  home: {
    hero: {
      title: "\u00BFQu\u00E9 vuela sobre ti?",
      subtitle: "Podr\u00EDas sorprenderte.",
      description:
        "SkyLedger da a los ciudadanos una forma real de hacer algo sobre la manipulaci\u00F3n de nuestro cielo \u2014 rastrear vuelos, construir evidencia, seguir el dinero y unirse al movimiento que est\u00E1 aprobando leyes en todo Estados Unidos.",
    },
    pillars: {
      track: {
        title: "Rastrear y Etiquetar",
        description:
          "\u00BFVes algo en el cielo? Rastr\u00E9alo en vivo. Identifica al operador. Etiqueta a los sembradores de nubes conocidos. Env\u00EDa evidencia fotogr\u00E1fica \u2014 cruzamos autom\u00E1ticamente la hora y ubicaci\u00F3n de tu foto con datos de vuelo en tiempo real.",
        cta: "Rastr\u00E9alo ahora \u2192",
      },
      action: {
        title: "Tomar Acci\u00F3n",
        description:
          "Cartas listas para enviar a legisladores. Folletos imprimibles. Solicita registros gubernamentales. Apoya la demanda federal. Dona a las organizaciones en primera l\u00EDnea.",
        cta: "Invol\u00FAcrate \u2192",
      },
      learn: {
        title: "Ve la Evidencia",
        description:
          "Sigue el dinero. Lee el testimonio del Congreso. Mira qui\u00E9n financia esto. Cada afirmaci\u00F3n citada con registros gubernamentales y fuentes primarias.",
        cta: "Sigue el dinero \u2192",
      },
    },
    disclaimer:
      "Cada afirmaci\u00F3n en este sitio enlaza a su fuente gubernamental.",
    disclaimerLink: "Compru\u00E9balo t\u00FA mismo.",

    urgent: {
      badge: "ABRIL 2026",
      title: "Experimentos Comenzando Ahora",
      description:
        "Una empresa israel\u00ED se prepara para liberar part\u00EDculas secretas y patentadas en la estratosfera \u2014 y no le dicen a nadie qu\u00E9 contienen.",
      bullet1Label: "Cero datos publicados.",
      bullet1:
        "Sin investigaci\u00F3n revisada por pares. Sin evaluaci\u00F3n de seguridad p\u00FAblica. Sin consulta p\u00FAblica.",
      bullet2Label: "Financiamiento sospechoso.",
      bullet2:
        "$75M recaudados en menos de dos a\u00F1os \u2014 m\u00E1s que todas las dem\u00E1s startups de geoingenier\u00EDa combinadas.",
      bullet3Label: "V\u00EDnculos con inteligencia y defensa.",
      bullet3:
        "La junta asesora de su inversionista principal incluye un exjefe de inteligencia del Mossad, un excomandante de la Unidad 8200 de las FDI, y exdirectores de la CIA, FBI y MI5.",
      bullet4Pre:
        "Un cient\u00EDfico de Cornell dice que sus afirmaciones de seguridad",
      bullet4Quote1: "\u201Cno son confiables.\u201D",
      bullet4Mid:
        "El Centro de Derecho Ambiental Internacional califica sus planes como",
      bullet4Quote2: "\u201Cimprudentes.\u201D",
      cta: "Lee la investigaci\u00F3n completa \u2192",
    },

    stats: {
      bansLabel: "Estados con prohibiciones",
      bansValue: "3",
      bansDetail: "Tennessee, Florida, Louisiana",
      billsLabel: "Estados con proyectos de ley",
      billsValue: "30+",
      billsDetail: "Proyectos de ley en todo EE.UU.",
      federalLabel: "Proyecto de ley federal",
      federalValue: "Ley de Cielos Limpios",
      federalDetail: "H.R. 4403 \u2014 Congreso 119\u00BA",
      hearingLabel: "Audiencia del Congreso",
      hearingValue: "Sept 2025",
      hearingDetail:
        "\u201CJugando a ser Dios con el Clima\u201D",
    },

    tracker: {
      title: "Un clic. Total transparencia.",
      description:
        "Haz clic en cualquier aeronave en el rastreador en vivo y ve al instante todo lo que los datos p\u00FAblicos pueden revelar.",
      ownerLabel: "Qui\u00E9n es el propietario",
      ownerDetail:
        "Nombre del propietario registrado en la FAA, ciudad, estado. Ve qui\u00E9n est\u00E1 detr\u00E1s de la LLC.",
      destLabel: "A d\u00F3nde va",
      destDetail:
        "Aeropuertos de salida y llegada cuando est\u00E9n disponibles",
      typeLabel: "Qu\u00E9 tipo es",
      typeDetail: "Marca, modelo, a\u00F1o y foto de la aeronave",
      liveLabel: "Rastreo en vivo",
      liveDetail:
        "Posici\u00F3n, velocidad y rumbo en tiempo real + ruta de vuelo dibujada en el mapa",
      taggedLabel: "Etiquetado y registrado",
      taggedDetail:
        "Los operadores conocidos de modificaci\u00F3n clim\u00E1tica est\u00E1n etiquetados y registrados en el libro p\u00FAblico. Naranja = altitud baja-media (donde opera la siembra de nubes), p\u00FArpura = altitud superior (rango de crucero y SAI), rojo = operador conocido de modificaci\u00F3n clim\u00E1tica.",
      tamperLabel: "Registro a prueba de manipulaci\u00F3n",
      tamperDetail:
        "Cada dato proviene de fuentes gubernamentales. Hash SHA-256 \u2014 el mismo est\u00E1ndar de integridad usado en tribunales federales.",
      button: "Abrir Rastreador de Vuelos",
    },

    photo: {
      title: "\u00BFVes algo? Fotograf\u00EDalo.",
      descriptionPre:
        "Tu tel\u00E9fono es una herramienta de documentaci\u00F3n. Cada foto enviada a SkyLedger se etiqueta autom\u00E1ticamente con GPS, marca de tiempo y",
      sha256: "hash SHA-256",
      tooltipTitle: "\u00BFQu\u00E9 significa esto?",
      tooltipBody:
        "Cada foto recibe una huella digital \u00FAnica (hash SHA-256) en el momento de la carga. Si alguien cambia incluso un p\u00EDxel, el hash cambia \u2014 demostrando que la imagen no ha sido alterada. Este es el mismo est\u00E1ndar de integridad utilizado en procedimientos de evidencia digital federal (FRE 902(13)/(14)).",
      descriptionPost:
        "\u2014 creando un registro a prueba de manipulaci\u00F3n que no puede ser alterado despu\u00E9s del hecho.",
      caption:
        "Observaciones reales de ciudadanos de todo el pa\u00EDs. Fotos como estas ayudan a construir el registro p\u00FAblico.",
      button: "Enviar una Observaci\u00F3n",
    },

    knowledge: {
      title: "Los hechos, citados y documentados",
      description:
        "Ya seas esc\u00E9ptico o est\u00E9s preocupado, comienza aqu\u00ED. Cada afirmaci\u00F3n enlaza a su fuente \u2014 registros del Congreso, legislaci\u00F3n estatal, bases de datos gubernamentales, ciencia revisada por pares.",
      factsTitle: "Los Hechos",
      factsDescription:
        "Cada afirmaci\u00F3n citada. 70 a\u00F1os de programas, 9 estados activos, testimonio jurado, auditor\u00EDa del GAO. Una p\u00E1gina, descargable, compartible.",
      moneyTitle: "Sigue el Dinero",
      moneyDescription:
        "$150M+ de una peque\u00F1a red de inversionistas conectados. V\u00EDnculos con defensa. Conexiones con Epstein. Acceso pol\u00EDtico. El flujo de financiamiento mapeado.",
      operatorsTitle: "Qui\u00E9n lo Hace",
      operatorsDescription:
        "9 perfiles de operadores con fundadores, rondas de financiamiento, inversionistas y se\u00F1ales de alerta. Incluyendo Stardust Solutions \u2014 part\u00EDculas secretas, cient\u00EDficos nucleares, $75M.",
      legislationTitle: "Seguimiento de Legislaci\u00F3n",
      legislationDescription:
        "3 estados han promulgado prohibiciones. 30+ tienen proyectos de ley pendientes. Una prohibici\u00F3n federal est\u00E1 sobre la mesa. Sigue cada proyecto, cada voto, cada sanci\u00F3n.",
      readMore: "Leer m\u00E1s \u2192",
    },

    help: {
      title: "C\u00F3mo puedes ayudar",
      description:
        "Esta lucha la est\u00E1n ganando personas comunes que se presentan. As\u00ED es c\u00F3mo puedes involucrarte.",
      trackTitle: "Rastrea y Documenta",
      trackDescription:
        "Usa el rastreador de vuelos. Env\u00EDa observaciones con fotos. Cada dato construye el panorama.",
      trackButton: "Comenzar a Rastrear",
      learnTitle: "Aprende y Comparte",
      learnDescription:
        "Lee los hechos. Comp\u00E1rtelos. Env\u00EDa a alguien la p\u00E1gina de la audiencia del Congreso. El conocimiento es el primer paso.",
      learnButton: "Lee los Hechos",
      legalTitle: "Apoya la Acci\u00F3n Legal",
      legalDescription:
        "Organizaciones como The GeoFight est\u00E1n construyendo demandas federales. Tu estado puede tener un proyecto de ley pendiente ahora mismo.",
      legalButton: "Ve tu Estado",
    },

    dataSources: {
      title: "Nuestras fuentes de datos",
      description:
        "Cada dato proviene de una fuente p\u00FAblica verificable. Nosotros agregamos \u2014 el gobierno ya lo recopil\u00F3.",
      adsb: "ADS-B Exchange (rastreo de vuelos sin filtrar)",
      faa: "Registro de Aeronaves de la FAA (registros de propiedad)",
      noaa: "Informes de Modificaci\u00F3n Clim\u00E1tica de NOAA",
      usa: "USASpending.gov (contratos federales)",
      epa: "Sistema de Calidad del Aire de la EPA",
      state: "Permisos estatales de modificaci\u00F3n clim\u00E1tica",
    },

    finalCta: {
      title: "Elige una cosa. Hazla hoy.",
      description:
        "Los datos existen. Las personas a\u00FAn no est\u00E1n conectadas. SkyLedger lo re\u00FAne para que los ciudadanos puedan ver, demostrar y actuar.",
      trackButton: "Rastrear un Vuelo",
      evidenceButton: "Ve la Evidencia",
      actionButton: "Tomar Acci\u00F3n",
    },
  },

  footer: {
    description:
      "Transparencia impulsada por ciudadanos para la rendici\u00F3n de cuentas en modificaci\u00F3n clim\u00E1tica. C\u00F3digo abierto. Datos abiertos. Cielos abiertos.",
    platform: "Plataforma",
    liveMap: "Mapa en Vivo",
    evidenceLedger: "Registro de Evidencia",
    submitObservation: "Enviar Observaci\u00F3n",
    operatorProfiles: "Perfiles de Operadores",
    takeAction: "Tomar Acci\u00F3n",
    legalHub: "Centro de Acci\u00F3n Legal",
    foiaGenerator: "Generador FOIA",
    supportFight: "Apoya la Causa",
    testingGuide: "Gu\u00EDa de Pruebas",
    protectYourself: "Prot\u00E9gete",
    about: "Acerca de",
    missionMethodology: "Misi\u00F3n y Metodolog\u00EDa",
    sourceCode: "C\u00F3digo Fuente",
    disclaimer:
      "Todos los datos provienen de bases de datos gubernamentales p\u00FAblicas y observaciones ciudadanas. Licencia AGPL-3.0. Esta plataforma no hace acusaciones \u2014 presenta observaciones documentadas y registros p\u00FAblicos.",
  },
};

export const translations = { en, es } as const;
