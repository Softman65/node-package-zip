# node-package-zip

### objetivo

el objetivo de este util es la compresión de los ficheros de un proyecto NODE
tendremos una carpeta que aloja
### instalación
```
npm install -D node-package-zip
```

crea en tu proyecto un fichero pack.js
```
require('node-package-zip')(<options>)

```
modifica package.json
```
    "scripts": {
        "package": "node ./pack.js"
    }
```

para realizar una copia 
```
    npm run package
```

### options
    todos los parametros son opcionales y sirven para
    controlar la ubicación y el contenido del zip
```

    <regVer>: matriz con regexp de las carpetas de versiones válidas
    <regExc>: matriz con regexp con las carpetas a excluir del fichero Zip
    <path>  : carpeta con las diferentes versiones, 
              (escogera la última carpeta <regVer> modificada)
```
### ejemplo
```
        require('node-package-zip')({
                            path: `${process.cwd()}/..` ,
                            regVer : [
                                new RegExp(/[a-z]\d\.\d\.\d/g),   // ejemplo v1.0.1
                            ],
                            regExc : [
                                new RegExp(/^\./g),              // excluye carpeta .*
                                new RegExp(/^node_modules/g),    // excluye node_modules
                            ]
                        })

```

creará un fichero ***v1.0.1.zip*** en la carpeta ***options.path*** 