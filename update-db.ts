import prisma from './src/lib/db';

async function main() {
  const finalWeek = await prisma.courseWeek.findFirst({
    where: { title: "Final Project" }
  });

  if (!finalWeek) {
    console.log("Final Project week not found.");
    return;
  }

  // Deep clone to ensure Prisma detects the change
  const topics = JSON.parse(JSON.stringify(finalWeek.topics));
  
  const projectTopicIndex = topics.findIndex((t: any) => t.id === "project-1");
  if (projectTopicIndex === -1) {
    console.log("project-1 topic not found inside JSON");
    return;
  }

  const newExplanation = `**4. The Contact Form**\n- Create an HTML \`<form>\` containing inputs for Name, Email, and a Message Textarea.\n- (Bonus): Use JavaScript's \`addEventListener\` to intercept the form submission and show a friendly "Message Sent!" alert to the user.\n\n### Your Task\n1. **Start from scratch**: The IDE is completely empty. You must write the entire HTML structure from scratch, starting with \`<!DOCTYPE html>\`.\n2. **Head & Metadata**: Include the \`<head>\` tag, link your fonts, and add the necessary viewport meta tags.\n3. **CSS Styling**: Add a \`<style>\` block in the head and write all the CSS required to match the instructions.\n4. **Structure the Body**: Write the \`<header>\`, \`<main>\`, \`<section>\`, and \`<footer>\` tags.\n5. **JavaScript Interactivity**: Add a \`<script>\` tag at the bottom of the body to handle the form submission logic.\n\nIf you get stuck, remember to check the **View Solution Preview** button below to see the final result!\n\n![Portfolio Expected Output](/images/portfolio-preview.png)\n`;

  const baseExplanation = `## Personal Portfolio Website\n\n### Description\nCongratulations on reaching the final module! It is time to combine everything you have learned in HTML, CSS, and JavaScript into a fully functional, professional Personal Portfolio website. This is a real-world project that you can show to potential employers!\n\n### Tech Stack\n- **HTML5**: To build the semantic layout (Headers, Sections, Footers).\n- **CSS3**: For advanced styling, using CSS Grid for the projects gallery, Flexbox for navigation, and beautiful CSS Transitions for interactive hover effects.\n- **JavaScript**: To add dynamic interactivity, such as filtering your projects or handling a contact form.\n\n### Complete Information\nYou will be building a four-section, responsive portfolio page.\n\n**1. The Hero Section**\n- Create a massive, eye-catching header that introduces who you are.\n- Include an Avatar image (styled as a circle with \`border-radius: 50%\`).\n- Add a strong Call-To-Action (CTA) button that smooth-scrolls to the contact section.\n\n**2. The Skills Section**\n- Use **CSS Grid** to display a list of your technical skills in neatly aligned boxes.\n- Add CSS Hover effects so the boxes lift up (\`transform: translateY(-5px)\`) when the user hovers over them.\n\n**3. The Projects Section**\n- Build reusable "Project Cards".\n- Each card should contain an image, a title, a short description, and links to the code.\n- Use **Flexbox** inside the cards to align the text properly.\n\n`;

  const fullExplanation = baseExplanation + newExplanation;

  // Update the topic explanation
  topics[projectTopicIndex].explanation = fullExplanation;

  await prisma.courseWeek.update({
    where: { id: finalWeek.id },
    data: {
      topics: topics
    }
  });

  console.log("Successfully removed 'Solution Code' header and added the image preview to DB!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
