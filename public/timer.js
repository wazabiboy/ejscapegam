document.addEventListener('DOMContentLoaded', async () => {
    const timerElement = document.getElementById('timer');
  
    const updateTimer = async () => {
      const response = await fetch('/time/1'); // Remplacez 1 par l'ID utilisateur réel
      const data = await response.json();
  
      if (!data.success) {
        window.location.href = '/fail.html';
        return;
      }
  
      const timeRemaining = data.timeRemaining;
      const minutes = Math.floor(timeRemaining / 60000);
      const seconds = Math.floor((timeRemaining % 60000) / 1000);
      timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
  
    setInterval(updateTimer, 1000);
    updateTimer();
  });
  