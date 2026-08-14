const DB = {
    getCart: function() {
        let cart = localStorage.getItem('servex_cart');
        if (cart) return JSON.parse(cart);
        return [];
    },
    addToCart: function(name, price) {
        let serviceMap = {
            'Salon & Spa': [ {name: 'Basic Polish', price: 1499}, {name: 'Classic Spa', price: 2900}, {name: 'Luxury Royale', price: 4999} ],
            'Home Repair': [ {name: 'Quick Fix', price: 499}, {name: 'Standard Repair', price: 1299}, {name: 'Full Overhaul', price: 4900} ],
            'Deep Cleaning': [ {name: 'Standard Clean', price: 1499}, {name: 'Deep Scrub', price: 3900}, {name: 'Move-in/Move-out', price: 6500} ],
            'Private Transport': [ {name: 'City Sedan', price: 500}, {name: 'Premium SUV', price: 1200}, {name: 'Luxury First-Class', price: 3500} ],
            'Personal Chef': [ {name: 'Meal Prep', price: 2500}, {name: 'Dinner Party', price: 6000}, {name: 'Masterclass', price: 8500} ],
            'Smart Home Automation': [ {name: 'Basic Setup', price: 1999}, {name: 'Home Security', price: 4500}, {name: 'Total Automation', price: 9900} ]
        };
        let parentService = null;
        for (let key in serviceMap) {
            for (let i = 0; i < serviceMap[key].length; i++) {
                if (serviceMap[key][i].name === name) { parentService = key; break; }
            }
        }
        let options = [];
        if (parentService) {
            options = serviceMap[parentService];
        } else {
            options = [ {name: name, price: price} ];
        }
        let modal = document.getElementById('cartModal');
        if (modal) modal.remove();
        modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;justify-content:center;align-items:center;z-index:9999;backdrop-filter:blur(5px);padding:1rem;box-sizing:border-box;';
        let optionsHtml = '';
        for (let i = 0; i < options.length; i++) {
            let isSelected = '';
            if (options[i].name === name) isSelected = 'selected';
            optionsHtml += '<option value="'+options[i].name+'" data-price="'+options[i].price+'" '+isSelected+'>'+options[i].name+' - ₹'+options[i].price+'</option>';
        }
        let d = new Date();
        let today = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2, '0') + "-" + String(d.getDate()).padStart(2, '0');
        modal.innerHTML = `
            <div style="background:#111; padding:2rem; border-radius:16px; width:100%; max-width:400px; border:1px solid #333; box-sizing: border-box;">
                <h2 style="margin-top:0; margin-bottom:1.5rem; text-align: center;">Customize Service</h2>
                <label style="display:block; margin-bottom:0.5rem; color:#a0a0a0; font-size:0.9rem;">Category / Type</label>
                <select id="modalCategory" style="width:100%; padding:0.8rem; border-radius:8px; background:#0a0a0a; border:1px solid #333; color:#fff; margin-bottom:1rem; font-family:inherit; outline: none;">${optionsHtml}</select>
                <label style="display:block; margin-bottom:0.5rem; color:#a0a0a0; font-size:0.9rem;">Preferred Date</label>
                <input type="date" id="modalDate" min="${today}" onclick="this.showPicker()" style="width:100%; padding:0.8rem; border-radius:8px; background:#0a0a0a; border:1px solid #333; color:#fff; margin-bottom:1rem; font-family:inherit; outline: none;" required>
                <label style="display:block; margin-bottom:0.5rem; color:#a0a0a0; font-size:0.9rem;">Special Instructions (Optional)</label>
                <textarea id="modalInstructions" rows="3" placeholder="e.g. Bring own supplies..." style="width:100%; padding:0.8rem; border-radius:8px; background:#0a0a0a; border:1px solid #333; color:#fff; margin-bottom:1.5rem; font-family:inherit; resize:vertical; outline: none;"></textarea>
                <div style="display:flex; gap:1rem;">
                    <button id="modalCancel" class="btn btn-outline" style="flex:1;">Cancel</button>
                    <button id="modalConfirm" class="btn" style="flex:1;">Add to Cart</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        document.getElementById('modalCancel').onclick = function() { modal.remove(); };
        document.getElementById('modalConfirm').onclick = function() {
            let catSelect = document.getElementById('modalCategory');
            let date = document.getElementById('modalDate').value;
            if (date === "") return alert('Please select a Preferred Date.');
            let cart = DB.getCart();
            cart.push({ 
                name: catSelect.value, 
                price: parseFloat(catSelect.options[catSelect.selectedIndex].getAttribute('data-price')), 
                date: date, 
                instructions: document.getElementById('modalInstructions').value 
            });
            localStorage.setItem('servex_cart', JSON.stringify(cart));
            let cartIcon = document.getElementById('floatingCart');
            if (cartIcon) cartIcon.style.display = 'flex';
            modal.remove();
            alert('Added to Cart!');
        };
    },
    clearCart: function() { localStorage.setItem('servex_cart', '[]'); },
    getHistory: function() {
        let history = localStorage.getItem('servex_history');
        if (history) return JSON.parse(history);
        return [];
    },
    addHistory: function(items, total) {
        let history = DB.getHistory();
        let serviceNames = "";
        for (let i = 0; i < items.length; i++) {
            serviceNames += items[i].name;
            if (i < items.length - 1) serviceNames += ", ";
        }
        if (serviceNames === "") serviceNames = "Various Services";
        history.unshift({ 
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }), 
            service: serviceNames, 
            amount: total, 
            status: 'Completed' 
        });
        localStorage.setItem('servex_history', JSON.stringify(history));
    },
    getTotalSpent: function() {
        let history = DB.getHistory();
        let total = 0;
        for (let i = 0; i < history.length; i++) total += history[i].amount;
        return total;
    }
};
