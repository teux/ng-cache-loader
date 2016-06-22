var minimizeOptions = JSON.stringify({
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: false,
    preserveLineBreaks: true,
    removeEmptyAttributes: true,
    keepClosingSlash: true
});

module.exports = {
    entry: './test/entry.js',
    output: {
        path: './test/out',
        filename: '[name].out.js'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: '../index.js?prefix=grot/[dir]//[dir]//tmpl&module=appModule&name=[name].tpl' +
                    '&minimizeOptions=' + minimizeOptions +
                    '&conservativeCollapse'
            }
        ]
    }
};
