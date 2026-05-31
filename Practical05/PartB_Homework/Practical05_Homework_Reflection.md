Reflective Report on changes made from Practical 3 to 5.

Table of Contents:

1. Seperation of Concerns
   The MVC architecture cleanly separates the concerns for this full-stack web application. The model handles the database operations, data validation, and domain rules.
   The View (external frontend) acts as a standalone app that renders the User Interface and handles User interaction. It communicates with the backend through API calls and handles the user's requests.
   The Controller receieves HTTP requests, calls the Model and returns JSON responses. It acts as the mediator between web protocol and business logic.
   Having a separate frontend View simplifies the responsibilities of my backend API by making the backend purely data-oriented. This allows the API to be simpler, easier to test and reusable (the same endpoints can serve different apps, projects, frontends with minimal changes).
2. Robustness and Security
   I think that it was easiest to test identify and fix bugs related to data handling or API responses once the project reached Practical 5. At this stage, it became much simpler to test and debug since the browser's DevTools revealed the errors concretely.
3. Challenges and Problem Solving
   The most challenging aspect for me across Practical 3, 4 and 5 were trying to understand the syntax and learn what each line of code does. Although having taken frontend in the previous semester, I was admittedly still weak and rusty in javaScript. When it came to trying to understand how each line fulfilled it's responsibility and how it corresponded to each portion of the MVC architecture, I did get confused often. I stayed patient with the process of relearning the syntax and learning new functions and eventually managed to get a better grasp on why each line of code was necessary.
   Since I have this new MVC structure, I would be better equipped to write out the business logic/database interactions in the Model, come up with the frontend in the View, and ensure that the Controller processed HTTP requests. Also, debugging would be much efficient as I could use browser tools to find out where my code went astray and uncover what I need to fix.
4. Experiential Learning
   I certainly have a better understanding and appreciation of why exactly MVC and sepeartion of concerns are so vital in full-stack projects. Because I had to manually debug various lines of errors, I now better understand how to approach the developing of full-stack projects. While reading was definitely helpful for getting a quick grasp on the concepts, hands-on coding and refactoring challenged what I thought I knew and revealed the gaps in my knowledge and understanding. Therefore, allowing me to repiece my thought processes and refine my approach to web development.
