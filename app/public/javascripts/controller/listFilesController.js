class listFilesController {
    constructor(){
        this.currentFolder = ["Home"];
        this.listFilesEl = document.querySelector(".list-group");
        this.btnSendFilesEl = document.querySelector("#btn-send-files");
        this.btnNewFolder = document.querySelector("#btn-new-folder");
        this.btnDelete = document.querySelector("#btn-delete");
        this.btnRename = document.querySelector("#btn-rename");
        this.inputFilesEl = document.querySelector("#input-files");
        this.olBreadCrumb = document.querySelector(".breadcrumb");
        this.toastProgressEl = document.querySelector("#toast-progress");
        this.initEvents(); 
        this.openFolder(this.currentFolder.join("/"));  
    }


    initEvents(){
        this.btnSendFilesEl.addEventListener('click',()=>{
            this.inputFilesEl.click();
        });
        this.inputFilesEl.addEventListener('change',event=>{
            //this.uploadTask(event.target.files);
            let files = event.target.files;
            let folder = this.currentFolder.join('/');
            this.showToastProgress();
            [...files].forEach(file=>{
                this.addSomething(file,"/library/file_upload",folder);
            });

            /*
            //this.uploadTask(event.target.files);
            let files = event.target.files;
            let folder = this.currentFolder.join('/');
            [...files].forEach(file=>{
                let formData = new FormData();
                formData.append('file',file);
                this.ajaxPromise("POST","/library/file_upload",formData,folder).then(response=>{
                    if(!response.err) {
                        this.renderList();
                    }
                });
            });
            */
        });

        this.btnNewFolder.addEventListener('click',event=>{
            let name = prompt('Folder name:');
            if(name!=null){
                if(name=="") name = "New folder";
                this.showToastProgress();
                this.addSomething(name,"/library/new_folder",this.currentFolder.join("/"));
            }

            /*
            let name = prompt('Folder name:');
            if(name!=null){
                if(name=="") name = "New folder";
                let formData = new FormData();
                formData.append('name',name);
                this.ajaxPromise("POST","/library/new_folder",formData).then(response=>{
                    if(!response.err) {
                        this.renderList();
                    }
                });
            }
            */
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
    }

    addSomething(content,url,folder){
        //this.disabledButtons();
        let formData = new FormData();
        formData.append('content',content);
        this.ajaxPromise("POST",url,formData,folder).then(response=>{
            if(!response.err) {
                this.renderList();
                this.showToastProgress(false);
            } else {
                this.toastProgressEl.innerHTML = `<div class="toast-body">Error</div>`;
            }
        });
    }

    ajaxPromise(method="GET",url="/library",formData=new FormData(),folder=this.currentFolder.join("/")){
        return new Promise ((resolve,reject)=>{
            formData.append('folder',folder);
            let xhr = new XMLHttpRequest();
            xhr.open(method,url);
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
        this.ajaxPromise("POST","/library/files").then(response=>{
            this.listFilesEl.innerHTML="";
            response.data.forEach(file=>{
                let a = document.createElement("a");
                a.classList.add("list-group-item","list-group-item-action","a-item");
                a.dataset.file = JSON.stringify(file.items);
                //a.href = "#"
                a.innerHTML = `
                <div class="container">
                    <div class="row align-items-start">
                        <div class="col">
                            <svg class="bi" width="23" height="23" fill="currentColor">
                            <use xlink:href="bootstrap-icons/bootstrap-icons.svg#${this.getIcon(file.items.type)}"/>
                            </svg> 
                            ${file.items.name}
                        </div>
                    </div>
                </div>`;
                this.listFilesEl.appendChild(a);
            });

            if(response.data.length==0) this.listFilesEl.innerHTML="There are no files.";
            window.switch.changeListTheme();
            this.initEventsItem();
            this.disabledButtons(false);
        });
    }

    /*
    uploadTask(files){
        //send 1 file
        let folder = this.currentFolder.join('/');
        [...files].forEach(file=>{
            let formData = new FormData();
            formData.append('file',file);
            this.ajaxPromise("POST","/library/file_upload",formData,folder).then(response=>{
                if(!response.err) {
                    this.renderList();
                }
            });
        });
        
         //send all files
        let formData = new FormData();
        [...files].forEach(file=>{
            formData.append('files[]',file);
        });
        this.ajaxPromise("POST","/library/file_upload",formData);
        this.renderList();
        
        
    }
    */

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
        
        /*
        let li = document.createElement('li');
        li.classList.add('breadcrumb-item');
        li.classList.add('active');
        li.innerHTML = `${folder}`;
        li.dataset.path = this.currentFolder.join('/');
        li.addEventListener('click',()=>{
            this.currentFolder = li.dataset.path.split('/');
            this.renderList();
        });
        this.olBreadCrumb.appendChild(li);
        this.renderList();
        */
    }

    initEventsItem(){
        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(a=>{
            a.addEventListener('dblclick',e=>{
                let data = JSON.parse(a.dataset.file);
                switch(data.type){
                    case 'folder':
                        this.currentFolder.push(data.name);
                        this.openFolder(data.name);
                        break;
                }
            });
            a.addEventListener('click',e=>{
                if(!e.ctrlKey){
                    this.listFilesEl.querySelectorAll('a.list-group-item.selected').forEach(el=>{
                        el.classList.remove('selected');
                    });
                }
                a.classList.toggle("selected");
           });
        });
    }

}