# VisionInit Consultancy Website

<p align="center">
  The official website for VisionInit IT Services Consultancy, showcasing services, portfolio, and expertise. Built with Hugo. <!-- <<< CHANGED -->
</p>

<h2 align="center">
  <a target="_blank" href="https://visioninit.dev" rel="nofollow">👀 Live Site</a> | <!-- <<< CHANGED -->
  <a target="_blank" href="https://pagespeed.web.dev/report?url=https://visioninit.dev">Page Speed Test</a> <!-- <<< CHANGED -->
</h2>

---

<!-- Optional: Add a screenshot of YOUR website -->
<!-- <p align="center">
<img src="[LINK_TO_YOUR_SCREENSHOT.png]" alt="screenshot" width="100%">
</p> -->

---

## 📌 Key Features <!-- <<< UPDATED FEATURES -->

- **Services Overview:** Clear presentation of IT consultancy offerings.
- **Portfolio Showcase:** Highlights key projects and technical achievements.
- **About Section:** Details experience and professional philosophy.
- **Contact Information:** Easy ways to get in touch or schedule a consultation.
- **Responsive Design:** Adapts to various screen sizes.
- **Built with Hugo:** Fast, secure static site generation.
- **Open Source Base:** Utilizes the structure of the Educenter Hugo theme.
- **Automated OG Image Generation:** Creates social sharing preview images.
- **Automated Favicon Generation:** Generates necessary favicon formats.

## 🛠️ Local Development

1.  **Clone the repository:**

    ```bash
    # Replace with your actual repository URL if different
    git clone git@github.com:neural-loop/visioninit.dev.git
    cd visioninit.dev
    ```

2.  **Install Dependencies:**

    ```bash
    # Ensure Node.js and npm are installed
    npm install
    ```

    _This installs helper packages for build scripts._

3.  **Install Hugo:**
    Make sure you have Hugo (Extended version, minimum `0.115.1`) installed. See [Hugo Installation Guide](https://gohugo.io/getting-started/installing/).

4.  **Install Build Tools:**

- **ImageMagick:** Required for generating favicons and logos.
  ```bash
  # On Debian/Ubuntu
  sudo apt-get update && sudo apt-get install imagemagick
  # On macOS (using Homebrew)
  brew install imagemagick
  ```
- **wkhtmltoimage:** Required for generating Open Graph images. Download from the [wkhtmltopdf website](https://wkhtmltopdf.org/downloads.html) and ensure it's in your system's PATH.

5.  **Run the Development Server:**
    ```bash
    # Using npm script (Recommended, runs pre-build steps if any)
    npm run dev
    # Or directly using Hugo
    # hugo server --buildFuture
    ```
    _The site will be available at `http://localhost:1313/` (or another port if 1313 is busy)._

## 🔧 Deployment

This project includes configuration files for easy deployment:

- **Netlify:** Click the button below or configure manually using `netlify.toml`.
  [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/neural-loop/visioninit.dev) <!-- <<< UPDATED REPO URL -->
- **Vercel:** Deploy using the Vercel dashboard or CLI. The `vercel.json` and `vercel-build.sh` files provide the necessary configuration. Ensure ImageMagick and wkhtmltoimage are available in the Vercel build environment (may require adjustments to `vercel-build.sh` or build settings).

The build command (`npm run build`) handles image generation and the Hugo build process.

## 📝 License

The specific code modifications and content for the VisionInit website are released under the [MIT License](LICENSE). <!-- <<< UPDATED -->

The underlying Hugo theme structure is based on the "Educenter Hugo" theme by [Themefisher](https://themefisher.com) & [Gethugothemes](https://gethugothemes.com), which is also released under the MIT license (see `themes/boycott-beacon/LICENSE`). <!-- <<< Adjusted path assumption -->

## 👍 Acknowledgements

- **Hugo:** The static site generator powering this website.
- **Educenter Theme:** The base theme structure provided by Themefisher/Gethugothemes.
- **ImageMagick & wkhtmltoimage:** Tools used for image generation scripts.
