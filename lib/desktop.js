import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getConfig, getConfigValue } from 'alemonjs';
import { createRequire } from 'module';

const __dirname$1 = dirname(fileURLToPath(import.meta.url));
const require$1 = createRequire(import.meta.url);
const pkg = require$1('../package.json');
const extensionName = pkg.name;
const getAppConfig = () => {
    const values = getConfigValue();
    const value = values ? values[extensionName] : null;
    return value ?? {};
};
const distDir = 'dist-desktop';
const activate = (context) => {
    const webView = context.createSidebarWebView(context);
    context.onCommand('open.xiuxian', () => {
        const dir = join(__dirname$1, '../', distDir, 'index.html');
        const scriptReg = /<script.*?src="(.+?)".*?>/;
        const styleReg = /<link.*?rel="stylesheet".*?href="(.+?)".*?>/;
        const iconReg = /<link.*?rel="icon".*?href="(.+?)".*?>/g;
        const styleUri = context.createExtensionDir(join(__dirname$1, '../', distDir, 'assets', 'index.css'));
        const scriptUri = context.createExtensionDir(join(__dirname$1, '../', distDir, 'assets', 'index.js'));
        const html = readFileSync(dir, 'utf-8')
            .replace(iconReg, '')
            .replace(scriptReg, `<script type="module" crossorigin src="${scriptUri}"></script>`)
            .replace(styleReg, `<link rel="stylesheet" crossorigin href="${styleUri}">`);
        webView.loadWebView(html);
    });
    webView.onMessage(e => {
        try {
            if (e.type === 'get.config') {
                const config = getAppConfig();
                webView.postMessage({
                    type: 'post.config',
                    data: config
                });
            }
            else if (e.type === 'save.config') {
                const config = getConfig();
                let value = config.value;
                if (!value) {
                    value ||= {};
                }
                value[extensionName] = {
                    ...(value ?? {}),
                    ...(e?.data ?? {})
                };
                config.saveValue(value);
            }
        }
        catch (e) {
            console.error(e);
        }
    });
};

export { activate };
