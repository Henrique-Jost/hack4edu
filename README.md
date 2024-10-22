# LangIA Brújula | Aprendizaje de idiomas asistido para contextos multilaterales

Compass | Plataforma de Tutores Inteligentes

Este projeto foi iniciado a partir de um fork do repositório da **Vercel**. Nosso objetivo é criar uma plataforma inovadora que permita a professores criar tutores inteligentes para seus alunos, proporcionando uma experiência de aprendizado interativa e personalizada.

## Objetivo do Projeto

A plataforma visa possibilitar a criação de tutores inteligentes por professores, onde os alunos poderão interagir com esses tutores usando uma interface orientada a áudio. Professores terão acesso a análises detalhadas sobre as interações dos alunos, incluindo métricas analíticas e sentimentais baseadas nas perguntas feitas ao tutor.

### Funcionalidades principais:

1. **Interação com o tutor via audio foundation models**: Utilizando tecnologias como **hume.ai** (ou alternativas), os alunos poderão fazer perguntas aos tutores de forma verbal e receber respostas em áudio.
2. **Criação de tutores pelos professores**: Professores terão a liberdade de criar e customizar tutores, ajustando-os às necessidades dos seus alunos.
3. **Análise de interações**: A plataforma fornecerá aos professores relatórios sobre as interações dos alunos com os tutores, incluindo:
   - Análise de sentimentos das perguntas feitas pelos alunos.
   - Relatórios analíticos detalhados sobre o desempenho e engajamento dos alunos.

## Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

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

### Futuras Adições

- **Banco de Dados Vetorial**: Será adicionado suporte ao banco de dados vetorial **Postgres**, que armazenará dados vetoriais relacionados às interações dos alunos com os tutores.
- **Modelo de Linguagem Orientado a Áudio**: Um dos principais focos do projeto será a implementação de um modelo de linguagem que permita a interação por áudio, possibilitando que os alunos façam perguntas verbalmente ao tutor.

## Estrutura do Projeto

Este projeto é baseado no framework **Next.js**, com suporte para autenticação via **next-auth** e armazenamento em **Postgres**. Utilizamos **Tailwind CSS** para estilização e **drizzle-orm** para gerenciamento de banco de dados.

## Contribuições e Desenvolvimento

Este repositório é um **fork** do repositório da **Vercel**, porém toda a configuração, hospedagem e infraestrutura são gerenciadas por nossa equipe. Além disso, todas as APIs utilizadas são de nossa responsabilidade.

O desenvolvimento deste projeto está sendo realizado como parte do evento **Hack4Edu**, com foco na criação de uma plataforma inovadora para facilitar o aprendizado e a interação entre alunos e tutores inteligentes.

---

Starter Template [Vercel](https://vercel.com/templates/next.js/ai-sdk-internal-knowledge-base).
