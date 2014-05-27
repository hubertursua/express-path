var map = [
    ['use',   'ctrl'],
    ['use',   'ctrl#fun'],
    ['use',   function (req, res, next) {}],
    ['use',   '/path/here', 'ctrl'],
    ['use',   '/path/here', 'ctrl#fun'],
    ['use',   '/path/here', function (req, res, next) {}],

    ['param', 'ctrl'],
    ['param', 'ctrl#fun'],
    ['param', /[a-zA-Z0-9]/],
    ['param', function (req, res, next) {}],
    ['param', 'name', 'ctrl'],
    ['param', 'name', 'ctrl#fun'],
    ['param', 'name', function (req, res, next) {}],

    ['all',   '/path/here', 'ctrl'],
    ['all',   '/path/here', 'ctrl#fun'],
    ['all',   '/path/here', function (req, res, next) {}]
];

module.exports = map;