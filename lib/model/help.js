import config from './Config.js';

class Help {
    static async get() {
        const helpData = config.getConfig('help', 'help');
        return {
            helpData
        };
    }
    static async gethelpcopy() {
        const helpData = config.getConfig('help', 'help2');
        return {
            helpData
        };
    }
    static async setup() {
        const helpData = config.getConfig('help', 'set');
        return {
            helpData
        };
    }
    static async Association() {
        const helpData = config.getConfig('help', 'Association');
        return {
            helpData
        };
    }
}

export { Help as default };
