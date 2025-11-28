# **TaskFlow – Modern Task Management Web App**

## **Project Overview**
**TaskFlow** is a responsive, client-side task management application built using **HTML5**, **CSS3 (Tailwind CSS + custom styles)**, and **vanilla JavaScript**. Developed for the **CSE 320 – Web Development module (Frontend – JavaScript)**, the system provides a clean, modern interface for users to manage tasks efficiently.

The app supports:

- User registration & login with session persistence (via `localStorage`)
- Full CRUD operations for tasks (create, read, update, delete)
- Filters and sorting (status, priority, title, date)
- Task analytics (totals, completed, pending)
- Modal-based interactions for creating/editing/deleting tasks
- Weather and time widgets via external APIs

TaskFlow showcases modern frontend development patterns including **responsive design**, **DOM manipulation**, **events**, **async/await**, **API integration**, and **data persistence**.

**Repository:** TaskFlow GitHub  
**Module:** Frontend – JavaScript  
**Author:** Munyaradzi Chiondegwa  
**Date:** 15 November 2025  
**Total Effort:** ~18 hours  
**License:** MIT  

The project is a fully functional MVP that runs directly in the browser without any backend. Future improvements may include backend integration, real-time updates, or PWA functionality.

---

## **Features**

### **Authentication & Navigation**
- Landing page with sign-in/register access
- User registration & login (validated, stored in `localStorage`)
- Logout clears session
- Smooth page transitions handled via JavaScript

### **Task Management**
- Add tasks with:
  - Title & description  
  - Due date (min: today)
  - Priority (low/medium/high)
- Edit and delete tasks using modals
- Animated, responsive task cards with badges and formatted due dates
- Completion checkboxes with strikethrough styling

### **Filtering & Sorting**
- Filter by:
  - All
  - Pending
  - Completed  
- Sort by:
  - Due date  
  - Priority  
  - Title  
- Dynamic updates with live stats

### **Dashboard Analytics**
- Cards showing:
  - Total tasks
  - Completed tasks
  - Pending tasks
- Friendly empty state for new users

### **Additional Integrations**
- **Real-time clock** updating every second  
- **Weather widget** (OpenWeatherMap + geolocation)
- Mobile-first responsive layout with Tailwind

### **Data Persistence**
- All users, tasks, and sessions stored in `localStorage`
- Automatic loading of user state on startup
- Input sanitization (escape HTML, regex validation)

### **UI/UX Enhancements**
- Glassmorphism UI (blurred panels, gradients)
- Automatic dark mode detection
- Semantic HTML and ARIA labels
- Keyboard navigation and Escape key modal closing
- Live form validation messages
- Graceful API error handling

---

## **Key Learning Outcomes**
- HTML: semantic structure, forms, accessibility
- CSS: animations, responsive design, Tailwind utilities
- JavaScript: events, functions, DOM manipulation, modules (IIFE)
- Advanced concepts: `localStorage`, `async/await`, API fetches, date handling

---

## **Requirements**
- Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Recommended: VS Code with Live Server
- Geolocation + fetch support for weather
- Internet connection (for API + CDN assets)

---

## **Installation**

### **1. Clone the Repository**
```bash
git clone https://github.com/munyaradzichiondegwa/TaskFlow.git
cd TaskFlow
