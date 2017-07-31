// generated on 2016-12-01 using generator-webapp 2.3.2
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const runSequence = require('run-sequence');
const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const fs = require('fs');
const glob = require('glob');
const scraper = require('website-scraper');
const ProgressBar = require('progress');
const browserify = require('browserify');
const babelify = require('babelify');
const vueify = require('vueify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const moduleImporter = require('sass-module-importer');
const es = require('event-stream');
// const argv = require('yargs').argv;

var dev = true;
var samsungAssetsPath = 'err: ASSETS-NOT-ASSIGNED';

/**
 * here you can define the assets list
 */

var os = require('os');

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
  for (var k2 in interfaces[k]) {
    var address = interfaces[k][k2];
    if (address.family === 'IPv4' && !address.internal) {
      addresses.push(address.address);
    }
  }
}

function findEthIp(ip) {
  return ip.indexOf('106') !== -1;
}

const localIP = addresses.find(findEthIp) || addresses[0];

const root = 'http://www.samsung.com';
const assetsFolder = './assets';

const listBtc = [
  root + '/fr/next/html/static/static_header1.html',
  root + '/fr/next/html/static/static_header1_new.html',
  root + '/fr/next/html/static/static_header_mid.html',
  root + '/fr/next/html/static/static_header2.html',
  root + '/fr/next/html/static/static_header2_new.html',
  root + '/fr/next/html/static/static_footer.html',
  root + '/fr/next/html/static/static_footer_new.html',
  root + '/fr/next/ssi/footer/footer_local_script.sec'
];

const listBtb = [{
  url: root + '/fr/b2b4/ssi/static/b2b4_static_head.sec',
  filename: 'b2b4_static_head.html'
},
{
  url: root + '/fr/b2b4/ssi/static/b2b4_static_header.sec',
  filename: 'b2b4_static_header.html'
},
{
  url: root + '/fr/b2b4/ssi/static/b2b4_static_footer.sec',
  filename: 'b2b4_static_footer.html'
}
];

var assetsExist = fs.existsSync('./assets');

// remove assetsFolder if not empty
var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

gulp.task('styles', () => {
  return gulp.src('app/styles/*.scss')
    .pipe($.sass({
      importer: moduleImporter()
    }))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(reload({
      stream: true
    }));
});

gulp.task('scripts', (done) => {

  // const b = browserify({
  //     entries: 'app/scripts/main.js',
  //     transform: [babelify, vueify],
  //     debug: true
  // });

  // return b.bundle()
  //     .pipe(source('bundle.js'))
  //     .pipe($.plumber())
  //     .pipe(buffer())
  //     .pipe($.sourcemaps.init({
  //         loadMaps: true
  //     }))
  //     .pipe($.sourcemaps.write('.'))
  //     .pipe(gulp.dest('.tmp/scripts'))
  //     .pipe(reload({
  //         stream: true
  //     }));

  glob('app/scripts/main-**.js', (err, files) => {

    // done(err);
    if (err) {};

    const tasks = files.map(function(entry) {

      return browserify({
        entries: [entry],
        transform: [babelify, vueify],
        debug: true
      })
        .bundle()
        .pipe(source(entry))
        .pipe($.rename({
          dirname: '/',
          extname: '.bundle.js'
        }))
        .pipe($.plumber())
        .pipe(buffer())
        .pipe($.sourcemaps.init({
          loadMaps: true
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('.tmp/scripts'))
        // .pipe(gulp.dest('test/scripts'))
        .pipe(reload({
          stream: true
        }));
    });

    es.merge(tasks).on('end', done);

  });

});

function lint(files, options) {
  return gulp.src(files);
  // .pipe($.eslint({
  //     fix: true
  // }))
  // .pipe(reload({
  //     stream: true,
  //     once: true
  // }))
  // .pipe($.eslint.format())
  // .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

gulp.task('lint', () => {
  return lint('app/scripts/**/*.js')
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('lint:test', () => {
  return lint('test/spec/**/*.js')
    .pipe(gulp.dest('test/spec'));
});

gulp.task('html', ['styles', 'scripts'], () => {

  return gulp.src('app/**/*.html')
    .pipe($.useref({
      searchPath: ['.tmp']
    }))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', $.stripDebug()))
    .pipe($.if('*.css', $.cssnano({
      safe: true,
      autoprefixer: false
    })))
    // .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('set-dev-node-env', function() {
  return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod-node-env', function() {
  return process.env.NODE_ENV = 'production';
});

gulp.task('inline', () => {

  console.log(process.env.NODE_ENV);

  return gulp.src('dist/**/*.html')
    .pipe($.removeHtml())
    .pipe($.smoosher({
      // ignoreFilesNotFound: true
    }))
    .pipe($.if(samsungAssetsPath !== '/', $.stringReplace(/\/images\//g, samsungAssetsPath)))
    .pipe($.if(samsungAssetsPath !== '/', $.stringReplace(/\.png/g, '.png?$ORIGIN_PNG$')))
    .pipe($.if(samsungAssetsPath !== '/', $.stringReplace(/\.jpg/g, '.jpg?$ORIGIN_JPG$')))
    .pipe($.if(samsungAssetsPath !== '/', $.stringReplace(/\.gif/g, '.gif?$ORIGIN_GIF$')))
    .pipe(gulp.dest('dist'));

});

gulp.task('images', () => {
  return gulp.src('app/images/**/*')
    // .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('extras', () => {
  return gulp.src([
    'app/*',
    '!app/**/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('cms', function() {

  $.connect.server({
    root: ['./assets/btb', './assets/btc'],
    port: 9010
  });

});

gulp.task('serve', ['set-dev-node-env'], () => {

  runSequence(['clean', 'wiredep'], ['cms', 'styles', 'scripts'], () => {

    if (!assetsExist) {

      console.log('sorry, you must download the assets first -> "gulp assets"');
      process.exit();

    } else {

      var browserSyncSsi = $.connectSsi({
        baseDir: `${__dirname}/app`,
        domain: 'http://' + localIP + ':9010/',
        method: 'readOnLine' // readOnLine|readLocal|readOnLineIfNotExist|downloadIfNotExist
      });

      browserSync.init({
        notify: false,
        port: 9000,
        open: 'external',
        // logLevel: 'debug',
        host: localIP,
        server: {
          baseDir: ['.tmp', '.', 'app', '.utilities', 'assets/btc', 'assets/btc/fr', 'assets/btc/fr/next', 'assets/btb'],
          middleware: [browserSyncSsi],
          // middleware: [browserSyncSsi, browserSyncRewrite],
          routes: {
            '/bower_components': 'bower_components',
            '/node_modules': 'node_modules'
            // '/fr': 'assets/fr',
          }
        }
      });

      gulp.watch([
        'app/**/*.html',
        'app/images/**/*',
      ]).on('change', reload);

      gulp.watch('app/styles/**/*.scss', ['styles']);
      gulp.watch('app/scripts/**/*.js', ['scripts']);
      gulp.watch('app/scripts/**/*.vue', ['scripts']);
      gulp.watch('bower.json', ['wiredep']);

    }

  });
});

gulp.task('serve:dist', ['cms'], () => {

  var browserSyncSsi = $.connectSsi({
    baseDir: `${__dirname}/dist`,
    domain: 'http://' + localIP + ':9010/',
    method: 'readOnLine' // readOnLine|readLocal|readOnLineIfNotExist|downloadIfNotExist
  });

  browserSync.init({
    notify: false,
    port: 9000,
    open: 'external',
    // logLevel: 'debug',
    host: localIP,
    server: {
      baseDir: ['dist', '.', 'assets/btc', 'assets/btc/fr', 'assets/btc/fr/next/', 'assets/btb'],
      middleware: [browserSyncSsi],
      // middleware: [browserSyncSsi, browserSyncRewrite],      // routes: {
      //   '/bower_components': 'bower_components',
      //   '/node_modules': 'node_modules'
      //   // '/fr': 'assets/fr',
      // }
    }
  });

});

gulp.task('serve:test', ['scripts'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': '.tmp/scripts',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['scripts']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('app/styles/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('app/styles'));

  gulp.src('app/**/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
});

// // retrieve assets
// gulp.task('assets', function() {

//   deleteFolderRecursive(assetsFolder);

//   var optionsBtc = {
//     urls: listBtc,
//     directory: './assets/btc/',
//     filenameGenerator: 'bySiteStructure'
//   };

//   var optionsBtb = {
//     urls: listBtb,
//     directory: './assets/btb/',
//     // filenameGenerator: 'bySiteStructure',
//     filenameGenerator: 'byType',
//     recursive: false,
//     subdirectories: [{
//       directory: 'assets_img',
//       extensions: ['.jpg', '.png', '.svg', '.gif', '.ico']
//     },
//     {
//       directory: 'assets_js',
//       extensions: ['.js']
//     },
//     {
//       directory: 'assets_fonts',
//       extensions: ['.woff', '.ttf', '.eot']
//     },
//     {
//       directory: 'assets_css',
//       extensions: ['.css']
//     }
//     ],
//     prettifyUrls: true
//   };

//   console.log(' \ndownloading assets from \n' + root + ' \n');
//   var bar = new ProgressBar('downloading assets :bar', {
//     total: 250
//   });
//   var timer = setInterval(function() {

//     bar.tick();

//   }, 750);

//   var btbDone = false;
//   var btcDone = false;
//   var resetBar = function() {
//     if (btbDone && btcDone) {
//       clearInterval(timer);
//       console.log('done!');
//     } else {
//       return;
//     }
//   };

//   scraper(optionsBtb, function(error, result) {

//     console.log(error);

//     gulp.src('./assets/btb/b2b4_static_footer.html')
//       .pipe($.rename('/fr/b2b4/ssi/static/b2b4_static_footer.sec'))
//       .pipe(gulp.dest('./assets/btb'));

//     gulp.src('./assets/btb/b2b4_static_head.html')
//       .pipe($.rename('/fr/b2b4/ssi/static/b2b4_static_head.sec'))
//       .pipe(gulp.dest('./assets/btb'));

//     gulp.src('./assets/btb/b2b4_static_header.html')
//       .pipe($.rename('/fr/b2b4/ssi/static/b2b4_static_header.sec'))
//       .pipe(gulp.dest('./assets/btb'));

//     // console.log('btb done!');
//     btbDone = true;
//     resetBar();

//   });

//   scraper(optionsBtc, function(error, result) {

//     console.log(error);
//     // console.log('btc done!');
//     btcDone = true;
//     resetBar();

//   });

// });

gulp.task('tar', function() {

  var d = new Date(Date.now());
  var h = d.getHours().toString();
  var m = d.getMinutes().toString();
  var s = d.getSeconds().toString();
  var day = d.toDateString().split(' ').join('_');

  gulp.src('./dist/**')
    .pipe($.tar(h + '_' + m + '_' + s + '_' + day + '.tar'))
    .pipe($.gzip())
    .pipe(gulp.dest('./tar'));
});

gulp.task('build', ['set-prod-node-env', 'lint', 'html', 'images', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('default', () => {

  return new Promise(resolve => {

    dev = false;

    return gulp.src('app/**/*.html')
      .pipe($.prompt.prompt({
        type: 'list',
        name: 'env',
        message: 'What is your Environment output ?',
        choices: ['P4', 'P5']
      }, function(res) {

        if (res.env === 'P5') {

          return gulp.src('app/**/*.html')
          .pipe($.prompt.prompt([{
            type: 'list',
            name: 'assets',
            message: 'Where are you hosting your images ?',
            choices: ['P4', 'P5']
          },
          {
            type: 'input',
            name: 'url',
            message: 'Please enter your assets path ex: /smartphone/galaxy-s7/gear-360/ \n'
          }], function(res) {

            if (res.assets === 'P5') {

              samsungAssetsPath = '/content/dam/samsung/fr' + res.url;

            } else {

              samsungAssetsPath = 'http://www.samsung.com/fr' + res.url;

            }

            runSequence(['clean', 'wiredep'], 'build', 'inline', resolve);

          }));

        } else {

          runSequence(['clean', 'wiredep'], 'build', resolve);

        }

      }));
  });
});
