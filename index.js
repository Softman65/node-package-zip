const { readdirSync, lstatSync } = require('fs')
const path = require('path');
const AdmZip = require("adm-zip");

class zipack{
    
    constructor (mainPath){
        this.zip = new AdmZip();
        this.start = async(directory ,filesArray, proc, onlyFolders)=>{
            return await readFolderRecursive( directory ,filesArray, (v)=>{ 
                proc(v) } , onlyFolders )  
        }
        this.readFolderRecursive = async( _dir , filesArray, callback, onlyFolders )=>{    
            var files = readdirSync( _dir )
            await processFiles( _dir, files ,0 , filesArray, callback, onlyFolders )
        }
        this.processFiles = async(_dir, array, n ,filesArray, callback, onlyFolders )=>{
            const file = array[n]
            if(n<array.length){
                let fileDetails = lstatSync(path.resolve(_dir, file));
                if (fileDetails.isDirectory()) {
                    if( onlyFolders ? !onlyFolders(file) : (file.indexOf('.')==0 || file.indexOf('node_modules')==0) ){
                        console.error('EXCLUDE Directory: ' + file)
                        await processFiles( _dir, array, n+1 ,filesArray, callback, onlyFolders)
                    }else{
                        //directory = directory + '\\' + file                
                        console.log('Directory: ' + _dir + '/' + file)
                        if(!onlyFolders){
                            await readFolderRecursive( _dir + '/' + file  , filesArray,async()=>{
                                    await processFiles( _dir, array, n+1 ,filesArray, callback, onlyFolders)
                            })
                        }else{
                            filesArray.push( [`${file}`] )
                            await processFiles( _dir, array, n+1 ,filesArray, callback, onlyFolders)
                        }
                    }
                    
                } else {
                    //let dir = _dir //.split(_Path)[1] + '\\'  //.length>1 ? directory.split(_Path)[1] :'\\'
                    if(file.indexOf('.zip')==-1 && !onlyFolders)
                        filesArray.push( [`${_dir}`,`${file}`] )
                    //console.log('File: ' + file, _dir);
                    await processFiles( _dir, array, n+1 ,filesArray, callback, onlyFolders)
                }
            }else{
                callback(filesArray)
            }
        
            
        }
        this.$fzip = ( directory, array,e,callback)=>{
    
            if(e<array.length){
        
                let file = array[e]
                localPath = `${file[0]}/${file[1]}`
                zipPath = `${file[0].replace(directory,'')}`
                
                console.log(localPath, zipPath)
        
                zip.addLocalFile(localPath, zipPath) //(`.${file[0]}/${file[1]}`, file[1])
                       
                $fzip(array,++e,callback)
            }else{
                callback()
            }
        } 
        start( mainPath , [] , async(filesArray)=>{
 
            const fileZip =filesArray.pop()
            var directory = path.normalize(`${process.cwd()}/../${fileZip}`.split(':')[1]).replace(/\\/g,'/')

            await readFolderRecursive( `${process.cwd()}/../${fileZip}` , [], ()=>{
        
                filesArray.sort((a,b)=>{ 
                    if (a[0].length > b[0].length) {
                        return 1;
                      }
                      if (a[0].length < b[0].length) {
                        return -1;
                      }
                      return 0;
                })
        
                $fzip(directory,[],0,()=>{
                    zip.writeZip(`../${fileZip}.zip`);
                })
            })

        },(_f)=>{ return _f.indexOf('v')==0 } )        
    }
    
}

module.exports = (mainPath)=>{
    return new zipack(mainPath)
}
