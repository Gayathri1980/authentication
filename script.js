const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");

const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const dashboard = document.getElementById("dashboard");
const mainContainer = document.querySelector(".main-container");
const header = document.querySelector(".header");
const footer = document.querySelector("footer");

const dashboardName = document.getElementById("dashboardName");
const dashboardUserName = document.getElementById("dashboardUserName");
const dashboardEmail = document.getElementById("dashboardEmail");
const dashboardRole = document.getElementById("dashboardRole");

const users = JSON.parse(localStorage.getItem("spirexUsers")) || [];

function showLogin() {

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    formTitle.textContent = "Welcome Back";

    formSubtitle.textContent =
        "Login to continue your learning journey";

    loginMessage.textContent = "";
    registerMessage.textContent = "";
}

function showRegister() {

    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    loginTab.classList.remove("active");
    registerTab.classList.add("active");

    formTitle.textContent = "Create Account";

    formSubtitle.textContent =
        "Join the SpireX learning community";

    loginMessage.textContent = "";
    registerMessage.textContent = "";
}

loginTab.addEventListener("click", showLogin);
registerTab.addEventListener("click", showRegister);

goRegister.addEventListener("click", showRegister);
goLogin.addEventListener("click", showLogin);

function togglePassword(buttonId, inputId) {

    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    button.addEventListener("click", () => {

        if (input.type === "password") {

            input.type = "text";
            button.textContent = "🙈";

        } else {

            input.type = "password";
            button.textContent = "👁";

        }

    });
}

togglePassword("loginEye", "loginPassword");
togglePassword("registerEye", "registerPassword");

const registerPassword =
    document.getElementById("registerPassword");

const strengthBar =
    document.getElementById("strengthBar");

const strengthText =
    document.getElementById("strengthText");

registerPassword.addEventListener("input", () => {

    const password = registerPassword.value;

    let score = 0;

    if (password.length >= 8) {
        score++;
    }

    if (/[A-Z]/.test(password)) {
        score++;
    }

    if (/[0-9]/.test(password)) {
        score++;
    }

    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
    }

    if (password.length === 0) {

        strengthBar.style.width = "0";
        strengthText.textContent = "Password strength";

    } else if (score <= 1) {

        strengthBar.style.width = "25%";
        strengthText.textContent = "Weak password";

    } else if (score <= 3) {

        strengthBar.style.width = "65%";
        strengthText.textContent = "Medium password";

    } else {

        strengthBar.style.width = "100%";
        strengthText.textContent = "Strong password";
    }
});

registerForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim().toLowerCase();

    const password =
        document.getElementById("registerPassword").value;

    const role =
        document.getElementById("registerRole").value;

    const terms =
        document.getElementById("terms").checked;

    if (!terms) {

        registerMessage.textContent =
            "Please accept the Terms & Conditions.";

        registerMessage.style.color = "#dc2626";

        return;
    }

    if (password.length < 8) {

        registerMessage.textContent =
            "Password must contain at least 8 characters.";

        registerMessage.style.color = "#dc2626";

        return;
    }

    const existingUser =
        users.find(user => user.email === email);

    if (existingUser) {

        registerMessage.textContent =
            "An account with this email already exists.";

        registerMessage.style.color = "#dc2626";

        return;
    }

    const newUser = {

        id: Date.now(),

        name: name,

        email: email,

        password: password,

        role: role,

        createdAt: new Date().toISOString()

    };

    users.push(newUser);

    localStorage.setItem(
        "spirexUsers",
        JSON.stringify(users)
    );

    registerMessage.textContent =
        "Account created successfully!";

    registerMessage.style.color = "#059669";

    registerForm.reset();

    strengthBar.style.width = "0";

    strengthText.textContent =
        "Password strength";

    setTimeout(() => {

        showLogin();

        document.getElementById("loginEmail").value =
            email;

    }, 1000);
});

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const email =
        document.getElementById("loginEmail").value.trim().toLowerCase();

    const password =
        document.getElementById("loginPassword").value;

    const rememberMe =
        document.getElementById("rememberMe").checked;

    const user = users.find(account =>

        account.email === email &&
        account.password === password

    );

    if (!user) {

        loginMessage.textContent =
            "Invalid email or password.";

        loginMessage.style.color = "#dc2626";

        return;
    }

    const sessionData = {

        id: user.id,

        name: user.name,

        email: user.email,

        role: user.role,

        loginTime: new Date().toISOString()

    };

    if (rememberMe) {

        localStorage.setItem(
            "spirexCurrentUser",
            JSON.stringify(sessionData)
        );

    } else {

        sessionStorage.setItem(
            "spirexCurrentUser",
            JSON.stringify(sessionData)
        );
    }

    loginMessage.textContent =
        "Login successful!";

    loginMessage.style.color = "#059669";

    setTimeout(() => {

        showDashboard(sessionData);

    }, 700);
});

function showDashboard(user) {

    mainContainer.classList.add("hidden");
    header.classList.add("hidden");
    footer.classList.add("hidden");

    dashboard.classList.remove("hidden");

    dashboardName.textContent =
        user.name;

    dashboardUserName.textContent =
        user.name;

    dashboardEmail.textContent =
        user.email;

    dashboardRole.textContent =
        user.role.charAt(0).toUpperCase() +
        user.role.slice(1);
}

function logout() {

    localStorage.removeItem(
        "spirexCurrentUser"
    );

    sessionStorage.removeItem(
        "spirexCurrentUser"
    );

    dashboard.classList.add("hidden");

    mainContainer.classList.remove("hidden");
    header.classList.remove("hidden");
    footer.classList.remove("hidden");

    loginForm.reset();

    showLogin();
}

document.getElementById("logoutBtn")
    .addEventListener("click", logout);

document.getElementById("forgotPassword")
    .addEventListener("click", () => {

        const email =
            document.getElementById("loginEmail").value.trim();

        if (!email) {

            loginMessage.textContent =
                "Enter your email address first.";

            loginMessage.style.color = "#dc2626";

            return;
        }

        const user =
            users.find(account =>
                account.email === email
            );

        if (!user) {

            loginMessage.textContent =
                "No account found with this email.";

            loginMessage.style.color = "#dc2626";

            return;
        }

        loginMessage.textContent =
            "Password reset request received.";

        loginMessage.style.color = "#059669";
    });

function checkExistingSession() {

    const localUser =
        JSON.parse(
            localStorage.getItem("spirexCurrentUser")
        );

    const sessionUser =
        JSON.parse(
            sessionStorage.getItem("spirexCurrentUser")
        );

    const currentUser =
        localUser || sessionUser;

    if (currentUser) {

        showDashboard(currentUser);
    }
}

checkExistingSession();