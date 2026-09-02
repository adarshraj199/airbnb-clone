document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.2 // triggers when 20% of the row is visible
    });

    document.querySelectorAll(".slide-left, .slide-right").forEach(el => {
        observer.observe(el);
    });
});