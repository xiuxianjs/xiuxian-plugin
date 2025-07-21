import fs from 'fs'
import template from 'art-template'
import { join } from 'node:path'
import { MyDirPath } from '../app.config'
/**
 * 编译模板并保存到本地文件
 * @param {string} templatePath - 模板文件路径
 * @param {Object} data - 渲染模板所需的数据
 * @param {string} outputPath - 输出文件路径
 * @returns {string} - 输出文件的路径
 */
export function compileTemplate(templatePath, data, name, uid) {
  // 读取模板文件
  const templateContent = fs.readFileSync(templatePath, 'utf-8')

  // 使用 art-template 编译模板
  const result = template.render(templateContent, data)

  // 确定输出文件的路径
  const outputPath = join(MyDirPath, `/data/${name}/${uid}.html`)
  // 确保输出文件所在的目录存在
  fs.mkdirSync(join(MyDirPath, `/data/${name}`), { recursive: true })
  // 将渲染结果写入到本地文件
  fs.writeFileSync(outputPath, result)

  // 返回输出文件的路径
  return outputPath
}
