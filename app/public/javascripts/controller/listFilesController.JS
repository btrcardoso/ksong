class listFilesController {
    constructor(){
        this.listFilesEl = document.querySelector(".list-group");
        this.btnSendFilesEl = document.querySelector("#btn-send-files");
        this.inputFilesEl = document.querySelector("#input-files");
        this.connectFirebase();
        this.initEvents();
        this.renderList();
    }

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

    initEvents(){
        this.btnSendFilesEl.addEventListener('click',()=>{
            this.inputFilesEl.click();
        });
        this.inputFilesEl.addEventListener('change',event=>{
            this.uploadTask(event.target.files);
        });
    }

    uploadTask(files){
        [...files].forEach(file=>{
            firebase.database().ref('users/').set({             
                name: file.name,
                size: file.size,
                type: file.type
            });
        });
    }

    initEventsItem(){
        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(li=>{
            li.addEventListener('click',()=>{
               li.classList.toggle('selected');
           });
        });
    }


    renderList(){
        for(let i =0; i<15;i++){
            let a = document.createElement("a");
            a.classList.add("list-group-item","list-group-item-action","a-item");
            //a.href = "#"
            a.innerHTML = `
            <div class="container">
                <div class="row align-items-start">
                <div class="col">
                    <svg class="bi" width="23" height="23" fill="currentColor">
                    <use xlink:href="bootstrap-icons/bootstrap-icons.svg#music-note"/>
                    </svg> Song
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
        this.initEventsItem();
    }
    
}