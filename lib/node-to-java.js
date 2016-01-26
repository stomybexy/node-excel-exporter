var java = require('java');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var files = fs.readdirSync(path.join(__dirname, '..', 'deps/jxls'));
files.forEach(function (file) {
    java.classpath.push(path.join(__dirname, '..', 'deps/jxls', file));
});

var LazyDynaMap = java.import('org.apache.commons.beanutils.LazyDynaMap');
var JavaMap = java.import('java.util.HashMap');
var JavaDate = java.import('java.util.Date');
var Long = java.import('java.lang.Long');
var JvaList = java.import('java.util.ArrayList');


function toJavaBean(obj) {
    if (_.isArray(obj)) {
        return toJavaCollection(obj);
    };
    
    if (!_.isObject(obj) || _.isDate(obj)) {
        return cast(obj);
    }
    var objValues = new JavaMap();
    _.each(_.keys(obj), function (k) {
        objValues.putSync(k, toJavaBean(obj[k]));
    });

    var dynObj = new LazyDynaMap(objValues);
    return dynObj;
}

function toJavaCollection(col) {
    var list = new JvaList();
    _.each(col, function (obj) {
        list.addSync(toJavaBean(obj));
    })
    return list;
}

function cast(val){
    if(_.isDate(val)){
        return new JavaDate(new Long((String(val.getTime()))));
    }
    return val;
}


module.exports = {
    toJavaBean: toJavaBean
};