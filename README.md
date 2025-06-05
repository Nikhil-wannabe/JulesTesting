# AI Portfolio Website for Nikhil Bramhandam

## Objective
This project is a premium-quality, cinematic portfolio website for Nikhil Bramhandam, designed as a horizontal side-scrolling experience. The site aims to evoke curiosity, creativity, and technical elegance, reflecting Nikhil’s identity as an Applied AI Engineer. It utilizes modern, maintained libraries, prioritizing performance, modularity, and visual storytelling.

## Current Status (as of last commit)
The foundational build of the portfolio website is in place, including:
- Core horizontal scrolling navigation with GSAP & ScrollTrigger.
- Implementation of all major sections: Hero, About Me, Magna Opera (Projects Showcase), and Contact & Socials.
- **Hero Section:** Features an introductory message with reveal animation, layered parallax background, and a procedural 3D "Neural Globe" (Three.js) with pulsing animations and mouse hover interaction.
- **About Me Section:** Displays personal information with animated content blocks and a decorative parallax background element.
- **Magna Opera Section:**
    - Implements nested horizontal scrolling for project modules with snapping.
    - **MITRA OS:** Includes a simulated terminal display and a dedicated Three.js scene with floating 3D "UI elements" that animate and respond to mouse parallax.
    - **VIBEZSUME & SKlearn Playground:** Feature unique 2D parallax layers that animate in sync with project scrolling.
- **Contact & Socials Section:** Contains social media links, a contact form with client-side validation, and animated feedback messages.
- Scroll-triggered animations for content reveals and transitions across sections.

## Setup Instructions
1.  **Clone/Download:** Obtain the project files from the repository.
2.  **View Website:** Open the `index.html` file in a modern web browser (e.g., Chrome, Firefox, Safari, Edge).
3.  **Prerequisites:** Ensure JavaScript is enabled in your browser.

## Key Libraries Used
-   **GSAP (GreenSock Animation Platform):** For all major animations, including horizontal scrolling, parallax effects, and timed sequences. ScrollTrigger plugin is heavily used.
-   **Three.js:** For rendering and animating 3D elements (Neural Globe in Hero section, UI components in MITRA OS).

## Project Structure
-   `index.html`: The main HTML file for the website.
-   `css/`: Contains stylesheets.
    -   `style.css`: Main styles for layout, components, and overall appearance.
    -   `theme.css`: (Placeholder for future theming - dark/light modes).
-   `js/`: Contains JavaScript files.
    -   `main.js`: Core JavaScript, currently includes contact form logic.
    -   `animations.js`: GSAP animations for page scrolling, parallax, and section-specific transitions.
    -   `3d.js`: Three.js logic for 3D scenes and objects (Hero globe, MITRA OS elements).
-   `assets/`: (Placeholder for images, 3D models, and other static files - currently unused).
-   `components/`: (Placeholder for reusable HTML components - currently unused).

## Next Steps / Areas for Completion
The following areas are planned for further development:
1.  **Refinement of All Scroll Animations:** Thorough review and fine-tuning of all existing animations for smoothness, timing, and visual impact.
2.  **Advanced 3D Interactions & Details:**
    *   Enhance Hero globe: More complex hover states or interactive elements.
    *   MITRA OS 3D UI: Develop more detailed and potentially interactive 3D UI components.
3.  **Scalable Asset Loading:** Implement practices like lazy-loading for images (once added) and optimized loading for 3D models.
4.  **Flexible Styling & Theming:** Fully implement dark/light mode switching and ensure styles are easily customizable.
5.  **Content Population & Refinement:** Add actual project details, refine text, and potentially integrate real icons instead of text placeholders.
6.  **Full QA & Testing:**
    *   Comprehensive browser compatibility testing (Chrome, Firefox, Safari, Edge).
    *   Performance optimization to ensure 60fps across devices.
    *   Eliminate any console errors or warnings.
    *   Thorough responsive design checks and implementation for various screen sizes (desktop, tablet, mobile).
    *   Link checking and validation.

## Known Issues/Limitations
-   Currently, the site relies on CDN links for libraries (GSAP, Three.js). For production, these should be locally hosted or managed via a build process.
-   Social media icons are text placeholders.
-   Contact form is client-side only (no backend submission).
-   Full responsiveness across all device sizes is yet to be implemented and tested.
