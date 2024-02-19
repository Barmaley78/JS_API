const btnPrevImg = document.querySelector('.prev-img');
const btnNextImg = document.querySelector('.next-img');
const container = document.querySelector('.container');
const currentImage = document.querySelector('.current-image');

let index = 0;

btnPrevImg.addEventListener("click", () => {
   if (index === 0) {
      index = currentImage.children.length;
   }
   index--;
   wiewImg(index);
})

btnNextImg.addEventListener("click", () => {
   if (index === currentImage.children.length - 1) {
      index = -1;
   }
   index++;
   wiewImg(index);
})

const wiewImg = (index) => {
   container.children[0].src = currentImage.children.item(index).src;
}

for (let i = 0; i < currentImage.children.length; i++) {
   currentImage.children[i].addEventListener("click", (el) => {
      container.children[0].src = el.target.src;
      index = i;
   })
}