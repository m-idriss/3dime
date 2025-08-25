# 3dime

<p style="text-align:center">
  <img src="assets/logo.png" alt="3dime Logo" width="80" height="80"/>
</p>

<p style="text-align:center">
  <b>3dime</b> is a minimalistic social hub to regroup and share your profiles & links in one place.
</p>

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://3dime.com)
---

## ✨ Features

- 👤 User profile page
- 🔗 Centralized social links
- 📱 Fully responsive design
- 🎨 Simple & clean UI

---

## 🚀 Installation

Clone the repository and move into the project folder:

```bash
git clone https://github.com/m-idriss/3dime.git
cd 3dime
```

---

## 💻 Local Development

To run the project locally, you'll need PHP installed on your system.

### Prerequisites

- **PHP 7.4 or higher** (check with `php --version`)

### Running the Development Server

Start the built-in PHP development server:

```bash
php -S localhost:8000
```

Then open your browser and navigate to:
- **Main site**: http://localhost:8000
- **API proxy**: http://localhost:8000/proxy.php

The `proxy.php` file handles API calls to external services (GitHub, Trakt) and can be tested with:
```bash
# Test GitHub API proxy
curl "http://localhost:8000/proxy.php?service=github"

# Test Trakt API proxy (requires config.php)
curl "http://localhost:8000/proxy.php?service=trakt"
```

> **Note**: For the Trakt service to work, you'll need to create a `config.php` file with your Trakt API credentials.

---

## 🚀 Automatic Deployment

This repository includes a GitHub Actions workflow that deploys your site via **FTP** every time you push to the `main` branch.

### 🔑 Required GitHub Secrets

You need to configure the following secrets in your repository:

* **`FTP_SERVER`** → FTP server address (e.g. `ftp.my-domain.com`)
* **`FTP_USERNAME`** → Your FTP username
* **`FTP_PASSWORD`** → Your FTP password
* **`FTP_PATH`** → Remote path on the server (usually `/www/`)

### 🛠 How to Add a Secret

1. Go to your repository on GitHub
2. Navigate to: **Settings → Secrets and variables → Actions → New repository secret**
3. Enter the **name** (e.g. `FTP_SERVER`) and paste the **value**
4. Click **Save**
5. Repeat for each secret

### ✅ How It Works

* When you push to the `main` branch, the workflow runs automatically
* It connects to your FTP server using the provided credentials
* It uploads all files from your repo to the path you defined in `FTP_PATH`

---
## 📸 Desktop Screenshots
![screenshot](assets/screenshots/desktopPage1920x1080.jpeg)
## 📱 Mobile Screenshots
![iPhone_13_Pro_Max.jpeg](assets/screenshots/iPhone_13_Pro_Max.jpeg)