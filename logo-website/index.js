// Sidebar open/close
const sidebar = document.querySelector(".sidebar");
const backdrop = document.querySelector(".sidebar-backdrop");
const allCategoriesBtn = document.querySelector(".all-categories-btn");
const mobileToggle = document.querySelector(".mobile-menu-toggle");

function openSidebar() {
  sidebar.classList.add("active");
  backdrop.classList.add("active");
}

function closeSidebar() {
  sidebar.classList.remove("active");
  backdrop.classList.remove("active");
}

if (allCategoriesBtn) {
  allCategoriesBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("active");
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (mobileToggle) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("active");
    if (isOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });
}

if (backdrop) {
  backdrop.addEventListener("click", closeSidebar);
}

// Close sidebar on ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeSidebar();
  }
});

// Expandable categories
document.querySelectorAll(".category-group").forEach((group) => {
  const header = group.querySelector(".category-item");
  const sublist = group.querySelector(".subcategory-list");

  header.addEventListener("click", () => {
    const expanded = group.classList.contains("expanded");

    if (expanded) {
      group.classList.remove("expanded");
      header.classList.remove("expanded");
      sublist.style.maxHeight = "0";
    } else {
      group.classList.add("expanded");
      header.classList.add("expanded");
      sublist.style.maxHeight = sublist.scrollHeight + "px";
    }
  });
});
