'use strict';

define("frontend/tests/api/client.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/api/middleware.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/api/models/response.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/api/resources/entry.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/app.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/controllers/home.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/helpers/destroy-app.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define('frontend/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = destroyApp;

  function destroyApp(application) {
    _ember['default'].run(application, 'destroy');
  }
});
define("frontend/tests/helpers/module-for-acceptance.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define('frontend/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'frontend/tests/helpers/start-app', 'frontend/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _frontendTestsHelpersStartApp, _frontendTestsHelpersDestroyApp) {
  var Promise = _ember['default'].RSVP.Promise;

  exports['default'] = function (name) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _frontendTestsHelpersStartApp['default'])();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },

      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _frontendTestsHelpersDestroyApp['default'])(_this.application);
        });
      }
    });
  };
});
define("frontend/tests/helpers/place.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/helpers/resolver.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define('frontend/tests/helpers/resolver', ['exports', 'frontend/resolver', 'frontend/config/environment'], function (exports, _frontendResolver, _frontendConfigEnvironment) {

  var resolver = _frontendResolver['default'].create();

  resolver.namespace = {
    modulePrefix: _frontendConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _frontendConfigEnvironment['default'].podModulePrefix
  };

  exports['default'] = resolver;
});
define("frontend/tests/helpers/start-app.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define('frontend/tests/helpers/start-app', ['exports', 'ember', 'frontend/app', 'frontend/config/environment'], function (exports, _ember, _frontendApp, _frontendConfigEnvironment) {
  exports['default'] = startApp;

  function startApp(attrs) {
    var application = undefined;

    var attributes = _ember['default'].merge({}, _frontendConfigEnvironment['default'].APP);
    attributes = _ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    _ember['default'].run(function () {
      application = _frontendApp['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
});
define("frontend/tests/initializers/api.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/initializers/repository.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/repository/index.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/repository/resources/entry.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/resolver.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/router.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/routes/home.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define("frontend/tests/test-helper.eslint-test", ["exports"], function (exports) {
  "use strict";
});
define('frontend/tests/test-helper', ['exports', 'frontend/tests/helpers/resolver', 'ember-qunit'], function (exports, _frontendTestsHelpersResolver, _emberQunit) {

  (0, _emberQunit.setResolver)(_frontendTestsHelpersResolver['default']);
});
/* jshint ignore:start */

require('frontend/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;

/* jshint ignore:end */
//# sourceMappingURL=tests.map