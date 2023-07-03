const userMessage = document.getElementById("userMessage");
const submitBtn = document.getElementById("createAccountBtn");
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const confirmPassword = document.getElementById("confirmPasswordInput");
const formTag = document.querySelector("form");

const checkEmail = async email => {
    const record = await fetch(`/api/user/email/${email}`);
    return await record.json();
}

const createUser = async () => {
    await fetch("/register", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({
            name: nameInput.value.trim(),
            email: emailInput.value,
            password: passwordInput.value 
        })
    })
}

const renderMessage = message => {
    userMessage.style.display = "block";
    formTag.className = "rounded shadow registerFailed";
    userMessage.innerText = message;
}

submitBtn.addEventListener("click", async event => {
    event.preventDefault();
    if (nameInput.value && emailInput.value && passwordInput.value && confirmPassword.value) {
        if (emailInput.value.match(/.+@.+\....+/)) {
            const dbRecord = await checkEmail(emailInput.value);
            if (dbRecord.length) {
                renderMessage("That email already exists");
            } else {
                if (passwordInput.value === confirmPassword.value) {
                    await createUser();
                    location.href = "/login";
                } else {
                    renderMessage("Passwords do not match");
                }
            }
        } else {
            renderMessage("Please input a valid email address");
        }
    } else {
        renderMessage("Please fill out all fields");
    }
})