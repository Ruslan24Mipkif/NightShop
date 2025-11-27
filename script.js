/* --- 1. БАЗА ДАННЫХ ТОВАРОВ --- */
const productsData = [
    { id: 1, title: "Смартфон SuperTech X", category: "smartphones", price: 25000, img: "📱", brand: "SuperTech" },
    { id: 2, title: "Ноутбук ProWork 15", category: "laptops", price: 55000, img: "💻", brand: "ProWork" },
    { id: 3, title: "Наушники BassBoost", category: "audio", price: 3500, img: "🎧", brand: "AudioX" },
    { id: 4, title: "Умные часы WatchOS", category: "smartphones", price: 15000, img: "⌚", brand: "SmartLife" },
    { id: 5, title: "Монитор 4K Ultra", category: "monitors", price: 30000, img: "🖥️", brand: "ViewMax" },
    { id: 6, title: "Игровая консоль X-Play", category: "gaming", price: 45000, img: "🎮", brand: "GameCorp" },
    { id: 7, title: "Клавиатура RGB Mech", category: "gaming", price: 4500, img: "⌨️", brand: "KeyMaster" },
    { id: 8, title: "Мышь игровая Fast", category: "gaming", price: 2500, img: "🖱️", brand: "ClickFast" },
    { id: 9, title: "Колонка BoomBox", category: "audio", price: 8000, img: "🔊", brand: "AudioX" },
    { id: 10, title: "Планшет Tab S", category: "smartphones", price: 20000, img: "📟", brand: "SuperTech" },
    { id: 11, title: "Видеокарта RTX 9000", category: "computers", price: 95000, img: "📼", brand: "Nvdia" },
    { id: 12, title: "Процессор Core i9", category: "computers", price: 40000, img: "💾", brand: "Intell" }
];

/* --- 2. УПРАВЛЕНИЕ СОСТОЯНИЕМ (LocalStorage) --- */
let cart = JSON.parse(localStorage.getItem('shopCart')) || [];
let favorites = JSON.parse(localStorage.getItem('shopFav')) || [];
let compareList = JSON.parse(localStorage.getItem('shopCompare')) || [];

/* --- 3. ФУНКЦИИ ОТРИСОВКИ ТОВАРОВ --- */

// Функция создания HTML карточки и вставки в контейнер
function renderProducts(products) {
    const container = document.getElementById('products-container');
    const titleElement = document.getElementById('page-title');
    
    if (!container) return; // Если мы не на странице каталога

    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: #888;">Товары не найдены :( Попробуйте изменить запрос.</div>';
        return;
    }

    products.forEach(item => {
        // Проверка: в избранном ли товар?
        const isFav = favorites.includes(item.id) ? 'active' : '';
        const favChar = isFav ? '♥' : '♡';

        // Проверка: в сравнении ли товар?
        const isInCompare = compareList.includes(item.id);
        const compareBtnText = isInCompare ? 'Убрать из сравнения' : 'Сравнить';
        const compareBtnColor = isInCompare ? '#d0006f' : '#5e3a8a';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="img-placeholder">${item.img}</div>
                <button class="fav-icon ${isFav}" onclick="toggleFav(${item.id})" title="В избранное">${favChar}</button>
            </div>
            <div class="product-info">
                <p>${item.title}</p>
                <h3 class="brand-name">${item.brand}</h3>
                <div class="price-label">${item.price.toLocaleString()} ₽</div>
            </div>
            <div style="display: flex; gap: 5px; margin-top: auto;">
                <button class="buy-btn" onclick="addToCart(${item.id})">В корзину</button>
                <button class="compare-btn-small" onclick="toggleCompare(${item.id})" style="background:${compareBtnColor};" title="${compareBtnText}">⚖</button>
            </div>
        `;
        container.appendChild(card);
    });
}

/* --- 4. ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ --- */
document.addEventListener('DOMContentLoaded', () => {
    // Логика: Если мы на Главной - показываем только 4 товара. Если в Каталоге - все.
    const hasFilters = document.getElementById('category-filters');
    
    if (hasFilters) {
        // Мы в Каталоге
        renderProducts(productsData);
    } else {
        // Мы на Главной (показываем "Хиты продаж" - первые 4)
        renderProducts(productsData.slice(0, 4));
    }
    
    updateCartCount();
    updateFavCount();
    updateCompareCount();

    // -- Слушатель ПОИСКА --
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase();
            const filtered = productsData.filter(p => 
                p.title.toLowerCase().includes(val) || 
                p.brand.toLowerCase().includes(val)
            );
            renderProducts(filtered);
        });
    }

    // -- Слушатель КАТЕГОРИЙ --
    const catButtons = document.querySelectorAll('.cat-btn[data-category]');
    catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Визуальное переключение активной кнопки
            catButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            
            // Фильтрация
            if (category === 'all') {
                renderProducts(productsData);
                document.getElementById('page-title').textContent = "Все товары";
            } else {
                const filtered = productsData.filter(p => p.category === category);
                renderProducts(filtered);
                // Меняем заголовок
                document.getElementById('page-title').textContent = btn.textContent;
            }
        });
    });
});

/* --- 5. ФУНКЦИИ КОРЗИНЫ --- */

function addToCart(id) {
    const product = productsData.find(p => p.id === id);
    if(product) {
        cart.push(product);
        saveCart();
        updateCartCount();
        
        // Визуальный эффект на кнопке (если событие есть)
        if(event && event.target) {
            const btn = event.target;
            const oldText = btn.innerText;
            btn.innerText = "✓ Добавлено";
            btn.style.backgroundColor = "#4cd964";
            setTimeout(() => {
                btn.innerText = oldText;
                btn.style.backgroundColor = ""; // Сброс
            }, 1000);
        }
    }
}

function saveCart() {
    localStorage.setItem('shopCart', JSON.stringify(cart));
}

function updateCartCount() {
    const btn = document.getElementById('cart-btn');
    if(btn) btn.textContent = `Корзина (${cart.length})`;
}

// Открытие модального окна
function openCart() {
    const modal = document.getElementById('cartModal');
    const container = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const orderForm = document.getElementById('orderForm');
    
    // Сброс видимости формы при повторном открытии
    if(orderForm) orderForm.style.display = 'none';
    if(checkoutBtn) checkoutBtn.style.display = 'block';

    container.innerHTML = '';
    let totalPrice = 0;

    if(cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px; color:#aaa;">Ваша корзина пуста</p>';
        if(checkoutBtn) checkoutBtn.style.display = 'none';
    } else {
        cart.forEach((item, index) => {
            totalPrice += item.price;
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                   <span style="font-size:24px;">${item.img}</span>
                   <span>${item.title}</span>
                </div>
                <div style="display:flex; gap:15px; align-items:center;">
                    <b>${item.price.toLocaleString()} ₽</b>
                    <button onclick="removeFromCart(${index})" style="background:#d0006f; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:5px;" title="Удалить">✕</button>
                </div>
            `;
            container.appendChild(itemDiv);
        });
    }

    if(totalElement) totalElement.textContent = totalPrice.toLocaleString() + ' ₽';
    if(modal) modal.style.display = "block";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    openCart(); // Перерисовать содержимое
    updateCartCount();
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if(modal) modal.style.display = "none";
}

/* --- 6. ОФОРМЛЕНИЕ ЗАКАЗА --- */

function showCheckoutForm() {
    // Скрываем кнопку "Оформить"
    document.querySelector('.checkout-btn').style.display = 'none';
    // Показываем форму
    const form = document.getElementById('orderForm');
    form.style.display = 'flex';
}

function submitOrder() {
    const name = document.getElementById('orderName').value;
    const phone = document.getElementById('orderPhone').value;

    if (!name || !phone) {
        alert("Пожалуйста, заполните Имя и Телефон!");
        return;
    }

    // Показываем успех
    const modalContent = document.querySelector('.cart-content');
    modalContent.innerHTML = `
        <div class="success-message" style="display:block;">
            <div style="font-size: 50px; margin-bottom: 10px;">🎉</div>
            <h2>Спасибо за заказ, ${name}!</h2>
            <p style="margin-top:10px; color:#ccc;">Менеджер свяжется с вами по номеру <b>${phone}</b> в течение 5 минут.</p>
            <button class="buy-btn" style="margin-top:20px;" onclick="location.reload()">Вернуться в магазин</button>
        </div>
    `;

    // Очищаем корзину
    cart = [];
    saveCart();
    updateCartCount();
}

/* --- 7. ИЗБРАННОЕ --- */

function toggleFav(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('shopFav', JSON.stringify(favorites));
    
    // Перерисовываем список
    const activeBtn = document.querySelector('.cat-btn.active');
    if(activeBtn) {
        activeBtn.click();
    } else {
        renderProducts(productsData.slice(0, 4));
    }
    updateFavCount();
}

function updateFavCount() {
    const favBtn = document.getElementById('fav-btn');
    if(favBtn) {
        favBtn.textContent = `Избранное (${favorites.length})`;
    }
}

/* --- 8. СРАВНЕНИЕ --- */

function updateCompareCount() {
    // Находим кнопку сравнения (первая в списке экшнов)
    const btn = document.querySelector('.action-btn:first-child'); 
    if(btn) {
        btn.textContent = `Сравнение (${compareList.length})`;
        btn.onclick = openCompareModal; 
    }
}

function toggleCompare(id) {
    if (compareList.includes(id)) {
        compareList = compareList.filter(cId => cId !== id);
    } else {
        if(compareList.length >= 3) {
            alert("Можно сравнивать максимум 3 товара одновременно!");
            return;
        }
        compareList.push(id);
    }
    localStorage.setItem('shopCompare', JSON.stringify(compareList));
    
    // Перерисовка
    const activeBtn = document.querySelector('.cat-btn.active');
    if(activeBtn) {
        activeBtn.click();
    } else {
        renderProducts(productsData.slice(0, 4));
    }
    updateCompareCount();
}

function openCompareModal() {
    let modal = document.getElementById('compareModal');
    if (!modal) {
        const div = document.createElement('div');
        div.id = 'compareModal';
        div.className = 'cart-modal';
        div.innerHTML = `
            <div class="cart-content" style="max-width: 800px;">
                <div class="cart-header">
                    <h2>Сравнение товаров</h2>
                    <span class="close-cart" onclick="document.getElementById('compareModal').style.display='none'">&times;</span>
                </div>
                <div id="compareGrid" class="compare-grid"></div>
            </div>
        `;
        document.body.appendChild(div);
        modal = div;
    }

    const grid = document.getElementById('compareGrid');
    grid.innerHTML = '';

    if (compareList.length === 0) {
        grid.innerHTML = '<p style="text-align:center; width:100%;">Список сравнения пуст.</p>';
    } else {
        const items = productsData.filter(p => compareList.includes(p.id));
        
        let html = '<table class="compare-table"><thead><tr><th>Характеристика</th>';
        items.forEach(item => {
            html += `<th>${item.title} <br> <span onclick="toggleCompare(${item.id}); openCompareModal();" style="cursor:pointer; color:#d0006f; font-size:12px;">(удалить)</span></th>`;
        });
        html += '</tr></thead><tbody>';

        const fields = [
            { label: 'Цена', key: 'price', format: val => val.toLocaleString() + ' ₽' },
            { label: 'Бренд', key: 'brand' },
            { label: 'Категория', key: 'category' },
            { label: 'Рейтинг (отзывы)', key: 'rating', fake: true },
            { label: 'Гарантия', key: 'warranty', fake: true },
        ];

        fields.forEach(field => {
            html += `<tr><td>${field.label}</td>`;
            items.forEach(item => {
                let val;
                if (field.fake) {
                    if(field.key === 'rating') val = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1) + ' ★';
                    if(field.key === 'warranty') val = item.price > 30000 ? '2 года' : '1 год';
                } else {
                    val = item[field.key];
                    if (field.format) val = field.format(val);
                }
                html += `<td>${val}</td>`;
            });
            html += '</tr>';
        });

        html += '</tbody></table>';
        grid.innerHTML = html;
    }

    modal.style.display = 'block';
}

// Закрытие модальных окон при клике вне
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const compareModal = document.getElementById('compareModal');
    if (event.target == cartModal) {
        cartModal.style.display = "none";
    }
    if (event.target == compareModal) {
        compareModal.style.display = "none";
    }
}