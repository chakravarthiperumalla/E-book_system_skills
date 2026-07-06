# UI/UX Wireframes & Design Document
## Project: Digital E-Book System ("E-Book Hub")

---

### Document Control
| Version | Date | Author | Description of Changes | Status |
| :--- | :--- | :--- | :--- | :--- |
| v1.0 | 2026-07-06 | UX/UI Designer | Created E-Book System Wireframes & Flows | Completed |

---

## 1. UX Design Principles & Decisions
To make the application intuitive for everyone, we use these key design choices:
- **Clear Call-to-Actions (CTAs):** Buttons like `Buy Now`, `Read Sample`, and `Add to Cart` will have high-contrast, bright colors so they stand out immediately.
- **Responsive Layout:** The design automatically adapts to mobile phones, tablets, and desktop computers.
- **Instant Visual Feedback:** Toast notifications (popup alerts) show up immediately when a user adds a book to the cart or triggers a download.
- **Secure Visual Cues:** Security locks, trust badges, and clear pricing elements will be used to build user trust during checkout.

---

## 2. Main User Flows

1. **Browsing Flow:**
   - User lands on the Homepage.
   - User searches for a book or clicks a genre.
   - User clicks on a book card to open the Product Details page.
2. **Purchase & Delivery Flow:**
   - User clicks `Add to Cart` or `Buy Now`.
   - User views the Shopping Cart, inputs a discount coupon, and clicks `Proceed to Checkout`.
   - User enters email, pays securely (simulated), and sees the Order Confirmation page.
   - User is redirected to the `My Library` page to download the E-Book instantly.
3. **Administration Flow:**
   - Admin logs in securely.
   - Admin uses the sidebar to navigate between `Manage Books` (CRUD inventory) and `Manage Orders` (sales analytics and logs).

---

## 3. Sample Screen Wireframes

### Screen 1: Homepage & E-Book Catalog
- **Purpose:** Welcome users, allow search/filters, and display E-Books.
- **Layout Description:**
  - **Header (Navbar):** Logo on the left, search bar in the center, navigation links (Catalog, My Library, Admin) and shopping cart icon with a badge counter on the right.
  - **Hero Banner:** A welcoming banner highlighting a featured E-Book or promotional deal with a quick checkout button.
  - **Sidebar Filter:** Left side of the page on desktop allows sorting by genres (Fiction, Tech, Bio), price ranges, and ratings.
  - **Product Grid:** Grid of books showing cover art, title, author, rating stars, price, and actions (`Cart` icon and `Read Sample` button).

#### Wireframe Diagram:
```text
+-----------------------------------------------------------------------------------+
|  [Logo] [Catalog]        [ Search book titles, authors...  ]      [Library] [Cart (2)] |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|    ==================== SPECIAL SUMMER E-BOOK FESTIVAL =======================    |
|    Get 30% off all tech books! use coupon: TECH30         [ Shop Now CTA ]        |
|    ===========================================================================    |
|                                                                                   |
|  FILTERS:            |  OUR E-BOOK CATALOG                                        |
|  - Genres            |  Sort by: [ Popularity v ]                                 |
|    [x] Technology    |  +--------------+  +--------------+  +--------------+      |
|    [ ] Fiction       |  |  [Book Cover]|  |  [Book Cover]|  |  [Book Cover]|      |
|    [ ] Biography     |  |              |  |              |  |              |      |
|  - Prices            |  | Python Pro   |  | UI/UX Secrets|  | Startup Life |      |
|    [ ] $0 - $10      |  | By J. Smith  |  | By A. Visual |  | By E. Founder|      |
|    [x] $10 - $30     |  | **** (4.8)   |  | ***** (4.9)  |  | *** (3.5)    |      |
|  - Ratings           |  | $19.99       |  | $24.99       |  | $14.99       |      |
|    [x] 4 Stars +     |  | [Sample] [Cart] | [Sample] [Cart] | [Sample] [Cart] |    |
|                      |  +--------------+  +--------------+  +--------------+      |
+-----------------------------------------------------------------------------------+
|  (c) E-Book Hub Inc. 2026. All rights reserved.                      [About] [FAQ] |
+-----------------------------------------------------------------------------------+
```

---

### Screen 2: E-Book Product Details & Preview Modal
- **Purpose:** Showcase metadata, descriptions, user reviews, and give access to a free sample.
- **Layout Description:**
  - **Left Section:** Large cover image, rating summary, and preview trigger.
  - **Right Section:** Detailed listing including title, author, formats (PDF/EPUB size), price, and high-visibility checkout buttons.
  - **Bottom Section:** Product Description tab, specifications, and customer review cards.
  - **Preview Modal:** Clicking `Read Sample` opens an overlay window displaying a scrollable PDF viewer with the first chapter.

#### Wireframe Diagram:
```text
+-----------------------------------------------------------------------------------+
|  [Logo]                  [ Search book titles, authors...  ]      [Library] [Cart (2)] |
+-----------------------------------------------------------------------------------+
|  < Back to Catalog                                                                |
|                                                                                   |
|  +------------------+   PYTHON PRO: ADVANCED CODING TECHNIQUES                    |
|  |                  |   Written by: John Smith  | Genre: Technology               |
|  |                  |   Format: PDF, EPUB (Digital Download)                      |
|  |   [BOOK COVER    |   Rating: ***** 4.8/5.0 (124 reviews)                       |
|  |     ART HERE]    |                                                             |
|  |                  |   Price: $19.99                                             |
|  |                  |                                                             |
|  +------------------+   [ Read Free Sample (Chapter 1) ]   <--- (Opens Modal Below)|
|                         [ ADD TO CART ]                                           |
|                         [ BUY NOW ] (Instant Checkout)                            |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | DESCRIPTION:                                                                |  |
|  | Unlock your potential with this step-by-step programming manual...          |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
|  MODAL POPUP (When "Read Free Sample" is clicked):                               |
|  +-----------------------------------------------------------------------------+  |
|  | [Python Pro - Chapter 1 Preview]                                   [ Close X] |  |
|  | --------------------------------------------------------------------------- |  |
|  | "Chapter 1: Getting Started with Antigravity... Code should fly..."         |  |
|  | [Next Page >]                                           Page 1 of 10        |  |
|  +-----------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------+
```

---

### Screen 3: Shopping Cart
- **Purpose:** Review items, apply promotional discount codes, and verify the cost before checkout.
- **Layout Description:**
  - **Main Left List:** Vertical list of selected items displaying cover, title, price, format, and a clear `Remove` button.
  - **Right Summary Panel:** Totals breakdown (Subtotal, Tax, Applied Discounts) and a promo-code input input field.
  - **Actions:** Quick links to continue browsing or proceed to the payment step.

#### Wireframe Diagram:
```text
+-----------------------------------------------------------------------------------+
|  [Logo]                  [ Search book titles, authors...  ]      [Library] [Cart (2)] |
+-----------------------------------------------------------------------------------+
|  YOUR SHOPPING CART (2 Items)                                                     |
|                                                                                   |
|  ITEM DETAILS                                | ORDER SUMMARY                      |
|  +----------------------------------------+  |                                    |
|  | [Cover]  Python Pro                    |  | Subtotal:                $44.98    |
|  |          Format: PDF | Price: $19.99   |  | Tax:                      $2.50    |
|  |          [ Remove Book ]               |  | Promo Discount:          -$6.00    |
|  |                                        |  |                                    |
|  | [Cover]  UI/UX Secrets                 |  | Total:                   $41.48    |
|  |          Format: EPUB | Price: $24.99  |  |                                    |
|  |          [ Remove Book ]               |  | [ Promo Code ] [ Apply ]           |
|  +----------------------------------------+  | Code Applied: TECH30               |
|                                              |                                    |
|  [ < Continue Shopping ]                     | [ PROCEED TO SECURE CHECKOUT ]     |
+-----------------------------------------------------------------------------------+
```

---

### Screen 4: Checkout & Payment Page
- **Purpose:** Securely gather customer email and processing credit card details.
- **Layout Description:**
  - **Left Form:** Email address (for sending download links) and payment input card details.
  - **Right Panel:** Immutable order summary listing titles and total pricing.
  - **Trust Indicators:** Lock icon, payment secure notification text.

#### Wireframe Diagram:
```text
+-----------------------------------------------------------------------------------+
|  [Logo]                                                         [Secure SSL Link] |
+-----------------------------------------------------------------------------------+
|  SECURE CHECKOUT                                                                  |
|                                                                                   |
|  1. CONTACT INFORMATION                      | ORDER SUMMARY                      |
|  +----------------------------------------+  | +--------------------------------+ |
|  | Email: [ sarah.reader@email.com      ] |  | | Python Pro (PDF)        $19.99 | |
|  | *Your E-Book will be sent to this email|  | | UI/UX Secrets (EPUB)    $24.99 | |
|  +----------------------------------------+  | | Promo Discount:         -$6.00 | |
|                                              | | Tax:                     $2.50 | |
|  2. PAYMENT DETAILS                          | | Total Price:            $41.48 | |
|  +----------------------------------------+  | +--------------------------------+ |
|  | Card Number: [ 4111 2222 3333 4444   ] |  |                                    |
|  | Expiry Date: [ MM/YY ]  CVC: [ *** ]   |  |                                    |
|  | Name on Card: [ Sarah Reader         ] |  |                                    |
|  +----------------------------------------+  |                                    |
|                                              |                                    |
|  [ PAY SECURELY $41.48 ]                     |                                    |
|  (Secure PCI-Compliant Sandbox Mode)         |                                    |
+-----------------------------------------------------------------------------------+
```

---

### Screen 5: Customer Library ("My Library")
- **Purpose:** Allow customers to track their download status, download links, and order history.
- **Layout Description:**
  - **Downloads Grid:** Shows cover art, format, purchase date, download buttons, and download limits/expiration indicators.
  - **History Tab:** Past transaction details and receipt download options.

#### Wireframe Diagram:
```text
+-----------------------------------------------------------------------------------+
|  [Logo]                                                   [My Library] [Cart (0)] |
+-----------------------------------------------------------------------------------+
|  WELCOME BACK, SARAH! | Member Since July 2026                                    |
|                                                                                   |
|  [ MY LIBRARY (Active Books) ]      [ PAST ORDERS & RECEIPTS ]                    |
|                                                                                   |
|  Search your library: [ Search books... ]                                         |
|                                                                                   |
|  +---------------+  +---------------+  +---------------+                          |
|  | [Book Cover]  |  | [Book Cover]  |  | [Book Cover]  |                          |
|  |               |  |               |  |               |                          |
|  | Python Pro    |  | UI/UX Secrets |  | Startup Life  |                          |
|  | Purchased:    |  | Purchased:    |  | Purchased:    |                          |
|  | 06-07-2026    |  | 06-07-2026    |  | 05-05-2026    |                          |
|  |               |  |               |  |               |                          |
|  | [DOWNLOAD PDF]|  | [DOWNLOAD EPUB]  [DOWNLOAD PDF]|                          |
|  | Expiry: 24h   |  | Expiry: 24h   |  | Expiry: Ended |                          |
|  | Downloads: 0/5|  | Downloads: 1/5|  | (Click Renew) |                          |
|  +---------------+  +---------------+  +---------------+                          |
+-----------------------------------------------------------------------------------+
```

---

### Screen 6: Admin Dashboard (E-Book CRUD Inventory Management)
- **Purpose:** Allow admins to manage products (add, edit, list, and delete E-Books).
- **Layout Description:**
  - **Left Sidebar:** Navigation linking to Book List, Order List, and Settings.
  - **Header Status:** Quick sales stats summary.
  - **Main Work Area:** A data table listing books with active statuses, prices, actions (Edit, Delete), and a prominent `+ Add New E-Book` button.

#### Wireframe Diagram:
```text
+-----------------------------------------------------------------------------------+
|  [ADMIN PANEL]                                                 [Logout Admin]     |
+-----------------------------------------------------------------------------------+
|  SIDEBAR:         |  E-BOOK INVENTORY MANAGEMENT                                  |
|  * Dashboard      |  +--------------------+                                       |
|  * Manage Books   |  | [ + Add New Book ] |                                       |
|  * Manage Orders  |  +--------------------+                                       |
|  * Customers      |                                                               |
|  * Settings       |  List of Books:                                               |
|                   |  +---------------------------------------------------------+  |
|                   |  | Title        | Author      | Price  | Status   | Actions    |  |
|                   |  +---------------------------------------------------------+  |
|                   |  | Python Pro   | J. Smith    | $19.99 | Active   | [Ed] [Del] |  |
|                   |  | UI/UX Secrets| A. Visual   | $24.99 | Active   | [Ed] [Del] |  |
|                   |  | Startup Life | E. Founder  | $14.99 | Inactive | [Ed] [Del] |  |
|                   |  +---------------------------------------------------------+  |
|                   |                                                               |
|                   |  SHOWING: Page 1 of 5                   [ < Previous ] [ Next ]|
+-----------------------------------------------------------------------------------+
```

---

### Screen 7: Admin Dashboard (Order Tracking & Sales Analytics)
- **Purpose:** Let admins track transaction listings, download histories, and system health status.
- **Layout Description:**
  - **Filter Bars:** Search orders by Email or Payment Transaction ID.
  - **Data Columns:** Customer details, purchased titles, transaction IDs, status tags, and action buttons.

#### Wireframe Diagram:
```text
+-----------------------------------------------------------------------------------+
|  [ADMIN PANEL]                                                 [Logout Admin]     |
+-----------------------------------------------------------------------------------+
|  SIDEBAR:         |  ORDER TRACKING & AUDITING                                    |
|  * Dashboard      |  Search Orders: [ Email or Transaction ID       ] [ Search ]  |
|  * Manage Books   |                                                               |
|  * Manage Orders  |  Recent Transactions:                                         |
|  * Customers      |  +----------------------------------------------------------+ |
|  * Settings       |  | Date   | Customer Email      | Items | Total  | status   | |
|                   |  +----------------------------------------------------------+ |
|                   |  | 06-Jul | sarah.r@email.com   | 2     | $41.48 | Complete | |
|                   |  | 06-Jul | test.user@mail.com  | 1     | $19.99 | Complete | |
|                   |  | 05-Jul | guest@yahoo.com     | 1     | $14.99 | Failed   | |
|                   |  +----------------------------------------------------------+ |
|                   |                                                               |
|                   |  Order #10245 Details: sarah.r@email.com                      |
|                   |  - Transaction ID: ch_3M8eY9kLd810                           |
|                   |  - Downloaded: Python Pro (1 time), UI/UX Secrets (0 times)   |
|                   |  - Actions: [ Resend Download Email ]   [ Refund Order ]      |
+-----------------------------------------------------------------------------------+
```
