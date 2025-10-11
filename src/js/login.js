function getUsers() {
    return JSON.parse(localStorage.getItem("so-users") || "[]");
}
function setCurrentUser() {
    localStorage.setItem("so-currentUser", JSON.stringify({email: user.email, name: user.name}));
}

const form = document.getElementById("loginForm");
const errorEl = document.getElementById("formError");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.tectContent = "";

    const {email, password } = Object.fromEntries(new FormData(form).entries());
    const user = getUsers().find((u) => u.email.toLowerCase()=== String(email).toLowerCase());

    if (!user || user.password !== password) {
        errorEl.textContent = "Invalid email or password.";
        return;
    }

    setCurrentUser(user);
    window.location.href = "src/index.html";
})