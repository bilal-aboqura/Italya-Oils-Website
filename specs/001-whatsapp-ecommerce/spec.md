# Feature Specification: Automotive Oils E-Commerce & Admin Platform

**Feature Branch**: `001-whatsapp-ecommerce`  
**Created**: 2026-02-26  
**Status**: Draft  
**Input**: User description: "Build an e-commerce platform for automotive engine oils (Mobil 1, Shell, Castrol, TotalEnergies) operating without a traditional payment gateway. The core user flow allows customers to browse products, manage a shopping cart, fill out contact details, and submit the order. Upon submission, the cart contents and user details are automatically formatted and sent as a message to a designated customer service WhatsApp number. The system must include a comprehensive 'Salla-like' Admin Panel with three primary capabilities: 1. Dynamic Promos: Admins can inject promotional banners into specific storefront pages directly from the dashboard. 2. Bulk Import: Admins can bulk upload products via Excel spreadsheets. 3. Post-Import Management: Since the Excel files lack images, admins must be able to bulk-assign categories to uploaded products, and edit individual products to upload and attach their missing images later."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Customer Browsing and WhatsApp Checkout (Priority: P1)

A customer visits the storefront, browses available engine oils, adds items to their shopping cart, and completes the purchase bypassing traditional payment gateways. Instead, they provide their contact details and the order is formatted and sent to the business via WhatsApp.

**Why this priority**: This is the core conversion path for the business, enabling sales.

**Independent Test**: Can be fully tested by adding a product to the cart, filling out dummy customer details, and verifying that a correctly formatted WhatsApp link is generated with the order contents.

**Acceptance Scenarios**:

1. **Given** a customer has items in their cart, **When** they proceed to checkout and submit their contact details, **Then** the system validates the input and opens a WhatsApp chat with a pre-filled message containing the order summary and user details.
2. **Given** a customer is browsing products, **When** they filter by brand (e.g., Castrol) or category, **Then** only the relevant products are displayed.

---

### User Story 2 - Admin Bulk Import and Post-Import Management (Priority: P1)

An administrator uploads a large catalog of products using an Excel spreadsheet. Since the spreadsheet lacks images and categories, the admin then uses the dashboard to bulk-assign categories and manually upload images for specific products.

**Why this priority**: The storefront requires a scalable way to populate and update its inventory. Without this, the store cannot effectively manage the product catalog.

**Independent Test**: Can be fully tested by uploading a sample Excel file, verifying the products appear in the dashboard, selecting multiple products to assign a category, and uploading an image to a single product.

**Acceptance Scenarios**:

1. **Given** an admin is on the bulk import page, **When** they upload a valid Excel spreadsheet, **Then** the system parses the file and creates draft product entries in the database.
2. **Given** newly imported products without categories, **When** an admin selects multiple products and applies a category, **Then** all selected products are updated simultaneously.
3. **Given** a product without an image, **When** an admin edits the product and uploads an image file, **Then** the image is attached to the product and it becomes fully visible on the customer storefront.

---

### User Story 3 - Admin Dynamic Promos (Priority: P2)

An administrator wants to run a marketing campaign. They use the dashboard to upload a promotional banner and configure it to display on specific pages in the customer storefront.

**Why this priority**: Essential for marketing and driving sales, but secondary to basic checkout and inventory management.

**Independent Test**: Can be tested by creating a promo banner in the admin panel, targeting the homepage, and verifying the banner appears on the customer-facing homepage upon reload.

**Acceptance Scenarios**:

1. **Given** an admin is creating a promo, **When** they upload a banner image and select a target page, **Then** the promo becomes active.
2. **Given** an active promo injected into a specific page, **When** a customer visits that page, **Then** the promotional banner is displayed smoothly without breaking the layout.

### Edge Cases

- What happens when a customer tries to submit the WhatsApp checkout with missing contact details? (Should block submission and show validation errors).
- How does system handle an admin attempting to upload an improperly formatted Excel file? (Should reject the upload and provide a clear error message indicating expected columns).
- What happens if a promotional banner image is too large or has unsupported dimensions? (Should reject the upload or automatically resize to maintain UX consistency).
- What happens if a product is displayed on the storefront before the admin has uploaded an image? (Should display the product normally but with a branded "Image Coming Soon" placeholder).

## Requirements _(mandatory)_

## Clarifications

### Session 2026-02-26

- Q: What specific contact details are required to submit an order via WhatsApp? → A: Name, Delivery Address, and explicitly requested Phone Number.
- Q: When a product is imported but does not yet have an image uploaded, how should it be displayed on the customer storefront? → A: Display the product normally, but use a branded "Image Coming Soon" or generic Category placeholder.

### Functional Requirements

_Core Constitution Requirements (Applied to all features):_

- **FR-001**: System MUST preserve the provided HTML UI design exactly (Responsive UX Consistency).
- **FR-002**: System MUST validate all user inputs rigorously on the client side (Robust Data Validation).
- **FR-003**: System MUST be capable of handling bulk data operations efficiently (Scalable Backend Architecture).
- **FR-004**: System MUST support dynamic content injection (Scalable Backend Architecture).
- **FR-005**: System MUST ensure components are optimized and cohesive (High-Performance Modular Code).

_Feature-Specific Requirements:_

- **FR-006**: System MUST allow customers to add, remove, and update quantities of products in a shopping cart.
- **FR-007**: System MUST generate a properly URLEncoded WhatsApp message link containing the cart items, quantities, total price, and customer contact details (Name, Delivery Address, Phone Number) upon checkout.
- **FR-008**: System MUST parse uploaded Excel spreadsheets to create product records (name, description, price, SKU) in bulk.
- **FR-009**: System MUST support bulk-assigning categories or applying bulk edits to multiple product records simultaneously in the admin panel.
- **FR-010**: System MUST allow admins to upload standard image files (JPG, PNG, WebP) and attach them to individual products.
- **FR-011**: System MUST allow admins to manage (create, read, update, delete) promotional banners and configure the specific storefront pages where they will be injected. If multiple banners target the same page, the system MUST display them stacked or in a carousel.

### Key Entities

- **Customer**: Represents the shopper's session and checkout contact details.
- **Product**: Represents an engine oil item, including attributes like brand, viscosity, price, SKU, category, and an optional image URL.
- **Category**: Represents a logical grouping of products (e.g., Engine Oils, Transmission Fluids, specific Brands).
- **Cart**: The temporary collection of products selected for purchase.
- **PromoBanner**: Represents an administrative banner, including its image asset, link (optional), and target injection location.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Customers can successfully browse products, manage their cart, and trigger the WhatsApp checkout flow without encountering errors.
- **SC-002**: Admins can successfully process an Excel upload containing at least 500 product records within 10 seconds.
- **SC-003**: Bulk category assignment for 50+ products completes efficiently without timing out or freezing the admin dashboard.
- **SC-004**: Promotional banners configured in the admin dashboard appear on the designated customer storefront pages immediately upon saving.
- **SC-005**: All forms on the checkout flow include immediate client-side validation to prevent empty or incorrectly formatted details from being processed.

## Assumptions

- A single, globally configured WhatsApp number will be used to receive all incoming orders.
- The business expects a relatively standard Excel format for bulk import (e.g., typical Salla/Shopify CSV/XLSX structure).
- Customers do not require account creation to place an order; the checkout is strictly guest-based.
