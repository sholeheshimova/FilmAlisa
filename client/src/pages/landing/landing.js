import { baseUrl } from "../../api/config";

const contactForm = document.getElementById('contactForm');
const responseMessage = document.getElementById('responseMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fullnameInput = document.getElementById('name') || contactForm.elements.fullname;
        const emailInput = document.getElementById('email') || contactForm.elements.email;
        const reasonInput = document.getElementById('reason') || contactForm.elements.reason;

        const formData = {
            full_name: fullnameInput.value.trim(),
            email: emailInput.value.trim(),
            reason: reasonInput.value.trim(),
        };

        if (!formData.full_name || !formData.email || !formData.reason) {
            if (responseMessage) {
                responseMessage.style.color = "red";
                responseMessage.innerText = "Error: Please fill out all required fields.";
            }
            return;
        }

        try {
            const response = await fetch(`${baseUrl}/contactus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json().catch(() => null);
            if (response.ok && result?.result !== false) {
                if (responseMessage) {
                    responseMessage.style.color = "green";
                    responseMessage.innerText = "Your message has been sent successfully!";
                }
                contactForm.reset();
            } else {
                throw new Error(result?.message || "An error occurred while sending your message.");
            }
        } catch (error) {
            console.error("Error:", error.message);
            if (responseMessage) {
                responseMessage.style.color = "red";
                responseMessage.innerText = "Error: " + error.message;
            }
        }
    });
}

// sing in 
function toggleAccordion(header) {
    const content = header.nextElementSibling;
    const isOpen = content.classList.contains("open");
    if (isOpen) {
        content.classList.remove("open");
        header.querySelector("span").classList.remove("rotate");
    } else {
        content.classList.add("open");
        header.querySelector("span").classList.add("rotate");
    }
}
