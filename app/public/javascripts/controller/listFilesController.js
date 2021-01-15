class listFilesController {
    constructor(){
        this.listFilesEl = document.querySelector(".list-group");
        this.btnSendFilesEl = document.querySelector("#btn-send-files");
        this.inputFilesEl = document.querySelector("#input-files");
        this.renderList();
        this.initEvents();    
    }


    initEvents(){
        this.btnSendFilesEl.addEventListener('click',()=>{
            this.inputFilesEl.click();
        });
        this.inputFilesEl.addEventListener('change',event=>{
            this.uploadTask(event.target.files);
        });
    }

    ajaxPromise(method="GET",url="/library",formData=function(){}){
        return new Promise ((resolve,reject)=>{
            let xhr = new XMLHttpRequest();
            xhr.open(method,url);
            xhr.onload = event=>{
                try{
                    resolve(JSON.parse(xhr.responseText));  // responseText retorna o texto recebido de um servidor após o envio de uma solicitação.
                } catch (e) {
                    reject(e);
                }
            };
            xhr.send(formData);
        });
    }

    ajax(method="GET",url="/library",formData=function(){}){
        let xhr = new XMLHttpRequest();
        xhr.open(method,url);
        xhr.send(formData);
        
    }

    renderList(){
        this.ajaxPromise("POST","/library/files").then(response=>{
            this.listFilesEl.innerHTML="";
            response.data.forEach(file=>{
                let a = document.createElement("a");
                a.classList.add("list-group-item","list-group-item-action","a-item");
                //a.href = "#"
                a.innerHTML = `
                <div class="container">
                    <div class="row align-items-start">
                        <div class="col">
                            <svg class="bi" width="23" height="23" fill="currentColor">
                            <use xlink:href="bootstrap-icons/bootstrap-icons.svg#file-earmark-check"/>
                            </svg> 
                            ${file.items.name}
                        </div>
                    </div>
                </div>`;
                this.listFilesEl.appendChild(a);
            });
            window.switch.changeListTheme();
            this.initEventsItem()
        });
    }

    uploadTask(files){
        /*
        [...files].forEach(file=>{
            let formData = new FormData();
            formData.append('file',file);
            this.ajaxPromise("POST","/library/file_upload",formData).then(response=>{
                if(!response.err){
                    console.log("foi");
                }
            });
        });
        */
         //send all files
        let formData = new FormData();
        [...files].forEach(file=>{
            formData.append('files[]',file); 
        });
        this.ajaxPromise("POST","/library/file_upload",formData);
        this.renderList();
        
    }

    initEventsItem(){
        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(li=>{
            li.addEventListener('click',e=>{
                if(!e.ctrlKey){
                    this.listFilesEl.querySelectorAll('a.list-group-item.selected').forEach(el=>{
                        el.classList.remove('selected');
                    });
                }
                li.classList.toggle("selected");
           });
        });
    }

}

    /*


    connectFirebase(){
      // Your web app's Firebase configuration
      // For Firebase JS SDK v7.20.0 and later, measurementId is optional
      var firebaseConfig = {
        apiKey: "AIzaSyAvwOB0F1D-SUISXubYML56t9oQlpZy9jY",
        authDomain: "ksong-f8993.firebaseapp.com",
        databaseURL: "https://ksong-f8993-default-rtdb.firebaseio.com",
        projectId: "ksong-f8993",
        storageBucket: "ksong-f8993.appspot.com",
        messagingSenderId: "318508686488",
        appId: "1:318508686488:web:05fd214c3b8462a7c9c4ed",
        measurementId: "G-7Z37N30CBB"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      firebase.analytics();
    }

    getFileLiView(key,data){
        let a = document.createElement("a");
        a.classList.add("list-group-item","list-group-item-action","a-item");
        //a.href = "#"
        a.innerHTML = `
        <div class="container">
            <div class="row align-items-start">
            <div class="col">
                <svg class="bi" width="23" height="23" fill="currentColor">
                <use xlink:href="bootstrap-icons/bootstrap-icons.svg#music-note"/>
                </svg> ${data.name}
            </div>
            <div class="col">
                Artist
            </div>
            <div class="col">
                Album
            </div>
            </div>
        </div>`;
        this.listFilesEl.appendChild(a);
    }

    renderList(){
        firebase.database().ref('users/').on('value', snapshot=>{
            this.listFilesEl.innerHTML= '';
            snapshot.forEach(snapshotItem => {
                let key = snapshotItem.key;
                let data = snapshotItem.val();
                if(data.type){
                    this.getFileLiView(key,data);
                }
            });
            this.initEventsItem();
            if(window.switch.theme) window.switch.changeListTheme();
        });
    }
    */