const restaurantOrdersPage = document.querySelector('[data-restaurant-orders-page]');
const apiUrl = window.maxKitchenApiUrl || ((path) => `${window.location.protocol === 'file:' || (['localhost', '127.0.0.1'].includes(window.location.hostname) && window.location.port !== '3000') ? 'http://localhost:3000' : window.location.origin}${path}`);

if (restaurantOrdersPage) {
    const accessForm = restaurantOrdersPage.querySelector('[data-restaurant-access-form]');
    const accessInput = restaurantOrdersPage.querySelector('#restaurant-admin-key');
    const refreshButton = restaurantOrdersPage.querySelector('[data-restaurant-refresh]');
    const statusMessage = restaurantOrdersPage.querySelector('[data-restaurant-orders-status]');
    const orderList = restaurantOrdersPage.querySelector('[data-restaurant-order-list]');
    let adminKey = '';

    const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
    const formatPrice = (amount) => `₦${Number(amount).toLocaleString('en-NG')}`;
    const formatDate = (date) => new Date(date).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' });

    function setStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.className = `restaurant-orders-status${isError ? ' is-error' : ''}`;
    }

    function renderOrders(orders) {
        if (!orders.length) {
            orderList.innerHTML = '<p class="restaurant-empty">No orders have been received yet.</p>';
            return;
        }

        orderList.innerHTML = orders.map((order) => `
            <article class="restaurant-order-card" data-order-reference="${escapeHtml(order.orderNumber)}">
                <header class="restaurant-order-card-header">
                    <div><p class="section-label">${escapeHtml(formatDate(order.orderTime))}</p><h2>${escapeHtml(order.orderNumber)}</h2></div>
                    <span class="restaurant-payment-status ${escapeHtml(order.paymentStatus.toLowerCase())}">${escapeHtml(order.paymentStatus)}</span>
                </header>
                <div class="restaurant-order-grid">
                    <div><span>Customer</span><strong>${escapeHtml(order.customer.fullName)}</strong><p>${escapeHtml(order.customer.email)}<br>${escapeHtml(order.customer.phone)}</p></div>
                    <div><span>Delivery</span><strong>${order.customer.fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}</strong><p>${order.customer.fulfilment === 'pickup' ? 'Pickup from MAX KITCHEN' : escapeHtml(`${order.customer.address}, ${order.customer.area}, ${order.customer.city}`)}</p></div>
                    <div><span>Order total</span><strong>${escapeHtml(formatPrice(order.total))}</strong><p>Payment: ${escapeHtml(order.paymentStatus)}</p></div>
                </div>
                <div class="restaurant-order-items"><span>Ordered food</span>${order.items.map((item) => `<p><strong>${escapeHtml(item.quantity)} × ${escapeHtml(item.name)}</strong>${(item.addOns || []).map((addon) => ` <small>+ ${escapeHtml(addon.name)}</small>`).join('')}</p>`).join('')}</div>
                <div class="restaurant-order-actions">
                    <label for="status-${order.orderNumber}">Order status</label>
                    <select id="status-${order.orderNumber}" data-order-status-select>
                        ${['Order Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => `<option${status === order.status ? ' selected' : ''}>${status}</option>`).join('')}
                    </select>
                    <button class="button button-gold" type="button" data-save-order-status>Update status</button>
                    <p data-order-update-message aria-live="polite"></p>
                </div>
            </article>
        `).join('');
    }

    async function loadOrders() {
        refreshButton.disabled = true;
        setStatus('Loading orders...');
        try {
            const response = await fetch(apiUrl('/api/restaurant/orders'), { headers: { 'x-restaurant-admin-key': adminKey } });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Orders could not be loaded.');
            renderOrders(result);
            setStatus(`${result.length} order${result.length === 1 ? '' : 's'} loaded.`);
            refreshButton.disabled = false;
        } catch (error) {
            setStatus(error.message, true);
            orderList.innerHTML = '<p class="restaurant-empty">Orders are unavailable. Check the management key and server configuration.</p>';
            refreshButton.disabled = true;
        }
    }

    accessForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!accessForm.checkValidity()) {
            accessForm.reportValidity();
            return;
        }
        adminKey = accessInput.value;
        loadOrders();
    });

    refreshButton.addEventListener('click', loadOrders);

    orderList.addEventListener('click', async (event) => {
        const button = event.target.closest('[data-save-order-status]');
        if (!button) return;
        const card = button.closest('[data-order-reference]');
        const select = card.querySelector('[data-order-status-select]');
        const updateMessage = card.querySelector('[data-order-update-message]');
        button.disabled = true;
        updateMessage.textContent = 'Saving...';
        try {
            const response = await fetch(apiUrl(`/api/restaurant/orders/${encodeURIComponent(card.dataset.orderReference)}/status`), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'x-restaurant-admin-key': adminKey },
                body: JSON.stringify({ status: select.value })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Status could not be updated.');
            updateMessage.textContent = `Updated to ${result.status}.`;
        } catch (error) {
            updateMessage.textContent = error.message;
        } finally {
            button.disabled = false;
        }
    });
}
