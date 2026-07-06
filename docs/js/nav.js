// Client-side Navigation Router (hash-based content loading)
(function () {
  const mainContent = document.getElementById('main-content');
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobile-toggle');

  // Helper: Get route from location hash
  const getRoute = () => {
    const hash = window.location.hash || '#/overview';
    const parts = hash.split('#');
    // E.g. #/overview#architecture -> parts[1] = '/overview', parts[2] = 'architecture'
    const pageRoute = parts[1] || '/overview';
    const anchor = parts[2] || null;
    return {
      page: pageRoute.replace(/^\//, '') || 'overview',
      anchor: anchor
    };
  };

  // Main Route Handler
  const handleRoute = async () => {
    const { page, anchor } = getRoute();
    
    // Show loading spinner
    mainContent.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
    `;

    try {
      const response = await fetch(`pages/${page}.html`);
      if (!response.ok) {
        throw new Error(`Page pages/${page}.html not found.`);
      }
      
      const html = await response.text();
      
      // Inject page HTML wrapper with prose class
      mainContent.innerHTML = `<div class="prose prose-container">${html}</div>`;

      // Intercept and format local header tags to add anchor link icons
      setupAnchors();

      // Trigger Code Highlighting
      if (window.Prism) {
        Prism.highlightAllUnder(mainContent);
      }

      // Trigger Mermaid Diagram rendering
      if (window.mermaid) {
        try {
          mermaid.run({
            nodes: document.querySelectorAll('.mermaid')
          });
        } catch (e) {
          console.error("Mermaid execution error", e);
        }
      }

      // Update Sidebar Active Links
      updateActiveLink(`#/${page}`);

      // Handle scrolling to anchor if present
      if (anchor) {
        const el = document.getElementById(anchor);
        if (el) {
          setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
        }
      } else {
        mainContent.scrollTop = 0;
      }

    } catch (error) {
      console.error(error);
      mainContent.innerHTML = `
        <div class="prose prose-container">
          <h1>404 — Page Not Found</h1>
          <p>The documentation page you requested does not exist or has been moved.</p>
          <p><a href="#/overview">Back to Overview</a></p>
        </div>
      `;
    }
  };

  // Helper: Setup deep-linking anchor icons for h2, h3 tags
  const setupAnchors = () => {
    const headers = mainContent.querySelectorAll('.prose h2, .prose h3');
    headers.forEach(h => {
      if (!h.id) {
        // Generate slugified id if missing
        h.id = h.textContent.trim().toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
      }
      
      // Add anchor link icon
      const anchorVal = window.location.hash.split('#')[1] || '/overview';
      const link = document.createElement('a');
      link.className = 'anchor-link';
      link.href = `#${anchorVal}#${h.id}`;
      link.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="16" height="16">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
        </svg>
      `;
      h.insertBefore(link, h.firstChild);
    });
  };

  // Helper: Update CSS active class in sidebar links
  const updateActiveLink = (hash) => {
    const links = document.querySelectorAll('.sidebar-link');
    links.forEach(l => {
      if (l.getAttribute('href') === hash) {
        l.classList.add('active');
      } else {
        l.classList.remove('active');
      }
    });
  };

  // Mobile sidebar controls
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Close mobile sidebar when clicking a link
  sidebar.addEventListener('click', (e) => {
    if (e.target.classList.contains('sidebar-link')) {
      sidebar.classList.remove('open');
    }
  });

  // Watch hash changes
  window.addEventListener('hashchange', handleRoute);

  // Initial routing
  handleRoute();
})();
