// JavaScript à mettre dans <script> ou fichier JS séparé
window.addEventListener('deviceorientation', (event) => {
  // Gamma : inclinaison gauche/droite
  // Beta : inclinaison avant/arrière
  const gamma = event.gamma || 0; 
  const beta = event.beta || 0;

  // On limite la translation à ±15px par exemple
  const maxShift = 15;
  const xShift = Math.max(Math.min(gamma, 30), -30) / 30 * maxShift;
  const yShift = Math.max(Math.min(beta, 30), -30) / 30 * maxShift;

  document.body.style.backgroundPosition = `calc(50% + ${xShift}px) calc(50% + ${yShift}px)`;
});
