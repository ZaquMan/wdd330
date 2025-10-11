//Do not store real passwords in localStorage please.
function getUsers() {
    return JSON.parse(localStorage.getItem("so-users") || "[]");
}
function setUsers(users) {
    localStorage.setItem("so-users", JSON.stringify(users));
}
function setCurrentUsers(users) {
    localStorage.setItem("so-currentUser", JSON.stringify({email: users.email, name:users.name}));
}

const form = document.getElementById("signupForm");
const errorEl = document.getElementById("formError");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.textContent = "";

    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.email || !data.password) {
        errorEl.textContent = "Please fill in name, email, and password.";
        return;
    }
    if (!/^\d{5}$/.test(data.zip)) {
        errorEl.textContent = "ZIP must be 5 digits.";
        return;
    }
    if (exists) {
        errorEl.textContent = "An account with that email already exists.";
        return;
    }

    const user = {
        id: crypto.randomUUID(),
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        address: {
            line1: data.address1.trim(),
            line2: (data.address2 || "").trim(),
            city: data.city.trim(),
            state: data.state.trim().toUpperCase(),
            zip: data.zip.trim(),
        },
        createdAt: new Date().toISOString(),
    };
    users.push(user);
    setUsers(users);
    setCurrentUsers(user)

    window.location.href ="src/index.html";
})