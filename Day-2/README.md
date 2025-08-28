# Day 2 – Styling the Blueprint (CSS)

## Overview
This day introduces **Cascading Style Sheets (CSS)** – the language that defines how HTML elements look and are laid out on the page.

The material is delivered as an interactive slide deck:

- **File:** `Day-2/Day-2-slides.html`
- **Run:** Open the file in any web browser (double‑click or `open Day-2/Day-2-slides.html`).

## What You’ll Learn
1. **Introduction to CSS** – purpose and basic concepts.  
2. **Three ways to add CSS** – inline, internal, and external (the recommended approach).  
3. **CSS selectors** – tag, class, and ID selectors.  
4. **The Box Model** – content, padding, border, margin.  
5. **Essential CSS properties** – color, background‑color, font‑family, font‑size, font‑weight, text‑align.  
6. **Layout basics** – `display: block` vs. `display: inline`.  
7. **Flexbox fundamentals** – `display: flex`, `flex-direction`, `justify-content`, `align-items`.  

## Daily Challenge
Style the **Simple Business Card** you created on Day 1.

### Requirements
- **Center** the card on the page using Flexbox.  
- Apply **clean, professional styling** to text (fonts, colors, spacing).  
- Make the **profile image circular** and add a subtle shadow.  
- Use **external CSS** (create a `style.css` file) – this follows best practice.

### How to Complete the Challenge
1. **Create a CSS file** named `style.css` in the same folder as `business-card.html` (i.e., `Day-1/`).  
2. **Link** the stylesheet in `business-card.html` inside the `<head>`:

   ```html
   <link rel="stylesheet" href="style.css">
   ```

3. **Add the following CSS** (or customize it) to achieve the required styling:

   ```css
   /* style.css – Day 2 CSS for the business card */

   /* Reset & box‑sizing */
   *, *::before, *::after {
       margin: 0;
       padding: 0;
       box-sizing: border-box;
   }

   /* Body – center the card */
   body {
       display: flex;
       justify-content: center;
       align-items: center;
       min-height: 100vh;
       background: linear-gradient(135deg, #667eea, #764ba2);
       font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
   }

   /* Card container */
   .business-card {
       background: #fff;
       border-radius: 20px;
       box-shadow: 0 20px 40px rgba(0,0,0,0.1);
       padding: 40px;
       max-width: 400px;
       width: 100%;
       text-align: center;
   }

   /* Circular profile image */
   .profile-image {
       width: 120px;
       height: 120px;
       border-radius: 50%;
       border: 5px solid #fff;
       box-shadow: 0 10px 20px rgba(0,0,0,0.2);
       margin: 0 auto 20px;
   }

   /* Typography */
   .name {
       font-size: 2rem;
       font-weight: 700;
       color: #333;
       margin-bottom: 10px;
   }

   .title {
       font-size: 1.2rem;
       color: #666;
       margin-bottom: 20px;
   }

   .bio {
       color: #555;
       line-height: 1.6;
       margin-bottom: 25px;
   }

   /* Social links */
   .social-links a {
       display: inline-block;
       padding: 12px 24px;
       margin: 5px 0;
       background: linear-gradient(135deg, #667eea, #764ba2);
       color: #fff;
       text-decoration: none;
       border-radius: 25px;
       transition: transform 0.2s, box-shadow 0.2s;
   }

   .social-links a:hover {
       transform: translateY(-2px);
       box-shadow: 0 6px 20px rgba(0,0,0,0.3);
   }

   /* Contact info */
   .contact-info p {
       color: #777;
       font-size: 0.9rem;
       margin: 5px 0;
   }

   @media (max-width: 480px) {
       .business-card {
           padding: 30px 20px;
       }
       .name { font-size: 1.6rem; }
       .title { font-size: 1rem; }
   }
   ```

4. **Save** the file and refresh `business-card.html` in the browser. The card should now be centered, styled, and responsive.

## Deliverables
- `Day-2/Day-2-slides.html` – interactive slide deck.  
- `Day-2/README.md` – this file (overview, learning objectives, challenge instructions).  
- `Day-1/style.css` – external stylesheet for the business card (you create it following the example above).

Feel free to experiment with colors, fonts, or layout while keeping the core requirements intact. When you’re satisfied, you have completed Day 2! 🎉
