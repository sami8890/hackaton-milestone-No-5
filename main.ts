// Declare the global html2pdf function to avoid TypeScript errors
declare const html2pdf: any;

// Get references to the form and display area
const form = document.getElementById('resumeForm') as HTMLFormElement;
const resumeDisplayElement = document.getElementById('resumeOutput') as HTMLDivElement;
const copyUrlButton = document.getElementById('copy-url-button') as HTMLButtonElement;
const downloadPdfButton = document.getElementById('download-pdf-button') as HTMLButtonElement;

// Handle form submission
form.addEventListener('submit', (event: Event) => {
    event.preventDefault(); // Prevent page reload

    // Collect input values
    const name = (document.getElementById('name') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const degree = (document.getElementById('degree') as HTMLInputElement).value.trim();
    const institution = (document.getElementById('institution') as HTMLInputElement).value.trim();
    const jobTitle = (document.getElementById('jobTitle') as HTMLInputElement).value.trim();
    const company = (document.getElementById('company') as HTMLInputElement).value.trim();
    const skills = (document.getElementById('skills') as HTMLInputElement).value.trim();

    if (!name || !email || !degree || !institution || !jobTitle || !company || !skills) {
        alert('Please fill in all fields');
        return;
    }

    // Save form data in localStorage with the email as the key
    const resumeData = {
        name,
        email,
        degree,
        institution,
        jobTitle,
        company,
        skills
    };
    localStorage.setItem(email, JSON.stringify(resumeData));

    // Generate the resume content dynamically
    const resumeHTML = `
        <h2>Your Resume</h2></br>
        <p><b>Name:</b> ${name}</p></br>
        <p><b>Email:</b> ${email}</p></br>
        <h3>Education</h3></br>
        <p><b>Degree:</b> ${degree}</p></br>
        <p><b>Institution:</b> ${institution}</p></br>
        <h3>Work Experience</h3></br>
        <p><b>Job Title:</b> ${jobTitle}</p>
        <p><b>Company:</b> ${company}</p></br>
        <h3>Skills</h3>
        <p>${skills}</p>
    `;

    // Display the generated resume
    resumeDisplayElement.innerHTML = resumeHTML;
    resumeDisplayElement.style.display = 'block';

    // this code Generate a shareable URL with the email only
    const shareableURL = `${window.location.origin}?email=${encodeURIComponent(email)}`;

    // it will Show and configure buttons
    copyUrlButton.style.display = 'block';
    downloadPdfButton.style.display = 'block';

    // Update the button event listeners
    updateButtonListeners(shareableURL);
});

// Function to update button event listeners 
function updateButtonListeners(shareableURL: string) {
    // Handle URL copy
    copyUrlButton.removeEventListener('click', copyUrlHandler); // Remove old listener
    copyUrlButton.addEventListener('click', copyUrlHandler);

    // Handle PDF download
    downloadPdfButton.removeEventListener('click', downloadPdfHandler); // Remove old listener
    downloadPdfButton.addEventListener('click', downloadPdfHandler);

    function copyUrlHandler() {
        navigator.clipboard.writeText(shareableURL).then(() => {
            alert('URL copied to clipboard');
        }).catch((err) => {
            console.error('Failed to copy URL: ', err);
        });
    }

    function downloadPdfHandler() {
        html2pdf().from(resumeDisplayElement).save('resume.pdf');
    }
}

// Prefill the form based on the email in the URL
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');

    if (email) {
        // Autofill form if data is found in localStorage
        const savedResumeData = localStorage.getItem(email);

        if (savedResumeData) {
            const resumeData = JSON.parse(savedResumeData);
            (document.getElementById('name') as HTMLInputElement).value = resumeData.name;
            (document.getElementById('email') as HTMLInputElement).value = resumeData.email;
            (document.getElementById('degree') as HTMLInputElement).value = resumeData.degree;
            (document.getElementById('institution') as HTMLInputElement).value = resumeData.institution;
            (document.getElementById('jobTitle') as HTMLInputElement).value = resumeData.jobTitle;
            (document.getElementById('company') as HTMLInputElement).value = resumeData.company;
            (document.getElementById('skills') as HTMLInputElement).value = resumeData.skills;
        }
    }
});
