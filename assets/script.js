if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('assets/sw.js')
    .then(() => console.log('SW registered'))
    .catch(err => console.log('SW failed', err));
}

document.addEventListener("DOMContentLoaded", () => {
  const badge = document.getElementById("badge-github");

  fetch("https://api.github.com/users/m-idriss")
    .then(response => response.json())
    .then(data => {
      const repoCount = data.public_repos;

      badge.textContent = repoCount;

      badge.style.display = repoCount > 0 ? "flex" : "none";
    })
    .catch(error => {
      console.error("Error fetching GitHub data:", error);
    });
});
