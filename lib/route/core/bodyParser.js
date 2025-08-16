const parseJsonBody = async (ctx) => {
    return new Promise((resolve, reject) => {
        if (ctx.request.headers['content-type']?.includes('application/json')) {
            let data = '';
            ctx.req.on('data', chunk => {
                data += chunk;
            });
            ctx.req.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve(parsed);
                }
                catch (_error) {
                    reject(new Error('Invalid JSON format'));
                }
            });
            ctx.req.on('error', reject);
        }
        else {
            resolve({});
        }
    });
};
const parseFormBody = async (ctx) => {
    return new Promise((resolve, reject) => {
        if (ctx.request.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
            let data = '';
            ctx.req.on('data', chunk => {
                data += chunk;
            });
            ctx.req.on('end', () => {
                try {
                    const params = new URLSearchParams(data);
                    const result = {};
                    for (const [key, value] of params.entries()) {
                        result[key] = value;
                    }
                    resolve(result);
                }
                catch (_error) {
                    reject(new Error('Invalid form data'));
                }
            });
            ctx.req.on('error', reject);
        }
        else {
            resolve({});
        }
    });
};
const parseBody = async (ctx) => {
    const contentType = ctx.request.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
        return parseJsonBody(ctx);
    }
    else if (contentType.includes('application/x-www-form-urlencoded')) {
        return parseFormBody(ctx);
    }
    else {
        return {};
    }
};

export { parseBody, parseFormBody, parseJsonBody };
