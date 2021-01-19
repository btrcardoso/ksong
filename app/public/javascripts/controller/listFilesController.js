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
                this.btnDelete.style.display = 'block';
                this.btnRename.style.display = 'block';
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
            this.showToastProgress();
            [...event.target.files].forEach(file=>{
                this.addChanges(file,"/file_upload",folder);
            });
        });

        this.btnNewFolder.addEventListener('click',event=>{
            let name = prompt('Folder name:');
            if(name!=null){
                if(name=="") name = "New folder";
                this.showToastProgress();
                this.addChanges(name,"/new_folder");
            }
        });

        this.btnDelete.addEventListener('click',event=>{
            let folder = this.currentFolder.join('/');
            this.showToastProgress();
            this.getElementsSelected().forEach(a=>{
                let key = JSON.parse(a.dataset.key);
                let type = JSON.parse(a.dataset.file).type;
                let content = (type!="folder") ? key : JSON.stringify({key: key, name: JSON.parse(a.dataset.file).name});
                let url = (type!="folder") ? `/file_delete` : `/folder_delete`;
                this.addChanges(content,url,folder);
            });
        });

        this.btnRename.addEventListener('click',event=>{
            let a = this.getElementsSelected()[0];
            let newName = prompt('Renomeie o arquivo:');
            if(newName!=null && newName!=""){
                this.showToastProgress();
                let key = JSON.parse(a.dataset.key);
                let file = JSON.parse(a.dataset.file);
                let type = file.type;
                let oldName = file.name;
                file.name = newName;
                let content = (type!="folder") ? JSON.stringify({key, file}) : JSON.stringify({key, file,oldName, newName});
                let url = (type!="folder") ? `/file_rename` : `/folder_rename`;
                this.addChanges(content,url);
            }
        });
    }

    addChanges(content,url,folder=this.currentFolder.join("/")){
        this.disabledButtons();
        let formData = new FormData();
        formData.append('content',content);
        this.ajaxPromise("POST",url,formData,folder).then(response=>{
            if(!response.err) {
                this.renderList();
                this.showToastProgress(false);
                this.disabledButtons(false);
            } else {
                this.toastProgressEl.innerHTML = `<div class="toast-body">Didn't is possible to do the changes</div>`;
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
    }

    ajaxPromise(method="GET",url="",formData=new FormData(),folder=this.currentFolder.join("/")){
        return new Promise ((resolve,reject)=>{
            formData.append('folder',folder);
            let xhr = new XMLHttpRequest();
            xhr.open(method,"/library"+url);
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
                this.listFilesEl.dispatchEvent(this.onselectionchange);
           });
        });
    }

}