const {defineConfig} = require('@vue/cli-service')
const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = defineConfig({
    transpileDependencies: true,
    assetsDir: '',
    publicPath: "",
    devServer: {
        port: 8088,
        host: 'localhost',
        open: true
    },
    configureWebpack: {
        plugins: [new NodePolyfillPlugin(), new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './src/static'),
                    to: "./static"
                }
            ]
        })]
    },
})

