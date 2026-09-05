

# Aprender con Cuentos

[![Deploy to GitHub Pages](https://github.com/ahashem/lernen-mit-geschichten/actions/workflows/deploy.yml/badge.svg)](https://github.com/ahashem/lernen-mit-geschichten/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Content License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content%20License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro)](https://astro.build)
[![Multilingual](https://img.shields.io/badge/Languages-5-blue)](https://github.com/ahashem/lernen-mit-geschichten)

> **Aprender valores a través de historias** - Enseñar a los niños valores y habilidades conductuales a través de historias interactivas multilingües.

Un sitio web educativo sin fines de lucro diseñado para niños de 3 a 7 años, que les ayuda a aprender habilidades importantes para la vida a través de historias atractivas. Desarrollado para padres, maestros y cuidadores de guarderías (KiTA) en Alemania.

## 🌍 Idiomas Soportados

- 🇩🇪 **Alemán** (Deutsch) - Idioma principal
- 🇸🇦 **Árabe** (العربية) - Soporte RTL
- 🇬🇧 **Inglés**
- 🇹🇷 **Turco** (Türkçe)
- 🇵🇰 **Urdu** (اردو) - Soporte RTL

## ✨ Características

- **📚 Historias Interactivas** - Narrativas atractivas con narración por voz (TTS) y animaciones de paso de páginas
- **🎯 Taxonomía de 58 Habilidades** - Historias mapeadas a habilidades emocionales, sociales, cognitivas y conductuales
- **🎨 Múltiples Formatos** - Modos de libro de cuentos estándar basados en texto e interactivos
- **🎧 Texto a Voz** - Narración basada en el navegador con resaltado de palabras
- **📱 Diseño Mobile-First** - Diseño totalmente responsivo optimizado para todos los dispositivos
- **♿ Accesibilidad** - Cumple con WCAG 2.1 AA con navegación por teclado y soporte para lectores de pantalla
- **🌐 Soporte RTL** - Diseño de derecha a izquierda para árabe y urdu
- **🔍 Filtrado Avanzado** - Búsqueda por habilidades, idioma, dificultad y palabras clave
- **📖 Modo de Impresión** - Diseño optimizado para folletos y lectura sin conexión
- **🚀 Rápido y Liviano** - Generación de sitios estáticos con JavaScript mínimo
- **🔒 Privacidad Primero** - Sin cuentas de usuario, sin rastreo, compatible con GDPR

## 🛠️ Stack Tecnológico

- **Framework**: [Astro](https://astro.build) - Generación de sitios estáticos
- **Estilos**: CSS con alcance (scoped) y soporte RTL
- **Interactividad**: JavaScript nativo (Web Speech API, Swiper.js)
- **Contenido**: Markdown con frontmatter YAML
- **Despliegue**: GitHub Pages con GitHub Actions
- **Fuente**: Noto Sans (cobertura exhaustiva de idiomas)

## 🚀 Primeros Pasos

### Requisitos Previos

- Node.js 22.x o superior
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/ahashem/lernen-mit-geschichten.git
cd lernen-mit-geschichten

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev       # Iniciar servidor de desarrollo en http://localhost:4321
npm run build     # Compilar para producción
npm run preview   # Previsualizar la compilación de producción localmente
```

## 📂 Estructura del Proyecto

```
├── src/
│   ├── components/          # Componentes reutilizables de Astro
│   │   ├── StoryCard.astro
│   │   ├── InteractiveStorybook.astro
│   │   ├── QuizInteractive.astro
│   │   └── ...
│   ├── content/
│   │   └── stories/         # Historias en Markdown por idioma
│   │       ├── de/          # Historias en alemán
│   │       ├── ar/          # Historias en árabe
│   │       ├── en/          # Historias en inglés
│   │       ├── tr/          # Historias en turco
│   │       └── ur/          # Historias en urdu
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── StoryLayout.astro
│   ├── locales/             # Archivos JSON de i18n
│   │   ├── de.json
│   │   ├── ar.json
│   │   └── ...
│   └── utils/
│       ├── skills-taxonomy.ts
│       └── i18n.ts
├── public/                  # Recursos estáticos
├── .github/workflows/       # GitHub Actions
└── astro.config.mjs        # Configuración de Astro
```

## 🎓 Taxonomía de Habilidades

Las historias se mapean a **58 habilidades** en 4 categorías:

### 🎭 Habilidades Emocionales

Autoconciencia, regulación emocional, empatía, paciencia, control de impulsos

### 🤝 Habilidades Sociales

Comunicación, cooperación, resolución de conflictos, liderazgo, respeto

### 🧠 Habilidades Cognitivas

Resolución de problemas, toma de decisiones, pensamiento crítico, adaptabilidad, establecimiento de objetivos

### 🌱 Habilidades Conductuales

Responsabilidad, honestidad, persistencia, autodisciplina, gestión del tiempo

## 📖 Formato de Historias

### Formato Estándar

- Texto narrativo
- Mensajes clave
- Actividades interactivas (verdadero/falso, opción múltiple, completar espacios)

### Formato Interactivo

- Narrativa página por página con Swiper.js
- Narración por voz (Texto a Voz) con Web Speech API
- Isla de controles flotante (reproducir/pausar, velocidad, volumen)
- Modo de reproducción automática
- Seguimiento del progreso (localStorage)

## 🚀 Despliegue

### GitHub Pages

Este proyecto está configurado para el despliegue automático en GitHub Pages:

1. **Despliegue Automático**: Cada envío a `main` activa una compilación a través de GitHub Actions
2. **URL en Vivo**: `https://ahashem.github.io/lernen-mit-geschichten/`
3. **Configuración**: Habilitar GitHub Pages en la configuración del repositorio → Pages → Origen: GitHub Actions

### Despliegue Manual

```bash
npm run build
# Desplegar la carpeta dist/ en tu proveedor de alojamiento
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Este es un proyecto educativo impulsado por la comunidad.

### Formas de Contribuir:

- **Traducir historias** a idiomas adicionales
- **Agregar nuevas historias** siguiendo las directrices de formato de contenido
- **Mejorar las funciones** de accesibilidad
- **Informar errores** o sugerir características

Consulta [CONTRIBUTING.md](./CONTRIBUTING.md) para las directrices detalladas de contribución.

## 📋 Directrices de Contenido

- Las historias deben estar dirigidas a niños de 3 a 7 años
- Cada historia se mapea a 1-3 habilidades de la taxonomía
- Incluir 3 tipos de actividades: verdadero/falso, opción múltiple, completar espacios
- Se requiere traducción profesional (no usar traducción automática)
- El diseño RTL debe probarse para árabe/urdu

## 📄 Licencia

- **Código**: [Licencia MIT](LICENSE) - Libre para uso y modificación
- **Contenido**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) - Uso no comercial con atribución

## 🙏 Agradecimientos

- Construido con [Astro](https://astro.build)
- Iconos y emojis para la representación de personajes
- Familia de fuentes [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans)
- Traductores y colaboradores de la comunidad

## 📞 Contacto y Soporte

- **Problemas**: [Issues de GitHub](https://github.com/ahashem/lernen-mit-geschichten/issues)
- **Discusiones**: [Discusiones de GitHub](https://github.com/ahashem/lernen-mit-geschichten/discussions)
