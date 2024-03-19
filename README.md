# node-package-zip

### objetivo

el objetivo de este util es la compresión de los ficheros de un proyecto NODE



```
let options = { path: `${process.cwd()}/..`}
require('node-zip-package')(options)

```    
### options

    path: carpeta con las diferentes versiones
    regVer: matriz con regexp de las carpetas de versiones válidas
    regExc: matriz con regexp con las carpetas a excluir del fichero Zip

### ejemplo
```
        require('./node.zip.package.class.js')({
                            path: `${process.cwd()}/..` ,
                            regVer : [
                                new RegExp(/[a-z]\d/g),
                                new RegExp(/[a-z]\d\.\d/g),
                                new RegExp(/[a-z]\d\.\d\.\d/g),
                            ],
                            regExc : [
                                new RegExp(/^\./g),
                                new RegExp(/^node_modules/g),
                            ]
                        })

```