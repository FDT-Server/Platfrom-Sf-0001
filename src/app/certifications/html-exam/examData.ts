export const examData = {
  mcqs: [
    {
      id: "q1",
      question: "Which HTML5 element is used to specify a footer for a document or section?",
      options: ["<bottom>", "<footer>", "<section>", "<aside>"],
      correctAnswer: "<footer>"
    },
    {
      id: "q2",
      question: "What is the correct HTML element for playing video files?",
      options: ["<media>", "<video>", "<movie>", "<source>"],
      correctAnswer: "<video>"
    },
    {
      id: "q3",
      question: "Which attribute specifies that an input field must be filled out before submitting the form?",
      options: ["validate", "required", "placeholder", "formvalidate"],
      correctAnswer: "required"
    },
    {
      id: "q4",
      question: "In HTML5, which input type is used for a dropdown list of options where a user can select multiple options?",
      options: ["<select multiple>", "<input type='dropdown'>", "<datalist>", "<list>"],
      correctAnswer: "<select multiple>"
    },
    {
      id: "q5",
      question: "Which semantic HTML element defines navigational links?",
      options: ["<navigation>", "<links>", "<nav>", "<menu>"],
      correctAnswer: "<nav>"
    },
    {
      id: "q6",
      question: "Which of the following attributes is used to merge two or more table cells vertically?",
      options: ["colspan", "merge", "rowspan", "cellmerge"],
      correctAnswer: "rowspan"
    },
    {
      id: "q7",
      question: "What is the purpose of the <aside> element in HTML5?",
      options: ["To represent a sidebar or content tangentially related to the main content", "To define a navigation menu", "To write comments in HTML", "To align content to the right"],
      correctAnswer: "To represent a sidebar or content tangentially related to the main content"
    },
    {
      id: "q8",
      question: "Which attribute is used to provide a regular expression that an input element's value is checked against on form submission?",
      options: ["regex", "validate", "pattern", "check"],
      correctAnswer: "pattern"
    },
    {
      id: "q9",
      question: "Which HTML tag is used to embed a standalone document, such as a widget or a YouTube video?",
      options: ["<embed>", "<object>", "<iframe>", "<frame>"],
      correctAnswer: "<iframe>"
    },
    {
      id: "q10",
      question: "How can you open a link in a new tab/browser window?",
      options: ["<a href='url' target='_new'>", "<a href='url' new>", "<a href='url' target='_blank'>", "<a href='url' window='new'>"],
      correctAnswer: "<a href='url' target='_blank'>"
    },
    {
      id: "q11",
      question: "What does the <figure> element represent in HTML5?",
      options: ["A mathematical calculation", "Self-contained content, like illustrations, diagrams, or photos", "A geometric shape", "A section containing purely text"],
      correctAnswer: "Self-contained content, like illustrations, diagrams, or photos"
    },
    {
      id: "q12",
      question: "Which attribute allows an element to be draggable in HTML5?",
      options: ["draggable='true'", "drag='true'", "moveable='true'", "drag-and-drop='true'"],
      correctAnswer: "draggable='true'"
    },
    {
      id: "q13",
      question: "Which tags are used to define a description list in HTML5?",
      options: ["<dl>, <dt>, and <dd>", "<ul>, <li>, and <desc>", "<list>, <term>, and <def>", "<ol>, <li>, and <dd>"],
      correctAnswer: "<dl>, <dt>, and <dd>"
    },
    {
      id: "q14",
      question: "What is the correct HTML for adding a background color?",
      options: ["<body bg='yellow'>", "<body style='background-color:yellow;'>", "<background>yellow</background>", "<body color='yellow'>"],
      correctAnswer: "<body style='background-color:yellow;'>"
    },
    {
      id: "q15",
      question: "Which of the following defines a caption for a <fieldset> element?",
      options: ["<caption>", "<legend>", "<title>", "<heading>"],
      correctAnswer: "<legend>"
    },
    {
      id: "q16",
      question: "What is the role of the 'alt' attribute on an image?",
      options: ["Provides a tooltip on hover", "Provides alternative text for screen readers and when the image fails to load", "Defines the image alignment", "Makes the image responsive"],
      correctAnswer: "Provides alternative text for screen readers and when the image fails to load"
    },
    {
      id: "q17",
      question: "Which HTML attribute specifies an alternate text for an image?",
      options: ["alt", "title", "longdesc", "src"],
      correctAnswer: "alt"
    },
    {
      id: "q18",
      question: "Which of these elements are all <table> elements?",
      options: ["<table>, <tr>, <tt>", "<table>, <tr>, <td>", "<table>, <head>, <tfoot>", "<thead>, <body>, <tr>"],
      correctAnswer: "<table>, <tr>, <td>"
    },
    {
      id: "q19",
      question: "Which HTML5 tag is used to encapsulate machine-readable data?",
      options: ["<metadata>", "<data>", "<meta>", "<machine>"],
      correctAnswer: "<data>"
    },
    {
      id: "q20",
      question: "What is the correct way to specify the document type in HTML5?",
      options: ["<!DOCTYPE html>", "<!DOCTYPE HTML5>", "<doctype html>", "<!DOCTYPE html public>"],
      correctAnswer: "<!DOCTYPE html>"
    }
  ],
  coding: [
    {
      id: "c1",
      question: "Create an anchor tag that links to 'https://google.com' and opens in a new tab. The text should be 'Search'.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<a.*?href=["']https:\/\/google\.com["'].*?target=["']_blank["'].*?>\s*Search\s*<\/a>/i.test(code) || 
               /<a.*?target=["']_blank["'].*?href=["']https:\/\/google\.com["'].*?>\s*Search\s*<\/a>/i.test(code);
      }
    },
    {
      id: "c2",
      question: "Create a simple table with one row and two data cells. The cells should contain 'Row 1, Cell 1' and 'Row 1, Cell 2'.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<table.*?>[\s\S]*<tr.*?>[\s\S]*<td.*?>\s*Row 1, Cell 1\s*<\/td>[\s\S]*<td.*?>\s*Row 1, Cell 2\s*<\/td>[\s\S]*<\/tr>[\s\S]*<\/table>/i.test(code);
      }
    },
    {
      id: "c3",
      question: "Create a form with a text input (name='username') and a submit button.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<form.*?>[\s\S]*<input.*?type=["']text["'].*?name=["']username["'].*?\/?>[\s\S]*<input.*?type=["']submit["'].*?\/?>[\s\S]*<\/form>/i.test(code) ||
               /<form.*?>[\s\S]*<input.*?type=["']text["'].*?name=["']username["'].*?\/?>[\s\S]*<button.*?type=["']submit["'].*?>[\s\S]*<\/button>[\s\S]*<\/form>/i.test(code) ||
               /<form.*?>[\s\S]*<input.*?name=["']username["'].*?type=["']text["'].*?\/?>[\s\S]*<input.*?type=["']submit["'].*?\/?>[\s\S]*<\/form>/i.test(code);
      }
    },
    {
      id: "c4",
      question: "Create an HTML5 audio element with controls. The source file should be 'music.mp3'.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<audio.*?controls.*?>[\s\S]*<source.*?src=["']music\.mp3["'].*?\/?>[\s\S]*<\/audio>/i.test(code);
      }
    },
    {
      id: "c5",
      question: "Create a text input field that is strictly required.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<input.*?type=["']text["'].*?required.*?\/?>/i.test(code) || /<input.*?required.*?type=["']text["'].*?\/?>/i.test(code);
      }
    },
    {
      id: "c6",
      question: "Create a button that is disabled.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<button.*?disabled.*?>[\s\S]*<\/button>/i.test(code);
      }
    },
    {
      id: "c7",
      question: "Create a semantic header element containing a level 1 heading with the text 'My Site'.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<header.*?>[\s\S]*<h1.*?>\s*My Site\s*<\/h1>[\s\S]*<\/header>/i.test(code);
      }
    },
    {
      id: "c8",
      question: "Create an ordered list with two items: 'First' and 'Second'.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<ol.*?>[\s\S]*<li.*?>\s*First\s*<\/li>[\s\S]*<li.*?>\s*Second\s*<\/li>[\s\S]*<\/ol>/i.test(code);
      }
    },
    {
      id: "c9",
      question: "Create a semantic footer containing the text 'Copyright 2026'.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<footer.*?>\s*Copyright 2026\s*<\/footer>/i.test(code);
      }
    },
    {
      id: "c10",
      question: "Create an HTML5 semantic navigation element containing an anchor tag that links to '/home' with the text 'Home'.",
      starterCode: "<!-- Write your code below -->\n",
      validator: (code: string) => {
        return /<nav.*?>[\s\S]*<a.*?href=["']\/home["'].*?>\s*Home\s*<\/a>[\s\S]*<\/nav>/i.test(code);
      }
    }
  ]
};
