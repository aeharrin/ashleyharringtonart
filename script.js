/**
 * script.js
 * Master Global Interactivity Script
 * Vanilla JS, lightweight, high performance, robust error handling
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize general page transitions/animations
  initializeEntranceAnimations();

  // Scroll detection for sticky navigation header
  initializeScrollHeader();

  // Mobile Menu Interaction
  initializeMobileMenu();

  // FAQ Accordion Interactivity (Only plays if elements are present on the current page)
  initializeFAQAccordion();

  // Lightbox & Mailerlite Inquiry Form Integration
  initializeLightbox();

  // Inline Cinematic Zoom for gallery painting images
  initializeInlineZoom();

  // Global Inquire Modal Overlay popup
  initializeInquiryModal();

  // Form Submissions and Toast Feedback Alerts
  initializeForms();

  // Series sticky sub-navigation highlighting
  initializeGallerySubnav();
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
 * Handle scroll states for header border toggling
 */
function initializeScrollHeader() {
  const siteHeader = document.getElementById('site-header');
  if (!siteHeader) return;

  const handleScroll = () => {
    if (window.scrollY > 5) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  };

  // Run initial state check in case page was refreshed while scrolled
  handleScroll();

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Responsive Mobile Overlay navigation
 */
function initializeMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  
  if (!menuToggle || !mobileNavOverlay) return;

  // Create a beautiful click-outside backdrop dynamically
  let backdrop = document.querySelector('.mobile-nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function toggleMenu() {
    const isOpen = menuToggle.classList.toggle('open');
    mobileNavOverlay.classList.toggle('open', isOpen);
    backdrop.classList.toggle('open', isOpen);
    // Control body scroll when menu is actively open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  menuToggle.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', toggleMenu);

  // Close mobile nav when clicking on a link
  const mobileNavLinks = mobileNavOverlay.querySelectorAll('.nav-link');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      mobileNavOverlay.classList.remove('open');
      backdrop.classList.remove('open');
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
 * Image Lightbox Modal - Simplified purely visual zoom Study
 */
function initializeLightbox() {
  const cards = document.querySelectorAll('.card-item[data-lightbox="true"]');
  const lightboxModal = document.querySelector('.lightbox-modal');
  
  if (!lightboxModal || cards.length === 0) return;

  const lightboxImg = lightboxModal.querySelector('.lightbox-main-img');
  const closeButton = lightboxModal.querySelector('.lightbox-close');
  const backgroundOverlay = lightboxModal.querySelector('.lightbox-background');

  function openLightbox(card) {
    const imgSrc = card.getAttribute('data-img');
    const title = card.getAttribute('data-title') || 'Artwork';

    if (lightboxImg) {
      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', `${title} - Artwork Zoomed`);
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
      // Avoid triggering when user clicks secondary interactive buttons/links/actions (e.g., Inquire button)
      if (e.target.closest('.no-lightbox') || e.target.closest('.btn') || e.target.closest('.inquire-trigger')) return;
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
 * Inline Cinematic Zoom logic for vertical images
 */
function initializeInlineZoom() {
  const artworkImages = document.querySelectorAll('.artwork-vertical-list .card-frame img');
  if (artworkImages.length === 0) return;

  let activeZoomedImg = null;
  let initialScrollY = 0;

  function zoomIn(img) {
    if (activeZoomedImg && activeZoomedImg !== img) {
      zoomOut(activeZoomedImg);
    }
    img.classList.add('inline-zoomed');
    activeZoomedImg = img;
    initialScrollY = window.scrollY;
  }

  function zoomOut(img) {
    if (!img) return;
    img.classList.remove('inline-zoomed');
    if (activeZoomedImg === img) {
      activeZoomedImg = null;
    }
  }

  // Handle image clicks
  artworkImages.forEach(img => {
    img.addEventListener('click', (e) => {
      e.stopPropagation(); // Stop propagation to prevent document click handler from instantly closing it
      
      if (img.classList.contains('inline-zoomed')) {
        zoomOut(img);
      } else {
        zoomIn(img);
      }
    });
  });

  // Handle clicking outside to reset zoom
  document.addEventListener('click', (e) => {
    if (activeZoomedImg) {
      if (!e.target.closest('.card-frame')) {
        zoomOut(activeZoomedImg);
      }
    }
  });

  // Handle scroll detection for smart automatic zoom out
  window.addEventListener('scroll', () => {
    if (activeZoomedImg) {
      const diff = Math.abs(window.scrollY - initialScrollY);
      // Auto-collapse if the visitor scrolls more than 150px (smooth and intuitive)
      if (diff > 150) {
        zoomOut(activeZoomedImg);
      }
    }
  }, { passive: true });
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
      const itemSubject = form.querySelector('#mailerlite-inquiry-item')?.value || form.querySelector('select')?.value || '';

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

      // If this was inside the global inquiry modal, shut down after a short delay
      const inquiryModal = document.querySelector('.inquiry-modal');
      if (inquiryModal && inquiryModal.classList.contains('active')) {
        setTimeout(() => {
          inquiryModal.classList.remove('active');
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
 * Global Inquire Modal logic and custom triggers
 */
function initializeInquiryModal() {
  const inquiryModal = document.querySelector('.inquiry-modal');
  if (!inquiryModal) return;

  const triggers = document.querySelectorAll('.inquire-trigger');
  const closeBtn = inquiryModal.querySelector('.inquiry-modal-close');
  const backgroundOverlay = inquiryModal.querySelector('.inquiry-modal-background');
  const artworkSelect = inquiryModal.querySelector('#global-inquiry-artwork');

  function openModal() {
    document.body.style.overflow = 'hidden';
    inquiryModal.classList.add('active');
  }

  function closeModal() {
    inquiryModal.classList.remove('active');
    
    // Check if other components are Locking Scroll before unlocking the body
    const isMobileNavOpen = document.querySelector('.mobile-nav-overlay.open');
    const isLightboxActive = document.querySelector('.lightbox-modal.active');
    
    if (!isMobileNavOpen && !isLightboxActive) {
      document.body.style.overflow = '';
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();

      // Shut down any active mobile sidebar navigation overlay on click
      const menuToggle = document.querySelector('.menu-toggle');
      const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
      const backdrop = document.querySelector('.mobile-nav-backdrop');
      if (menuToggle && menuToggle.classList.contains('open')) {
        menuToggle.classList.remove('open');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
      }
      
      // Auto-tag artwork selection in select dropdown list if present
      const cardParent = trigger.closest('.card-item');
      if (cardParent && artworkSelect) {
        const title = cardParent.getAttribute('data-title');
        if (title) {
          let found = false;
          for (let i = 0; i < artworkSelect.options.length; i++) {
            if (artworkSelect.options[i].value.toLowerCase().includes(title.toLowerCase())) {
              artworkSelect.selectedIndex = i;
              found = true;
              break;
            }
          }
          if (!found) {
            artworkSelect.value = 'General Inquiry';
          }
        }
      } else if (artworkSelect) {
        artworkSelect.value = 'General Inquiry';
      }

      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backgroundOverlay) backgroundOverlay.addEventListener('click', closeModal);

  // Close handlers on click and Escape key presses
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && inquiryModal.classList.contains('active')) {
      closeModal();
    }
  });
}

