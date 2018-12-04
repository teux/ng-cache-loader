var path = require('path');

module.exports = {
    context: __dirname,
    entry: path.resolve(__dirname, 'entry.js'),
    output: {
        path: path.resolve(__dirname, 'out'),
        filename: '[name].out.js',
    },
    module: {
        rules: [{
            test: /\.html$/,
            use:[{
                loader: '../index.js',
                options: {
                    prefix: 'grot/[dir]//[dir]//tmpl',
                    module: 'appModule',
                    name: '[name].tpl',
                    exportId: false,
                    minimizeOptions: {
                        removeComments: true,
                        removeCommentsFromCDATA: true,
                        collapseWhitespace: true,
                        conservativeCollapse: false,
                        preserveLineBreaks: true,
                        removeEmptyAttributes: true,
                        keepClosingSlash: true,
                    },
                },
            }],
        },{
            test: /\.(png|bmp|raw|jpg|jpeg|tiff|gif|svg)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 10240,
                }
            }]
        }],
    },
};
