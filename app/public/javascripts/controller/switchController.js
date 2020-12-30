class SwitchController {
    constructor() {
        this.lightOn = false;
        this.navEl = document.querySelector(".navbar");
        this.listFilesEl = document.querySelector(".list-group");
        this.btnLightSwitchEl = document.querySelector(".light-switch");
        this.divCollapseEl = document.querySelector(".collapse");
        this.initEvents();
        this.changeTheme();
    }
    
    initEvents(){
        document.querySelector(".light-switch").addEventListener('click', ()=>{
            this.changeTheme();
        });
        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(li=>{
            li.addEventListener('click',()=>{
               li.classList.toggle('selected');
           });
        });
    }

    changeTheme(){
        let bodyClass = "body-light";
        let navbarClass = ["navbar-light","nav-light"];
        let liClass = "item-light";
        let btnLightSwitchClass=["btn-light","btn-switch-light"];

        if(!this.lightOn){
            bodyClass = "body-dark";
            navbarClass = ["navbar-dark","nav-dark"];
            liClass = "item-dark";
            btnLightSwitchClass=["btn-dark","btn-switch-dark"];
        }
        
        document.body.classList.remove("body-light","body-dark");
        document.body.classList.add(bodyClass);

        this.navEl.classList.remove("navbar-light","nav-light","navbar-dark","nav-dark");
        this.navEl.classList.add(navbarClass[0],navbarClass[1]);

        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(li=>{
           li.classList.remove("item-light","item-dark");
           li.classList.add(liClass);
        });

        this.btnLightSwitchEl.classList.remove("btn-light","btn-switch-light","btn-dark","btn-switch-dark");
        this.btnLightSwitchEl.classList.add(btnLightSwitchClass[0],btnLightSwitchClass[1]);
        
        this.lightOn = !this.lightOn;
    }
}

/*
class StyleController {
    constructor() {
        this.lightOn = false;
        this.navEl = document.querySelector(".navbar");
        this.listFilesEl = document.querySelector(".list-group");
        this.btnLightSwitchEl = document.querySelector(".light-switch");
        this.divCollapseEl = document.querySelector(".collapse");
        this.initEvents();
        this.changeTheme();
    }
    
    initEvents(){
        document.querySelector(".light-switch").addEventListener('click', ()=>{
            this.changeTheme();
        });
        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(li=>{
            li.addEventListener('click',()=>{
               li.classList.toggle('selected');
           });
        });
    }

    changeTheme(){
        let bodyClass = "body-light";
        let navbarClass = ["navbar-light","nav-light"];
        let liClass = "item-light";
        let btnLightSwitchClass=["btn-light","btn-switch-light"];

        if(!this.lightOn){
            bodyClass = "body-dark";
            navbarClass = ["navbar-dark","nav-dark"];
            liClass = "item-dark";
            btnLightSwitchClass=["btn-dark","btn-switch-dark"];
        }
        
        document.body.classList.remove("body-light","body-dark");
        document.body.classList.add(bodyClass);

        this.navEl.classList.remove("navbar-light","nav-light","navbar-dark","nav-dark");
        this.navEl.classList.add(navbarClass[0],navbarClass[1]);

        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(li=>{
           li.classList.remove("item-light","item-dark");
           li.classList.add(liClass);
        });

        this.btnLightSwitchEl.classList.remove("btn-light","btn-switch-light","btn-dark","btn-switch-dark");
        this.btnLightSwitchEl.classList.add(btnLightSwitchClass[0],btnLightSwitchClass[1]);
        
        this.lightOn = !this.lightOn;
    }
}
*/