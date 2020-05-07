const path = require('path');
const paths = require('./paths');
const os = require('os');
const webpack = require('webpack');
const HappyPack = require('happypack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const resolve = (pathName) => path.resolve(__dirname, '../' + pathName);
const isEnvDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: [paths.appIndexJs],
  output: {
    filename: 'js/[name].[hash].js',
    path: paths.appBuild,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@': resolve('src'),
    },
  },
  module: {
    // If exports is missing, an error will be reported instead of a warning.
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              cache: true,
              formatter: require.resolve('react-dev-utils/eslintFormatter'),
              eslintPath: require.resolve('eslint'),
              resolvePluginsRelativeTo: __dirname,
            },
          },
        ],
        include: paths.appSrc,
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        // 把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
        loader: 'happypack/loader?id=happyBabel',
        exclude: /node_modules/,
      },
      {
        test: /\.(css|less)$/,
        use: [
          'style-loader',
          !isEnvDevelopment && {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')({
                  autoprefixer: {
                    flexbox: 'no-2009',
                  },
                  stage: 3,
                }),
              ],
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: '1024',
              name: 'static/front/[name].[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('public/index.html'),
      favicon: resolve('public/favicon.ico'),
      title: 'Kiple',
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
        minifyJS: true,
        minifyCSS: true,
      },
    }),
    new HappyPack({
      id: 'happyBabel',
      loaders: [
        {
          loader: 'babel-loader?cacheDirectory=true',
        },
      ],
      threadPool: happyThreadPool,
      verbose: true,
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_ENV': JSON.stringify(process.env.REACT_APP_ENV) || JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  optimization: {
    // split code
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|redux)/, // 如果考虑到依赖太大的话，只引入react相关的依赖和首页的依赖，其他都是用动态加载的方式
          priority: 20,
          // 表示是否使用已有的 chunk,如果为 true 则表示如果当前的 chunk 包含的模块已经被抽取出去了，那么将不会重新生成新的
          reuseExistingChunk: true,
        },
        echarts: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/](echarts|zrender)[\\/]/,
          priority: 2,
          name: 'echarts',
        },
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          minSize: 0,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
};
