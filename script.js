// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

 const currentYear = new Date().getFullYear();
    // Setează anul în elementul cu id-ul 'current-year'
    document.getElementById("current-year").textContent = currentYear;
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

// Volunteer form handling
const volunteerForm = document.getElementById('volunteer-form');
if (volunteerForm) {
    volunteerForm.addEventListener('submit', function(e) {
        e.preventDefault();  // Previne trimiterea implicită a formularului
        
        // Colectează datele formularului
        const formData = new FormData(this);
        
        // Validare simplă pentru câmpurile obligatorii
        const requiredFields = ['fullName', 'email', 'phone', 'interests', 'motivation', 'gdprConsent'];
        let isValid = true;
        let missingFields = [];

        for (let field of requiredFields) {
            if (!formData.get(field) || (field === 'gdprConsent' && formData.get(field) !== 'on')) {
                isValid = false;
                missingFields.push(field);
            }
        }

        if (!isValid) {
            showMessage('Te rugăm să completezi toate câmpurile obligatorii.', 'error');
            return;
        }

        // Validare email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.get('email'))) {
            showMessage('Te rugăm să introduci o adresă de email validă.', 'error');
            return;
        }

        // Trimite formularul folosind XMLHttpRequest pentru compatibilitate mai largă
        submitVolunteerApplication(formData);
    });
}

function submitVolunteerApplication(formData) {
    const form = document.getElementById('volunteer-form');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Afișează starea de încărcare
    submitButton.textContent = 'Se trimite...';
    submitButton.disabled = true;
    form.classList.add('form-submitted');

    // Trimite cererea către Formspree folosind XMLHttpRequest
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://formspree.io/f/manbdlby', true);
    xhr.setRequestHeader('Accept', 'application/json');
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Afișează mesaj de succes
                showMessage('Mulțumim! Aplicația ta a fost trimisă cu succes. Te vom contacta în curând.', 'success');
                
                // Resetăm formularul
                form.reset();
                form.classList.remove('form-submitted');
                submitButton.textContent = 'Trimite Aplicația';
                submitButton.disabled = false;

                // Scroll la mesajul de succes
                const messageElement = document.querySelector('.success-message, .error-message');
                if (messageElement) {
                    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                console.error('Eroare la trimiterea formularului:', xhr.responseText);
                showMessage('A apărut o eroare la trimiterea aplicației. Detalii: ' + xhr.responseText, 'error');
                
                // Resetăm starea formularului
                form.classList.remove('form-submitted');
                submitButton.textContent = 'Trimite Aplicația';
                submitButton.disabled = false;
            }
        }
    };

    // Trimite formularul
    xhr.send(formData);
}

function showMessage(message, type) {
    // Șterge mesajele existente
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    // Creează mesajul nou
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
    messageDiv.textContent = message;

    // Adaugă mesajul după formular
    const form = document.getElementById('volunteer-form');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(messageDiv, form.nextSibling);
    }

    // Șterge mesajul de succes după 10 secunde
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 10000);
    }
}


    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            } else {
                navbar.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)';
            }
        }
        lastScrollY = window.scrollY;
    });

    // Add some interactivity to statistics
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number, .impact-number');
                statNumbers.forEach(stat => {
                    if (!stat.classList.contains('animated')) {
                        animateNumber(stat);
                        stat.classList.add('animated');
                    }
                });
            }
        });
    }, observerOptions);

    // Observe statistics sections
    const statsSection = document.querySelector('.about-stats');
    const impactSection = document.querySelector('.impact-grid');
    
    if (statsSection) observer.observe(statsSection);
    if (impactSection) observer.observe(impactSection);

    function animateNumber(element) {
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/\d/g, '');
        
        if (number && number > 0) {
            let current = 0;
            const increment = number / 30;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    element.textContent = number + suffix;
                    clearInterval(timer);
                } else {
                    element.textContent = Math.floor(current) + suffix;
                }
            }, 50);
        }
    }
});

// Additional utility functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Copy to clipboard functionality for IBAN numbers
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const button = event.target.closest('.copy-btn');
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = '#10b981';
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.style.background = '#059669';
        }, 2000);
        
        // Optional: Show toast message
        showMessage('IBAN copiat în clipboard!', 'success');
    }).catch(() => {
        showMessage('Nu s-a putut copia IBAN-ul. Te rugăm să-l copiezi manual.', 'error');
    });
}

// Add click handler for logo to scroll to top
document.addEventListener('DOMContentLoaded', function() {
    const logo = document.querySelector('.nav-brand');
    if (logo) {
        logo.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToTop();
        });
        logo.style.cursor = 'pointer';
    }
});