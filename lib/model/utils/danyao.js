function mapDanyaoArrayToStatus(list) {
    const base = {
        biguan: 0,
        biguanxl: 0,
        xingyun: 0,
        lianti: 0,
        ped: 0,
        modao: 0,
        beiyong1: 0,
        beiyong2: 0,
        beiyong3: 0,
        beiyong4: 0,
        beiyong5: 0
    };
    if (Array.isArray(list)) {
        for (const item of list) {
            if (item && typeof item === 'object') {
                for (const k of Object.keys(base)) {
                    const v = item[k];
                    if (typeof v === 'number')
                        base[k] = v;
                }
            }
        }
    }
    return base;
}

export { mapDanyaoArrayToStatus };
