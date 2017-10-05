const path = require('path');
const webpack = require('webpack');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    return [{
        stats: { modules: false },
        entry: { 'app': 'aurelia-bootstrapper' },
        resolve: {
            extensions: ['.ts', '.js'],
            modules: ['ClientApp', 'node_modules'],
        },
        output: {
            path: path.resolve(bundleOutputDir),
            publicPath: 'dist/',
            filename: '[name].js'
        },
        module: {
            rules: [
                { test: /\.ts$/i, include: /ClientApp/, use: 'ts-loader?silent=true' },
                { test: /\.html$/i, use: 'html-loader' },
                { test: /\.css$/i, use: isDevBuild ? 'css-loader' : 'css-loader?minimize' },
                { test: /\.(png|jpg|jpeg|gif|cur|svg)$/, use: 'url-loader?limit=25000' },
                { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader', query: { limit: 10000, mimetype: 'application/font-woff2' } },
                { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader', query: { limit: 10000, mimetype: 'application/font-woff' } },
                { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },

            ]
        },
        plugins: [
            new webpack.DefinePlugin({ IS_DEV_BUILD: JSON.stringify(isDevBuild) }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            }),
            new AureliaPlugin({ aureliaApp: 'boot' }),
           
        ].concat(isDevBuild ? [
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(bundleOutputDir, '[resourcePath]')  // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    }];
}
