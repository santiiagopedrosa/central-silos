// 1. Efeito da Barra de Navegação ao fazer Scroll
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 2. Animação de Scroll Reveal (Elementos aparecem ao descer a página)
// Selecionamos todos os elementos que têm a classe 'scroll-reveal'
const revealElements = document.querySelectorAll('.scroll-reveal');

// Configuramos o observador
const revealOptions = {
    threshold: 0.15, // O elemento aparece quando 15% dele está visível no ecrã
    rootMargin: "0px 0px -50px 0px" // Dispara ligeiramente antes de chegar ao fundo
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        // Se o elemento estiver no ecrã
        if (entry.isIntersecting) {
            entry.target.classList.add('active'); // Adiciona a classe que faz a animação
            observer.unobserve(entry.target); // Para de observar após animar (ocorre apenas 1 vez)
        }
    });
}, revealOptions);

// Atribuímos o observador a cada elemento
revealElements.forEach(el => {
    revealOnScroll.observe(el);
});


function updateBarStatus() {
    const now = new Date();
    const day = now.getDay(); // 0: Dom, 1: Seg, 2: Ter, 3: Qua, 4: Qui, 5: Sex, 6: Sáb
    const hour = now.getHours();
    
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');

    let isOpen = false;

    // Lógica por dia da semana
    switch (day) {
        case 1: // Segunda
        case 2: // Terça
        case 3: // Quarta
        case 4: // Quinta
            // Abre às 17h, fecha às 02h (madrugada do dia seguinte)
            if (hour >= 17 || hour < 2) isOpen = true;
            break;
            
        case 5: // Sexta
            // Abre às 14h, fecha às 03h (madrugada de Sábado)
            if (hour >= 14 || hour < 3) isOpen = true;
            break;
            
        case 6: // Sábado
            // Abre às 14h, fecha às 03h (madrugada de Domingo)
            if (hour >= 14 || hour < 3) isOpen = true;
            break;
            
        case 0: // Domingo
            // Abre às 14h, fecha às 02h (madrugada de Segunda)
            if (hour >= 14 || hour < 2) isOpen = true;
            break;
    }

    if (isOpen) {
        statusDot.style.color = "#f4ea8c"; // Amarelo Silos
        statusText.innerText = "ABERTO AGORA • PASSA POR CÁ";
        statusText.style.color = "#f4ea8c";
    } else {
        statusDot.style.color = "#555";
        statusText.innerText = "FECHADO • CONSULTA O HORÁRIO";
        statusText.style.color = "#a0a0a0";
    }
}

// Inicia a função
updateBarStatus();
// Atualiza a cada 30 segundos
setInterval(updateBarStatus, 30000);


document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    const navbar = document.getElementById('navbar');

    // 1. Abrir/Fechar Menu
    if (mobileMenu && navList) {
        mobileMenu.onclick = () => {
            mobileMenu.classList.toggle('is-active');
            navList.classList.toggle('active');
        };
    }

    // 2. Fechar menu ao clicar num link
    document.querySelectorAll('.nav-list a').forEach(link => {
        link.onclick = () => {
            mobileMenu.classList.remove('is-active');
            navList.classList.remove('active');
        };
    });

    // 3. Efeito de Scroll na Navbar
    window.onscroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
});


// Fecha o menu ao clicar num link (para não ficar aberto ao mudar de página)
document.querySelectorAll('.nav-list a').forEach(n => n.addEventListener('click', () => {
    mobileMenu.classList.remove('is-active');
    navList.classList.remove('active');
}));

// Espera o documento estar todo carregado
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    if (mobileMenu && navList) {
        mobileMenu.addEventListener('click', function() {
            // Alterna a classe 'active' na lista
            navList.classList.toggle('active');
            // Alterna uma classe no botão para animação (opcional)
            mobileMenu.classList.toggle('is-active');
            console.log("Menu Mobile alternado!"); 
        });
    }
});

async function carregarGaleria() {
    const grid = document.getElementById('grid-fotos');
    
    // 1. Pedir a lista de ficheiros ao bucket 'fotos-album'
    const { data, error } = await supabase.storage
        .from('fotos-album')
        .list('', {
            limit: 50,
            offset: 0,
            sortBy: { column: 'created_at', order: 'desc' } // As mais recentes primeiro
        });

    if (error) {
        console.error("Erro ao carregar fotos:", error.message);
        return;
    }

    if (data) {
        grid.innerHTML = ""; // Limpa o "A carregar..."

        data.forEach(foto => {
            // Ignorar ficheiros do sistema do Supabase se existirem
            if (foto.name === ".emptyFolderPlaceholder") return;

            // 2. Gerar o link público da imagem
            const { data: { publicUrl } } = supabase.storage
                .from('fotos-album')
                .getPublicUrl(foto.name);

            // 3. Criar o HTML da foto
            const imgContainer = document.createElement('div');
            imgContainer.className = 'photo-card scroll-reveal active';
            imgContainer.innerHTML = `
                <img src="${publicUrl}" alt="Momento Central Silos" loading="lazy">
            `;
            
            grid.appendChild(imgContainer);
        });
    }
}

// Executar a função se estivermos na página do álbum
if (document.getElementById('grid-fotos')) {
    carregarGaleria();
}

