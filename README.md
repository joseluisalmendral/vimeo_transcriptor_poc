# 📹 Vimeo Transcriptor POC

Una aplicación web moderna para extraer transcripciones automáticas de videos de Vimeo de forma masiva.

## ✨ Características

- **Procesamiento masivo**: Procesa múltiples URLs de Vimeo simultáneamente
- **Interfaz moderna**: Diseño responsive con Tailwind CSS v4.1 y modo oscuro
- **Chistes mientras esperas**: Entretenimiento durante el procesamiento
- **Múltiples formatos de URL**: Soporta diferentes formatos de URLs de Vimeo
- **Descarga y copia**: Opciones para copiar al portapapeles y descargar archivos .txt
- **Manejo de errores**: Gestión robusta de errores por video individual
- **Progreso en tiempo real**: Contador de progreso y estado de procesamiento

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ 
- Token de acceso personal de Vimeo

### Instalación

1. **Clona el repositorio**
   ```bash
   git clone <tu-repositorio>
   cd vimeo_transcriptor_poc
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   ```bash
   # Copia el archivo de ejemplo
   cp .env.example .env.development
   
   # Edita .env.development y añade tu token
   VITE_VIMEO_ACCESS_TOKEN=tu_token_de_vimeo_aqui
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre tu navegador en** `http://localhost:5173`

## 🔑 Obtener Token de Vimeo

1. Ve a [Vimeo Developer](https://developer.vimeo.com/apps)
2. Crea una nueva aplicación o usa una existente
3. Ve a "Authentication" y genera un "Personal Access Token"
4. Asegúrate de que tenga permisos de lectura ("Read")
5. Copia el token a tu archivo `.env.development`

**⚠️ Importante:** Solo funcionará con videos de tu propia cuenta de Vimeo, ya que se requiere un token personal del propietario.

## 🎯 Uso

1. **Pegar URLs**: Introduce las URLs de Vimeo en el campo de texto, una por línea o separadas por comas.

2. **Formatos soportados**:
   ```
   https://vimeo.com/1021420858/52b8cbc1dc?share=copy
   https://vimeo.com/846914777/d2eb34adb1
   https://vimeo.com/123456789
   ```

3. **Procesar**: Haz clic en "Obtener Transcripciones" y disfruta de los chistes mientras esperas.

4. **Resultados**: Copia o descarga las transcripciones individualmente o todas juntas.

## 📁 Estructura del Proyecto

```
src/
├── api/
│   └── vimeo.js              # Servicio API de Vimeo
├── components/
│   ├── UrlInput.jsx          # Input de URLs con preview
│   ├── LoadingJokes.jsx      # Chistes y progreso
│   ├── TranscriptList.jsx    # Lista de resultados
│   └── TranscriptCard.jsx    # Tarjeta individual
├── hooks/
│   └── useTranscripts.js     # Hook personalizado
├── utils/
│   ├── urlParser.js          # Parser de URLs de Vimeo
│   ├── jokes.js              # Chistes malos
│   └── download.js           # Utilidades de descarga
├── App.jsx                   # Componente principal
├── main.jsx                  # Punto de entrada
└── index.css                 # Estilos base
```

## 🛠️ Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter ESLint
```

## 🚀 Despliegue en Vercel

1. **Conecta tu repositorio a Vercel**

2. **Configura las variables de entorno en Vercel**:
   - Ve a Project Settings → Environment Variables
   - Añade `VITE_VIMEO_ACCESS_TOKEN` con tu token

3. **Despliega**:
   ```bash
   npm run build
   ```

## 🔧 Tecnologías Utilizadas

- **React 19**: Framework frontend
- **Vite 7**: Build tool y servidor de desarrollo
- **Tailwind CSS v4.1**: Framework de estilos
- **API de Vimeo**: Para obtener transcripciones
- **ESLint**: Linting de código

## 🔄 API de Vimeo Endpoints

La aplicación utiliza estos endpoints de la API de Vimeo:

```
GET /videos/{VIDEO_ID}/texttracks?include_transcript=true
GET /videos/{VIDEO_ID}/transcripts/{TEXTTRACK_ID}
```

## ⚠️ Limitaciones

- Solo funciona con videos que tengan transcripciones automáticas habilitadas
- Requiere token personal del propietario del video
- Sujeto a límites de rate limiting de la API de Vimeo
- Los videos privados necesitan permisos específicos

## 🐛 Solución de Problemas

### Error: "No hay transcripción disponible"
- Verifica que el video tenga transcripciones automáticas habilitadas
- Asegúrate de tener permisos para acceder al video

### Error: "403 Forbidden"
- Verifica que tu token sea válido
- Confirma que tienes permisos para acceder al video

### Error: "429 Too Many Requests"
- Has excedido el límite de la API
- Espera unos minutos antes de intentar de nuevo

## 📄 Licencia

Este proyecto es un POC (Proof of Concept) para uso educativo y de demostración.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

**¡Disfruta extrayendo transcripciones! 🎉**