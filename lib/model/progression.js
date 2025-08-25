function applyExp(rows, current, delta) {
    if (delta === 0) {
        return current;
    }
    let exp = current.exp + delta;
    let level = current.level;
    while (true) {
        const row = rows.find(r => r.id === level);
        if (!row) {
            break;
        }
        if (row.experience > exp) {
            break;
        }
        exp -= row.experience;
        level += 1;
    }
    return { level, exp };
}

export { applyExp };
