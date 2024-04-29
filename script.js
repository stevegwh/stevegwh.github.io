function scrollToTargetOnLoad(elementId) {
    localStorage.setItem('scrollToElement', elementId);
  }
  
  window.addEventListener('DOMContentLoaded', function() {
    var elementId = localStorage.getItem('scrollToElement');
    if (elementId) {
      var targetElement = document.getElementById(elementId);
      if (targetElement) {
        var targetPosition = targetElement.offsetTop;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
      localStorage.removeItem('scrollToElement');
    }
  });