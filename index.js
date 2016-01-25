var excel = require("./lib/excel-exporter").create();

var requests = [
    {
        dbType: 'MSSQL',
        dbServer: 'srv-database',
        dbPort: '1433',
        dbName: 'ascoma_togo',
        dbUser: 'admin',
        dbPwd: 'admin',
        var: 'xen',
        sql: 'select top 100 cod_ben, nom_ben, pre_ben, nai_ben from beneficiaire'
    }
];
var tplfile = 'C:/Users/Jonatan/Documents/DEV/statfiles/reports/listben.xlsx';
var tplfileOut = 'C:/Users/Jonatan/Documents/DEV/statfiles/reports/listben_out.xlsx';
// setTimeout(function () {
    excel.export(requests, tplfile, tplfileOut, function (err, rs) {
        if (err) {
            console.log("error generating file", err);

            return;
        }
    })
// }, 10000);
 
 