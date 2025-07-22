class Version {
    async getData(versionData) {
        const version = versionData.version;
        const data = {
            userId: version,
            quality: 100,
            saveId: version,
            versionData: versionData
        };
        return data;
    }
}

export { Version as default };
