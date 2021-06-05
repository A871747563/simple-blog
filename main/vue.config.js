// vue.config.js
const path = require('path')

const resolve = (dir) => path.join(__dirname, dir)

module.exports = {
  // 基本路径
  publicPath: './',
  // 相对于打包路径index.html的路径
  indexPath: 'index.html',
  // 文件输出目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  // 生成的静态资源存放的目录
  assetsDir: 'static',
  // 以多页模式构建应用程序
  pages: undefined,
  // 是否使用包含运行时编译器的vue构建版本
  runtimeCompiler: false,
  // 是否为babel或typescript使用thread-loader，在系统的CPU有多于一个内核时自动启用，仅作用于生产环境，在适当的时候开启多线程去并发的执行压缩
  parallel: require('os').cpus().length > 1,
  // 生产环境是否生成sourceMap 文件，一般不建议打开
  productionSourceMap: false,
  // webpack-dev-server相关配置
  devServer: {
    // url地址
    host: 'localhost',
    // 端口号
    port: 5555,
    // 配置是否是https
    https: false,
    // 配置自动启动浏览器
    open: true,
    // 启动热更新
    hotOnly: true,
    // 配置代理，处理多个跨域
    proxy: {
      '/api': {
        target: 'http://localhost:4399/api/',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/demo': {
        target: 'https://img.yyhy.me/api',
        changeOrigin: true,
        pathRewrite: {
          '^/demo': ''
        }
      }
    }
  },
  // 对内部的webpack进行更细粒度的修改
  chainWebpack: (config) => {
    // 文件引入时，自定义别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('api', resolve('src/api'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('router', resolve('src/router'))
      .set('store', resolve('src/store'))
      .set('styles', resolve('src/styles'))
      .set('utils', resolve('src/utils'))
      .set('views', resolve('src/views'))
    // svg 配置
    config.module.rules.delete('svg') // 重点：删除默认配置中处理 svg
    config.module
      .rule('svg-sprite-loader')
      .test(/\.svg$/)
      .include.add(path.resolve('./src/assets/svg')) // 处理 svg 保存路径
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]' // 给 symbo 配置 id
      })
  },
  // css配置相关
  css: {},
  // PWA插件相关配置
  pwa: {},
  // 第三方插件配置
  pluginOptions: {}
}
