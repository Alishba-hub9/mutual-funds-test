## Mutual Funds – Bazaar Website:

This project is a front-end implementation of the **Mutual Funds section** for the **Bazaar website**, designed to display mutual fund data dynamically closely resembling the structure and layout of Sarmaaya.pk mutual funds page.



## Objective:

Design and develop a **modern, responsive, and dynamic** interface to showcase mutual fund data — including fund names, categories, NAVs, and performance returns — with clean UI and smooth data rendering.


## Preview:

Displays a dynamic list of mutual funds with their:
> - Fund Name  
> - Fund Category (Equity, Income, Balanced, etc.)  
> - Fund Manager / AMC  
> - Latest NAV (Net Asset Value)  
> - Performance badges (1-Year, 3-Year, 5-Year, etc.)  
> - “View Details” button


## Features

**Dynamic Data Rendering** : Fetches data from a local JSON file (`data/funds.json`) to simulate real API behavior.  
**Categorized Display** : Separates **Gainers** and **Losers** dynamically.  
**Interactive Tabs** : Users can switch between fund types.  
**Performance Visualization (Chart.js)** : NAV performance visualized using Chart.js.  
**Async/Await & Modular Code** : Modern JavaScript patterns for clarity and performance.  
**Responsive Layout** : Mobile and desktop compatible.  
**Clean UI** : Styled with SCSS and Bootstrap for professional look.

---

## Tech Stack

| Category | Tools / Libraries |
|-----------|------------------|
| **Frontend** | HTML5, SCSS, JavaScript (ES6+), JQuery |
| **Styling** | Bootstrap 5 |
| **Icons** | Font Awesome |
| **Charts** | Chart.js (via npm) |
| **Task Runner** | Gulp |
| **Package Manager** | npm |
| **Version Control** | Git & GitHub |


## Local Setup

To run the project locally,
first clone the repository and navigate into its folder git clone https://github.com/Alishba-hub9/mutual-funds-test.git,
then install all dependencies using `npm install`,
build the CSS and JS files with `npx gulp`,
and finally open `index.html` in your browser to view the project.

