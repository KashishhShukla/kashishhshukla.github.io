/**
 * Modern Developer Portfolio - Main Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Audio Feedback Synthesizer (Web Audio API)
  // --------------------------------------------------------------------------
  let audioEnabled = false;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.03) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported
    }
  }

  const soundToggleBtn = document.getElementById('sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      soundToggleBtn.classList.toggle('active', audioEnabled);
      const icon = soundToggleBtn.querySelector('i') || soundToggleBtn;
      if (audioEnabled) {
        initAudio();
        playTone(587.33, 'sine', 0.1, 0.05); // D5 chime
        showToast('Sound effects enabled', 'info');
      } else {
        showToast('Sound effects muted', 'info');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Theme Accent Switcher
  // --------------------------------------------------------------------------
  const themeDots = document.querySelectorAll('.color-dot');
  const themes = {
    indigo: { primaryHue: 243, accentHue: 188 },
    cyan: { primaryHue: 188, accentHue: 280 },
    emerald: { primaryHue: 155, accentHue: 200 },
    violet: { primaryHue: 280, accentHue: 330 }
  };

  function applyTheme(name) {
    const config = themes[name];
    if (!config) return;

    document.documentElement.style.setProperty('--primary-hue', config.primaryHue);
    document.documentElement.style.setProperty('--accent-hue', config.accentHue);

    themeDots.forEach(dot => {
      dot.classList.toggle('active', dot.dataset.theme === name);
    });

    localStorage.setItem('portfolio-accent-theme', name);
    playTone(440, 'triangle', 0.06);
  }

  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      applyTheme(dot.dataset.theme);
    });
  });

  const savedTheme = localStorage.getItem('portfolio-accent-theme');
  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme);
  }

  // --------------------------------------------------------------------------
  // Dynamic Typing Headline
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typing-text');
  if (typingElement) {
    const roles = [
      'Software Engineer',
      'Full-Stack Developer',
      'AI / ML Engineer',
      'Real-Time Systems Builder'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before new word
      }

      setTimeout(type, typingSpeed);
    }

    type();
  }

  // --------------------------------------------------------------------------
  // Navbar Scroll & Section Spy
  // --------------------------------------------------------------------------
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const mobileClose = document.getElementById('mobile-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleDrawer(open) {
    if (mobileDrawer && drawerOverlay) {
      mobileDrawer.classList.toggle('open', open);
      drawerOverlay.classList.toggle('active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleDrawer(true));
  }
  if (mobileClose) {
    mobileClose.addEventListener('click', () => toggleDrawer(false));
  }
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => toggleDrawer(false));
  }
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleDrawer(false));
  });

  // --------------------------------------------------------------------------
  // Projects Rendering & Category Filter
  // --------------------------------------------------------------------------
  const projectsGrid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');

  function renderProjects(filter = 'all') {
    if (!projectsGrid || typeof PROJECTS_DATA === 'undefined') return;

    projectsGrid.innerHTML = '';
    const filtered = filter === 'all' 
      ? PROJECTS_DATA 
      : PROJECTS_DATA.filter(p => p.category === filter);

    filtered.forEach((project, idx) => {
      const card = document.createElement('article');
      card.className = 'project-card';
      card.dataset.id = project.id;
      card.style.animation = `fadeInUp 0.4s ease forwards ${idx * 0.1}s`;

      card.innerHTML = `
        <div class="project-img-wrapper">
          <img src="${project.image}" alt="${project.title}" class="project-img" loading="lazy" />
          <div class="project-card-overlay">
            <button class="btn btn-primary btn-sm quick-view-btn" data-id="${project.id}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Quick View
            </button>
          </div>
        </div>
        <div class="project-body">
          <div class="project-category">${project.categoryLabel}</div>
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.summary}</p>
          <div class="project-tags">
            ${project.tech.map(t => `<span class="project-tag">${t}</span>`).join('')}
          </div>
          <div class="project-footer">
            <button class="btn btn-secondary btn-sm quick-view-btn" data-id="${project.id}">
              Details & Architecture
            </button>
            <div class="project-links">
              <a href="${project.githubUrl}" target="_blank" rel="noopener" class="project-link" title="Source Code">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </a>
              <a href="${project.demoUrl}" target="_blank" rel="noopener" class="project-link" title="Live Preview">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
          </div>
        </div>
      `;
      projectsGrid.appendChild(card);
    });

    attachTiltEffects();
    attachQuickViewListeners();
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playTone(520, 'sine', 0.05);
      renderProjects(btn.dataset.filter);
    });
  });

  // Initial render
  renderProjects('all');

  // --------------------------------------------------------------------------
  // Project Details Modal
  // --------------------------------------------------------------------------
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalImage = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-description');
  const modalFeatures = document.getElementById('modal-features');
  const modalTags = document.getElementById('modal-tags');
  const modalStats = document.getElementById('modal-stats');
  const modalDemoLink = document.getElementById('modal-demo-link');
  const modalRepoLink = document.getElementById('modal-repo-link');

  function openProjectModal(projectId) {
    const project = PROJECTS_DATA.find(p => p.id === projectId);
    if (!project || !modalOverlay) return;

    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalCategory.textContent = project.categoryLabel;
    modalTitle.textContent = project.title;
    modalDesc.textContent = project.description;

    modalFeatures.innerHTML = project.features.map(f => `
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>${f}</span>
      </li>
    `).join('');

    modalTags.innerHTML = project.tech.map(t => `<span class="project-tag">${t}</span>`).join('');

    modalStats.innerHTML = Object.values(project.stats).map(stat => `
      <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); padding: 0.6rem 1rem; border-radius: 8px; text-align: center;">
        <span style="font-family: var(--font-mono); font-weight: 700; color: var(--accent);">${stat}</span>
      </div>
    `).join('');

    modalDemoLink.href = project.demoUrl;
    modalRepoLink.href = project.githubUrl;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    playTone(659.25, 'sine', 0.08);
  }

  function closeProjectModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      playTone(440, 'sine', 0.06);
    }
  }

  function attachQuickViewListeners() {
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openProjectModal(btn.dataset.id);
      });
    });
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProjectModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

  // --------------------------------------------------------------------------
  // 3D Card Tilt Micro-Interaction
  // --------------------------------------------------------------------------
  function attachTiltEffects() {
    const tiltElements = document.querySelectorAll('.project-card, .avatar-card');
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -7;
        const rotateY = ((x - centerX) / centerX) * 7;

        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }
  attachTiltEffects();

  // --------------------------------------------------------------------------
  // Interactive Glassmorphism Playground
  // --------------------------------------------------------------------------
  const blurSlider = document.getElementById('blur-slider');
  const opacitySlider = document.getElementById('opacity-slider');
  const borderSlider = document.getElementById('border-slider');
  const targetCard = document.getElementById('glass-preview-card');
  const cssOutput = document.getElementById('glass-css-output');
  const copyGlassBtn = document.getElementById('copy-glass-code');

  function updateGlassPreview() {
    if (!targetCard || !blurSlider || !opacitySlider || !borderSlider) return;

    const blur = blurSlider.value;
    const opacity = opacitySlider.value;
    const border = borderSlider.value;

    document.getElementById('blur-val').textContent = `${blur}px`;
    document.getElementById('opacity-val').textContent = `${Math.round(opacity * 100)}%`;
    document.getElementById('border-val').textContent = border;

    const bgVal = `rgba(255, 255, 255, ${opacity})`;
    const blurVal = `blur(${blur}px)`;
    const borderVal = `1px solid rgba(255, 255, 255, ${border})`;

    targetCard.style.background = bgVal;
    targetCard.style.backdropFilter = blurVal;
    targetCard.style.webkitBackdropFilter = blurVal;
    targetCard.style.border = borderVal;

    const codeSnippet = `background: ${bgVal};\nbackdrop-filter: ${blurVal};\nborder: ${borderVal};`;
    if (cssOutput) cssOutput.textContent = codeSnippet;
  }

  if (blurSlider && opacitySlider && borderSlider) {
    [blurSlider, opacitySlider, borderSlider].forEach(input => {
      input.addEventListener('input', updateGlassPreview);
    });
    updateGlassPreview();
  }

  if (copyGlassBtn && cssOutput) {
    copyGlassBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(cssOutput.textContent).then(() => {
        showToast('CSS copied to clipboard!', 'success');
        playTone(784, 'triangle', 0.08);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Animated Metric Counter
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let counted = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.dataset.target, 10);
          const suffix = stat.dataset.suffix || '';
          let count = 0;
          const duration = 1800;
          const stepTime = 25;
          const totalSteps = duration / stepTime;
          const increment = target / totalSteps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = Math.floor(count) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.4 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    countObserver.observe(statsSection);
  }

  // --------------------------------------------------------------------------
  // Contact Form Handling, Email Delivery & Recruiter Messages Log
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  function getStoredMessages() {
    try {
      return JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveStoredMessages(msgs) {
    try {
      localStorage.setItem('portfolio_messages', JSON.stringify(msgs));
    } catch (e) {}
  }

  function updateMessageBadge() {
    const badge = document.getElementById('msg-badge');
    if (badge) {
      const msgs = getStoredMessages();
      badge.textContent = msgs.length;
      badge.style.display = msgs.length > 0 ? 'inline-block' : 'none';
    }
  }
  updateMessageBadge();

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const subjectInput = document.getElementById('subject');
      const messageInput = document.getElementById('message');

      const name = nameInput ? nameInput.value.trim() : 'Recruiter';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : 'Software Engineering Opportunity';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!message || !email) {
        showToast('Please fill in both email and message.', 'info');
        return;
      }

      const originalText = submitBtn.innerHTML;

      // Save to local message inbox log so Kashish can always view it
      const msgs = getStoredMessages();
      const newMsg = {
        id: Date.now(),
        name,
        email,
        subject,
        message,
        date: new Date().toLocaleString()
      };
      msgs.unshift(newMsg);
      saveStoredMessages(msgs);
      updateMessageBadge();

      // Show loading spinner
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
        Sending message...
      `;

      let sentViaApi = false;
      const actionUrl = contactForm.getAttribute('action');

      // Check if Formspree or custom API endpoint is active
      if (actionUrl && !actionUrl.includes('YOUR_FORMSPREE_ID') && actionUrl.startsWith('http')) {
        try {
          const res = await fetch(actionUrl, {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
          });
          if (res.ok) {
            sentViaApi = true;
          }
        } catch (err) {
          console.warn('Form API delivery error, falling back to mail client:', err);
        }
      }

      // If no external API service is connected, trigger direct email via default mail client
      if (!sentViaApi) {
        const mailBody = encodeURIComponent(`From: ${name} (${email})\n\nSubject: ${subject}\n\nMessage:\n${message}\n\n---\nSent via Kashish Shukla Portfolio ("Let's Talk" Form)`);
        const mailUrl = `mailto:shuklaa.kashishh@gmail.com?subject=${encodeURIComponent('[Portfolio Inquiry] ' + subject)}&body=${mailBody}`;
        window.open(mailUrl, '_blank');
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      contactForm.reset();

      showToast('Message saved! Email client opened to deliver to shuklaa.kashishh@gmail.com', 'success');
      playTone(880, 'sine', 0.12, 0.06);
    });
  }

  // --------------------------------------------------------------------------
  // Recruiter Messages Log Viewer Modal
  // --------------------------------------------------------------------------
  const messagesModal = document.getElementById('messages-modal');
  const viewMessagesBtn = document.getElementById('view-messages-btn');
  const messagesModalClose = document.getElementById('messages-modal-close');
  const messagesList = document.getElementById('messages-list');
  const clearMessagesBtn = document.getElementById('clear-messages-btn');

  function renderMessagesList() {
    if (!messagesList) return;
    const msgs = getStoredMessages();
    if (msgs.length === 0) {
      messagesList.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem; opacity: 0.6;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 0.25rem;">No messages stored yet</div>
          <div style="font-size: 0.85rem;">When recruiters reach out through the "Let's Talk" form, their inquiries are logged here and forwarded to your email.</div>
        </div>
      `;
      return;
    }

    messagesList.innerHTML = msgs.map(msg => `
      <div class="message-card" style="background: rgba(15, 23, 42, 0.65); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.6rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem; flex-wrap: wrap;">
          <div>
            <div style="font-weight: 700; color: var(--text-primary); font-size: 1rem;">${msg.name}</div>
            <a href="mailto:${msg.email}" style="color: var(--accent); font-size: 0.85rem; font-family: var(--font-mono); text-decoration: none;">${msg.email}</a>
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${msg.date}</div>
        </div>
        <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-secondary); border-top: 1px solid var(--border-subtle); padding-top: 0.5rem;">
          Subject: ${msg.subject}
        </div>
        <div style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; white-space: pre-wrap; background: rgba(0, 0, 0, 0.25); padding: 0.75rem; border-radius: var(--radius-sm);">
          ${msg.message}
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 0.4rem;">
          <a href="mailto:${msg.email}?subject=${encodeURIComponent('Re: ' + msg.subject)}" class="btn btn-primary btn-sm" style="font-size: 0.78rem; padding: 0.35rem 0.75rem;">
            <span>Reply via Email</span>
          </a>
          <button class="btn btn-secondary btn-sm delete-msg-btn" data-id="${msg.id}" style="font-size: 0.78rem; padding: 0.35rem 0.6rem; color: #ef4444;">
            Delete
          </button>
        </div>
      </div>
    `).join('');

    // Attach delete listeners
    messagesList.querySelectorAll('.delete-msg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id, 10);
        const updated = getStoredMessages().filter(m => m.id !== id);
        saveStoredMessages(updated);
        updateMessageBadge();
        renderMessagesList();
        showToast('Message deleted.', 'info');
      });
    });
  }

  function toggleMessagesModal(open) {
    if (!messagesModal) return;
    if (open) {
      renderMessagesList();
      messagesModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    } else {
      messagesModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (viewMessagesBtn) {
    viewMessagesBtn.addEventListener('click', () => toggleMessagesModal(true));
  }
  if (messagesModalClose) {
    messagesModalClose.addEventListener('click', () => toggleMessagesModal(false));
  }
  if (messagesModal) {
    messagesModal.addEventListener('click', (e) => {
      if (e.target === messagesModal) toggleMessagesModal(false);
    });
  }
  if (clearMessagesBtn) {
    clearMessagesBtn.addEventListener('click', () => {
      if (confirm('Clear all stored recruiter messages?')) {
        saveStoredMessages([]);
        updateMessageBadge();
        renderMessagesList();
        showToast('All messages cleared.', 'info');
      }
    });
  }


  // --------------------------------------------------------------------------
  // Copy Email to Clipboard
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = copyEmailBtn.dataset.email || 'shuklaa.kashishh@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`, 'success');
        playTone(600, 'sine', 0.08);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Toast Notification System
  // --------------------------------------------------------------------------
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg = type === 'success'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  window.showToast = showToast;
});
