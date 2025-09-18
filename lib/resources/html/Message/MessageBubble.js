import dayjs from 'dayjs';
import { Buffer } from 'buffer';
import React from 'react';
import classNames from 'classnames';
import { Image } from 'jsxp';

const MAX_BASE64_LENGTH = 2 * 1024 * 1024;
function isPlainObject(v) {
    return Object.prototype.toString.call(v) === '[object Object]';
}
function safeString(v) {
    if (v === null || v === undefined) {
        return '';
    }
    if (typeof v === 'string') {
        return v;
    }
    try {
        return JSON.stringify(v);
    }
    catch {
        try {
            return String(v);
        }
        catch {
            return '';
        }
    }
}
function isHttpUrl(url) {
    return typeof url === 'string' && /^https?:\/\//i.test(url);
}
function clampBase64(base64) {
    if (!base64) {
        return null;
    }
    if (base64.length > MAX_BASE64_LENGTH) {
        return null;
    }
    return base64;
}
const TEXT_STYLES = {
    bold: c => React.createElement("strong", null, c),
    italic: c => React.createElement("em", null, c),
    boldItalic: c => (React.createElement("strong", null,
        React.createElement("em", null, c))),
    block: c => React.createElement("div", { className: 'block' }, c),
    strikethrough: c => React.createElement("s", null, c),
    none: c => c,
    default: c => c
};
const MENTION_TYPES = {
    all: () => React.createElement("strong", null, "@\u5168\u4F53\u6210\u5458"),
    everyone: () => React.createElement("strong", null, "@\u5168\u4F53\u6210\u5458"),
    全体成员: () => React.createElement("strong", null, "@\u5168\u4F53\u6210\u5458"),
    channel: v => React.createElement("strong", null,
        "#",
        v),
    user: (v, userName) => React.createElement("strong", null,
        "@",
        userName ?? v),
    guild: v => React.createElement("strong", null,
        "#",
        v),
    default: () => React.createElement("span", null)
};
const MARKDOWN_RENDERERS = {
    'MD.title': md => React.createElement("h1", null, safeString(md.value).slice(0, 200)),
    'MD.subtitle': md => React.createElement("h2", null, safeString(md.value).slice(0, 200)),
    'MD.blockquote': md => React.createElement("blockquote", null, safeString(md.value).slice(0, 500)),
    'MD.bold': md => React.createElement("strong", { className: 'px-1 py-0.5 rounded-md shadow-inner' }, safeString(md.value).slice(0, 500)),
    'MD.divider': () => React.createElement("hr", null),
    'MD.text': md => React.createElement("span", null, safeString(md.value).slice(0, 2000)),
    'MD.link': md => {
        const url = safeString(md.value?.url).slice(0, 1000);
        const text = safeString(md.value?.text).slice(0, 200);
        if (!isHttpUrl(url)) {
            return null;
        }
        return (React.createElement("a", { href: url, target: '_blank', rel: 'noopener noreferrer' }, text || url));
    },
    'MD.image': md => {
        const url = safeString(md.value);
        if (!isHttpUrl(url)) {
            return null;
        }
        const w = Number(md.options?.width) || 100;
        const h = Number(md.options?.height) || 100;
        return React.createElement(Image, { style: { width: `${w}px`, height: `${h}px` }, className: 'max-w-[15rem] xl:max-w-[20rem] rounded-md', src: url, alt: 'image' });
    },
    'MD.italic': md => React.createElement("em", null, safeString(md.value).slice(0, 500)),
    'MD.italicStar': md => React.createElement("em", { className: 'italic' }, safeString(md.value).slice(0, 500)),
    'MD.strikethrough': md => React.createElement("s", null, safeString(md.value).slice(0, 500)),
    'MD.newline': () => React.createElement("br", null),
    'MD.list': md => {
        const list = Array.isArray(md.value) ? md.value : [];
        return (React.createElement("ul", { className: 'list-disc ml-4' }, list.slice(0, 200).map((li, i) => {
            const text = safeString(li?.value?.text ?? li?.value ?? li).slice(0, 500);
            return React.createElement("li", { key: i }, text);
        })));
    },
    'MD.template': () => React.createElement("span", null, "\u6682\u4E0D\u652F\u6301\u6A21\u677F")
};
const UNSUPPORTED_COMPONENTS = {
    'Ark.BigCard': () => React.createElement("div", null, "\u6682\u4E0D\u652F\u6301 Ark.BigCard"),
    'Ark.Card': () => React.createElement("div", null, "\u6682\u4E0D\u652F\u6301 Ark.Card"),
    'Ark.list': () => React.createElement("div", null, "\u6682\u4E0D\u652F\u6301 Ark.list"),
    ImageFile: () => React.createElement("div", null, "\u6682\u4E0D\u652F\u6301\u6587\u4EF6\u56FE\u7247"),
    'MD.template': () => React.createElement("div", null, "\u6682\u4E0D\u652F\u6301")
};
const renderImage = (item) => {
    try {
        const raw = item?.value;
        if (!raw) {
            return null;
        }
        let buffer;
        if (Array.isArray(raw)) {
            buffer = Buffer.from(raw);
        }
        else if (typeof raw === 'string') {
            const limited = clampBase64(raw);
            if (!limited) {
                return React.createElement("span", null, "\u56FE\u7247\u592A\u5927\u6216\u65E0\u6548");
            }
            buffer = Buffer.from(limited, 'base64');
        }
        else {
            return null;
        }
        const base64String = buffer.toString('base64');
        const url = `data:image/png;base64,${base64String}`;
        return React.createElement(Image, { className: 'max-w-[15rem] xl:max-w-[20rem] rounded-md', src: url, alt: 'Image' });
    }
    catch (e) {
        console.warn('renderImage error', e);
        return React.createElement("span", null, "\u56FE\u7247\u89E3\u6790\u5931\u8D25");
    }
};
const renderImageURL = (item) => {
    try {
        const raw = safeString(item?.value);
        if (!raw) {
            return null;
        }
        if (raw.startsWith('base64://')) {
            const base64Data = raw.replace('base64://', '');
            return renderImage({ value: base64Data });
        }
        if (!isHttpUrl(raw)) {
            return null;
        }
        return React.createElement(Image, { className: 'max-w-[15rem] xl:max-w-[20rem] rounded-md', src: raw, alt: 'ImageURL' });
    }
    catch (e) {
        console.warn('renderImageURL error', e);
        return React.createElement("span", null, "\u56FE\u7247\u5730\u5740\u65E0\u6548");
    }
};
const renderText = (item) => {
    try {
        const value = safeString(item?.value).slice(0, 5000);
        if (!value) {
            return null;
        }
        const styleKey = safeString(item?.options?.style) ?? 'default';
        const styleRenderer = TEXT_STYLES[styleKey] ?? TEXT_STYLES.default;
        const parts = value.split('\n');
        const isMultiLine = parts.length > 1;
        const content = isMultiLine ? (React.createElement("span", null, parts.map((line, i) => (React.createElement("span", { key: i },
            line,
            React.createElement("br", null)))))) : (value);
        return React.createElement("span", null, styleRenderer(content));
    }
    catch (e) {
        console.warn('renderText error', e);
        return React.createElement("span", null, "\u6587\u672C\u9519\u8BEF");
    }
};
const renderMention = (item) => {
    try {
        const value = safeString(item?.value);
        if (!value) {
            return null;
        }
        if (['all', 'everyone', '全体成员'].includes(value)) {
            return React.createElement("span", null, MENTION_TYPES[value]?.(value) ?? MENTION_TYPES.all(value));
        }
        const belong = safeString(item?.options?.belong) ?? 'default';
        const userName = item?.options?.payload?.name;
        const renderer = MENTION_TYPES[belong] ?? MENTION_TYPES.default;
        return React.createElement("span", null, renderer(value, userName));
    }
    catch (e) {
        console.warn('renderMention error', e);
        return null;
    }
};
const renderButtonGroup = (item) => {
    try {
        if (item?.options?.template_id) {
            return React.createElement("div", null, "\u6682\u4E0D\u652F\u6301\u6309\u94AE\u6A21\u677F");
        }
        const groups = item?.value;
        if (!Array.isArray(groups)) {
            return React.createElement("div", null, "\u6309\u94AE\u6570\u636E\u9519\u8BEF");
        }
        return (React.createElement("div", { className: 'flex flex-col gap-3' }, groups.slice(0, 20).map((group, gi) => {
            const bts = Array.isArray(group?.value) ? group.value : [];
            return (React.createElement("div", { key: gi, className: 'flex flex-wrap gap-2' }, bts.slice(0, 30).map((bt, bi) => {
                const meta = typeof bt?.value === 'string' ? { label: bt.value, title: bt.value } : (bt?.value ?? { label: 'Button', title: '' });
                const label = safeString(meta.label).slice(0, 40) || 'Button';
                return (React.createElement("span", { key: bi, className: 'px-2 py-1 bg-[var(--button-bg,#444)] rounded text-[var(--button-text,#eee)]' }, label));
            })));
        })));
    }
    catch (e) {
        console.warn('renderButtonGroup error', e);
        return React.createElement("div", null, "\u6309\u94AE\u6E32\u67D3\u5931\u8D25");
    }
};
const renderMarkdown = (item) => {
    try {
        const markdown = Array.isArray(item?.value) ? item.value : [];
        return (React.createElement("div", { className: 'mb-2 flex flex-col gap-1' }, markdown.slice(0, 200).map((md, i) => {
            if (!md || typeof md !== 'object') {
                return null;
            }
            const type = safeString(md.type);
            const renderer = MARKDOWN_RENDERERS[type];
            if (!renderer) {
                return null;
            }
            try {
                return React.createElement("div", { key: i }, renderer(md));
            }
            catch (err) {
                console.warn('markdown item render error', err);
                return null;
            }
        })));
    }
    catch (e) {
        console.warn('renderMarkdown error', e);
        return React.createElement("div", null, "Markdown \u6570\u636E\u9519\u8BEF");
    }
};
const COMPONENT_RENDERERS = {
    Text: renderText,
    Mention: renderMention,
    Image: renderImage,
    ImageURL: renderImageURL,
    ImageRef: (item) => {
        try {
            const hash = item?.value?.hash;
            if (!hash) {
                return React.createElement("span", null, "\u56FE\u7247\u5F15\u7528\u7F3A\u5931");
            }
            return React.createElement("span", null, "\u56FE\u7247\u5F15\u7528\u4E0D\u652F\u6301");
        }
        catch (e) {
            console.warn('render ImageRef error', e);
            return React.createElement("span", null, "\u56FE\u7247\u5F15\u7528\u9519\u8BEF");
        }
    },
    'BT.group': (item) => renderButtonGroup(item),
    Markdown: renderMarkdown,
    'MD.title': md => MARKDOWN_RENDERERS['MD.title'](md),
    'MD.subtitle': md => MARKDOWN_RENDERERS['MD.subtitle'](md),
    'MD.blockquote': md => MARKDOWN_RENDERERS['MD.blockquote'](md),
    'MD.bold': md => MARKDOWN_RENDERERS['MD.bold'](md),
    'MD.divider': md => MARKDOWN_RENDERERS['MD.divider'](md),
    'MD.text': md => MARKDOWN_RENDERERS['MD.text'](md),
    'MD.link': md => MARKDOWN_RENDERERS['MD.link'](md),
    'MD.image': md => MARKDOWN_RENDERERS['MD.image'](md),
    'MD.italic': md => MARKDOWN_RENDERERS['MD.italic'](md),
    'MD.italicStar': md => MARKDOWN_RENDERERS['MD.italicStar'](md),
    'MD.strikethrough': md => MARKDOWN_RENDERERS['MD.strikethrough'](md),
    'MD.newline': md => MARKDOWN_RENDERERS['MD.newline'](md),
    'MD.list': md => MARKDOWN_RENDERERS['MD.list'](md)
};
const MessageBubble = ({ data, createAt, isOwnMessage = false }) => {
    const formattedTime = (() => {
        const ts = typeof createAt === 'number' && isFinite(createAt) ? createAt : Date.now();
        return dayjs(ts).format('YYYY-MM-DD HH:mm:ss');
    })();
    const renderedItems = (() => {
        if (!Array.isArray(data)) {
            return null;
        }
        return data.map((raw, index) => {
            const item = isPlainObject(raw) ? raw : { type: 'Text', value: safeString(raw) };
            const type = safeString(item.type).trim();
            if (!type) {
                return null;
            }
            try {
                if (type === 'BT.group') {
                    return React.createElement("div", { key: index }, renderButtonGroup(item));
                }
                const renderer = COMPONENT_RENDERERS[type];
                if (!renderer) {
                    const unsupported = UNSUPPORTED_COMPONENTS[type];
                    return unsupported ? React.createElement("div", { key: index }, unsupported()) : null;
                }
                return React.createElement("div", { key: index }, renderer(item));
            }
            catch (e) {
                console.warn('render item error', type, e);
                return null;
            }
        });
    })();
    return (React.createElement("div", { className: classNames('flex items-end max-w-[70%]', {}) },
        React.createElement("div", { className: classNames('message-bubble rounded-2xl py-3 px-4 flex flex-col relative shadow-lg backdrop-blur-sm border', {
                'bg-gradient-to-br from-blue-500/80 to-blue-600/80 border-blue-400/30 text-white': isOwnMessage,
                'bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-slate-600/30 text-slate-100': !isOwnMessage
            }) },
            React.createElement("div", { className: 'flex-1' }, renderedItems),
            React.createElement("span", { className: classNames('text-xs mt-1 self-end opacity-70', {
                    'text-blue-100': isOwnMessage,
                    'text-slate-400': !isOwnMessage
                }) }, formattedTime))));
};

export { MessageBubble as default };
