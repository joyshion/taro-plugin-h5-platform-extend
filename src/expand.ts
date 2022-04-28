import * as path from 'path'
import { resolve } from 'path';
import fs from 'fs'
import minimist from 'minimist'

// h5编译扩展平台名称
const packagePath = path.join(resolve('./') + '/package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const platforms = packageData.h5Extend;
platforms.push('h5');

// 需要入侵源码进行修改的文件
const files = [
    path.join(resolve('./node_modules') + '/@tarojs/plugin-framework-react/dist/index.js'),
    path.join(resolve('./node_modules') + '/@tarojs/plugin-framework-react/dist/runtime.js'),
    path.join(resolve('./node_modules') + '/@tarojs/runtime/dist/runtime.esm.js')
];

// 修改Taro源码，支持H5平台扩展
const changeFile = (filePath: string) => {
    let context = fs.readFileSync(filePath, 'utf8');
    if (context.indexOf(`['${platforms.join("', '")}'].indexOf(process.env.TARO_ENV)`) < 0) {
        context = context.replace(/process.env.TARO_ENV === 'h5'/g, `['${platforms.join("', '")}'].indexOf(process.env.TARO_ENV) >= 0`);
        context = context.replace(/process.env.TARO_ENV !== 'h5'/g, `['${platforms.join("', '")}'].indexOf(process.env.TARO_ENV) < 0`);
        fs.writeFileSync(filePath, context, 'utf8');
    }
}

// 恢复Taro源码，关闭H5平台扩展
const restoreFile = (filePath: string) => {
    let context = fs.readFileSync(filePath, 'utf8');
    if (context.indexOf(`['${platforms.join("', '")}'].indexOf(process.env.TARO_ENV)`) >= 0) {
        let regx1 = new RegExp(`\\[(.*?)\\].indexOf\\(process.env.TARO_ENV\\) >= 0`, 'gim');
        context = context.replace(regx1, "process.env.TARO_ENV === 'h5'");
        let regx2 = new RegExp(`\\[(.*?)\\].indexOf\\(process.env.TARO_ENV\\) < 0`, 'gim');
        context = context.replace(regx2, "process.env.TARO_ENV !== 'h5'");
        fs.writeFileSync(filePath, context, 'utf8');
    }
}

const args = minimist(process.argv.slice(2));
switch (args.type) {
    case 'enabled':
        files.forEach(f => {
            changeFile(f);
        });
        break;
    case 'disabled':
        files.forEach(f => {
            restoreFile(f);
        });
        break;
}
