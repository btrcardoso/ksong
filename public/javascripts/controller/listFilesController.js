class listFilesController {
    constructor(){
        this.currentFolder = ["Home"];
        this.onselectionchange = new Event('selectionchange');
        this.listFilesEl = document.querySelector(".list-group");
        this.btnSendFilesEl = document.querySelector("#btn-send-files");
        this.btnNewFolder = document.querySelector("#btn-new-folder");
        this.btnDelete = document.querySelector("#btn-delete");
        this.btnRename = document.querySelector("#btn-rename");
        this.inputFilesEl = document.querySelector("#input-files");
        this.olBreadCrumb = document.querySelector(".breadcrumb");
        this.toastProgressEl = document.querySelector("#toast-progress");
        this.lastASelected;
        this.lastIndex;
        this.numberOfFiles=0;
        this.initEvents(); 
        this.openFolder(this.currentFolder.join("/"));
    }

    getElementsSelected(){
        return this.listFilesEl.querySelectorAll("a.list-group-item.selected");
    }

    styleButtons(){
        switch(this.getElementsSelected().length){
            case 0:
                this.btnDelete.style.display = 'none';
                this.btnRename.style.display = 'none';
                break;
            case 1:
                //let state = (JSON.parse(this.getElementsSelected()[0].dataset.file).type=="folder") ? "none" : "block";
                let state = "block";
                this.btnDelete.style.display = 'block';
                this.btnRename.style.display = state;
                break;
            default:
                this.btnDelete.style.display = 'block';
                this.btnRename.style.display = 'none';
        }
    }

    initEvents(){
        this.listFilesEl.addEventListener('selectionchange',e=>{
            this.styleButtons();
        });

        this.btnSendFilesEl.addEventListener('click',()=>{
            this.inputFilesEl.click();
        });        
        this.inputFilesEl.addEventListener('change',event=>{
            let folder = this.currentFolder.join('/');
            this.numberOfFiles += [...event.target.files].length;
            //this.showToastProgress();
            let promises = [];
            [...event.target.files].forEach(file=>{
                //this.disabledButtons();
                let formData = new FormData();
                formData.append('content',file);
                promises.push(this.ajaxPromise("POST","/file_upload",formData,folder,(event)=>{
                    this.uploadProgress(event, file);
                }/*,event=>{
                    this.addInfoOnToast(event, file);
                }*/).then(response=>{
                    if(!response.err) {
                        this.renderList();
                    } else {
                        this.changeContenOfToastProgressBody("Didn't is possible to do the changes");
                    }
                }));
            });
            Promise.all(promises).then(responses=>{
                this.showToastProgress(false);
                //this.disabledButtons(false);
            });
        });

        this.btnNewFolder.addEventListener('click',event=>{
            let name = prompt('Folder name:');
            if(name!=null && name.indexOf("/")<0){
                this.ajaxPromise("POST","/files").then(response=>{
                    if(name=="") name = "New folder";
                    let repeatName = 0;
                    response.data.forEach(file=>{
                        if(name==file.items.name) repeatName+=1;
                    });
                    if(repeatName==0) {
                        this.showToastProgress();
                        this.addChanges(name,"/new_folder");
                    } else {
                        alert("You cannot use this name.");
                    }
                });
            }
            if(name.indexOf("/")>=0){
                alert("Do not use '/' in folder name.");
            }
            
        });
        this.btnDelete.addEventListener('click',event=>{
            let folder = this.currentFolder.join('/');
            this.showToastProgress();

            /* enviando todos de uma vez*/

            let contentArray = [];
            let url = `/file_delete`;
            let key;
            let file;
            this.getElementsSelected().forEach(a=>{
                key = JSON.parse(a.dataset.key);
                file = JSON.parse(a.dataset.file);
                contentArray.push(JSON.stringify({key, file}));
            });


            this.addChanges(contentArray,url,folder,'content[]');
            /*
                this.disabledButtons();
                let formData = new FormData();
                formData.append('content[]',contentArray);
                this.ajaxPromise("POST",url,formData,folder,onprogress=function(){}).then(response=>{
                    if(!response.err) {
                        this.renderList();
                        this.showToastProgress(false);
                        this.disabledButtons(false);
                    } else {
                        console.log("erro");
                        this.changeContenOfToastProgressBody("Didn't is possible to do the changes");
                    }
                });
            */

            /* enviando um de cada vez*/
            /*
            this.getElementsSelected().forEach(a=>{
                this.sendData(JSON.parse(a.dataset.key),JSON.parse(a.dataset.file),folder);
            });
            */
        });

        document.addEventListener('keydown',e=>{
            if(e.key=='Delete'){
                this.btnDelete.click();
            }
        });

        this.btnRename.addEventListener('click',event=>{
            let a = this.getElementsSelected()[0];
            let newName = prompt('Renomeie o arquivo:');
            if(newName!=null && newName!=""){
                this.showToastProgress();

                /* isso */
                let folder = this.currentFolder.join("/");
                let key = JSON.parse(a.dataset.key);
                let file = JSON.parse(a.dataset.file);
                let type = file.type;
                let content;
                let url;
                let oldName = file.name;
                file.name = newName;
                content = (type!="folder") ? JSON.stringify({key, file}) : JSON.stringify({key, file,oldName, newName});
                url = (type!="folder") ? `/file_rename` : `/folder_rename`;
                this.addChanges(content,url,folder);

                /* é isso */
                //this.sendData(JSON.parse(a.dataset.key),JSON.parse(a.dataset.file),this.currentFolder.join("/"),newName); 
            }
        });
    }

    sendData(key,file,folder,newName=null){
        let type = file.type;
        let content;
        let url;
        if (newName) { //is rename
            let oldName = file.name;
            file.name = newName;
            content = (type!="folder") ? JSON.stringify({key, file}) : JSON.stringify({key, file,oldName, newName});
            url = (type!="folder") ? `/file_rename` : `/folder_rename`;
        } else { //is delete
            content = (type!="folder") ? JSON.stringify({key, file}): JSON.stringify({key, name: file.name});
            url = (type!="folder") ? `/file_delete` : `/folder_delete`;
        }
        this.addChanges(content,url,folder);
    }

    addChanges(content,url,folder=this.currentFolder.join("/"),contentName='content'){
        this.disabledButtons();
        let formData = new FormData();
        formData.append(contentName,content);
        this.ajaxPromise("POST",url,formData,folder).then(response=>{
            if(!response.err) {
                this.renderList();
                this.showToastProgress(false);
                this.disabledButtons(false);
            } else {
                console.log("erro");
                this.changeContenOfToastProgressBody("Didn't is possible to do the changes");
            }
        });
    }

    showToastProgress(bool = true){
        if (bool){
            this.toastProgressEl.classList.remove('hide');
            this.toastProgressEl.classList.add('show');
        } else {
            this.toastProgressEl.classList.remove('show');
            this.toastProgressEl.classList.add('hide');
        }
        this.changeContenOfToastProgressBody();
        this.changeContenOfToastProgressHeader();
    }

    changeContenOfToastProgressBody(body=`Working...`){
        this.toastProgressEl.querySelector(".toast-body").innerHTML = body;
    }

    changeContenOfToastProgressHeader(header=`Loading`){
        this.toastProgressEl.querySelector(".toast-header").innerHTML = `<strong class="me-auto">${header}</strong>`;
    }

    showNumberOfFilesOnToastProgressHeader(){
        let s = (this.numberOfFiles==1)?``:`s`;
        this.changeContenOfToastProgressHeader(`Sending ${this.numberOfFiles} file`+s);
    }

    addInfoOnToast(event,file){
        let div = document.createElement("div");
        div.classList.add("toast-body");
        //div.dataset.xhr = JSON.stringify(file.size);
        div.innerHTML = `Loading ${file.name} <strong>0%</strong>`;
        document.getElementById("toast-progress").appendChild(div);
    }

    uploadProgress(event,file){
        //console.log(event.loaded,event.total,file.name);
        this.showToastProgress();
        let percent = (event.loaded*100)/event.total;
        this.showNumberOfFilesOnToastProgressHeader();
        //this.addInfoOnToast(file,parseInt(percent));
        this.changeContenOfToastProgressBody(`Loading ${file.name} <strong>${parseInt(percent)}%</strong>`);
    }

    ajaxPromise(method="GET",url="",formData=new FormData(),folder=this.currentFolder.join("/"),onprogress=function(){},onloadstart=function(){}){
        return new Promise ((resolve,reject)=>{
            formData.append('folder',folder);
            let xhr = new XMLHttpRequest();
            xhr.open(method,"/library"+url);
            xhr.upload.onloadstart = onloadstart;
            xhr.upload.onprogress = onprogress; 
            xhr.send(formData);
            xhr.onload = event=>{
                try{
                    resolve(JSON.parse(xhr.responseText));  // responseText retorna o texto recebido de um servidor após o envio de uma solicitação.
                } catch (e) {
                    reject(e);
                }
            };
        });
    }


    getIcon(type){
        switch(type){
            case 'folder':
                return 'folder';
                break;
            case 'image/jpeg':
            case 'image/png':
            case 'image/jpg':
            case 'image/gif':
                return 'image';
                break;
            case 'audio/mp3':
            case 'audio/ogg':
                return 'file-music';
                break;
            case 'video/mp4':
                return 'film';
                break;
            default:
                return 'file-earmark-check';
                break;
        }
    }

    disabledButtons(bool = true){
        this.btnNewFolder.disabled = bool;
        this.btnSendFilesEl.disabled = bool;
        this.btnDelete.disabled = bool;
        this.btnRename.disabled = bool;
    }

    renderList(){
        this.disabledButtons();
        this.styleButtons();
        this.ajaxPromise("POST","/files").then(response=>{
            this.listFilesEl.innerHTML="";
            response.data.forEach(file=>{
                let a = document.createElement("a");
                a.classList.add("list-group-item","list-group-item-action","a-item");
                a.dataset.file = JSON.stringify(file.items);
                a.dataset.key = JSON.stringify(file.key);
                //a.href = "#"
                let limit = 60;
                let name = file.items.name.substr(0,limit);
                if(file.items.name.length>limit) name +="...";

                a.innerHTML = `
                <div class="container">
                    <div class="row align-items-start">
                        <div class="col">
                            <svg class="bi" width="23" height="23" fill="currentColor">
                            <use xlink:href="bootstrap-icons/bootstrap-icons.svg#${this.getIcon(file.items.type)}"/>
                            </svg> 
                            ${name}
                        </div>
                    </div>
                </div>`;
                this.listFilesEl.appendChild(a);
            });

            if(response.data.length==0) this.listFilesEl.innerHTML="There are no files.";
            window.switch.changeListTheme();
            this.initEventsItem();
            this.disabledButtons(false);
            this.lastASelected = undefined;

            if(this.numberOfFiles>0){
                this.numberOfFiles=this.numberOfFiles -1;
                this.showNumberOfFilesOnToastProgressHeader();
            } 
        });
    }

    openFolder(folder){
        this.olBreadCrumb.innerHTML = "";
        let folders = [];
        for(let i = 0; i<this.currentFolder.length; i++){
            let li = document.createElement('li');
            li.classList.add('breadcrumb-item');
            li.innerHTML = (i != this.currentFolder.length - 1) ? `<a href="#">${this.currentFolder[i]}</a>` : `${this.currentFolder[i]}` ;
            folders.push(this.currentFolder[i]);
            li.dataset.path = folders.join('/');
            this.olBreadCrumb.appendChild(li);
            if(i != this.currentFolder.length - 1){
                li.addEventListener('click',()=>{
                    this.currentFolder = li.dataset.path.split('/');
                    this.openFolder();
                });
            }
        }
        this.listFilesEl.innerHTML="Loading...";
        this.renderList();
    }

    listFilesArray(){
        return this.listFilesEl.querySelectorAll("a.list-group-item");
    }

    initEventsItem(){
        this.listFilesArray().forEach((a,indexA)=>{
            a.addEventListener('dblclick',e=>{
                let data = JSON.parse(a.dataset.file);
                switch(data.type){
                    case 'folder':
                        this.currentFolder.push(data.name);
                        this.openFolder(data.name);
                        break;
                    default:
                        window.open('/library/file?path='+data.path)
                }
            });
            a.addEventListener('click',e=>{
                if(e.shiftKey && this.lastASelected){
                    let indexStart;
                    let indexEnd;
                    let keyAtualA = JSON.parse(a.dataset.key);
                    for(let i = 0; i < this.listFilesArray().length-1;i++){
                        let keyItemList = JSON.parse(this.listFilesArray()[i].dataset.key);
                        indexStart = i;
                        if(keyItemList===this.lastASelected.key){
                            indexEnd = indexA;
                            break;
                        }
                        if(keyItemList===keyAtualA){
                            indexEnd = this.lastASelected.index;
                            break;
                        }
                    }
                    if(this.lastIndex){
                        for(let i = this.lastIndex.indexStart; i<=this.lastIndex.indexEnd; i++){
                            this.listFilesArray()[i].classList.remove('selected');
                        }
                    }
                    for(let i = indexStart; i<=indexEnd; i++){
                        this.listFilesArray()[i].classList.add('selected');
                    }
                    this.lastIndex = {indexStart,indexEnd};    
                } else {
                    if(!e.ctrlKey){
                        this.listFilesEl.querySelectorAll('a.list-group-item.selected').forEach(el=>{
                            el.classList.remove('selected');
                        });
                    }
                    a.classList.toggle("selected");
                    this.lastASelected = {index:indexA,key:JSON.parse(a.dataset.key)};
                    this.lastIndex = undefined;
                }
                this.listFilesEl.dispatchEvent(this.onselectionchange);
           });
        });
    }

}