const fs = require('fs');
const path = 'd:\\Student Forge\\Platform App\\Platfrom-Sf-0001\\Website\\src\\app\\api\\seed-course\\route.ts';
let content = fs.readFileSync(path, 'utf8');

// Replace starterCode
content = content.replace(
  /starterCode:\s*`<!DOCTYPE html>[\s\S]*?<\/html>`/,
  'starterCode: ``, // IDE is completely empty'
);

const searchStr = "**4. The Contact Form**\\n- Create an HTML \\`<form>\\` containing inputs for Name, Email, and a Message Textarea.\\n- (Bonus): Use JavaScript\\'s \\`addEventListener\\` to intercept the form submission and show a friendly \\\"Message Sent!\\\" alert to the user.\\n\\n### Solution Code";

const newStr = "**4. The Contact Form**\\n- Create an HTML \\`<form>\\` containing inputs for Name, Email, and a Message Textarea.\\n- (Bonus): Use JavaScript\\'s \\`addEventListener\\` to intercept the form submission and show a friendly \\\"Message Sent!\\\" alert to the user.\\n\\n### Your Task\\n1. **Start from scratch**: The IDE is completely empty. You must write the entire HTML structure from scratch, starting with \\`<!DOCTYPE html>\\`.\\n2. **Head & Metadata**: Include the \\`<head>\\` tag, link your fonts, and add the necessary viewport meta tags.\\n3. **CSS Styling**: Add a \\`<style>\\` block in the head and write all the CSS required to match the instructions.\\n4. **Structure the Body**: Write the \\`<header>\\`, \\`<main>\\`, \\`<section>\\`, and \\`<footer>\\` tags.\\n5. **JavaScript Interactivity**: Add a \\`<script>\\` tag at the bottom of the body to handle the form submission logic.\\n\\nIf you get stuck, remember to check the **Solution Preview** button below to see what the final result should look like!\\n\\n### Solution Code";

content = content.replace(searchStr, newStr);

fs.writeFileSync(path, content);
console.log("Successfully updated route.ts");
