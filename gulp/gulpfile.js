
const configDEV = require('./config.dev');
const configPRO = require('./config.pro');
const gulp = require('gulp');
const watch = require('gulp-watch');
const fileinclude = require('gulp-file-include');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const rename = require("gulp-rename");
const htmlmin = require('gulp-htmlmin');
const uglify = require('gulp-uglify'); 
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync');
const notify = require('gulp-notify');
const pump = require('pump');
const changed = require('gulp-changed');
const del = require('del');


// 开发环境
var env = gulp.env._[0] === undefined ? '' : 'pro';
if(env === 'pro'){
    config = configPRO;
}else{
    config = configDEV;
}
// 默认开发
gulp.task('default',['browser-sync']);
// 执行打包发布任务
gulp.task('pro', ['browser-sync']);
// 清除
gulp.task('del',function (cb) {
    del([
        '../hanjia/winter'
    ],{force: true}, cb);
});

gulp.task('html', function() {
        if(env === 'pro'){
            gulp.src(config.dev.html.src)
                .pipe(changed(config.dev.html.dest))
                // 合并模板 
                .pipe(fileinclude({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .pipe(htmlmin({collapseWhitespace: true}))
                // 不做处理输出
                .pipe(gulp.dest(config.dev.html.dest))
        }else{
            gulp.src(config.dev.html.src)
                .pipe(changed(config.dev.html.dest))
                // 合并模板 
                .pipe(fileinclude({
                    prefix: '@@',
                    basepath: '@file'
                }))
                // 不做处理输出
                .pipe(gulp.dest(config.dev.html.dest))
        }
});
gulp.task('js', function(cb) {
    if(env === 'pro'){
        pump([
            gulp.src(config.dev.js.src),
            changed(config.dev.js.dest),
            babel({
                presets: ['es2015']
            }),
            uglify(),
            rename({suffix: '.min'}),
            // 不做处理输出
            gulp.dest(config.dev.js.dest)
          ],cb
        );
    }else{
        pump([
            gulp.src(config.dev.js.src),
            changed(config.dev.js.dest),
            sourcemaps.init(),
            babel({
                presets: ['es2015']
            }),
            rename({suffix: '.min'}),
            sourcemaps.write('./maps'),
            // 不做处理输出
            gulp.dest(config.dev.js.dest)
          ],cb
        );
    }

});
gulp.task('sass',function(){
    if(env === 'pro'){
        gulp.src(config.dev.sass.src)
            .pipe(changed(config.dev.sass.dest))
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe( sass().on('error', notify.onError(function (error) {
                return "Message to the notifier: " + error.message;
            }) ))
            .pipe(cleanCSS({
                compatibility: 'ie8',
                rebase :false
            }))
            .pipe(gulp.dest(config.dev.sass.dest))
    }else{
        gulp.src(config.dev.sass.src)
            .pipe(changed(config.dev.sass.dest))
            .pipe(sourcemaps.init())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe( sass().on('error', notify.onError(function (error) {
                return "Message to the notifier: " + error.message;
            }) ))
            .pipe(cleanCSS({
                compatibility: 'ie8',
                format: 'keep-breaks' ,
                rebase :false
            }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(gulp.dest(config.dev.sass.dest))
    }

});
// 直接输出
gulp.task('img', function() {
    gulp.src(config.dev.img.src)
        .pipe(changed(config.dev.img.dest))
        .pipe(imagemin())
        .pipe(gulp.dest(config.dev.img.dest))
});
// 直接输出
gulp.task('plugin', function() {
    gulp.src(config.dev.plugin.src)
        .pipe(gulp.dest(config.dev.plugin.dest))
});
// 直接输出
gulp.task('common', function() {
    gulp.src(config.dev.common.src)
        .pipe(gulp.dest(config.dev.common.dest))
});


// watch
gulp.task('watch',function(){
    gulp.watch(config.dev.sass.src, ['sass']);
    gulp.watch(config.dev.html.src, ['html']).on("change", browserSync.reload);
    gulp.watch(config.dev.js.src, ['js']);
});
// browser-sync
gulp.task('browser-sync',['html','js','img','sass','plugin','common','watch'],function(){
    browserSync.init({
        server: {
            baseDir: "./",
            index: '/'
        },
        open:false,
        port: 1234
    });
});