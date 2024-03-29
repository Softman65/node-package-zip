const { readdirSync, lstatSync } = require('fs')
const path = require('path');
const AdmZip = require("adm-zip");

class zipack{
    
    constructor (options){

        this.zip = new AdmZip();
        this.start = async(directory ,filesArray, proc, onlyFolders)=>{
            return await this.readFolderRecursive( directory ,filesArray, (v)=>{ 
               return proc(v) } , onlyFolders )  
        }
        this.readFolderRecursive = async( _dir , filesArray, callback, onlyFolders )=>{    
            var files = readdirSync( _dir )
            await this.processFiles( _dir, files ,0 , filesArray, callback, onlyFolders )
        }
        this.processFiles = async(_dir, array, n ,filesArray, callback, onlyFolders )=>{
            
            const file = array[n]
            const msglog =`Directory:${_dir}/${file}`

            if(n<array.length){
                let fileDetails = lstatSync(path.resolve(_dir, file));
                if (fileDetails.isDirectory()) {
                    if(!onlyFolders)
                        debugger
                    if( !onlyFolders.test(file) ) {
                        console.error(`${msglog} EXCLUDE`)
                        await this.processFiles( _dir, array, n+1 ,filesArray, callback, onlyFolders)
                    }else{
                        if(!onlyFolders._t){
                            await this.readFolderRecursive( _dir + '/' + file  , filesArray,async()=>{
                                    await this.processFiles( _dir, array, n+1 ,filesArray, callback, onlyFolders)
                            }, onlyFolders)
                        }else{
                            filesArray.push( [`${file}`] )
                            await this.processFiles( _dir, array, n+1 ,filesArray, callback, onlyFolders)
                        }
                    }
                    
                } else {
                    if(file.indexOf('.zip')==-1 && !onlyFolders._t)
                        filesArray.push( [`${path.normalize(_dir)}`,`${file}`] )
                    await this.processFiles( _dir, array, n+1 ,filesArray, callback, onlyFolders)
                }
            }else{
                callback(filesArray)
            }
        
            
        }
        this.$fzip = ( directory, array,e,callback)=>{
    
            if(e<array.length){
        
                const file = array[e]
                let dirfs = directory.replace(/\//g,'\\')
                const localPath = path.normalize(file.length==1  ? `${file[0]}`:`${file[0]}/${file[1]}`)

                let ofileOf = file[0].indexOf( dirfs )
                const localRest = file[0].substr(ofileOf + dirfs.length).replace( /\\/g,"/" ) 
                const zipFile = `${localRest}${localRest.length>0?'/':''}`

                console.log( localPath, zipFile)
        
                this.zip.addLocalFile(localPath, zipFile) 
                       
                this.$fzip(directory,array,++e,callback)
            }else{
                callback()
            }
        } 
        
        this.test=(reg,_string)=>{
            let r = false
            let so = []

            reg.forEach((regex,n)=>{
                so[n] = _string.match(regex)?true:false 
            })
            
            so.forEach((e)=>{
                if(e)
                    r = true 
            })
            return r 
        }

        this.start( options.path , [] , async(filesArray)=>{
 
            const fileZip =filesArray.pop()
            var directory = path.normalize(`${process.cwd()}/../${fileZip}`.split(':')[1]).replace(/\\/g,'/')

            await this.readFolderRecursive( `${process.cwd()}/../${fileZip}` , [], (filesArray)=>{
        
                filesArray.sort((a,b)=>{ 
                    if (a[0].length > b[0].length) {
                        return 1;
                      }
                      if (a[0].length < b[0].length) {
                        return -1;
                      }
                      return 0;
                })
        
                this.$fzip(directory,filesArray ,0,()=>{
                    this.zip.writeZip( path.normalize(`${directory}/../${fileZip}.zip`) );
                })

            }, options.fn_validate(this, options.regExc, false))

        }, options.fn_validate(this,options.regVer, true) )
             
    } 
    
}

module.exports = (options )=>{
    if(!options.regVer)
        options.regVer = [
            new RegExp(/[a-z]\d/g),
            new RegExp(/[a-z]\d\.\d/g),
            new RegExp(/[a-z]\d\.\d\.\d/g),
        ]
    if(!options.regExc)
        options.regExc =[
            new RegExp(/^\./g),
            new RegExp(/^node_modules/g),
        ] 
    if(!options.path)
        options.path = path.normalize( options.path ? options.path: `${process.cwd()}/..` )
    
    options.fn_validate = (_this, _regexp, _x)=>{
        
        return  { test : (_f)=>{
                            let exp = _x ? _this.test(_regexp ,_f):!_this.test(_regexp ,_f)
                            return exp
                        },
                  _t : _x
                }          
    }

    return new zipack(options)
}