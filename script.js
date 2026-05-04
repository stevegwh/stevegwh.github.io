function scrollToTargetOnLoad(elementId) {
    localStorage.setItem('scrollToElement', elementId);
  }

function showProject(elementId) {
    var projectList = document.getElementsByClassName('project');
    var alreadyActive = false;
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
        if (projectList[i] == targetElement)
        {
            if (projectList[i].style.display == 'block')
            {
                alreadyActive = true;
            }
        }
        projectList[i].style.display = 'none';
    }
    
    if (!alreadyActive)
    {
        targetElement.style.display = 'block';
    }
    else
    {  
        if (returnElement) {
            returnElement.style.display = 'none';
        }
        return;
    }
    
    if (projectList.length > 0 && returnElement)
    {
        returnElement.style.display = 'block';
    }


}
  
  window.addEventListener('DOMContentLoaded', function() {
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
