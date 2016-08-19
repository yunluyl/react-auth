var webpack = require('webpack');

module.exports =
{
    debug : true,
    bail : true,
    cache : true,
    devtool : 'sourcemap',
    entry :
    {
        'bundle' : './src/app.jsx'
    },
    output :
    {
        path : __dirname + '/test/public',
        filename : '[name].js'
    },
    node :
    {
        fs: "empty"
    },
    module :
    {
        loaders :
        [
            {
                test : /\.jsx$/,
                loader : 'babel',
            },
            {
                test : /\.json$/,
                loaders : ['json-loader']
            }
        ]
    },
};