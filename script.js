/* Progressive enhancement. The catalog and all original project links are already in the HTML. */
(() => {
  'use strict';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const html = document.documentElement;
  const projects = JSON.parse($('#projectData').textContent);
  const site = JSON.parse($('#siteData').textContent);
  const arrow = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
  const expand = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/></svg>';
  const labelIcons = {
    'Python': '<svg class="tag-icon" viewBox="0 0 128 128" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M49.33 62h29.159C86.606 62 93 55.132 93 46.981V19.183c0-7.912-6.632-13.856-14.555-15.176-5.014-.835-10.195-1.215-15.187-1.191-4.99.023-9.612.448-13.805 1.191C37.098 6.188 35 10.758 35 19.183V30h29v4H23.776c-8.484 0-15.914 5.108-18.237 14.811-2.681 11.12-2.8 17.919 0 29.53C7.614 86.983 12.569 93 21.054 93H31V79.952C31 70.315 39.428 62 49.33 62zm-1.838-39.11c-3.026 0-5.478-2.479-5.478-5.545 0-3.079 2.451-5.581 5.478-5.581 3.015 0 5.479 2.502 5.479 5.581-.001 3.066-2.465 5.545-5.479 5.545zm74.789 25.921C120.183 40.363 116.178 34 107.682 34H97v12.981C97 57.031 88.206 65 78.489 65H49.33C41.342 65 35 72.326 35 80.326v27.8c0 7.91 6.745 12.564 14.462 14.834 9.242 2.717 17.994 3.208 29.051 0C85.862 120.831 93 116.549 93 108.126V97H64v-4h43.682c8.484 0 11.647-5.776 14.599-14.66 3.047-9.145 2.916-17.799 0-29.529zm-41.955 55.606c3.027 0 5.479 2.479 5.479 5.547 0 3.076-2.451 5.579-5.479 5.579-3.015 0-5.478-2.502-5.478-5.579 0-3.068 2.463-5.547 5.478-5.547z"/></svg>',
    'SQL': '<svg class="tag-icon" viewBox="0 0 128 128" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M64 8.25c-3.465.008-6.93.164-10.383.477a99.14 99.14 0 0 0-6.27.773c-1.874.305-3.738.68-5.585 1.125-1.602.39-3.188.86-4.75 1.398-.676.25-1.348.52-2.012.813-.871.383-1.715.824-2.531 1.316-.242.145-.477.301-.711.461a8.93 8.93 0 0 0-2.035 1.969 4.713 4.713 0 0 0-.532 1.047 3.53 3.53 0 0 0-.148 1.535c.047.32.133.629.262.926.14.312.316.61.527.879.36.472.77.902 1.223 1.281a12.48 12.48 0 0 0 2.418 1.602 23.158 23.158 0 0 0 3.218 1.421c-.117.036-.234.075-.355.114a81.115 81.115 0 0 0 6.758 1.847c2.281.524 4.586.946 6.906 1.266 2.316.324 4.648.547 6.988.668a78.84 78.84 0 0 0 7.012.05c2.273.063 4.55.028 6.82-.105a80.66 80.66 0 0 0 6.778-.71c.468-.06.922-.13 1.37-.192.61-.09 1.216-.184 1.821-.285a57.39 57.39 0 0 0 3.89-.746 55.06 55.06 0 0 0 6.63-1.899c.89-.34 1.77-.715 2.629-1.133a19.913 19.913 0 0 0 2.148-1.242 11.382 11.382 0 0 0 1.578-1.324c.39-.418.727-.89.988-1.402.211-.461.325-.961.336-1.47a3.26 3.26 0 0 0-.406-1.585 4.68 4.68 0 0 0-.71-1.027 9.27 9.27 0 0 0-1.024-.973 10.43 10.43 0 0 0-.614-.484 14.733 14.733 0 0 0-1.484-.903 22.605 22.605 0 0 0-3.77-1.683 53.427 53.427 0 0 0-7.453-2.016 78.118 78.118 0 0 0-5.93-.973 97.165 97.165 0 0 0-6.558-.609c-2.344-.145-4.691-.21-7.039-.207ZM18.418 20.055v87.89c0 9.032 20.055 16.356 44.941 16.5H64c25.172 0 45.582-7.113 45.582-16.5v-87.89c0 9.172-20.41 16.496-45.582 16.496s-45.582-7.11-45.582-16.496Zm22.117 36.48c2.422-.097 4.836.29 7.11 1.137v6.113a11.533 11.533 0 0 0-7.11-2.062 4.847 4.847 0 0 0-2.988.855 2.418 2.418 0 0 0-1.067 2.133 3.13 3.13 0 0 0 .852 2.277 13.064 13.064 0 0 0 3.629 2.203 17.225 17.225 0 0 1 5.902 4.055 7.458 7.458 0 0 1 1.778 4.977 7.681 7.681 0 0 1-2.348 6.468 13.364 13.364 0 0 1-8.39 2.348 15.411 15.411 0 0 1-7.61-1.707v-6.613a11.801 11.801 0 0 0 7.75 2.988 5.786 5.786 0 0 0 3.203-.781 2.712 2.712 0 0 0 1.137-2.207 2.982 2.982 0 0 0-1.067-2.274 20.558 20.558 0 0 0-4.41-2.562c-4.836-2.133-7.11-4.977-7.11-8.602a7.68 7.68 0 0 1 2.985-6.332 11.67 11.67 0 0 1 7.754-2.414Zm25.598.281a14.228 14.228 0 0 1 7.113 1.852A12.87 12.87 0 0 1 78.223 64a16.509 16.509 0 0 1 2.347 7.54 16.634 16.634 0 0 1-2.347 8.956 12.736 12.736 0 0 1-7.114 5.406l8.75 7.82h-8.605l-6.117-7.109a14.679 14.679 0 0 1-7.11-2.133 12.526 12.526 0 0 1-4.906-5.261 16.06 16.06 0 0 1-1.707-7.114A17.48 17.48 0 0 1 53.262 64a13.217 13.217 0 0 1 5.191-5.262 15.015 15.015 0 0 1 7.68-1.922Zm19.199.075h6.402v24.175h11.094v5.192H85.332Zm-19.484 4.906a7.104 7.104 0 0 0-5.547 2.629 10.903 10.903 0 0 0-2.063 7.113 10.842 10.842 0 0 0 2.063 7.11 6.538 6.538 0 0 0 5.406 2.558 6.673 6.673 0 0 0 5.402-2.488 10.355 10.355 0 0 0 1.993-7.18c.156-2.52-.52-5.016-1.918-7.113a6.181 6.181 0 0 0-5.336-2.63Zm0 0"/></svg>',
    'Looker Studio': '<svg class="tag-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M11.9475 0c-1.1598.0021-2.0982.944-2.096 2.1038a2.1 2.1 0 00.356 1.166l.895-.8959a.884.884 0 11.565.564l-.895.895c.9593.6478 2.2621.3953 2.91-.564.6478-.9593.3953-2.262-.564-2.91A2.096 2.096 0 0011.9475 0zm-.835 6.1128a3.2629 3.2629 0 00-.653-1.965l-1.164 1.162a1.667 1.667 0 01-.318 2.012l.632 1.5449a3.2819 3.2819 0 001.503-2.754zm-3.2499 1.666h-.03c-.9217.0009-1.6697-.7455-1.6707-1.6673-.001-.9217.7454-1.6697 1.6672-1.6707a1.669 1.669 0 01.9195.275l1.152-1.152c-1.4069-1.141-3.4724-.9257-4.6135.4811s-.9257 3.4723.481 4.6135a3.2799 3.2799 0 002.7275.6652l-.633-1.5439v-.001zm4.1279 1.3359c-.728 0-1.452.106-2.15.315l.922 2.2519c2.6872-.6819 5.4184.9438 6.1002 3.631.6818 2.6873-.9439 5.4184-3.6311 6.1002s-5.4184-.9439-6.1002-3.631c-.5682-2.2394.4655-4.5774 2.5041-5.6643l-.91-2.2449c-3.6908 1.808-5.2173 6.2657-3.4093 9.9567l.0005.001c1.808 3.6909 6.2657 5.2173 9.9567 3.4093l.001-.0005c3.6913-1.8071 5.2187-6.2645 3.4116-9.9558a7.4417 7.4417 0 00-6.6865-4.1696h-.008l-.001.001z"/></svg>',
    'JavaScript': '<svg class="tag-icon" viewBox="0 0 128 128" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M2 1v125h125V1H2zm66.119 106.513c-1.845 3.749-5.367 6.212-9.448 7.401-6.271 1.44-12.269.619-16.731-2.059-2.986-1.832-5.318-4.652-6.901-7.901l9.52-5.83c.083.035.333.487.667 1.071 1.214 2.034 2.261 3.474 4.319 4.485 2.022.69 6.461 1.131 8.175-2.427 1.047-1.81.714-7.628.714-14.065C58.433 78.073 58.48 68 58.48 58h11.709c0 11 .06 21.418 0 32.152.025 6.58.596 12.446-2.07 17.361zm48.574-3.308c-4.07 13.922-26.762 14.374-35.83 5.176-1.916-2.165-3.117-3.296-4.26-5.795 4.819-2.772 4.819-2.772 9.508-5.485 2.547 3.915 4.902 6.068 9.139 6.949 5.748.702 11.531-1.273 10.234-7.378-1.333-4.986-11.77-6.199-18.873-11.531-7.211-4.843-8.901-16.611-2.975-23.335 1.975-2.487 5.343-4.343 8.877-5.235l3.688-.477c7.081-.143 11.507 1.727 14.756 5.355.904.916 1.642 1.904 3.022 4.045-3.772 2.404-3.76 2.381-9.163 5.879-1.154-2.486-3.069-4.046-5.093-4.724-3.142-.952-7.104.083-7.926 3.403-.285 1.023-.226 1.975.227 3.665 1.273 2.903 5.545 4.165 9.377 5.926 11.031 4.474 14.756 9.271 15.672 14.981.882 4.916-.213 8.105-.38 8.581z"/></svg>',
    'Apps Script': '<svg class="tag-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12.363 2.54a3.136 3.136 0 0 0-.376.022 2.864 2.864 0 0 0-1.589.828c-.562.58-.82 1.115-.773 1.943-.01.264.193 1.023.272 1.274 1.115 3.546 2.09 6.75 3.26 10.279.08.246.168.486.267.72.02.047.035.046.048-.004.077-.297.174-.612.29-.945.894-2.576 1.772-5.14 2.633-7.696a.345.345 0 0 0 .004-.217 163.054 163.054 0 0 0-1.49-4.572 2.603 2.603 0 0 0-.704-.933c-.55-.46-1.166-.694-1.842-.7Zm9.078.117a2.734 2.734 0 0 0-2.878 1.828l-4.576 13.289a2.734 2.734 0 0 0 1.695 3.475l.12.04a2.734 2.734 0 0 0 3.475-1.694L23.85 6.307a2.734 2.734 0 0 0-1.695-3.476c-.233-.1-.506-.124-.716-.174ZM12.375 3.96a1.396 1.396 0 1 1 0 2.791 1.395 1.395 0 0 1 0-2.79zm8.809.07a1.402 1.402 0 1 1 0 2.803 1.402 1.402 0 0 1 0-2.803zM5.419 7.605a2.853 2.853 0 0 0-.468.052 2.683 2.683 0 0 0-1.337.627 2.62 2.62 0 0 0-.924 1.833 3.808 3.808 0 0 0 0 .648 2.52 2.52 0 0 0 .673 1.52c.221.238.465.454.732.648 3.043 2.21 6.08 4.43 9.108 6.664a.78.78 0 0 0 .158.089c.03-.043.032-.098.007-.167a17.409 17.409 0 0 0-.317-1.066 532.752 532.752 0 0 1-2.02-6.251 41.91 41.91 0 0 0-.497-1.477c-.967-.849-2.078-1.6-3.023-2.302A3.848 3.848 0 0 0 6.153 7.7a2.388 2.388 0 0 0-.734-.094Zm.02 1.424a1.398 1.398 0 1 1 0 2.796 1.398 1.398 0 0 1 0-2.796zm-2.458 6.792c-.733-.006-1.375.202-1.927.622a2.72 2.72 0 0 0-.95 1.45 2.78 2.78 0 0 0-.09 1.04 2.74 2.74 0 0 0 .695 1.583c.664.578 1.26.85 2 .945 1.42-.005 2.84-.012 4.262-.02h.418c2.277-.003 4.513-.002 6.706.003.148.005.28.003.392-.01.06-.005.091-.031.092-.077a10.656 10.656 0 0 0-.834-.653 488.746 488.746 0 0 1-6.57-4.815.236.236 0 0 0-.14-.047c-1.34-.003-2.691-.01-4.054-.02zm-.19 1.418a1.402 1.402 0 1 1 0 2.803 1.402 1.402 0 0 1 0-2.803zm13.874.002a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8z"/></svg>',
    'Java': '<svg class="tag-icon" viewBox="0 0 128 128" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zm33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zm11.319-60.575c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zm9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896zm5.609 15.145c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zm27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z"/></svg>'
  };
  function decorateLabel(label) {
    const icon = labelIcons[label];
    return icon ? `${icon}<span>${label}</span>` : `<span>${label}</span>`;
  }
  let toastTimer;
  function toast(message) {
    const element = $('#toast');
    clearTimeout(toastTimer);
    element.textContent = message;
    element.classList.add('is-visible');
    toastTimer = setTimeout(() => element.classList.remove('is-visible'), 3800);
  }
  async function copyText(value, button) {
    let copied = false;
    try { if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(value); copied = true; } } catch { /* Use the local-file fallback below. */ }
    if (!copied) {
      const area = document.createElement('textarea'); area.value = value;
      area.style.cssText = 'position:fixed;left:-9999px;top:0'; area.setAttribute('readonly','');
      // A modal makes the page inert; the fallback must be inside the active dialog.
      (document.querySelector('dialog[open]') || document.body).append(area); area.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      area.remove(); button?.focus({ preventScroll:true });
    }
    return copied;
  }
  function continuousMotion() {
    const policy = PortfolioMotionCore.resolveMotion();
    html.dataset.motionMode = policy.mode;
    html.dataset.motionState = 'on';
    html.dataset.motionSource = policy.source;
    html.classList.remove('motion-reduced');
    // Existing effects share this read-only interface; there is no mode setter.
    return Object.freeze({ ...policy, subscribe() { return () => {}; } });
  }
  function setupMenu() {
    const button = $('.menu-toggle'), nav = $('#mobileNav');
    let open = false;
    function toggle(value, returnFocus = false) {
      open = value;
      nav.hidden = !value;
      button.setAttribute('aria-expanded', String(value));
      button.setAttribute('aria-label', value ? 'Fechar menu' : 'Abrir menu');
      button.innerHTML = value ? '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg>' : '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>';
      if (returnFocus) button.focus({ preventScroll: true });
    }
    button.addEventListener('click', () => toggle(!open));
    $$('a', nav).forEach(link => link.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && open) toggle(false, true); });
    document.addEventListener('click', event => { if (open && !event.composedPath().includes($('.site-header'))) toggle(false); });
    matchMedia('(min-width: 960px)').addEventListener('change', event => { if (event.matches) toggle(false); });
  }
  function setupNavigation() {
    const progress = $('#readingProgress'), header = $('.site-header'), links = $$('[data-nav]');
    const sections = ['projetos', 'especialidades', 'acervo', 'sobre', 'processo', 'contato'].map(id => document.getElementById(id));
    let frame = 0;
    function update() {
      frame = 0;
      const available = html.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0})`;
      header.classList.toggle('is-scrolled', scrollY > 15);
      let active = '';
      sections.forEach(section => { if (section.getBoundingClientRect().top < innerHeight * .4) active = section.id; });
      if (active === 'acervo') active = 'projetos';
      if (active === 'processo') active = 'sobre';
      links.forEach(link => {
        const selected = link.hash === `#${active}`;
        link.classList.toggle('is-active', selected);
        if (selected) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
      });
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    update();
  }
  function setupReveal(motion) {
    if (!('IntersectionObserver' in window)) return;
    const elements = $$('[data-reveal]'), seen = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || motion.reduced) return;
        entry.target.classList.add('is-revealed');
        seen.add(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
    function sync() {
      observer.disconnect();
      elements.forEach(element => {
        if (motion.reduced) {
          element.classList.add('is-revealed');
          return;
        }
        if (seen.has(element) || element.getBoundingClientRect().top < innerHeight * .96) {
          element.classList.add('is-revealed'); seen.add(element);
        } else {
          element.classList.add('will-reveal'); element.classList.remove('is-revealed');
          observer.observe(element);
        }
      });
    }
    motion.subscribe(sync); sync();
    const ambient = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('offscreen-motion', !entry.isIntersecting)));
    $$('.system-card, .showcase').forEach(el => ambient.observe(el));
  }
  function setupCatalog(motion) {
    const cards = $$('.catalog-card'), buttons = $$('[data-filter]');
    const search = $('#projectSearch'), load = $('#loadMore'), reset = $('#resetFilters');
    const size = 6;
    let category = 'todos', limit = size, filtered = projects;
    function render() {
      filtered = PortfolioCatalog.filterProjects(projects, category, search.value);
      const visible = new Set(filtered.slice(0, limit).map(project => project.id));
      cards.forEach(card => {
        const wasHidden = card.hidden; card.hidden = !visible.has(card.dataset.projectId);
        if (wasHidden && !card.hidden && !motion.reduced) { card.classList.remove('is-entering'); void card.offsetWidth; card.classList.add('is-entering'); }
      });
      const shown = Math.min(limit, filtered.length);
      $('#catalogCount').textContent = `Mostrando ${shown} de ${filtered.length} ${filtered.length === 1 ? 'projeto' : 'projetos'}`;
      $('#emptyState').hidden = filtered.length !== 0;
      load.hidden = shown >= filtered.length;
      $('#remainingCount').textContent = `+${Math.min(size, filtered.length - shown)}`;
      reset.hidden = category === 'todos' && !search.value.trim();
      buttons.forEach(button => { const active = button.dataset.filter === category; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
    }
    buttons.forEach(button => button.addEventListener('click', () => { category = button.dataset.filter; limit = size; render(); }));
    search.addEventListener('input', () => { limit = size; render(); });
    // The input's native clear button dispatches input in modern browsers.
    function clear() { category = 'todos'; search.value = ''; limit = size; render(); search.focus({ preventScroll: true }); }
    reset.addEventListener('click', clear);
    $('#emptyReset').addEventListener('click', clear);
    load.addEventListener('click', () => {
      const firstNew = filtered[limit];
      limit += size;
      render();
      if (firstNew) {
        const element = document.getElementById(`caso-${firstNew.id}`);
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
        element.scrollIntoView({ behavior: motion.reduced ? 'instant' : 'smooth', block: 'start' });
      }
    });
    render();
    return { getFiltered: () => filtered };
  }
  function setupCases(catalog) {
    const dialog = $('#caseDialog'), imageDialog = $('#imageDialog');
    if (typeof dialog.showModal !== 'function') return;
    html.classList.add('has-dialog');
    const byId = new Map(projects.map(project => [project.id, project]));
    let current = null, lastFocus = null, returnLocation = '#projetos', sequence = projects, closingForHistory = false;
    function stopVideo() { const video = $('video', dialog); if (video) { video.pause(); video.removeAttribute('src'); video.load(); } }
    function render(project) {
      stopVideo();
      current = project;
      $('#caseEyebrow').textContent = `PROJETO ${String(project.index).padStart(2, '0')} / ${project.categoryLabel.toUpperCase()}`;
      for (const [element, field] of [['caseTitle', 'title'], ['caseClient', 'client'], ['caseSummary', 'summary'], ['caseDescription', 'description'], ['caseChallenge', 'challenge'], ['caseSolution', 'solution'], ['caseValue', 'value']]) document.getElementById(element).textContent = project[field];
      const tags = $('#caseTags'); tags.replaceChildren();
      project.labels.forEach(label => { const span = document.createElement('span'); span.innerHTML = decorateLabel(label); tags.append(span); });
      const media = $('#caseMedia'); media.replaceChildren();
      if (project.video) {
        const video = document.createElement('video');
        video.src = project.playback || project.video;
        video.poster = project.preview;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('aria-label', `Demonstração de ${project.title}`);
        media.append(video);
      } else {
        const button = document.createElement('button'); button.type = 'button'; button.className = 'case-media-button'; button.setAttribute('aria-label', `Ampliar imagem de ${project.title}`);
        const image = document.createElement('img'); image.src = project.image || project.preview; image.alt = `Tela real do projeto ${project.title}`;
        const label = document.createElement('span'); label.innerHTML = `${expand} Ampliar imagem`;
        button.append(image, label);
        button.addEventListener('click', () => {
          $('#fullImage').src = project.image;
          $('#fullImage').alt = `Tela ampliada do projeto ${project.title}`;
          $('#fullImageCaption').textContent = project.title;
          imageDialog.showModal();
        });
        media.append(button);
      }
      const links = $('#caseLinks'); links.replaceChildren();
      project.links.forEach((link, index) => {
        const anchor = document.createElement('a'); anchor.href = link.href; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; anchor.className = `button ${index === 0 ? 'button-dark' : 'button-outline'}`;
        anchor.append(document.createTextNode(link.label));
        anchor.insertAdjacentHTML('beforeend', arrow);
        links.append(anchor);
      });
      $('#casePermission').textContent = project.links.length ? 'Links originais do projeto. Painéis corporativos podem exigir autorização de acesso.' : project.video ? 'Demonstração em vídeo. Esta ferramenta é executada localmente.' : 'Prévia da aplicação interna. Não há link público informado para este projeto.';
      const position = sequence.findIndex(item => item.id === project.id);
      $('#casePosition').textContent = `${String(position + 1).padStart(2, '0')} / ${String(sequence.length).padStart(2, '0')}`;
      $('#casePrev').disabled = sequence.length < 2;
      $('#caseNext').disabled = sequence.length < 2;
      $('#caseScroll').scrollTop = 0;
    }
    function openProject(id, updateHistory = true) {
      const project = byId.get(id);
      if (!project) return;
      if (dialog.open && current?.id === id) return;
      if (!dialog.open) {
        lastFocus = document.activeElement;
        returnLocation = location.hash.startsWith('#caso-') ? '#projetos' : (location.hash || '#inicio');
        const filtered = catalog.getFiltered();
        sequence = filtered.some(item => item.id === id) ? filtered : projects;
      }
      render(project);
      if (!dialog.open) { dialog.showModal(); document.body.classList.add('modal-open'); }
      if (updateHistory) history.pushState({ portfolioCase: id }, '', `#caso-${id}`);
    }
    document.addEventListener('click', event => {
      const link = event.target.closest('[data-open-project]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      if (!byId.has(link.dataset.openProject)) return;
      event.preventDefault();
      openProject(link.dataset.openProject);
    });
    $('#caseShare').setAttribute('aria-label', 'Copiar link do projeto');
    $('#caseShare').addEventListener('click', async event => {
      if (!current) return;
      const base = location.protocol === 'file:' ? site.url : location.href.split('#')[0];
      const url = `${base}#caso-${current.id}`;
      const copied = await copyText(url, event.currentTarget);
      const button = $('#caseShare');
      button.setAttribute('aria-label', copied ? 'Link do projeto copiado' : 'Copiar link do projeto');
      $('#casePermission').textContent = copied ? 'Link do projeto copiado.' : `Copie este link: ${url}`;
    });
    $('#closeCase').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      if (imageDialog.open) imageDialog.close();
      stopVideo();
      document.body.classList.remove('modal-open');
      if (!closingForHistory && location.hash.startsWith('#caso-')) history.replaceState(null, '', returnLocation);
      closingForHistory = false;
      current = null;
      if (lastFocus?.isConnected) lastFocus.focus({ preventScroll: true });
    });
    const closeFromBackdrop = element => element.addEventListener('click', event => {
      if (event.target !== element) return;
      const rect = element.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) element.close();
    });
    closeFromBackdrop(dialog); closeFromBackdrop(imageDialog);
    $('#closeImage').addEventListener('click', () => imageDialog.close());
    function navigate(direction) {
      if (!current || sequence.length < 2) return;
      const next = sequence[(sequence.findIndex(project => project.id === current.id) + direction + sequence.length) % sequence.length];
      render(next);
      history.replaceState({ portfolioCase: next.id }, '', `#caso-${next.id}`);
    }
    $('#casePrev').addEventListener('click', () => navigate(-1));
    $('#caseNext').addEventListener('click', () => navigate(1));
    function handleRoute() {
      const id = location.hash.startsWith('#caso-') ? location.hash.slice(6) : '';
      if (byId.has(id)) openProject(id, false);
      else if (dialog.open) { closingForHistory = true; dialog.close(); }
    }
    addEventListener('hashchange', handleRoute);
    addEventListener('popstate', handleRoute);
    handleRoute();
  }
  function setupShowcase(motion) {
    const container = $('#showcase'), link = $('#showcaseLink'), details = $('#showcaseDetails'), image = $('#showcaseImage');
    const config = JSON.parse($('#experienceData').textContent);
    const slides = config.selected.map(id => projects.find(project => project.id === id)).filter(Boolean);
    if (!slides.length) return;
    image.addEventListener('error', () => {
      const fallback = slides[index]?.image;
      if (fallback && image.getAttribute('src') !== fallback) image.src = fallback;
    });
    const progress = $('#slideProgress');
    const duration = 6500;
    let index = 0, timer = null, started = 0, remaining = duration, switchTimer = null;
    let onScreen = true;
    // Suspend only invisible work. Pointer, focus and open cases do not pause playback.
    function canPlay() { return !document.hidden && onScreen; }
    function schedule(reset = false) {
      if (timer !== null) { clearTimeout(timer); timer = null; remaining = Math.max(0, remaining - (performance.now() - started)); }
      if (reset) {
        remaining = duration;
        progress.classList.remove('is-playing');
        void progress.offsetWidth;
        progress.classList.add('is-playing');
      }
      const playing = canPlay();
      progress.classList.toggle('is-paused', !playing);
      if (playing) { started = performance.now(); timer = setTimeout(() => { timer = null; show(index + 1); }, remaining); }

    }
    function show(next) {
      index = (next + slides.length) % slides.length;
      clearTimeout(switchTimer);
      const slide = slides[index];
      const apply = () => {
        image.src = slide.preview;
        image.alt = `Tela real do projeto ${slide.title}`;
        $('#showcaseTitle').textContent = slide.title;
        $('#showcaseCategory').textContent = slide.categoryLabel.toUpperCase();
        $('#showcaseClient').textContent = slide.client;
        $('#heroIndex').textContent = String(index + 1).padStart(2, '0');
        link.href = `#caso-${slide.id}`;
        link.dataset.openProject = slide.id;
        link.setAttribute('aria-label', `Conhecer o projeto ${slide.title}`);
        details.href = link.href;
        details.dataset.openProject = slide.id;
        details.setAttribute('aria-label', `Abrir detalhes de ${slide.title}`);
        $('#slideCounter').textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
        link.classList.remove('is-switching');
      };
      if (motion.reduced) apply(); else { link.classList.add('is-switching'); switchTimer = setTimeout(apply, 120); }
      schedule(true);
    }
    $('#slidePrev').addEventListener('click', () => show(index - 1));
    $('#slideNext').addEventListener('click', () => show(index + 1));
    document.addEventListener('visibilitychange', () => schedule());
    if ('IntersectionObserver' in window) new IntersectionObserver(entries => { onScreen = entries[0].isIntersecting; schedule(); }, { threshold: .1 }).observe(container);
    PortfolioExperience.swipe(link, delta => show(index + delta));
    container.addEventListener('keydown', event => {
      if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault(); show(index + (event.key === 'ArrowRight' ? 1 : -1));
    });
    schedule(true);
  }
  function setupContact() {
    $$('[data-copy-email]').forEach(button => button.addEventListener('click', async () => {
      const copied = await copyText(site.email, button);
      toast(copied ? 'E-mail copiado. Vamos conversar!' : `Copie o endereço: ${site.email}`);
    }));
  }
  // Each enhancement is isolated; an optional feature never removes the static content.
  function init(name, task) {
    try { return task(); } catch (error) { console.warn(`[Portfólio] ${name} não pôde ser iniciado:`, error); return null; }
  }
  html.classList.add('is-enhanced');
  const motion = init('animações contínuas', continuousMotion) || Object.freeze({ reduced: false, subscribe() {} });
  init('menu', setupMenu);
  init('navegação', setupNavigation);
  const catalog = init('catálogo', () => setupCatalog(motion)) || { getFiltered: () => projects };
  init('cases', () => setupCases(catalog));
  init('carrossel', () => setupShowcase(motion));
  init('animações de entrada', () => setupReveal(motion));
  init('ícones e mapa', () => PortfolioTools.init());
  init('contato', setupContact);
  init('experiência premium', () => PortfolioExperience.init(motion, projects));
})();
