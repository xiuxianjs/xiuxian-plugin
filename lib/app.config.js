import { dirname, join, basename, resolve } from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ___diename = join(dirname(fileURLToPath(import.meta.url)), '../');
const AppName = basename(___diename);
const ThePath = `${resolve().replace(/\\/g, '/')}`;
const MyDirPath = __dirname.replace(/\\/g, '/');

export { AppName, MyDirPath, ThePath };
