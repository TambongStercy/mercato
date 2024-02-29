//Navigation
function toggleMenu(){
    const toggleMenu = document.querySelector(".togglemenu");
    const navigation = document.querySelector(".navigation");
    toggleMenu.classList.toggle("active");
    navigation.classList.toggle("active");
}
//Fin de navigation

//en tête

//Change les images
function imgSlider(anything){
    document.querySelector(".parfum-list").src = anything;
}

//Change la couleur de fond
function changeBgColor(color){
    const bg = document.querySelector(".big-circle");
    bg.style.background = color;
}

//change le prix
function changePrice(price, color){
    const bg = document.querySelector("#price");
    bg.innerHTML = price;
    bg.style.color = color;
}

//Change le nom
function changeName(name){
    const bg = document.querySelector("#name");
    bg.innerHTML = name;
}

//Change la description
function changeDescription(description){
    const bg = document.querySelector("#detailS");
    bg.innerHTML = description;
}

//Change la couleur du boutton
function changeButtonColor(color){
    const bg = document.querySelector(".content-btn");
    bg.style.background = color;
}

let icons = document.querySelectorAll(".circle .item");

//Change d'image dans un interval de temps
let autoSlide = setInterval(() => {
    let index = Math.floor(Math.random() * icons.length);
    icons[index].click();
}, 3000);

//Function pour ajouter
function toggle(e){
    //si l'utilisateur click manuellement
    if (e.isTrusted){
        return;
    }

    //change les images du slider
    const img = this.children[0].src;
    imgSlider(img);

    //change la couleur de fond et du boutton
    const color = this.children[0].dataset.color;
    changeBgColor(color);
    changeButtonColor(color);

    //change le prix
    const price = this.children[0].dataset.price;
    changePrice(price, color)

    //change le nom
    const name = this.children[0].dataset.name;
    changeName(name);

    //Change la description
    const description = this.children[0].dataset.description;
    changeDescription(description);
}

//Event listener
icons.forEach((icon) => {
    icon.addEventListener("click", toggle);
});

//Feedback
$(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    margin: 25,
    dots: false,
    loop: true,
    nav : true,
    navText : [
        '<i class="bi bi-chevron-left"></i>',
        '<i class="bi bi-chevron-right"></i>'
    ],
    responsive: {
        0:{
            items:1
        },
        992:{
            items:2
        }
    }
});
