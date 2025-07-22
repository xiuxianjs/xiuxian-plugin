import config from './Config.js';

class Help2 {
    versionData;
    static async shituhelp() {
        const html = new Help2();
        return await html.shituhelp();
    }
    async shituhelp() {
        const helpData = config.getConfig('help', 'shituhelp');
        const v = config.getConfig('version', 'version');
        return {
            version: v.version,
            helpData
        };
    }
}

export { Help2 as default };
