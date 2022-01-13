const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',
    entry: ['./index.js'],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },{
                test: /\.scss$/i,
                use: [
                  // 将 JS 字符串生成为 style 节点
                  'style-loader',
                  // 将 CSS 转化成 CommonJS 模块
                  'css-loader',
                  // 将 Sass 编译成 CSS
                  'sass-loader',
                ],
              }
        ],
    },
    resolve: {
        extensions: ['.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body',
        }),
    ],
    // https://webpack.docschina.org/configuration/optimization/
    optimization: {
        chunkIds: 'deterministic',
        moduleIds: 'deterministic',
        mangleWasmImports: true,
        minimizer: [new TerserPlugin({
            parallel: true,
            terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                mangle: true,
                // Deprecated
                output: {
                    ascii_only: true
                },
            },
        }),]
    }
};
