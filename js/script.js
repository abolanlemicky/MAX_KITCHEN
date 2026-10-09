const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-navigation');
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
scrollProgress.innerHTML = '<span></span>';
document.body.prepend(scrollProgress);

function updateScrollProgress() {
	const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
	const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
	scrollProgress.style.setProperty('--scroll-progress', `${Math.min(progress, 100)}%`);
}

updateScrollProgress();

function closeMenu() {
	navigation?.classList.remove('is-open');
	document.body.classList.remove('menu-open');
	menuToggle?.setAttribute('aria-expanded', 'false');
}

window.addEventListener('scroll', () => {
	header?.classList.toggle('scrolled', window.scrollY > 24);
	updateScrollProgress();
}, { passive: true });

const textRevealTargets = document.querySelectorAll('.hero h1, .menu-hero h1, .reservation-hero h1, .contact-hero h1, .intro-heading h2');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
textRevealTargets.forEach((target, index) => {
	target.classList.add('text-reveal');
	if (prefersReducedMotion) {
		target.classList.add('is-visible');
	} else {
		window.setTimeout(() => target.classList.add('is-visible'), 180 + (index * 100));
	}
});

menuToggle?.addEventListener('click', () => {
	const isOpen = navigation.classList.toggle('is-open');
	document.body.classList.toggle('menu-open', isOpen);
	menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		const lightbox = document.querySelector('.lightbox');
		if (lightbox) {
			closeLightbox();
			return;
		}
		closeMenu();
	}

	if (document.querySelector('.lightbox.is-open')) {
		if (event.key === 'ArrowRight') {
			showGalleryImage(1);
		} else if (event.key === 'ArrowLeft') {
			showGalleryImage(-1);
		}
	}
});

// Gallery data is kept separate from rendering so the lightbox and grid share one source.
const galleryItems = [
	{ src: 'foods and drinks/gallery-pictures/Bar & Drinks Area.jfif', alt: 'Bar & Drinks Area', height: 360 },
	{ src: 'foods and drinks/gallery-pictures/Beautiful Jollof Rice Presentation.jfif', alt: 'Beautiful Jollof Rice Presentation', height: 500 },
	{ src: 'foods and drinks/gallery-pictures/chef food plating.jfif', alt: 'Chef Food Plating', height: 420 },
	{ src: 'foods and drinks/gallery-pictures/Detail Shot \u2014 Table & Interior.jfif', alt: 'Detail Shot - Table & Interior', height: 520 },
	{ src: 'foods and drinks/gallery-pictures/Elegant Dining Table.jfif', alt: 'Elegant Dining Table', height: 380 },
	{ src: 'foods and drinks/gallery-pictures/Happy Customers Dining.jfif', alt: 'Happy Customers Dining', height: 550 },
	{ src: 'foods and drinks/gallery-pictures/Main Dining Area.jfif', alt: 'Main Dining Area', height: 430 },
	{ src: 'foods and drinks/gallery-pictures/Nigerian Swallow & Soup Presentation 1.jfif', alt: 'Nigerian Swallow & Soup Presentation', height: 460 },
	{ src: 'foods and drinks/gallery-pictures/Open Kitchen \u2014 Wide View.jfif', alt: 'Open Kitchen - Wide View', height: 420 },
	{ src: 'foods and drinks/gallery-pictures/Palm Wine \u2014 Nigerian Touch.jfif', alt: 'Palm Wine - Nigerian Touch', height: 460 },
	{ src: 'foods and drinks/gallery-pictures/Premium Nigerian Food Spread 2.jfif', alt: 'Premium Nigerian Food Spread', height: 420 },
	{ src: 'foods and drinks/gallery-pictures/Premium Nigerian Food Spread 3.jfif', alt: 'Premium Nigerian Food Spread', height: 500 },
	{ src: 'foods and drinks/gallery-pictures/Private Dining and Celebration.jfif', alt: 'Private Dining and Celebration', height: 380 },
	{ src: 'foods and drinks/gallery-pictures/Restaurant Atmosphere \u2014 Evening.jfif', alt: 'Restaurant Atmosphere - Evening', height: 550 },
	{ src: 'foods and drinks/gallery-pictures/Restaurant Interior.png', alt: 'Restaurant Interior', height: 430 },
	{ src: 'foods and drinks/gallery-pictures/Restaurant Lounge Area.jfif', alt: 'Restaurant Lounge Area', height: 460 },
	{ src: 'foods and drinks/gallery-pictures/Signature Drinks.jfif', alt: 'Signature Drinks', height: 420 },
	{ src: 'foods and drinks/gallery-pictures/signature moment.jfif', alt: 'Signature Moment', height: 500 },
	{ src: 'foods and drinks/gallery-pictures/smile of a sweet taste.jfif', alt: 'Smile of a Sweet Taste', height: 380 },
	{ src: 'foods and drinks/gallery-pictures/Suya and Grilled Food.jfif', alt: 'Suya and Grilled Food', height: 550 }
];

const galleryContainer = document.querySelector('[data-gallery]');
let lastGalleryTrigger = null;

if (galleryContainer) {
	galleryContainer.innerHTML = galleryItems.map((image, index) => `
		<button class="gallery-item" type="button" data-index="${index}" style="--card-height: ${image.height}px" aria-label="Open image ${index + 1}">
			<img src="${image.src}" alt="${image.alt}" loading="lazy" decoding="async">
		</button>
	`).join('');

	galleryContainer.querySelectorAll('.gallery-item').forEach((button) => {
		button.addEventListener('click', () => {
			lastGalleryTrigger = button;
			openLightbox(Number(button.dataset.index));
		});
	});
}

// The carousel owns its content and controls without requiring a third-party library.
const testimonials = [
	{ quote: 'Every course felt intentional. The atmosphere, service and food were exceptional.', author: 'Adeola O.' },
	{ quote: 'A beautiful expression of Nigerian flavour. We left full, delighted and already planning our next visit.', author: 'Tunde A.' },
	{ quote: 'From the first welcome to the final pour, MAX KITCHEN made the evening feel wonderfully considered.', author: 'Chinonso E.' },
	{ quote: 'The perfect balance of warmth and elegance. Every detail made our celebration feel genuinely special.', author: 'Mariam K.' }
];

const testimonialCarousel = document.querySelector('[data-testimonials]');

if (testimonialCarousel) {
	const track = testimonialCarousel.querySelector('[data-testimonial-track]');
	const dots = testimonialCarousel.querySelector('[data-testimonial-dots]');
	let activeTestimonial = 0;
	let testimonialTimer;
	let hasInteracted = false;

	track.innerHTML = testimonials.map((testimonial, index) => `
		<article class="testimonial" data-testimonial-slide aria-label="Testimonial ${index + 1} of ${testimonials.length}">
			<p class="testimonial-rating" aria-label="Five out of five stars">★★★★★</p>
			<blockquote class="testimonial-quote">“${testimonial.quote}”</blockquote>
			<p class="testimonial-author">— ${testimonial.author}</p>
		</article>
	`).join('');
	dots.innerHTML = testimonials.map((testimonial, index) => `<button class="testimonial-dot${index === 0 ? ' is-active' : ''}" type="button" data-testimonial-dot="${index}" aria-label="Show testimonial ${index + 1}" aria-pressed="${index === 0}"></button>`).join('');

	function showTestimonial(index) {
		activeTestimonial = (index + testimonials.length) % testimonials.length;
		track.style.transform = `translateX(-${activeTestimonial * 100}%)`;
		dots.querySelectorAll('.testimonial-dot').forEach((dot, dotIndex) => {
			const isActive = dotIndex === activeTestimonial;
			dot.classList.toggle('is-active', isActive);
			dot.setAttribute('aria-pressed', String(isActive));
		});
	}

	function pauseAutoplay() {
		hasInteracted = true;
		window.clearInterval(testimonialTimer);
	}

	function startAutoplay() {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || hasInteracted) return;
		testimonialTimer = window.setInterval(() => {
			if (!hasInteracted) showTestimonial(activeTestimonial + 1);
		}, 8000);
	}

	testimonialCarousel.querySelector('[data-testimonial-prev]').addEventListener('click', () => {
		pauseAutoplay();
		showTestimonial(activeTestimonial - 1);
	});
	testimonialCarousel.querySelector('[data-testimonial-next]').addEventListener('click', () => {
		pauseAutoplay();
		showTestimonial(activeTestimonial + 1);
	});
	dots.querySelectorAll('.testimonial-dot').forEach((dot) => dot.addEventListener('click', () => {
		pauseAutoplay();
		showTestimonial(Number(dot.dataset.testimonialDot));
	}));
	testimonialCarousel.addEventListener('mouseenter', pauseAutoplay);
	testimonialCarousel.addEventListener('focusin', pauseAutoplay);
	startAutoplay();
}

let activeGalleryIndex = 0;

function openLightbox(index) {
	activeGalleryIndex = (index + galleryItems.length) % galleryItems.length;
	const lightbox = document.createElement('div');
	lightbox.className = 'lightbox is-open';
	lightbox.setAttribute('role', 'dialog');
	lightbox.setAttribute('aria-modal', 'true');
	lightbox.setAttribute('aria-label', 'Image lightbox');
	lightbox.innerHTML = `
		<div class="lightbox-panel">
			<button class="lightbox-close" type="button" aria-label="Close gallery image">×</button>
			<button class="lightbox-nav prev" type="button" aria-label="Previous image">‹</button>
			<img class="lightbox-image" src="${galleryItems[activeGalleryIndex].src}" alt="${galleryItems[activeGalleryIndex].alt}">
			<button class="lightbox-nav next" type="button" aria-label="Next image">›</button>
		</div>
	`;

	document.body.appendChild(lightbox);
	document.body.classList.add('lightbox-open');
	lightbox.querySelector('.lightbox-close')?.focus();

	lightbox.addEventListener('click', (event) => {
		if (event.target === lightbox) closeLightbox();
	});
	lightbox.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
	lightbox.querySelector('.lightbox-nav.prev')?.addEventListener('click', () => showGalleryImage(-1));
	lightbox.querySelector('.lightbox-nav.next')?.addEventListener('click', () => showGalleryImage(1));
}

function closeLightbox() {
	const lightbox = document.querySelector('.lightbox');
	if (!lightbox) return;
	lightbox.remove();
	document.body.classList.remove('lightbox-open');
	lastGalleryTrigger?.focus();
}

function showGalleryImage(step) {
	const lightbox = document.querySelector('.lightbox');
	if (!lightbox) return;

	activeGalleryIndex = (activeGalleryIndex + step + galleryItems.length) % galleryItems.length;
	const image = galleryItems[activeGalleryIndex];
	const lightboxImage = lightbox.querySelector('.lightbox-image');
	if (lightboxImage) {
		lightboxImage.src = image.src;
		lightboxImage.alt = image.alt;
	}
}

// Menu data drives both homepage featured cards and the full menu grid.
const menuDishes = [
	{ name: 'Jollof Rice', image: 'foods and drinks/foods/Jollof Rice2.jfif', category: 'rice', categoryLabel: 'Rice', price: '₦8,500', description: 'Smoky tomato rice, grilled chicken, fried plantain and slaw.', badge: "Chef's Choice" },
	{ name: 'Fried Rice', image: 'foods and drinks/foods/Fried Rice1.jfif', category: 'rice', categoryLabel: 'Rice', price: '₦9,000', description: 'Fragrant rice with vegetables, chicken, prawns and sweet corn.', badge: 'Popular' },
	{ name: 'White Rice & Stew', image: 'foods and drinks/foods/White Rice & Stew1.jfif', category: 'rice', categoryLabel: 'Rice', price: '₦7,500', description: 'Steamed long-grain rice with slow-cooked Nigerian pepper stew.', badge: '' },
	{ name: 'Rice & Beans', image: 'foods and drinks/foods/Rice & Beans 2.jfif', category: 'rice', categoryLabel: 'Rice', price: '₦7,000', description: 'Tender rice and honey beans, served with rich tomato sauce.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Ofada Rice & Sauce', image: 'foods and drinks/foods/Ofada Rice & Sauce 2.jfif', category: 'rice', categoryLabel: 'Rice', price: '₦10,500', description: 'Abeokuta-style ofada rice with bold ayamase pepper sauce.', badge: 'Spicy', badgeClass: 'spicy' },
	{ name: 'Pounded Yam & Egusi Soup', image: 'foods and drinks/foods/Pounded Yam & Egusi Soup 2.jfif', category: 'swallow-soup', categoryLabel: 'Swallow & Soup', price: '₦10,000', description: 'Smooth pounded yam with silky melon-seed soup and assorted meat.', badge: "Chef's Choice" },
	{ name: 'Eba & Egusi Soup', image: 'foods and drinks/foods/Eba & Egusi Soup 1.jfif', category: 'swallow-soup', categoryLabel: 'Swallow & Soup', price: '₦9,000', description: 'Golden garri swallow with leafy egusi soup and stockfish.', badge: '' },
	{ name: 'Eba & Okra Soup', image: 'foods and drinks/foods/Eba & Okra Soup 2.jfif', category: 'swallow-soup', categoryLabel: 'Swallow & Soup', price: '₦8,500', description: 'Soft eba with draw-textured okra, beef and dried seafood.', badge: 'Popular' },
	{ name: 'Pounded Yam & Efo Riro', image: 'foods and drinks/foods/Pounded Yam & Efo Riro 2.jfif', category: 'swallow-soup', categoryLabel: 'Swallow & Soup', price: '₦10,000', description: 'Freshly pounded yam with rich spinach and pepper stew.', badge: 'Popular' },
	{ name: 'Amala & Ewedu/Gbegiri', image: 'foods and drinks/foods/Amala & Ewedu with Gbegiri 3.jfif', category: 'swallow-soup', categoryLabel: 'Swallow & Soup', price: '₦9,500', description: 'A classic Yoruba combination of amala, silky ewedu and bean soup.', badge: "Chef's Choice" },
	{ name: 'Fufu & Egusi Soup', image: 'foods and drinks/foods/Fufu & Egusi Soup 3.jfif', category: 'swallow-soup', categoryLabel: 'Swallow & Soup', price: '₦9,000', description: 'Soft cassava fufu with richly seasoned egusi and greens.', badge: '' },
	{ name: 'Semo & Egusi Soup', image: 'foods and drinks/foods/Semo & Egusi Soup 1.jfif', category: 'swallow-soup', categoryLabel: 'Swallow & Soup', price: '₦9,000', description: 'Silky semolina swallow with melon-seed soup and assorted meats.', badge: '' },
	{ name: 'Semo & Okra Soup', image: 'foods and drinks/foods/Semo & Okra Soup 2.jfif', category: 'swallow-soup', categoryLabel: 'Swallow & Soup', price: '₦8,500', description: 'Smooth semo with fresh okra, pepper and tender beef.', badge: '' },
	{ name: 'Beans & Plantain', image: 'foods and drinks/foods/Beans & Plantain 3.jfif', category: 'beans-legumes', categoryLabel: 'Beans & Legumes', price: '₦7,000', description: 'Creamy beans paired with sweet fried plantain and pepper sauce.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Yam & Egg Sauce', image: 'foods and drinks/foods/Yam & Egg Sauce 1.jfif', category: 'yam-plantain', categoryLabel: 'Yam & Plantain', price: '₦6,500', description: 'Boiled yam with fluffy eggs, tomatoes, onions and peppers.', badge: 'Popular' },
	{ name: 'Yam Porridge (Asaro)', image: 'foods and drinks/foods/Yam Porridge (Asaro) 2.jfif', category: 'yam-plantain', categoryLabel: 'Yam & Plantain', price: '₦7,500', description: 'Soft yam simmered in a rich pepper, tomato and palm-oil sauce.', badge: '' },
	{ name: 'Fried Yam & Egg Sauce', image: 'foods and drinks/foods/Fried Yam & Egg Sauce 2.jfif', category: 'yam-plantain', categoryLabel: 'Yam & Plantain', price: '₦7,000', description: 'Crisp golden yam with fresh Nigerian egg and pepper sauce.', badge: 'Popular' },
	{ name: 'Fried Plantain (Dodo)', image: 'foods and drinks/foods/Fried Plantain (Dodo) 3.jfif', category: 'yam-plantain', categoryLabel: 'Yam & Plantain', price: '₦3,500', description: 'Golden ripe plantain slices, fried until caramelised and tender.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Suya', image: 'foods and drinks/foods/Suya 2.jfif', category: 'grills', categoryLabel: 'Grills', price: '₦7,000', description: 'Charcoal-grilled beef, yaji spice, red onion and fresh tomato.', badge: 'Popular' },
	{ name: 'Grilled Fish & Plantain', image: 'foods and drinks/foods/Grilled Fish & Plantain 1.jfif', category: 'grills', categoryLabel: 'Grills', price: '₦12,500', description: 'Whole local fish, smoky pepper marinade and grilled plantain.', badge: "Chef's Choice" },
	{ name: 'Chicken & Chips', image: 'foods and drinks/foods/Chicken & Chips 2.jfif', category: 'grills', categoryLabel: 'Grills', price: '₦9,000', description: 'Crisp seasoned chicken, house chips and fresh pepper dip.', badge: 'Popular' },
	{ name: 'Pepper Soup', image: 'foods and drinks/foods/Pepper Soup 1.jfif', category: 'soups-specialties', categoryLabel: 'Soups & Specialties', price: '₦6,500', description: 'Fragrant broth with tender goat, uziza, scent leaf and spice.', badge: 'Spicy', badgeClass: 'spicy' },
	{ name: 'Nigerian Beef Stew', image: 'foods and drinks/foods/Nigerian Beef Stew 1.jfif', category: 'soups-specialties', categoryLabel: 'Soups & Specialties', price: '₦8,500', description: 'Slow-braised beef in a deep roasted tomato and pepper sauce.', badge: "Chef's Choice" },
	{ name: 'Moi Moi', image: 'foods and drinks/foods/Moi Moi 1.jfif', category: 'snacks', categoryLabel: 'Snacks', price: '₦4,000', description: 'Steamed bean pudding with peppers, onions and a soft centre.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Akara', image: 'foods and drinks/foods/Akara 1.jfif', category: 'snacks', categoryLabel: 'Snacks', price: '₦3,500', description: 'Crisp black-eyed bean fritters with pepper and fresh herbs.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Puff-Puff', image: 'foods and drinks/foods/Puff-Puff 1.jfif', category: 'snacks', categoryLabel: 'Snacks', price: '₦3,000', description: 'Warm, airy dough bites dusted lightly with spiced sugar.', badge: 'Popular' },
	{ name: 'Nigerian Small Chops', image: 'foods and drinks/foods/Small Chops 2.jfif', category: 'snacks', categoryLabel: 'Snacks', price: '₦6,500', description: 'A sharing plate of spring rolls, samosas, puff-puff and chicken.', badge: 'Popular' },
	{ name: 'Max Kitchen Signature', image: 'foods and drinks/drinks/Max Kitchen Signature 1.jfif', category: 'drinks', categoryLabel: 'Signature Cocktails & Mocktails', price: '₦7,500', description: 'Our house blend of tropical fruit, citrus, bitters and sparkling soda.', badge: "Chef's Choice" },
	{ name: 'Chapman', image: 'foods and drinks/drinks/Chapman 2.jfif', category: 'drinks', categoryLabel: 'Signature Cocktails & Mocktails', price: '₦6,000', description: 'Fruity citrus blend, bitters, grenadine and sparkling soda.', badge: 'Popular' },
	{ name: 'Tropical Sunset', image: 'foods and drinks/drinks/Tropical Sunset 2.jfif', category: 'drinks', categoryLabel: 'Signature Cocktails & Mocktails', price: '₦6,500', description: 'Mango, orange and passion fruit layered over crushed ice.', badge: '' },
	{ name: 'Virgin Mojito', image: 'foods and drinks/drinks/Virgin Mojito 1.jfif', category: 'drinks', categoryLabel: 'Signature Cocktails & Mocktails', price: '₦5,500', description: 'Fresh mint, lime, cane sugar and chilled sparkling water.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Fresh Pineapple Juice', image: 'foods and drinks/drinks/Fresh Pineapple Juice 1.jfif', category: 'drinks', categoryLabel: 'Fresh Juices', price: '₦4,000', description: 'Pressed ripe pineapple served cold with a bright, clean finish.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Fresh Watermelon Juice', image: 'foods and drinks/drinks/Fresh Watermelon Juice 2.jfif', category: 'drinks', categoryLabel: 'Fresh Juices', price: '₦4,000', description: 'Fresh watermelon blended smooth and served over ice.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Fresh Orange Juice', image: 'foods and drinks/drinks/Fresh Orange Juice 1.jfif', category: 'drinks', categoryLabel: 'Fresh Juices', price: '₦4,000', description: 'Naturally sweet orange juice, freshly squeezed to order.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Pineapple & Ginger Juice', image: 'foods and drinks/drinks/Pineapple & Ginger Juice 2.jfif', category: 'drinks', categoryLabel: 'Fresh Juices', price: '₦4,500', description: 'Pineapple juice lifted with fresh ginger and a little lime.', badge: 'Popular' },
	{ name: 'Fresh Palm Wine', image: 'foods and drinks/drinks/fresh palm wine.jfif', category: 'drinks', categoryLabel: 'Nigerian Traditional Drinks', price: '₦5,000', description: 'Chilled, naturally sweet palm wine served in a traditional glass.', badge: 'Popular' },
	{ name: 'Zobo', image: 'foods and drinks/drinks/Zobo 2.jfif', category: 'drinks', categoryLabel: 'Nigerian Traditional Drinks', price: '₦2,500', description: 'Hibiscus, pineapple, ginger and citrus served chilled.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Kunu', image: 'foods and drinks/drinks/Kunu 1.jfif', category: 'drinks', categoryLabel: 'Nigerian Traditional Drinks', price: '₦3,000', description: 'Cool, lightly spiced millet drink with ginger and a soft finish.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Tigernut Milk', image: 'foods and drinks/drinks/Tigernut Milk 2.jfif', category: 'drinks', categoryLabel: 'Nigerian Traditional Drinks', price: '₦4,000', description: 'Creamy tiger nut milk with dates, coconut and warming spice.', badge: 'Vegetarian', badgeClass: 'vegetarian' },
	{ name: 'Coca-Cola', image: 'foods and drinks/drinks/Coca-Cola 1.jfif', category: 'drinks', categoryLabel: 'Soft Drinks & Water', price: '₦2,000', description: 'Chilled 50cl bottle.', badge: '' },
	{ name: 'Fanta', image: 'foods and drinks/drinks/Fanta 1.jfif', category: 'drinks', categoryLabel: 'Soft Drinks & Water', price: '₦2,000', description: 'Chilled 50cl bottle.', badge: '' },
	{ name: 'Sprite', image: 'foods and drinks/drinks/Sprite 2.jfif', category: 'drinks', categoryLabel: 'Soft Drinks & Water', price: '₦2,000', description: 'Chilled 50cl bottle.', badge: '' },
	{ name: 'Bottled Water', image: 'foods and drinks/drinks/Bottled Water 1.jfif', category: 'drinks', categoryLabel: 'Soft Drinks & Water', price: '₦1,000', description: 'Chilled still water, 75cl bottle.', badge: '' }
];

const menuCategoryDefinitions = {
	food: [
		{ key: 'swallow-soup', label: 'Swallow' }, { key: 'rice', label: 'Rice' }, { key: 'beans-legumes', label: 'Beans' },
		{ key: 'yam-plantain', label: 'Yam' }, { key: 'potatoes', label: 'Potatoes' }, { key: 'pasta-noodles', label: 'Pasta & Noodles' },
		{ key: 'soups-specialties', label: 'Soups' }, { key: 'proteins', label: 'Proteins' }, { key: 'snacks', label: 'Small Chops' },
		{ key: 'grills', label: 'Grills' }, { key: 'other-nigerian-meals', label: 'Other Nigerian Meals' }
	],
	drinks: [
		{ key: 'soft-drinks', label: 'Soft Drinks' }, { key: 'fresh-juices', label: 'Fresh Juices' }, { key: 'smoothies', label: 'Smoothies' },
		{ key: 'mocktails', label: 'Mocktails' }, { key: 'cocktails', label: 'Cocktails' }, { key: 'water', label: 'Water' },
		{ key: 'coffee-tea', label: 'Coffee & Tea' }, { key: 'local-drinks', label: 'Local Drinks' }
	]
};

const drinkCategories = {
	'Max Kitchen Signature': 'mocktails', Chapman: 'mocktails', 'Tropical Sunset': 'mocktails', 'Virgin Mojito': 'mocktails',
	'Fresh Pineapple Juice': 'fresh-juices', 'Fresh Watermelon Juice': 'fresh-juices', 'Fresh Orange Juice': 'fresh-juices', 'Pineapple & Ginger Juice': 'fresh-juices',
	'Fresh Palm Wine': 'local-drinks', Zobo: 'local-drinks', Kunu: 'local-drinks', 'Tigernut Milk': 'local-drinks',
	'Coca-Cola': 'soft-drinks', Fanta: 'soft-drinks', Sprite: 'soft-drinks', 'Bottled Water': 'water'
};

function getMenuCategory(dish) {
	return drinkCategories[dish.name] || dish.category;
}

function getMenuSection(dish) {
	return dish.category === 'drinks' ? 'drinks' : 'food';
}

function getMenuCategoryLabel(category) {
	return Object.values(menuCategoryDefinitions).flat().find((definition) => definition.key === category)?.label || category;
}

// Add-on groups are intentionally separate from the dish markup so prices and availability are easy to maintain.
const addOnGroups = {
	'rice-proteins': [{ name: 'Meat', price: 1500 }, { name: 'Chicken', price: 2000 }, { name: 'Fish', price: 2500 }, { name: 'Egg', price: 500 }, { name: 'Dodo', price: 1000 }],
	'beans-proteins': [{ name: 'Meat', price: 1500 }, { name: 'Fish', price: 2500 }, { name: 'Egg', price: 500 }, { name: 'Dodo', price: 1000 }],
	'noodles-proteins': [{ name: 'Meat', price: 1500 }, { name: 'Chicken', price: 2000 }, { name: 'Fish', price: 2500 }, { name: 'Egg', price: 500 }, { name: 'Dodo', price: 1000 }],
	'yam-proteins': [{ name: 'Meat', price: 1500 }, { name: 'Egg', price: 500 }, { name: 'Fish', price: 2500 }, { name: 'Chicken', price: 2000 }],
	'swallow-proteins': [{ name: 'Meat', price: 1500 }, { name: 'Chicken', price: 2000 }, { name: 'Fish', price: 2500 }, { name: 'Goat Meat', price: 2500 }],
	'pepper-soup-proteins': [{ name: 'Chicken', price: 2000 }, { name: 'Fish', price: 2500 }, { name: 'Goat Meat', price: 2500 }]
};

const categoryAddOnGroups = {
	rice: 'rice-proteins', 'beans-legumes': 'beans-proteins', noodles: 'noodles-proteins', 'yam-plantain': 'yam-proteins', 'swallow-soup': 'swallow-proteins'
};

const dishAddOnGroups = {
	'Jollof Rice': 'rice-proteins', 'Fried Rice': 'rice-proteins', 'Beans & Plantain': 'beans-proteins',
	'Yam & Egg Sauce': 'yam-proteins', 'Yam Porridge (Asaro)': 'yam-proteins', 'Fried Yam & Egg Sauce': 'yam-proteins',
	'Pepper Soup': 'pepper-soup-proteins'
};

function getAddOnGroup(dish) {
	return dishAddOnGroups[dish.name] || categoryAddOnGroups[dish.category] || null;
}

function dishCardMarkup(dish, featured = false) {
	const cardClass = featured ? 'dish-card reveal-on-scroll' : 'menu-item reveal-on-scroll';
	const contentClass = featured ? 'dish-details' : 'menu-item-content';
	const metaClass = featured ? 'dish-meta' : 'menu-item-meta';
	const badgeClass = dish.badgeClass ? ` menu-badge-${dish.badgeClass}` : '';
	const orderAction = featured ? '' : `<button class="add-to-cart" type="button" data-add-to-cart="${menuDishes.indexOf(dish)}">${getAddOnGroup(dish) ? 'Meal Options' : 'Add to Cart'}</button>`;
	return `<article class="${cardClass}" data-menu-section="${getMenuSection(dish)}" data-category="${getMenuCategory(dish)}"><div class="${featured ? 'dish-image' : 'menu-item-image'}"><img src="${dish.image}" alt="${dish.name}" loading="lazy" decoding="async"><span class="image-placeholder" aria-hidden="true">${dish.name}</span></div><div class="${contentClass}"><div class="${metaClass}"><span>${featured ? dish.categoryLabel === 'Mains' ? 'House Favourite' : dish.categoryLabel : getMenuCategoryLabel(getMenuCategory(dish))}</span><span>${dish.price}</span></div><h3>${dish.name}</h3><p>${dish.description}</p>${featured ? '' : `<span class="menu-badge${badgeClass}">${dish.badge}</span>${orderAction}`}</div></article>`;
}

const featuredNames = ['Jollof Rice', 'Pounded Yam & Egusi Soup', 'Suya', 'Pepper Soup'];
document.querySelector('[data-featured-dishes]')?.insertAdjacentHTML('beforeend', menuDishes.filter((dish) => featuredNames.includes(dish.name)).map((dish) => dishCardMarkup(dish, true)).join(''));
document.querySelector('[data-menu-grid]')?.insertAdjacentHTML('beforeend', menuDishes.map((dish) => dishCardMarkup(dish)).join(''));

const menuSectionsContainer = document.querySelector('[data-menu-sections]');
const menuSubcategoriesContainer = document.querySelector('[data-menu-subcategories]');
const populatedCategories = new Set(menuDishes.map((dish) => getMenuCategory(dish)));

function renderMenuNavigation(activeSection = 'food') {
	if (!menuSectionsContainer || !menuSubcategoriesContainer) return;
	menuSectionsContainer.innerHTML = Object.keys(menuCategoryDefinitions).map((section) => `<button class="menu-section-button${section === activeSection ? ' is-active' : ''}" type="button" data-menu-section-filter="${section}" role="tab" aria-selected="${section === activeSection}">${section === 'food' ? 'Food' : 'Drinks'}</button>`).join('');
	const definitions = menuCategoryDefinitions[activeSection];
	menuSubcategoriesContainer.innerHTML = `<button class="filter-button is-active" type="button" data-filter="all" aria-pressed="true">All ${activeSection === 'food' ? 'Food' : 'Drinks'}</button>${definitions.map((definition) => `<button class="filter-button" type="button" data-filter="${definition.key}" aria-pressed="false">${definition.label}</button>`).join('')}`;
}

renderMenuNavigation();

const cartDrawer = document.querySelector('[data-cart-drawer]');
const cartItems = document.querySelector('[data-cart-items]');
const cartEmpty = document.querySelector('[data-cart-empty]');
const cartOverlay = document.querySelector('[data-cart-overlay]');
const cartOpenButton = document.querySelector('[data-cart-open]');
const cartCloseButton = document.querySelector('[data-cart-close]');
const cartCheckout = document.querySelector('[data-cart-checkout]');
const customizationOverlay = document.querySelector('[data-customization-overlay]');
const customizationModal = document.querySelector('[data-customization-modal]');
const customizationName = document.querySelector('[data-customization-name]');
const customizationBase = document.querySelector('[data-customization-base]');
const customizationTotal = document.querySelector('[data-customization-total]');
const addonList = document.querySelector('[data-addon-list]');
const customizationAdd = document.querySelector('[data-customization-add]');
const customizationClose = document.querySelector('[data-customization-close]');
const checkoutOverlay = document.querySelector('[data-checkout-overlay]');
const checkoutModal = document.querySelector('[data-checkout-modal]');
const checkoutSummary = document.querySelector('[data-checkout-summary]');
const checkoutTotal = document.querySelector('[data-checkout-total]');
const checkoutClose = document.querySelector('[data-checkout-close]');
const placeOrder = document.querySelector('[data-place-order]');
// Keep a local fallback so checkout also works when HTML is opened directly from disk.
const defaultDeliveryZones = [
	{ name: 'Nearby Abeokuta', keywords: ['gra', 'oke ilewo', 'kuto', 'ijoora', 'oke mosan'], fee: 1000 },
	{ name: 'Central Abeokuta', keywords: ['adatan', 'isale abetu', 'ita eko', 'ikeja', 'obantoko', 'panseke', 'laderin'], fee: 1500 },
	{ name: 'Extended Abeokuta', keywords: ['olomore', 'sapon', 'ita osin', 'agbado', 'owode'], fee: 2500 }
];
let deliveryZones = defaultDeliveryZones;
const deliveryFee = 1500;

function findDeliveryZone(area, city) {
	const normalizedArea = String(area || '').trim();
	const normalizedCity = String(city || '').trim();
	if (normalizedArea.length < 3 || normalizedCity.length < 3) return null;
	const location = `${normalizedArea} ${normalizedCity}`.toLowerCase();
	return deliveryZones.find((zone) => zone.keywords.some((keyword) => location.includes(keyword))) || { name: 'Manual delivery location', fee: deliveryFee };
}
let cart = JSON.parse(window.localStorage.getItem('max-kitchen-cart') || '[]');
let customizationDish = null;
let selectedAddOns = [];

function formatPrice(amount) {
	return `₦${amount.toLocaleString('en-NG')}`;
}

function saveCart() {
	window.localStorage.setItem('max-kitchen-cart', JSON.stringify(cart));
}

function renderCart() {
	const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
	const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
	const currentDeliveryFee = itemCount > 0 ? deliveryFee : 0;
	const total = subtotal + currentDeliveryFee;

	document.querySelector('[data-cart-count]').textContent = itemCount;
	document.querySelector('[data-cart-launcher-total]').textContent = formatPrice(total);
	document.querySelector('[data-cart-subtotal]').textContent = formatPrice(subtotal);
	document.querySelector('[data-cart-delivery]').textContent = formatPrice(currentDeliveryFee);
	document.querySelector('[data-cart-total]').textContent = formatPrice(total);
	cartEmpty.hidden = itemCount > 0;
	cartCheckout.disabled = itemCount === 0;
	cartItems.innerHTML = cart.map((item) => `
		<article class="cart-item">
			<div><h3>${item.name}</h3><p>Base price: ${formatPrice(item.basePrice || item.price)}</p>${item.addOns?.length ? `<ul class="cart-addons">${item.addOns.map((addon) => `<li>${addon.name} <span>+${formatPrice(addon.price)}</span></li>`).join('')}</ul>` : ''}</div>
			<div class="cart-item-actions">
				<div class="quantity-control" aria-label="Quantity for ${item.name}">
					<button type="button" data-cart-decrease="${item.id}" aria-label="Decrease ${item.name}">−</button>
					<strong>${item.quantity}</strong>
					<button type="button" data-cart-increase="${item.id}" aria-label="Increase ${item.name}">+</button>
				</div>
				<strong aria-label="Final item price">${formatPrice(item.price * item.quantity)}</strong>
				<button class="cart-remove" type="button" data-cart-remove="${item.id}">Remove</button>
			</div>
		</article>
	`).join('');
	saveCart();
}

function changeCartItem(id, change) {
	const item = cart.find((cartItem) => cartItem.id === id);
	if (!item) return;
	item.quantity += change;
	if (item.quantity <= 0) cart = cart.filter((cartItem) => cartItem.id !== id);
	renderCart();
}

function openCart() {
	cartDrawer.classList.add('is-open');
	cartDrawer.setAttribute('aria-hidden', 'false');
	cartOpenButton.setAttribute('aria-expanded', 'true');
	cartOverlay.hidden = false;
	window.requestAnimationFrame(() => cartOverlay.classList.add('is-visible'));
	cartCloseButton.focus();
}

function closeCart() {
	cartDrawer.classList.remove('is-open');
	cartDrawer.setAttribute('aria-hidden', 'true');
	cartOpenButton.setAttribute('aria-expanded', 'false');
	cartOverlay.classList.remove('is-visible');
	window.setTimeout(() => { cartOverlay.hidden = true; }, 250);
}

document.querySelector('[data-menu-grid]')?.addEventListener('click', (event) => {
	const addButton = event.target.closest('[data-add-to-cart]');
	if (!addButton) return;
	const dish = menuDishes[Number(addButton.dataset.addToCart)];
	if (getAddOnGroup(dish)) {
		openCustomization(dish);
		return;
	}
	addDishToCart(dish, []);
	const existingItem = cart.find((item) => item.id === `${menuDishes.indexOf(dish)}`);
	addButton.textContent = existingItem ? `Added (${existingItem.quantity})` : 'Added to order';
	addButton.classList.add('is-added');
	window.setTimeout(() => { addButton.textContent = 'Add to Cart'; addButton.classList.remove('is-added'); }, 1400);
});

function addDishToCart(dish, addOns) {
	const dishIndex = menuDishes.indexOf(dish);
	const addOnKey = addOns.map((addon) => addon.name).sort().join('|');
	const id = `${dishIndex}:${addOnKey}`;
	const existingItem = cart.find((item) => item.id === id);
	if (existingItem) existingItem.quantity += 1;
	else {
		const basePrice = Number(dish.price.replace(/[^0-9]/g, ''));
		cart.push({ id, name: dish.name, basePrice, addOns, price: basePrice + addOns.reduce((total, addon) => total + addon.price, 0), quantity: 1 });
	}
	renderCart();
}

function updateCustomizationTotal() {
	const basePrice = Number(customizationDish.price.replace(/[^0-9]/g, ''));
	const total = basePrice + selectedAddOns.reduce((sum, addon) => sum + addon.price, 0);
	customizationTotal.textContent = formatPrice(total);
}

function openCustomization(dish) {
	customizationDish = dish;
	selectedAddOns = [];
	customizationName.textContent = dish.name;
	customizationBase.textContent = formatPrice(Number(dish.price.replace(/[^0-9]/g, '')));
	const addOnGroup = addOnGroups[getAddOnGroup(dish)];
	addonList.innerHTML = addOnGroup.map((addon, index) => `<label class="addon-option"><input type="checkbox" value="${index}"><span><strong>${addon.name}</strong><small>Optional addition</small></span><b>+${formatPrice(addon.price)}</b></label>`).join('');
	addonList.querySelectorAll('input').forEach((input) => input.addEventListener('change', () => {
		selectedAddOns = [...addonList.querySelectorAll('input:checked')].map((checked) => addOnGroup[Number(checked.value)]);
		input.closest('.addon-option').classList.toggle('is-selected', input.checked);
		updateCustomizationTotal();
	}));
	updateCustomizationTotal();
	customizationModal.classList.add('is-open');
	customizationModal.setAttribute('aria-hidden', 'false');
	customizationOverlay.hidden = false;
	window.requestAnimationFrame(() => customizationOverlay.classList.add('is-visible'));
	customizationClose.focus();
}

function closeCustomization() {
	customizationModal.classList.remove('is-open');
	customizationModal.setAttribute('aria-hidden', 'true');
	customizationOverlay.classList.remove('is-visible');
	window.setTimeout(() => { customizationOverlay.hidden = true; }, 250);
}

customizationAdd?.addEventListener('click', () => {
	if (!customizationDish) return;
	addDishToCart(customizationDish, selectedAddOns);
	closeCustomization();
});
customizationClose?.addEventListener('click', closeCustomization);
customizationOverlay?.addEventListener('click', closeCustomization);

function openCheckout() {
	const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
	const total = subtotal + deliveryFee;
	checkoutSummary.innerHTML = cart.map((item) => `<article class="checkout-line"><h3>${item.name} <strong>×${item.quantity}</strong></h3><p>Base price: ${formatPrice(item.basePrice || item.price)}</p>${item.addOns?.map((addon) => `<p>${addon.name} +${formatPrice(addon.price)}</p>`).join('') || ''}<p><strong>Item total: ${formatPrice(item.price * item.quantity)}</strong></p></article>`).join('') + `<article class="checkout-line"><p>Delivery <strong>${formatPrice(deliveryFee)}</strong></p><p><strong>Order total</strong> <strong>${formatPrice(total)}</strong></p></article>`;
	checkoutTotal.textContent = formatPrice(total);
	checkoutModal.classList.add('is-open');
	checkoutModal.setAttribute('aria-hidden', 'false');
	checkoutOverlay.hidden = false;
	window.requestAnimationFrame(() => checkoutOverlay.classList.add('is-visible'));
	checkoutClose.focus();
}

function closeCheckout() {
	checkoutModal.classList.remove('is-open');
	checkoutModal.setAttribute('aria-hidden', 'true');
	checkoutOverlay.classList.remove('is-visible');
	window.setTimeout(() => { checkoutOverlay.hidden = true; }, 250);
}

cartCheckout?.addEventListener('click', () => { window.location.href = 'checkout.html'; });
checkoutClose?.addEventListener('click', closeCheckout);
checkoutOverlay?.addEventListener('click', closeCheckout);
placeOrder?.addEventListener('click', () => {
	window.localStorage.setItem('max-kitchen-last-order', JSON.stringify({ items: cart, total: cart.reduce((sum, item) => sum + (item.price * item.quantity), deliveryFee) }));
	window.alert('Your order total is confirmed. Payment details will be collected next.');
	closeCheckout();
});

const checkoutPage = document.querySelector('[data-checkout-page]');
const checkoutForm = document.querySelector('[data-checkout-form]');

if (checkoutPage && checkoutForm) {
	const pageItems = document.querySelector('[data-page-checkout-items]');
	const pageSubtotal = document.querySelector('[data-page-subtotal]');
	const pageFee = document.querySelector('[data-page-fee]');
	const pageFeeLabel = document.querySelector('[data-page-fee-label]');
	const pageTotal = document.querySelector('[data-page-total]');
	const deliveryFields = document.querySelector('[data-delivery-fields]');
	const deliveryZoneStatus = document.querySelector('[data-delivery-zone-status]');
	const formStatus = document.querySelector('[data-checkout-form-status]');
	const demoPaymentOverlay = document.querySelector('[data-demo-payment-overlay]');
	const demoPaymentModal = document.querySelector('[data-demo-payment-modal]');
	const demoPaymentTotal = document.querySelector('[data-demo-payment-total]');
	const demoPaymentAddress = document.querySelector('[data-demo-payment-address]');
	const demoPaymentStatus = document.querySelector('[data-demo-payment-status]');
	const demoPaymentConfirm = document.querySelector('[data-demo-payment-confirm]');
	const demoPaymentClose = document.querySelector('[data-demo-payment-close]');
	const fulfilmentInputs = checkoutForm.querySelectorAll('input[name="fulfilment"]');
	const areaInput = checkoutForm.querySelector('input[name="area"]');
	const cityInput = checkoutForm.querySelector('input[name="city"]');

	function getFulfilment() {
		return checkoutForm.querySelector('input[name="fulfilment"]:checked')?.value || 'delivery';
	}

	function renderCheckoutPage() {
		const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
		const isDelivery = getFulfilment() === 'delivery';
		const deliveryZone = isDelivery ? findDeliveryZone(areaInput.value, cityInput.value) : null;
		const currentFee = isDelivery && cart.length && deliveryZone ? deliveryZone.fee : 0;
		pageItems.innerHTML = cart.length ? cart.map((item) => `<article class="checkout-order-item"><div><h3>${item.name} <span>×${item.quantity}</span></h3><p>Base price: ${formatPrice(item.basePrice || item.price)}</p>${item.addOns?.map((addon) => `<p>${addon.name} <strong>+${formatPrice(addon.price)}</strong></p>`).join('') || ''}</div><strong>${formatPrice(item.price * item.quantity)}</strong></article>`).join('') : '<p class="checkout-empty">Your order is empty. <a href="menu.html">Return to the menu</a> to choose something delicious.</p>';
		pageSubtotal.textContent = formatPrice(subtotal);
		pageFeeLabel.textContent = isDelivery ? 'Delivery fee' : 'Pickup fee';
		pageFee.textContent = formatPrice(currentFee);
		pageTotal.textContent = formatPrice(subtotal + currentFee);
		deliveryFields.hidden = !isDelivery;
		deliveryZoneStatus.hidden = !isDelivery;
		deliveryZoneStatus.classList.toggle('is-unavailable', isDelivery && areaInput.value.trim().length > 1 && !deliveryZone);
		deliveryZoneStatus.textContent = !isDelivery ? '' : deliveryZone ? `${deliveryZone.name}: delivery is available for ${formatPrice(deliveryZone.fee)}.` : areaInput.value.trim().length > 1 ? 'Delivery is currently unavailable for this location. Please check the area or choose Pickup.' : 'Enter your area to calculate the delivery fee.';
		deliveryFields.querySelectorAll('input, textarea').forEach((field) => { field.required = isDelivery && field.name !== 'instructions'; });
		fulfilmentInputs.forEach((input) => input.closest('.fulfilment-option').classList.toggle('is-selected', input.checked));
	}

	fulfilmentInputs.forEach((input) => input.addEventListener('change', renderCheckoutPage));
	areaInput.addEventListener('input', renderCheckoutPage);
	cityInput.addEventListener('input', renderCheckoutPage);
	let pendingDemoOrder = null;
	let pendingSubmitButton = null;

	function closeDemoPayment() {
		demoPaymentModal.classList.remove('is-open');
		demoPaymentModal.setAttribute('aria-hidden', 'true');
		demoPaymentOverlay.classList.remove('is-visible');
		window.setTimeout(() => { demoPaymentOverlay.hidden = true; }, 250);
		if (pendingSubmitButton) {
			pendingSubmitButton.disabled = false;
			pendingSubmitButton.textContent = 'Pay Now';
		}
	}

	function openDemoPayment(order, submitButton) {
		pendingDemoOrder = order;
		pendingSubmitButton = submitButton;
		demoPaymentTotal.textContent = formatPrice(order.total);
		demoPaymentAddress.textContent = order.customer.fulfilment === 'pickup' ? 'Pickup from MAX KITCHEN, 12 Quarry Road, GRA, Abeokuta.' : `${order.customer.address}, ${order.customer.area}, ${order.customer.city}`;
		demoPaymentStatus.textContent = '';
		demoPaymentConfirm.disabled = false;
		demoPaymentConfirm.textContent = 'Confirm Demo Payment';
		demoPaymentModal.classList.add('is-open');
		demoPaymentModal.setAttribute('aria-hidden', 'false');
		demoPaymentOverlay.hidden = false;
		window.requestAnimationFrame(() => demoPaymentOverlay.classList.add('is-visible'));
		demoPaymentConfirm.focus();
	}

	demoPaymentClose?.addEventListener('click', closeDemoPayment);
	demoPaymentOverlay?.addEventListener('click', closeDemoPayment);
	demoPaymentConfirm?.addEventListener('click', () => {
		if (!pendingDemoOrder) return;
		demoPaymentConfirm.disabled = true;
		demoPaymentConfirm.textContent = 'Processing demo payment...';
		window.setTimeout(() => {
			const method = checkoutForm.querySelector('input[name="demo-payment-method"]:checked')?.value || 'Card';
			const orderNumber = `MK-DEMO-${Date.now().toString().slice(-8)}`;
			const paidOrder = { ...pendingDemoOrder, orderNumber, paymentMethod: method, paymentStatus: 'Paid', status: 'Order Received' };
			window.localStorage.setItem('max-kitchen-last-order', JSON.stringify({ ...paidOrder, paymentReference: orderNumber }));
			window.location.href = `confirmation.html?reference=${encodeURIComponent(orderNumber)}&status=success&demo=true`;
		}, 650);
	});

	checkoutForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		formStatus.textContent = '';
		if (!cart.length) {
			formStatus.textContent = 'Your order is empty. Please return to the menu.';
			return;
		}
		if (!checkoutForm.checkValidity()) {
			checkoutForm.reportValidity();
			return;
		}
		const formData = new FormData(checkoutForm);
		const address = String(formData.get('address') || '').trim();
		const area = String(formData.get('area') || '').trim();
		const city = String(formData.get('city') || '').trim();
		if (formData.get('fulfilment') === 'delivery' && (address.length < 5 || area.length < 3 || city.length < 3)) {
			formStatus.textContent = 'Enter a meaningful street address, area or landmark, and city before continuing.';
			return;
		}
		const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
		const deliveryZone = findDeliveryZone(area, city);
		if (formData.get('fulfilment') === 'delivery' && !deliveryZone) {
			formStatus.textContent = 'Enter a meaningful delivery location to continue.';
			return;
		}
		const currentFee = formData.get('fulfilment') === 'delivery' ? deliveryZone.fee : 0;
		const order = { customer: Object.fromEntries(formData.entries()), items: cart, subtotal, deliveryFee: currentFee, total: subtotal + currentFee, createdAt: new Date().toISOString() };
		const submitButton = checkoutForm.querySelector('button[type="submit"]');
		submitButton.disabled = true;
		submitButton.textContent = 'Pay Now';
		openDemoPayment(order, submitButton);
	});

	fetch('delivery-zones.json')
		.then((response) => {
			if (!response.ok) throw new Error('Delivery zones could not be loaded.');
			return response.json();
		})
		.then((zones) => {
			deliveryZones = zones;
			renderCheckoutPage();
		})
		.catch(() => {
			deliveryZones = defaultDeliveryZones;
			renderCheckoutPage();
			deliveryZoneStatus.textContent = 'Using local demo delivery zones.';
			deliveryZoneStatus.classList.remove('is-unavailable');
		});
}

cartItems?.addEventListener('click', (event) => {
	const control = event.target.closest('[data-cart-increase], [data-cart-decrease], [data-cart-remove]');
	if (!control) return;
	const id = control.dataset.cartIncrease || control.dataset.cartDecrease || control.dataset.cartRemove;
	if (control.dataset.cartRemove) cart = cart.filter((item) => item.id !== id);
	else changeCartItem(id, control.dataset.cartIncrease ? 1 : -1);
	if (control.dataset.cartRemove) renderCart();
});

cartOpenButton?.addEventListener('click', openCart);
cartCloseButton?.addEventListener('click', closeCart);
cartOverlay?.addEventListener('click', closeCart);
if (cartItems) renderCart();

document.querySelectorAll('.menu-item-image img, .dish-image img').forEach((image) => {
	image.addEventListener('error', () => {
		image.hidden = true;
		image.parentElement.classList.add('image-missing');
	});
});

const revealItems = document.querySelectorAll('.reveal-on-scroll');
if (prefersReducedMotion) {
	revealItems.forEach((item) => item.classList.add('visible'));
} else if ('IntersectionObserver' in window) {
	const observer = new IntersectionObserver((entries, instance) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				instance.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });
	revealItems.forEach((item) => observer.observe(item));
} else {
	revealItems.forEach((item) => item.classList.add('visible'));
}

const menuItems = document.querySelectorAll('.menu-item');
const filterTimers = new Map();
let activeMenuSection = 'food';
let activeMenuCategory = 'all';


function filterMenu(category = activeMenuCategory) {
	activeMenuCategory = category;
	const filterButtons = document.querySelectorAll('.filter-button');
	filterButtons.forEach((button) => {
		const isActive = button.dataset.filter === activeMenuCategory;
		button.classList.toggle('is-active', isActive);
		button.setAttribute('aria-pressed', String(isActive));
	});

	menuItems.forEach((item) => {
		const matches = item.dataset.menuSection === activeMenuSection && (activeMenuCategory === 'all' || item.dataset.category === activeMenuCategory);
		const existingTimer = filterTimers.get(item);
		if (existingTimer) window.clearTimeout(existingTimer);

		if (matches) {
			item.hidden = false;
			window.requestAnimationFrame(() => item.classList.remove('is-hiding'));
		} else {
			item.classList.add('is-hiding');
			filterTimers.set(item, window.setTimeout(() => {
				item.hidden = true;
			}, 300));
		}
	});
}

menuSectionsContainer?.addEventListener('click', (event) => {
	const button = event.target.closest('[data-menu-section-filter]');
	if (!button) return;
	activeMenuSection = button.dataset.menuSectionFilter;
	activeMenuCategory = 'all';
	renderMenuNavigation(activeMenuSection);
	filterMenu();
});

menuSubcategoriesContainer?.addEventListener('click', (event) => {
	const button = event.target.closest('[data-filter]');
	if (button) filterMenu(button.dataset.filter);
});

filterMenu();

// Reservation and newsletter interactions are frontend-only demonstrations.
const reservationForm = document.querySelector('[data-reservation-form]');
const reservationModal = document.querySelector('[data-reservation-modal]');

if (reservationForm && reservationModal) {
	const reservationDate = reservationForm.querySelector('#date');
	const reservationName = reservationForm.querySelector('#full-name');
	const reservationPhone = reservationForm.querySelector('#phone');
	const confirmationName = reservationModal.querySelector('[data-reservation-name]');
	const closeButton = reservationModal.querySelector('[data-reservation-close]');
	const doneButton = reservationModal.querySelector('[data-reservation-done]');
	const today = new Date();
	const todayString = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
	reservationDate.min = todayString;
	function validatePhone() {
		const isValid = /^[+0-9 ()-]{7,}$/.test(reservationPhone.value.trim());
		reservationPhone.setCustomValidity(isValid ? '' : 'Enter a valid phone number.');
	}
	reservationPhone.addEventListener('input', validatePhone);

	function closeReservationModal() {
		reservationModal.classList.remove('is-open');
		reservationModal.setAttribute('aria-hidden', 'true');
		reservationForm.querySelector('button[type="submit"]').focus();
	}

	reservationForm.addEventListener('submit', (event) => {
		event.preventDefault();
		validatePhone();
		if (!reservationForm.checkValidity()) {
			reservationForm.reportValidity();
			return;
		}

		confirmationName.textContent = reservationName.value.trim().split(/\s+/)[0];
		reservationModal.classList.add('is-open');
		reservationModal.setAttribute('aria-hidden', 'false');
		closeButton.focus();
	});

	closeButton.addEventListener('click', closeReservationModal);
	doneButton.addEventListener('click', closeReservationModal);
	reservationModal.addEventListener('click', (event) => {
		if (event.target === reservationModal) closeReservationModal();
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && reservationModal.classList.contains('is-open')) closeReservationModal();
	});
}

document.querySelectorAll('[data-newsletter-form]').forEach((newsletterForm) => {
	newsletterForm.addEventListener('submit', (event) => {
		event.preventDefault();
		if (!newsletterForm.checkValidity()) {
			newsletterForm.reportValidity();
			return;
		}

		const status = newsletterForm.closest('.footer-newsletter')?.querySelector('[data-newsletter-status]');
		if (status) status.textContent = 'Thank you. You are on the list.';
		newsletterForm.reset();
	});
});

const trackingPage = document.querySelector('[data-tracking-page]');
const trackingForm = document.querySelector('[data-tracking-form]');

if (trackingPage && trackingForm) {
	const orderNumberInput = trackingForm.querySelector('[name="orderNumber"]');
	const trackingStatus = trackingForm.querySelector('[data-tracking-status]');
	const trackingResult = trackingForm.querySelector('[data-tracking-result]');
	const trackingNumber = trackingForm.querySelector('[data-tracking-number]');
	const trackingCurrentStatus = trackingForm.querySelector('[data-tracking-current-status]');
	const trackingSteps = [...trackingForm.querySelectorAll('[data-tracking-step]')];

	trackingForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		if (!trackingForm.checkValidity()) {
			trackingForm.reportValidity();
			return;
		}

		const submitButton = trackingForm.querySelector('button[type="submit"]');
		const orderNumber = orderNumberInput.value.trim().toUpperCase();
		submitButton.disabled = true;
		submitButton.textContent = 'Checking order...';
		trackingResult.hidden = true;
		trackingStatus.className = 'tracking-status';
		trackingStatus.textContent = '';

		try {
			const order = JSON.parse(window.localStorage.getItem('max-kitchen-last-order') || 'null');
			if (!order || order.orderNumber !== orderNumber || order.paymentStatus !== 'Paid') throw new Error('That paid demo order could not be found in this browser.');
			trackingNumber.textContent = order.orderNumber;
			trackingCurrentStatus.textContent = order.status;
			const currentStep = trackingSteps.findIndex((step) => step.dataset.trackingStep === order.status);
			trackingSteps.forEach((step, index) => step.classList.toggle('is-current', index === currentStep));
			trackingResult.hidden = false;
			trackingStatus.className = 'tracking-status is-success';
			trackingStatus.textContent = order.customer.fulfilment === 'pickup' ? 'Your demo pickup order is being prepared at MAX KITCHEN.' : 'Your demo delivery order is moving through the kitchen and delivery process.';
		} catch (error) {
			trackingStatus.className = 'tracking-status is-error';
			trackingStatus.textContent = error.message;
		} finally {
			submitButton.disabled = false;
			submitButton.textContent = 'Check order status';
		}
	});
}