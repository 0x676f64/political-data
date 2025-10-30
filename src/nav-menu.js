
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-link');

  // Highlight current page
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }

    // Add click animation
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.classList.add('page-fade-out');
      setTimeout(() => {
        window.location.href = link.getAttribute('href');
      }, 300); // match CSS animation duration
    });
  });
});