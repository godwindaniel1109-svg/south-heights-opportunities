// Nigerian Provision Products Database - 100+ Products
const nigerianProducts = [
    // Food Staples - Rice & Grains
    { id: 1, name: "Royal Stallion Rice 50kg", category: "Food Staples", price: 35000, description: "Premium Nigerian rice" },
    { id: 2, name: "Mama Gold Rice 25kg", category: "Food Staples", price: 18000, description: "Quality Nigerian rice" },
    { id: 3, name: "Caprice Rice 10kg", category: "Food Staples", price: 7500, description: "Affordable Nigerian rice" },
    { id: 4, name: "Golden Penny Semovita 2kg", category: "Food Staples", price: 1200, description: "Quality semolina" },
    { id: 5, name: "Honeywell Semovita 2kg", category: "Food Staples", price: 1300, description: "Nigerian semolina" },
    { id: 6, name: "Dangote Spaghetti 500g", category: "Food Staples", price: 450, description: "Nigerian pasta" },
    { id: 7, name: "Golden Penny Semolina 5kg", category: "Food Staples", price: 2800, description: "Bulk semolina" },
    { id: 8, name: "Mama Gold Rice 5kg", category: "Food Staples", price: 4500, description: "Small pack rice" },
    { id: 9, name: "Uncle Bens Rice 1kg", category: "Food Staples", price: 1800, description: "Popular rice brand" },
    { id: 10, name: "Basmati Rice 1kg", category: "Food Staples", price: 2200, description: "Imported rice" },
    { id: 11, name: "Ofada Rice 5kg", category: "Food Staples", price: 5000, description: "Local Nigerian rice" },
    { id: 12, name: "Abakaliki Rice 10kg", category: "Food Staples", price: 8000, description: "Eastern Nigerian rice" },
    
    // Cooking Oil & Condiments
    { id: 13, name: "Kings Vegetable Oil 5L", category: "Food Staples", price: 4500, description: "Cooking oil" },
    { id: 14, name: "Devon Vegetable Oil 5L", category: "Food Staples", price: 4200, description: "Quality cooking oil" },
    { id: 15, name: "Power Oil 5L", category: "Food Staples", price: 4800, description: "Popular cooking oil" },
    { id: 16, name: "Gino Tomato Paste 1kg", category: "Food Staples", price: 850, description: "Tomato paste" },
    { id: 17, name: "Jumbo Tomato Paste 1kg", category: "Food Staples", price: 900, description: "Large tomato paste" },
    { id: 18, name: "Maggi Cubes 4x4", category: "Food Staples", price: 150, description: "Seasoning cubes" },
    { id: 19, name: "Knorr Cubes 4x4", category: "Food Staples", price: 160, description: "Alternative seasoning" },
    { id: 20, name: "Dangote Salt 1kg", category: "Food Staples", price: 200, description: "Refined salt" },
    { id: 21, name: "Blueband Margarine 500g", category: "Food Staples", price: 850, description: "Margarine spread" },
    { id: 22, name: "Tropical Starch 1kg", category: "Food Staples", price: 800, description: "Food thickener" },
    { id: 23, name: "Curry Powder 100g", category: "Food Staples", price: 200, description: "Spice powder" },
    { id: 24, name: "Thyme 100g", category: "Food Staples", price: 300, description: "Dried thyme" },
    { id: 25, name: "Ginger Powder 100g", category: "Food Staples", price: 250, description: "Ground ginger" },
    { id: 26, name: "Garlic Powder 100g", category: "Food Staples", price: 280, description: "Ground garlic" },
    { id: 27, name: "Onion Powder 100g", category: "Food Staples", price: 220, description: "Dehydrated onion" },
    { id: 28, name: "Groundnut Oil 1L", category: "Food Staples", price: 1500, description: "Local cooking oil" },
    { id: 29, name: "Palmoil 5L", category: "Food Staples", price: 3500, description: "Red palm oil" },
    { id: 30, name: "Garri (Ijebu) 5kg", category: "Food Staples", price: 2500, description: "Traditional Nigerian staple" },
    { id: 31, name: "Garri (White) 5kg", category: "Food Staples", price: 2300, description: "White garri" },
    { id: 32, name: "Ewa Aganyin Beans 1kg", category: "Food Staples", price: 2000, description: "Pre-cooked beans" },
    { id: 33, name: "Brown Beans 5kg", category: "Food Staples", price: 3500, description: "Nigerian beans" },
    { id: 34, name: "Black Eyed Beans 5kg", category: "Food Staples", price: 3200, description: "Local beans" },
    { id: 35, name: "Soyabeans 5kg", category: "Food Staples", price: 2800, description: "Protein rich beans" },
    
    // Beverages - Soft Drinks
    { id: 36, name: "Coca Cola 50cl", category: "Beverages", price: 200, description: "Original coke" },
    { id: 37, name: "Fanta Orange 50cl", category: "Beverages", price: 200, description: "Orange soda" },
    { id: 38, name: "Sprite 50cl", category: "Beverages", price: 200, description: "Lemon soda" },
    { id: 39, name: "Maltina 50cl", category: "Beverages", price: 250, description: "Malt drink" },
    { id: 40, name: "Lucozade Boost 50cl", category: "Beverages", price: 300, description: "Energy drink" },
    { id: 41, name: "5 Alive 50cl", category: "Beverages", price: 250, description: "Fruit drink" },
    { id: 42, name: "Mirinda 50cl", category: "Beverages", price: 200, description: "Orange drink" },
    { id: 43, name: "Schweppes 50cl", category: "Beverages", price: 250, description: "Bitter lemon" },
    { id: 44, name: "Pepsi 50cl", category: "Beverages", price: 200, description: "Cola drink" },
    { id: 45, name: "7Up 50cl", category: "Beverages", price: 200, description: "Lemon drink" },
    
    // Beverages - Malt & Energy
    { id: 46, name: "Guinness Stout 50cl", category: "Beverages", price: 400, description: "Nigerian beer" },
    { id: 47, name: "Star Lager 50cl", category: "Beverages", price: 350, description: "Popular beer" },
    { id: 48, name: "Life Beer 50cl", category: "Beverages", price: 250, description: "Affordable beer" },
    { id: 49, name: "Hero Lager 50cl", category: "Beverages", price: 300, description: "Nigerian beer" },
    { id: 50, name: "Turbo King 50cl", category: "Beverages", price: 280, description: "Energy drink" },
    { id: 51, name: "Power Horse 50cl", category: "Beverages", price: 320, description: "Energy drink" },
    { id: 52, name: "Red Bull 50cl", category: "Beverages", price: 500, description: "Imported energy" },
    { id: 53, name: "Monster Energy 50cl", category: "Beverages", price: 550, description: "Energy drink" },
    
    // Beverages - Juices & Water
    { id: 54, name: "Chivita Orange Juice 1L", category: "Beverages", price: 1200, description: "Orange juice" },
    { id: 55, name: "Chivita Apple Juice 1L", category: "Beverages", price: 1200, description: "Apple juice" },
    { id: 56, name: "Chivita Pineapple Juice 1L", category: "Beverages", price: 1200, description: "Pineapple juice" },
    { id: 57, name: "Pure Water Sachet", category: "Beverages", price: 20, description: "Pure water" },
    { id: 58, name: "Eva Water 75cl", category: "Beverages", price: 150, description: "Bottled water" },
    { id: 59, name: "Aquafina Water 75cl", category: "Beverages", price: 200, description: "Premium water" },
    { id: 60, name: "La Casera 50cl", category: "Beverages", price: 180, description: "Apple drink" },
    
    // Dairy Products
    { id: 61, name: "Peak Milk Powder 400g", category: "Dairy", price: 1800, description: "Full cream milk" },
    { id: 62, name: "Cowbell Milk Powder 400g", category: "Dairy", price: 1600, description: "Affordable milk" },
    { id: 63, name: "Lactogen 400g", category: "Dairy", price: 2200, description: "Baby milk" },
    { id: 64, name: "Three Crowns Milk 400g", category: "Dairy", price: 1700, description: "Quality milk" },
    { id: 65, name: "Dano Milk Powder 400g", category: "Dairy", price: 1500, description: "Budget milk" },
    { id: 66, name: "Nigerian Yoghurt 150ml", category: "Dairy", price: 300, description: "Local yoghurt" },
    { id: 67, name: "Hollandia Yoghurt 150ml", category: "Dairy", price: 350, description: "Imported yoghurt" },
    { id: 68, name: "Loya Milk Powder 400g", category: "Dairy", price: 1900, description: "Nigerian milk" },
    { id: 69, name: "Blueband Margarine 250g", category: "Dairy", price: 450, description: "Spread" },
    { id: 70, name: "Flora Margarine 250g", category: "Dairy", price: 500, description: "Quality spread" },
    
    // Snacks & Confectionery
    { id: 71, name: "Indomie Noodles 70g", category: "Snacks", price: 120, description: "Instant noodles" },
    { id: 72, name: "Golden Morn 500g", category: "Snacks", price: 850, description: "Nigerian noodles" },
    { id: 73, name: "Corn Flakes 500g", category: "Snacks", price: 1200, description: "Breakfast cereal" },
    { id: 74, name: "Bournvita 500g", category: "Snacks", price: 1800, description: "Chocolate drink" },
    { id: 75, name: "Milo 500g", category: "Snacks", price: 2000, description: "Malt drink" },
    { id: 76, name: "Oreo Biscuits 150g", category: "Snacks", price: 450, description: "Chocolate biscuits" },
    { id: 77, name: "Cabin Biscuits 200g", category: "Snacks", price: 350, description: "Nigerian biscuits" },
    { id: 78, name: "Digestive Biscuits 200g", category: "Snacks", price: 400, description: "Plain biscuits" },
    { id: 79, name: "Crackers 200g", category: "Snacks", price: 380, description: "Savory crackers" },
    { id: 80, name: "Chin Chin 200g", category: "Snacks", price: 500, description: "Nigerian snack" },
    { id: 81, name: "Puff Puff 200g", category: "Snacks", price: 450, description: "Nigerian pastry" },
    { id: 82, name: "Meat Pie", category: "Snacks", price: 800, description: "Nigerian pie" },
    { id: 83, name: "Egg Roll", category: "Snacks", price: 500, description: "Nigerian snack" },
    { id: 84, name: "Sausage Roll", category: "Snacks", price: 600, description: "Nigerian snack" },
    { id: 85, name: "Gala", category: "Snacks", price: 400, description: "Nigerian snack" },
    
    // Canned Foods
    { id: 86, name: "Geisha Sardine 155g", category: "Canned Foods", price: 600, description: "Canned fish" },
    { id: 87, name: "Titus Sardine 155g", category: "Canned Foods", price: 550, description: "Alternative sardine" },
    { id: 88, name: "Baked Beans 425g", category: "Canned Foods", price: 850, description: "Canned beans" },
    { id: 89, name: "Corned Beef 340g", category: "Canned Foods", price: 1200, description: "Canned meat" },
    { id: 90, name: "Heinz Baked Beans 425g", category: "Canned Foods", price: 950, description: "Imported beans" },
    { id: 91, name: "Princes Corned Beef 340g", category: "Canned Foods", price: 1100, description: "Quality canned" },
    
    // Household Items
    { id: 92, name: "OMO Detergent 1kg", category: "Household", price: 1200, description: "Laundry detergent" },
    { id: 93, name: "Ariel Detergent 1kg", category: "Household", price: 1300, description: "Quality detergent" },
    { id: 94, name: "Vim Scouring Powder 500g", category: "Household", price: 450, description: "Cleaning powder" },
    { id: 95, name: "Hypo Bleach 1L", category: "Household", price: 600, description: "Household bleach" },
    { id: 96, name: "Dettol Antiseptic 500ml", category: "Household", price: 1200, description: "Antiseptic" },
    { id: 97, name: "Harpic Toilet Cleaner 750ml", category: "Household", price: 850, description: "Toilet cleaner" },
    { id: 98, name: "Robb Liquid Soap 1L", category: "Household", price: 800, description: "Liquid soap" },
    { id: 99, name: "Klin Liquid Soap 1L", category: "Household", price: 750, description: "Nigerian soap" },
    { id: 100, name: "Morning Fresh 1L", category: "Household", price: 900, description: "Disinfectant" },
    
    // Medications & Health
    { id: 101, name: "Paracetamol 500mg", category: "Medications", price: 150, description: "Pain relief" },
    { id: 102, name: "Ibuprofen 400mg", category: "Medications", price: 200, description: "Anti-inflammatory" },
    { id: 103, name: "Aspirin 75mg", category: "Medications", price: 180, description: "Blood thinner" },
    { id: 104, name: "Vitamin C 500mg", category: "Medications", price: 250, description: "Vitamin supplement" },
    { id: 105, name: "Multivitamins 30tabs", category: "Medications", price: 1500, description: "Daily vitamins" },
    { id: 106, name: "Calcium Tablets 60tabs", category: "Medications", price: 2000, description: "Bone health" },
    { id: 107, name: "Iron Tablets 30tabs", category: "Medications", price: 1200, description: "Blood health" },
    { id: 108, name: "Zinc Tablets 30tabs", category: "Medications", price: 800, description: "Immune support" },
    { id: 109, name: "Omega 3 60caps", category: "Medications", price: 3500, description: "Heart health" },
    { id: 110, name: "Probiotics 30caps", category: "Medications", price: 2500, description: "Gut health" },
    
    // Personal Care
    { id: 111, name: "Dettol Soap 125g", category: "Personal Care", price: 400, description: "Antibacterial soap" },
    { id: 112, name: "Lifebuoy Soap 125g", category: "Personal Care", price: 350, description: "Bathing soap" },
    { id: 113, name: "Dove Soap 125g", category: "Personal Care", price: 450, description: "Moisturizing soap" },
    { id: 114, name: "Lux Soap 125g", category: "Personal Care", price: 300, description: "Beauty soap" },
    { id: 115, name: "CloseUp Toothpaste 100ml", category: "Personal Care", price: 350, description: "Mint toothpaste" },
    { id: 116, name: "Colgate Toothpaste 100ml", category: "Personal Care", price: 400, description: "Fluoride toothpaste" },
    { id: 117, name: "Oral B Toothpaste 100ml", category: "Personal Care", price: 450, description: "Quality toothpaste" },
    { id: 118, name: "Nivea Cream 200ml", category: "Personal Care", price: 1200, description: "Body cream" },
    { id: 119, name: "Vaseline Petroleum Jelly 100ml", category: "Personal Care", price: 600, description: "Skin protection" },
    { id: 120, name: "Shea Butter 100ml", category: "Personal Care", price: 800, description: "Natural moisturizer" },
    { id: 121, name: "Coconut Oil 100ml", category: "Personal Care", price: 700, description: "Hair oil" },
    { id: 122, name: "Dettol Hand Sanitizer 50ml", category: "Personal Care", price: 500, description: "Hand sanitizer" },
    { id: 123, name: "Face Masks 10pcs", category: "Personal Care", price: 2000, description: "Protection masks" },
    { id: 124, name: "Gloves 10pcs", category: "Personal Care", price: 1500, description: "Disposable gloves" },
    { id: 125, name: "Thermometer", category: "Personal Care", price: 800, description: "Digital thermometer" }
];

// Shopping Cart Functionality
let cart = [];
let cartCount = 0;
let wishlist = [];
let messageCount = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    setupEventListeners();
    updateCartUI();
    setupLoadingOverlay();
});

// Event Listeners
function setupEventListeners() {
    // Cart functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCart) closeCart.addEventListener('click', closeCartSidebar);
    
    // Chat functionality
    const chatToggle = document.querySelector('.chat-toggle');
    const chatBox = document.querySelector('.chat-box');
    const minimizeChat = document.querySelector('.minimize-chat');
    const chatInput = document.querySelector('.chat-input input');
    const sendMessageBtn = document.querySelector('.chat-input button');
    
    if (chatToggle) chatToggle.addEventListener('click', toggleChat);
    if (minimizeChat) minimizeChat.addEventListener('click', minimizeChatBox);
    if (sendMessageBtn) sendMessageBtn.addEventListener('click', sendMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') sendMessage();
        });
    }
    
    // Ask Amount functionality
    const askAmountBtn = document.getElementById('askAmountBtn');
    if (askAmountBtn) {
        askAmountBtn.addEventListener('click', openAmountModal);
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResults = document.getElementById('searchResults');
    
    if (searchBtn) searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                performSearch(query, true);
            } else if (searchResults) {
                searchResults.classList.remove('active');
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch(searchInput.value);
        });
    }
    
    // Product actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId) || Math.floor(Math.random() * 20) + 1;
            addToCart(productId);
        }
        
        if (e.target.classList.contains('wishlist-btn')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId) || Math.floor(Math.random() * 20) + 1;
            toggleWishlist(productId, e.target);
        }
        
        if (e.target.classList.contains('comment-btn')) {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId) || Math.floor(Math.random() * 20) + 1;
            openComments(productId);
        }
    });
    
    // Scroll to top
    const scrollToTop = document.getElementById('scrollToTop');
    if (scrollToTop) {
        scrollToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTop.classList.add('visible');
            } else {
                scrollToTop.classList.remove('visible');
            }
        });
    }
}

// Cart Functions
function openCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) cartSidebar.classList.add('active');
}

function closeCartSidebar() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) cartSidebar.classList.remove('active');
}

function addToCart(productId) {
    const product = nigerianProducts.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    saveCartToStorage();
    showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCartToStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
            saveCartToStorage();
        }
    }
}

function updateCartUI() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total span');
    const cartCountBadge = document.querySelector('.cart-count');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    let total = 0;
    cartCount = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartCount += item.quantity;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₦${item.price.toLocaleString()}</p>
                </div>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})" style="background: #ff4757; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    if (cartTotal) cartTotal.textContent = `₦${total.toLocaleString()}`;
    if (cartCountBadge) cartCountBadge.textContent = cartCount;
}

function saveCartToStorage() {
    localStorage.setItem('chetachiCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('chetachiCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Chat Functions
function toggleChat() {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) chatBox.classList.toggle('active');
}

function minimizeChatBox() {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) chatBox.classList.remove('active');
}

function sendMessage() {
    const chatInput = document.querySelector('.chat-input input');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (!chatInput || !chatMessages) return;
    
    const message = chatInput.value.trim();
    if (message) {
        addMessageToChat(message, 'user');
        chatInput.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            const responses = [
                'Thank you for your message! Our team will get back to you soon.',
                'How can I help you with your shopping today?',
                'Feel free to ask about our products or services!',
                'Is there anything specific you\'re looking for?'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessageToChat(randomResponse, 'bot');
        }, 1000);
    }
}

function addMessageToChat(message, sender) {
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Search Function
function performSearch(query, showResults = false) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    if (!query || query.trim().length < 2) {
        searchResults.classList.remove('active');
        return;
    }
    
    const searchTerm = query.toLowerCase().trim();
    const filteredProducts = nigerianProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    if (filteredProducts.length > 0) {
        displaySearchResults(filteredProducts, query);
        if (!showResults) {
            showToast(`Found ${filteredProducts.length} Nigerian products matching "${query}"`);
        }
    } else {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No Nigerian provision products found for "${query}"</p>
            </div>
        `;
        searchResults.classList.add('active');
        if (!showResults) {
            showToast(`No products found for "${query}"`);
        }
    }
}

function displaySearchResults(products, query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;
    
    const resultsHTML = products.slice(0, 5).map(product => `
        <div class="search-result-item" onclick="addToCart(${product.id})">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <span class="search-result-category">${product.category}</span>
                <p class="search-result-price">₦${product.price.toLocaleString()}</p>
            </div>
            <button class="quick-add-btn">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `).join('');
    
    searchResults.innerHTML = `
        <div class="search-results-header">
            <span>Nigerian Provision Products</span>
            <small>${products.length} results</small>
        </div>
        ${resultsHTML}
        <div class="search-all-results">
            <a href="products.html?q=${encodeURIComponent(query)}">View all results</a>
        </div>
    `;
    
    searchResults.classList.add('active');
}

// Utility Functions
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #0d3b2e;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function toggleWishlist(productId, button) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.color = '#667eea';
    } else {
        wishlist.push(productId);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.color = '#ff4757';
    }
}

function openComments(productId) {
    showToast(`Comments feature coming soon for product ${productId}`);
}

// Loading Overlay
function setupLoadingOverlay() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) return;
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingOverlay.style.opacity = '0';
            loadingOverlay.style.visibility = 'hidden';
        }, 500);
    });
}

// Ask Amount Modal
function openAmountModal() {
    const modal = document.createElement('div');
    modal.className = 'amount-modal';
    modal.innerHTML = `
        <div class="amount-modal-content">
            <div class="amount-modal-header">
                <h3>Ask About Product Amount</h3>
                <button class="close-modal" onclick="closeAmountModal()">&times;</button>
            </div>
            <div class="amount-modal-body">
                <p>Enter product name to check available quantity and pricing:</p>
                <div class="amount-input-group">
                    <input type="text" id="amountProductInput" placeholder="Enter product name...">
                    <button onclick="checkProductAmount()">Check Amount</button>
                </div>
                <div id="amountResult" class="amount-result"></div>
            </div>
            <div class="amount-modal-footer">
                <button class="message-chetachi-btn" onclick="messageChetachi()">
                    <i class="fas fa-comments"></i>
                    Message Chetachi Directly
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
}

function closeAmountModal() {
    const modal = document.querySelector('.amount-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    }
}

function checkProductAmount() {
    const input = document.getElementById('amountProductInput');
    const result = document.getElementById('amountResult');
    
    if (!input || !result) return;
    
    const productName = input.value.trim().toLowerCase();
    const product = nigerianProducts.find(p => 
        p.name.toLowerCase().includes(productName) || 
        p.category.toLowerCase().includes(productName)
    );
    
    if (product) {
        result.innerHTML = `
            <div class="product-found">
                <h4>${product.name}</h4>
                <div class="product-details">
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> ₦${product.price.toLocaleString()}</p>
                    <p><strong>Description:</strong> ${product.description}</p>
                    <p><strong>Status:</strong> <span class="in-stock">In Stock</span></p>
                </div>
                <button class="add-to-cart-from-modal" onclick="addToCart(${product.id}); closeAmountModal();">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        `;
    } else {
        result.innerHTML = `
            <div class="product-not-found">
                <i class="fas fa-exclamation-circle"></i>
                <p>Product "${productName}" not found in our inventory.</p>
                <p>Please check the spelling or try a different product name.</p>
            </div>
        `;
    }
}

function messageChetachi() {
    closeAmountModal();
    
    // Redirect to messaging system (this would be backend integration)
    const messageModal = document.createElement('div');
    messageModal.className = 'message-modal';
    messageModal.innerHTML = `
        <div class="message-modal-content">
            <div class="message-modal-header">
                <h3>Message Chetachi</h3>
                <button class="close-modal" onclick="closeMessageModal()">&times;</button>
            </div>
            <div class="message-modal-body">
                <p>Send a message to Chetachi Super Market:</p>
                <textarea id="chetachiMessage" placeholder="Type your message here..." rows="4"></textarea>
                <div class="message-actions">
                    <button onclick="sendToChetachi()">Send Message</button>
                    <button onclick="closeMessageModal()">Cancel</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(messageModal);
    setTimeout(() => messageModal.classList.add('active'), 100);
}

function closeMessageModal() {
    const modal = document.querySelector('.message-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => document.body.removeChild(modal), 300);
    }
}

function sendToChetachi() {
    const messageText = document.getElementById('chetachiMessage');
    if (messageText && messageText.value.trim()) {
        // This would connect to backend system
        showToast('Message sent to Chetachi! We will respond shortly.');
        console.log('Message to Chetachi:', messageText.value);
        closeMessageModal();
        
        // Store message for backend integration
        const messages = JSON.parse(localStorage.getItem('chetachiMessages') || '[]');
        messages.push({
            text: messageText.value,
            timestamp: new Date().toISOString(),
            status: 'sent'
        });
        localStorage.setItem('chetachiMessages', JSON.stringify(messages));
    }
}

// Close search results when clicking outside
document.addEventListener('click', function(e) {
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchResults && searchBtn) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target) && !searchBtn.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    }
});

console.log('Chetachi Super Market - Unified Website Loaded Successfully!');
