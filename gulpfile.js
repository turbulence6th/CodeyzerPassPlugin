const { series, src, dest } = require('gulp');

exports.chrome = function() {
    return src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/jquery/dist/jquery.js', 
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'background/**', 
        'contentScript/**', 
        'core/**', 
        'iframe/**', 
        'images/**', 
        'kaynak/**', 
        'lib/**', 
        'popup/**', 
        'manifest.json'
    ], { base: '.' })
    .pipe(dest('chrome/'));
}

exports.mobil = function() {
    return src([
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/jquery/dist/jquery.js', 
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'lib/**',
        'core/*.css', 
        'images/**'
    ], { base: '.' })
    .pipe(dest('www/'));
}