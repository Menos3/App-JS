// -----------------
// Gulp + Plugins
// -----------------

const { src, dest, series, parallel, watch } = require('gulp')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const del = require('del')

// -----------------
// Global config
// -----------------
const srcPath = './src/'
const destPath = '../../ftp/html'

// -----------------
// Private tasks
// -----------------

// Task A
function copySourceFiles(cb) {
    // Esborrem els fitxers previs
    del([destPath + '**/*.*'], cb)
    // Copiem els nous fitxers
    return src([srcPath + '**/*.{html,css,js,svg,png,jpg,jpeg}'])
        .pipe(dest(destPath))
}

// Task B
function minifyCss(cb) {
	// Assignem ruta
        return src([srcPath + 'styles/*.css'])
	// Minimitzar css
        .pipe(cleanCSS())
	// Posem el nou fitxer
        .pipe(dest(destPath + 'styles/'))
	cb();
}

// Task C
function minifyJs(cb) {
    return src([srcPath + 'scripts/*.js'])
	.pipe(uglify())
	.pipe(dest(destPath + 'scripts/'))
    cb()
}

// -----------------
// Public tasks
// -----------------

// Task 1. Copy source files (A)
// Copia fitxers
exports.update = copySourceFiles

// Task 2. Minify CSS and JS (B+C)
// Carrega el minifycss i minifyjs per separat
exports.minify = parallel(
    minifyCss,
    minifyJs
)

// Task 3. Execute tasks when a change occurs
exports.watch = function(cb) {
    // TO DO
    watch('src/styles/*.css', {events: 'change'}, {delay: 300}, function(cb) {
	minifyCss(cb)
    })

    watch('src/scripts/*.js', {events: 'change'}, {delay: 300}, function(cb){
	minifyJs(cb)
    })
   cb()
}

// Task 4. Execute tasks 1 and 2
// Executa tot junt
exports.default = series(
    this.update,
    this.minify
)
