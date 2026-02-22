document.addEventListener('DOMContentLoaded', () => {
  
  /* --- 1. Intercepter TOUS les formulaires d'ajout au panier (Produit + Cartes rapides) --- */
  // On utilise *="/cart/add" pour attraper les URL même si elles ont une langue (ex: /fr/cart/add)
  const addToCartForms = document.querySelectorAll('form[action*="/cart/add"]');

  addToCartForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // BLOCAGE STRICT de la redirection vers la page /cart

      // Trouver le bouton de soumission
      const submitBtn = form.querySelector('[name="add"], button[type="submit"]');
      if (!submitBtn) return;

      const originalText = submitBtn.textContent;
      
      // Feedback visuel
      submitBtn.textContent = 'Ajout...';
      submitBtn.disabled = true;

      // Récupérer les données du formulaire (ID variante + Quantité)
      const formData = new FormData(form);

      // Appel AJAX forcé vers Shopify
      fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then((item) => {
        // Succès ! On met à jour le tiroir et on l'ouvre
        if (window.CartDrawerManager) {
          window.CartDrawerManager.update();
        }
      })
      .catch((error) => {
        console.error('Erreur Shopify:', error);
        alert("Impossible d'ajouter ce produit. Il est peut-être en rupture de stock.");
      })
      .finally(() => {
        // Remise à zéro du bouton
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      });
    });
  });

  /* --- 2. Intercepter le clic sur l'icône panier dans le Header --- */
  const cartLinks = document.querySelectorAll('a[href*="/cart"]');
  
  cartLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Si le tiroir existe dans la page, on bloque le lien et on ouvre le tiroir
      if (document.getElementById('CartDrawer')) {
        e.preventDefault(); 
        if (window.CartDrawerManager) {
          window.CartDrawerManager.open();
        }
      }
    });
  });

});