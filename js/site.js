// --- Menu mobile ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuIcon = mobileMenuButton.querySelector('i');
const header = document.getElementById('header');

function setMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    mobileMenuIcon.classList.toggle('fa-bars', !open);
    mobileMenuIcon.classList.toggle('fa-xmark', open);
    mobileMenuButton.setAttribute('aria-expanded', String(open));
    mobileMenuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    header.classList.toggle('scrolled', open || window.scrollY > 40);
}
mobileMenuButton.addEventListener('click', () => setMenu(mobileMenu.classList.contains('hidden')));
document.querySelectorAll('#mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// --- Formulário de contato (FormSubmit → fweber.adv@gmail.com) ---
// Envia sem sair da página. Sem JavaScript, o formulário é enviado normalmente pelo "action".
(function formContato() {
    const form = document.getElementById('form-contato');
    if (!form) return;
    const status = document.getElementById('form-status');
    const botao = form.querySelector('button[type="submit"]');

    function mostrar(msg, tipo) {
        status.textContent = msg;
        status.className = 'text-sm mt-4 ' + tipo;
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (form._honey.value) return;               // armadilha contra robôs de spam
        botao.disabled = true;
        mostrar('Enviando…', '');
        try {
            const resp = await fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
                method: 'POST',
                headers: { 'Accept': 'application/json' },
                body: new FormData(form)
            });
            const dados = await resp.json().catch(() => ({}));
            if (!resp.ok || String(dados.success) === 'false') throw new Error(dados.message || resp.status);
            form.reset();
            mostrar('Mensagem enviada! Retornarei seu contato em breve.', 'ok');
        } catch (err) {
            console.error('Falha no envio do formulário:', err);
            mostrar('Não foi possível enviar a mensagem agora. Tente pelo WhatsApp ou escreva para fweber.adv@gmail.com.', 'erro');
        } finally {
            botao.disabled = false;
        }
    });
})();

// --- Conteúdos (YouTube / Instagram / LinkedIn) ---
// Os itens vêm de data/conteudos.json, editado pelo painel (Pages CMS) ou à mão.
// Observação: abrindo o arquivo direto do computador (file://) o navegador bloqueia
// a leitura do JSON — use o site publicado ou um servidor local (ex.: Live Server).
fetch('./data/conteudos.json', { cache: 'no-cache' })
    .then(r => r.ok ? r.json() : {})
    .catch(() => ({}))
    .then(renderConteudos);

function renderConteudos(cfg) {
    cfg = cfg || {};
    const urlDe = item => String((item && typeof item === 'object' ? item.url : item) || '').trim();
    const videos = (cfg.youtube || []).map(v => ({ url: urlDe(v), titulo: (v && v.titulo) || '' })).filter(v => v.url);
    // Instagram: aceita o link da publicação ou o código "Incorporar" inteiro
    const instagram = (cfg.instagram || []).map(item => {
        const post = instagramPost(urlDe(item));
        if (!post) return null;
        return Object.assign(post, {
            legenda: (item && item.legenda) || '',
            imagem: (item && item.imagem) || ''
        });
    }).filter(Boolean);
    const linkedin = (cfg.linkedin || []).map(urlDe).filter(Boolean);

    function instagramPost(texto) {
        const m = texto.match(/instagram\.com\/(?:[\w.]+\/)?(p|reel|tv)\/([\w-]+)/);
        if (!m) { if (texto) console.warn('Link do Instagram não reconhecido:', texto); return null; }
        return { tipo: m[1], codigo: m[2] };
    }
    function youtubeId(url) {
        const m = String(url).match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
        return m ? m[1] : null;
    }
    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    // Vídeos: mostra a miniatura e só carrega o player ao clicar (site mais leve)
    const listaVideos = document.getElementById('lista-videos');
    videos.forEach(v => {
        const id = youtubeId(v.url);
        if (!id) { console.warn('Link do YouTube não reconhecido:', v.url); return; }
        const titulo = v.titulo ? escapeHtml(v.titulo) : 'Assistir vídeo';
        const card = document.createElement('div');
        card.className = 'card card-hover overflow-hidden';
        card.innerHTML = `
            <button type="button" class="yt-facade" style="background-image:url('https://i.ytimg.com/vi/${id}/hqdefault.jpg')" aria-label="Reproduzir: ${titulo}">
                <span class="yt-play"><i class="fa-solid fa-play" aria-hidden="true"></i></span>
            </button>
            ${v.titulo ? `<div class="p-5"><h4 class="text-xl font-semibold">${titulo}</h4></div>` : ''}`;
        card.querySelector('button').addEventListener('click', e => {
            const iframe = document.createElement('iframe');
            iframe.className = 'yt-frame';
            iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
            iframe.title = v.titulo || 'Vídeo do YouTube';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            e.currentTarget.replaceWith(iframe);
        });
        listaVideos.appendChild(card);
    });

    // Redes sociais
    const listaRedes = document.getElementById('lista-redes');
    // Instagram: o cartão próprio (imagem + legenda opcionais) aparece sempre.
    // Em paralelo, o post incorporado carrega escondido e só substitui o cartão quando o
    // Instagram confirma que renderizou (mensagem MEASURE). Assim nunca fica um quadro branco
    // quando a incorporação é bloqueada pelo navegador ou desativada no perfil.
    instagram.forEach(post => {
        const link = `https://www.instagram.com/${post.tipo}/${post.codigo}/`;
        const legenda = escapeHtml(post.legenda);
        const imagem = post.imagem && (/^https?:\/\//.test(post.imagem) ? post.imagem : './' + post.imagem.replace(/^\.?\/+/, ''));
        const wrap = document.createElement('div');
        wrap.className = 'card card-hover social-embed ig-card';
        wrap.innerHTML = `
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="ig-preview">
                ${imagem
                    ? `<img src="${escapeHtml(imagem)}" alt="${legenda || 'Publicação no Instagram'}" loading="lazy" class="ig-thumb">`
                    : `<span class="ig-placeholder"><i class="fa-brands fa-instagram" aria-hidden="true"></i><span>Publicação no Instagram</span></span>`}
                ${legenda ? `<span class="ig-legenda">${legenda}</span>` : ''}
            </a>
            <iframe class="ig-frame" src="${link}embed/captioned/" height="640" width="100%" frameborder="0" scrolling="no" allowtransparency="true" title="Publicação no Instagram" tabindex="-1" aria-hidden="true"></iframe>
            <a href="${link}" target="_blank" rel="noopener noreferrer" class="social-link"><i class="fa-brands fa-instagram" aria-hidden="true"></i> Ver no Instagram</a>`;
        listaRedes.appendChild(wrap);
    });
    linkedin.forEach(url => {
        // Aceita o código "Incorporar" inteiro, o endereço do embed ou o link normal da publicação
        // (links curtos lnkd.in não funcionam: abra o link e copie o endereço completo)
        let urn = (url.match(/urn:li:(?:share|ugcPost|activity):\d+/) || [])[0];
        if (!urn) {
            const m = url.match(/(share|ugcPost|activity)-(\d{10,})/);
            if (m) urn = `urn:li:${m[1]}:${m[2]}`;
        }
        if (!urn) { console.warn('Link do LinkedIn não reconhecido:', url); return; }
        const src = `https://www.linkedin.com/embed/feed/update/${urn}`;
        const wrap = document.createElement('div');
        wrap.className = 'card social-embed';
        wrap.innerHTML = `<iframe src="${escapeHtml(src)}" height="560" width="100%" frameborder="0" allowfullscreen loading="lazy" title="Publicação no LinkedIn"></iframe>
            <a href="https://www.linkedin.com/feed/update/${urn}/" target="_blank" rel="noopener noreferrer" class="social-link"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i> Ver no LinkedIn</a>`;
        listaRedes.appendChild(wrap);
    });

    const temVideos = listaVideos.children.length > 0;
    const temRedes = listaRedes.children.length > 0;
    document.getElementById('bloco-videos').classList.toggle('hidden', !temVideos);
    document.getElementById('bloco-redes').classList.toggle('hidden', !temRedes);
    document.getElementById('conteudos-vazio').classList.toggle('hidden', temVideos || temRedes);

}

// Ajusta a altura dos posts do Instagram: o iframe informa o próprio tamanho por postMessage
window.addEventListener('message', e => {
    if (!/^https:\/\/(www\.)?instagram\.com$/.test(e.origin)) return;
    let dados = e.data;
    try { if (typeof dados === 'string') dados = JSON.parse(dados); } catch (_) { return; }
    const altura = dados && dados.type === 'MEASURE' && dados.details && Number(dados.details.height);
    if (!altura) return;
    document.querySelectorAll('.ig-frame').forEach(frame => {
        if (frame.contentWindow !== e.source) return;
        frame.height = Math.ceil(altura);
        if (frame.classList.contains('ig-ok')) return;
        // O post carregou: mostra a incorporação no lugar do cartão
        frame.classList.add('ig-ok');
        frame.removeAttribute('aria-hidden');
        frame.removeAttribute('tabindex');
        const card = frame.closest('.ig-card');
        card.classList.remove('card-hover');
        const preview = card.querySelector('.ig-preview');
        if (preview) preview.remove();
    });
});

// --- Animações ao rolar ---
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- Cabeçalho e link ativo ao rolar ---
const sections = document.querySelectorAll('main section');
const navLinks = document.querySelectorAll('.nav-link');
let ticking = false;
function onScroll() {
    ticking = false;
    header.classList.toggle('scrolled', window.scrollY > 40 || !mobileMenu.classList.contains('hidden'));
    let current = 'home';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 90) current = section.id;
    });
    navLinks.forEach(link => {
        const ativo = link.getAttribute('href') === '#' + current;
        link.classList.toggle('active', ativo);
        if (ativo) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
    });
}
window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

// --- Ano do rodapé ---
document.getElementById('year').textContent = new Date().getFullYear();
