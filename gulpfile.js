'use strict'

const gulp = require('gulp')
const gulpConnect = require('gulp-connect')
const clean = require('gulp-clean')
const concat = require('gulp-concat')
const minifyCss = require('gulp-css-minify')
const minifyJs = require('gulp-uglify')
const nunjucks = require('gulp-nunjucks')
const rename = require('gulp-rename')
const sass = require('gulp-sass')(require('sass'))
const dependencies = require('gulp-web-dependencies')
const npmDist = require('gulp-npm-dist')

// minify js
gulp.task('minify-js', async function(){
    gulp.src('./src/js/*.js')
        .pipe(concat('velin.js'))
        .pipe(minifyJs())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(gulpConnect.reload())
})

gulp.task('build-css', async function(){
    gulp.src('./src/sass/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./dist/assets/css'))
        .pipe(gulpConnect.reload())
})

gulp.task('compile-html', async function(){
    gulp.src('./src/pages/*.html')
        .pipe(nunjucks.compile({
            version: '1.0.0',
            appName: 'Velin Template',
            copyright: '2023',
            author: 'Dede Eli Permana'
        }))
        .pipe(dependencies({
            dest: './dist',
            prefix: 'vendors',
        }))
        .pipe(gulp.dest('./dist/pages'))
        .pipe(gulpConnect.reload())
})

gulp.task('copy-vendor', async function(){
    gulp.src(
        npmDist({
            copyUnminified: true,
            excludes: ['/**/*.txt']
        }), 
        {base:'./node_modules'}
    ).pipe(rename(function(path) {
        path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '');
    })).pipe(gulp.dest('./dist/assets/vendors'))
})

gulp.task('watch', async function(){
    gulp.watch('./src/js/*.js', gulp.series('minify-js'))
    gulp.watch('./src/sass/**/*.scss', gulp.series('build-css'))
    gulp.watch('./src/sass/*.scss', gulp.series('build-css'))
    gulp.watch('./src/pages/*.html', gulp.series('compile-html'))
    gulp.watch('./src/pages/**/*.html', gulp.series('compile-html'))
})

gulp.task('clean', function () {
    return gulp.src('dist',{
        read: false,
        allowEmpty: true,
    }).pipe(clean())
})

gulp.task('server', async function () {
    gulpConnect.server({
        root: 'dist',
        livereload: true
    })
})

gulp.task('default', gulp.series('watch', 'server'))
gulp.task('build', gulp.series('clean', 'build-css', 'minify-js', 'compile-html'))
