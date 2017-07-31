# Cookie stamp

Please before getting started with Cookie Stampe take your time to read Cheil Styleguides.


## Getting Started

Welcome to Cookie-Stamp! The [gulp] flavor of our microsite generator! If you're not familiar with gulp, we suggest checking out [their docs][gulp-docs].

The first thing to do, once pulled this repository is to download all assets from Samsung.com, run:

```sh
$ gulp assets
```

Assets from both btb & btc will be downloaded and served from `assets`

To start developing, run:

```sh
$ gulp serve
```

This will fire up a local web server, open http://106.x.x.x:9000 in your default browser and watch files for changes, reloading the browser automatically via [LiveReload].




To make a production-ready build of the app, run:

```sh
$ gulp
```

To preview the production-ready build to check if everything is ok:

```sh
$ gulp serve:dist
```

To deploy on AEM

```sh
$ gulp P5
```


## Tasks

To get the list of available tasks, run:

```sh
$ gulp --tasks
```


## Serve

We use the `.tmp` directory mostly for compiling assets like SCSS files. It has precedence over `app`, so if you had an `app/index.html` template compiling to `.tmp/index.html`, http://localhost:9000 would point to `.tmp/index.html`, which is what we want.

This system can be a little confusing with the `watch` task, but it's actually pretty simple:

* notify LiveReload when compiled assets change
* run the compile task when source assets change

E.g. if you have Less files, you would want to notify LiveReload when Less files have compiled, i.e. when `.tmp/styles/**/*.css` change, but you would want to compile Less files by running the `styles` task when source files change, i.e. `app/styles/**/*.less`.

## Bower

We keep `bower_components` in the project root, you can read details about that [here](bower.md). Installing Bower components is usually as easy as:

```sh
$ bower install --save jquery
```

Behind the scenes [wiredep] will automatically inject assets from your Bower components to your HTML/SCSS files as soon as you run `gulp serve` or `gulp`. If `gulp serve` was already running while installing the components, the injection will happen immediately.

However, in some situations you'll have to do some extra work:

### 1. There are images/fonts in the component

These are a bit tricky, as they can't be automatically injected. Ideally you would want to put them in a place where the link would work both in development and in production, like we do with Bootstrap, but that's sometimes not possible. In those cases you would need to do some [gulp-replace][replace] trickery.

### 2. Field values in the component's `bower.json` are incorrect or missing

If there's a problem, it's usually with the `main` field, which wiredep uses to wire up assets. Fortunately you can always [override][override] these fields and send a pull request to that component's repository, fixing their `bower.json` :wink:

[gulp]:       https://github.com/gulpjs/gulp
[gulp-docs]:  https://github.com/gulpjs/gulp/blob/master/docs/README.md
[yo]:         https://github.com/yeoman/yo
[LiveReload]: https://github.com/intesso/connect-livereload
[plugins]:    https://github.com/jackfranklin/gulp-load-plugins
[calc]:       https://github.com/postcss/postcss-calc
[wiredep]:    https://github.com/taptapship/wiredep
[replace]:    https://github.com/lazd/gulp-replace
[override]:   https://github.com/taptapship/wiredep#bower-overrides

## Extra Tasks

To get an archive of the `/dist` folder you can

```sh
$ gulp tar
```

You can star your server && open the `*.project` file with

```sh
$ gulp dev
```
