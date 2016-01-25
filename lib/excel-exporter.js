

const EventEmitter = require('events');
const util = require('util');

var path = require('path');
var java = require("java");
var mvn = require('node-java-maven');
java.classpath.push(path.join(__dirname, '..', 'deps/excel-reporter.jar'));
var _ = require('underscore');


function ExcelExporter() {
    var self = this;
    this.ready = false;
    EventEmitter.call(this);

    this.on('ready', function () {
        self.ready = true;
    });

    this._init();
}
util.inherits(ExcelExporter, EventEmitter);

ExcelExporter.prototype._init = function () {
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
        self.emit('ready');
    });
}

ExcelExporter.prototype.export = function (requests, tpl, tplOut, callback) {
    var self = this;
    if (this.ready) {
        this._export(requests, tpl, tplOut, callback);
    } else {
        this.once('ready', function () {
            self._export(requests, tpl, tplOut, callback);
        })
    }

}

ExcelExporter.prototype._export = function (requests, tpl, tplOut, callback) {
    
    //Prepare arguments
    var ArrayList = java.import('java.util.ArrayList');
    var Request = java.import('com.pactilis.excelReporter.services.Request');
    var ReportService = java.import('com.pactilis.excelReporter.services.ReportService');
    var reportServ = new ReportService();
    var reqList = new ArrayList();
    _.each(requests, addReqToList);

    //building report...
    reportServ.runReport(reqList, tpl, tplOut, function (err, res) {
        if (err) {
            console.log("error generating file", err);
            callback(err);
            return;
        }
        console.log("Success generating report", res);
        callback(null, res);
        return;
    });


    function addReqToList(req) {
        var r = new Request();

        r.setDbTypeSync(req.dbType);
        r.setDbServerSync(req.dbServer);
        r.setDbPortSync(String(req.dbPort));
        r.setDbNameSync(req.dbName);
        r.setDbUserSync(req.dbUser);
        r.setDbPwdSync(req.dbPwd);
        r.setVarSync(req.var);
        r.setSqlSync(req.sql);
        reqList.addSync(r);
    }
}
module.exports = {
    create: function () {
        return new ExcelExporter();
    }
};

