import * as path from 'path'
import minimist from 'minimist'
import { merge, get } from 'lodash'
import { IPluginContext } from '@tarojs/service'
import { ensure } from '@tarojs/shared'

export default (ctx: IPluginContext) => {
  // 编译平台参数
  const support_platforms = ['weapp', 'swan', 'alipay', 'tt', 'qq', 'jd', 'h5', 'rn', 'quickapp'];
  const args = minimist(process.argv.slice(2));
  const platform = args.type;
  // 对taro默认支持的平台不处理
  if (support_platforms.indexOf(platform) >= 0) {
    return;
  }

  const packages = require(path.join(ctx.paths.appPath, 'package.json'));
  const platforms = packages.h5Extend;
  if (platforms.indexOf(platform) === -1) {
    ensure(false, `扩展编译平台 ${platform} 不存在, 请检查package.json中的h5Extend配置`);
  }

  ctx.registerPlatform({
    name: platform,
    useConfigName: 'h5',
    async fn({ config }) {
      const { appPath, outputPath, sourcePath } = ctx.paths
      const { initialConfig } = ctx
      const { port } = ctx.runOpts
      const { emptyDirectory, recursiveMerge, npm, ENTRY, SOURCE_DIR, OUTPUT_DIR } = ctx.helper
      emptyDirectory(outputPath)
      const entryFileName = `${ENTRY}.config`
      const entryFile = path.basename(entryFileName)
      const defaultEntry = {
        [ENTRY]: [path.join(sourcePath, entryFile)]
      }
      const customEntry = get(initialConfig, 'h5.entry')
      const h5RunnerOpts = recursiveMerge(Object.assign({}, config), {
        entryFileName: ENTRY,
        env: {
          TARO_ENV: JSON.stringify(platform),
          FRAMEWORK: JSON.stringify(config.framework),
          TARO_VERSION: require(path.join(ctx.paths.nodeModulesPath, '@tarojs/taro/package.json')).version
        },
        port,
        sourceRoot: config.sourceRoot || SOURCE_DIR,
        outputRoot: config.outputRoot || OUTPUT_DIR
      })
      h5RunnerOpts.entry = merge(defaultEntry, customEntry)
      const webpackRunner = await npm.getNpmPkg('@tarojs/webpack-runner', appPath)
      webpackRunner(appPath, h5RunnerOpts)
    }
  })
}
