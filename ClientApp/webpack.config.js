const path = require("path")


module.exports = {
    output: {
        path: path.join(__dirname, '/build'),
        filename: 'index.bundle.js',
    },
    devServer: {
        port: 3058,
        watchContentBase: true,
        historyApiFallback: true, // corrige o erro cannot get pagina do  <Switch> < Route path="/pag1" component={ Pag1 } /></Swith>
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            ///////
            // As 2  regras abaixo servem para difenciar os arquivos css / scss normais dos arquivos usados em modulos css no react
            // Como o webpack exige que os arquivos css usados para módulos tenha como nome algumacoisa.module.css esta exigência
            // é aproveitada nos arquivos abaixo : A primeira regra ( sem módulo ) usa o " exclude: /\.module\.css$/ " e a 
            // segunda regra (com módulo ) usa o  "include: /\.module\.css$/" . Sem estes elementos include e exclude como estão
            // Abaixo é gerado erro na compilação pelo webpack.
            // Note que não foi necessário instalar nenhum plugin adicional para usar o module css
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    // MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
                exclude: /\.module\.css$/
            },
            //////
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: "[name]__[local]___[hash:base64:5]",
                            },
                        }
                    }
                ],
                include: /\.module\.css$/
            },
            //////
            {
                test: /\.(jpg|png|svg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[hash].[ext]',
                },
            },

        ]
    }
}