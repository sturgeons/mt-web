const path = require('path')

module.exports = {
    entry: {
        path: './src/main.ts'
    },
    output: {
        filename: 'assets/js/[name].[contenthash:6].js',
        path: path.resolve(__dirname, './dist')
    }
}
