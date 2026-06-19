/**
 * Packages Renderer — Dynamic package cards for customer page
 *
 * Fetches packages from Firebase and renders them as cards.
 * Falls back to hardcoded data if Firebase is unavailable.
 *
 * Architecture: ES Module, uses window.FirebaseService
 */

(function() {
  'use strict';

  var FALLBACK_PACKAGES = {
    'paket_hemat': {
      name: 'Paket Lengkap',
      description: 'Mie Ayam Biasa + Es Teh Manis',
      icon: '🍜',
      items: ['mie_ayam_biasa', 'es_teh_manis'],
      itemNames: ['Mie Ayam Biasa', 'Es Teh Manis'],
      price: 13000,
      tag: 'Basic',
      isFeatured: false,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Lengkap',
      order: 1
    },
    'paket_favorit': {
      name: 'Paket Favorit',
      description: 'Mie Ayam Pangsit + Es Teh Manis',
      icon: '🔥',
      items: ['mie_ayam_pangsit', 'es_teh_manis'],
      itemNames: ['Mie Ayam Pangsit', 'Es Teh Manis'],
      price: 15000,
      tag: 'Best Seller',
      isFeatured: true,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Favorit',
      order: 2
    },
    'paket_kenyang': {
      name: 'Paket Kenyang',
      description: 'Mie Ayam Komplit + Es Teh Manis',
      icon: '😋',
      items: ['mie_ayam_komplit', 'es_teh_manis'],
      itemNames: ['Mie Ayam Komplit', 'Es Teh Manis'],
      price: 18000,
      tag: 'Puas',
      isFeatured: false,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Kenyang',
      order: 3
    },
    'paket_spesial': {
      name: 'Paket Spesial',
      description: 'Mie Ayam Komplit + Es Nutrisari',
      icon: '🎁',
      items: ['mie_ayam_komplit', 'es_nutrisari'],
      itemNames: ['Mie Ayam Komplit', 'Es Nutrisari'],
      price: 18000,
      tag: 'Spesial',
      isFeatured: false,
      isActive: true,
      whatsappMessage: 'Halo Mie Ayam Lariska, saya mau pesan Paket Spesial',
      order: 4
    }
  };

  var container = document.getElementById('packages-container');
  if (!container) return;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function resolveItemNames(pkg, menuData) {
    if (pkg.itemNames && pkg.itemNames.length > 0) return pkg.itemNames;
    if (!menuData || !pkg.items) return [];
    return pkg.items.map(function(id) {
      return (menuData[id] && menuData[id].name) ? menuData[id].name : id;
    });
  }

  function buildWhatsAppLink(pkg) {
    var msg = pkg.whatsappMessage || 'Halo Mie Ayam Lariska, saya mau pesan ' + pkg.name;
    return 'https://wa.me/6281364856560?text=' + encodeURIComponent(msg);
  }

  function renderPackages(packagesData, menuData) {
    var activePackages = [];
    Object.keys(packagesData).forEach(function(id) {
      var pkg = packagesData[id];
      if (pkg && pkg.isActive) {
        activePackages.push({ id: id, data: pkg });
      }
    });

    activePackages.sort(function(a, b) {
      return (a.data.order || 99) - (b.data.order || 99);
    });

    var featured = null;
    var regular = [];

    activePackages.forEach(function(entry) {
      if (entry.data.isFeatured) {
        featured = entry;
      } else {
        regular.push(entry);
      }
    });

    var html = '';

    function renderCard(entry) {
      var pkg = entry.data;
      var isFeatured = pkg.isFeatured;
      var cardClass = isFeatured ? 'packages__card packages__card--featured' : 'packages__card';
      var itemNames = resolveItemNames(pkg, menuData);
      var waLink = buildWhatsAppLink(pkg);
      var priceK = Math.round(pkg.price / 1000);

      var cardHtml = '<div class="' + cardClass + '">';

      if (isFeatured) {
        cardHtml += '<div class="packages__card-badge">⭐ Paling Laris</div>';
      }

      cardHtml += '<div class="packages__card-header">';
      cardHtml += '<span class="packages__card-icon">' + escapeHtml(pkg.icon || '') + '</span>';
      cardHtml += '<h3 class="packages__card-name">' + escapeHtml(pkg.name) + '</h3>';
      cardHtml += '<span class="packages__card-tag">' + escapeHtml(pkg.tag || '') + '</span>';
      cardHtml += '</div>';

      if (itemNames.length > 0) {
        cardHtml += '<ul class="packages__card-items">';
        itemNames.forEach(function(item) {
          cardHtml += '<li>' + escapeHtml(item) + '</li>';
        });
        cardHtml += '</ul>';
      } else if (pkg.description) {
        cardHtml += '<p class="packages__card-description">' + escapeHtml(pkg.description) + '</p>';
      }

      cardHtml += '<div class="packages__card-pricing">';
      cardHtml += '<p class="packages__card-price"><span class="price">' + priceK + 'k</span></p>';
      cardHtml += '<span class="packages__badge--lengkap">Lengkap</span>';
      cardHtml += '</div>';

      cardHtml += '<a href="' + waLink + '" class="btn btn--primary packages__card-btn" target="_blank" rel="noopener">';
      cardHtml += '<span>Pesan via WhatsApp</span>';
      cardHtml += '<span class="btn__icon">💬</span>';
      cardHtml += '</a>';
      cardHtml += '</div>';
      return cardHtml;
    }

    // Build featured and regular card HTML separately
    var featuredHtml = '';
    var regularHtml = '';

    if (featured) featuredHtml = renderCard(featured);
    regular.forEach(function(entry) { regularHtml += renderCard(entry); });

    // Assemble final HTML with featured above grid
    if (featuredHtml) {
      html += '<div class="packages__featured">' + featuredHtml + '</div>';
    }
    html += '<div class="packages__grid">' + regularHtml + '</div>';

    container.innerHTML = html;
  }

  function loadPackages() {
    if (typeof window.FirebaseService === 'undefined') return false;

    var FS = window.FirebaseService;

    FS.seedInitialPackages().then(function() {
      return Promise.all([FS.getPackages(), FS.getAllMenu()]);
    }).then(function(results) {
      var packagesData = results[0];
      var menuData = results[1];
      renderPackages(packagesData, menuData);

      FS.onAllPackagesChange(function(updatedPackages) {
        FS.getAllMenu().then(function(md) {
          renderPackages(updatedPackages, md);
        });
      });
    }).catch(function(err) {
      console.warn('[packages] Firebase error, using fallback:', err);
      renderPackages(FALLBACK_PACKAGES, null);
    });

    return true;
  }

  // Try loading with FirebaseService, with 5s fallback timeout
  var loaded = false;
  var fallbackTimer = setTimeout(function() {
    if (!loaded) {
      console.warn('[packages] FirebaseService timeout, rendering fallback');
      renderPackages(FALLBACK_PACKAGES, null);
    }
  }, 5000);

  function attemptLoad() {
    if (loaded) return;
    loaded = loadPackages();
    if (loaded) clearTimeout(fallbackTimer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptLoad);
  } else {
    attemptLoad();
  }

  // Also listen for FirebaseService ready event
  window.addEventListener('FirebaseServiceReady', attemptLoad);

  // Poll for FirebaseService in case it loads after DOMContentLoaded
  var pollCount = 0;
  var pollInterval = setInterval(function() {
    pollCount++;
    if (loaded || pollCount > 50) {
      clearInterval(pollInterval);
      return;
    }
    attemptLoad();
  }, 100);
})();
