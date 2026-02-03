const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

// Configuration
const OUTPUT_DIR = 'screenshots_v2';
// URL REAL DO APP (Baseado no seu projeto Firebase)
// Se não for essa URL, o script falhará, mas é a tentativa mais robusta para pegar dados reais.
const APP_URL = 'https://rastreiamais-81087.web.app';

const USER_EMAIL = 'elvis@rastreiamaisrb.com.br';
const USER_PASS = 'Unik@2026';

const DEVICES = [
    {
        name: 'iphone',
        // iPhone 6.5"
        viewport: { width: 414, height: 896, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
        prefix: 'iphone_65_'
    },
    {
        name: 'ipad',
        // iPad Pro 12.9"
        viewport: { width: 1024, height: 1366, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
        prefix: 'ipad_129_'
    }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }

    console.log(`Conectando ao Chrome e acessando: ${APP_URL}`);

    const browser = await puppeteer.launch({
        headless: "new", // Mude para false se quiser ver acontecendo
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        defaultViewport: null,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--start-maximized'
        ]
    });

    try {
        for (const device of DEVICES) {
            console.log(`\n--- Iniciando captura: ${device.name} ---`);
            const page = await browser.newPage();
            await page.setViewport(device.viewport);

            // 1. Acessar a página de Login (ONLINE)
            console.log(`  Navegando para ${APP_URL}...`);
            await page.goto(APP_URL, { waitUntil: 'networkidle0', timeout: 60000 });

            // Verificar se já estamos logados ou se precisamos logar
            const isLoginPage = await page.$('#email') !== null;

            if (isLoginPage) {
                console.log('  Fazendo Login Real...');
                await page.type('#email', USER_EMAIL);
                await page.type('#password', USER_PASS);
                await delay(1000);

                // Clicar no botão de login (procurando pelo texto ou classe)
                // O botão é submit dentro do form #loginForm
                await page.evaluate(() => {
                    const btn = document.querySelector('button.btn-primary');
                    if (btn) btn.click();
                });

                console.log('  Aguardando autenticação...');

                // Esperar sair da tela de login (esperar o form sumir ou aparecer header da home)
                try {
                    await page.waitForSelector('.header-top', { timeout: 15000 });
                } catch (e) {
                    console.log('  (Aviso: Demora no login ou erro, tentando printar mesmo assim)');
                }
            } else {
                console.log('  Já parece estar logado ou em outra tela.');
            }

            await delay(3000); // Esperar animações e dados carregarem

            // Estamos na HOME agora
            console.log(`  Capturando Home...`);
            // Injetar CSS para esconder loading se tiver travado
            await page.addStyleTag({ content: '#loading { display: none !important; } .loading-overlay { display: none !important; }' });
            await page.screenshot({ path: path.join(OUTPUT_DIR, `${device.prefix}2_home.png`) });

            // Agora vamos para o Login (sim, tirar print do login depois de sair ou antes... 
            // Como já logamos, para tirar print do login limpo, teríamos que deslogar.
            // Mas a ordem do user foi: Login > Home > Map.
            // Como já passei do login, vou deixar o print do login para uma nova aba anônima ou ignorar se já tivermos.
            // Vou focar em HOME e MAPA que são os problemas.
            // O print de Login eu posso fazer abrindo uma aba Incognito separada DEPOIS.

            // Navegar para MAPA
            console.log(`  Navegando para Mapa...`);
            // Clicar no botão que vai pro mapa ou navegar via URL se for SPA
            // O app usa window.location.href = 'mapa.html' geralmente.
            // Na web, seria URL/mapa.html
            const mapUrl = `${APP_URL}/mapa.html`;
            await page.goto(mapUrl, { waitUntil: 'networkidle0' });

            console.log(`  Aguardando Mapa carregar...`);
            await delay(5000); // Mapa demora

            await page.screenshot({ path: path.join(OUTPUT_DIR, `${device.prefix}3_map.png`) });


            // Voltar para tirar o print do Login Limpo (Logout)
            console.log(`  Capturando Login Limpo...`);
            await page.goto(APP_URL, { waitUntil: 'networkidle0' });
            // Forçar logout se estiver logado
            await page.evaluate(() => {
                if (window.firebase && window.firebase.auth) window.firebase.auth().signOut();
                // Ou limpar localStorage
                localStorage.clear();
            });
            await page.reload({ waitUntil: 'networkidle0' });
            await delay(2000);
            await page.screenshot({ path: path.join(OUTPUT_DIR, `${device.prefix}1_login.png`) });

            await page.close();
        }

    } catch (error) {
        console.error('ERRO FATAL:', error);
    } finally {
        await browser.close();
    }
})();
