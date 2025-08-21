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

⸻

🚀 Automatic Deployment

This GitHub Actions workflow automatically deploys your site via FTP on every push to the main branch.

🔑 Set Up Required GitHub Secrets

To make the workflow work, create the following GitHub secrets in your repository:

GitHub Secret	Expected Value
FTP_SERVER	FTP server address (e.g., ftp.my-domain.com)
FTP_USERNAME	Your FTP username
FTP_PASSWORD	Your FTP password
FTP_PATH	Path on the server to upload files (e.g., /www/)

🛠 Adding a Secret
	1.	Go to Settings → Secrets → Actions → New repository secret
	2.	Enter the secret name (e.g., FTP_SERVER)
	3.	Paste the corresponding value
	4.	Click Save ✅
	5.	Repeat for each required secret.

✅ Verify the Workflow
	•	Push changes to the main branch.
	•	GitHub Actions uses these secrets to connect to the FTP server and upload your files.
	•	Make sure the branch in the workflow (on: push) matches your target branch (main or master).

⸻

![screen.png](assets/screen.png)