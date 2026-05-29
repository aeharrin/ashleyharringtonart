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
      const inquiryString = `${title} - ${type}`;
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
