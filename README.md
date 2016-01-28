# node-excel-exporter
  Export data into excel templates from javascript objects and collections.
  This is a partial port of [jxls](http://jxls.sourceforge.net/1.x/index.html) java library to node.
  

  Documentation in progress ... .

## Installation

      npm install node-jxls2
  This module depends on [node-java](https://github.com/joeferner/node-java) and [node-java-maven](https://github.com/joeferner/node-java-maven). So make sure you have your environment set up for node-gyp and that you have       java and maven installed.
On windows, you may need to specify the npm option --msvs_version (visual studio version). 
For example

      npm install node-jxls2 --msvs_version=2013

## Usage

### Export javascript objects and collections

```javascript
var path = require('path');
var excel = require('node-jxls2').create();
var data = [
    {
        name: 'obj',
        value: {
            firstname: 'Jonatan',
            age: 70,
            dob: new Date(),
            dep: {
                depname: 'IT Department',
                grade: 'Manager'
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
    }, {
        name: 'myCollection',
        value: [

            {
                color: "red",
                value: "#f00"
            },
            {
                color: "green",
                value: "#0f0"
            },
            {
                color: "blue",
                value: "#00f"
            },
            {
                color: "cyan",
                value: "#0ff"
            },
            {
                color: "magenta",
                value: "#f0f"
            },
            {
                color: "yellow",
                value: "#ff0"
            },
            {
                color: "black",
                value: "#000"
            }

        ]
    }
];
var tpl = path.join(__dirname, 'template.xlsx');
var tplOut = path.join(__dirname, 'template_out.xlsx');
excel.export(data, tpl, tplOut, function () {
    console.log('OK');
})
```
In excel template, you put placeholders for your data like this:
      
      ${obj.firstname}
      
Please refer to [jxls documentation](http://jxls.sourceforge.net/1.x/index.html) for templates usage.
Have a look at examples directory.
