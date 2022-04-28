const { join } = require('path')
const typescript = require('rollup-plugin-typescript2')
const cwd = __dirname

const base = {
  external: ['@tarojs/service'],
  plugins: [typescript({
    useTsconfigDeclarationDir: true
  })]
}

// 供 CLI 编译时使用的 Taro 插件入口
const comileConfig = {
  input: join(cwd, 'src/index.ts'),
  output: {
    file: join(cwd, 'dist/index.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  ...base
}

const expandConfig = {
  input: join(cwd, 'src/expand.ts'),
  output: {
    file: join(cwd, 'dist/expand.js'),
    format: 'cjs',
    sourcemap: true,
    exports: 'named'
  },
  ...base
}

module.exports = [comileConfig, expandConfig]
