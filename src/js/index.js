const assetPath = "src/access/img";
const container = document.querySelector("#panolens-separate-container")
const viewer = new PANOLENS.Viewer({ controlBar: true, container: container });
const centerImg = new THREE.Vector3(4589.76, -1963.45, -125.42);

const potision = new THREE.Vector3(1, 1, 1)
const infoSpot = new PANOLENS.Infospot(200, PANOLENS.DataImage.Info)
const infoSpot2 = new PANOLENS.Infospot(200, PANOLENS.DataImage.Info)

function onProgress(event) {
    progress = event.progress.loaded / event.progress.total * 100;
    console.log("🚀 ~ onProgress ~ progress:", progress)
    if (progress > 90) {
        MainObseverDom.togglePlay();
    }
}

function loadPanorama(imageUrl) {
    return new Promise((resolve, reject) => {
        const panorama = new PANOLENS.ImagePanorama(imageUrl);
        resolve(panorama);
    });
}



window.onload = function () {
    loadPanorama(`${assetPath}/DJI_0946.jpg`)
        .then(panorama => {
            panorama.addEventListener('progress', onProgress);
            infoSpot.position.set(4590.01, -2000, -463.48);
            infoSpot.addEventListener('click', () => {
                MenuObser.toggleContentPopUp("house");
                MainObseverDom.showPopUp();
            });

            infoSpot2.position.set(3357.87, -1576.49, 3341.54);
            infoSpot2.addEventListener('click', () => {
                MenuObser.toggleContentPopUp("youtubeHouse");
                MainObseverDom.showPopUp();
            });

            viewer.add(panorama);
            panorama.add(infoSpot)
            panorama.add(infoSpot2)
            viewer.setPanorama(panorama);
            viewer.tweenControlCenter(centerImg, 1);

        })
        .catch(err => {
            console.error('Error loading panorama:', err);
        });
    MainObseverDom.start();
    MenuObser.setAction();
    MenuObser.preLoadSlide();
    $('.carousel').carousel({
        interval: 5000
    })

}
const MainObseverDom = {
    popup: document.querySelector("#popup"),
    buttonClose: document.querySelector(".buttonClose"),
    btnMenu: document.querySelector(".buttonShowMenu"),
    menu: document.querySelector("#menuLeft"),
    iframeItem: document.querySelector(".iframePanolens"),
    btnPlay: document.querySelector(".btn-play"),
    loading: document.querySelector("#loading"),
    start: function () {
        this.togglePopUp();
        this.toggleMenu();
        this.handlePlay();
    },
    showPopUp: function () {
        this.popup.classList.toggle("show")
    },
    togglePopUp: function () {
        this.buttonClose.addEventListener("click", () => {
            this.showPopUp();
        })
    },
    toggleMenu: function () {
        this.btnMenu.addEventListener("click", () => {
            this.menu.classList.toggle("show")
        })
    },
    closeMenu: function () {
        this.menu.classList.toggle("show")
    },
    handlePlay: function () {
        this.btnPlay.addEventListener("click", () => {
            console.log("clickkk =>>>>>>>>>>>")
            this.loading.classList.add("hidden");
            setTimeout(() => {
                this.loading.classList.add("withnone");
            }, 2000)
        })
    },
    togglePlay: function () {
        this.btnPlay.classList.remove("disable");
    }
}


const MenuObser = {
    menuItem: document.querySelectorAll(".menuMain-item"),
    IframeItem: document.querySelector(".iframePanolens"),
    IframeItemYoutube: document.querySelector(".iframePanolensYoutube"),
    IframeVideoHouse: document.querySelector(".iframeVideoHouse"),
    ContentItem: document.querySelector(".carousel-inner"),
    sliderContent: document.querySelector(".sliderContent"),
    setAction: function () {
        for (const element of this.menuItem) {
            let name = element.getAttribute("data-action");
            element.addEventListener("click", () => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                MenuObser[name]();
            })
        }
    },
    actionMain: function (key) {
        this.toggleContentPopUp(key);
        MainObseverDom.showPopUp();
        MainObseverDom.closeMenu();
    },
    toggleContentPopUp: function (key) {
        switch (key) {
            case "youtubeHouse":
                this.IframeVideoHouse.setAttribute("style", "display : block");
                this.IframeItemYoutube.setAttribute("style", "display : none")
                this.IframeItem.setAttribute("style", "display : none")
                this.sliderContent.setAttribute("style", "display : none");
                break;
            case "intro":
                this.IframeItemYoutube.setAttribute("style", "display : block")
                this.IframeItem.setAttribute("style", "display : none")
                this.sliderContent.setAttribute("style", "display : none");
                this.IframeVideoHouse.setAttribute("style", "display : none");
                break;
            case "house":
                this.IframeItem.setAttribute("style", "display : block")
                this.IframeItemYoutube.setAttribute("style", "display : none")
                this.sliderContent.setAttribute("style", "display : none");
                this.IframeVideoHouse.setAttribute("style", "display : none");
                break;
            default:
                this.sliderContent.setAttribute("style", "display : block");
                this.IframeItem.setAttribute("style", "display : none")
                this.IframeItemYoutube.setAttribute("style", "display : none")
                this.IframeVideoHouse.setAttribute("style", "display : none");
                break;
        }
    },
    introduce: function () {
        this.actionMain("intro");
    },
    showHouse: function () {
        this.actionMain("house");
    },
    renderItemSlide: function (src, index) {
        return `<div class="carousel-item ${index === 0 && "active"}">
                <img class="d-block w-100" src="./src/access/img/${src}" alt="slide">
              </div>`
    },
    preLoadSlide: function () {
        let html = ``;
        const srcName = ["PANO0001.jpg", "PANO0001(1).jpg", "PANO0001(2).jpg", "PANO0001(3).jpg",, "PANO0001(4).jpg", "PANO0001(5).jpg", "PANO0001(6).jpg", "PANO0001(7).jpg", "PANO0001(8).jpg"];
        srcName.forEach((item, index) => { html += this.renderItemSlide(item, index) })
        this.ContentItem.innerHTML = html;
    },
    showSlide: function () {
        this.actionMain("slide");
    }
}
