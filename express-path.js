// express-path.js
// by Hyubs Ursua <hyubs.u@gmail.com>
// https://github.com/hyubs/express-path.git

var _    = require('lodash');
var path = require('path');

var ExpressPath = function (app, options) {
    options = options || {};

    this.app             = app;
    this.middlewaresPath = options.middlewaresPath ||
                           path.join(app.get('expressRoot') ||
                           path.dirname(module.parent.filename), 'middlewares');
};

ExpressPath.prototype.map = function (routes) {
    this.routes = _.cloneDeep(routes);

    for (var i in routes) {
        var route   = routes[i];
        var mapInfo = this._parseMap(route);
        this._mapToExpress(this.app, mapInfo);
    }
};

ExpressPath.prototype._parseMap = function (route) {
    var method  = route.shift();
    var urlPath = null;
    var actions = null;
    var param   = null;

    if (method === 'use') {
        if (route.length === 2) {
            urlPath = route.shift();
        }

        actions = route;
    } else if (method === 'param') {
        if (route.length === 2) {
            param = route.shift();
        }

        actions = route;
    } else {
        if (route.length > 1) {
            urlPath = route.shift();
        }

        actions = route;
    }

    for (var i in actions) {
        var action = actions[i];

        if (typeof action === 'string') {
            var ctrlFuncArr = action.split('#');
            var ctrlPath = path.join(this.middlewaresPath, ctrlFuncArr.shift());
            var ctrlFunc = require(ctrlPath);

            if (ctrlFuncArr.length === 1) {
                ctrlFunc = ctrlFunc[ctrlFuncArr[0]];
            }

            actions[i] = ctrlFunc;
        }
    }

    return {
        method  : method,
        urlPath : urlPath,
        param   : param,
        actions : actions,
    };
};

ExpressPath.prototype._mapToExpress = function (app, mapInfo) {
    var params;

    if (mapInfo.method === 'param') {
        params = mapInfo.actions;

        if (mapInfo.param !== null) {
            params.unshift(mapInfo.param);
        }

        app.param.apply(undefined, params);
    } else {
        params = mapInfo.actions;

        if (mapInfo.urlPath !== null) {
            params.unshift(mapInfo.urlPath);
        }

        app[mapInfo.method].apply(app, params);
    }
};

module.exports = ExpressPath;