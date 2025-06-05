gsap.registerPlugin(ScrollTrigger);

let sections = gsap.utils.toArray(".panel");

// Store the main horizontal scroll animation
const horizontalScroll = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none", // IMPORTANT: use "none" for linear scrolling linked to scrollbar
    scrollTrigger: {
        trigger: "#main-container",
        pin: true, // Pin the container while scrolling horizontally
        scrub: 1, // Smooth scrubbing, takes 1 second to "catch up" to the scrollbar
        snap: {
            snapTo: 1 / (sections.length - 1), // Snap to the start of each section
            duration: { min: 0.2, max: 0.3 }, // Snap animation duration
            delay: 0.1, // Delay before snapping
            ease: "power1.inOut"
        },
        // Base vertical scrolling on how wide the container is so it feels more natural.
        end: () => "+=" + document.querySelector("#main-container").offsetWidth
    }
});

// Parallax for Hero Section Refined
// Kill existing tweens for these elements to avoid conflicts if re-running
gsap.killTweensOf([".parallax-bg", ".parallax-mid", ".parallax-fg"]);

gsap.to(".parallax-bg", {
    xPercent: -20, // Move 20% of its own width to the left
    scale: 1.1,
    opacity: 0.8,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        containerAnimation: horizontalScroll,
        start: "left right",
        end: "left left",
        scrub: 1.5 // Slightly slower scrub for smoother effect
    }
});

gsap.to(".parallax-mid", {
    xPercent: 15, // Move 15% to the right
    // yPercent: -5, // Subtle vertical movement (optional)
    scale: 1.05,
    opacity: 0.9,
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        containerAnimation: horizontalScroll,
        start: "left right",
        end: "left left",
        scrub: 1
    }
});
// Remove the old specific y-only animation for .parallax-mid to avoid conflict
// gsap.killTweensOf(".parallax-mid", "y"); // Or ensure the above replaces all aspects.

gsap.to(".parallax-fg", {
    xPercent: -10, // Move 10% to the left
    // yPercent: 5, // Subtle vertical movement (optional)
    opacity: 0.7, // Could fade slightly to enhance depth
    ease: "none",
    scrollTrigger: {
        trigger: ".hero-section",
        containerAnimation: horizontalScroll,
        start: "left right",
        end: "left left",
        scrub: 0.5 // Faster scrub for foreground
    }
});

// Hero Section Intro Message Reveal
const introSpans = gsap.utils.toArray('.intro-message span');
const heroContentTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: ".hero-section",
        containerAnimation: horizontalScroll, // Assumes 'horizontalScroll' is the main scroll tween
        start: "left center-=10%", // Start when hero section is a bit left of center
        end: "left left+=20%", // End when hero section is a bit past left edge
        toggleActions: "play resume resume reverse", // Play, then resume if interrupted, reverse if scrolling back
        // scrub: true, // Could also scrub it, but toggleActions gives a nice once-off feel
    }
});

heroContentTimeline.staggerTo(introSpans, 0.5, {
    opacity: 1,
    y: 0,
    ease: "power2.out"
}, 0.3); // Stagger by 0.3 seconds

// About Me Section Animations
const aboutSection = document.querySelector('.about-section');
const aboutTitle = aboutSection.querySelector('.about-content-wrapper h2');
const aboutBlocks = gsap.utils.toArray('.about-block');

const aboutTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: ".about-section",
        containerAnimation: horizontalScroll, // Link to main horizontal scroll
        start: "left center-=15%", // Start animation when section is approaching center
        end: "left left+=30%", // Fully visible by this point
        toggleActions: "play resume resume reverse",
        // scrub: true, // Optional: scrub the animation
    }
});

// Animate the main title
aboutTimeline.to(aboutTitle, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out"
});

// Stagger animate the content blocks
aboutTimeline.to(aboutBlocks, {
    opacity: 1,
    x: 0,
    duration: 0.5,
    stagger: 0.2, // Stagger the start of each block's animation
    ease: "power1.out"
}, "-=0.3"); // Start this slightly before the title animation finishes

const aboutDecoration = document.querySelector('.about-parallax-decoration');
if (aboutDecoration) {
    gsap.to(aboutDecoration, {
        xPercent: 150, // Move significantly across the screen
        rotate: 45,    // Gentle rotation
        ease: "none",
        scrollTrigger: {
            trigger: ".about-section",
            containerAnimation: horizontalScroll,
            start: "left right", // When section starts entering from right
            end: "right left",   // When section has fully exited to the left
            scrub: 2
        }
    });
}

// Magna Opera (Projects) Section Animations
const projectsSection = document.querySelector('.projects-section');
const projectsTitle = projectsSection.querySelector('.projects-content-wrapper h2');
const projectsContainer = projectsSection.querySelector('.projects-container');
const projectModules = gsap.utils.toArray('.project-module');

// Animate the main title of Projects section
gsap.to(projectsTitle, {
    opacity: 1,
    y: 0,
    ease: "power2.out",
    scrollTrigger: {
        trigger: projectsSection,
        containerAnimation: horizontalScroll, // Linked to main page scroll
        start: "left center-=20%", // When the projects section panel starts entering view
        toggleActions: "play none none reverse"
    }
});

if (projectModules.length > 0) { // Ensure there are projects to animate
    // Timeline for scrolling the .projects-container horizontally
    const projectsInternalTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".projects-section", // The entire panel
            containerAnimation: horizontalScroll, // This animation is controlled by the main page's horizontal scroll
            pin: true, // Pin the .projects-section panel while its internal content scrolls
            scrub: 1, // Smooth scrubbing
            start: "left left", // Start when the .projects-section aligns with the left of the viewport
            end: "+=1500", // Allocate 1500px of main scroll to this section's internal scroll
                           // Adjust this value based on number of projects and desired scroll feel
            snap: {
                snapTo: (value) => {
                    // value is the progress of this ScrollTrigger (0 to 1)
                    // Map this progress to the start of each project module.
                    const numModules = projectModules.length;
                    if (numModules <= 1) return 0; // If only one module, snap to its start
                    // Create an array of snap points (0, 1/(numModules-1), 2/(numModules-1), ..., 1)
                    // The original formula i / (numModules - 1) is for when you want to snap to the start of each.
                    // If you want to snap to positions that represent each module taking up equal space in the progress,
                    // it should be more like i / numModules for the start of each, and then map that.
                    // For snapping to each item, it's just 1 / (numModules - 1) for the step.
                    let snapPoints = projectModules.map((module, i) => i / (numModules - 1));
                    return gsap.utils.snap(snapPoints, value);
                },
                duration: { min: 0.2, max: 0.3 },
                delay: 0.05,
                ease: "power1.inOut"
            },
            // markers: {startColor: "green", endColor: "red", indent: 40} // For debugging this timeline
        }
    });

    // Animate the .projects-container to move horizontally
    projectsInternalTimeline.to(projectsContainer, {
        x: () => -(projectsContainer.scrollWidth - projectsContainer.clientWidth) + "px", // Scroll to the end of the container
        ease: "none" // Linear movement, as scrub and snap handle the feel
    });

    // Reveal animation for each project module as it comes into view
    projectModules.forEach((module, index) => {
        // Ensure initial state is set (already done by CSS, but can be reinforced here if needed)
        // gsap.set(module, { opacity: 0, y: 30, scale: 0.98 });

        gsap.to(module, {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power2.out",
            duration: 0.5,
            scrollTrigger: {
                trigger: module,
                containerAnimation: projectsInternalTimeline, // Animate based on the progress of projectsInternalTimeline
                start: "left 80%", // When left edge of module is at 80% of projects-section viewport
                end: "right 20%",  // When right edge of module is at 20% of projects-section viewport
                                   // This means it's mostly visible in the "active" area
                toggleActions: "play reverse play reverse", // Play when entering, reverse when leaving either side
                // markers: {startColor: "cyan", endColor: "orange", indent: index * 20} // For debugging module reveals
            }
        });
    });

    // Add these new parallax effects within the 'if (projectModules.length > 0)' block,
    // or ensure 'projectsInternalTimeline' is globally accessible if defined outside.
    // For safety, checking window.projectsInternalTimeline as it's defined in the same file.
    if (window.projectsInternalTimeline) {
        // VIBEZSUME Parallax Animations
        const vibezsumeModule = document.querySelector("#vibezsume");
        if (vibezsumeModule) {
            gsap.to("#vibezsume .p-layer-1", {
                xPercent: -50, yPercent: 30, rotation: -30,
                ease: "none",
                scrollTrigger: {
                    trigger: vibezsumeModule,
                    containerAnimation: projectsInternalTimeline,
                    start: "left right", end: "right left", scrub: 1.5
                }
            });
            gsap.to("#vibezsume .p-layer-2", {
                xPercent: 40, yPercent: -20, rotation: 25,
                ease: "none",
                scrollTrigger: {
                    trigger: vibezsumeModule,
                    containerAnimation: projectsInternalTimeline,
                    start: "left right", end: "right left", scrub: 1
                }
            });
            gsap.to("#vibezsume .p-layer-3", {
                xPercent: -30, yPercent: 50, scale: 1.2,
                ease: "none",
                scrollTrigger: {
                    trigger: vibezsumeModule,
                    containerAnimation: projectsInternalTimeline,
                    start: "left right", end: "right left", scrub: 2
                }
            });
        }

        // SKlearn Playground Parallax Animations
        const sklearnModule = document.querySelector("#sklearn-playground");
        if (sklearnModule) {
            gsap.to("#sklearn-playground .p-layer-1", {
                xPercent: 60, yPercent: -40, rotation: 45,
                ease: "none",
                scrollTrigger: {
                    trigger: sklearnModule,
                    containerAnimation: projectsInternalTimeline,
                    start: "left right", end: "right left", scrub: 1.2
                }
            });
            gsap.to("#sklearn-playground .p-layer-2", {
                xPercent: -50, yPercent: 20, rotation: -35, scale:0.8,
                ease: "none",
                scrollTrigger: {
                    trigger: sklearnModule,
                    containerAnimation: projectsInternalTimeline,
                    start: "left right", end: "right left", scrub: 0.8
                }
            });
            gsap.to("#sklearn-playground .p-layer-3", {
                xPercent: 20, yPercent: -10, rotation: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: sklearnModule,
                    containerAnimation: projectsInternalTimeline,
                    start: "left right", end: "right left", scrub: 1.8
                }
            });
        }
    } else {
        console.warn("projectsInternalTimeline not found. Parallax for VIBEZSUME & SKlearn Playground will not be initialized.");
    }
}

// Contact Section Animation
const contactWrapper = document.querySelector('.contact-content-wrapper');
if (contactWrapper) { // Check if element exists
    gsap.to(contactWrapper, {
        opacity: 1,
        y: 0,
        ease: "power2.out",
        duration: 0.8,
        scrollTrigger: {
            trigger: ".contact-section", // The panel itself
            containerAnimation: horizontalScroll, // Link to main horizontal scroll
            start: "left center-=10%", // Start when section is approaching center
            toggleActions: "play none none reverse" // Play once when entering, reverse if scrolling back out
        }
    });
}
