var path = require('path');

var minimizeOptions = JSON.stringify({
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: false,
    preserveLineBreaks: true,
    removeEmptyAttributes: true,
    keepClosingSlash: true,
});

module.exports = {
    context: __dirname,
    entry: path.resolve(__dirname, 'entry.js'),
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: '[name].out.js',
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: '../index.js?prefix=grot/[dir]//[dir]//tmpl&module=appModule&name=[name].tpl&-exportId' +
                    '&minimizeOptions=' + minimizeOptions + '&conservativeCollapse',
            },
            {
                test: /\.(png|bmp|raw|jpg|jpeg|tiff|gif|svg)$/,
                loader: 'url-loader?limit=10240',
            },
        ],
    },
};
