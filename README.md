# Francieli Weber — Advocacia e Consultoria Jurídica

Site institucional estático, publicado pelo GitHub Pages:
https://guilherme-weber.github.io/weberadveconsultoria/

## Estrutura

```
index.html            Página principal
main.html             Redireciona o endereço antigo para a index.html
css/estilos.css       Estilos do site (cores, fontes, fundos)
js/site.js            Comportamento (menu, animações, formulário, vídeos e posts)
data/conteudos.json   Vídeos do YouTube e posts do Instagram/LinkedIn
.pages.yml            Configuração do painel de edição (Pages CMS)
img/                  Imagens (fotos de fundo, logo, foto de perfil)
```

Bibliotecas carregadas por CDN: Tailwind CSS 3.4.16, Font Awesome 7 e Google Fonts.

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

- **Fotos de fundo:** substitua os arquivos `img/fundo-*.jpg` mantendo o mesmo nome.
  As fotos atuais são do Unsplash (licença livre).
- **Cores:** ficam no topo de `css/estilos.css` (bloco `:root`).
- **Endereço do site:** se houver um domínio próprio, troque o endereço nas tags
  `canonical`, `og:url`, `og:image` e nos dados estruturados no início da `index.html`.

## Visualizar no computador

Abrindo a `index.html` direto pelo navegador, a seção Conteúdos fica vazia, porque o
navegador bloqueia a leitura do `data/conteudos.json` fora de um servidor. Use a extensão
**Live Server** do VS Code (botão *Go Live*) ou veja o site publicado.
Os posts do Instagram só aparecem com o site publicado.
