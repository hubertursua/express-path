// express-path.js
// by Hyubs Ursua <hyubs.u@gmail.com>
// https://github.com/hyubs/express-path.git

var _       = require('lodash');
var chalk   = require('chalk');
var path    = require('path');
var sprintf = require("sprintf-js").sprintf;

var ExpressPath = function (app, options) {
    options = options || {};

    this.app             = app;
    this.middlewaresPath = options.middlewaresPath ||
                           path.join(app.get('expressRoot') ||
                           path.dirname(module.parent.filename), 'middlewares');
    this.showLogs        = options.hasOwnProperty('showLogs') ? options.showLogs : true;
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
    var params = _.clone(mapInfo.actions);

    if (mapInfo.method === 'param') {
        if (mapInfo.param !== null) {
            params.unshift(mapInfo.param);
        }
    } else {
        if (mapInfo.urlPath !== null) {
            params.unshift(mapInfo.urlPath);
        }
    }

    app[mapInfo.method].apply(app, params);

    if (this.showLogs) {
        this._log(mapInfo);
    }
};

ExpressPath.prototype._log = function (mapInfo) {

    var actionsToLog = function (actions) {
        var log = [];
        for (var i in actions) {
            var action = actions[i];
            var logAction;
            if (typeof action === 'string') {
                logAction = action;
            } else if (typeof action === 'object') {
                logAction = action.constructor.name;
            } else {
                logAction = typeof action;
            }

            log.push(logAction);
        }

        return log.join("\n          " + chalk.grey('->') + ' ');
    };

    var log = '';
    log += chalk.cyan(sprintf('%7s', '' + mapInfo.method.toUpperCase() + ''));
    log += (mapInfo.urlPath) ? ' ' + chalk.yellow(mapInfo.urlPath) : '';
    log += (mapInfo.param) ? ' ' + chalk.yellow(mapInfo.param) : '';
    log += (mapInfo.urlPath || mapInfo.param) ? "\n          " + chalk.grey('->') : '';
    log += ' ' + actionsToLog(mapInfo.actions);
    console.log(log);
};

module.exports = ExpressPath;