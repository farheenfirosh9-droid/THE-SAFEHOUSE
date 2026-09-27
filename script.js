/**
 * Farheen F Portfolio Website JS Logic
 * Features:
 * - Dynamic Cursor Glow Tracker
 * - Mobile navigation menu toggle
 * - Sticky header styling & ScrollSpy active links
 * - Auto-typing subtitle animation
 * - Scroll Observer for animations (reveals & skill bars progress)
 * - Portfolio Gallery Filters
 * - PDF Certificate Uploader & viewer modal
 * - Contact form submissions mockup
 * - Back to top scroll handler
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Dynamic Cursor Glow Tracker
    // ==========================================
    const cursorGlow = document.getElementById("cursor-glow");
    
    document.addEventListener("mousemove", (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        }
    });

    // ==========================================
    // 2. Sticky Header Scroll Indicator
    // ==========================================
    const header = document.getElementById("navbar-header");
    const backToTopBtn = document.getElementById("back-to-top");
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        if (window.scrollY > 400) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    // ==========================================
    // 3. Mobile Navigation Menu Toggle
    // ==========================================
    const navToggle = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.toggle("active");
            const icon = navToggle.querySelector("i");
            if (navMenu.classList.contains("active")) {
                icon.classList.replace("fa-bars-staggered", "fa-xmark");
            } else {
                icon.classList.replace("fa-xmark", "fa-bars-staggered");
            }
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                const icon = navToggle.querySelector("i");
                icon.classList.replace("fa-xmark", "fa-bars-staggered");
            });
        });
    }

    // ==========================================
    // 4. Auto-Typing Subtitle Animation
    // ==========================================
    const typedTextSpan = document.getElementById("typed-text");
    const roles = ["Web Developer", "AI Enthusiast", "Prompt Engineer"];
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newWordDelay = 2000;
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < roles[roleIndex].length) {
            if (typedTextSpan) {
                typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
            }
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (typedTextSpan) {
                typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
            }
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            roleIndex++;
            if (roleIndex >= roles.length) roleIndex = 0;
            setTimeout(type, typingSpeed + 500);
        }
    }

    if (typedTextSpan) {
        setTimeout(type, newWordDelay);
    }

    // ==========================================
    // 5. ScrollSpy & Intersection Observers
    // ==========================================
    const sections = document.querySelectorAll("section");
    
    // ScrollSpy active link updates
    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 200; // Offset for navbar

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });

    // Reveal Elements on Scroll
    const revealElements = document.querySelectorAll(".reveal");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                
                // If it is a skills card, trigger skill bar animation
                if (entry.target.classList.contains("skills-card")) {
                    animateSkillBars(entry.target);
                }
                
                revealObserver.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Animation for Skill Bars
    function animateSkillBars(skillsCard) {
        const skillFills = skillsCard.querySelectorAll(".skill-bar-fill");
        skillFills.forEach(fill => {
            const targetPercent = fill.getAttribute("data-percent");
            fill.style.width = `${targetPercent}%`;
        });
    }

    // ==========================================
    // 6. Portfolio Gallery Filtering
    // ==========================================
    const filterButtons = document.querySelectorAll(".gallery-btn");
    const galleryItems = document.querySelectorAll(".gallery-item");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active class from all
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Add to current
            button.classList.add("active");
            
            const filterValue = button.getAttribute("data-filter");

            galleryItems.forEach(item => {
                if (filterValue === "all" || item.getAttribute("data-category") === filterValue) {
                    item.classList.remove("hide");
                    // Simple animation reflow
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 50);
                } else {
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.8)";
                    setTimeout(() => {
                        item.classList.add("hide");
                    }, 300);
                }
            });
        });
    });

    // ==========================================
    // 7. Interactive Certificate PDF Uploader & Viewer Modal
    // ==========================================
    const certUpload = document.getElementById("cert-upload");
    const uploadFeedback = document.getElementById("upload-feedback");
    const certificatesGrid = document.getElementById("certificates-grid");
    
    // Modal Selectors
    const certModal = document.getElementById("cert-modal");
    const modalOverlay = document.getElementById("cert-modal-overlay");
    const modalClose = document.getElementById("cert-modal-close");
    const modalTitle = document.getElementById("cert-modal-title");
    const modalIframe = document.getElementById("cert-iframe");
    const pdfFallback = document.getElementById("pdf-viewer-fallback");
    const pdfFallbackFilename = document.getElementById("pdf-fallback-filename");
    const modalDownloadBtn = document.getElementById("modal-download-btn");

    // Local DB array stored in localStorage
    let localCertificates = JSON.parse(localStorage.getItem("uploaded_certificates")) || [];

    // Preloaded simulation PDFs
    const defaultPdfs = {
        "python-cert": { title: "Python Programming Mastery Certificate", file: "python-mastery.pdf" },
        "web-cert": { title: "Responsive Web Design Certificate", file: "responsive-web.pdf" },
        "prompt-cert": { title: "Advanced Prompt Engineering Certificate", file: "prompt-engineering.pdf" }
    };

    // Load Local Certificates from localDB on startup
    renderLocalCertificates();

    // Event delegation for Certificate view buttons
    if (certificatesGrid) {
        certificatesGrid.addEventListener("click", (e) => {
            const viewBtn = e.target.closest(".view-cert-btn");
            if (!viewBtn) return;
            
            const certCard = viewBtn.closest(".cert-card");
            const certId = certCard.getAttribute("data-id");
            const type = viewBtn.getAttribute("data-type");

            if (type === "default") {
                const fileKey = viewBtn.getAttribute("data-file");
                const certInfo = defaultPdfs[fileKey];
                
                openModal(certInfo.title, "", certInfo.file);
            } else if (type === "local") {
                const certObj = localCertificates.find(c => c.id === certId);
                if (certObj) {
                    openModal(certObj.title, certObj.data, certObj.name);
                }
            }
        });
    }

    // Handle Local File Upload
    if (certUpload) {
        certUpload.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            if (file.type !== "application/pdf") {
                showUploadFeedback("Please select a valid PDF certificate file.", "error");
                return;
            }

            // Limit sizes to prevent localStorage limits (1.5MB max for base64)
            if (file.size > 1.5 * 1024 * 1024) {
                showUploadFeedback("File is too large. Choose a certificate PDF under 1.5MB.", "error");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const base64Data = event.target.result;
                const newCert = {
                    id: "local-" + Date.now(),
                    title: file.name.replace(".pdf", "").replace(/[-_]/g, " "),
                    name: file.name,
                    data: base64Data,
                    org: "Local Uploaded Certificate",
                    date: getCurrentMonthYear()
                };

                localCertificates.push(newCert);
                localStorage.setItem("uploaded_certificates", JSON.stringify(localCertificates));
                
                addCertificateCardDOM(newCert);
                showUploadFeedback("Certificate uploaded and added successfully!", "success");
                certUpload.value = ""; // Clear input
            };
            
            reader.onerror = function() {
                showUploadFeedback("Failed to read the file content.", "error");
            };

            reader.readAsDataURL(file);
        });
    }

    function showUploadFeedback(message, status) {
        if (uploadFeedback) {
            uploadFeedback.textContent = message;
            uploadFeedback.className = `upload-feedback ${status}`;
            setTimeout(() => {
                uploadFeedback.textContent = "";
                uploadFeedback.className = "upload-feedback";
            }, 4000);
        }
    }

    function getCurrentMonthYear() {
        const date = new Date();
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }

    function renderLocalCertificates() {
        localCertificates.forEach(cert => {
            addCertificateCardDOM(cert);
        });
    }

    function addCertificateCardDOM(cert) {
        if (!certificatesGrid) return;

        const card = document.createElement("div");
        card.className = "cert-card glass-card reveal revealed";
        card.setAttribute("data-id", cert.id);
        
        card.innerHTML = `
            <div class="cert-thumbnail-wrapper">
                <div class="cert-badge-visual">
                    <i class="fa-solid fa-file-pdf"></i>
                </div>
                <span class="cert-tag">Uploaded</span>
            </div>
            <div class="cert-content">
                <h3>${cert.title}</h3>
                <p class="cert-org"><i class="fa-solid fa-building-columns"></i> ${cert.org}</p>
                <p class="cert-date"><i class="fa-solid fa-calendar-alt"></i> ${cert.date}</p>
                <div class="cert-buttons">
                    <button class="btn btn-sm btn-primary view-cert-btn" data-type="local"><i class="fa-solid fa-eye"></i> View</button>
                    <a href="${cert.data}" class="btn btn-sm btn-outline download-cert-btn" download="${cert.name}"><i class="fa-solid fa-download"></i> Download</a>
                </div>
            </div>
        `;
        certificatesGrid.appendChild(card);
    }

    // Modal Handling Logic
    function openModal(title, pdfDataUrl, filename) {
        if (!certModal) return;
        
        modalTitle.textContent = title;
        pdfFallbackFilename.textContent = filename;
        
        // Setup download buttons
        if (pdfDataUrl) {
            modalDownloadBtn.href = pdfDataUrl;
        } else {
            modalDownloadBtn.href = "#";
        }

        // Attempt Iframe load if modern system allows blobs or base64
        if (pdfDataUrl) {
            modalIframe.src = pdfDataUrl;
            modalIframe.style.display = "block";
            pdfFallback.style.display = "none";
        } else {
            // Mock preloaded PDFs
            modalIframe.src = "";
            modalIframe.style.display = "none";
            pdfFallback.style.display = "flex";
        }

        certModal.classList.add("active");
        document.body.style.overflow = "hidden"; // Disable background scrolls
    }

    function closeModal() {
        if (!certModal) return;
        certModal.classList.remove("active");
        modalIframe.src = "";
        document.body.style.overflow = "auto";
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
    
    // Close modal on escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && certModal && certModal.classList.contains("active")) {
            closeModal();
        }
    });

    // ==========================================
    // 8. Contact Form Handling
    // ==========================================
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("form-name").value;
            const email = document.getElementById("form-email").value;
            const subject = document.getElementById("form-subject").value;
            const message = document.getElementById("form-message").value;

            // Submit Button status update
            const submitBtn = document.getElementById("form-submit-btn");
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

            // Simulate form submission API call
            setTimeout(() => {
                // Save locally to simulate inbox logger
                const messages = JSON.parse(localStorage.getItem("contact_messages")) || [];
                messages.push({
                    name, email, subject, message, date: new Date().toISOString()
                });
                localStorage.setItem("contact_messages", JSON.stringify(messages));

                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Show Success status
                if (formStatus) {
                    formStatus.textContent = "Thank you! Your message has been sent successfully.";
                    formStatus.className = "form-status-message success";
                    contactForm.reset();

                    setTimeout(() => {
                        formStatus.textContent = "";
                        formStatus.className = "form-status-message";
                    }, 5000);
                }
            }, 1500);
        });
    }

    // ==========================================
    // 9. Project Demo triggers
    // ==========================================
    const demoTriggers = document.querySelectorAll(".demo-trigger");
    demoTriggers.forEach(trigger => {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            alert("This Live Demo is a simulated portfolio placeholder. Academic source code can be reviewed on GitHub.");
        });
    });

    // ==========================================
    // 10. Resume Download Trigger
    // ==========================================
    const downloadResumeBtn = document.getElementById("btn-download-resume");
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener("click", () => {
            alert("Your request to download Farheen F's Resume was triggered! Downloading file: farheen-resume.pdf");
        });
    }

    const heroBtnResume = document.getElementById("hero-btn-resume");
    if (heroBtnResume) {
        heroBtnResume.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById("resume").scrollIntoView({ behavior: "smooth" });
        });
    }
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("light-theme");

            if (document.body.classList.contains("light-theme")) {
                themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
            }
        });
    }
});

