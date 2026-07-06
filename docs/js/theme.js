// Dark / Light Theme Manager
(function () {
  const getTheme = () => {
    const saved = localStorage.getItem('gatifleet-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gatifleet-theme', theme);
    
    // Update Prism stylesheet if needed or re-initialize Mermaid
    if (window.mermaid) {
      // Re-init with appropriate theme
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default'
      });
      // Re-render any mermaid blocks in the DOM
      try {
        mermaid.run();
      } catch (e) {
        // Suppress initial rendering errors before DOM content loaded
      }
    }
  };

  // Set initial theme before page content loads to avoid screen flash
  const initialTheme = getTheme();
  setTheme(initialTheme);

  // Initialize listener on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const target = current === 'dark' ? 'light' : 'dark';
        setTheme(target);
      });
    }
  });
})();
