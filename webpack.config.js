var path = require('path');
var webpack = require('webpack');
//var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports =
[
    {
        //debug : true,
        bail : true,
        cache : true,
        //devtool : 'sourcemap',
        entry :
        {
            'bundle' : './src/app.jsx'
        },
        output :
        {
            path : __dirname + '/public',
            filename : '[name].js'
        },
        resolve :
        {
            root : path.resolve('./src')
        },
        node :
        {
            fs: "empty"
        },
        plugins :
        [
            //new webpack.ProvidePlugin(
            //{
            //    '$' : 'jquery'
            //}),
            //new webpack.optimize.CommonsChunkPlugin('commons.js'),
            //new ExtractTextPlugin('./styles.css', {allChunks : true}),
            new webpack.DefinePlugin(
            {
                'process.env.NODE_ENV' : '"production"'
            }),
            new webpack.optimize.UglifyJsPlugin(
            {
                'minimize' : true,
                'compress' :
                {
                    'warnings' : false
                }
            })
        ],
        module :
        {
            loaders :
            [
            /*
                {
                    test : /globalCSS.scss$/,
                    //loader : ExtractTextPlugin.extract('isomorphic-style-loader', 'css?modules=false','sass')
                    loaders : ['isomorphic-style-loader','css?modules=false','sass']
                },
                */
                {
                    test : /\.scss$/,
                    //exclude : /globalCSS.scss$/,
                    //loader : ExtractTextPlugin.extract('isomorphic-style-loader','css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]','sass')
                    loaders : ['isomorphic-style-loader','css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]','sass', 'sass-resources']  //ExtractTextPlugin.extract
                },
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
        sassResources : './src/sharedCSS.scss'
    },
    {
        //debug : true,
        bail : true,
        cache : true,
        //devtool : 'sourcemap',
        entry : 
        {
            'browserRoutes' : './src/routes.jsx'
        },
        output :
        {
            path : __dirname + '/',
            filename : '[name].js',
            libraryTarget: 'commonjs2'
        },
        target : 'node',
        node :
        {
            fs: "empty"
        },
        /*
        resolve :
        {
            extensions : ['', '.js'],
            alias :
            {
                webworkify: 'webworkify-webpack',
                'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
            }
        },
        */
        plugins :
        [
            new webpack.DefinePlugin(
            {
                'process.env.NODE_ENV' : '"production"'
            }),
            new webpack.optimize.UglifyJsPlugin(
            {
                'minimize' : true,
                'compress' :
                {
                    'warnings' : false
                }
            })
        ],
        module :
        {
            loaders :
            [
                {
                    test : /\.scss$/,
                    loaders : ['isomorphic-style-loader','css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]','sass', 'sass-resources']
                },
                {
                    test : /\.jsx$/,
                    loader : 'babel',
                },
                {
                    test : /\.json$/,
                    loaders : ['json-loader']
                },
                /*
                {
                    test: /\.js$/,
                    include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
                    loader: 'worker'
                },
                {
                    test: /mapbox-gl.+\.js$/,
                    loader: 'transform/cacheable?brfs'
                }
                */
            ]
        },
        sassResources : './src/sharedCSS.scss'
    }
];