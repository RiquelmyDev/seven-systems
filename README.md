# Seven Systems

Landing page institucional da **Seven Systems**, criada com **React + Vite** para apresentar a empresa, destacar seus serviços e direcionar o contato direto via WhatsApp.

## Visão geral

O projeto foi pensado como uma presença digital objetiva para negócios locais e inclui:

- Hero com chamada principal e CTA para WhatsApp
- Seção sobre o problema e a proposta da marca
- Seção institucional "Quem somos"
- Pilares de atuação
- Como trabalhamos
- Cards de serviços
- CTA final para conversão
- Navegação responsiva com menu mobile
- Botão flutuante de WhatsApp
- Animação 3D no hero com `three.js`

## Tecnologias

- React 19
- Vite
- Three.js
- CSS puro
- ESLint

## Estrutura

```bash
ss_page/
├── src/
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── vite.config.js
```

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Iniciar o ambiente de desenvolvimento

```bash
npm run dev
```

O projeto ficará disponível no endereço exibido pelo Vite.

## Build de produção

```bash
npm run build
```

## Pré-visualizar o build

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Coleta de leads com Google Places

O script `npm run places:prospect` consulta a Places API (New) para gerar uma lista inicial de estabelecimentos com foco em Coronel Fabriciano, usando Ipatinga e Timóteo como apoio.

### Pré-requisitos

- variável de ambiente `GOOGLE_MAPS_API_KEY`
- projeto Google Cloud com billing ativo
- API restrita apenas à `Places API (New)`

### Restrição recomendada da chave

Como esse script faz chamadas de web service pelo servidor, a restrição de aplicativo recomendada é:

- `IP addresses` se o script rodar em um servidor/VPS com IP fixo
- `None` apenas para testes locais curtos
- `HTTP referrers` só se a chave for usada no frontend de um site, não para esse script

### Execução

```bash
GOOGLE_MAPS_API_KEY=seu_valor_aqui npm run places:prospect
```

Alternativa (recomendado para não exportar no terminal): crie `ss_page/.env.local` com `GOOGLE_MAPS_API_KEY=...` e rode `npm run places:prospect`.

### Saída

O script gera dois arquivos em `ss_page/prospeccao/`:

- `leads-google-places.json`
- `leads-google-places.csv`

### Campos solicitados

O `FieldMask` foi limitado aos campos necessários para reduzir custo:

- `places.id`
- `places.displayName`
- `places.formattedAddress`
- `places.nationalPhoneNumber`
- `places.websiteUri`
- `places.rating`
- `places.userRatingCount`
- `places.businessStatus`
- `places.googleMapsUri`

## Personalização

Se quiser adaptar o projeto para outro negócio, os principais pontos de ajuste são:

- textos e CTAs em `src/components/*`
- link e mensagens do WhatsApp em `src/utils/whatsapp.js`
- identidade visual em `src/index.css`

## Contato

O site usa integração direta com WhatsApp para iniciar conversas com potenciais clientes.

---

Feito para apresentar a Seven Systems de forma clara, profissional e direta.
