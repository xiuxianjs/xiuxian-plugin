import { Context } from 'koa';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { parseJsonBody } from '../core/bodyParser';
import { readdirSync, existsSync } from 'fs';
import { useState } from 'alemonjs';
import { createRequire } from 'module';
import { validateRole } from '../core/auth';
// 获得当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 指令目录 - 指向src/response目录
const RESPONSE_DIR = path.resolve(__dirname, '../../response');
const require = createRequire(import.meta.url);
const pkg = require('../../../package.json') as {
  name: string;
};
// 获取当前工作目录（项目根目录）
const cwd = process.cwd();
// 获取相对于项目根目录的路径
const relativePath = path.relative(cwd, __filename);
// 判断是否在 node_modules 中
const isInNodeModules = /node_modules/.test(relativePath);
const commandPrefix = !isInNodeModules ? 'main' : pkg.name;

export const POST = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = await parseJsonBody(ctx);

    if (!body) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: 'menus is required',
        data: null
      };

      return;
    }

    const menus = body.menus as string[];
    const targetDir = join(RESPONSE_DIR, ...menus);

    // 检查目录是否存在
    if (!existsSync(targetDir)) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '目录不存在',
        data: null
      };

      return;
    }

    const fileList = readdirSync(targetDir, { withFileTypes: true })
      .filter(file => {
        if (file.isDirectory()) {
          return true;
        }

        return file.isFile() && /^res\.(js|ts|jsx|tsx)$/.test(file.name);
      })
      .map(file => {
        if (file.isDirectory()) {
          return {
            isDir: true,
            isFile: false,
            name: file.name
          };
        }

        // 对于文件，获取其状态
        const fileName = file.name.replace(/\.js|\.ts|\.jsx|\.tsx$/, '');
        // const commandPath = [...menus, fileName]
        const name = menus.join(':');
        // 去掉前缀
        const [state] = useState(`${commandPrefix}:response:${name}`);

        return {
          isDir: false,
          isFile: true,
          name: fileName,
          status: state === true || state === false ? state : false // 确保返回布尔值，默认为false
        };
      });

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: 'success',
      data: fileList
    };
  } catch (error) {
    console.error('获取指令列表错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};

// 指令状态更新
export const PUT = async (ctx: Context) => {
  try {
    const res = await validateRole(ctx, 'admin');

    if (!res) {
      return;
    }

    const body = await parseJsonBody(ctx);

    if (!body) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '请求体不能为空',
        data: null
      };

      return;
    }

    const command = body.menus as string[];
    const sw = body.switch as boolean;

    if (!Array.isArray(command) || command.length === 0) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: 'menus参数格式错误',
        data: null
      };

      return;
    }

    // 去掉最后一个。
    command.pop();
    const name = command.join(':');
    const [state, setState] = useState(`${commandPrefix}:response:${name}`);

    if (state === sw) {
      ctx.status = 200;
      ctx.body = {
        code: 200,
        message: '状态未发生变化',
        data: null
      };

      return;
    }

    setState(sw);

    ctx.status = 200;
    ctx.body = {
      code: 200,
      message: '状态更新成功',
      data: null
    };
  } catch (error) {
    console.error('更新指令状态错误:', error);
    ctx.status = 500;
    ctx.body = {
      code: 500,
      message: '服务器内部错误',
      data: null
    };
  }
};
