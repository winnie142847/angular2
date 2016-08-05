"use strict";
// 引入 gulp
var gulp = require('gulp'),
    // 引入组件
    htmlmin = require('gulp-htmlmin'),
    jshint = require('gulp-jshint'),
    cache = require('gulp-cached'), // 缓存当前任务中的文件，只让已修改的文件通过管道
    remember = require('gulp-remember'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    pngquant = require('imagemin-pngquant'),
    rev = require('gulp-rev-append'), // 插入文件指纹（MD5）
    cssmin = require('gulp-minify-css'),
    cssver = require('gulp-make-css-url-version'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    merge      = require('merge-stream'),
    watch = require('gulp-watch'),
    changed = require('gulp-changed'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'), // 浏览器同步
    reload = browserSync.reload; // 自动刷新


/*  
    编译Sass gulp sass
    参考  http://www.w3cplus.com/preprocessor/sass-debug-with-developer-tool.html
*/

gulp.task('sass', function() {
    gulp.src(['src/sass/*.scss', 'src/sass/*/*.scss'])
        .pipe(watch(['src/sass/*.scss', 'src/sass/*/*.scss']))
        .pipe(cache('sass')) // 缓存传入文件，只让已修改的文件通过管道（第一次执行是全部通过，因为还没有记录缓存）
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(sass())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/css'))
        .pipe(notify({ message: 'Sass编译 完成' }));
});

// 检查脚本 gulp jshint (会对所有js 进行检查)
gulp.task('jshint', function() {
    //忽略扫描的文件路径
    var ignoreSrc = {
        'jquery': '!src/js/*/jquery.min.js',
        'fastclick': '!src/js/*/fastclick.js',
        'iSlide': '!src/js/*/iSlide/*.js',
        'moment': '!src/js/components/moment/moment.js'
    };

    gulp.src(['src/js/*/*.js', 'src/js/*/*/*.js', ignoreSrc.jquery, ignoreSrc.iSlide, ignoreSrc.moment])
   // gulp.src(['src/js/*/*.js', 'src/js/*/*/*.js', '!src/js/base/*.js','!src/js/components/*/*.js'])
        .pipe(cache('jshint'))
        .pipe(remember('jshint'))
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(notify({ message: '检查js脚本 完成' }));
});

//压缩html  gulp html
gulp.task('html', function() {
    gulp.src(['src/view/*.html', 'src/view/*/*.html'])
        .pipe(cache('html'))
        .pipe(rev()) // // 生成并插入 MD5（这里需要在HTML 引入后加?rev=@@hash才能识别且是相对路径，坑）
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist/view'))
        .pipe(notify({ message: '压缩html完成' }));
});

//压缩css gulp cssmin
gulp.task('cssmin', function() {
    gulp.src(['src/css/*.css', 'src/css/*/*.css'])
        .pipe(cache('cssmin'))
        .pipe(cssver()) //给css文件里引用文件加版本号（文件MD5）
        .pipe(cssmin({
            advanced: false, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
            compatibility: '*', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
            keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
            keepSpecialComments: '*'
                //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
        }))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({ message: 'css压缩完成' }));
});

/*
    合并，压缩js文件 gulp uglify  
    注意：已经开发使用了gulp-sourcemaps，console.log 
    或者报错信息会直接在生产环境显示
    参考：
    https://www.npmjs.com/package/gulp-sourcemaps
    http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html
*/
gulp.task('uglify', function() {
    gulp.src(['src/js/*/*.js', 'src/js/*/*/*.js'])
        .pipe(cache('uglify'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({ message: '合并，压缩js文件 完成' }));
});

// 图片压缩  gulp images  
gulp.task('images', function() {
    gulp.src('src/images/*/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }], //不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest('dist/images'))
        .pipe(notify({ message: '图片压缩完成' }));
});

// 默认任务  提测时打包使用  gulp
gulp.task('default', function() {
    gulp.start('cssmin', 'html', 'uglify','images');
});

// Watch 开发时使用 gulp watch  
gulp.task('watch', ['sass','jshint'], function() {
    // Watch 编译sass
   gulp.watch(['src/sass/*.scss', 'src/sass/*/*.scss'], ['sass']);
    // Watch 检查js
   gulp.watch(['src/js/*/*.js', 'src/js/*/*/*.js'], ['jshint']);
});
