# React global configuration

[![Build Status](https://travis-ci.org/morenofa/react-global-configuration.svg?branch=master)](https://travis-ci.org/morenofa/react-global-configuration) [![codecov](https://img.shields.io/codecov/c/github/morenofa/react-global-configuration/master.svg)](https://codecov.io/gh/morenofa/react-global-configuration) [![Known Vulnerabilities](https://snyk.io/test/github/morenofa/react-global-configuration/badge.svg?targetFile=package.json)](https://snyk.io/test/github/morenofa/react-global-configuration?targetFile=package.json) [![npm version](https://badge.fury.io/js/react-global-configuration.svg)](https://badge.fury.io/js/react-global-configuration) [![License](https://img.shields.io/npm/l/react-global-configuration.svg)](https://www.npmjs.com/package/react-global-configuration)

## Purpose

Provide what is essentially an explicitly set of frozen global variables which can then be required by any module that needs them.

This can be preferable to having to pass any configuration all the way through your node application, or put your configuration inside state of component. This method is  usually better than setting global variables.


## Installation

```bash
$ npm install react-global-configuration
```

## API

__set( configuration, [options] )__

````js
import config from 'react-global-configuration';

config.set({ qux: 'corge', garply: 'fred' }, { freeze: false, environment: 'test' });
config.set({ qux: 'grault' }, { freeze: false, environment: 'production' });
config.set({ 
    foo: 'bar',
    bar: {
        baz: 'qux'
    },
    baz: ['qux'],
    qux: 'quux',
    garply: 'waldo'
});
````

Sets a configuration.
- __configuration__ - whatever you want to be made available when subsequently importing / requiring get function `react-global-configuration`.
- __options__ - object optionally containing the following:
    - __options.freeze__ _default: true_ - used to prevent the [freezing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) of the configuration object.
    - __options.assign__ _default: false_ - causes the passed configuration object to have its properties [assigned](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) to the existing configuration, rather than replacing it.
    - __options.environment__ _default: 'global'_ - used to define the environment for the passed configuration.


__setEnvironment( environment )__

````js
import config from 'react-global-configuration';

config.setEnvironment('production');
````

Defines the current environment in order to obtain the appropriate configurations.
- __environment__ - key to define the current environment of the application. This setting is used after in `get()` function to obtain the appropriate setting.

__get( [key], [default] )__

````js
import config from 'react-global-configuration';

config.get('foo'); //'bar'
config.get('bar'); //{ baz: 'qux' }
config.get('bar.baz'); //'qux'
config.get('baz'); //['qux']
config.get('baz.0'); //'qux'
config.get('qux'); //'grault' -> environment value
config.get('garply'); //'waldo' -> global value
````

Obtains a specific configuration.
- __key__ - key to the setting you want to recover. If you do not put this key you recover all settings.
- __default__ - default value if not exists the setting with the specified key. If you do not put this parameter you get `null` value by default.

__serialize( [environment] )__

````js
import config from 'react-global-configuration';

config.serialize(); //"{foo:'bar',bar:{baz:'qux'},baz:['qux'],qux:'quux',garply:'waldo'}"
config.serialize('test'); //"{qux:'corge',garply:'fred'}"
config.serialize('production'); //"{qux:'grault'}"
````

Serialize configuration to a superset of JSON.
- __environment__ _default: 'global'_ - key to define the environment configuration you wants to serialize.


__reset()__

````js
import reset from 'react-global-configuration/reset';

reset();
````

This is a testing utility that removes the existing configuration from the require cache. By calling this, calling `config.set(configuration)` and then re-requiring any target file, that target file will then be returned from require with the new `configuration` applied.

## Example Usage

### Server Side

__config.js__ (global configuration file)
````js
const config = {
    foo: 'bar' 
};

export default config;
````

__server.js__ (initiation of server side process)
````js
import config from 'react-global-configuration';
import configuration from './config';
import App from './app';

config.set(configuration);

new App();
````

__render.js__ (render of server side process)
````js
import config from 'react-global-configuration';

export renderScripts = () => 
    `
        <script>
            window.__INITIAL_CONFIG__ = ${config.serialize()};
        </script>
    `;
````

### Client Side

__client.js__ (initiation of client side js, assume compiled via browserify / webpack / similar)
````js
import React from 'react';
import config from 'react-global-configuration';
import App from './app';

(function clientJS() {
    config.set(window.__INITIAL_CONFIG__);
    React.render(<App/>, document);
}());
````

### React 

__component.js__ (somewhere inside the client side app)
````js
import React from 'react';
import config from 'react-global-configuration';

class Component extends React.Component {
    render() {
        return (
            <div>{ config.get('foo') }</div>
        );
    }
};

export default Component;
````

### Testing

__gulp/test.js__
````js
import gulp from 'gulp';
import mocha from 'gulp-mocha';
import config from 'react-global-configuration';

config.set({ foo: 'baz' }, { freeze: false });

gulp.task('test', function gulpTest() {
    return (
        gulp
            .src([ 'app/**.test.*' ], { read: false })
            .pipe(mocha())
    );
});
````

__appLogic.test.js__
````js
import reset from 'react-global-configuration/reset';
import assert from 'assert';

describe('appLogic', () => {
    it('should return foo from configuration', () => {
        import config from 'react-global-configuration';
    
        const foos = [ 'alpha', 'beta', 'gamma' ];
        foos.forEach((foo) => {
            // This only works because `freeze: false` was set the first time set was called (in gulp/test.js).
            config.set({ foo: foo });
            const appLogic = require('./appLogic');
            assert(appLogic() === foo);
        });
    });

    afterEach(() => {
        reset();
    });
});
````

## Contributions

[Issues](https://github.com/morenofa/react-global-configuration/issues) and [pull requests](https://github.com/morenofa/react-global-configuration/pulls) are most welcome.

## Thanks

React global configuration was initially inspired by global-configuration. Many thanks to Josh-a-e.

## License

[MIT](https://opensource.org/licenses/MIT)