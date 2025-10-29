document.addEventListener("DOMContentLoaded", () => {
  const App = {
    // --- 1. CONFIGURACIÓN Y ESTADO ---
    config: {
      SCROLLED_CLASS: "scrolled",
      ACTIVE_CLASS: "active",
      SHOW_CLASS: "show",
      AOS_ANIMATE_CLASS: "aos-animate",
      HEADER_SCROLL_OFFSET: 100,
      BACK_TO_TOP_OFFSET: 300,
      SMOOTH_SCROLL_OFFSET: 80,
      EASTER_EGG_CLICKS: 5,
    },

    // --- 2. CACHÉ DE ELEMENTOS DEL DOM ---
    DOM: {
      header: document.getElementById("header"),
      mobileMenuToggle: document.getElementById("mobileMenuToggle"),
      navLinks: document.getElementById("navLinks"),
      navLinkItems: document.querySelectorAll(".nav-link"),
      backToTopBtn: document.getElementById("backToTop"),
      sections: document.querySelectorAll("section[id]"),
      contactForm: document.getElementById("contactForm"),
      newsletterForm: document.querySelector(".newsletter-form"),
      timeInput: document.getElementById("time"),
      dateInput: document.getElementById("date"),
      logo: document.querySelector(".header-logo-image"), // Ajustado para coincidir con HTML
      hero: document.querySelector(".hero"),
      badgeNumber: document.querySelector(".badge-number"),
      aosElements: document.querySelectorAll("[data-aos]"),
    },

    // --- 3. MÉTODOS / FUNCIONES ---
    toggleMobileMenu(forceClose = false) {
      const { navLinks, mobileMenuToggle } = App.DOM;
      const { ACTIVE_CLASS } = App.config;
      if (forceClose) {
        navLinks.classList.remove(ACTIVE_CLASS);
        mobileMenuToggle.classList.remove(ACTIVE_CLASS);
      } else {
        navLinks.classList.toggle(ACTIVE_CLASS);
        mobileMenuToggle.classList.toggle(ACTIVE_CLASS);
      }
    },

    updateActiveNavLink() {
      const { sections, navLinkItems } = App.DOM;
      const { ACTIVE_CLASS } = App.config;
      const scrollY = window.pageYOffset;
      let currentSectionId = "";

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 150;
        if (scrollY >= sectionTop) {
          currentSectionId = section.getAttribute("id");
        }
      });

      navLinkItems.forEach((link) => {
        link.classList.remove(ACTIVE_CLASS);
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add(ACTIVE_CLASS);
        }
      });
    },

    handleScroll() {
      const { header, backToTopBtn, hero } = App.DOM;
      const {
        SCROLLED_CLASS,
        SHOW_CLASS,
        HEADER_SCROLL_OFFSET,
        BACK_TO_TOP_OFFSET,
      } = App.config;
      const scrollY = window.pageYOffset;

      header.classList.toggle(SCROLLED_CLASS, scrollY > HEADER_SCROLL_OFFSET);
      backToTopBtn.classList.toggle(SHOW_CLASS, scrollY > BACK_TO_TOP_OFFSET);
      App.updateActiveNavLink();

      // Parallax deshabilitado para evitar saltos y recortes del fondo

      // Animación de desaparición del indicador "Desliza" en el Hero
      if (scrollY > 60) {
        document.body.classList.add("hero-scrolled");
      } else {
        document.body.classList.remove("hero-scrolled");
      }
    },

    async handleContactFormSubmit(e) {
      e.preventDefault();

      const form = e.target;
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.innerHTML;

      submitButton.disabled = true;
      submitButton.innerHTML = "Agendando...";

      // 3. Captura los datos de todos los campos del formulario
      const formData = {
        name: form.querySelector("#name").value,
        email: form.querySelector("#email").value,
        phone: form.querySelector("#phone").value,
        service: form.querySelector("#service").value,
        date: form.querySelector("#date").value,
        time: form.querySelector("#time").value,
      };

      try {
        // 5. Realiza la petición fetch al backend (API base configurable por meta tag)
        const apiBase = (
          document.querySelector('meta[name="api-base"]')?.content ||
          "http://localhost:3000/api"
        ).trim();
        const response = await fetch(`${apiBase}/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        // 6. Maneja la respuesta del servidor
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.statusText}`);
        }

        const result = await response.json();
        console.log("Respuesta del servidor:", result);
        alert(
          `¡Gracias ${formData.name}! Tu cita ha sido recibida. Nos pondremos en contacto para confirmar.`
        );
        form.reset();
        if (App.DOM.dateInput) App.DOM.dateInput.type = "text";
      } catch (error) {
        alert(
          "Lo sentimos, ocurrió un error al agendar tu cita. Por favor, intenta más tarde."
        );
        console.error("Error al enviar formulario:", error);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      }
    },

    async updateAvailableTimes() {
      const { dateInput, timeInput } = App.DOM;
      const selectedDate = dateInput.value;

      if (!selectedDate) {
        timeInput.disabled = true;
        timeInput.innerHTML =
          '<option value="">Primero selecciona una fecha</option>';
        return;
      }

      timeInput.disabled = true;
      timeInput.innerHTML = '<option value="">Cargando horas...</option>';

      try {
        // Simulación de respuesta del backend
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const availableHours = ["10:00", "11:30", "14:00", "15:00", "17:30"];

        timeInput.innerHTML = availableHours.length
          ? '<option value="">Selecciona una Hora *</option>'
          : '<option value="">No hay horas disponibles</option>';
        availableHours.forEach((hour) => timeInput.add(new Option(hour, hour)));
        timeInput.disabled = availableHours.length === 0;
      } catch (error) {
        console.error("Error al cargar los horarios:", error);
        timeInput.innerHTML = '<option value="">Error al cargar horas</option>';
      }
    },

    animateCounter(observer) {
      const { badgeNumber } = App.DOM;
      const target = parseInt(
        badgeNumber.dataset.target || badgeNumber.textContent,
        10
      );
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        badgeNumber.textContent = Math.floor(start) + "+";
        if (start >= target) {
          badgeNumber.textContent = target + "+";
          clearInterval(timer);
        }
      }, 16);
      observer.unobserve(badgeNumber);
    },

    // --- 4. EVENT LISTENERS ---
    bindEvents() {
      const {
        mobileMenuToggle,
        navLinks,
        backToTopBtn,
        contactForm,
        newsletterForm,
        dateInput,
        timeInput,
        logo,
        aosElements,
        badgeNumber,
      } = App.DOM;
      const { AOS_ANIMATE_CLASS, EASTER_EGG_CLICKS } = App.config;

      // Menú móvil
      mobileMenuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        App.toggleMobileMenu();
      });

      // Cerrar menú al hacer clic fuera
      document.addEventListener("click", (e) => {
        if (
          !navLinks.contains(e.target) &&
          !mobileMenuToggle.contains(e.target)
        ) {
          App.toggleMobileMenu(true);
        }
      });

      // Smooth scroll y cerrar menú (delegación de eventos)
      navLinks.addEventListener("click", (e) => {
        if (e.target.matches('a[href^="#"]')) {
          e.preventDefault();
          const targetId = e.target.getAttribute("href");
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            const offsetPosition =
              targetElement.offsetTop - App.config.SMOOTH_SCROLL_OFFSET;
            window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            App.toggleMobileMenu(true);
          }
        }
      });

      // Scroll general
      window.addEventListener("scroll", App.handleScroll);

      // Botón "Volver arriba"
      backToTopBtn.addEventListener("click", () =>
        window.scrollTo({ top: 0, behavior: "smooth" })
      );

      // Formularios
      if (contactForm)
        contactForm.addEventListener("submit", App.handleContactFormSubmit);
      if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const emailInput = e.target.querySelector('input[type="email"]');
          if (emailInput.value) {
            alert("¡Gracias por suscribirte!");
            emailInput.value = "";
          }
        });
      }

      // Input de fecha
      if (dateInput) {
        dateInput.min = new Date().toISOString().split("T")[0];
        dateInput.addEventListener("focus", () => (dateInput.type = "date"));
        dateInput.addEventListener("blur", () => {
          if (!dateInput.value) dateInput.type = "text";
        });
      }

      // Horarios dinámicos
      if (dateInput && timeInput) {
        dateInput.addEventListener("change", App.updateAvailableTimes);
      }

      // Animaciones en scroll (AOS)
      // Eliminado IntersectionObserver personalizado para AOS (redundante).
      // AOS se maneja únicamente mediante la librería y data-attributes.

      // Animación del contador
      if (badgeNumber) {
        const counterObserver = new IntersectionObserver(
          (entries, observer) => {
            if (entries[0].isIntersecting) App.animateCounter(observer);
          },
          { threshold: 0.8 }
        );
        counterObserver.observe(badgeNumber);
      }

      // Easter Egg
      if (logo) {
        let clickCount = 0;
        logo.addEventListener("click", () => {
          clickCount++;
          if (clickCount === EASTER_EGG_CLICKS) {
            alert("🎉 ¡Has descubierto el Easter Egg de La Diarquía! 🎉");
            clickCount = 0;
          }
        });
      }
    },

    // --- 5. INICIALIZACIÓN ---
    init() {
      App.bindEvents();
      console.log(
        "%c La Diarquía - Barbería Premium ",
        "font-size: 20px; color: #d4a574; font-weight: bold;"
      );
    },
  };

  App.init();
});
