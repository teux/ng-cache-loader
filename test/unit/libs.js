/**
 * Created by teux on 04.09.15.
 */
var expect = require('chai').expect;
var path = require('path');
var cwd = process.cwd();
var libPath;
var lib;

libPath = 'lib/templateId';
lib = require(path.join(cwd, libPath));

describe(libPath, function() {
    var resources = [
        '/Users/myself/Projects/packman/web_modules/angular-ui-bootstrap/template/popover/popover.html',
        '/Users/myself/Projects/packman/components/article/actions/actions.html',
        'W:\\Projects\\packman\\web_modules\\angular-ui-bootstrap\\template\\popover\\popover.html',
        'W:\\Projects\\packman\\components\\article\\actions\\actions.html',
    ];
    /**
     * Calls library.
     * @param {string} resource Absolute template path.
     * @param {string} [prefix] Prefix.
     * @return {string} Result
     */
    var run = function(resource, prefix) {
        var params = {resource: resource};

        if (prefix !== undefined) {
            params.query = '?prefix=' + prefix;
        }
        return lib.call(params);
    };

    var getFile = function(path) {
        return path.replace(/\\/g, '/').split('/').pop();
    };

    var alternation = function(res, pref) {
        var odd;
        var abs;

        pref = pref.replace(/\\/g, '/').split('/');

        if (pref[0] === '') {
            abs = true;
            pref.shift();
        }
        odd = !!~['[dir]', '[dirs]', '*', '**'].indexOf(pref[0]);

        res = res.replace(/\\/g, '/').split('/');
        res = res.slice(res.length - 5);
        pref[odd ? 0 : 1] = res[odd ? 0 : 1];
        pref[odd ? 2 : 3] = res[odd ? 2 : 3];
        if (abs) {
            pref.unshift('');
        }
        pref.push(res[4]);
        return pref.join('/');
    };

    describe('without prefix', function() {
        it('#should return file name', function() {
            resources.forEach(function(res) {
                var file = getFile(res);
                expect(run(res)).to.equal(file);
                expect(run(res), '').to.equal(file);
            });
        });
    });

    describe('explicit prefix', function() {
        it('#should be relative', function() {
            var pref = 'app/tmpl';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(pref + '/' + getFile(res));
            });
        });
        it('#should be absolute', function() {
            var pref = '/app/tmpl';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(pref + '/' + getFile(res));
            });
        });
        it('#should be absolute without unnecessary slash', function() {
            var pref = '/app/tmpl/';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(pref + getFile(res));
            });
        });
    });

    describe('explicit prefix (Win style)', function() {
        it('#should be relative', function() {
            var pref = 'app\\tmpl';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal('app/tmpl/' + getFile(res));
            });
        });
        it('#should be absolute', function() {
            var pref = '\\app\\tmpl';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal('/app/tmpl/' + getFile(res));
            });
        });
        it('#should be absolute without unnecessary slash', function() {
            var pref = '\\app\\tmpl\\';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal('/app/tmpl/' + getFile(res));
            });
        });
    });

    describe('take from path (relative prefix)', function() {
        it('#should take odd chunks', function() {
            var pref = '*/dir1/*/dir2';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
            pref = '[dir]/dir1/[dir]/dir2';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
        });
        it('#should take even chunks', function() {
            var pref = 'dir1/*/dir2/*';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
            pref = 'dir1/[dir]/dir2/[dir]';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
        });
    });

    describe('take from path (absolute prefix)', function() {
        it('#should take odd chunks', function() {
            var pref = '/*/dir1/*/dir2';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
            pref = '/[dir]/dir1/[dir]/dir2';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
        });
        it('#should take even chunks', function() {
            var pref = '/dir1/*/dir2/*';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
            pref = '/dir1/[dir]/dir2/[dir]';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
        });
    });

    describe('take from path (relative prefix Win style)', function() {
        it('#should take odd chunks', function() {
            var pref = '*\\dir1\\*\\dir2';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
            pref = '[dir]\\dir1\\[dir]\\dir2';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
        });
        it('#should take even chunks', function() {
            var pref = 'dir1\\*\\dir2\\*';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
            pref = 'dir1\\[dir]\\dir2\\[dir]';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
        });
    });

    describe('take from path (absolute prefix Win style)', function() {
        it('#should take odd chunks', function() {
            var pref = '\\*\\dir1\\*\\dir2';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
            pref = '\\[dir]\\dir1\\[dir]\\dir2';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
        });
        it('#should take even chunks', function() {
            var pref = '\\dir1\\*\\dir2\\*';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
            pref = '\\dir1\\[dir]\\dir2\\[dir]';
            resources.forEach(function(res) {
                expect(run(res, pref)).to.equal(alternation(res, pref));
            });
        });
    });

    describe('strip dir', function() {
        var res = [
            '/Users/myself/Projects/packman/web_modules/angular-ui-bootstrap/template/popover/popover.html',
            'W:\\Projects\\packman\\web_modules\\angular-ui-bootstrap\\template\\popover\\popover.html',
        ];

        it('#should strip last dir', function() {
            expect(run(res[0], '*/dir1/*//')).to.equal('web_modules/dir1/template/popover.html');
            expect(run(res[0], '/*/dir1/*//')).to.equal('/web_modules/dir1/template/popover.html');
            expect(run(res[1], '*/dir1/*//')).to.equal('web_modules/dir1/template/popover.html');
            expect(run(res[1], '/*/dir1/*//')).to.equal('/web_modules/dir1/template/popover.html');
        });
        it('#should strip first dir', function() {
            expect(run(res[0], '//dir1/*/*/')).to.equal('/dir1/template/popover/popover.html');
            expect(run(res[1], '//dir1/*/*/')).to.equal('/dir1/template/popover/popover.html');
        });
        it('#should strip middle and last dir', function() {
            expect(run(res[0], '*/dir1//*//')).to.equal('packman/dir1/template/popover.html');
            expect(run(res[0], '/*/dir1//*//')).to.equal('/packman/dir1/template/popover.html');
            expect(run(res[1], '*/dir1//*//')).to.equal('packman/dir1/template/popover.html');
            expect(run(res[1], '/*/dir1//*//')).to.equal('/packman/dir1/template/popover.html');
        });
    });

    describe('strip dir (Win style)', function() {
        var res = [
            '/Users/myself/Projects/packman/web_modules/angular-ui-bootstrap/template/popover/popover.html',
            'W:\\Projects\\packman\\web_modules\\angular-ui-bootstrap\\template\\popover\\popover.html',
        ];

        it('#should strip last dir', function() {
            expect(run(res[0], '*\\dir1\\*\\\\')).to.equal('web_modules/dir1/template/popover.html');
            expect(run(res[0], '\\*\\dir1\\*\\\\')).to.equal('/web_modules/dir1/template/popover.html');
            expect(run(res[1], '*\\dir1/*\\\\')).to.equal('web_modules/dir1/template/popover.html');
            expect(run(res[1], '\\*\\dir1\\*\\\\')).to.equal('/web_modules/dir1/template/popover.html');
        });
        it('#should strip first dir', function() {
            expect(run(res[0], '\\\\dir1\\*\\*\\')).to.equal('/dir1/template/popover/popover.html');
            expect(run(res[1], '\\\\dir1\\*\\*\\')).to.equal('/dir1/template/popover/popover.html');
        });
        it('#should strip middle and last dir', function() {
            expect(run(res[0], '*\\dir1\\\\*\\\\')).to.equal('packman/dir1/template/popover.html');
            expect(run(res[0], '\\*\\dir1\\\\*\\\\')).to.equal('/packman/dir1/template/popover.html');
            expect(run(res[1], '*\\dir1\\\\*\\\\')).to.equal('packman/dir1/template/popover.html');
            expect(run(res[1], '\\*\\dir1\\\\*\\\\')).to.equal('/packman/dir1/template/popover.html');
        });
    });

    describe('cross take from path', function() {
        var res = [
            '/Users/myself/Projects/packman/web_modules/angular-ui-bootstrap/template/popover/popover.html',
            'W:\\Projects\\packman\\web_modules\\angular-ui-bootstrap\\template\\popover\\popover.html',
        ];
        it('#should be same', function() {
            expect(run(res[0], '/**')).to.equal(res[0]);
            expect(run(res[0], '**')).to.equal(res[0].replace(/^\//, ''));
            expect(run(res[1], '**')).to.equal(res[1].replace(/\\/g, '/'));
        });
        it('#should strip first chunk', function() {
            expect(run(res[0], '//**'))
                .to.equal('/myself/Projects/packman/web_modules/angular-ui-bootstrap/template/popover/popover.html');
            expect(run(res[1], '//**'))
                .to.equal('/Projects/packman/web_modules/angular-ui-bootstrap/template/popover/popover.html');
        });
    });

    describe('relative root and full extend', function() {
        var prefs = [
            'Projects/packman:**',
            'Projects/packman/:**',
            'Projects/packman/:/**',
            'Projects/packman/:/**/',
            'Projects/packman:/**',
            'Projects/packman:/**/',
            'Projects/packman:[dirs]',
            'Projects/packman/:[dirs]',
            'Projects/packman/:/[dirs]',
            'Projects/packman/:/[dirs]/',
            'Projects/packman:/[dirs]',
            'Projects/packman:/[dirs]/',
            'Projects\\packman:**',
            'Projects\\packman\\:**',
            'Projects\\packman\\:\\**',
            'Projects\\packman\\:\\**\\',
            'Projects\\packman:\\**',
            'Projects\\packman:\\**\\',
            'Projects\\packman:[dirs]',
            'Projects\\packman\\:[dirs]',
            'Projects\\packman\\:\\[dirs]',
            'Projects\\packman\\:\\[dirs]\\',
            'Projects\\packman:\\[dirs]',
            'Projects\\packman:\\[dirs]\\',
        ];
        var sample = function(res, pref) {
            pref = pref.replace(/\\/g, '/').split(':');
            res = res.replace(/\\/g, '/').split(pref.shift()).pop();

            var path = pref[0][0] === '/' ?
                res.replace(/^\/?/, '/') :
                res.replace(/^\//, '');
            return path;
        };

        it('#should extend', function() {
            prefs.forEach(function(pref) {
                resources.forEach(function(res) {
                    expect(run(res, pref)).to.equal(sample(res, pref));
                });
            });
        });
    });

    describe('absolute root and full extend', function() {
        var sample = function(res, pref) {
            var root;
            var path;

            root = pref.replace(/\\/g, '/').split(':');
            pref = root.pop();
            root = root.join(':');
            res = res.replace(/\\/g, '/').split(root).pop();
            path = pref[0][0] === '/' ?
                res.replace(/^\/?/, '/') :
                res.replace(/^\//, '');
            return path;
        };

        it('#should extend', function() {
            var resources = [
                '/Users/myself/Projects/packman/web_modules/angular-ui-bootstrap/template/popover/popover.html',
                '/Users/myself/Projects/packman/components/article/actions/actions.html',
            ];
            [
                '/Users/myself/Projects/packman:**',
                '/Users/myself/Projects/packman/:**',
                '/Users/myself/Projects/packman/:/**',
                '/Users/myself/Projects/packman/:/**/',
                '/Users/myself/Projects/packman:/**',
                '/Users/myself/Projects/packman:/**/',
                '/Users/myself/Projects/packman:[dirs]',
                '/Users/myself/Projects/packman/:[dirs]',
                '/Users/myself/Projects/packman/:/[dirs]',
                '/Users/myself/Projects/packman/:/[dirs]/',
                '/Users/myself/Projects/packman:/[dirs]',
                '/Users/myself/Projects/packman:/[dirs]/',
            ].forEach(function(pref) {
                resources.forEach(function(res) {
                    expect(run(res, pref)).to.equal(sample(res, pref));
                });
            });
        });

        it('#should extend (Win style)', function() {
            resources = [
                'W:\\Projects\\packman\\web_modules\\angular-ui-bootstrap\\template\\popover\\popover.html',
                'W:\\Projects\\packman\\components\\article\\actions\\actions.html',
            ];
            [
                'W:\\Projects\\packman:**',
                'W:\\Projects\\packman\\:**',
                'W:\\Projects\\packman\\:\\**',
                'W:\\Projects\\packman\\:\\**\\',
                'W:\\Projects\\packman:\\**',
                'W:\\Projects\\packman:\\**\\',
                'W:\\Projects\\packman:[dirs]',
                'W:\\Projects\\packman\\:[dirs]',
                'W:\\Projects\\packman\\:\\[dirs]',
                'W:\\Projects\\packman\\:\\[dirs]\\',
                'W:\\Projects\\packman:\\[dirs]',
                'W:\\Projects\\packman:\\[dirs]\\',
            ].forEach(function(pref) {
                resources.forEach(function(res) {
                    expect(run(res, pref)).to.equal(sample(res, pref));
                });
            });
        });
    });

    describe('file name pattern', function() {
        var params = {
            resource: 'template/popover/popover.html',
        };

        it('#should strip extension', function() {
            params.query = '?name=[name]';
            expect(lib.call(params)).to.equal('popover');
            params.query += '&prefix=*/*';
            expect(lib.call(params)).to.equal('template/popover/popover');
        });

        it('#should replace extension', function() {
            params.query = '?name=[name].tpl';
            expect(lib.call(params)).to.equal('popover.tpl');
            params.query += '&prefix=*/*';
            expect(lib.call(params)).to.equal('template/popover/popover.tpl');
        });

        it('#should swap name and extension', function() {
            params.query = '?name=[ext].[name]';
            expect(lib.call(params)).to.equal('html.popover');
            params.query += '&prefix=*/*';
            expect(lib.call(params)).to.equal('template/popover/html.popover');
        });

        it('#should swap name and extension', function() {
            params.query = '?name=[ext].[name]';
            expect(lib.call(params)).to.equal('html.popover');
            params.query += '&prefix=*/*';
            expect(lib.call(params)).to.equal('template/popover/html.popover');
        });

        it('#should append suffix', function() {
            params.query = '?name=[name]-foo.[ext]';
            expect(lib.call(params)).to.equal('popover-foo.html');
        });

        it('#should replace name with literal', function() {
            params.query = '?name=foo';
            expect(lib.call(params)).to.equal('foo');
        });

        it('#should ignore invalid name pattern', function() {
            params.query = '?name=[name].[ext].[ext]';
            expect(lib.call(params)).to.equal('popover.html');
            params.query += '&prefix=*/*';
            expect(lib.call(params)).to.equal(params.resource);
        });
    });

    describe('various casese', function() {
        var resources = [
            '/Users/myself/Projects/packman/web_modules/angular-ui-bootstrap/template/popover/popover.html',
            'W:\\Projects\\packman\\web_modules\\angular-ui-bootstrap\\template\\popover\\popover.html',
        ];
        it('#should extend, replace, strip and take', function() {
            resources.forEach(function(res) {
                expect(run(res, 'packman:**/dir1//*')).to.equal('web_modules/dir1/popover/popover.html');
                expect(run(res, 'packman:*/dir1/**')).to.equal('web_modules/dir1/template/popover/popover.html');
                expect(run(res, 'packman:*//**')).to.equal('web_modules/template/popover/popover.html');
                expect(run(res, 'packman:/**/dir1//')).to.equal('/web_modules/angular-ui-bootstrap/dir1/popover.html');
            });
        });
        it('#should convert second `**` to `*`', function() {
            resources.forEach(function(res) {
                expect(run(res, 'packman:**/dir1//**')).to.equal('web_modules/dir1/popover/popover.html');
                expect(run(res, 'packman:/**/dir1/**'))
                    .to.equal('/web_modules/angular-ui-bootstrap/dir1/popover/popover.html');
            });
        });
    });
});
