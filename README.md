# 🚀 Ponkumar P — Personal Portfolio Website

A fully responsive, feature-rich personal portfolio website built from scratch using **HTML5**, **CSS3**, and **Vanilla JavaScript** — no frameworks, no libraries, just clean code.

---

## 🌐 Live Demo

> Coming soon via [GitHub Pages](https://pages.github.com/)

---

## ✨ Features

- 🌙 **Dark / Light Mode** — user preference saved via `localStorage`
- 🎯 **Advanced Custom Cursor** — dot + ring with spring lag, magnetic pull on buttons, trail particles, and click burst
- 🌌 **Animated Particle Background** — canvas-based floating nodes with connecting lines
- ⌨️ **Typewriter Effect** — cycling role titles with smooth typing animation
- 📜 **Scroll Animations** — custom `IntersectionObserver`-powered fade-ins
- 📊 **Animated Skill Bars** — progress bars that fill on scroll-into-view
- 🔍 **Skill & Project Filters** — filter by category with smooth show/hide transitions
- 💬 **Testimonial Slider** — auto-advancing with dot navigation
- 📬 **Contact Form** — WhatsApp-integrated with client-side validation
- 📱 **Fully Responsive** — mobile-first design with hamburger navigation
- ♿ **Accessible** — semantic HTML, ARIA labels, keyboard-friendly
- ⚡ **Loading Screen** — animated intro with progress bar

---

## 🛠️ Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Markup     | HTML5 (semantic)                  |
| Styling    | CSS3 (custom properties, flexbox, grid, animations) |
| Scripting  | Vanilla JavaScript (ES6+)         |
| Fonts      | Google Fonts — Inter, JetBrains Mono |
| Icons      | Font Awesome 6                    |
| Email SDK  | EmailJS (optional, pre-configured) |

---

## 📁 Project Structure

```
port/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styles (dark/light themes, animations, layout)
├── js/
│   └── script.js       # All interactive features and animations
└── assets/
    ├── PONKUMAR_Photograph.png         # Profile photo (hero)
    ├── PONKUMAR_white.png              # About section photo
    └── Ponkumar_P_Software_Engineer_Resume.pdf   # Downloadable resume
```

---

## 📸 Sections

1. **Hero** — Introduction, typewriter, social links, resume download
2. **About** — Bio, interests, and a quick-glance stats panel
3. **Skills** — Filterable skill cards with animated progress bars
4. **Projects** — Featured projects with tech tags and GitHub links
5. **Experience** — Timeline of internships and roles
6. **Education** — Academic background
7. **Certifications** — Completed courses and certifications
8. **Contact** — Form with WhatsApp redirect and live validation

---

## 🚀 Getting Started

No build tools or dependencies needed.

```bash
# Clone the repository
git clone https://github.com/PonkumarP/portfolio.git

# Navigate into the project folder
cd portfolio

# Open in your browser
open index.html
```

Or drag `index.html` directly into any browser.

---

## ⚙️ Configuration

### Contact Form (WhatsApp)
The form redirects to WhatsApp with a pre-filled message. To update the phone number, edit `js/script.js`:

```js
const WHATSAPP_NUMBER = '919342189432'; // Replace with your number
```

### EmailJS (Optional)
To also send emails, set your credentials in `js/script.js`:

```js
const EMAILJS_PUBLIC_KEY  = 'YOUR_EMAILJS_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Connect

- 💼 [LinkedIn](https://www.linkedin.com/in/ponkumarp2302/)
- 🐙 [GitHub](https://github.com/PonkumarP)
- 📧 ponkumarp143@gmail.com

---

> Built with ❤️ by **Ponkumar P**
