// • Создайте HTML-страницу с элементами: изображение, имя фотографа, кнопка "лайк" и счетчик лайков.
// • Используя JavaScript и ваш API-ключ, получите случайное изображение из Unsplash каждый раз, когда пользователь загружает страницу. Обратите внимание, что должно подгружаться всегда случайное изображение, для этого есть отдельная ручка (эндпоинт) у API.
// • Отобразите информацию о фотографе под изображением.
// • Реализуйте функционал "лайка". Каждый раз, когда пользователь нажимает кнопку "лайк", счетчик должен увеличиваться на единицу. Одну фотографию пользователь может лайкнуть только один раз. Также должна быть возможность снять лайк, если ему разонравилась картинка.
// • Добавьте функцию сохранения количества лайков в локальное хранилище, чтобы при новой загрузке страницы счетчик не сбрасывался, если будет показана та же самая картинка.
// • Реализуйте возможность просмотра предыдущих фото с сохранением их в истории просмотров в localstorage.
// • Реализовать все с помощью async/await, без цепочек then.

const client_id = ``; // place your key here

let checkedLikes = false;
let historyPhoto = {
    count: 0,
    history: []
};

if (localStorage.getItem("historyPhoto")) {
    historyPhoto.history = JSON.parse(localStorage.getItem("historyPhoto"))
    historyPhoto.count = historyPhoto.history.length - 1;
}

const photoContentEl = document.getElementById("photo-container");
const btnPrevEl = document.getElementById("prev");
const btnNextEl = document.getElementById("next");

generateDataForRender();

btnPrevEl.addEventListener("click", function () {
    if (historyPhoto.count > 0) {
        historyPhoto.count -= 1;
        render(historyPhoto.history[historyPhoto.count])
    }
});

btnNextEl.addEventListener("click", async function () {
    if (historyPhoto.count < historyPhoto.history.length - 1) {
        historyPhoto.count += 1;
        render(historyPhoto.history[historyPhoto.count])
    } else {
        generateDataForRender();
    }
});

async function generateDataForRender() {
    try {
        const photoData = await getImagesFetch();
        checkedLikes = photoData.liked_by_user;
        historyPhoto.history.push(photoData);
        historyPhoto.count += 1;
        localStorage.setItem('historyPhoto', JSON.stringify(historyPhoto.history));
        render(photoData);
    } catch
        (err) {
        alert(err);
    }
}

async function likesTorgle(id) {
    for (const historyEl of historyPhoto) {
        if (historyEl.id === id) {
            if (historyEl.liked_by_user) {
                historyEl.likes -= 1;
            } else {
                historyEl.likes += 1;
            }
            historyEl.liked_by_user = !historyEl.liked_by_user;
            return historyEl;
        };
    }
}

async function getImagesFetch() {
    try {
        const response = await fetch(`https://api.unsplash.com/photos/random/?client_id=${client_id}`)
        if (!response.ok) {
            throw new Error("Сервер встал")
        }
        return await response.json();
    } catch (err) {
        throw err
    }
}

function render(photo) {
    const html = showPicture(photo);
    photoContentEl.innerHTML = "";
    photoContentEl.insertAdjacentHTML("beforeend", html);
}

function showPicture(photo) {
    return `
            <figure class="photo" data-id="${photo.id}">
              <img src="${photo.urls.regular}" />
              <figcaption>Фото сделал ${photo.user.name}</figcaption>
              <p class="like">Did you like The photo? </p>
              <p class="like-number">Number of likes ${photo.likes}</p>
            </figure>
    `
}

const likeEl = document.querySelector(".like");
likeEl.addEventListener("click", async ({target}) => {
    const fatherEl = target.closest(".photo");
    const likesNumEl = fatherEl.querySelector(".like-number");
    const id = fatherEl.dataset.id;
    const like = fatherEl.querySelector(".like");
    const photo = await likesTorgle(id); 
    checkedLikes = true;
    likesNumEl.innerText = photo.likes;
    if (!photo.liked_by_user) { like.style.color = "#000"; } 
    else if (photo.liked_by_user) { like.style.color = "red"; }
})