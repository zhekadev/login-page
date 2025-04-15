// Theme handling
const themeToggle = document.querySelector('.theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize theme
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

// Translations
const translations = {
    en: {
        welcome: 'Welcome Back',
        email: 'Email',
        email_placeholder: 'Enter your email',
        password: 'Password',
        password_placeholder: 'Enter your password',
        remember_me: 'Remember me',
        forgot_password: 'Forgot password?',
        login: 'Log In',
        logging_in: 'Logging in...',
        login_success: 'Successfully logged in!',
        login_error: 'An error occurred. Please try again.',
        email_error: 'Please enter a valid email address',
        password_error: 'Password must be at least 8 characters'
    },
    es: {
        welcome: 'Bienvenido de nuevo',
        email: 'Correo electrónico',
        email_placeholder: 'Ingresa tu correo electrónico',
        password: 'Contraseña',
        password_placeholder: 'Ingresa tu contraseña',
        remember_me: 'Recuérdame',
        forgot_password: '¿Olvidaste tu contraseña?',
        login: 'Iniciar sesión',
        logging_in: 'Iniciando sesión...',
        login_success: '¡Sesión iniciada con éxito!',
        login_error: 'Ocurrió un error. Por favor, inténtalo de nuevo.',
        email_error: 'Por favor, ingresa un correo electrónico válido',
        password_error: 'La contraseña debe tener al menos 8 caracteres'
    },
    ru: {
        welcome: 'С возвращением',
        email: 'Эл. почта',
        email_placeholder: 'Введите эл. почту',
        password: 'Пароль',
        password_placeholder: 'Введите пароль',
        remember_me: 'Запомнить меня',
        forgot_password: 'Забыли пароль?',
        login: 'Войти',
        logging_in: 'Вход...',
        login_success: 'Вход выполнен успешно!',
        login_error: 'Произошла ошибка. Попробуйте снова.',
        email_error: 'Пожалуйста, введите корректный адрес эл. почты',
        password_error: 'Пароль должен содержать минимум 8 символов'
    }
};

let currentLang = 'en';
//fixme decrease cognitive complexity of the callback below 
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);
    
    const form = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Initialize translations
    updateTranslations();
    
    // Language switcher
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang !== currentLang) {
                currentLang = lang;
                langButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateTranslations();
            }
        });
    });

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.querySelector('.eye-icon').style.opacity = type === 'password' ? '0.7' : '1';
    });

    // Form validation and submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Remove any existing error states
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        
        let hasError = false;
        
        // Basic email validation
        if (!emailInput.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            emailInput.classList.add('error');
            showError(emailInput, translations[currentLang].email_error);
            hasError = true;
        }
        
        // Password validation (at least 8 characters)
        if (passwordInput.value.length < 8) {
            passwordInput.classList.add('error');
            showError(passwordInput, translations[currentLang].password_error);
            hasError = true;
        }
        
        if (!hasError) {
            const submitButton = document.getElementById('submit-btn');
            submitButton.disabled = true;
            submitButton.textContent = translations[currentLang].logging_in;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                showSuccess(translations[currentLang].login_success);
                
                // Reset form
                form.reset();
            } catch (error) {
                showError(null, translations[currentLang].login_error);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = translations[currentLang].login;
            }
        }
    });
    
    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        if (element) {
            const existingError = element.parentElement.querySelector('.error-message');
            if (existingError) existingError.remove();
            element.parentElement.appendChild(errorDiv);
        }
    }
    
    function showSuccess(message) {
        alert(message); // In a real application, use a proper toast/notification system
    }
    
    function updateTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[currentLang][key]) {
                if (element.tagName === 'INPUT' && element.type === 'text' || element.type === 'email' || element.type === 'password') {
                    element.placeholder = translations[currentLang][key];
                } else {
                    element.textContent = translations[currentLang][key];
                }
            }
        });
    }
});
