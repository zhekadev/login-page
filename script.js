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
        password_error: 'Password must be at least 8 characters',
        or_continue_with: 'Or continue with',
        no_account: "Don't have an account?",
        sign_up: 'Sign up',
        password_strength: {
            weak: 'Weak password',
            medium: 'Medium strength password',
            strong: 'Strong password'
        }
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
        password_error: 'La contraseña debe tener al menos 8 caracteres',
        or_continue_with: 'O continuar con',
        no_account: '¿No tienes una cuenta?',
        sign_up: 'Regístrate',
        password_strength: {
            weak: 'Contraseña débil',
            medium: 'Contraseña de fuerza media',
            strong: 'Contraseña fuerte'
        }
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
        password_error: 'Пароль должен содержать минимум 8 символов',
        or_continue_with: 'Или продолжить с',
        no_account: 'Нет аккаунта?',
        sign_up: 'Зарегистрироваться',
        password_strength: {
            weak: 'Слабый пароль',
            medium: 'Средний пароль',
            strong: 'Сильный пароль'
        }
    }
};

let currentLang = 'en';

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
    const passwordStrengthBar = document.querySelector('.password-strength-bar');
    const passwordStrengthText = document.getElementById('password-strength-text');
    
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

    // Real-time email validation
    emailInput.addEventListener('input', () => {
        validateEmail(emailInput);
    });

    // Real-time password validation and strength check
    passwordInput.addEventListener('input', () => {
        validatePassword(passwordInput);
        checkPasswordStrength(passwordInput.value);
    });

    // Form validation and submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const isEmailValid = validateEmail(emailInput);
        const isPasswordValid = validatePassword(passwordInput);
        
        if (isEmailValid && isPasswordValid) {
            const submitButton = document.getElementById('submit-btn');
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            submitButton.textContent = translations[currentLang].logging_in;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                showSuccess(translations[currentLang].login_success);
                
                // Reset form
                form.reset();
                passwordStrengthBar.className = 'password-strength-bar';
                passwordStrengthText.textContent = '';
            } catch (error) {
                showError(null, translations[currentLang].login_error);
            } finally {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                submitButton.textContent = translations[currentLang].login;
            }
        }
    });

    function validateEmail(input) {
        const isValid = input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        const inputGroup = input.closest('.input-group');
        
        inputGroup.classList.remove('valid', 'invalid');
        if (input.value) {
            inputGroup.classList.add(isValid ? 'valid' : 'invalid');
            if (!isValid) {
                showError(input, translations[currentLang].email_error);
            } else {
                removeError(input);
            }
        }
        
        return isValid;
    }

    function validatePassword(input) {
        const isValid = input.value.length >= 8;
        const inputGroup = input.closest('.input-group');
        
        inputGroup.classList.remove('valid', 'invalid');
        if (input.value) {
            inputGroup.classList.add(isValid ? 'valid' : 'invalid');
            if (!isValid) {
                showError(input, translations[currentLang].password_error);
            } else {
                removeError(input);
            }
        }
        
        return isValid;
    }

    function checkPasswordStrength(password) {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        let strength = 0;
        if (hasLower) strength++;
        if (hasUpper) strength++;
        if (hasNumber) strength++;
        if (hasSpecial) strength++;
        
        passwordStrengthBar.className = 'password-strength-bar';
        if (password.length >= 8) {
            if (strength <= 2) {
                passwordStrengthBar.classList.add('strength-weak');
                passwordStrengthText.textContent = translations[currentLang].password_strength.weak;
            } else if (strength === 3) {
                passwordStrengthBar.classList.add('strength-medium');
                passwordStrengthText.textContent = translations[currentLang].password_strength.medium;
            } else {
                passwordStrengthBar.classList.add('strength-strong');
                passwordStrengthText.textContent = translations[currentLang].password_strength.strong;
            }
        } else {
            passwordStrengthText.textContent = '';
        }
    }
    
    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.id = element ? `${element.id}-error` : 'form-error';
        
        if (element) {
            const existingError = element.parentElement.querySelector('.error-message');
            if (existingError) existingError.remove();
            element.parentElement.appendChild(errorDiv);
        } else {
            const existingError = form.querySelector('#form-error');
            if (existingError) existingError.remove();
            form.insertBefore(errorDiv, form.firstChild);
        }
    }
    
    function removeError(element) {
        const error = element.parentElement.querySelector('.error-message');
        if (error) error.remove();
    }
    
    function showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'toast success';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }, 100);
    }
    
    function updateTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.dataset.translate;
            if (translations[currentLang][key]) {
                if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'email' || element.type === 'password')) {
                    element.placeholder = translations[currentLang][key];
                } else {
                    element.textContent = translations[currentLang][key];
                }
            }
        });
    }
});
