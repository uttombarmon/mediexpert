const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

const appointmentForm = document.querySelector("#appointment-form");

if (appointmentForm) {
  const dateInput = appointmentForm.querySelector("#appointment-date");
  const now = new Date();
  const today = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
  dateInput.min = today;

  appointmentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const feedback = document.querySelector("#form-feedback");
    feedback.textContent =
      "Demo only. No appointment request has been sent or stored.";
    appointmentForm.reset();
    dateInput.min = today;
  });
}

const productSearch = document.querySelector("#product-search");
const productCards = [...document.querySelectorAll(".product-card")];
const emptySearch = document.querySelector("#empty-search");
const categoryFilters = [...document.querySelectorAll("[data-category-filter]")];
let selectedCategory = "all";

const filterProducts = () => {
  const query = productSearch.value.trim().toLowerCase();
  let visibleCount = 0;

  productCards.forEach((card) => {
    const matchesSearch = card.dataset.product.includes(query);
    const matchesCategory = selectedCategory === "all" || card.dataset.category === selectedCategory;
    card.hidden = !(matchesSearch && matchesCategory);
    if (!card.hidden) visibleCount += 1;
  });

  emptySearch.hidden = visibleCount > 0;
};

if (productSearch) {
  productSearch.addEventListener("input", filterProducts);
  categoryFilters.forEach((filter) => {
    filter.addEventListener("click", () => {
      selectedCategory = filter.dataset.categoryFilter;
      categoryFilters.forEach((item) => {
        const isSelected = item === filter;
        item.classList.toggle("category-active", isSelected);
        item.setAttribute("aria-pressed", String(isSelected));
      });
      filterProducts();
    });
  });
}

const cartCount = document.querySelector("[data-cart-count]");
const cartToast = document.querySelector("#cart-toast");

if (cartCount) {
  const storageKey = "mediexpert-cart-count";
  const savedCount = Number.parseInt(localStorage.getItem(storageKey) || "0", 10);
  let count = Number.isFinite(savedCount) && savedCount >= 0 ? savedCount : 0;
  const updateCartLabel = () => {
    const itemLabel = count === 1 ? "item" : "items";
    cartCount.closest("a")?.setAttribute(
      "aria-label",
      `Demo bag, ${count} ${itemLabel}`,
    );
  };
  cartCount.textContent = String(count);
  updateCartLabel();

  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      count += 1;
      cartCount.textContent = String(count);
      localStorage.setItem(storageKey, String(count));
      updateCartLabel();
      cartToast.textContent = `${button.dataset.name} added to demo bag. No purchase will be made.`;
      cartToast.classList.add("visible");
      window.clearTimeout(cartToast.timeoutId);
      cartToast.timeoutId = window.setTimeout(() => {
        cartToast.classList.remove("visible");
      }, 2200);
    });
  });
}