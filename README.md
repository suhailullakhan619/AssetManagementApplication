# Asset Management System

A modern **Asset Management System** built to manage organizational assets efficiently with **role-based access**, **secure authentication**, and a **responsive UI**.

This project helps organizations track assets, categories, suppliers, manufacturers, and users with proper access control.

---

## 🌐 Live Demo

### 🚀 Live Application:
[Asset Management Website Frontend]()

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure authentication using **AWS Amplify**
- Role-based access control:
  - **SUPER_ADMIN**
  - **ORG_OWNER**
  - **ORG_USER**

### 🧭 Role-Based Navigation
- Dynamic sidebar and global search based on user role
- Unauthorized routes are automatically restricted

### 📦 Asset Management
- Create, update, and delete assets
- Assign:
  - Category & Sub-category
  - Manufacturer
  - Supplier
  - Verification / Asset date
- Form validation with clear error handling

### 👥 User Management
- Add, update, activate/deactivate users
- Filter users by **Active / Inactive**
- Search users dynamically

### 🔎 Global Search
- Search accessible pages using:
  - Click search icon
  - **Keyboard shortcut (Ctrl + K)**
- Results adapt based on user role

### 📊 Dashboard
- Overview cards with statistics
- Responsive layout for all screen sizes

### 🎨 UI / UX
- Built with **Vuetify**
- Fully responsive (mobile, tablet, desktop)
- Smooth dialogs, loaders, and snackbars

---

## 🛠 Tech Stack

### Frontend
- **Vue 3**
- **Vuetify 3**
- **Vue Router**
- **Vuex**

### Backend / Cloud
- **AWS Amplify**
- **AWS AppSync (GraphQL)**
- **AWS Cognito**
- **AWS DynamoDB**
