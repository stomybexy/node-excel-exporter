const EventEmitter = require('events');
const util = require('util');

var java = require('java');
var _ = require('underscore');
// var fs = require('fs');
var path = require('path');
var mvn = require('node-java-maven');

function NodeToJavaUtils() {
    var self = this;
    this.ready = false;
    this.java = java;
    this.cl = {
        LazyDynaMap: undefined,
        JavaMap: undefined,
        JavaDate: undefined,
        Long: undefined,
        JvaList: undefined
    }
    EventEmitter.call(this);

    this.on('ready', function () {
        self.ready = true;
    });

    this._init();
}

util.inherits(NodeToJavaUtils, EventEmitter);

NodeToJavaUtils.prototype._init = function () {
    var self = this;
    mvn({ packageJsonPath: path.join(__dirname, '..', 'package.json') }, function (err, mvnResults) {
        if (err) {
            console.error('could not resolve maven dependencies', err);

            self.emit('error', err);
            return;
        }
        mvnResults.classpath.forEach(function (c) {
            console.log('adding ' + c + ' to classpath');
            java.classpath.push(c);
        });
        self.cl.LazyDynaMap = java.import('org.apache.commons.beanutils.LazyDynaMap');
        self.cl.JavaMap = java.import('java.util.HashMap');
        self.cl.JavaDate = java.import('java.util.Date');
        self.cl.Long = java.import('java.lang.Long');
        self.cl.JvaList = java.import('java.util.ArrayList');
        self.emit('ready');
    });
}

// var files = fs.readdirSync(path.join(__dirname, '..', 'deps/jxls'));
// files.forEach(function (file) {
//     java.classpath.push(path.join(__dirname, '..', 'deps/jxls', file));
// });




NodeToJavaUtils.prototype.toJavaBean = function(obj) {
    var self = this;
    if (_.isArray(obj)) {
        return self.toJavaCollection(obj);
    };

    if (!_.isObject(obj) || _.isDate(obj)) {
        return self.cast(obj);
    }
    var objValues = new this.cl.JavaMap();
    _.each(_.keys(obj), function (k) {
        objValues.putSync(k, self.toJavaBean(obj[k]));
    });

    var dynObj = new this.cl.LazyDynaMap(objValues);
    return dynObj;
}

NodeToJavaUtils.prototype.toJavaCollection = function (col) {
    var self = this;
    var list = new this.cl.JvaList();
    _.each(col, function (obj) {
        list.addSync(self.toJavaBean(obj));
    })
    return list;
}

NodeToJavaUtils.prototype.cast =function (val) {
    var self = this;
    if (_.isDate(val)) {
        return new self.cl.JavaDate(new self.cl.Long((String(val.getTime()))));
    }
    return val;
}


module.exports = {
    create: function(){
        return new NodeToJavaUtils();
    }
};