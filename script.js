// السلة (بتتحفظ في المتصفح عشان صفحة الدفع تقراها)
let cart = JSON.parse(localStorage.getItem("cart_items")) || [];
const cart_count = document.querySelector(".cart-count");
const toast = document.getElementById("toast");

function updateCartCount() {
  let count = 0;
  cart.forEach(function (item) {
    count += item.qty;
  });
  cart_count.innerText = count;
  localStorage.setItem("cart_items", JSON.stringify(cart));
}

function showToast(text) {
  toast.innerHTML = text;
  toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(function () {
    toast.classList.remove("show");
  }, 3000);
}

// زرار + و - للكمية، وزرار أضف إلى السلة
document.querySelectorAll(".product").forEach(function (product) {
  const qty = product.querySelector(".quantity");
  const mins = product.querySelector(".qty_count_mins");
  const add = product.querySelector(".qty_count_add");
  const add_to_cart = product.querySelector(".add_to_cart");
  const name = product.querySelector(".product_name a").innerText;
  const price = parseFloat(product.querySelector(".product_price a").innerText);
  const img = product.querySelector(".product_img img").getAttribute("src");

  mins.addEventListener("click", function () {
    if (Number(qty.value) > Number(qty.min)) qty.value = Number(qty.value) - 1;
  });

  add.addEventListener("click", function () {
    if (Number(qty.value) < Number(qty.max)) qty.value = Number(qty.value) + 1;
  });

  add_to_cart.addEventListener("click", function () {
    const item = cart.find(function (i) {
      return i.name === name;
    });
    if (item) {
      item.qty += Number(qty.value);
    } else {
      cart.push({ name: name, price: price, img: img, qty: Number(qty.value) });
    }
    updateCartCount();
    showToast("تم إضافة " + qty.value + " من " + name + ' للسلة <a href="checkout.html">إتمام الشراء ←</a>');
    qty.value = 1;
  });
});

// فلترة المنتجات بالقسم
const products = document.querySelectorAll(".product");
const no_result = document.querySelector(".no_result");

function filterProducts(section, word) {
  let shown = 0;
  products.forEach(function (product) {
    const name = product.querySelector(".product_name a").innerText.toLowerCase();
    const sameSection = section === "all" || product.dataset.section === section;
    const sameWord = name.includes(word.toLowerCase());
    if (sameSection && sameWord) {
      product.style.display = "";
      shown++;
    } else {
      product.style.display = "none";
    }
  });
  no_result.style.display = shown === 0 ? "block" : "none";
}

document.querySelectorAll(".section a").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelectorAll(".section a").forEach(function (l) {
      l.classList.remove("active");
    });
    link.classList.add("active");
    filterProducts(link.dataset.section, "");
  });
});

// لما تدوس على اسم القسم جوه الكارت
document.querySelectorAll(".section_link").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const section = link.innerText.trim();
    document.querySelector('.section a[data-section="' + section + '"]').click();
  });
});

// البحث
document.getElementById("search_form").addEventListener("submit", function (e) {
  e.preventDefault();
  const word = document.querySelector(".search_input").value.trim();
  document.querySelectorAll(".section a").forEach(function (l) {
    l.classList.remove("active");
  });
  document.querySelector('.section a[data-section="all"]').classList.add("active");
  filterProducts("all", word);
  document.getElementById("products").scrollIntoView();
});

updateCartCount();
