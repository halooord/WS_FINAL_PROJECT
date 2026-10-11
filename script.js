const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");
const togglePassword = document.getElementById("togglePassword");
const agreement = document.getElementById("agreement");
const agreementError = document.getElementById("agreementError");
const submitButton = document.getElementById("submitButton");

const fieldIds = [
    "studentId",
    "fullName",
    "email",
    "phone",
    "dob",
    "gender",
    "program",
    "yearLevel",
    "password",
    "confirmPassword",
    "address"
];

function showError(field, message) {
    const errorMessage = document.getElementById(field.id + "Error");
    errorMessage.textContent = message;
    field.classList.add("error");
    field.setAttribute("aria-invalid", "true");
}

function clearError(field) {
    const errorMessage = document.getElementById(field.id + "Error");
    errorMessage.textContent = "";
    field.classList.remove("error");
    field.setAttribute("aria-invalid", "false");
}

function validateField(field) {
    const value = field.value.trim();
    let message = "";

    switch (field.id) {
        case "studentId":
            if (value === "") {
                message = "Student ID is required.";
            }
            break;

        case "fullName":
            if (value === "") {
                message = "Full name is required.";
            } else if (value.length < 2) {
                message = "Full name must contain at least 2 characters.";
            }
            break;

        case "email":
            if (value === "") {
                message = "Email address is required.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = "Enter a valid email address.";
            }
            break;

        case "phone": {
            const phoneFormat = field.dataset.phoneFormat;

            if (value === "") {
                message = "Phone number is required.";
            } else if (
                phoneFormat === "philippines-mobile" &&
                !/^09\d{9}$/.test(value)
            ) {
                message = "Enter an 11-digit Philippine mobile number starting with 09.";
            }
            break;
        }

        case "dob": {
            const dateRule = field.dataset.dateRule;

            if (value === "") {
                message = "Date of birth is required.";
            } else if (dateRule === "past-or-today") {
                const selectedDate = new Date(value + "T00:00:00");
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (selectedDate > today) {
                    message = "Date of birth cannot be in the future.";
                }
            }
            break;
        }

        case "gender":
            if (value === "") {
                message = "Please select your gender.";
            }
            break;

        case "program":
            if (value === "") {
                message = "Please select your program.";
            }
            break;

        case "yearLevel":
            if (value === "") {
                message = "Please select your year level.";
            }
            break;

        case "password": {
            const minLength = Number(field.dataset.minLength);

            if (value === "") {
                message = "Password is required.";
            } else if (value.length < minLength) {
                message = `Password must have at least ${minLength} characters.`;
            }
            break;
        }

        case "confirmPassword":
            if (value === "") {
                message = "Please confirm your password.";
            } else if (field.value !== document.getElementById("password").value) {
                message = "Passwords do not match.";
            }
            break;

        case "address":
            if (value === "") {
                message = "Address is required.";
            } else if (value.length < 5) {
                message = "Address must contain at least 5 characters.";
            }
            break;
    }

    if (message !== "") {
        showError(field, message);
        return false;
    }

    clearError(field);
    return true;
}

function validateAgreement() {
    if (!agreement.checked) {
        agreementError.textContent = "You must agree before submitting the form.";
        agreement.classList.add("error");
        agreement.setAttribute("aria-invalid", "true");
        return false;
    }

    agreementError.textContent = "";
    agreement.classList.remove("error");
    agreement.setAttribute("aria-invalid", "false");
    return true;
}

fieldIds.forEach(function (id) {
    const field = document.getElementById(id);

    field.setAttribute("aria-invalid", "false");

    field.addEventListener("blur", function () {
        validateField(field);
    });

    field.addEventListener("input", function () {
        successMessage.textContent = "";

        if (field.classList.contains("error")) {
            validateField(field);
        }

        if (field.id === "password") {
            const confirmPassword = document.getElementById("confirmPassword");

            if (confirmPassword.value !== "") {
                validateField(confirmPassword);
            }
        }
    });

    field.addEventListener("change", function () {
        if (field.tagName === "SELECT" || field.type === "date") {
            validateField(field);
        }
    });
});

agreement.addEventListener("change", function () {
    successMessage.textContent = "";
    validateAgreement();
});

togglePassword.addEventListener("click", function () {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");

    const isVisible = togglePassword.classList.toggle("password-visible");

    password.setAttribute("type", isVisible ? "text" : "password");
    confirmPassword.setAttribute("type", isVisible ? "text" : "password");
    togglePassword.textContent = isVisible ? "Hide Passwords" : "Show Passwords";
    togglePassword.setAttribute("aria-pressed", String(isVisible));
});

form.addEventListener("submit", function (event) {
    event.preventDefault();
    successMessage.textContent = "";

    fieldIds.forEach(function (id) {
        const field = document.getElementById(id);

        if (field.type !== "password") {
            field.value = field.value.trim();
        }
    });

    let isValid = true;

    fieldIds.forEach(function (id) {
        const field = document.getElementById(id);

        if (!validateField(field)) {
            isValid = false;
        }
    });

    if (!validateAgreement()) {
        isValid = false;
    }

    if (!isValid) {
        const firstError = form.querySelector(".error");

        if (firstError) {
            firstError.focus();
        }

        return;
    }

    successMessage.textContent = "Registration successful! Your form is valid.";

    fieldIds.forEach(function (id) {
        clearError(document.getElementById(id));
    });

    submitButton.disabled = true;
    submitButton.textContent = "Registered";
});

form.addEventListener("reset", function () {
    setTimeout(function () {
        fieldIds.forEach(function (id) {
            const field = document.getElementById(id);
            clearError(field);
            field.setAttribute("aria-invalid", "false");
        });

        agreementError.textContent = "";
        agreement.classList.remove("error");
        agreement.setAttribute("aria-invalid", "false");

        successMessage.textContent = "";
        submitButton.disabled = false;
        submitButton.textContent = "Register";

        document.getElementById("password").setAttribute("type", "password");
        document.getElementById("confirmPassword").setAttribute("type", "password");

        togglePassword.classList.remove("password-visible");
        togglePassword.textContent = "Show Passwords";
        togglePassword.setAttribute("aria-pressed", "false");
    }, 0);
});