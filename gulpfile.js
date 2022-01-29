const { series, src, dest } = require('gulp');

exports.chrome = function() {
    return src([
        "_locales/**",
        'background/**',
        'contentScript/**', 
        'core/**', 
        'i18n/**', 
        'iframe/**',
        'images/*.png', 
        'lib/**', 
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/jquery/dist/jquery.js', 
        'node_modules/bootstrap/dist/js/bootstrap.js',
        'node_modules/crypto-js/crypto-js.js',
        'node_modules/intro.js/intro.css',
        'node_modules/intro.js/intro.js',
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
        'node_modules/crypto-js/crypto-js.js',
        'node_modules/intro.js/intro.css',
        'node_modules/intro.js/intro.js',
        'lib/**',
        'core/*.css', 
        'images/*.png'
    ], { base: '.' })
    .pipe(dest('www/'));
}