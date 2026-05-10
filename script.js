document.addEventListener('DOMContentLoaded', () => {
    initCustomModal();
    initGlobalLoader();

    // Dynamic Name Handling
    const userName = localStorage.getItem('traveloop_user');
    if (userName) {
        const welcomeGreeting = document.querySelector('.welcome-text h1');
        if (welcomeGreeting) {
            welcomeGreeting.innerHTML = `Hey, ${userName}! 👋`;
        }
        
        const profileNames = document.querySelectorAll('.profile span');
        profileNames.forEach(span => {
            span.innerHTML = `${userName} <i class="fa-solid fa-chevron-down"></i>`;
        });
        
        const profileHeaderName = document.querySelector('.profile-header h2');
        if (profileHeaderName) {
            profileHeaderName.textContent = userName;
        }
    }

    // Dynamic Trips Rendering (MySQL -> LocalStorage Fallback)
    const tripContainer = document.getElementById('dynamicTripsContainer');
    
    if (tripContainer) {
        async function fetchTrips() {
            let trips = [];
            try {
                // 1. Try to fetch from MySQL via Node Server
                const response = await fetch('http://localhost:3000/api/trips');
                if (!response.ok) throw new Error('API down');
                
                const dbTrips = await response.json();
                // Map DB schema to frontend format
                trips = dbTrips.map(t => ({
                    name: t.trip_name,
                    date: t.start_date,
                    image: t.cover_image || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=60"
                }));
            } catch (error) {
                // 2. Fallback to LocalStorage if Server is offline
                trips = JSON.parse(localStorage.getItem('traveloop_trips') || '[]');
            }

            if (trips.length > 0) {
                // Clear existing static mockup if dynamic trips exist
                tripContainer.innerHTML = '';
                
                trips.forEach(trip => {
                    const tripCard = document.createElement('div');
                    tripCard.className = 'trip-card';
                    tripCard.innerHTML = `
                        <img src="${trip.image}" alt="${trip.name}">
                        <div class="card-content">
                            <h4>${trip.name}</h4>
                            <p>${trip.date ? new Date(trip.date).toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}) : 'Upcoming'}</p>
                            <span class="tag">New</span>
                        </div>
                    `;
                    tripContainer.appendChild(tripCard);
                });
            }
        }
        fetchTrips();
    }

    // Add simple interactivity
    const tripCards = document.querySelectorAll('.trip-card');
    tripCards.forEach(card => {
        card.addEventListener('click', () => {
            const destination = card.querySelector('h4').textContent;
            showCustomModal(`Would you like to start planning a new trip to ${destination}?`, 'confirm', () => {
                navigateTo('create-trip.html');
            });
        });
    });
    
    // Animate budget circle
    const circle = document.querySelector('.circle');
    if (circle) {
        circle.style.animation = 'none';
        circle.offsetHeight; 
        circle.style.animation = null;
    }

    // Dynamic Search Filter Logic
    const searchInputs = document.querySelectorAll('.search-bar input');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.trip-card, .activity-card');
            
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(query)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    // Global hook for all empty links to simulate "working" buttons for the hackathon
    document.querySelectorAll('a[href="#"], button[onclick=""]').forEach(el => {
        el.addEventListener('click', (e) => {
            // Exclude specific authentication toggle links which have their own logic
            if(el.id === 'show-signup' || el.id === 'show-login' || el.id === 'show-reset' || el.id === 'show-login-from-reset') return; 
            
            e.preventDefault();
            alert("🚀 Feature Coming Soon!\n(This button is disabled for the Hackathon Prototype Demo)");
        });
    });

    // Filter buttons toggle (For Explore page)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = e.target.parentElement;
            if (parent && parent.classList.contains('filters-bar')) {
                // Visual toggle
                parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Filtering Logic
                const category = e.target.textContent.trim().toLowerCase();
                const activityCards = document.querySelectorAll('.activity-card[data-category]');
                
                activityCards.forEach(card => {
                    if (category === 'all' || category === 'filters' || category === 'all items') {
                        card.style.display = 'flex';
                    } else if (card.getAttribute('data-category') === category) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });

    // Logout Functionality
    document.querySelectorAll('.signout-link').forEach(link => {
        link.addEventListener('click', () => {
            localStorage.removeItem('traveloop_user');
            localStorage.removeItem('traveloop_trips');
            // JWT token isn't in localstorage currently, but this cleans the mock state!
        });
    });
});

// Profile Dropdown Toggle
function toggleDropdown() {
    const dropdown = document.getElementById("profileDropdown");
    if(dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Notification Dropdown Toggle
function toggleNotifications(e) {
    if(e) e.stopPropagation();
    const dropdown = document.getElementById("notificationDropdown");
    if(dropdown) {
        dropdown.classList.toggle("show");
    }
}

// Sidebar Toggle for Mobile
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Global Click Handler (closes sidebar and dropdown)
document.addEventListener('click', (e) => {
    // Close sidebar
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.querySelector('.hamburger-btn');
    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && hamburger && !hamburger.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }

    // Close Dropdowns
    if (!e.target.closest('.profile-dropdown-container') && !e.target.closest('.notification-container')) {
        const dropdowns = document.getElementsByClassName("profile-dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
            if (dropdowns[i].classList.contains('show')) {
                dropdowns[i].classList.remove('show');
            }
        }
    }
});

// Dashboard Trip Deletion Logic
window.deleteDashboardTrip = function(btnElement, event) {
    event.stopPropagation(); // prevent triggering the card's onclick navigation
    
    const tripCard = btnElement.closest('.trip-card');
    const destination = tripCard.querySelector('h4').textContent;
    
    showCustomModal(`Are you sure you want to delete your trip to ${destination}?`, 'confirm', () => {
        tripCard.style.opacity = '0';
        tripCard.style.transform = 'scale(0.9)';
        setTimeout(() => {
            tripCard.remove();
            showCustomModal(`Trip to ${destination} successfully deleted.`, 'alert');
        }, 300);
    });
};

// Dashboard Trip Editing Logic
window.editDashboardTrip = function(btnElement, event) {
    event.stopPropagation(); // prevent triggering the card's onclick navigation
    
    const tripCard = btnElement.closest('.trip-card');
    const destination = tripCard.querySelector('h4').textContent;
    
    showCustomModal(`Loading data for your ${destination} trip... Redirecting to editor.`, 'alert');
    
    setTimeout(() => {
        navigateTo('create-trip.html');
    }, 1500);
};

// Packing List Add Item Logic
window.addNewPackingItem = function() {
    const itemName = prompt("Enter the name of the new item to pack:");
    if (!itemName) return;
    
    const categoryName = prompt("Enter category (e.g. Clothing, Toiletries):", "Misc") || "Misc";
    
    const container = document.getElementById('packingListContainer');
    const addButton = container.querySelector('button');
    
    const newItemHTML = `
        <div class="check-item activity-card" data-category="${categoryName.toLowerCase()}" style="box-shadow: none; padding: 12px 0; margin: 0; border-bottom: 1px solid var(--border-color); border-radius: 0; background: transparent;">
            <input type="checkbox" class="custom-check">
            <span style="flex: 1; font-size: 1.05rem; transition: all 0.2s; color: var(--text-dark);">${itemName}</span>
            <span style="font-size: 0.8rem; background: var(--bg-main); padding: 4px 8px; border-radius: 4px; color: var(--text-muted);">${categoryName}</span>
        </div>
    `;
    
    addButton.insertAdjacentHTML('beforebegin', newItemHTML);
    showCustomModal(`Successfully added "${itemName}" to your packing list!`, 'alert');
};

// Custom Beautiful Modal Logic
function initCustomModal() {
    // Inject HTML for the modal if it doesn't exist
    if (!document.getElementById('traveloop-custom-modal')) {
        const modalHTML = `
            <div class="custom-modal-overlay" id="traveloop-custom-modal">
                <div class="custom-modal-box">
                    <div class="custom-modal-icon" id="custom-modal-icon">
                        <i class="fa-solid fa-bell"></i>
                    </div>
                    <div class="custom-modal-message" id="custom-modal-message">Message goes here</div>
                    <div class="custom-modal-buttons" id="custom-modal-buttons">
                        <!-- Buttons injected dynamically -->
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Override the default window.alert
    window.alert = function(message) {
        showCustomModal(message, 'alert');
    };
}

window.showCustomModal = function(message, type = 'alert', onConfirm = null) {
    const overlay = document.getElementById('traveloop-custom-modal');
    const msgEl = document.getElementById('custom-modal-message');
    const iconEl = document.getElementById('custom-modal-icon');
    const btnsEl = document.getElementById('custom-modal-buttons');

    if (!overlay) return;

    msgEl.textContent = message;
    
    // Set icon based on message content
    if(message.toLowerCase().includes('success') || message.toLowerCase().includes('saved') || message.toLowerCase().includes('added')) {
        iconEl.innerHTML = '<i class="fa-solid fa-check" style="color: #10B981;"></i>';
        iconEl.style.background = 'rgba(16, 185, 129, 0.1)';
    } else if (message.toLowerCase().includes('soon') || message.toLowerCase().includes('disabled')) {
        iconEl.innerHTML = '<i class="fa-solid fa-rocket" style="color: #F59E0B;"></i>';
        iconEl.style.background = 'rgba(245, 158, 11, 0.1)';
    } else if (type === 'confirm') {
        iconEl.innerHTML = '<i class="fa-solid fa-plane-departure" style="color: #38BDF8;"></i>';
        iconEl.style.background = 'rgba(56, 189, 248, 0.1)';
    } else {
        iconEl.innerHTML = '<i class="fa-solid fa-bell" style="color: #38BDF8;"></i>';
        iconEl.style.background = 'rgba(56, 189, 248, 0.1)';
    }

    // Build buttons
    btnsEl.innerHTML = '';
    
    if (type === 'confirm') {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'custom-modal-btn btn-cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = () => overlay.classList.remove('show');

        const confirmBtn = document.createElement('button');
        confirmBtn.className = 'custom-modal-btn btn-primary';
        confirmBtn.textContent = 'Yes, Plan Trip';
        confirmBtn.onclick = () => {
            overlay.classList.remove('show');
            if (onConfirm) onConfirm();
        };

        btnsEl.appendChild(cancelBtn);
        btnsEl.appendChild(confirmBtn);
    } else {
        const okBtn = document.createElement('button');
        okBtn.className = 'custom-modal-btn btn-primary';
        okBtn.textContent = 'Awesome!';
        okBtn.onclick = () => overlay.classList.remove('show');
        btnsEl.appendChild(okBtn);
    }

    overlay.classList.add('show');
};

// Global Animated Loader Logic
function initGlobalLoader() {
    if(!document.getElementById('traveloop-global-loader')) {
        const loaderHTML = `
            <div class="global-loader" id="traveloop-global-loader">
                <i class="fa-solid fa-infinity"></i>
                <h2>traveloop</h2>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loaderHTML);
    }

    // Intercept sidebar navigation links
    document.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('javascript')) {
                e.preventDefault();
                navigateTo(href);
            }
        });
    });
}

window.navigateTo = function(url) {
    const loader = document.getElementById('traveloop-global-loader');
    if(loader) {
        loader.classList.add('active');
        setTimeout(() => {
            window.location.href = url;
        }, 1000); // 1.0s loading animation delay
    } else {
        window.location.href = url;
    }
};
