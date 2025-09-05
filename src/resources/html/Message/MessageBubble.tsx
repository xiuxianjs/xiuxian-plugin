import dayjs from 'dayjs';
import { Buffer } from 'buffer';
import { type DataEnums } from 'alemonjs';
import React from 'react';
import classNames from 'classnames';

// ---------------- Types ----------------
type MessageBubbleProps = {
  data: DataEnums[];
  createAt: number;
  isOwnMessage?: boolean;
};

type RendererFunction = (item: any) => React.ReactNode;

interface DataItemLike {
  type?: string;
  value?: any;
  options?: any;
}

// ---------------- Utils ----------------
const MAX_BASE64_LENGTH = 2 * 1024 * 1024; // 2MB

function isPlainObject(v: any) {
  return Object.prototype.toString.call(v) === '[object Object]';
}

function safeString(v: any): string {
  if (v === null || v === undefined) {
    return '';
  }
  if (typeof v === 'string') {
    return v;
  }
  try {
    return JSON.stringify(v);
  } catch {
    try {
      return String(v);
    } catch {
      return '';
    }
  }
}

function isHttpUrl(url: any) {
  return typeof url === 'string' && /^https?:\/\//i.test(url);
}

function clampBase64(base64: string): string | null {
  if (!base64) {
    return null;
  }
  if (base64.length > MAX_BASE64_LENGTH) {
    return null;
  }

  return base64;
}

// ---------------- Text Styles ----------------
const TEXT_STYLES: Record<string, (content: React.ReactNode) => React.ReactNode> = {
  bold: c => <strong>{c}</strong>,
  italic: c => <em>{c}</em>,
  boldItalic: c => (
    <strong>
      <em>{c}</em>
    </strong>
  ),
  block: c => <div className='block'>{c}</div>,
  strikethrough: c => <s>{c}</s>,
  none: c => c,
  default: c => c
};

// ---------------- Mention Types ----------------
const MENTION_TYPES: Record<string, (value: string, userName?: string) => React.ReactNode> = {
  all: () => <strong>@全体成员</strong>,
  everyone: () => <strong>@全体成员</strong>,
  全体成员: () => <strong>@全体成员</strong>,
  channel: v => <strong>#{v}</strong>,
  user: (v, userName) => <strong>@{userName ?? v}</strong>,
  guild: v => <strong>#{v}</strong>,
  default: () => <span />
};

// ---------------- Markdown Renderers ----------------
const MARKDOWN_RENDERERS: Record<string, (mdItem: any) => React.ReactNode> = {
  'MD.title': md => <h1>{safeString(md.value).slice(0, 200)}</h1>,
  'MD.subtitle': md => <h2>{safeString(md.value).slice(0, 200)}</h2>,
  'MD.blockquote': md => <blockquote>{safeString(md.value).slice(0, 500)}</blockquote>,
  'MD.bold': md => <strong className='px-1 py-0.5 rounded-md shadow-inner'>{safeString(md.value).slice(0, 500)}</strong>,
  'MD.divider': () => <hr />,
  'MD.text': md => <span>{safeString(md.value).slice(0, 2000)}</span>,
  'MD.link': md => {
    const url = safeString(md.value?.url).slice(0, 1000);
    const text = safeString(md.value?.text).slice(0, 200);

    if (!isHttpUrl(url)) {
      return null;
    }

    return (
      <a href={url} target='_blank' rel='noopener noreferrer'>
        {text || url}
      </a>
    );
  },
  'MD.image': md => {
    const url = safeString(md.value);

    if (!isHttpUrl(url)) {
      return null;
    }
    const w = Number(md.options?.width) || 100;
    const h = Number(md.options?.height) || 100;

    return <img style={{ width: `${w}px`, height: `${h}px` }} className='max-w-[15rem] xl:max-w-[20rem] rounded-md' src={url} alt='image' />;
  },
  'MD.italic': md => <em>{safeString(md.value).slice(0, 500)}</em>,
  'MD.italicStar': md => <em className='italic'>{safeString(md.value).slice(0, 500)}</em>,
  'MD.strikethrough': md => <s>{safeString(md.value).slice(0, 500)}</s>,
  'MD.newline': () => <br />,
  'MD.list': md => {
    const list = Array.isArray(md.value) ? md.value : [];

    return (
      <ul className='list-disc ml-4'>
        {list.slice(0, 200).map((li: any, i: number) => {
          const text = safeString(li?.value?.text ?? li?.value ?? li).slice(0, 500);

          return <li key={i}>{text}</li>;
        })}
      </ul>
    );
  },
  'MD.template': () => <span>暂不支持模板</span>
};

// ---------------- Unsupported Components ----------------
const UNSUPPORTED_COMPONENTS: Record<string, () => React.ReactNode> = {
  'Ark.BigCard': () => <div>暂不支持 Ark.BigCard</div>,
  'Ark.Card': () => <div>暂不支持 Ark.Card</div>,
  'Ark.list': () => <div>暂不支持 Ark.list</div>,
  ImageFile: () => <div>暂不支持文件图片</div>,
  'MD.template': () => <div>暂不支持</div>
};

// ---------------- Render Helpers ----------------
const renderImage = (item: any): React.ReactNode => {
  try {
    const raw = item?.value;

    if (!raw) {
      return null;
    }
    let buffer: Buffer;

    if (Array.isArray(raw)) {
      buffer = Buffer.from(raw as any);
    } else if (typeof raw === 'string') {
      const limited = clampBase64(raw);

      if (!limited) {
        return <span>图片太大或无效</span>;
      }
      buffer = Buffer.from(limited, 'base64');
    } else {
      return null;
    }
    const base64String = buffer.toString('base64');
    const url = `data:image/png;base64,${base64String}`;

    return <img className='max-w-[15rem] xl:max-w-[20rem] rounded-md' src={url} alt='Image' />;
  } catch (e) {
    console.warn('renderImage error', e);

    return <span>图片解析失败</span>;
  }
};

const renderImageURL = (item: any): React.ReactNode => {
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

    return <img className='max-w-[15rem] xl:max-w-[20rem] rounded-md' src={raw} alt='ImageURL' />;
  } catch (e) {
    console.warn('renderImageURL error', e);

    return <span>图片地址无效</span>;
  }
};

const renderText = (item: any): React.ReactNode => {
  try {
    const value = safeString(item?.value).slice(0, 5000);

    if (!value) {
      return null;
    }
    const styleKey = safeString(item?.options?.style) ?? 'default';
    const styleRenderer = TEXT_STYLES[styleKey] ?? TEXT_STYLES.default;
    const parts = value.split('\n');
    const content =
      parts.length > 1 ? (
        <span>
          {parts.map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </span>
      ) : (
        value
      );

    return <span>{styleRenderer(content)}</span>;
  } catch (e) {
    console.warn('renderText error', e);

    return <span>文本错误</span>;
  }
};

const renderMention = (item: any): React.ReactNode => {
  try {
    const value = safeString(item?.value);

    if (!value) {
      return null;
    }
    if (['all', 'everyone', '全体成员'].includes(value)) {
      return <span>{MENTION_TYPES[value]?.(value) ?? MENTION_TYPES.all(value)}</span>;
    }
    const belong = safeString(item?.options?.belong) ?? 'default';
    const userName = item?.options?.payload?.name;
    const renderer = MENTION_TYPES[belong] ?? MENTION_TYPES.default;

    return <span>{renderer(value, userName)}</span>;
  } catch (e) {
    console.warn('renderMention error', e);

    return null;
  }
};

const renderButtonGroup = (item: any): React.ReactNode => {
  try {
    if (item?.options?.template_id) {
      return <div>暂不支持按钮模板</div>;
    }
    const groups = item?.value;

    if (!Array.isArray(groups)) {
      return <div>按钮数据错误</div>;
    }

    return (
      <div className='flex flex-col gap-3'>
        {groups.slice(0, 20).map((group: any, gi: number) => {
          const bts = Array.isArray(group?.value) ? group.value : [];

          return (
            <div key={gi} className='flex flex-wrap gap-2'>
              {bts.slice(0, 30).map((bt: any, bi: number) => {
                const meta = typeof bt?.value === 'string' ? { label: bt.value, title: bt.value } : (bt?.value ?? { label: 'Button', title: '' });
                const label = safeString(meta.label).slice(0, 40) || 'Button';

                return (
                  <span key={bi} className='px-2 py-1 bg-[var(--button-bg,#444)] rounded text-[var(--button-text,#eee)]'>
                    {label}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  } catch (e) {
    console.warn('renderButtonGroup error', e);

    return <div>按钮渲染失败</div>;
  }
};

const renderMarkdown = (item: any): React.ReactNode => {
  try {
    const markdown = Array.isArray(item?.value) ? item.value : [];

    return (
      <div className='mb-2 flex flex-col gap-1'>
        {markdown.slice(0, 200).map((md: any, i: number) => {
          if (!md || typeof md !== 'object') {
            return null;
          }
          const type = safeString(md.type);
          const renderer = MARKDOWN_RENDERERS[type];

          if (!renderer) {
            return null;
          }
          try {
            return <div key={i}>{renderer(md)}</div>;
          } catch (err) {
            console.warn('markdown item render error', err);

            return null;
          }
        })}
      </div>
    );
  } catch (e) {
    console.warn('renderMarkdown error', e);

    return <div>Markdown 数据错误</div>;
  }
};

// ---------------- Component Renderer Map ----------------
const COMPONENT_RENDERERS: Record<string, RendererFunction> = {
  Text: renderText,
  Mention: renderMention,
  Image: renderImage,
  ImageURL: renderImageURL,
  ImageRef: (item: any) => {
    try {
      const hash = item?.value?.hash;

      if (!hash) {
        return <span>图片引用缺失</span>;
      }

      // 服务器端渲染不支持图片对象URL
      return <span>图片引用不支持</span>;
    } catch (e) {
      console.warn('render ImageRef error', e);

      return <span>图片引用错误</span>;
    }
  },
  'BT.group': (item: any) => renderButtonGroup(item),
  Markdown: renderMarkdown,
  // 直接映射 markdown 子类型（如果后端直接下发）
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

// ---------------- Main Component ----------------
const MessageBubble = ({ data, createAt, isOwnMessage = false }: MessageBubbleProps) => {
  const formattedTime = (() => {
    const ts = typeof createAt === 'number' && isFinite(createAt) ? createAt : Date.now();

    return dayjs(ts).format('YYYY-MM-DD HH:mm:ss');
  })();

  const renderedItems = (() => {
    if (!Array.isArray(data)) {
      return null;
    }

    return data.map((raw: any, index: number) => {
      const item: DataItemLike = isPlainObject(raw) ? raw : { type: 'Text', value: safeString(raw) };
      const type = safeString(item.type).trim();

      if (!type) {
        return null;
      }
      try {
        if (type === 'BT.group') {
          return <div key={index}>{renderButtonGroup(item)}</div>;
        }
        const renderer = COMPONENT_RENDERERS[type];

        if (!renderer) {
          const unsupported = UNSUPPORTED_COMPONENTS[type];

          return unsupported ? <div key={index}>{unsupported()}</div> : null;
        }

        return <div key={index}>{renderer(item)}</div>;
      } catch (e) {
        console.warn('render item error', type, e);

        return null;
      }
    });
  })();

  return (
    <div
      className={classNames('flex items-end max-w-[70%]', {
        // 'justify-end': isOwnMessage,
        // 'justify-start': !isOwnMessage
      })}
    >
      <div
        className={classNames('message-bubble rounded-2xl py-3 px-4 flex flex-col relative shadow-lg backdrop-blur-sm border', {
          // 自己发送的消息样式
          'bg-gradient-to-br from-blue-500/80 to-blue-600/80 border-blue-400/30 text-white': isOwnMessage,
          // 接收的消息样式
          'bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-slate-600/30 text-slate-100': !isOwnMessage
        })}
      >
        <div className='flex-1'>{renderedItems}</div>
        <span
          className={classNames('text-xs mt-1 self-end opacity-70', {
            'text-blue-100': isOwnMessage,
            'text-slate-400': !isOwnMessage
          })}
        >
          {formattedTime}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
