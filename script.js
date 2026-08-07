function scrollToTargetOnLoad(elementId) {
    localStorage.setItem('scrollToElement', elementId);
  }

function showProject(elementId) {
    var projectList = document.getElementsByClassName('project');
    var targetElement = document.getElementById(elementId);

    if (!targetElement) {
        return;
    }

    if (targetElement.closest) {
        var parentDetails = targetElement.closest('details');
        if (parentDetails) {
            parentDetails.open = true;
        }
    }

    var returnElement = document.getElementById("project-return");
    var featuredReturnElement = document.getElementById("featured-return");
    var academicReturnElement = document.getElementById("academic-return");
    var otherReturnElement = document.getElementById("other-return");

    // Match the return link to the section that owns the active project.
    var featuredContainer = document.getElementById("featured-project-container");
    var academicContainer = document.getElementById("academic-container");
    var otherContainer = document.getElementById("other-container");

    if (featuredContainer && featuredContainer.contains(targetElement)) {
        returnElement = featuredReturnElement;
    }
    else if (academicContainer && academicContainer.contains(targetElement)) {
        returnElement = academicReturnElement;
    }
    else if (otherContainer && otherContainer.contains(targetElement)) {
        returnElement = otherReturnElement;
    }

    for (var i = 0; i < projectList.length; i++) {
        projectList[i].style.display = 'none';
    }

    targetElement.style.display = 'block';

    // Lazy-load YouTube iframes AFTER becoming visible
    var iframes = targetElement.querySelectorAll('iframe[data-src]');

    for (var j = 0; j < iframes.length; j++) {
        if (!iframes[j].src) {
            iframes[j].src = iframes[j].dataset.src;
        }
    }

    if (projectList.length > 0 && returnElement) {
        returnElement.style.display = 'block';
    }
}

function initImageFocusWindow() {
    var galleryItems = document.querySelectorAll('.gallery-item');

    if (galleryItems.length === 0) {
        return;
    }

    var focusWindow = document.createElement('div');
    focusWindow.className = 'image-focus-window';
    focusWindow.setAttribute('aria-hidden', 'true');

    focusWindow.innerHTML =
        '<div class="image-focus-panel" role="dialog" aria-modal="true" aria-label="Focused image">' +
            '<button class="image-focus-close" type="button" aria-label="Close focused image">X</button>' +
            '<img class="image-focus-img" src="" alt="">' +
            '<div class="image-focus-caption"></div>' +
        '</div>';

    document.body.appendChild(focusWindow);

    var focusImage = focusWindow.querySelector('.image-focus-img');
    var focusCaption = focusWindow.querySelector('.image-focus-caption');
    var closeButton = focusWindow.querySelector('.image-focus-close');
    var previouslyFocusedElement = null;

    function closeFocusWindow() {
        focusWindow.classList.remove('is-open');
        focusWindow.setAttribute('aria-hidden', 'true');
        focusImage.removeAttribute('src');
        focusImage.alt = '';
        focusCaption.textContent = '';

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
            previouslyFocusedElement = null;
        }
    }

    function openFocusWindow(item) {
        var image = item.querySelector('img');
        var caption = item.querySelector('.gallery-caption');

        if (!image) {
            return;
        }

        previouslyFocusedElement = item;
        focusImage.src = item.getAttribute('href') || image.src;
        focusImage.alt = image.alt || 'Focused project image';
        focusCaption.textContent = caption ? caption.textContent : '';
        focusCaption.style.display = focusCaption.textContent ? 'block' : 'none';
        focusWindow.setAttribute('aria-hidden', 'false');
        focusWindow.classList.add('is-open');
        closeButton.focus();
    }

    for (var i = 0; i < galleryItems.length; i++) {
        galleryItems[i].addEventListener('click', function(event) {
            event.preventDefault();
            openFocusWindow(this);
        });
    }

    closeButton.addEventListener('click', closeFocusWindow);

    focusWindow.addEventListener('click', function(event) {
        if (event.target === focusWindow) {
            closeFocusWindow();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && focusWindow.classList.contains('is-open')) {
            closeFocusWindow();
        }
    });
}
  
  window.addEventListener('DOMContentLoaded', function() {
    initImageFocusWindow();

    var elementId = localStorage.getItem('scrollToElement');
    if (elementId) {
      showProject(elementId);
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
