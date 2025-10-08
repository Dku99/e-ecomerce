// funcion para alternar entre el login y registro
function toggleForms() {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const infoSection = document.getElementById('infoSection');

    if (loginSection.style.display === 'none') {
        loginSection.style.display = 'block';
        registerSection.style.display = 'none';
        infoSection.style.display = 'none';
    } else {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
        infoSection.style.display = 'none';
    }
}
// funcion para mostrar informacion despues del registro
function togglePasswordVisibility() {
    const input = document.parentElement.querySelector('button');
    const icon = button.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}
// funcion para manejar el login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').ariaValueMax.trim();
    const password = document = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // validar campos
    if (!email || !password) {
        showToast('por favor complete todos los campos', 'error');
        return;
    }

    //obtener usuarios registrados
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // buscar usuario
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        //login exitoso
        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin || false,
            loginDate
        }
    }
}