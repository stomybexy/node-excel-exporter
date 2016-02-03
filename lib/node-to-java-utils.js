const EventEmitter = require('events').EventEmitter;
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
        self.cl.Double = java.import('java.lang.Double');
        self.cl.JavaList = java.import('java.util.ArrayList');
        self.cl.JavaSqlConn = java.import('java.sql.Connection');
        self.cl.JavaSqlDriverMgr = java.import('java.sql.DriverManager');
        self.cl.JavaSqlRs = java.import('java.sql.ResultSet');
        self.cl.JavaSqlException = java.import('java.sql.SQLException');
        self.cl.JavaSqlStmt = java.import('java.sql.Statement');
        self.cl.RowSetDynaClass = java.import('org.apache.commons.beanutils.RowSetDynaClass');
        self.cl.JavaClass = java.import('java.lang.Class');

        self.emit('ready');


    });
}

// var files = fs.readdirSync(path.join(__dirname, '..', 'deps/jxls'));
// files.forEach(function (file) {
//     java.classpath.push(path.join(__dirname, '..', 'deps/jxls', file));
// });




NodeToJavaUtils.prototype.toJavaBean = function (obj) {
    var self = this;
    if (_.isArray(obj)) {
        return self.toJavaCollection(obj);
    };

    if (!_.isObject(obj) || _.isDate(obj)) {
        return self.cast(obj);
    }

    var objValues = new self.cl.JavaMap();
    _.each(_.keys(obj), function (k) {
        objValues.putSync(k, self.toJavaBean(obj[k]));
    });

    var dynObj = new self.cl.LazyDynaMap(objValues);
    return dynObj;
}

NodeToJavaUtils.prototype.toJavaCollection = function (col) {
    var self = this;
    var list = new this.cl.JavaList();
    _.each(col, function (obj) {
        list.addSync(self.toJavaBean(obj));
    })
    return list;
}

// NodeToJavaUtils.prototype.toJavaResultSet = function (config) {
//     var self = this;
//     try {
//         // var S = java.import(config.driverClass);
//         // java.callStaticMethodSync('java.lang.Class', 'forName', config.driverClass);
//         // self.cl.JavaSqlDriverMgr.registerDriverSync(new S());
//         // console.log('JDBC Driver registered');
        
//         // self.cl.JavaClass.forNameSync(config.driverClass);

//         var conn = self.cl.JavaSqlDriverMgr.getConnectionSync(config.dbUrl, config.dbUser, config.dbPwd);
        
//         console.log(conn);
//         console.log('Creating statement ...');

//         var stmt = conn.createStatementSync();
        
//         console.log(stmt);

//         var rs = stmt.executeQuerySync(config.sql);
//         rs.nextSync();
//         console.log(rs.getStringSync('pre_ben'))
//         var rsdc = new self.cl.RowSetDynaClass(rs, false);
        
//         rs.closeSync();
//         stmt.closeSync();
//         conn.closeSync();
        
//         var res = rsdc.getRowsSync();
//         console.log(res[0]);
//         return res ;

//     } catch (ex) {
//         console.log(ex);
//         throw new Error('Error getting resultset' + ex);

//     }

// }

NodeToJavaUtils.prototype.cast = function (val) {
    var self = this;

    if (_.isDate(val)) {
        return new self.cl.JavaDate(new self.cl.Long((String(val.getTime()))));
    }
    // Convert to the best Number type.
    if (isInt(val)) {
        return new self.cl.Long(String(Number(val)));
    }
    if (isFloat(val)) {
        return new self.cl.Double(String(Number(val)));
    }

    return val;
}
function isInt(n) {
    return Number(n) == n && n % 1 === 0;
}

function isFloat(n) {
    return n == Number(n) && n % 1 !== 0;
}


module.exports = {
    create: function () {
        return new NodeToJavaUtils();
    }
};