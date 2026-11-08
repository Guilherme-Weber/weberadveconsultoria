# Francieli Weber — Advocacia e Consultoria Jurídica

Site institucional estático, publicado pelo GitHub Pages:
https://guilherme-weber.github.io/weberadveconsultoria/

## Estrutura

```
index.html               Página principal (os ícones SVG ficam no início do <body>)
404.html                 Página de "endereço não encontrado"
main.html                Redireciona o endereço antigo para a index.html
sitemap.xml              Mapa do site para o Google
css/estilos.css          Estilos do site (cores, fontes, fundos)
css/tailwind.css         Gerado automaticamente; não edite à mão (veja abaixo)
css/tailwind-entrada.css Arquivo de entrada do Tailwind
js/site.js               Comportamento (menu, formulário, vídeos e posts)
data/conteudos.json      Vídeos do YouTube e posts do Instagram/LinkedIn
.pages.yml               Configuração do painel de edição (Pages CMS)
img/                     Imagens usadas no site
originais/               Fotos e logos originais em alta qualidade (não são publicados)
```

O site é publicado pelo GitHub Actions ([.github/workflows/static.yml](.github/workflows/static.yml)),
que gera o CSS e envia **apenas** os arquivos do site: a pasta `originais/`
e os arquivos de configuração não ficam públicos. Se criar um arquivo novo que precise ir para o site
fora das pastas `css`, `js`, `data` e `img`, inclua-o na linha `cp -r` desse workflow.

Fontes: Google Fonts. Ícones: [Font Awesome Free](https://fontawesome.com) (CC BY 4.0),
embutidos como SVG, sem carregar a biblioteca inteira.

## Tailwind CSS (classes como `text-xl`, `md:grid-cols-2`)

O CSS do Tailwind é gerado a partir das classes usadas na `index.html` e no `js/site.js`.
O GitHub gera de novo a cada publicação, então o site publicado está sempre certo.
Para ver uma classe **nova** funcionando no computador antes de publicar
(requer [Node.js](https://nodejs.org)):

```
npm install      # só na primeira vez
npm run dev      # regera css/tailwind.css sempre que um arquivo é salvo
```

Para adicionar um ícone: copie o `<symbol>` do SVG em
[fontawesome.com/icons](https://fontawesome.com/search?ic=free) (ou do pacote
`@fortawesome/fontawesome-free`, pasta `svgs/`) para o bloco de ícones no início da
`index.html`, com `id="i-NOME"`, e use `<svg class="icon" aria-hidden="true"><use href="#i-NOME"/></svg>`.

## Adicionar vídeos e posts pelo painel (sem mexer em código)

1. Acesse **https://app.pagescms.org** e entre com a conta do GitHub.
2. Abra o repositório **weberadveconsultoria**.
3. Clique em **Conteúdos do site**. Adicione, edite ou remova vídeos e publicações.
4. Clique em **Save**. O site é atualizado sozinho em cerca de 1 a 2 minutos.

**Instagram:** o site tenta mostrar a publicação incorporada. Se o Instagram não permitir
(bloqueio do navegador ou incorporação desativada no perfil), aparece um cartão com a
*imagem de capa* e a *legenda curta* cadastradas no painel e o link "Ver no Instagram".
As imagens enviadas pelo painel ficam em `img/conteudos/`.

Quem for editar precisa de uma conta no GitHub com acesso ao repositório.
Para dar acesso: GitHub → repositório → *Settings* → *Collaborators* → *Add people*.

## Formulário de contato

As mensagens do formulário são enviadas para **fweber.adv@gmail.com** pelo serviço
gratuito [FormSubmit](https://formsubmit.co).

- **Primeira mensagem:** o FormSubmit envia um e-mail de confirmação para
  fweber.adv@gmail.com. É preciso clicar em **Activate Form** uma única vez.
  As mensagens seguintes chegam normalmente.
- **Opcional, contra spam:** depois de ativado, o FormSubmit envia um endereço alternativo
  (ex.: `https://formsubmit.co/abc123...`). Trocando o `action` do formulário na
  `index.html` por esse endereço, o e-mail deixa de aparecer no código do formulário.

## Outras atualizações

- **Fotos de fundo:** ficam em `img/` no formato WebP, em duas versões: `fundo-*.webp`
  (1920 px de largura) e `fundo-*-celular.webp` (1080 px, usada em telas pequenas).
  Para trocar uma foto, converta-a em [squoosh.app](https://squoosh.app) (formato WebP,
  qualidade ~70) nos dois tamanhos e substitua os arquivos mantendo os nomes. Guarde o
  original em `originais/`. As fotos atuais são do Unsplash (licença livre).
- **Cores:** ficam no topo de `css/estilos.css` (bloco `:root`).
- **Endereço do site:** se houver um domínio próprio, troque o endereço nas tags
  `canonical`, `og:url`, `og:image` e nos dados estruturados no início da `index.html`,
  além do `sitemap.xml` e dos caminhos `/weberadveconsultoria/` da `404.html`.
- **Google:** para o site aparecer mais rápido nas buscas, cadastre-o no
  [Google Search Console](https://search.google.com/search-console) e envie o endereço
  `https://guilherme-weber.github.io/weberadveconsultoria/sitemap.xml`.

## Visualizar no computador

Abrindo a `index.html` direto pelo navegador, a seção Conteúdos fica vazia, porque o
navegador bloqueia a leitura do `data/conteudos.json` fora de um servidor. Use a extensão
**Live Server** do VS Code (botão *Go Live*) ou veja o site publicado.
Os posts do Instagram só aparecem com o site publicado.
