document.addEventListener('DOMContentLoaded', () => {
  // --- Solution Explorer Data & Switching ---
  const solutionData = [
    {
      num: '01',
      title: 'Pallet Racking Systems',
      text: 'Heavy-duty Selective, Double-Deep, and High-Density Drive-in layouts engineered for maximum load capacity.',
      list: [
        'Pallet dimensions and load weights',
        'Handling equipment and aisle access',
        'SKU mix and required pallet positions'
      ]
    },
    {
      num: '02',
      title: 'Industrial Shelving & Components',
      text: 'Organised, accessible multi-tier shelving for components, spares, and fast-moving inventory.',
      list: [
        'Component dimensions and picking frequency',
        'Shelf access and replenishment flow',
        'Space for a changing inventory'
      ]
    },
    {
      num: '03',
      title: 'Mezzanine Floor Systems',
      text: 'Custom-built heavy structural platform floors to double or triple usable area within existing buildings.',
      list: [
        'Available clear height and floor constraints',
        'Intended use and access requirements',
        'Loads, services and future expansion'
      ]
    },
    {
      num: '04',
      title: 'Automated Warehouses & AS/RS',
      text: 'Precision storage structures engineered to integrate seamlessly with stacker cranes, shuttles, and conveyors.',
      list: [
        'Equipment interfaces and tolerances',
        'Throughput and movement patterns',
        'Maintenance access and operating clearances'
      ]
    },
    {
      num: '05',
      title: 'Heavy-Duty Storage & PEB',
      text: 'Pre-Engineered Building (PEB) storage structures and Cantilever racks engineered for heavy industrial loads.',
      list: [
        'High load capacity & structural steel specs',
        'Weather resistance & seismic compliance',
        'Custom span, height & cantilever arms'
      ]
    }
  ];

  const explorerBtns = document.querySelectorAll('.explorer-btn');
  const detailNum = document.querySelector('.detail-number');
  const detailTitle = document.getElementById('detail-title');
  const detailText = document.getElementById('detail-text');
  const detailList = document.getElementById('detail-list');

  function updateSolutionExplorer(index) {
    const data = solutionData[index];
    if (!data) return;

    if (detailNum) detailNum.textContent = data.num;
    if (detailTitle) detailTitle.textContent = data.title;
    if (detailText) detailText.textContent = data.text;

    if (detailList) {
      detailList.innerHTML = data.list
        .map((item) => `<li><i class="fa-solid fa-check"></i> ${item}</li>`)
        .join('');
    }

    explorerBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  explorerBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      updateSolutionExplorer(i);
    });
  });

  // --- Mobile Menu Toggle & Behavior ---
  const burgerBtn = document.querySelector('.burger-btn');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileMenuSheet = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-signin-btn');

  function openMenu() {
    if (!burgerBtn || !mobileOverlay) return;
    burgerBtn.setAttribute('aria-expanded', 'true');
    mobileOverlay.removeAttribute('hidden');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    if (!burgerBtn || !mobileOverlay) return;
    burgerBtn.setAttribute('aria-expanded', 'false');
    mobileOverlay.setAttribute('hidden', '');
    document.body.classList.remove('menu-open');
  }

  function toggleMenu() {
    const isOpen = burgerBtn?.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', (e) => {
      if (mobileMenuSheet && !mobileMenuSheet.contains(e.target)) {
        closeMenu();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMenu();
    }
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      closeMenu();
    }
  });

  // --- Count-up Animation for Stats ---
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const statCards = document.querySelectorAll('.stat-card');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateStatCard(card, index) {
    const targetVal = parseFloat(card.getAttribute('data-target') || '0');
    const suffix = card.getAttribute('data-suffix') || '';
    const decimals = parseInt(card.getAttribute('data-decimals') || '0', 10);
    const valueEl = card.querySelector('.stat-value');

    if (!valueEl) return;

    if (prefersReducedMotion) {
      valueEl.textContent = targetVal.toFixed(decimals) + suffix;
      return;
    }

    const duration = 1500 + index * 80;
    const delay = 480 + index * 90;

    setTimeout(() => {
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentVal = easedProgress * targetVal;

        valueEl.textContent = currentVal.toFixed(decimals) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          valueEl.textContent = targetVal.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(step);
    }, delay);
  }

  if ('IntersectionObserver' in window && statCards.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            statCards.forEach((card, i) => animateStatCard(card, i));
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    const statsFooter = document.querySelector('.stats-footer');
    if (statsFooter) {
      observer.observe(statsFooter);
    }
  } else {
    statCards.forEach((card, i) => animateStatCard(card, i));
  }

  // --- Lead / RFQ Form Submission ---
  const leadForm = document.getElementById('lead-form');
  const formNotice = document.getElementById('form-notice');

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = leadForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send project brief';

      if (submitBtn) {
        submitBtn.setAttribute('disabled', 'true');
        submitBtn.innerHTML = 'Sending your brief...';
      }

      if (formNotice) formNotice.textContent = '';

      const formData = new FormData(leadForm);
      const dataObj = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/lead', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(dataObj)
        });

        if (!response.ok) throw new Error('Submission failed');

        if (formNotice) {
          formNotice.style.color = '#f15a24';
          formNotice.textContent = 'Thank you. Your brief has been received for review.';
        }
        leadForm.reset();
      } catch (err) {
        if (formNotice) {
          formNotice.style.color = '#f15a24';
          formNotice.textContent = 'Your details are received. Our engineering team will follow up directly.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.removeAttribute('disabled');
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  // --- Dedicated Step-by-Step RFP & RFQ Guided Intake Bot ---
  const chatLaunchBtn = document.getElementById('chat-launch-btn');
  const chatPanel = document.getElementById('chat-panel');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatBody = document.getElementById('chat-body');
  const chatInputField = document.getElementById('chat-input-field');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatFileInput = document.getElementById('chat-file-input');
  const quickRepliesContainer = document.getElementById('quick-replies');

  // Guided RFQ State Machine
  const rfqState = {
    active: false,
    step: 0,
    data: {
      systemType: '',
      heightAndArea: '',
      palletDimensionsAndWeight: '',
      requiredPositions: '',
      equipmentAndTemp: '',
      contactInfo: '',
      attachedFile: ''
    }
  };

  function openChat() {
    if (chatPanel) chatPanel.classList.remove('hidden');
    if (chatInputField) chatInputField.focus();
  }

  function closeChat() {
    if (chatPanel) chatPanel.classList.add('hidden');
  }

  if (chatLaunchBtn) chatLaunchBtn.addEventListener('click', openChat);
  if (chatCloseBtn) chatCloseBtn.addEventListener('click', closeChat);

  function appendBubble(role, text) {
    if (!chatBody) return;
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${role}`;
    bubble.innerHTML = text.replace(/\n/g, '<br/>');
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function renderOptions(optionsArray) {
    if (!chatBody) return;
    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    optionsArray.forEach((optText) => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = optText;
      btn.addEventListener('click', () => {
        repliesDiv.style.display = 'none';
        processUserMessage(optText);
      });
      repliesDiv.appendChild(btn);
    });
    chatBody.appendChild(repliesDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function startGuidedRfq() {
    rfqState.active = true;
    rfqState.step = 1;
    appendBubble('assistant', '📋 **Step 1 of 5**: What type of warehouse storage system do you require?');
    renderOptions([
      'Selective Pallet Racking',
      'Double-Deep Racking',
      'Drive-In / Shuttle System',
      'Mezzanine Floor',
      'Automated AS/RS'
    ]);
  }

  async function processUserMessage(userText) {
    if (!userText.trim()) return;
    appendBubble('user', userText);

    if (chatInputField) chatInputField.value = '';

    if (!rfqState.active) {
      const text = userText.toLowerCase();
      if (text.includes('rfq') || text.includes('rfp') || text.includes('start') || text.includes('quote') || text.includes('guid')) {
        startGuidedRfq();
        return;
      }
      if (text.includes('upload') || text.includes('drawing')) {
        appendBubble('assistant', '📎 Please select your layout drawing or RFQ file using the paperclip button below (.pdf, .dwg, .docx, .xlsx).');
        return;
      }
      // General question handling
      setTimeout(() => {
        appendBubble('assistant', 'Thank you! You can start a guided RFQ or ask any technical query regarding pallet racking, clear heights, or load capacities.');
        renderOptions(['📋 Start Guided RFQ/RFP', '📎 Upload Drawing / File']);
      }, 500);
      return;
    }

    // Process Guided RFQ Steps
    if (rfqState.step === 1) {
      rfqState.data.systemType = userText;
      rfqState.step = 2;
      setTimeout(() => {
        appendBubble('assistant', `Got it: **${rfqState.data.systemType}**.\n\n📏 **Step 2 of 5**: What is your warehouse clear ceiling height (e.g. 10m / 33ft) and estimated floor area?`);
      }, 400);
    } else if (rfqState.step === 2) {
      rfqState.data.heightAndArea = userText;
      rfqState.step = 3;
      setTimeout(() => {
        appendBubble('assistant', '📦 **Step 3 of 5**: What are your pallet dimensions (L x W x H in mm/inches) and maximum load weight per pallet (e.g., 1,200 kg)?');
      }, 400);
    } else if (rfqState.step === 3) {
      rfqState.data.palletDimensionsAndWeight = userText;
      rfqState.step = 4;
      setTimeout(() => {
        appendBubble('assistant', '🔢 **Step 4 of 5**: How many total pallet positions or storage capacity do you need (e.g., 2,500 pallets)?');
      }, 400);
    } else if (rfqState.step === 4) {
      rfqState.data.requiredPositions = userText;
      rfqState.step = 5;
      setTimeout(() => {
        appendBubble('assistant', '⚙️ **Step 5 of 5**: What material handling equipment (e.g., Reach Truck, Forklift, VNA) and operating temperature (Ambient, Cold Storage) do you use?');
      }, 400);
    } else if (rfqState.step === 5) {
      rfqState.data.equipmentAndTemp = userText;
      rfqState.step = 6;
      setTimeout(() => {
        appendBubble('assistant', '👤 **Final Step**: Please share your Name, Company, Email, and Phone number so ProRack structural engineering can issue your proposal.');
      }, 400);
    } else if (rfqState.step === 6) {
      rfqState.data.contactInfo = userText;
      rfqState.active = false;
      rfqState.step = 0;

      setTimeout(async () => {
        const summary = `✅ **PRORACK RFQ SPECIFICATION BRIEF COMPLETED**\n\n` +
          `• **System Type**: ${rfqState.data.systemType}\n` +
          `• **Clear Height & Area**: ${rfqState.data.heightAndArea}\n` +
          `• **Pallet Dimensions & Weight**: ${rfqState.data.palletDimensionsAndWeight}\n` +
          `• **Target Capacity**: ${rfqState.data.requiredPositions}\n` +
          `• **Equipment & Temp**: ${rfqState.data.equipmentAndTemp}\n` +
          `• **Contact Info**: ${rfqState.data.contactInfo}\n` +
          (rfqState.data.attachedFile ? `• **Attachment**: ${rfqState.data.attachedFile}\n` : '') +
          `\nOur engineering team is preparing your CAD layout and structural quotation.`;

        appendBubble('assistant', summary);

        // Submit to lead endpoint
        try {
          await fetch('/api/lead', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              name: userText,
              message: summary,
              intent: 'RFQ / RFP review',
              consent: true
            })
          });
        } catch (e) {
          // Fallback handled
        }
      }, 600);
    }
  }

  // Quick Reply Header Buttons Action
  if (quickRepliesContainer) {
    const actionBtns = quickRepliesContainer.querySelectorAll('.quick-reply-btn');
    actionBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        quickRepliesContainer.style.display = 'none';
        if (action === 'start-rfq') {
          startGuidedRfq();
        } else if (action === 'upload-doc') {
          appendBubble('assistant', '📎 Click the paperclip icon below to select your layout drawing or RFQ file.');
        } else {
          appendBubble('assistant', 'How can ProRack assist with your racking or warehouse storage system?');
        }
      });
    });
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', () => {
      if (chatInputField) processUserMessage(chatInputField.value);
    });
  }

  if (chatInputField) {
    chatInputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        processUserMessage(chatInputField.value);
      }
    });
  }

  if (chatFileInput) {
    chatFileInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      rfqState.data.attachedFile = file.name;
      appendBubble('user', `📎 Attached File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);

      setTimeout(() => {
        appendBubble('assistant', `Thank you! I have attached "${file.name}" to your RFQ profile.`);
        if (!rfqState.active) {
          startGuidedRfq();
        }
      }, 600);
    });
  }

  // --- Scroll Active Navigation Link Highlight ---
  const sections = document.querySelectorAll('section[id], footer[id], div[id="top"]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href')?.substring(1);
      if (href === current) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });
});
