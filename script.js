/**
 * script.js
 * Master Global Interactivity Script
 * Vanilla JS, lightweight, high performance, robust error handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize general page transitions/animations
  initializeEntranceAnimations();

  // Mobile Menu Interaction
  initializeMobileMenu();

  // FAQ Accordion Interactivity (Only plays if elements are present on the current page)
  initializeFAQAccordion();

  // Lightbox & Mailerlite Inquiry Form Integration
  initializeLightbox();

  // Form Submissions and Toast Feedback Alerts
  initializeForms();

  // Series sticky sub-navigation highlighting
  initializeGallerySubnav();

  // Fine Art Print Shop and Unified Cart Drawer System
  initializeShopAndCartSystem();
});

/**
 * Entrance and scroll-base animations
 */
function initializeEntranceAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in');
  animatedElements.forEach((el, index) => {
    el.style.animationDelay = `${index * 0.1}s`;
  });
}

/**
 * Responsive Mobile Overlay navigation
 */
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  
  if (!menuToggle || !mobileNavOverlay) return;

  function toggleMenu() {
    const isOpen = menuToggle.classList.toggle('open');
    mobileNavOverlay.classList.toggle('open', isOpen);
    // Control body scroll when menu is actively open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', toggleMenu);

  // Close mobile nav when clicking on a link
  const mobileNavLinks = mobileNavOverlay.querySelectorAll('.nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mobileNavOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Clean Smooth FAQ Accordion interaction
 */
function initializeFAQAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  if (accordionHeaders.length === 0) return;

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.parentElement;
      const accordionBody = header.nextElementSibling;
      const isOpen = parentItem.classList.contains('open');

      // Close all other accordion items in the same section for clean accordion behavior
      const group = parentItem.parentElement;
      const activeItems = group.querySelectorAll('.accordion-item.open');
      activeItems.forEach(activeItem => {
        if (activeItem !== parentItem) {
          activeItem.classList.remove('open');
          activeItem.querySelector('.accordion-body').style.maxHeight = null;
        }
      });

      // Toggle current element
      if (isOpen) {
        parentItem.classList.remove('open');
        accordionBody.style.maxHeight = null;
      } else {
        parentItem.classList.add('open');
        // Set height using scroll height so CSS transition executes smoothly
        accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px';
      }
    });
  });
}

/**
 * Image Lightbox Modal with side-by-side details
 * and automated mailerlite-inquiry-item capture logic
 */
function initializeLightbox() {
  const cards = document.querySelectorAll('.card-item[data-lightbox="true"]');
  const lightboxModal = document.querySelector('.lightbox-modal');
  
  if (!lightboxModal || cards.length === 0) return;

  // Locate the nodes to populate within the split modal
  const lightboxImg = lightboxModal.querySelector('.lightbox-main-img');
  const artCategory = lightboxModal.querySelector('.lightbox-art-category');
  const artTitle = lightboxModal.querySelector('.lightbox-art-title');
  const artMeta = lightboxModal.querySelector('.lightbox-art-meta');
  const artDescription = lightboxModal.querySelector('.lightbox-art-description');
  const artPrice = lightboxModal.querySelector('.lightbox-art-price');
  const inquiryInput = lightboxModal.querySelector('#mailerlite-inquiry-item');

  const closeButton = lightboxModal.querySelector('.lightbox-close');
  const backgroundOverlay = lightboxModal.querySelector('.lightbox-background');

  function openLightbox(card) {
    // Collect data attributes from the card element
    const imgSrc = card.getAttribute('data-img');
    const title = card.getAttribute('data-title');
    const category = card.getAttribute('data-category'); // e.g., 'Selected Painting'
    const dimensions = card.getAttribute('data-dimensions'); // e.g., '36" x 48"'
    const medium = card.getAttribute('data-medium'); // e.g., 'Oil on canvas'
    const price = card.getAttribute('data-price');
    const descText = card.getAttribute('data-desc') || 'Original painting. Highly detailed brushwork and loaded textures.';
    const type = card.getAttribute('data-type') || 'Original'; // e.g., 'Original' or 'Fine Art Print'

    // Populate the modal fields
    if (lightboxImg) {
      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', `${title} - Artwork`);
    }
    if (artCategory) artCategory.textContent = category;
    if (artTitle) artTitle.textContent = title;
    
    if (artMeta) {
      artMeta.textContent = `${medium} • ${dimensions}`;
    }
    if (artDescription) artDescription.textContent = descText;
    if (artPrice) artPrice.textContent = price;

    // JavaScript Automation for MailerLite fields inside details panel
    if (inquiryInput) {
      let inquiryString = `${title} - ${type}`;
      if (card.classList.contains('product-card')) {
        const cleanTitle = title.replace(/\s+Print$/i, '').trim();
        inquiryString = `${cleanTitle} Print - Made to Order`;
      }
      inquiryInput.value = inquiryString;
    }

    // Toggle scroll locking on background and open modal elegantly
    document.body.style.overflow = 'hidden';
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Attach dynamic clicks to the list cards
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Avoid triggering when user clicks secondary interactive buttons/links if any
      if (e.target.closest('.no-lightbox')) return;
      openLightbox(card);
    });
  });

  // Close handlers
  if (closeButton) closeButton.addEventListener('click', closeLightbox);
  if (backgroundOverlay) backgroundOverlay.addEventListener('click', closeLightbox);

  // Keyboard accessibility helper (ESC to close)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/**
 * Handle MailerLite Enquiry form actions client-side
 * and trigger neat visual Toast configurations 
 */
function initializeForms() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect field info
      const name = form.querySelector('[name="name"]')?.value || form.querySelector('[type="text"]')?.value || '';
      const email = form.querySelector('[name="email"]')?.value || form.querySelector('[type="email"]')?.value || '';
      const message = form.querySelector('textarea')?.value || '';
      const itemSubject = form.querySelector('#mailerlite-inquiry-item')?.value || '';

      // Validate basic criteria
      if (!name || !email) {
        showToast('Please provide your name and email address.');
        return;
      }

      // Simulate sending mailerlite parameters securely
      console.log('Sending Inquiry via MailerLite:', {
        name,
        email,
        message,
        artworkSelection: itemSubject || 'General Contact'
      });

      // Show warm, elegant success notice
      let successMessage = 'Thank you. Your message has been sent successfully.';
      if (itemSubject) {
        successMessage = `Inquiry sent for "${itemSubject}". We will contact you shortly.`;
      }
      showToast(successMessage);

      // Perform deep client-side cleanups
      form.reset();

      // If this was inside the lightbox portal, shut down after a short delay
      const lightboxModal = document.querySelector('.lightbox-modal');
      if (lightboxModal && lightboxModal.classList.contains('active') && form.closest('.lightbox-details-box')) {
        setTimeout(() => {
          lightboxModal.classList.remove('active');
          document.body.style.overflow = '';
        }, 1500);
      }
    });
  });
}

/**
 * Trigger an exceptionally elegant, minimalist toast banner
 */
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  // Slide down and clean after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/**
 * Gallery series sub-navigation dynamic viewport tracking highlighting
 */
function initializeGallerySubnav() {
  const subnav = document.querySelector('.series-subnav');
  if (!subnav) return;

  const sections = document.querySelectorAll('.gallery-section');
  const navLinks = document.querySelectorAll('.subnav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -55% 0px', // Captures the active section near the viewport center
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/**
 * Master Shopping Cart and Fine Art Print Store Engine
 */
function initializeShopAndCartSystem() {
  // 1. Dynamic Pricing Updates on Product Cards
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    const sizeSelect = card.querySelector('.size-select');
    const frameSelect = card.querySelector('.frame-select');
    const priceDisplay = card.querySelector('.product-total-price');

    if (!sizeSelect || !priceDisplay) return;

    function updateCardPrice() {
      const basePrices = JSON.parse(sizeSelect.getAttribute('data-base-prices') || '{}');
      const selectedSize = sizeSelect.value;
      const basePrice = basePrices[selectedSize] || 0;

      const selectedFrameOpt = frameSelect ? frameSelect.options[frameSelect.selectedIndex] : null;
      const addPrice = selectedFrameOpt ? parseFloat(selectedFrameOpt.getAttribute('data-add-price') || '0') : 0;

      const totalPrice = basePrice + addPrice;
      priceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
    }

    sizeSelect.addEventListener('change', updateCardPrice);
    if (frameSelect) {
      frameSelect.addEventListener('change', updateCardPrice);
    }

    // Run once at load
    updateCardPrice();
  });

  // 2. Dynamic Categories Filter on the Shop page
  const filterButtons = document.querySelectorAll('.series-subnav [data-filter]');
  if (filterButtons.length > 0) {
    const products = document.querySelectorAll('.product-card');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const activeFilter = btn.getAttribute('data-filter');
        products.forEach(p => {
          const cat = p.getAttribute('data-category-filter');
          if (activeFilter === 'all' || cat === activeFilter) {
            p.style.display = '';
            // trigger subtle fade-in sequence
            p.classList.remove('fade-in');
            void p.offsetWidth; // trigger reflow
            p.classList.add('fade-in');
          } else {
            p.style.display = 'none';
          }
        });
      });
    });
  }

  // 3. Setup Cart State & Inject HTML dynamically on any page
  let cart = [];
  try {
    cart = JSON.parse(localStorage.getItem('ashley_harrington_cart') || '[]');
  } catch (e) {
    cart = [];
  }

  function saveCart() {
    localStorage.setItem('ashley_harrington_cart', JSON.stringify(cart));
    updateCartUI();
  }

  // Inject drawer structure into the bottom of body if not present
  let drawer = document.getElementById('site-cart-drawer');
  let overlay = document.getElementById('cart-drawer-overlay');

  if (!drawer) {
    overlay = document.createElement('div');
    overlay.id = 'cart-drawer-overlay';
    overlay.className = 'cart-drawer-overlay';
    document.body.appendChild(overlay);

    drawer = document.createElement('div');
    drawer.id = 'site-cart-drawer';
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <h2 class="cart-drawer-title font-serif">Your Cart</h2>
        <button class="cart-drawer-close" id="cart-drawer-close-btn" aria-label="Close Cart">
          <svg class="cart-close-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
          Close
        </button>
      </div>
      <div class="cart-drawer-items" id="cart-items-container"></div>
      <div class="cart-drawer-footer" id="cart-footer-container">
        <div class="cart-summary-row">
          <span>Cart Subtotal</span>
          <span class="cart-subtotal-val" id="cart-subtotal-display">$0.00</span>
        </div>
        <p class="cart-shipping-notice">Standard flat-rate shipping ($10) added at purchase. Free shipping on paper orders over $150.</p>
        <form id="cart-checkout-form" class="cart-checkout-form">
          <div class="form-group" style="margin-bottom: 8px;">
            <input type="text" id="checkout-name" name="name" class="form-input" placeholder="Your Name" style="width: 100%;" required>
          </div>
          <div class="form-group" style="margin-bottom: 12px;">
            <input type="email" id="checkout-email" name="email" class="form-input" placeholder="Your Email" style="width: 100%;" required>
          </div>
          <button type="submit" class="btn btn-filled" style="width: 100%; padding: 10px;">Send Print Order Request</button>
        </form>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  const itemsContainer = document.getElementById('cart-items-container');
  const subtotalDisplay = document.getElementById('cart-subtotal-display');
  const checkoutForm = document.getElementById('cart-checkout-form');
  const closeBtn = document.getElementById('cart-drawer-close-btn');

  // Trigger elements (buttons with class .cart-trigger)
  const cartTriggers = document.querySelectorAll('.cart-trigger');

  function openCartDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Register triggers
  cartTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  // Close triggers
  if (closeBtn) closeBtn.addEventListener('click', closeCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);

  // 4. Update the complete Cart interface
  function updateCartUI() {
    // Collect counts
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const counts = document.querySelectorAll('.cart-count');
    counts.forEach(span => {
      span.textContent = totalCount;
    });

    if (!itemsContainer) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-msg">
          <p>Your shopping cart is currently empty.</p>
          <p style="margin-top: 4px; font-size: 0.75rem;">Explore our Print Shop collections to select your reproductions.</p>
        </div>
      `;
      if (subtotalDisplay) subtotalDisplay.textContent = '$0.00';
      if (checkoutForm) checkoutForm.style.display = 'none';
      return;
    }

    if (checkoutForm) checkoutForm.style.display = 'block';

    let subtotal = 0;
    itemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
      const itemCost = item.price * item.qty;
      subtotal += itemCost;

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <img class="cart-item-img" src="${item.img}" alt="${item.title}">
        <div class="cart-item-details">
          <div>
            <h3 class="cart-item-name">${item.title}</h3>
            <p class="cart-item-meta">${item.size} • ${item.frame}</p>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-qty-container">
              <button class="cart-qty-btn decrease-qty-btn" data-index="${index}">−</button>
              <span class="cart-qty-val">${item.qty}</span>
              <button class="cart-qty-btn increase-qty-btn" data-index="${index}">+</button>
            </div>
            <button class="cart-item-remove" data-index="${index}">Delete</button>
            <span class="cart-item-price">$${itemCost.toFixed(2)}</span>
          </div>
        </div>
      `;
      itemsContainer.appendChild(row);
    });

    if (subtotalDisplay) subtotalDisplay.textContent = `$${subtotal.toFixed(2)}`;

    // Quantity modify listeners
    const decBtns = itemsContainer.querySelectorAll('.decrease-qty-btn');
    const incBtns = itemsContainer.querySelectorAll('.increase-qty-btn');
    const delBtns = itemsContainer.querySelectorAll('.cart-item-remove');

    decBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        if (cart[idx].qty > 1) {
          cart[idx].qty--;
        } else {
          cart.splice(idx, 1);
        }
        saveCart();
      });
    });

    incBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        cart[idx].qty++;
        saveCart();
      });
    });

    delBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'));
        cart.splice(idx, 1);
        saveCart();
      });
    });
  }

  // 5. Add to Cart Handler
  const addButtons = document.querySelectorAll('.btn-add-to-cart');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid activating outer overlays if any

      const card = btn.closest('.product-card');
      if (!card) return;

      const title = btn.getAttribute('data-title');
      const img = btn.getAttribute('data-img');
      const sizeSelect = card.querySelector('.size-select');
      const frameSelect = card.querySelector('.frame-select');

      const sizeOptionText = sizeSelect.options[sizeSelect.selectedIndex].text;
      const sizeKey = sizeSelect.value;
      const sizeClean = sizeOptionText.split('—')[0].trim(); // e.g., "12\" x 16\""

      const frameOptionText = frameSelect ? frameSelect.options[frameSelect.selectedIndex].text : 'Unframed';
      const frameClean = frameOptionText.replace(/\(.*\)/, '').trim(); // e.g. "Solid Oak Frame"

      // Base price math
      const basePrices = JSON.parse(sizeSelect.getAttribute('data-base-prices') || '{}');
      const basePrice = basePrices[sizeKey] || 0;
      const addPrice = frameSelect ? parseFloat(frameSelect.options[frameSelect.selectedIndex].getAttribute('data-add-price') || '0') : 0;
      const finalPrice = basePrice + addPrice;

      // Check if duplicate element exists
      const existingIndex = cart.findIndex(item => 
        item.title === title && 
        item.size === sizeClean && 
        item.frame === frameClean
      );

      if (existingIndex !== -1) {
        cart[existingIndex].qty++;
      } else {
        cart.push({
          title: title,
          img: img,
          size: sizeClean,
          frame: frameClean,
          price: finalPrice,
          qty: 1
        });
      }

      saveCart();
      showToast(`Added prints of "${title}" to your cart.`);
      
      // Auto open cart drawer to display results
      openCartDrawer();
    });
  });

  // 6. Checkout Order Request Submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('checkout-name').value;
      const clientEmail = document.getElementById('checkout-email').value;

      if (!clientName || !clientEmail) return;

      // Map cart items to metadata
      const itemsString = cart.map(item => `[${item.qty}x] ${item.title} (Size: ${item.size}, Frame: ${item.frame})`).join('\n');
      const cartSummaryMessage = `User Placed Print Order:\nName: ${clientName}\nEmail: ${clientEmail}\nItems:\n${itemsString}`;

      console.log('Sending Custom print order via simulated MailerLite:', cartSummaryMessage);

      // Trigger beautiful order toast
      showToast(`Thank you, ${clientName}! Your print order request has been received.`);

      // Reset cart completely
      cart = [];
      saveCart();

      // Close drawer with delay
      setTimeout(() => {
        closeCartDrawer();
        checkoutForm.reset();
      }, 1500);
    });
  }

  // Sync state initially
  updateCartUI();
}
