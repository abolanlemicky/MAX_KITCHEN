# MAX KITCHEN Restaurant Website

## Overview
MAX KITCHEN is a contemporary Nigerian restaurant in Abeokuta, Ogun State, offering an elegant dining experience rooted in local flavour. The website showcases the restaurant's story, Nigerian favourites, reservation options, and contact details, with menu prices displayed in Nigerian naira (₦).

## Project Structure
The project is organized as follows:

```
max-kitchen
├── css
│   ├── styles.css          # Main stylesheet for the website
│   └── responsive.css      # Styles for responsive design
├── js
│   ├── main.js             # Core functionality for the website
│   ├── menu.js             # Dynamic features for the menu page
│   ├── gallery.js          # Functionality for the gallery page
│   └── reservation.js      # Reservation form management
├── assets
│   ├── images              # Directory for images used in the website
│   └── icons               # Directory for icon files
├── index.html              # Main entry point for the Abeokuta restaurant website
├── menu.html               # Displays the restaurant's menu
├── about.html              # Information about the restaurant
├── gallery.html            # Collection of images showcasing the restaurant
├── reservation.html        # Online reservation form
└── contact.html            # Contact information and inquiry form
```

## Features
- **Homepage**: Welcoming users with an elegant design and easy navigation.
- **Menu Page**: Detailed descriptions and prices of dishes and drinks.
- **About Page**: Insight into the restaurant's history, mission, and values.
- **Gallery Page**: Visual showcase of the restaurant's ambiance and offerings.
- **Reservation Page**: User-friendly form for making reservations.
- **Contact Page**: Easy access to contact information and inquiry options.

## Technologies Used
- **HTML5**: For structuring the content of the website.
- **CSS3**: For styling and layout, achieving a contemporary luxury aesthetic.
- **Vanilla JavaScript**: For interactive elements and enhancing user experience.

## Setup Instructions
1. Clone the repository or download the project files.
2. Open `index.html` or `menu.html`, or serve the folder with any static web server. No Node.js server, Paystack key, `.env` file, or `localhost:3000` endpoint is required.

### Demo checkout

This is a frontend-only simulated checkout. The flow is `Cart -> Checkout -> Demo Payment -> confirmation`; it does not connect to Paystack or require MAX KITCHEN's server.

1. Add food, choose Meal Options, open the cart, and continue to checkout.
2. Enter customer and delivery information, then select `Pay Now`.
3. Choose Card or Bank Transfer and confirm. The browser creates a demo order number and marks the order `Paid` locally.
4. The confirmation page clearly labels the result as `Demo Payment Successful`; no money is charged.

### Optional restaurant order management

The legacy restaurant order management server is separate from customer checkout and is not required for payment.

1. Set `RESTAURANT_ADMIN_KEY` in `.env` to a long random value that is shared only with restaurant staff.
2. Open `/restaurant-orders.html` while the server is running.
3. Enter the management key to view incoming orders and update their status.

The management API is protected by the `x-restaurant-admin-key` request header. Customer pages never receive this key, and reservation requests remain a separate frontend-only flow.

## Contribution
Feel free to contribute to this project by suggesting improvements or adding new features. For any inquiries, please contact the project maintainer.

## License
This project is open-source and available for use and modification under the MIT License.