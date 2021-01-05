class SwitchController {
    constructor() {
        this.btnSwitchThemeEl = document.querySelector("#switch-theme");
        this.navEl = document.querySelector(".navbar");
        this.listFilesEl = document.querySelector(".list-group");
        this.initEvents();
        this.changeTheme();
    }
    
    initEvents(){
        this.btnSwitchThemeEl.addEventListener('click', ()=>{
            this.changeTheme();
        });
    }

    changeTheme(){        
        document.body.classList.toggle("dark-theme");

        this.navEl.classList.toggle("dark-theme");
        this.navEl.classList.toggle("navbar-dark");

        document.querySelectorAll(".btn").forEach(btn=>{
            btn.classList.toggle("dark-theme");
            btn.classList.toggle("btn-dark");
        });

        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(item=>{
           item.classList.toggle("dark-theme");
        });
    }
}