const isKeys = (value, keys) => {
    return !!value && typeof value === 'object' && keys.every(key => key in value);
};

export { isKeys };
