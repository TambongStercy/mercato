const modal1 = document.querySelector(".modal.mody");
const modal2 = document.querySelector(".modal.delt");
const uId = modal1.querySelector("#update-id");
const dId = modal2.querySelector("#delete-id");
const title = modal1.querySelector(".sub-title");
const Pname = modal1.querySelector("#text");
const file = modal1.querySelector("input[type='file']");
const image = modal1.querySelector(".my-img");
const quantity = modal1.querySelector(".num-qty");
const price = modal1.querySelector(".num-price");
const color = modal1.querySelector("input[type='color']");


document.querySelectorAll(".update").forEach((btn)=>{
    btn.addEventListener("click",(e)=>{

        document.querySelector(".form-modal").setAttribute("action","/update");

        const tId = e.target.closest("tr").querySelector(".prdt-id");
        const tImage    = e.target.closest("tr").querySelector(".prdt-image img");
        const tName     = e.target.closest("tr").querySelector(".prdt-name");
        const tColor    = e.target.closest("tr").querySelector(".prdt-color .item-color");
        const tPrice    = e.target.closest("tr").querySelector(".prdt-price");
        const tQuantity = e.target.closest("tr").querySelector(".prdt-quantity");
         

        uId.value = tId.textContent;
        title.textContent = "Update product";
        Pname.value = tName.textContent;
        image.src = tImage.src;
        price.value = tPrice.textContent;
        quantity.value = tQuantity.textContent;

        const RGBvalue = getComputedStyle(tColor).backgroundColor;
        const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`;
        const hex = rgb2hex(RGBvalue);

        color.value = hex;

        // const fileInput = document.querySelector('input[type="file"]');

        // // Create a new File object
        // const myFile = new File(tImage.src);

        // // Now let's create a DataTransfer to get a FileList
        // const dataTransfer = new DataTransfer();
        // dataTransfer.items.add(myFile);
        // fileInput.files = dataTransfer.files;

        // // Help Safari out
        // if (fileInput.webkitEntries.length) {
        //     fileInput.dataset.file = `${dataTransfer.files[0].name}`;
        // }

        modal1.classList.add("active-modal");
    });
})



document.querySelectorAll(".delete").forEach((btn)=>{
    btn.addEventListener("click",(e)=>{
        const tId = e.target.closest("tr").querySelector(".prdt-id");
        dId.value = tId.textContent;

        modal2.classList.add("active-modal");
    });
    // console.log(document.querySelector("#my-img").value);
})

document.querySelector(".no").addEventListener("click",()=>{
    emptyId();
    modal1.classList.remove("active-modal");
});

document.querySelector(".modal-close").addEventListener("click",()=>{
    emptyId();
    modal1.classList.remove("active-modal");
});

document.querySelector(".camera").addEventListener("click",()=>{
    document.querySelector("#my-img").click();
});

document.querySelector(".add-btn").addEventListener("click",(e)=>{
    document.querySelector(".form-modal").setAttribute("action","/add");

    title.textContent = "Add new product";
    Pname.value = "";
    price.value = 2500;
    quantity.value = 10;

    image.src = "/img/defaultL.png"


    modal1.classList.add("active-modal");
});

modal1.addEventListener("click",(e)=>{
    if(e.target.classList[0]=="modal"){
        emptyId();
        modal1.classList.remove("active-modal");
    }
})

modal2.addEventListener("click",(e)=>{
    if(e.target.classList[0]=="modal"){
        emptyId();
        modal2.classList.remove("active-modal");
    }
})


function uploadAvatar(e){
    const file = e.target.files[0];

    console.log(document.querySelector("#my-img").value);

    const img = URL.createObjectURL(file);

    image.setAttribute("src",img);
    
}

function emptyId(){
    dId.value = "";
    uId.value = "";
}