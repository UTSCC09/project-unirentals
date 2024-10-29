document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded!");
    const signInButton = document.getElementById('sign-in-button');
    const signInContainer = document.getElementById('sign-in-container');
    const closeButton = document.getElementById('close-button');

  
    signInButton.addEventListener('click', (event) => {
      event.preventDefault();
      signInContainer.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
      console.log("Close button pressed");
      signInContainer.classList.add('hidden');
    });
  });