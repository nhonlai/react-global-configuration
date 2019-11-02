/* eslint-env mocha */
import chai from 'chai';
import path from 'path';
import { argv } from 'yargs';

chai.should();

Object.defineProperty(global, "should", {
    value: chai.Should(),
    enumerable: true,
    configurable: true,
    writable: true
});

const expect = chai.expect;
const pathToReactGlobalConfiguration = argv.lib ? '../lib' : '../build';
const pathToReactGlobalConfigurationReset = path.join(pathToReactGlobalConfiguration, 'reset');

const reset = require(pathToReactGlobalConfigurationReset).default;

describe('react-global-configuration', () => {
    it('should not throw an error when set is called called prior', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            foo: {
                bar: 'baz'
            }
        };
        config.set(configuration);

        config.get().should.deep.equal(configuration);
    });
    it('should throw an error if called more than once', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        config.set({ foo: 'bar' });

        expect(() => {
            config.set({ foo: 'baz' });
        }).to.throw(Error);
    });
    it('should throw an error if called more than once, even if subsequent calls have freeze set to false', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        config.set({ foo: 'bar' });

        expect(() => {
            config.set({ foo: 'baz' }, { freeze: false });
        }).to.throw(Error);
    });
    it('shouldn\'t throw an error if called more than once when the initial call had freeze set to false', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = { baz: 'qux' };
        config.set({ foo: 'bar' }, { freeze: false });
        config.set(configuration);

        config.get().should.deep.equal(configuration);
    });
    it('should throw an error if unrecognised options are passed', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        expect(() => {
            config.set({ foo: 'bar' }, { freeeze: false });
        }).to.throw(Error);
    });
    it('should throw an error if options are passed with unexpected types', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        expect(() => {
            config.set({ foo: 'bar' }, { assign: 'true' });
        }).to.throw(Error);
    });
    it('should extend the configuration, rather than replacing them if assign is set to true', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        config.set({ foo: 'bar' }, { freeze: false });
        config.set({ baz: 'qux' }, { assign: true });
        config.get().should.deep.equal({ foo: 'bar', baz: 'qux' });
        config.set({ foo: { bar: 'baz' } }, { assign: true });
        config.get().should.deep.equal({ foo: { bar: 'baz' }, baz: 'qux' });
    });
    it('should return the string values', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = { foo: 'bar' };
        config.set(configuration);

        const key = 'foo';

        config.get(key).should.equal(configuration[key]);
    });
    it('should return the integer values', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            num: -1,
            num_0: 0,
            num_1: 1,
            num_2: 2
        };
        config.set(configuration);

        config.get('num').should.equal(-1);
        config.get('num_0').should.equal(0);
        config.get('num_1').should.equal(1);
        config.get('num_2').should.equal(2);
    });
    it('should return the boolean values', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            foo: false,
            bar: true
        };
        config.set(configuration);

        config.get('foo').should.equal(false);
        config.get('bar').should.equal(true);
    });
    it('should return null values', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            foo: null
        };
        config.set(configuration);

        const key = 'foo';

        should.equal(config.get(key), null);
    });
    it('should return object', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const nestedConfiguration = {
            bar: 'baz'
        };
        const configuration = {
            foo: nestedConfiguration
        };
        config.set(configuration);

        config.get('foo').should.deep.equal(nestedConfiguration);
    });
    it('should return nested object value', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            foo: {
                bar: 'baz'
            }
        };
        config.set(configuration);

        const key = 'foo.bar';
        const keyParts = key.split('.');

        config.get(key).should.equal(configuration[keyParts[0]][keyParts[1]]);
    });
    it('should return array', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            foo: ['bar', 'baz']
        };
        config.set(configuration);

        const key = 'foo';

        config.get(key).should.equal(configuration[key]);
    });
    it('should return array value', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            foo: ['bar', 'baz']
        };
        config.set(configuration);

        const key = 'foo.0';
        const keyParts = key.split('.');

        config.get(key).should.equal(configuration[keyParts[0]][keyParts[1]]);
    });
    it('should return fallback value if config don\'t exist', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            foo: 'bar'
        };
        config.set(configuration);

        should.equal(config.get('bar'), null);
        should.equal(config.get('foo.baz'), null);
        should.equal(config.get('bar.baz'), null);
        config.get('bar', '').should.equal('');
        config.get('bar', true).should.equal(true);
        config.get('bar', false).should.equal(false);
        config.get('bar', -1).should.equal(-1);
        config.get('bar', 0).should.equal(0);
        config.get('bar', 1).should.equal(1);
        should.equal(config.get('bar', null), null);
    });
    it('should return serializes config', () => {
        const config = require(pathToReactGlobalConfiguration).default;

        const configuration = {
            foo: 'bar',
            bar: {
                baz: 'qux'
            }
        };
        config.set(configuration);

        config.serialize().should.equal('{"foo":"bar","bar":{"baz":"qux"}}');
    });
    afterEach(() => {
        reset();
    });
});
