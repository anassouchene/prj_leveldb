document.getElementById('addPersonForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const key = document.getElementById('key').value;
    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const age = document.getElementById('age').value;
  
    const response = await fetch('http://localhost:4200/api/personnes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key, nom, prenom, age })
    });
  
    const data = await response.json();
   
  });
  
  document.getElementById('getPersonForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const key = document.getElementById('getKey').value;
  
    const response = await fetch(`http://localhost:4200/api/personnes/${key}`);
    const data = await response.json();
  
    const resultDiv = document.getElementById('personResult');
    if (data.message) {
      resultDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
      resultDiv.innerHTML = `
        <p><strong>Nom:</strong> ${data.nom}</p>
        <p><strong>Prénom:</strong> ${data.prenom}</p>
        <p><strong>Âge:</strong> ${data.age}</p>
      `;
    }
  });
// Fonction pour afficher une notification
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.classList.add("notification", type);
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.5s ease-out forwards";
    notification.addEventListener("animationend", () => {
      notification.remove();
    });
  }, 3000);
}

// Événement pour l'ajout d'une personne
document.getElementById('addPersonForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const key = document.getElementById('key').value;
  const nom = document.getElementById('nom').value;
  const prenom = document.getElementById('prenom').value;
  const age = document.getElementById('age').value;

  try {
    const response = await fetch('http://localhost:4200/api/personnes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key, nom, prenom, age })
    });

    // Vérifier la réponse pour afficher la notification appropriée
    if (response.status === 409) {
      // Si la clé existe déjà
      showNotification("La clé existe déjà. Veuillez en utiliser une autre.", "error");
    } else if (response.ok) {
      // Si l'ajout est réussi
      showNotification("Employe ajoutée avec succès!", "success");
    } else {
      // En cas d'autre erreur
      showNotification("Erreur lors de l'ajout de la personne.", "error");
    }
  } catch (error) {
    showNotification("Erreur de connexion au serveur.", "error");
  }
});

// Événement pour la récupération d'une personne
document.getElementById('getPersonForm').addEventListener('submit', async function (event) {
  event.preventDefault();
  
  const key = document.getElementById('getKey').value;

  try {
    const response = await fetch(`http://localhost:4200/api/personnes/${key}`);
    const data = await response.json();

    const resultDiv = document.getElementById('personResult');
    if (data.message) {
      resultDiv.innerHTML = `<p>${data.message}</p>`;
      showNotification(data.message, "error"); // Afficher une notification si non trouvé
    } else {
      resultDiv.innerHTML = `
        <p><strong>Nom:</strong> ${data.nom}</p>
        <p><strong>Prénom:</strong> ${data.prenom}</p>
        <p><strong>Âge:</strong> ${data.age}</p>
      `;
      showNotification("Employe récupérée avec succès!", "success");
    }
  } catch (error) {
    showNotification("Erreur lors de la récupération des informations.", "error");
  }
});
