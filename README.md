<p align="center">
  <img src="https://github.com/Henrique-Jost/hack4edu/blob/main/docs/Images/bussola-de-objetivo--de-estrategia-de-negocios.png" width="550" title="Brújula IA">
</p>

# LangIA Brújula | Aprendizaje de idiomas asistido para contextos multilaterales

Brújula | Plataforma de Tutores Inteligentes

Este proyecto se inició a partir de una bifurcación del repositorio de Vercel. Nuestro objetivo es crear una plataforma innovadora que permita a los profesores crear tutores inteligentes para sus estudiantes, brindando una experiencia de aprendizaje interactiva y personalizada.

## Objetivo del proyecto

La plataforma tiene como objetivo permitir la creación de tutores inteligentes por parte de los profesores, donde los estudiantes podrán interactuar con estos tutores utilizando una interfaz orientada al audio. Los profesores tendrán acceso a análisis detallados de las interacciones de los estudiantes, incluidas métricas analíticas y sentimentales basadas en las preguntas formuladas al tutor.

### Características principales:

1. **Interacción con el tutor a través de modelos básicos de audio**: utilizando tecnologías como **hume.ai** (o alternativas), los estudiantes podrán hacer preguntas a los tutores verbalmente y recibir respuestas en audio.
2. **Creación de tutores por parte de los profesores**: Los profesores tendrán la libertad de crear y personalizar tutores, ajustándolos a las necesidades de sus alumnos.
3. **Análisis de interacción**: la plataforma proporcionará a los profesores informes sobre las interacciones de los estudiantes con los tutores, que incluyen:
   - Análisis de sentimiento de las preguntas formuladas por los estudiantes.
   - Informes analíticos detallados sobre el desempeño y la participación de los estudiantes.

## Tecnologías utilizadas

Este proyecto fue construido utilizando las siguientes tecnologías:

- **@ai-sdk/openai**
- **@langchain/textsplitters**
- **@vercel/analytics**
- **@vercel/blob**
- **@vercel/kv**
- **ai**
- **bcrypt-ts**
- **classnames**
- **d3-scale**
- **date-fns**
- **dotenv**
- **drizzle-orm** (orm para banco de dados)
- **framer-motion**
- **next.js**
- **next-auth**
- **openai-api**
- **hume-ai** (em estudo)
- **pdf-parse**
- **postgres-vector** (Será adicionado como banco de dados vetorial)
- **react**
- **react-dom**
- **react-markdown**
- **remark-gfm**
- **sonner**
- **swr**
- **use-local-storage**
- **usehooks-ts**
- **zod**

### Adiciones futuras

- **Base de datos vectorial**: se agregará soporte para la base de datos vectorial **Postgres**, que almacenará datos vectoriales relacionados con las interacciones de los estudiantes con los tutores.
- **Modelo de lenguaje orientado al audio**: Uno de los principales enfoques del proyecto será la implementación de un modelo de lenguaje que permita la interacción de audio, permitiendo a los estudiantes hacer preguntas verbalmente al tutor.

## Estructura del proyecto

Este proyecto se basa en el marco **Next.js**, con soporte para autenticación a través de **next-auth** y almacenamiento en **Postgres**. Usamos **Tailwind CSS** para diseñar y **drizzle-orm** para la gestión de bases de datos.

## Contribuciones y desarrollo

Este repositorio es una **bifurcación** del repositorio **Vercel**, pero toda la configuración, el alojamiento y la infraestructura son administrados por nuestro equipo. Además, todas las API utilizadas son nuestra responsabilidad.

El desarrollo de este proyecto se está llevando a cabo como parte del evento **Hack4Edu**, enfocándose en crear una plataforma innovadora para facilitar el aprendizaje y la interacción entre estudiantes y tutores inteligentes.

---

Demostración del modelo - Template [Vercel](https://vercel.com/templates/next.js/ai-sdk-internal-knowledge-base).
