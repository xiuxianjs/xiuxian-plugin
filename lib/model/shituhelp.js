import config from './Config.js';

class Help2 {
    static async shituhelp() {
        const helpData = config.getConfig('help', 'shituhelp');
        return {
            helpData
        };
    }
}

export { Help2 as default };
