/* ============================================================
   CHESSMASTER COACH – MAIN JS
   Navbar scroll, mobile menu, hero board, parallax,
   scroll reveal, FAQ accordion, shop filters, contact form
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar: scroll effect ─────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  /* ── Navbar: mobile toggle ─────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  /* ── Active nav link by URL ────────────────────────────── */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href').split('/').pop().split('?')[0];
    link.classList.toggle('active', href === currentFile);
  });

  /* ── Hero board: starting position ────────────────────── */
  const STARTING = [
    ['♜','♞','♝','♛','♚','♝','♞','♜'],
    ['♟','♟','♟','♟','♟','♟','♟','♟'],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['','','','','','','',''],
    ['♙','♙','♙','♙','♙','♙','♙','♙'],
    ['♖','♘','♗','♕','♔','♗','♘','♖'],
  ];
  const BLACK = new Set(['♜','♞','♝','♛','♚','♟']);

  function buildBoard(id) {
    const board = document.getElementById(id);
    if (!board) return;
    board.innerHTML = '';
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell  = document.createElement('div');
        cell.className = 'board-cell ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
        const piece = STARTING[r][c];
        if (piece) {
          const span = document.createElement('span');
          span.className = BLACK.has(piece) ? 'bp' : 'wp';
          span.textContent = piece;
          cell.appendChild(span);
        }
        board.appendChild(cell);
      }
    }
  }

  /* ── Floating pieces: mouse parallax ──────────────────── */
  function initParallax() {
    const pieces = document.querySelectorAll('.floating-pieces .piece');
    if (!pieces.length) return;
    const depths = Array.from(pieces).map(() => Math.random() * 0.04 + 0.01);
    window.addEventListener('mousemove', e => {
      const dx = e.clientX - window.innerWidth  / 2;
      const dy = e.clientY - window.innerHeight / 2;
      pieces.forEach((p, i) => {
        p.style.transform = `translate(${dx * depths[i]}px, ${dy * depths[i]}px)`;
      });
    }, { passive: true });
  }

  /* ── Scroll reveal ─────────────────────────────────────── */
  function initReveal() {
    const sel = '.feature-card, .step-card, .package-card, .group-card, .testi-card, .shop-card, .product-card, .achievement-card';
    const targets = document.querySelectorAll(sel);
    targets.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    targets.forEach(el => observer.observe(el));
  }

  /* ── FAQ accordion ─────────────────────────────────────── */
  function initFaq() {
    document.querySelectorAll('.faq-q').forEach(q => {
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const wasOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!wasOpen) item.classList.add('open');
      });
    });
  }

  /* ── Shop filter buttons ───────────────────────────────── */
  function initShopFilters() {
    const btns  = document.querySelectorAll('.shop-filter-btn');
    const cards = document.querySelectorAll('.product-card');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.textContent.trim().toLowerCase();
        cards.forEach(card => {
          const cat = (card.dataset.cat || '').toLowerCase();
          const show = filter === 'all products' || cat.includes(filter.split(' ')[0]);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ── Enquiry modal (shop page) ─────────────────────────── */
  // Replace with your real WhatsApp number (digits only, with country code)
  const PHONE = '10000000000';
  const EMAIL = 'coach@chessmaster.com';

  // Emoji badge per product category
  const BADGE_MAP = {
    boards: '♟', apparel: '👕', accessories: '🎒',
  };

  function openModal(card) {
    const modal      = document.getElementById('enquiryModal');
    if (!modal) return;

    const name  = card.dataset.name  || '';
    const price = card.dataset.price || '';
    const desc  = card.dataset.desc  || '';
    const cat   = (card.dataset.cat  || 'boards').toLowerCase();

    // Populate modal content
    document.getElementById('modalBadge').textContent       = BADGE_MAP[cat] || '♟';
    document.getElementById('modalProductName').textContent = name;
    document.getElementById('modalPrice').textContent       = price;
    document.getElementById('modalDesc').textContent        = desc;

    // Pre-built message
    const msg = encodeURIComponent(
      `Hi! I'm interested in ordering the *${name}* (${price}) from your shop. Could you confirm availability and let me know how to proceed?`
    );
    const emailSubject = encodeURIComponent(`Order Enquiry: ${name}`);
    const emailBody    = encodeURIComponent(
      `Hi,\n\nI'm interested in ordering the ${name} (${price}) from your shop.\n\nCould you confirm availability and let me know how to pay?\n\nThanks!`
    );

    document.getElementById('modalWA').href    = `https://wa.me/${PHONE}?text=${msg}`;
    document.getElementById('modalEmail').href = `mailto:${EMAIL}?subject=${emailSubject}&body=${emailBody}`;
    document.getElementById('modalSMS').href   = `sms:+${PHONE}?body=${msg}`;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('enquiryModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function initEnquiryModal() {
    // Open on Enquire button click
    document.querySelectorAll('.enquire-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        if (card) openModal(card);
      });
    });
    // Close on X button
    const closeBtn = document.getElementById('modalClose');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    // Close on overlay click (outside modal-box)
    const overlay = document.getElementById('enquiryModal');
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal();
      });
    }
    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ── Gallery filter buttons ────────────────────────────── */
  function initGalleryFilters() {
    const btns  = document.querySelectorAll('.gf-btn');
    const items = document.querySelectorAll('.pg-item');
    if (!btns.length) return;
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter || 'all';
        items.forEach(item => {
          if (item.classList.contains('pg-empty')) return; // always show placeholders
          const cat = item.dataset.category || '';
          item.classList.toggle('pg-hidden', filter !== 'all' && cat !== filter);
        });
      });
    });
  }

  /* ── Lightbox ──────────────────────────────────────────── */
  let lbItems = []; // visible (non-empty) pg-items
  let lbIndex = 0;

  function buildLbItems() {
    lbItems = Array.from(document.querySelectorAll('.pg-item:not(.pg-empty)'));
  }

  function lbShow(index) {
    const lb = document.getElementById('lightbox');
    if (!lb || !lbItems.length) return;
    lbIndex = (index + lbItems.length) % lbItems.length;
    const item = lbItems[lbIndex];
    const img  = item.querySelector('img');
    if (!img) return;

    document.getElementById('lbImg').src      = img.src;
    document.getElementById('lbImg').alt      = img.alt;
    document.getElementById('lbTag').textContent     = item.querySelector('.pg-tag')     ? item.querySelector('.pg-tag').textContent     : '';
    document.getElementById('lbCaption').textContent = item.dataset.caption || img.alt;
    document.getElementById('lbCounter').textContent = `${lbIndex + 1} / ${lbItems.length}`;

    lb.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }

  function lbClose() {
    const lb = document.getElementById('lightbox');
    if (!lb) return;
    lb.classList.remove('lb-open');
    document.body.style.overflow = '';
  }

  function initLightbox() {
    buildLbItems();

    // Open on pg-item click
    document.querySelectorAll('.pg-item:not(.pg-empty)').forEach((item, i) => {
      item.addEventListener('click', () => lbShow(i));
    });

    // Nav buttons
    const prev = document.getElementById('lbPrev');
    const next = document.getElementById('lbNext');
    const close = document.getElementById('lbClose');
    if (prev)  prev.addEventListener('click',  () => lbShow(lbIndex - 1));
    if (next)  next.addEventListener('click',  () => lbShow(lbIndex + 1));
    if (close) close.addEventListener('click', lbClose);

    // Close on backdrop click
    const lb = document.getElementById('lightbox');
    if (lb) lb.addEventListener('click', e => { if (e.target === lb || e.target === document.getElementById('lbImg').parentElement) lbClose(); });

    // Keyboard nav
    document.addEventListener('keydown', e => {
      const lb = document.getElementById('lightbox');
      if (!lb || !lb.classList.contains('lb-open')) return;
      if (e.key === 'ArrowLeft')  lbShow(lbIndex - 1);
      if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
      if (e.key === 'Escape')     lbClose();
    });
  }

  /* ── Enquiry form (contact page) ──────────────────────── */
  function initEnquiryForm() {
    const form        = document.getElementById('enquiryForm');
    const formCard    = document.getElementById('enquiryFormCard');
    const successBox  = document.getElementById('enquirySuccess');
    const resetBtn    = document.getElementById('efReset');
    const typeToggle  = document.getElementById('typeToggle');
    const orgFields   = document.getElementById('orgFields');
    const childFields = document.getElementById('childFields');

    if (!form) return; // not on contact page

    let currentType = 'individual';

    /* ── Type toggle ── */
    if (typeToggle) {
      typeToggle.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          typeToggle.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentType = btn.dataset.type;

          if (orgFields)   orgFields.style.display   = currentType === 'organisation' ? '' : 'none';
          if (childFields) childFields.style.display  = currentType === 'parent'       ? '' : 'none';

          // Toggle required on org name
          const orgName = document.getElementById('ef-orgname');
          if (orgName) orgName.required = currentType === 'organisation';
        });
      });
    }

    /* ── Inline error helper ── */
    function setError(input, msg) {
      input.classList.add('ef-invalid');
      let err = input.parentElement.querySelector('.ef-error');
      if (!err) {
        err = document.createElement('span');
        err.className = 'ef-error';
        input.parentElement.appendChild(err);
      }
      err.textContent = msg;
    }

    function clearError(input) {
      input.classList.remove('ef-invalid');
      const err = input.parentElement.querySelector('.ef-error');
      if (err) err.remove();
    }

    // Clear error on user input
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => clearError(el));
      el.addEventListener('change', () => clearError(el));
    });

    /* ── Validation ── */
    function validate() {
      let ok = true;

      const req = [
        { id: 'ef-fname',   msg: 'Please enter your first name.'   },
        { id: 'ef-lname',   msg: 'Please enter your last name.'    },
        { id: 'ef-email',   msg: 'Please enter a valid email.'     },
        { id: 'ef-phone',   msg: 'Please enter your phone number.' },
        { id: 'ef-message', msg: 'Please tell me a bit more.'      },
      ];

      req.forEach(({ id, msg }) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (!el.value.trim()) { setError(el, msg); ok = false; return; }
        if (id === 'ef-email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim())) {
          setError(el, 'Please enter a valid email address.'); ok = false;
        }
      });

      if (currentType === 'organisation') {
        const orgName = document.getElementById('ef-orgname');
        if (orgName && !orgName.value.trim()) {
          setError(orgName, 'Please enter your organisation name.'); ok = false;
        }
      }

      return ok;
    }

    /* ── Collect form data into a message string ── */
    function buildMsg() {
      const fname   = (document.getElementById('ef-fname')   || {}).value || '';
      const lname   = (document.getElementById('ef-lname')   || {}).value || '';
      const email   = (document.getElementById('ef-email')   || {}).value || '';
      const phone   = (document.getElementById('ef-phone')   || {}).value || '';
      const message = (document.getElementById('ef-message') || {}).value || '';
      const level   = (document.getElementById('ef-level')   || {}).value || '';
      const format  = (document.getElementById('ef-format')  || {}).value || '';
      const source  = (document.getElementById('ef-source')  || {}).value || '';
      const services = Array.from(form.querySelectorAll('input[name="service"]:checked'))
                            .map(cb => cb.value).join(', ') || 'Not specified';

      let extraLines = '';
      if (currentType === 'organisation') {
        const org  = (document.getElementById('ef-orgname')  || {}).value || '';
        const role = (document.getElementById('ef-orgrole')  || {}).value || '';
        const stu  = (document.getElementById('ef-students') || {}).value || '';
        const loc  = (document.getElementById('ef-location') || {}).value || '';
        extraLines = `\nOrganisation: ${org}\nRole: ${role}\nStudents: ${stu}\nLocation: ${loc}`;
      } else if (currentType === 'parent') {
        const child    = (document.getElementById('ef-childname') || {}).value || '';
        const childage = (document.getElementById('ef-childage')  || {}).value || '';
        extraLines = `\nChild's Name: ${child}\nChild's Age: ${childage}`;
      }

      return { fname, lname, email, extraLines,
        text: `Hi! New chess coaching enquiry\nName: ${fname} ${lname}\nType: ${currentType}\nEmail: ${email}\nPhone: ${phone}${extraLines}\nServices: ${services}\nLevel: ${level}\nFormat: ${format}\nHow found: ${source}\n\nMessage:\n${message}`
      };
    }

    /* ── Submit: channel picker buttons ── */
    function handleChannelSubmit(channel, spinnerEl) {
      if (!validate()) return;

      // Show spinner on clicked button only
      if (spinnerEl) spinnerEl.style.display = '';
      document.querySelectorAll('.send-channel-btn').forEach(b => b.disabled = true);

      const { fname, lname, email, text } = buildMsg();
      const encoded = encodeURIComponent(text);

      if (channel === 'wa') {
        const a = Object.assign(document.createElement('a'), {
          href: `https://wa.me/${PHONE}?text=${encoded}`,
          target: '_blank', rel: 'noopener'
        });
        document.body.appendChild(a); a.click();
        setTimeout(() => a.remove(), 1000);

      } else if (channel === 'gmail') {
        const subject = encodeURIComponent(`Chess Coaching Enquiry – ${fname} ${lname}`);
        const body    = encodeURIComponent(text);
        const a = Object.assign(document.createElement('a'), {
          href: `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(EMAIL)}&su=${subject}&body=${body}`,
          target: '_blank', rel: 'noopener'
        });
        document.body.appendChild(a); a.click();
        setTimeout(() => a.remove(), 1000);

      } else if (channel === 'sms') {
        const a = Object.assign(document.createElement('a'), {
          href: `sms:+${PHONE}?body=${encoded}`
        });
        document.body.appendChild(a); a.click();
        setTimeout(() => a.remove(), 1000);
      }

      // Show success after short delay
      setTimeout(() => {
        if (spinnerEl) spinnerEl.style.display = 'none';
        document.querySelectorAll('.send-channel-btn').forEach(b => b.disabled = false);
        form.style.display = 'none';
        if (successBox) successBox.style.display = '';
        if (formCard) formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 900);
    }

    /* Wire each channel button */
    form.addEventListener('submit', e => {
      e.preventDefault();
      // Determine which button triggered the submit
      const active = document.activeElement;
      const channel = (active && active.dataset.channel) ? active.dataset.channel : 'wa';
      const spinnerId = { wa: 'efSpinnerWA', gmail: 'efSpinnerGmail', sms: 'efSpinnerSMS' }[channel];
      handleChannelSubmit(channel, document.getElementById(spinnerId));
    });

    /* ── Reset button ── */
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        form.style.display = '';
        if (successBox) successBox.style.display = 'none';

        // Reset type toggle to "individual"
        currentType = 'individual';
        if (typeToggle) {
          typeToggle.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
          const indBtn = typeToggle.querySelector('[data-type="individual"]');
          if (indBtn) indBtn.classList.add('active');
        }
        if (orgFields)   orgFields.style.display   = 'none';
        if (childFields) childFields.style.display  = 'none';

        // Clear any leftover errors
        form.querySelectorAll('.ef-invalid').forEach(el => clearError(el));

        formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ── Init ──────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    buildBoard('heroBoard');
    initParallax();
    initReveal();
    initFaq();
    initShopFilters();
    initEnquiryModal();
    initGalleryFilters();
    initLightbox();
    initEnquiryForm();
  });

})();
