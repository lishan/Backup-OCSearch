> 需要系统中安装了git, node, bower工具，本文的运行版本是
> `node -v` v6.9.1
> `bower -v` 1.8.0
> `gulp -v` CLI version 1.2.2

[示例代码的Github地址](https://github.com/lishan/OCProject/tree/master/Basic)
[简书地址](http://www.jianshu.com/p/cb5b76c3aa36)

## 使用yeoman generators

+ angular generator是一个angular骨架代码生成工具

```
yo angular
? Would you like to use Gulp (experimental) instead of Grunt? Yes
? Would you like to use Sass? Yes
? Would you like to include Bootstrap? Yes
Which modules would you like to include? angular-animate.js, angular-aria.js, angular-cookie
s.js, angular-resource.js, angular-messages.js, angular-route.js, angular-sanitize.js, angular
-touch.js
```

## 安装karma的依赖

```
npm install generator-karma --save-dev
```
> Tips: 加上`--save-dev`参数不仅会在本地安装需要的包，而且会把依赖添加到package.json中，供别人同步代码的时候使用。生成代码如下:
> `"generator-karma": "^2.0.0",`

## 安装项目需要的依赖的node_modules和bower_components

```
npm install
bower install
```

## 运行gulp任务

> Gulp是一个前端开发工具，通过gulp可以方便的配置build, test, 依赖注入等等的工作，只需要执行类似`gulp test`这样一个命令。

+ 由于gulp本身被包含在项目的依赖中，可以在node_modules下面找到

```
./node_modules/gulp/bin/gulp.js -version
```

+ 通过embed gulp来运行build项目

```
./node_modules/gulp/bin/gulp.js
```

+ 通过embed gulp来启动一个本地的dev环境

```
./node_modules/gulp/bin/gulp.js serve
```

> Tips: 其实可以在global环境下安装gulp，而不用每次都输入gulp的完整路径，运行`npm install -g gulp-cli`来安装。
> 我们推荐使用这种方式，所以在之后的内容中都将直接采用类似`gulp serve`的写法

+ 在运行了gulp serve之后，会默认打开系统默认的浏览器

![屏幕快照 2017-03-27 下午1.53.17.png](http://upload-images.jianshu.io/upload_images/4623363-6f78d1f7ff91b792.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

+ 查看gulpfile.js文件，我们可以修改文件使之打开firefox浏览器，来帮助我们调试，当然你系统中要已经安装了firefox

```diff
gulp.task('start:client', ['start:server', 'styles'], function () {
-  openURL('http://localhost:9000');
+  openURL('http://localhost:9000','firefox');
 });
```

## 修改wiredep配置

+ 打开gulpfile.js配置文件可以看到，这里的bower任务是发现所有bower依赖（包括css和js），运行`gulp bower`将其注入到index.html中。

+ css 注入示例，运行之后会在中间加入css依赖
```
  <!-- build:css(.) styles/vendor.css -->
  <!-- bower:css -->
  <link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.css" />
  <!-- endbower -->
  <!-- endbuild -->
```
+ js 注入
```
  <!-- build:js(.) scripts/vendor.js -->
  <!-- bower:js -->
  <script src="bower_components/jquery/dist/jquery.js"></script>
  <script src="bower_components/angular/angular.js"></script>
  <script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>
  <script src="bower_components/angular-animate/angular-animate.js"></script>
  <script src="bower_components/angular-aria/angular-aria.js"></script>
  <script src="bower_components/angular-cookies/angular-cookies.js"></script>
  <script src="bower_components/angular-messages/angular-messages.js"></script>
  <script src="bower_components/angular-resource/angular-resource.js"></script>
  <script src="bower_components/angular-route/angular-route.js"></script>
  <script src="bower_components/angular-sanitize/angular-sanitize.js"></script>
  <script src="bower_components/angular-touch/angular-touch.js"></script>
  <!-- endbower -->
  <!-- endbuild -->
```

+ 但是在默认的yeoman生成的代码中，bower任务如下，这地方有两个问题
```
// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: yeoman.app + '/bower_components',
      ignorePath: '..'
    }))
  .pipe(gulp.dest(yeoman.app + '/views'));
});
```

  1. 可以发现directory变量指向的app/bower_components，但是bower默认安装在根目录下，需要修改这个路径
  2. 生成的gulp.dest pipeline是把index.html放到app/views，但是启动的时候寻找app的index.html

+ 为了解决上面两个问题，首先需要修改.bowerrc文件，指定其生成目录的位置
```
{
  "directory": "app/bower_components",
  "strict-ssl": false
}
```
+ 其次修改gulp.js，重新生成的index.html覆盖原来的
```diff
// inject bower components
gulp.task('bower', function () {
  return gulp.src(paths.views.main)
    .pipe(wiredep({
      directory: yeoman.app + '/bower_components',
      ignorePath: '..'
    }))
-  .pipe(gulp.dest(yeoman.app + '/views'));
+  .pipe(gulp.dest(yeoman.app)); //这里放到app目录下会覆盖原来的index.html
});
```

+ 由于每次运行wiredep需要执行`gulp bower`，怎样在`gulp serve`中每次自动运行下`gulp bower`把新添的bower依赖放到index.html中？可以通过添加gulp任务依赖的方式
```diff
-gulp.task('start:server', function() {
+gulp.task('start:server', ['bower'], function() {// 这里的中括号bower，就是运行启动server时候的依赖
  $.connect.server({
    root: [yeoman.app, '.tmp'],
    livereload: true,
    // Change this to '0.0.0.0' to access the server from outside.
    port: 9000
  });
});
```

+ 运行`gulp serve`, 会直接打开firefox显示结果

![屏幕快照 2017-03-4427 下午2.37.58.png](http://upload-images.jianshu.io/upload_images/4623363-dbc0601a14bb70b3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## Gulp load plugins

这是一个非常有用的语法糖，可以帮助用户方便的访问已经安装的gulp插件。

```js
var $ = require('gulp-load-plugins')();
$.jshint;//gulp-jshint
$.sass;  //gulp-sass
```

## Gulp nodemon

Nodemon在开发过程中相当有用，它会自动监测nodejs源代码，然后重新启动。
以下是一个例子，注意callback函数的作用。
> Tips:很多时候，我们说一个gulp任务A依赖于另外一个gulp任务B，其实是在A的callback函数返回的时候，表明A任务已经完成，之后才会去调用B任务。
> 所以在定义一些有依赖的gulp任务函数的时候，需要注意callback函数的写法。
```js
gulp.task('start:server', [],(callback) => {
  let started = false;
  return $.nodemon({// $.nodemon是gulp load plugin的写法
    script: 'build-server/app.js',
    ignore: ["app","dist","upload","node","node-v6.9.1","build-server"]
  }).on('start', function () {
    if (!started) { //为了防止执行多次
      callback();
      started = true;
    }
  });
});
```

## Gulp watch and livereload

与nodemon的后端监测相对的，前端监测使用watch和livereload配合。watch用来监测文件，当文件有改动的时候，livereload可以动态的加载到服务器上，
需要注意的是，livereload是一个服务进程，可以加载包括html,前端js,css等等文件。

```js
gulp.task('watch', function () {
  $.livereload.listen();

  $.watch(paths.views.files)
    .pipe($.plumber())
    .pipe($.livereload());
  });
```

## 使用ES6

gulp本身的gulpfile.js可以支持ES6, 例如上面代码中使用到的let定义变量，匿名函数等等功能。需要更名为gulpfile.babel.js，可以看到这里还是采用babel解释器的方式来使用es6。
对于别的js代码，如果想使用es6的时候，可以使用gulp babel的转码器，转成es2015的格式，在浏览器上运行。下面的一个流说明了这个问题。
```js
let es6ClientScript = lazypipe()
  .pipe($.babel, {
    presets: ['es2015']
  })
  .pipe(gulp.dest, paths.buildScriptsDest);
```

## 小结

+ yeoman的generator可以方便的帮助我们快速的建立一个骨架工程，例如generator-angular-fullstack，可以生成一个全栈的工程，包括express server，提供mongodb依赖
+ gulp是一个非常强大的项目管理工具，可以完成build, test, 注入，打包，等等功能
+ wiredep是一个非常实用的工具，可以方便的注入bower的依赖

## 思考题
1. 文件.bowerrc有什么作用？`"strict-ssl": false`有什么作用？思考.npmrc有什么作用？
2. 怎样理解下面的代码？
```
gulp.task('build', ['clean:dist'], function () {
  runSequence(['images', 'copy:extras', 'copy:fonts', 'client:build']);
});
```

讨论：1.文中可以看到，.bowerrc是bower的配置文件，可以指定bower的安装地址，当然还可以配置其他项，`"strict-ssl": false`就是一个例子，表示不启用严格的ssl验证，在有些时候不能下载包的时候需要考虑关闭strict ssl。npmrc和bowerrc类似，是npm安装时候的配置。是一个npmrc的配置，主要解决的是国内包下载慢的问题，前两个对应了phantomjs和node-sass这两个包在国内的镜像。
```
phantomjs_cdnurl=http://cnpmjs.org/downloads
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
registry=https://registry.npm.taobao.org
```
2.这个一个build任务，一般情况下是gulp的默认任务。在运行build前，可以看到要执行clean:dist任务来做一些清理，可以看到build是依赖于clean:dist的，只有当clean:dist执行结束返回的时候build才会启动；而其中的runSequence是一个gulp插件，表示执行一组任务，但是其中的任务没有严格顺序，注意和依赖区分。
