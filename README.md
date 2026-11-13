# EditKaro 
This is the codebase for **EditKaro** —a clean, lightweight, and blazing-fast static website built for a video editing and social media marketing agency. 

We kept this strictly old-school and hassle-free: **no heavy build tools, no complex frameworks, and no node_modules bloat**. Just pure HTML, modular CSS, and vanilla JavaScript.

# Project Structure

Here is how the project files are organized:

```text
├── index.html          # Main landing page
├── about.html          # Agency overview & background
├── services.html       # Video editing & marketing packages
├── portfolio.html      # Client work & video showcases
├── team.html           # Meet the team page
├── contact.html        # Inquiry form & contact info
├── check-videos.html   # Utility page to verify video assets
├── css/
│   ├── style.css       # Core design system & layout styles
│   ├── responsive.css  # Media queries for mobile/tablet screens
│   ├── animations.css  # Smooth micro-interactions & UI animations
│   └── theme.css       # Dark/light mode theme variables
├── js/
│   ├── config.js       # Global configuration (API endpoints & social links)
│   ├── script.js       # Main UI interactions & mobile navbar toggle
│   ├── darkmode.js     # Dark/Light theme toggle logic
│   ├── contact.js      # Form validation & Google Apps Script submission
│   ├── newsletter.js   # Newsletter subscription handler
│   └── portfolio.js    # Portfolio filtering & gallery logic
├── assets/
│   └── videos/         
│       ├── anime.mp4           # Anime edit showcase
│       ├── color-grading.mp4   # Color grading portfolio sample
│       ├── documentary.mp4     # Documentary style edit
│       ├── ecommerce-ad.mp4    # E-commerce advertisement clip
│       ├── football.mp4        # Football sports edit
│       ├── gaming.mp4          # Gaming montage
│       ├── hero.mp4            # Landing page background video
│       ├── long-form.mp4       # Long-form video edit sample
│       └── short-reels.mp4     # Short-form reels / TikTok edit
├── robots.txt          # Search engine crawler instructions
├── sitemap.xml         # XML sitemap for search engines
└── Code.gs           # Google App Script for saving form leads directly to Google sheet    

# How to Run Locally

Since this is a pure static website, you don't need any complex setup:

* The Quick Way: Open the project folder in VS Code and use the Live Server extension (starts up at http://127.0.0.1:5500/).
*The Terminal Way: If you prefer using Python as a local server, run this command in your project root:
Bash
python -m http.server 5500
Then just open your browser and head straight to http://127.0.0.1:5500/

🛠️ Setup Checklist (Before going live)
Make sure to cross off these items before pushing to production:

Contact Form Backend (Code.gs): The contact form hooks up to Google Sheets via Google Apps Script. Follow the quick setup comments inside Code.gs, deploy it as a Web App, and paste your deployment URL into js/config.js under scriptURL.

Social Links: Drop your official Instagram, YouTube, or LinkedIn links inside js/config.js. If you leave any link blank, the icon automatically hides itself so it doesn't look broken.

Hero Video: Drop your background clip (hero.mp4) into the assets/videos/ folder. If the video is missing, a clean fallback gradient/poster takes over so the site doesn't break.

Portfolio Assets: Head over to portfolio.html and replace the placeholder/sample video links with actual client deliverables.

TODO Placeholders: Keep an eye out for TODO comments scattered in the code—remember to update things like stats (e.g., 500+ projects), sample testimonials, contact numbers, and team member details.

SEO Files: If you are setting up a custom domain (like editkaro.in), double-check that sitemap.xml and robots.txt point to your actual production domain.


## 🌐 Deployment

Since this is a pure static website with zero build steps, deploying it is an absolute breeze:

* **Vercel / Netlify:** Just link your GitHub repository, leave the build command empty, and deploy straight from the root directory.
* **GitHub Pages:** Go to your repository **Settings -> Pages**, set the branch to `main`, and choose the root folder `/ (root)`.