// We make our toggle navigation reactive
const list = document.querySelectorAll('.list');
function activeLink(){
    list.forEach((item) =>
    item.classList.remove('active'));
    this.classList.add('active')
} 
    list.forEach((item) =>
    item.addEventListener('click',activeLink));
// End of toggle

//Slides of single article page
const galleryContainer = document.querySelector('.gallery-container');
    const galleryImages = document.querySelectorAll('.gallery-image');

    // Dynamically determine the total number of pages based on the number of images
    const totalPages = galleryImages.length;

    // Scroll event listener to determine the current visible image
    galleryContainer.addEventListener('scroll', () => {
      const scrollPosition = galleryContainer.scrollLeft;
      const imageWidth = galleryContainer.clientWidth;
      const currentPage = Math.round(scrollPosition / imageWidth) + 1;
      updateImageNumber(currentPage, totalPages);
    });

    // Function to update the image number at the bottom center
    function updateImageNumber(currentPage, totalPages) {
      const imageNumbers = document.querySelectorAll('.image-number');
      imageNumbers.forEach((number) => {
        number.textContent = `${currentPage} / ${totalPages}`;
      });
    }
//End of slides

document.querySelectorAll('.button').forEach(button => button.addEventListener('click', e => {
    if(!button.classList.contains('loading')) {

        button.classList.add('loading');

        setTimeout(() => button.classList.remove('loading'), 3700);

    }
    e.preventDefault();
}));
