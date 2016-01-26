var path = require('path');
var excel = require("../excel-exporter").create();

var data = [
    {
        name: 'obj',
        value: {
            firstname: 'Jonatan',
            age: 70,
            dob: new Date(),
            dep: {
                depname: 'Service informatique',
                grade: 'Responsable'
            },
            cols: [
                {
                    v: 'test1'
                },
                {
                    v: 'test3'
                }
            ]
        }
    }
];

var tpl = path.join(__dirname, 'template.xlsx');
var tplOut = path.join(__dirname, 'template_out.xlsx');

excel.export(data, tpl, tplOut, function () {
    console.log('OK');
})
