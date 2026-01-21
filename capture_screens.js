const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
    });

    const page = await browser.newPage();

    // iPad Pro 12.9" (3rd, 4th, 5th, 6th gen) Display configuration
    // Resolution: 2048 x 2732 px (Portrait)
    // Point size: 1024 x 1366 points
    // Scale factor: 2
    await page.setViewport({
        width: 1024,
        height: 1366,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
    });

    // Helper to wait
    const delay = ms => new Promise(res => setTimeout(res, ms));

    try {
        // 1. Login Screen
        // We open the index.html directly. CORS might be an issue for Firebase, 
        // but the UI should render even if network fails initially.
        // However, to log in, we need network.
        // Let's assume we can capture the Login UI as is.
        const indexPath = 'file://' + path.resolve(__dirname, 'www/index.html');
        console.log(`Navigating to ${indexPath}`);
        await page.goto(indexPath, { waitUntil: 'networkidle0' });

        // Inject some CSS to ensure it looks perfect (hide scrollbars etc if any)
        await page.addStyleTag({ content: 'body { overflow: hidden !important; }' });

        // Screenshot Login
        await page.screenshot({ path: 'screenshot_ipad_1_login.png' });
        console.log('Captured Login (iPad)');

        // 2. Home Screen (Dashboard)
        // ... (existing logic) ...
        const homePath = 'file://' + path.resolve(__dirname, 'www/home.html');
        // ... (existing logic) ...

        await page.goto(homePath, { waitUntil: 'domcontentloaded' });

        if (page.url().includes('index.html')) {
            // ... (auth bypass logic) ...
            await page.evaluateOnNewDocument(() => {
                // ... (mock logic) ...
                window.firebase = {
                    // ... (mock implementation) ...
                    auth: () => ({
                        onAuthStateChanged: (cb) => {
                            cb({ uid: 'test-ipad', email: 'associado@unik.com', displayName: 'Associado UNIK' });
                        },
                        currentUser: { uid: 'test-ipad', email: 'associado@unik.com' }
                    }),
                    // ...
                    firestore: () => ({
                        // ... (mock firestore) ...
                        collection: () => ({
                            doc: () => ({
                                collection: () => ({
                                    where: () => ({
                                        onSnapshot: (cb) => {
                                            cb({
                                                empty: false,
                                                forEach: (fn) => {
                                                    // Duplicate cars to fill iPad screen
                                                    fn({ data: () => ({ model: 'VW GOL 1.6', plate: 'ABC-1234', status: 'active', speed: 0, ignition: 'off', gpsSignal: 100, bat_level: 90 }) });
                                                    fn({ data: () => ({ model: 'FIAT TORO', plate: 'XYZ-9876', status: 'blocked', speed: 0, ignition: 'off', gpsSignal: 80, bat_level: 50 }) });
                                                    fn({ data: () => ({ model: 'HONDA CIVIC', plate: 'OPO-5544', status: 'active', speed: 80, ignition: 'on', gpsSignal: 100, bat_level: 95 }) });
                                                    fn({ data: () => ({ model: 'C. TRUCK', plate: 'TRK-9000', status: 'active', speed: 45, ignition: 'on', gpsSignal: 85, bat_level: 70 }) });
                                                }
                                            })
                                        }
                                    })
                                })
                            })
                        })
                    })
                };
            });
            await page.goto(homePath, { waitUntil: 'networkidle0' });
        }

        await delay(2000);
        await page.screenshot({ path: 'screenshot_ipad_2_home.png' });
        console.log('Captured Home (iPad)');

        // 3. Map Screen
        const mapPath = 'file://' + path.resolve(__dirname, 'www/mapa.html');
        await page.goto(mapPath, { waitUntil: 'networkidle0' });
        await delay(3000);
        await page.screenshot({ path: 'screenshot_ipad_3_map.png' });
        console.log('Captured Map (iPad)');

    } catch (error) {
        console.error('Error capturing screenshots:', error);
    } finally {
        await browser.close();
    }
})();
