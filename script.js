function scrollToTargetOnLoad(elementId) {
    localStorage.setItem('scrollToElement', elementId);
  }

function showProject(elementId) {
    console.log("Function called");
    var projectList = document.getElementsByClassName('project');
    var alreadyActive = false;
    var targetElement = document.getElementById(elementId);
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
    
    if (projectList.length > 0)
    {
        var returnElement = document.getElementById("project-return");
        if (returnElement.style.display = 'none')
        {
            returnElement.style.display = 'block';
        }
        else
        {
            returnElement.style.display = 'none';
        }
    }


}
  
  window.addEventListener('DOMContentLoaded', function() {
    var elementId = localStorage.getItem('scrollToElement');
    showProject(elementId);
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