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
 * Supporting Desktop click-hold-drag and Mobile fullscreen-pinch-pan
 */
function initializeInlineZoom() {
  const artworkImages = document.querySelectorAll('.artwork-vertical-list .card-frame img');
  if (artworkImages.length === 0) return;

  let activeZoomedImg = null;
  let initialScrollY = 0;

  // Desktop drag states
  let isDragging = false;
  let hasMoved = false;
  let startX = 0;
  let startY = 0;
  let translateX = 0;
  let translateY = 0;
  const desktopScale = 2.4; // Advanced high detail scale level

  function zoomIn(img) {
    if (activeZoomedImg && activeZoomedImg !== img) {
      zoomOut(activeZoomedImg);
    }
    
    const parentFrame = img.closest('.card-frame');
    if (parentFrame) {
      parentFrame.classList.add('zoomed-parent');
    }
    
    img.classList.add('inline-zoomed');
    img.style.transform = `scale(${desktopScale})`;
    activeZoomedImg = img;
    initialScrollY = window.scrollY;
    translateX = 0;
    translateY = 0;
    hasMoved = false;
  }

  function zoomOut(img) {
    if (!img) return;
    img.classList.remove('inline-zoomed');
    img.classList.remove('dragging');
    img.style.transform = '';
    img.style.cursor = '';
    
    const parentFrame = img.closest('.card-frame');
    if (parentFrame) {
      parentFrame.classList.remove('zoomed-parent');
    }
    
    if (activeZoomedImg === img) {
      activeZoomedImg = null;
    }
    isDragging = false;
    hasMoved = false;
    translateX = 0;
    translateY = 0;
  }

  // Handle images interaction
  artworkImages.forEach(img => {
    // Prevent browser standard image drag ghost
    img.addEventListener('dragstart', (e) => e.preventDefault());

    img.addEventListener('click', (e) => {
      e.stopPropagation();
      
      const isMobileDevice = window.matchMedia("(max-width: 768px)").matches || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      
      if (isMobileDevice) {
        // Mobile Fullscreen Pinch and Move zoom modal
        openMobileFullscreen(img);
      } else {
        // Desktop zoom toggle
        if (img.classList.contains('inline-zoomed')) {
          if (!hasMoved) {
            zoomOut(img);
          }
        } else {
          zoomIn(img);
        }
      }
    });

    // Desktop Drag handling with Pointer/Mouse events
    img.addEventListener('mousedown', (e) => {
      if (!img.classList.contains('inline-zoomed')) return;
      
      const isMobileDevice = window.matchMedia("(max-width: 768px)").matches || ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      if (isMobileDevice) return;

      e.preventDefault();
      isDragging = true;
      hasMoved = false;
      img.classList.add('dragging');
      img.style.transition = 'none'; // Snappy performance response during movement
      
      startX = e.clientX - translateX;
      startY = e.clientY - translateY;
    });
  });

  // Global mousemove inside viewport to handle drag-panning
  window.addEventListener('mousemove', (e) => {
    if (!isDragging || !activeZoomedImg) return;
    
    const currentX = e.clientX - startX;
    const currentY = e.clientY - startY;
    
    const container = activeZoomedImg.closest('.card-frame');
    if (!container) return;
    
    const originalWidth = activeZoomedImg.offsetWidth;
    const originalHeight = activeZoomedImg.offsetHeight;
    
    const scaledWidth = originalWidth * desktopScale;
    const scaledHeight = originalHeight * desktopScale;
    
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Bounds limit relative to centered position
    const maxTranslateX = Math.max(0, (scaledWidth - containerWidth) / 2);
    const maxTranslateY = Math.max(0, (scaledHeight - containerHeight) / 2);
    
    const deltaX = Math.abs(currentX - translateX);
    const deltaY = Math.abs(currentY - translateY);
    if (deltaX > 4 || deltaY > 4) {
      hasMoved = true;
    }
    
    translateX = Math.max(-maxTranslateX, Math.min(maxTranslateX, currentX));
    translateY = Math.max(-maxTranslateY, Math.min(maxTranslateY, currentY));
    
    activeZoomedImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${desktopScale})`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    if (activeZoomedImg) {
      activeZoomedImg.classList.remove('dragging');
      activeZoomedImg.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    }
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
      if (diff > 180) { // Seamless and smooth auto-collapse
        zoomOut(activeZoomedImg);
      }
    }
  }, { passive: true });

  // Mobile Fullscreen Pinch/Pan Zoomer implementation
  function openMobileFullscreen(img) {
    const cardItem = img.closest('.card-item');
    const title = cardItem ? cardItem.dataset.title || '' : '';
    const category = cardItem ? cardItem.dataset.category || '' : '';
    const dimensions = cardItem ? cardItem.dataset.dimensions || '' : '';
    const medium = cardItem ? cardItem.dataset.medium || '' : '';
    
    const metaParts = [];
    if (category) metaParts.push(category);
    if (dimensions) metaParts.push(dimensions);
    if (medium) metaParts.push(medium);
    const metaText = metaParts.join('  •  ');

    // Create modal elements
    const modal = document.createElement('div');
    modal.className = 'mobile-fullscreen-viewer';
    
    // Styling the container beautifully
    Object.assign(modal.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(10, 11, 12, 0.98)',
      zIndex: '99999',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      touchAction: 'none'
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    `;
    
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '20px',
      right: '25px',
      width: '46px',
      height: '46px',
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      border: 'none',
      borderRadius: '50%',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: '100001',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      outline: 'none',
      webkitTapHighlightColor: 'transparent'
    });

    // Details panel
    const captionPanel = document.createElement('div');
    Object.assign(captionPanel.style, {
      position: 'absolute',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '85%',
      textAlign: 'center',
      color: '#ffffff',
      zIndex: '100001',
      pointerEvents: 'none'
    });

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    Object.assign(titleEl.style, {
      fontFamily: 'Playfair Display, Georgia, serif',
      fontSize: '1.2rem',
      fontWeight: '400',
      margin: '0 0 4px 0',
      letterSpacing: '0.01em',
      color: '#ffffff',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
    });

    const metaEl = document.createElement('p');
    metaEl.textContent = metaText;
    Object.assign(metaEl.style, {
      fontFamily: 'Inter, sans-serif',
      fontSize: '0.75rem',
      margin: '0',
      color: '#b0b5bc',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      textShadow: '0 1px 3px rgba(0,0,0,0.5)'
    });

    captionPanel.appendChild(titleEl);
    captionPanel.appendChild(metaEl);

    // Image viewport container
    const viewport = document.createElement('div');
    Object.assign(viewport.style, {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative'
    });

    const clonedImg = document.createElement('img');
    clonedImg.src = img.src;
    clonedImg.alt = title;
    
    Object.assign(clonedImg.style, {
      maxWidth: '92%',
      maxHeight: '78%',
      objectFit: 'contain',
      userSelect: 'none',
      webkitUserDrag: 'none',
      transformOrigin: 'center center',
      boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
    });

    viewport.appendChild(clonedImg);
    modal.appendChild(closeBtn);
    modal.appendChild(viewport);
    modal.appendChild(captionPanel);

    // Advanced Touch Gestures State variables
    let scale = 1;
    let translateX = 0;
    let translateY = 0;
    let isPinch = false;
    let startDist = 0;
    let startScale = 1;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;

    viewport.addEventListener('touchstart', (e) => {
      clonedImg.style.transition = 'none'; // responsive tracking
      if (e.touches.length === 1) {
        isPinch = false;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
      } else if (e.touches.length === 2) {
        isPinch = true;
        startScale = scale;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        startDist = Math.sqrt(dx * dx + dy * dy);
        
        lastX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        lastY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      }
    }, { passive: false });

    viewport.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Lock mobile screen background scrolls
      
      if (e.touches.length === 1 && !isPinch) {
        // Drag to pan
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;

        if (scale <= 1.05) {
          translateX = 0;
          translateY = 0;
        } else {
          // Dynamic clamping of pan relative to scaled size
          const parentRect = viewport.getBoundingClientRect();
          const imgRect = clonedImg.getBoundingClientRect();
          const maxTX = Math.max(0, (imgRect.width - parentRect.width) / 2);
          const maxTY = Math.max(0, (imgRect.height - parentRect.height) / 2);
          
          translateX = Math.max(-maxTX, Math.min(maxTX, translateX));
          translateY = Math.max(-maxTY, Math.min(maxTY, translateY));
        }
        applyMobileTransform();
      } else if (e.touches.length === 2) {
        // Pinch-to-zoom
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        scale = Math.max(1, Math.min(4.5, startScale * (dist / startDist)));

        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        if (scale > 1.05) {
          translateX += (midX - lastX) * 0.4;
          translateY += (midY - lastY) * 0.4;
        } else {
          translateX = 0;
          translateY = 0;
        }

        lastX = midX;
        lastY = midY;
        applyMobileTransform();
      }
    }, { passive: false });

    viewport.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        if (scale <= 1.05) {
          scale = 1;
          translateX = 0;
          translateY = 0;
          clonedImg.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
          applyMobileTransform();
        } else {
          // Clamp bounds on finger release
          const parentRect = viewport.getBoundingClientRect();
          const imgRect = clonedImg.getBoundingClientRect();
          const maxTX = Math.max(0, (imgRect.width - parentRect.width) / 2);
          const maxTY = Math.max(0, (imgRect.height - parentRect.height) / 2);
          
          translateX = Math.max(-maxTX, Math.min(maxTX, translateX));
          translateY = Math.max(-maxTY, Math.min(maxTY, translateY));
          
          clonedImg.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
          applyMobileTransform();
        }
      } else if (e.touches.length === 1) {
        // Transiting from 2 fingers to 1 finger
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
        isPinch = false;
      }
    });

    function applyMobileTransform() {
      clonedImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    }

    // Modal Close actions
    function closeModal() {
      document.body.style.overflow = '';
      modal.remove();
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target === viewport) {
        closeModal();
      }
    });

    document.body.style.overflow = 'hidden';
    document.body.appendChild(modal);
  }
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

