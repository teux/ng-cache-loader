module.exports = {
    entry: './test/entry.js',
    output: {
        path: './test/out',
        filename: '[name].out.js'
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: '../index.js?prefix=grot/[dir]//[dir]//tmpl&module=appModule' }
        ]
    }
};
