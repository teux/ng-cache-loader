# Angular Template loader for webpack

Puts HTML partials in the Angular's $templateCache so directives can use templates without initial downloading.

## Webpack and loaders

Webpack is the [webpack](http://webpack.github.io/) and it's module bundler. [Loaders](http://webpack.github.io/docs/using-loaders.html) wrap content in the javascript code that executes in the browser. 

# Install

`npm install ng-cache-loader`

# Usage

You can require html partials via `ng-cache-loader`:

``` javascript
require('ng-cache!./demo/template/myPartial.html');
```

Partial will be available as `ng-include="'myPartial.html'"`
or `templateUrl: 'myPartial.html'`.

Note that the inline require syntax is used in examples for simplicity. 
It's recommended to use webpack [config](#webpack-config).

## Named templates

You can wrap template in the `script` tag:

``` html
<!-- ./demo/template/myPartial.html -->

<script type ="text/ng-template" id="myFirstTemplate">
  <!-- then use ng-include="'myFirstTemplate'" -->
</script>
```

You can have multiple templates in one file:

``` html
<!-- ./demo/template/myPartial.html -->

<script type ="text/ng-template" id="myFirstTemplate">
  <!-- then use ng-include="'myFirstTemplate'" -->
</script>

<script type ="text/ng-template" id="mySecondTemplate">
  <!-- then use ng-include="'mySecondTemplate'" -->
</script>
```

You can mix named templates and simple markup:

``` html
<!-- ./demo/template/myPartial.html -->

<script type ="text/ng-template" id="myFirstTemplate">
  <!-- then use ng-include="'myFirstTemplate'" -->
</script>

<!-- markup outside script tags available as ng-include="'myPartial.html'" -->
<div ng-include="'myFirstTemplate'">...</div>

<script type ="text/ng-template" id="mySecondTemplate">
  <!-- then use ng-include="'mySecondTemplate'" -->
</script>
```

## Prefix

Prefix adds path left of template name:

``` javascript
require('ng-cache?prefix=public/templates!./path/to/myPartial.html')
// => ng-include="'public/templates/myPartial.html'"
```

Prefix can mask the real directory with the explicit value
or retrieve the real directory name (use `*` or `[dir]`):

``` javascript
require('ng-cache?prefix=public/*/templates!./path/to/myPartial.html')
// => ng-include="'public/path/templates/myPartial.html'" 
```

Prefix can strip the real directory name (use `//`):

``` javascript
require('ng-cache?prefix=public/*//*/templates!./far/far/away/path/to/myPartial.html')
// => ng-include="'public/far/path/templates/myPartial.html'" 
```

Prefix can be extended through a directory tree (use `**` or `[dirs]`). See the next section.

## Root

You can specify root directory for templates separated by a colon `prefix=root:**`. 
It is enough to specify a single directory name. Prefix counts real template path from right to left and takes first (rightmost) occurance of the root directory.

```
/User/packman/Projects/packman/
  ├─ app/tmpls/field.html
  └─ components/skins/tmpls/yellow.html
```

With this directory tree you require templates from the inside of `app/tmpls` and `components/skins/tmpls`:

``` javascript
require('ng-cache?prefix=packman:**!./field.html')
// => ng-include="'app/tmpls/field.html'"

require('ng-cache?prefix=packman:**!./yellow.html')
// => ng-include="'components/skins/tmpls/yellow.html'"
```

It is also possible to combine wildcards in prefix, i.e. `prefix=packman:**/tmpls//*`.

## Name

Use `name` query parameter to strip file extension or add suffix:

``` javascript
// 
require('ng-cache?name=[name].tpl!./field.html')
// => ng-include="'field.tpl'"

require('ng-cache?name=[name]-foo.[ext]!./field.html')
// => ng-include="'field-foo.html'"
```
 
Note. File extension are defined as any char sequence after the last `.`.

## Module

By default, templates will be added to the default AngularJS 'ng' module run() method. 
Use this parameter to use a different module name:

``` javascript
require('ng-cache?module=moduleName!./path/to/myPartial.html')
```

If the module does not exist it is created.

## Webpack config

Match `.html` extension with loader:

``` javascript
module: {
    loaders: [
        {
            test: /\.html$/,
            loader: "ng-cache?prefix=[dir]/[dir]"
        }
    ]
}
```

Note that the inline require syntax is used in examples for simplicity. It's recommended to use webpack config. 
Please see this [comment](https://github.com/webpack/webpack/issues/1626#issuecomment-156758230)
and the [manual](https://webpack.github.io/docs/using-loaders.html#loaders-in-require).

## HTML minification

The [html-minifier](https://github.com/kangax/html-minifier) is used for templates minification with the default options:
```javascript
{
    removeComments: true,
    removeCommentsFromCDATA: true,
    collapseWhitespace: true,
    conservativeCollapse: true,
    preserveLineBreaks: true,
    removeEmptyAttributes: true,
    keepClosingSlash: true
}
```

You can override any of options with the negative query parameter:

```javascript
ng-cache?-conservativeCollapse&-preserveLineBreaks
```

Or you can extend defaults with `minimizeOptions`:
```javascript
var minimizeOptions = {
    conservativeCollapse: false,
    preserveLineBreaks: false
};
module.exports = {
    module: {
        loaders: [
            {test: /\.html$/, loader: 'ng-cache?minimizeOptions=' + JSON.stringify(minimizeOptions)}
        ]
    }
}
```

## URL resolve

Relative links to the local images are resolved by default (to prevent it use `-url` query param).

``` html
<!-- Source -->
<img src="../img/logo.png"></img>

<!-- becomes -->
<img src="data:image/png;base64,..."></img>
```

Use this in conjunction with [url-loader](https://github.com/webpack/url-loader). For instance:

``` javascript
require('url?name=img/[name].[ext]!ng-cache!./templates/myPartial.html')
```

Using webpack config is more convenience:

``` javascript
module: {
    loaders: [
        { test: /\.html$/, loader: "ng-cache?prefix=[dir]/[dir]" },
        { test: /\.png$/, loader: 'url?name=img/[name].[ext]&mimetype=image/png' },
        { test: /\.gif$/, loader: 'url?name=img/[name].[ext]&mimetype=image/gif' }
    ]
},
```

To switch off url resolving use `-url` query param:

``` javascript
require('ng-cache?-url!./myPartial.html')
```

# License

MIT (http://www.opensource.org/licenses/mit-license.php)
