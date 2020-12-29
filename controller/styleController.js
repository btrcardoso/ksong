class StyleController {
    constructor() {
        this.lightOn = false;
        this.navEl = document.querySelector(".navbar");
        this.ulEl = document.querySelector(".list-group");
        this.btnLightSwitchEl = document.querySelector(".light-switch");
        this.divCollapseElClass = document.querySelector(".collapse").classList;
        this.initEvents();
        this.changeTheme();
    }
    
    initEvents(){
        document.querySelector(".light-switch").addEventListener('click', ()=>{
            this.changeTheme();
        });
        
        document.querySelector(".navbar-toggler").addEventListener('click', ()=>{
            this.divCollapseElClass.toggle("show");
        });
    }

    changeTheme(){
        this.navEl.classList.remove("navbar-light","navbar-dark");
        this.btnLightSwitchEl.classList.remove("btn-light","btn-dark");

        let bgColor = "white";
        let navbarClass = "navbar-light";
        let navBgColor = "rgb(148 148 148)";
        let liBgColor = "#ececec";
        let btnLightSwitchClass="btn-light";
        let btnLightSwitchBgColor = "#ececec";
        let liColor = "black";

        if(!this.lightOn){
            bgColor = "rgb(63, 62, 62)"; 
            navbarClass = "navbar-dark";
            navBgColor = "rgb(27 26 26)";
            liBgColor = "#333333";
            btnLightSwitchClass="btn-dark";
            btnLightSwitchBgColor = "#333333";
            liColor = "white";
        }

        document.body.style.backgroundColor = bgColor;

        this.navEl.classList.add(navbarClass);
        this.navEl.style.backgroundColor = navBgColor;

        this.ulEl.querySelectorAll("li.list-group-item").forEach(li=>{
            li.style.backgroundColor = liBgColor;
            li.classList.remove("list-group-item-dark","list-group-item-light");
            li.style.color = liColor;
        });

        this.btnLightSwitchEl.classList.add(btnLightSwitchClass);
        this.btnLightSwitchEl.style.backgroundColor = btnLightSwitchBgColor;

        this.lightOn = !this.lightOn;
    }
}