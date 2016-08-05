gulp 前端自动化工具
======================


1. 开发时使用 gulp watch

2. 提测时打包使用  gulp


> 参考（有些参考链接已经在相关的配置注释中写道）   

1.(gulp介绍和安装)  http://www.ydcss.com/archives/18

2.(安装gulp相应的组件)  https://npm.taobao.org/

3.(sass安装及语法)  http://www.w3cplus.com/sassguide/install.html

4.图片软件压缩参考（http://www.cnblogs.com/PeunZhang/p/3375729.html）

## gulp 安装和使用

1.根据参考链接安装node、gulp、ruby

2.安装gulp 相应组件（目前是我安装的，提示未找到的可以到淘宝镜像上自行安装，后期可能根据需求再次添加其他组件） cnpm install gulp-htmlmin gulp-jshint gulp-cached gulp-remember gulp-sass gulp-sourcemaps gulp-concat 'gulp-uglify gulp-rename gulp-imagemin gulp-notify imagemin-pngquant gulp-rev-append gulp-minify-css gulp-make-css-url-version gulp-autoprefixer gulp-watch gulp-changed gulp-plumber browser-sync

## 项目结构
1.src 为开发目录，（项目的css、images、js、Sass、view在各自对应的目录下建立各自的文件夹）

2.dist  为gulp 打包后的目录用于线上环境（对HTML，css，js，images进行了压缩合并）


