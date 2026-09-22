function scrollToTargetOnLoad(elementId) {
    localStorage.setItem('scrollToElement', elementId);
  }

function showProject(elementId) {
    var projectList = document.getElementsByClassName('project');
    var targetElement = document.getElementById(elementId);

    if (!targetElement) {
        return;
    }

    // Remember the open project for this tab so it can be restored after
    // following a link and returning to the portfolio.
    try {
        sessionStorage.setItem('activeProject', elementId);
    }
    catch (error) {
        // Storage can be unavailable in some privacy modes; the page still works normally.
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

function hideProject(returnTargetId) {
    var projectList = document.getElementsByClassName('project');
    var documentElement = document.documentElement;
    var previousOverflowAnchor = documentElement.style.overflowAnchor;

    // Prevent the browser from preserving the old viewport while the large
    // project drawer is removed from the page layout.
    documentElement.style.overflowAnchor = 'none';

    for (var i = 0; i < projectList.length; i++) {
        projectList[i].style.display = 'none';
    }

    try {
        sessionStorage.removeItem('activeProject');
    }
    catch (error) {
        // Storage can be unavailable in some privacy modes; the page still works normally.
    }

    var returnTarget = document.getElementById(returnTargetId);
    if (returnTarget) {
        window.setTimeout(function() {
            try {
                window.history.pushState(null, '', '#' + returnTargetId);
            }
            catch (error) {
                // History updates can be unavailable when the page is opened as a local file.
            }

            returnTarget.scrollIntoView({ block: 'start' });

            window.requestAnimationFrame(function() {
                documentElement.style.overflowAnchor = previousOverflowAnchor;
            });
        }, 0);
    }
    else {
        documentElement.style.overflowAnchor = previousOverflowAnchor;
    }

    return false;
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
        '<div class="image-focus-panel" role="dialog" aria-modal="true" aria-label="Focused image" tabindex="-1">' +
            '<button class="image-focus-close" type="button" aria-label="Close focused image">X</button>' +
            '<button class="image-focus-nav image-focus-prev" type="button" aria-label="Previous screenshot">&#10094;</button>' +
            '<img class="image-focus-img" src="" alt="">' +
            '<button class="image-focus-nav image-focus-next" type="button" aria-label="Next screenshot">&#10095;</button>' +
            '<div class="image-focus-caption"></div>' +
        '</div>';

    document.body.appendChild(focusWindow);

    var focusPanel = focusWindow.querySelector('.image-focus-panel');
    var focusImage = focusWindow.querySelector('.image-focus-img');
    var focusCaption = focusWindow.querySelector('.image-focus-caption');
    var closeButton = focusWindow.querySelector('.image-focus-close');
    var previousButton = focusWindow.querySelector('.image-focus-prev');
    var nextButton = focusWindow.querySelector('.image-focus-next');
    var previouslyFocusedElement = null;
    var currentGalleryItems = [];
    var currentGalleryIndex = 0;

    function closeFocusWindow() {
        closeButton.blur();
        focusWindow.classList.remove('is-open');
        focusWindow.setAttribute('aria-hidden', 'true');
        focusImage.removeAttribute('src');
        focusImage.alt = '';
        focusCaption.textContent = '';
        currentGalleryItems = [];
        currentGalleryIndex = 0;

        if (previouslyFocusedElement) {
            previouslyFocusedElement.focus();
            previouslyFocusedElement = null;
        }
    }

    function showGalleryItem(item) {
        var image = item.querySelector('img');
        var caption = item.querySelector('.gallery-caption');

        if (!image) {
            return;
        }

        focusImage.src = item.getAttribute('href') || image.src;
        focusImage.alt = image.alt || 'Focused project image';
        focusCaption.textContent = caption ? caption.textContent : '';
        focusCaption.style.display = focusCaption.textContent ? 'block' : 'none';
    }

    function navigateGallery(offset) {
        if (currentGalleryItems.length < 2) {
            return;
        }

        currentGalleryIndex = (currentGalleryIndex + offset + currentGalleryItems.length) % currentGalleryItems.length;
        showGalleryItem(currentGalleryItems[currentGalleryIndex]);
    }

    function openFocusWindow(item) {
        var gallery = item.closest('.project-gallery');

        currentGalleryItems = gallery ? Array.prototype.slice.call(gallery.querySelectorAll('.gallery-item')) : [item];
        currentGalleryIndex = currentGalleryItems.indexOf(item);
        previouslyFocusedElement = item;
        showGalleryItem(item);
        previousButton.hidden = currentGalleryItems.length < 2;
        nextButton.hidden = currentGalleryItems.length < 2;
        focusWindow.setAttribute('aria-hidden', 'false');
        focusWindow.classList.add('is-open');
        focusPanel.focus();
    }

    for (var i = 0; i < galleryItems.length; i++) {
        galleryItems[i].addEventListener('click', function(event) {
            event.preventDefault();
            openFocusWindow(this);
        });
    }

    closeButton.addEventListener('click', closeFocusWindow);
    previousButton.addEventListener('click', function() {
        navigateGallery(-1);
    });
    nextButton.addEventListener('click', function() {
        navigateGallery(1);
    });

    focusWindow.addEventListener('click', function(event) {
        if (event.target === focusWindow) {
            closeFocusWindow();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (!focusWindow.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeFocusWindow();
        }
        else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            navigateGallery(-1);
        }
        else if (event.key === 'ArrowRight') {
            event.preventDefault();
            navigateGallery(1);
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
    else {
      try {
        var activeProjectId = sessionStorage.getItem('activeProject');
        if (activeProjectId) {
          showProject(activeProjectId);
        }
      }
      catch (error) {
        // Storage can be unavailable in some privacy modes; use the default page state.
      }
    }
  });
