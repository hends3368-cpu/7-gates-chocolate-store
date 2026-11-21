// السلة اللي اتحفظت من الصفحة الرئيسية
let cart = JSON.parse(localStorage.getItem("cart_items")) || [];
const delivery = 30; // مصاريف التوصيل (غيريها براحتك)
const whatsappNumber = "201065372907"; // رقم واتساب المتجر

const cart_items = document.getElementById("cart_items");
const empty_cart = document.getElementById("empty_cart");
const checkout_wrapper = document.getElementById("checkout_wrapper");
const order_done = document.getElementById("order_done");
const cart_count = document.querySelector(".cart-count");

function saveCart() {
  localStorage.setItem("cart_items", JSON.stringify(cart));
}

function showCart() {
  let count = 0;
  let subtotal = 0;
  cart_items.innerHTML = "";

  cart.forEach(function (item, index) {
    count += item.qty;
    subtotal += item.price * item.qty;
    cart_items.innerHTML += `
      <div class="cart_item">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart_item_info">
          <h4>${item.name}</h4>
          <p>${item.price} ج.م</p>
          <div class="cart_qty">
            <button type="button" onclick="changeQty(${index}, -1)">-</button>
            <span>${item.qty}</span>
            <button type="button" onclick="changeQty(${index}, 1)">+</button>
          </div>
        </div>
        <div class="cart_item_total">${item.price * item.qty} ج.م</div>
        <button type="button" class="remove_btn" onclick="removeItem(${index})" title="حذف"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
  });

  cart_count.innerText = count;

  if (cart.length === 0) {
    empty_cart.style.display = "block";
    checkout_wrapper.style.display = "none";
    return;
  }
  empty_cart.style.display = "none";
  checkout_wrapper.style.display = "grid";

  document.getElementById("subtotal").innerText = subtotal + " ج.م";
  document.getElementById("delivery").innerText = delivery + " ج.م";
  document.getElementById("total").innerText = subtotal + delivery + " ج.م";
}

function changeQty(index, step) {
  cart[index].qty += step;
  if (cart[index].qty < 1) cart[index].qty = 1;
  if (cart[index].qty > 7) cart[index].qty = 7;
  saveCart();
  showCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  showCart();
}

// تأكيد الطلب
document.getElementById("checkout_form").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("full_name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const city = document.getElementById("city").value;
  const address = document.getElementById("address").value.trim();
  const notes = document.getElementById("notes").value.trim();
  const pay = document.querySelector('input[name="pay"]:checked').value;
  const total = document.getElementById("total").innerText;
  const order_number = "7G-" + Math.floor(Math.random() * 90000 + 10000);

  // رسالة الطلب على واتساب
  let message = "طلب جديد من 7 Gates\nرقم الطلب: " + order_number + "\n\n";
  cart.forEach(function (item) {
    message += "- " + item.name + " × " + item.qty + " = " + item.price * item.qty + " ج.م\n";
  });
  message += "\nالإجمالي مع التوصيل: " + total;
  message += "\nطريقة الدفع: " + pay;
  message += "\n\nالاسم: " + name + "\nالموبايل: " + phone + "\nالعنوان: " + city + " - " + address;
  if (notes) message += "\nملاحظات: " + notes;
  window.open("https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message), "_blank");

  document.getElementById("order_text").innerText =
    "شكراً يا " + name + "! رقم طلبك " + order_number + "، والإجمالي " + total + " (" + pay + "). اتفتحلك واتساب برسالة فيها تفاصيل الطلب، ابعتها عشان نأكد معاك ميعاد التوصيل.";

  cart = [];
  saveCart();
  cart_count.innerText = 0;
  checkout_wrapper.style.display = "none";
  order_done.style.display = "block";
  window.scrollTo(0, 0);
});

showCart();
