const path = require('path');

module.exports = {
    mode: 'development',
    entry: './mobil/mobil.js',
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'mobil.js',
    },
    devServer: {
        static: './www',
    },
};