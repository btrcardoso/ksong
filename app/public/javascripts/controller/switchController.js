class SwitchController {
    constructor() {
        this.theme = false;
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

    changeListTheme(){
        this.listFilesEl.querySelectorAll("a.list-group-item").forEach(item=>{
            item.classList.toggle("dark-theme",this.theme);
         });
    }

    changeTheme(){
        
        this.theme = !this.theme;
        document.body.classList.toggle("dark-theme",this.theme);

        this.navEl.classList.toggle("dark-theme",this.theme);
        this.navEl.classList.toggle("navbar-dark",this.theme);

        document.querySelectorAll(".btn").forEach(btn=>{
            btn.classList.toggle("dark-theme",this.theme);
            btn.classList.toggle("btn-dark",this.theme);
        });
        this.changeListTheme();
    }
}