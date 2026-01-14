/**
 * COURSE MODULE - Handles data, rendering, filtering, and modals
 */
const courses = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce students to programming. It will focus on the development of logic and problem-solving skills.', completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'This course introduces students to the World Wide Web by teaching them HTML5 and CSS3.', completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, certificate: 'Web and Computer Programming', description: 'Students become proficient in solving problems by writing functions in Python.', completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, certificate: 'Web and Computer Programming', description: 'This course will introduce the concepts of object-oriented programming using C#.', completed: false },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'This course builds on previous experience with HTML and CSS by adding JavaScript.', completed: true },
    { subject: 'WDD', number: 231, title: 'Web Frontend Development I', credits: 2, certificate: 'Web and Computer Programming', description: 'This course focuses on user experience, accessibility, and the use of modern frontend tools.', completed: false }
];

const courseListElement = document.querySelector("#course-list");
const totalCreditsElement = document.querySelector("#total-credits");
const courseDetails = document.querySelector("#course-details");

function displayCourses(filteredCourses) {
    courseListElement.innerHTML = "";
    filteredCourses.forEach(course => {
        const courseCard = document.createElement("div");
        courseCard.classList.add("course-card");
        if (course.completed) courseCard.classList.add("completed");
        courseCard.innerHTML = `<h3>${course.subject} ${course.number}</h3>`;
        courseCard.addEventListener('click', () => displayCourseDetails(course));
        courseListElement.appendChild(courseCard);
    });
    const total = filteredCourses.reduce((sum, course) => sum + course.credits, 0);
    totalCreditsElement.textContent = total;
}

function displayCourseDetails(course) {
    courseDetails.innerHTML = `
        <button id="closeModal" style="float:right; cursor:pointer; background:none; border:none; font-size:1.5rem;">&times;</button>
        <h2>${course.subject} ${course.number}</h2>
        <h3>${course.title}</h3>
        <p><strong>Credits</strong>: ${course.credits}</p>
        <p><strong>Certificate</strong>: ${course.certificate}</p>
        <p style="margin-top: 10px;">${course.description}</p>
    `;
    courseDetails.showModal();
    document.getElementById("closeModal").addEventListener("click", () => courseDetails.close());
}

// Backdrop click-to-close logic
courseDetails.addEventListener("click", (event) => {
    if (event.target === courseDetails) courseDetails.close();
});

// Event Listeners for Filtering
document.querySelector("#all").addEventListener("click", () => displayCourses(courses));
document.querySelector("#cse").addEventListener("click", () => displayCourses(courses.filter(c => c.subject === "CSE")));
document.querySelector("#wdd").addEventListener("click", () => displayCourses(courses.filter(c => c.subject === "WDD")));

// Initial Load
displayCourses(courses);