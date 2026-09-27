## Qısa izah

```js
const carousel = document.querySelector(".carousel");
const dots = document.querySelectorAll(".dot");
let currentSlide = 0;
```

- carousel elementini tapır
- dot düymələrini seçir
- hazırkı slaydın nömrəsini saxlayır

```js
function showSlide(index) {
  currentSlide = index;
  carousel.style.transform = `translateX(-${index * 100}%)`;
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === index);
  });
}
```

- seçilmiş slaydı göstərir
- carouselı sola çəkir
- aktiv dot-u işarələyir

```js
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => showSlide(index));
});
```

- hər dot-a klik eventini bağlayır
- klikdə uyğun slayd açılır

```js
const movieCards = document.querySelectorAll(".movie-card");
let isDrag = false;
```

- bütün film kartlarını tapır
- sürükləmə vəziyyətini izləmir

```js
movieCard.addEventListener("pointerdown", () => (isDrag = false));
movieCard.addEventListener("pointermove", () => (isDrag = true));
```

- istifadəçi kartı tutduqda sürükləmə vəziyyətini reset edir
- hərəkət baş verəndə “drag” flag-ini true edir

```js
movieCard.addEventListener("click", () => {
  if (!isDrag) {
    window.location.href = "./detail-1/details-1.html";
  }
});

- yalnız normal klikdə keçid edir
- drag edildisə keçid etməz

```js
showSlide(0);
setInterval(() => {
  showSlide((currentSlide + 1) % dots.length);
}, 5000);
```

- ilk slayd açılır
- hər 5 saniyədə avtomatik növbəti slayd göstərilir

İstəsən mən bunu daha “professional” səviyyədə, yəni real project comment style ilə də yaza bilərəm.