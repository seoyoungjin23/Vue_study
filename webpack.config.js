const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => {
  const config = {
    // 확장자 생략 가능
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '~': path.join(__dirname),
        'scss': path.join(__dirname, './scss')
      }
    },
    // 진입점
    entry: {
      app: [
        '@babel/polyfill',
        path.join(__dirname, 'main.js') // 진입점의 별칭
      ]
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // app.js
      path: path.join(__dirname, 'dist') // app.js를 dist 폴더에 넣어서 결과물을 만든다.
    },
    // webpack의 중간 처리 과정에 관여한다.(모듈 처리 방식 관리)
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          // 모든 파일을 babel-loader로 해석할 필요는 없다.
          // 우리가 작성한 파일만 신경쓰면된다.
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'

        },
        {
          // 적용되는 순서대로 써야한다.
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    // webpack의 중간 처리 과정에 관여한다.(모듈 처리 이후 추후에 어떤 처리를 해야하는 지 관리)
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html') // index.html을 dist 파일로 연결시켜준다.
      }),
      new CopyPlugin([
        {
          from: 'assets/', // 복사를 하는 대상이 되는 폴더
          to: '' // 복사 폴더를 지정 기본은 dist
        }
      ])
    ]
  }

  // 개발용
  if (opts.mode === 'development') {
    return merge(config, {
      devtool: 'eval',
      devServer: {
        open: false, // 브라우저가 바로 열리게 하는 옵션
        hot: true // 수정 사항 바로 적용
      }
    })
  }

  // 제품용
  if (opts.mode === 'production') {
    return merge(config, {
      devtool: 'cheap-module-source-map',
      plugins: [
        new CleanWebpackPlugin()
      ]
    })
  }
}
