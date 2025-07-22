import config from './Config.js';

class Help {
    versionData = {};
    static async get() {
        const html = new Help();
        return await html.getData();
    }
    static async gethelpcopy() {
        const html = new Help();
        return await html.getDatahelpcopy();
    }
    static async setup() {
        const html = new Help();
        return await html.Getset();
    }
    static async Association() {
        const html = new Help();
        return await html.GetAssociationt();
    }
    async getDatahelpcopy() {
        const helpData = config.getConfig('help', 'help2');
        return {
            version: this.versionData.version,
            helpData
        };
    }
    async getData() {
        const helpData = config.getConfig('help', 'help');
        return {
            version: this.versionData.version,
            helpData
        };
    }
    async Getset() {
        const helpData = config.getConfig('help', 'set');
        return {
            version: this.versionData.version,
            helpData
        };
    }
    async GetAssociationt() {
        const helpData = config.getConfig('help', 'Association');
        return {
            version: this.versionData.version,
            helpData
        };
    }
}

export { Help as default };
