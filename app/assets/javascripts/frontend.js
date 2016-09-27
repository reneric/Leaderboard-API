"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('frontend/api/client', ['exports', 'ember', 'frontend/api/models/response', 'frontend/api/middleware', 'frontend/api/resources/entry'], function (exports, _ember, _frontendApiModelsResponse, _frontendApiMiddleware, _frontendApiResourcesEntry) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Client = (function () {
    function Client() {
      _classCallCheck(this, Client);
    }

    _createClass(Client, [{
      key: 'request',
      value: function request(url) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var result = this._ajax(url, options);
        var _options$middleware = options.middleware;
        var middleware = _options$middleware === undefined ? [] : _options$middleware;

        middleware.forEach(function (m) {
          return result = result.then(m);
        });
        return result;
      }
    }, {
      key: 'get',
      value: function get(url) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        options = Object.assign(options, {
          type: 'GET',
          contentType: 'application/json',
          accept: 'application/json',
          authorization: 'Token notasecrettoken'
        });
        return this.request(url, options);
      }
    }, {
      key: 'post',
      value: function post(url, data) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        options = Object.assign(options, {
          type: 'POST',
          data: JSON.stringify(data),
          processData: false,
          contentType: 'application/json'
        });
        return this.request(url, options);
      }
    }, {
      key: 'put',
      value: function put(url, data) {
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        options = Object.assign(options, {
          type: 'PUT',
          data: JSON.stringify(data),
          processData: false,
          contentType: 'application/json'
        });
        return this.request(url, options);
      }
    }, {
      key: 'delete',
      value: function _delete(url) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        options = Object.assign(options, {
          type: 'DELETE'
        });
        return this.request(url, options);
      }
    }, {
      key: '_ajax',
      value: function _ajax(url) {
        var _this = this;

        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        options = Object.assign(options, {
          dataType: 'json'
        });
        return new _ember['default'].RSVP.Promise(function (resolve, reject) {
          return $.ajax(url, options).done(function (data, status, xhr) {
            return resolve(new _frontendApiModelsResponse['default'](xhr, _this, options));
          }).fail(function (xhr /*, status, error*/) {
            return reject(new _frontendApiModelsResponse['default'](xhr, _this, options));
          });
        });
      }
    }, {
      key: '_getObject',
      value: function _getObject(url) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var middleware = [];
        if (options.objectKey) {
          middleware.push((0, _frontendApiMiddleware.extractData)(options.objectKey));
        }
        if (options.deserializer) {
          middleware.push((0, _frontendApiMiddleware.deserializeObject)(options.deserializer));
        }
        options.middleware = middleware.concat(options.middleware || []);
        return this.get(url, options);
      }
    }, {
      key: '_getCollection',
      value: function _getCollection(url) {
        var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        var middleware = [];
        if (options.collectionKey) {
          middleware.push((0, _frontendApiMiddleware.extractData)(options.collectionKey));
        }
        if (options.deserializer) {
          middleware.push((0, _frontendApiMiddleware.deserializeCollection)(options.deserializer));
        }
        options.middleware = middleware.concat(options.middleware || []);
        options.data = Object.assign(options.data || {}, query);
        return this.get(url, options);
      }
    }]);

    return Client;
  })();

  [_frontendApiResourcesEntry['default']].forEach(function (mixin) {
    return Client.prototype = Object.assign(Client.prototype, mixin);
  });

  exports['default'] = Client;
});
/* global $ JSON */
define("frontend/api/middleware", ["exports"], function (exports) {
  exports.deserializeObject = deserializeObject;
  exports.deserializeCollection = deserializeCollection;
  exports.extractData = extractData;

  function deserializeObject(deserializer) {
    return function (response) {
      response.data = deserializer(response.data);
      return response;
    };
  }

  function deserializeCollection(deserializer) {
    return function (response) {
      if (response.data === null || response.data.length === null) {
        throw new Error("deserializeCollection expects an array, received '" + response.data + "'");
      }
      response.data = response.data.map(deserializer);
      return response;
    };
  }

  function extractData(key) {
    return function (response) {
      var extractedData = response.data[key];
      if (extractedData === null) {
        throw new Error("extractData could not find data at '" + key + "' on '" + response.data + "'");
      }
      response.data = extractedData;
      return response;
    };
  }
});
define('frontend/api/models/response', ['exports'], function (exports) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /* global parseLinks */

  var Response = (function () {
    function Response(xhr, client, requestOptions) {
      _classCallCheck(this, Response);

      this._xhr = xhr;
      this._client = client;
      this._requestOptions = requestOptions;
      this.status = this._xhr.status;
      this.data = this._xhr.responseJSON;
      this.totalCount = this._parseTotalCount();
    }

    _createClass(Response, [{
      key: 'getHeader',
      value: function getHeader(key) {
        return this._xhr.getResponseHeader(key);
      }
    }, {
      key: '_parseTotalCount',
      value: function _parseTotalCount() {
        var totalCount = undefined;
        totalCount = this.getHeader('x-total-count');
        if (totalCount) {
          return parseInt(totalCount);
        } else {
          return null;
        }
      }
    }]);

    return Response;
  })();

  exports['default'] = Response;
});
define('frontend/api/resources/entry', ['exports'], function (exports) {
  exports['default'] = {
    getEntries: function getEntries(query, options) {
      if (query === null) {
        query = {};
      }
      if (options === null) {
        options = {};
      }
      options = Object.assign(options, {
        collectionKey: 'entries'
      });
      return this._getCollection('/entries/', query, options);
    }
  };
});
define('frontend/app', ['exports', 'ember', 'frontend/resolver', 'ember-load-initializers', 'frontend/config/environment'], function (exports, _ember, _frontendResolver, _emberLoadInitializers, _frontendConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _frontendConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _frontendConfigEnvironment['default'].podModulePrefix,
    Resolver: _frontendResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _frontendConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('frontend/components/app-version', ['exports', 'ember-cli-app-version/components/app-version', 'frontend/config/environment'], function (exports, _emberCliAppVersionComponentsAppVersion, _frontendConfigEnvironment) {

  var name = _frontendConfigEnvironment['default'].APP.name;
  var version = _frontendConfigEnvironment['default'].APP.version;

  exports['default'] = _emberCliAppVersionComponentsAppVersion['default'].extend({
    version: version,
    name: name
  });
});
define('frontend/controllers/home', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller.extend({
    entries: _ember['default'].computed.alias('model')
  });
});
define('frontend/helpers/place', ['exports', 'ember'], function (exports, _ember) {
  var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

  exports['default'] = _ember['default'].Helper.helper(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1);

    var value = _ref2[0];
    return value + 1;
  });
});
define('frontend/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('frontend/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define('frontend/initializers/api', ['exports', 'frontend/api/client'], function (exports, _frontendApiClient) {
  exports['default'] = {
    name: 'api',
    initialize: function initialize(application) {
      application.register('api:main', new _frontendApiClient['default'](), { instantiate: false, singleton: true });
      application.inject('controller', 'api', 'api:main');
      application.inject('route', 'api', 'api:main');
      application.inject('repository', 'api', 'api:main');
    }
  };
});
define('frontend/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'frontend/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _frontendConfigEnvironment) {
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(_frontendConfigEnvironment['default'].APP.name, _frontendConfigEnvironment['default'].APP.version)
  };
});
define('frontend/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('frontend/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('frontend/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.ArrayController.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('frontend/initializers/export-application-global', ['exports', 'ember', 'frontend/config/environment'], function (exports, _ember, _frontendConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_frontendConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var value = _frontendConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_frontendConfigEnvironment['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('frontend/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define('frontend/initializers/repository', ['exports', 'frontend/repository/index'], function (exports, _frontendRepositoryIndex) {
  exports['default'] = {
    name: 'repository',
    initialize: function initialize(application) {
      application.register('repository:main', _frontendRepositoryIndex['default'], { singleton: true });
      application.inject('controller', 'repo', 'repository:main');
      application.inject('route', 'repo', 'repository:main');
      application.inject('component', 'repo', 'repository:main');
    }
  };
});
define('frontend/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: _ember['default'].K
  };
});
define('frontend/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: _ember['default'].K
  };
});
define("frontend/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('frontend/repository/index', ['exports', 'ember', 'frontend/repository/resources/entry'], function (exports, _ember, _frontendRepositoryResourcesEntry) {
  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  exports['default'] = _ember['default'].Object.extend(_frontendRepositoryResourcesEntry['default'], {
    get: function get(uri) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      if (options.objectClass) {
        options.deserializer = this._createDeserializer(options.objectClass);
      }
      return this.api.get(uri, options).then(this._getDataFromResponse);
    },

    update: function update(obj, data) {
      var uri = this._getUri(obj);
      if (uri == null) {
        throw new Error('Repository cannot update an object without a uri: \'' + obj + '\'');
      }
      return this.api.put(uri, data);
    },

    'delete': function _delete(obj) {
      var uri = this._getUri(obj);
      if (uri == null) {
        throw new Error('Repository cannot delete an object without a uri: \'' + obj + '\'');
      }
      return this.api['delete'](uri);
    },

    _get: function _get(route) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var _extractOptions2 = this._extractOptions(args);

      var argsWithoutOptions = _extractOptions2.args;
      var options = _extractOptions2.options;

      if (options.objectClass) {
        options.deserializer = this._createDeserializer(options.objectClass);
      }
      return route.call.apply(route, [this.api].concat(_toConsumableArray(argsWithoutOptions), [options])).then(this._getDataFromResponse);
    },

    // Get the full response in order to get the response headers. i.e. x-total-count for pagination
    _getFullResponse: function _getFullResponse(route) {
      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      var _extractOptions3 = this._extractOptions(args);

      var argsWithoutOptions = _extractOptions3.args;
      var options = _extractOptions3.options;

      if (options.objectClass) {
        options.deserializer = this._createDeserializer(options.objectClass);
      }
      return route.call.apply(route, [this.api].concat(_toConsumableArray(argsWithoutOptions), [options]));
    },

    _getFirst: function _getFirst(route) {
      for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        args[_key3 - 1] = arguments[_key3];
      }

      return this._get.apply(this, [route].concat(args)).then(this._getFirstFromResponse);
    },

    _createDeserializer: function _createDeserializer(objectClass) {
      return function (data) {
        return objectClass.deserialize(data);
      };
    },

    _getDataFromResponse: function _getDataFromResponse(response) {
      return response.data;
    },

    _getFirstFromResponse: function _getFirstFromResponse(collection) {
      var length = 0;
      if (collection != null) {
        length = collection.length;
      }
      if (length !== 1) {
        throw new Error('Collection was expected to contain 1 result, but had ' + length + '.');
      }
      return collection[0];
    },

    _setUriFromResponse: function _setUriFromResponse(obj) {
      var idMatcher = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      return function (response) {
        var uri = response.getHeader('location');
        _ember['default'].set(obj, 'uri', uri);
        if (uri && idMatcher) {
          var match = uri.match(idMatcher);
          if (match) {
            _ember['default'].set(obj, 'id', match[1]);
          }
        }
        return response;
      };
    },

    _expandCollection: function _expandCollection(getter) {
      var _this = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return function (response) {
        var collection = options.fullResponse ? response.data : response;
        return _ember['default'].RSVP.all(collection.map(function (item) {
          return getter.call(_this, item);
        })).then(function (expandedCollection) {
          if (options.fullResponse) {
            response.data = expandedCollection;
            return response;
          }
          return expandedCollection;
        });
      };
    },

    _extractOptions: function _extractOptions() {
      var args = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      var options = {};
      if (args.length > 0) {
        options = args[args.length - 1];
        args = args.slice(0, args.length - 1);
      }
      return { args: args, options: options };
    },

    _getUri: function _getUri(object) {
      return get(object, 'uri');
    }
  });
});
define('frontend/repository/resources/entry', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Mixin.create({
    getEntries: function getEntries() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return this._get(this.api.getEntries, query, {});
    }
  });
});
define('frontend/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('frontend/router', ['exports', 'ember', 'frontend/config/environment'], function (exports, _ember, _frontendConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _frontendConfigEnvironment['default'].locationType,
    rootURL: _frontendConfigEnvironment['default'].rootURL
  });

  Router.map(function () {
    this.route('home', { path: '/' });
  });

  exports['default'] = Router;
});
define('frontend/routes/home', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({

    model: function model() {
      return this.repo.getEntries();
    }
  });
});
define('frontend/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define("frontend/templates/application", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 2,
            "column": 10
          }
        },
        "moduleName": "frontend/templates/application.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("link");
        dom.setAttribute(el1, "rel", "stylesheet");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element0 = dom.childAt(fragment, [0]);
        var morphs = new Array(2);
        morphs[0] = dom.createAttrMorph(element0, 'href');
        morphs[1] = dom.createMorphAt(fragment, 2, 2, contextualElement);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [["attribute", "href", ["concat", [["get", "rootURL", ["loc", [null, [1, 31], [1, 38]]], 0, 0, 0, 0], "assets/frontend.css"], 0, 0, 0, 0, 0], 0, 0, 0, 0], ["content", "outlet", ["loc", [null, [2, 0], [2, 10]]], 0, 0, 0, 0]],
      locals: [],
      templates: []
    };
  })());
});
define("frontend/templates/home", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    var child0 = (function () {
      return {
        meta: {
          "revision": "Ember@2.8.1",
          "loc": {
            "source": null,
            "start": {
              "line": 24,
              "column": 8
            },
            "end": {
              "line": 30,
              "column": 8
            }
          },
          "moduleName": "frontend/templates/home.hbs"
        },
        isEmpty: false,
        arity: 2,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("          ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createElement("span");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createElement("span");
          var el4 = dom.createComment("");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n          ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createMorphAt(dom.childAt(element0, [1]), 0, 0);
          morphs[1] = dom.createMorphAt(dom.childAt(element0, [3, 0]), 0, 0);
          morphs[2] = dom.createMorphAt(dom.childAt(element0, [5, 0]), 0, 0);
          return morphs;
        },
        statements: [["inline", "place", [["get", "index", ["loc", [null, [26, 24], [26, 29]]], 0, 0, 0, 0]], [], ["loc", [null, [26, 16], [26, 31]]], 0, 0], ["content", "entry.score", ["loc", [null, [27, 22], [27, 37]]], 0, 0, 0, 0], ["content", "entry.name", ["loc", [null, [28, 22], [28, 36]]], 0, 0, 0, 0]],
        locals: ["entry", "index"],
        templates: []
      };
    })();
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 35,
            "column": 6
          }
        },
        "moduleName": "frontend/templates/home.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("header");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h1");
        var el4 = dom.createTextNode("Global goals for a ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("br");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("brightfuture");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("h3");
        dom.setAttribute(el3, "class", "header-logo");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("a");
        dom.setAttribute(el4, "href", "");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "id", "site-content");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "container");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "wrap");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("h3");
        dom.setAttribute(el4, "class", "colored-logo");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("a");
        dom.setAttribute(el5, "href", "");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("table");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("thead");
        var el6 = dom.createTextNode("\n          ");
        dom.appendChild(el5, el6);
        var el6 = dom.createElement("tr");
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("th");
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("th");
        var el8 = dom.createTextNode("Time");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n            ");
        dom.appendChild(el6, el7);
        var el7 = dom.createElement("th");
        var el8 = dom.createTextNode("Name");
        dom.appendChild(el7, el8);
        dom.appendChild(el6, el7);
        var el7 = dom.createTextNode("\n          ");
        dom.appendChild(el6, el7);
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("\n        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("tbody");
        var el6 = dom.createTextNode("\n");
        dom.appendChild(el5, el6);
        var el6 = dom.createComment("");
        dom.appendChild(el5, el6);
        var el6 = dom.createTextNode("        ");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(dom.childAt(fragment, [2, 1, 1, 3, 3]), 1, 1);
        return morphs;
      },
      statements: [["block", "each", [["get", "entries", ["loc", [null, [24, 16], [24, 23]]], 0, 0, 0, 0]], [], 0, null, ["loc", [null, [24, 8], [30, 17]]]]],
      locals: [],
      templates: [child0]
    };
  })());
});
define("frontend/templates/loading", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template((function () {
    return {
      meta: {
        "revision": "Ember@2.8.1",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 10,
            "column": 0
          }
        },
        "moduleName": "frontend/templates/loading.hbs"
      },
      isEmpty: false,
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1, "class", "row");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2, "class", "column-3");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3, "class", "box");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("p");
        dom.setAttribute(el4, "class", "text-center");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("i");
        dom.setAttribute(el5, "class", "icon-spinner spin");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode(" Loading…\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes() {
        return [];
      },
      statements: [],
      locals: [],
      templates: []
    };
  })());
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('frontend/config/environment', ['ember'], function(Ember) {
  var exports = {'default': {"modulePrefix":"frontend","environment":"development","baseURL":"/","locationType":"auto","EmberENV":{"FEATURES":{}},"APP":{"rootElement":"#ember","name":"frontend","version":"0.0.0+"},"exportApplicationGlobal":true}};Object.defineProperty(exports, '__esModule', {value: true});return exports;
});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("frontend/app")["default"].create({"rootElement":"#ember","name":"frontend","version":"0.0.0+"});
}

/* jshint ignore:end */
//# sourceMappingURL=frontend.map