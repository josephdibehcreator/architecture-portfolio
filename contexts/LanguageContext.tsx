'use client'

import React, { createContext, useContext, useState, useEffect, useLayoutEffect, useMemo } from 'react'

type Language = 'en' | 'fr'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    // Footer
    footer_description: 'Architectural excellence for the modern world. Creating spaces that inspire and endure.',
    studio: 'Studio',
    contact: 'Contact',
    social: 'Social',
    copyright: '© 2026 Projects by Joseph Dibeh. All rights reserved.',
    privacy_policy: 'Privacy Policy',
    terms_of_service: 'Terms of Service',
    cookie_policy: 'Cookie Policy',
    paris: 'Paris',
    french_riviera: 'French Riviera',
    beirut: 'Beirut',
    // Navigation
    nav_home: 'Home',
    nav_about: 'About',
    nav_services: 'Services',
    nav_projects: 'Projects',
    nav_others: 'Others',
    nav_careers: 'Careers',
    nav_blogs_news: 'Blogs & News',
    nav_inquire: 'Inquire',
    // Hero Section
    hero_badge: '01. ABOUT',
    hero_title_part1: 'Defining space through',
    hero_title_part2: 'precision',
    hero_title_part3: 'and form.',
    hero_description: 'We craft environments that merge structural integrity with aesthetic purity. Every line drawn serves a purpose; every void creates meaning.',
    hero_cta: 'View Selected Works',
    hero_scroll: 'SCROLL TO EXPLORE',
    // Projects Section
    projects_label: ' Portfolio',
    projects_title: 'Selected Works',
    // Company Stats Section
    stats_badge: '02. Studio Snapshot',
    stats_title: 'Measured by places, projects, and partnerships',
    stats_description:
      'A focused architecture practice delivering projects across France and Lebanon with a selective, design-led approach.',
    // Career Section
    career_label: ' Team',
    career_title: 'Join the Studio',
    career_description: 'We are always looking for visionary minds to join our team. If you are passionate about detail and design, we want to hear from you.',
    career_job_intern_interior: 'Intern in Interior Design',
    career_job_intern_graphic: 'Intern in Graphic Designer',
    career_job_details_fulltime: 'Full-time',
    career_job_details_months: 'Months',
    career_job_details_paris: 'Paris',
    career_job_details_france: 'France',
    career_job_details_hybrid: 'Hybrid',
    career_job_details_remote: 'Remote',
    career_modal_apply: 'Apply for Position',
    career_modal_subtitle: 'Join our studio and contribute to defining spaces through precision and form.',
    career_modal_role_title: 'Role Description',
    career_modal_role_text: 'We are seeking a dedicated intern to assist with ongoing projects. The role involves participating in concept development, 3D modeling, and technical drawing.',
    career_modal_requirements_title: 'Requirements',
    career_modal_requirement_1: 'Current student or recent graduate in relevant field',
    career_modal_requirement_2: 'Strong portfolio demonstrating conceptual thinking',
    career_modal_requirement_3: 'Proficiency in relevant software (AutoCAD, Adobe Suite, etc.)',
    career_modal_requirement_4: 'Passion for detail and architectural craftsmanship',
    career_form_fullname: 'Full Name *',
    career_form_email: 'Email Address *',
    career_form_motivation: 'Motivation Letter *',
    career_form_motivation_placeholder: 'Why do you want to join Joseph Dibeh Studio?',
    career_form_cv: 'Upload CV (PDF) *',
    career_form_portfolio: 'Portfolio (PDF)',
    career_form_selected: 'Selected:',
    career_form_submit: 'Submit Application',
    career_form_submitting: 'Submitting...',
    career_form_cv_required: 'CV file is required',
    career_form_cv_pdf: 'CV must be a PDF file',
    career_form_portfolio_pdf: 'Portfolio must be a PDF file',
    career_form_file_size: 'file size is invalid',
    career_form_error: 'Failed to submit application. Please try again.',
    career_form_error_generic: 'An error occurred. Please try again later.',
    career_thankyou: "Thank you for your application! We'll review your submission and get back to you soon.",
    // Inquiry Section
    inquiry_label: 'Contact',
    inquiry_title: 'Project Inquiry',
    inquiry_step_identity: 'Identity',
    inquiry_step_context: 'Context',
    inquiry_step_path: 'Path',
    inquiry_step_review: 'Review',
    inquiry_step1_title: 'Who are we building for?',
    inquiry_step1_subtitle: "Let's start with your identity.",
    inquiry_client_private: 'Private Client',
    inquiry_client_business: 'Business / Developer',
    inquiry_form_firstname: 'First Name *',
    inquiry_form_lastname: 'Surname *',
    inquiry_form_email: 'Email Address *',
    inquiry_form_phone: 'Phone Number',
    inquiry_form_address: 'Project Address',
    inquiry_form_services: 'Services Required (Multi-select)',
    inquiry_form_budget: 'Budget (€)',
    inquiry_form_timeline: 'Timeline',
    inquiry_form_timeline_asap: 'ASAP',
    inquiry_form_timeline_3m: '3 Months',
    inquiry_form_timeline_6m: '6 Months',
    inquiry_form_timeline_1y: '1 Year+',
    inquiry_form_surface: 'Surface (m²)',
    inquiry_form_description: 'Description',
    inquiry_form_description_placeholder: 'Tell us more about your vision...',
    inquiry_upload_drag: 'Drag & Drop plans or inspiration (PDF, Images)',
    inquiry_step2_title: 'Project Context',
    inquiry_step2_subtitle: 'Defining the scope and constraints.',
    inquiry_step3_title: 'Choose your path',
    inquiry_step3_subtitle: 'How can we best assist you today?',
    inquiry_path_general_title: 'General Inquiry',
    inquiry_path_general_desc: 'I want to discuss a long-term project or get a custom quote for my property.',
    inquiry_path_general_footer: 'Free Assessment',
    inquiry_path_consult_title: 'Expert Consultation',
    inquiry_path_consult_desc: 'I need immediate advice, feasibility checks, or a design brainstorm session.',
    inquiry_path_consult_footer: 'Paid Session • From €100',
    inquiry_review_title: 'Review Inquiry',
    inquiry_review_subtitle: 'Ready to send your project details.',
    inquiry_review_client: 'Client',
    inquiry_review_type: 'Type',
    inquiry_review_services: 'Services',
    inquiry_review_budget: 'Budget',
    inquiry_review_timeline: 'Timeline',
    inquiry_review_surface: 'Surface',
    inquiry_review_address: 'Address',
    inquiry_review_description: 'Description',
    inquiry_consult_duration: 'Duration',
    inquiry_consult_duration_60: '1 hour',
    inquiry_consult_duration_120: '2 hours',
    inquiry_consult_duration_180: '3 hours',
    inquiry_consult_roadmap: 'Roadmap Report',
    inquiry_consult_roadmap_desc: 'Receive a detailed written report after the consultation',
    inquiry_consult_format: 'Format',
    inquiry_consult_format_online: 'Online',
    inquiry_consult_format_onsite: 'On-site',
    inquiry_consult_billing: 'Billing address same as project address',
    inquiry_consult_billing_title: 'Billing',
    inquiry_consult_schedule: 'Schedule Consultation',
    inquiry_consult_schedule_pay: 'Schedule & Pay',
    inquiry_consult_session_details: 'Session Details',
    inquiry_consult_select_date: 'Select Date (Weekdays 10-12)',
    inquiry_consult_select_time: 'Select Time',
    inquiry_consult_prev_week: 'Previous Week',
    inquiry_consult_next_week: 'Next Week',
    inquiry_consult_roadmap_title: 'The Roadmap Report',
    inquiry_consult_roadmap_price: 'Written summary & action plan (+€100)',
    inquiry_consult_recommended: 'Recommended',
    inquiry_consult_format_online_label: 'Online (Google Meet)',
    inquiry_consult_format_onsite_label: 'On-Site (Paris Area)',
    inquiry_btn_back: 'Back',
    inquiry_btn_continue: 'Continue',
    inquiry_btn_continue_context: 'Continue to Project Context',
    inquiry_btn_saving: 'Saving...',
    inquiry_btn_submit: 'Submit Inquiry',
    inquiry_btn_proceed_payment: 'Proceed to Payment',
    inquiry_btn_loading: 'Loading...',
    inquiry_error_save: 'Failed to save',
    inquiry_error_payment: 'Failed to create payment session',
    inquiry_error_required_fields: 'Please fill in all required fields',
    inquiry_error_identity: 'Failed to save identity information',
    inquiry_error_context: 'Failed to save project context',
    inquiry_error_path: 'Failed to save path selection',
    inquiry_error_submit: 'Failed to submit inquiry',
    inquiry_error_id_not_found: 'Inquiry ID not found. Please go back to step 1.',
    inquiry_error_id_not_found_simple: 'Inquiry ID not found',
    inquiry_error_select_path: 'Please select a path',
    inquiry_error_select_datetime: 'Please select a date and time',
    inquiry_error_generic: 'An error occurred. Please try again.',
    inquiry_success_submitted: 'Inquiry submitted successfully! We will contact you shortly.',
    // Services List
    services_title: 'Our Services',
    services_view_all: 'View All Services',
    services_label: ' Expertise',
    services_coming_soon: 'COMING SOON',
    // Testimonials Section
    testimonials_label: ' Clients',
    testimonials_title: 'Testimonials',
    testimonials_modal_title: 'Add Your Review',
    testimonials_modal_description: 'Share your experience working with us.',
    testimonials_form_fullname: 'Full Name *',
    testimonials_form_email: 'Email *',
    testimonials_form_phone: 'Phone Number',
    testimonials_form_project_type: 'Project Type',
    testimonials_form_review: 'Review *',
    testimonials_form_placeholder_name: 'Jane Doe',
    testimonials_form_placeholder_email: 'jane@example.com',
    testimonials_form_placeholder_phone: '+1234567890',
    testimonials_form_placeholder_project: 'e.g. Residential Renovation',
    testimonials_form_placeholder_review: 'Describe your experience...',
    testimonials_btn_submit: 'Submit Review',
    testimonials_btn_submitting: 'Submitting...',
    testimonials_btn_add_review: 'Add your review',
    testimonials_loading: 'Loading testimonials...',
    testimonials_empty: 'No testimonials yet. Be the first to share your experience!',
    testimonials_error_submit: 'Failed to submit testimonial. Please try again.',
    testimonials_error_generic: 'An error occurred. Please try again later.',
    testimonials_thankyou: 'Thank you for your review! We appreciate your feedback.',
    testimonials_client_fallback: 'Client',
    testimonials_show_more: 'Show more',
    // Thank You Message
    thankyou_title: 'Thank You!',
    thankyou_close: 'Close',
    // News Section
    news_label: 'Thoughts & Insights',
    news_title: 'Blog',
    news_read_article: 'Read Article',
    // About Page
    about_intro_text: 'We operate at the intersection of precision and emotion. Our studio is dedicated to creating spaces that are not just built, but crafted—where every line serves a function and every void holds meaning.',
    founder_quote_1: 'Architecture is a language of responsibility. When we draw a line, we are making a promise to the landscape and the community. My journey has been driven by a desire to merge technical exactitude with artistic intuition.',
    founder_quote_2: 'We don\'t just design buildings; we curate experiences. Every project is an opportunity to redefine boundaries and create something truly lasting. Thank you for being part of our story.',
    founder_name: 'Joseph Dibeh',
    founder_role: 'Founder & CEO',
    mission_label: 'Our Mission',
    mission_title: 'Precision & Form',
    mission_description: 'To deliver architectural excellence through a rigorous attention to detail. We strive to solve complex challenges with simple, elegant solutions that elevate the human experience.',
    vision_label: 'Our Vision',
    vision_title: 'Timeless Spaces',
    vision_description: 'We envision a built environment that respects its context while boldly looking forward. Our goal is to create structures that age gracefully and remain relevant for generations.',
    philosophy_label: 'Our Philosophy',
    philosophy_title: 'Meaningful Void',
    philosophy_description: 'Architecture is as much about the space between walls as the walls themselves. We believe in the poetry of the void, crafting light and shadow to define the atmosphere of a place.',
    // Services Header
    services_header_label: '01. APPROACH',
    services_header_title_part1: 'Disciplines of',
    services_header_title_part2: 'design',
    services_header_title_part3: '& form.',
    services_header_description: 'We provide a holistic approach to spatial creation, merging architectural rigor with interior warmth. From initial feasibility studies to the final handover, every detail is curated.',
    // Methodology
    methodology_label: '03. Methodology',
    methodology_title: 'From Concept to Reality',
    methodology_description: 'A standardized, rigorous process ensuring clarity and control at every stage of the project lifecycle. We guide you from the first sketch to the final handover.',
    methodology_phase1_title: 'Dreaming & Designing Your Space',
    methodology_phase1_description: 'This is where your ideas take shape. We transform your needs into a concrete, beautiful concept.',
    methodology_phase1_task1_name: 'Site Survey',
    methodology_phase1_task1_desc: 'We get to know your space. We visit your home to take precision measurements and check the "health" of the building (walls, plumbing, and electrics) so there are no hidden surprises later.',
    methodology_phase1_task2_name: 'The Sketch',
    methodology_phase1_task2_desc: 'We explore the possibilities. I propose different layout options and quick sketches to see how we can best optimize your space.',
    methodology_phase1_task3_name: 'The Concept',
    methodology_phase1_task3_desc: 'We define the style. We choose the overall mood, colors, and materials together using moodboards to make sure we are on the same page aesthetically.',
    methodology_phase1_task4_name: 'The Final Design',
    methodology_phase1_task4_desc: 'We finalize the details. I create the final technical plans and 3D renders. You will see exactly what your future interior will look like, down to the very last detail.',
    methodology_phase2_title: 'Planning for Perfection',
    methodology_phase2_description: 'No room for guesswork. We organize everything to ensure the construction is stress-free and stays on budget.',
    methodology_phase2_task1_name: 'Admin & Permissions',
    methodology_phase2_task1_desc: 'We handle the paperwork. If your project requires changes to windows or the exterior, I prepare and submit the "Déclaration Préalable" to the local town hall for you.',
    methodology_phase2_task2_name: 'Technical Folder',
    methodology_phase2_task2_desc: 'We create the "Instruction Manual." I write a highly detailed technical description for the builders. This ensures you get fixed, accurate prices that won\'t change halfway through.',
    methodology_phase2_task3_name: 'Choosing Builders',
    methodology_phase2_task3_desc: 'We find the right team. I help you analyze quotes from different contractors and negotiate to ensure you get the best experts for your specific budget.',
    methodology_phase3_title: 'Watching Your Vision Become Reality',
    methodology_phase3_description: 'The transformation begins. I act as your eyes and ears on-site until the day you move in.',
    methodology_phase3_task1_name: 'Site Supervision',
    methodology_phase3_task1_desc: 'We manage the work. I visit the site every week to ensure the quality matches the plans. You receive a weekly progress report so you can stay updated from the comfort of your sofa.',
    methodology_phase3_task2_name: 'The Handover',
    methodology_phase3_task2_desc: 'We check every corner. Once the work is done, we do a final walkthrough together. I make sure every finish is perfect before you officially take back the keys.',
    methodology_phase3_task3_name: 'The Owner\'s Manual',
    methodology_phase3_task3_desc: 'We leave you with peace of mind. I provide you with a final folder containing all your "as-built" plans and contractor warranties—your building\'s life-long reference guide.',
    // Service Cards (ServicesList)
    service_architecture_title: 'Architecture',
    service_architecture_desc: 'Comprehensive design services for residential and commercial structures, creating timeless aesthetics grounded in functionality.',
    service_interior_title: 'Interior Design',
    service_interior_desc: 'Curating interior spaces that harmonize with the exterior architecture, selecting materials and furnishings with precision.',
    service_landscape_title: 'Landscape',
    service_landscape_desc: 'Designing outdoor spaces that interact organically with the built environment, creating a seamless flow between nature and architecture.',
    service_3d_scanning_title: '3D Scanning',
    service_3d_scanning_desc: 'Precision capturing of existing conditions to inform accurate renovation and preservation strategies using LiDAR.',
    service_photography_title: 'Architecture Photography',
    service_photography_desc: 'Capturing the essence of built forms through light and shadow. Documenting projects with the same precision used to build them.',
    service_permits_title: 'Preliminary Declaration & Approvals',
    service_permits_desc: 'Specialized support for declaration prealable files, planning approvals, and PLU-compliant facade or extension projects.',
    service_3d_printing_title: '3D Printing',
    service_3d_printing_desc: 'Transforming digital models into physical prototypes and scale models. Bringing architectural concepts to life through precision additive manufacturing.',
    service_branding_title: 'Branding & Digital Presence',
    service_branding_desc: 'Crafting visual identity and digital experiences that reflect architectural excellence. From logo design to web presence, we build brands that resonate.',
    // Service Overview Common
    service_overview_label: 'Our Approach',
    service_faq_label: '04. Common Questions',
    service_faq_title: 'Frequently Asked Questions',
    // Architecture Process
    architecture_process_label: '03. Methodology',
    architecture_process_title: 'Design Phases',
    architecture_process_phase1_title: 'Concept Design',
    architecture_process_phase1_subtitle: 'Esquisse',
    architecture_process_phase1_desc: 'Initial concept sketches and spatial analysis. We explore your vision and translate it into preliminary architectural ideas.',
    architecture_process_phase1_deliverable1: 'Concept sketches',
    architecture_process_phase1_deliverable2: 'Spatial diagrams',
    architecture_process_phase1_deliverable3: 'Initial feasibility study',
    architecture_process_phase2_title: 'Preliminary Design',
    architecture_process_phase2_subtitle: 'Avant-Projet Sommaire',
    architecture_process_phase2_desc: 'Detailed development of the chosen concept with technical validation. Floor plans, elevations, and material palette are defined.',
    architecture_process_phase2_deliverable1: 'Floor plans',
    architecture_process_phase2_deliverable2: 'Elevations',
    architecture_process_phase2_deliverable3: 'Material board',
    architecture_process_phase2_deliverable4: '3D renders',
    architecture_process_phase3_title: 'Final Design',
    architecture_process_phase3_subtitle: 'Avant-Projet Définitif',
    architecture_process_phase3_desc: 'Complete architectural documentation ready for permit submission. All technical details are finalized and coordinated.',
    architecture_process_phase3_deliverable1: 'Technical drawings',
    architecture_process_phase3_deliverable2: 'Permit documents',
    architecture_process_phase3_deliverable3: 'Specifications',
    architecture_process_phase3_deliverable4: 'Cost estimation',
    architecture_process_deliverables_label: 'Deliverables:',
    // Architecture Overview
    architecture_overview_title: 'A Seamless Transition for Larger Projects',
    architecture_overview_desc: 'If your project is larger than 150m², our role doesn\'t stop at the drawing board. Once the <strong>Avant-Projet Définitif (APD)</strong> is validated, we leverage our exclusive network of partner architectural firms. We put you in direct relation with licensed collaborators who handle the administrative Building Permit and execution phases, while we continue to lead the Interior Design and Landscaping to ensure the original vision is executed to perfection.',
    architecture_feature_specialty_title: 'Specialty',
    architecture_feature_specialty_desc: 'Home extensions (up to 40m² in U-zones), roof elevations, and facade changes.',
    architecture_feature_phases_title: 'Phases',
    architecture_feature_phases_desc: 'Concept (ESQ), Preliminary Design (APS), and Final Design (APD).',
    architecture_feature_network_title: 'Network',
    architecture_feature_network_desc: 'Seamless hand-off to partner firms for PC and construction oversight.',
    // Interior Design Overview
    interior_overview_title: 'Transforming Architectural Concepts into Lived Realities',
    interior_overview_desc: 'Our interior design philosophy centers on creating spaces that seamlessly blend <strong>aesthetic excellence</strong> with <strong>functional optimization</strong>. We work closely with clients to understand their lifestyle, brand identity, and spatial needs, ensuring every design decision enhances daily living or working experiences. From initial concept through final installation, we maintain a holistic approach that considers materiality, lighting, ergonomics, and the unique character of each space.',
    interior_feature_integration_title: 'Seamless Integration',
    interior_feature_integration_desc: 'Whether continuing from our architectural phase or starting fresh, we ensure cohesive design language throughout.',
    interior_feature_custom_title: 'Custom Solutions',
    interior_feature_custom_desc: 'Every project is tailored to reflect your unique lifestyle, brand identity, and functional requirements.',
    interior_feature_turnkey_title: 'Turnkey Results',
    interior_feature_turnkey_desc: 'From concept to installation, we manage the entire process ensuring every detail meets our high standards.',
    // Landscape Overview
    landscape_overview_title: 'Extending Your Living Space into Nature',
    landscape_overview_desc: 'Our landscape architecture philosophy centers on creating seamless transitions between <strong>built environments</strong> and <strong>natural spaces</strong>. We design outdoor areas that function as true extensions of your home, enhancing both aesthetic appeal and practical usability. Every design respects local ecosystems, incorporates sustainable practices, and creates spaces that evolve beautifully over time while maintaining a contemporary aesthetic that complements your architecture.',
    landscape_feature_ecosystem_title: 'Ecosystem Integration',
    landscape_feature_ecosystem_desc: 'Designs that respect and enhance local biodiversity while creating beautiful, functional outdoor spaces.',
    landscape_feature_extension_title: 'Seamless Extension',
    landscape_feature_extension_desc: 'Outdoor spaces that feel like natural extensions of your home, creating cohesive indoor-outdoor living.',
    landscape_feature_sustainable_title: 'Sustainable Design',
    landscape_feature_sustainable_desc: 'Modern aesthetics achieved through sustainable practices, native plant selection, and efficient irrigation systems.',
    // Permits Overview
    permits_overview_title: 'Navigating French Administrative Complexity',
    permits_overview_desc: 'The French planning system requires precise documentation and strict compliance with local regulations. We specialize in <strong>Déclaration Préalable (DP)</strong> procedures, handling all administrative aspects from initial documentation through approval. Our expertise ensures your project meets <strong>PLU (Plan Local d\'Urbanisme)</strong> requirements and navigates heritage zone regulations when applicable. We take the complexity out of permits, allowing you to focus on your project.',
    permits_feature_documentation_title: 'Complete Documentation',
    permits_feature_documentation_desc: 'We prepare all required forms, plans, and technical documents needed for your permit application.',
    permits_feature_compliance_title: 'Regulatory Compliance',
    permits_feature_compliance_desc: 'Ensuring your project fully complies with local planning regulations and heritage requirements.',
    permits_feature_navigation_title: 'Expert Navigation',
    permits_feature_navigation_desc: 'Years of experience navigating French administrative systems and working with local authorities.',
    // Photography Overview
    photography_overview_title: 'Capturing Spaces That Convert',
    photography_overview_desc: 'Our photography and virtual tour services are designed to showcase your spaces in their best light, both literally and figuratively. We understand that <strong>first impressions are digital</strong>, and our high-end imagery helps properties stand out in competitive markets. Whether you\'re selling real estate, marketing a hotel, or showcasing a restaurant, our <strong>professional photography</strong> and <strong>immersive virtual tours</strong> create compelling visual narratives that drive engagement, increase bookings, and improve search engine rankings.',
    photography_feature_quality_title: 'Professional Quality',
    photography_feature_quality_desc: 'High-end architectural photography that captures the essence and quality of your spaces with precision and artistry.',
    photography_feature_conversion_title: 'Conversion Focused',
    photography_feature_conversion_desc: 'Imagery and tours strategically designed to increase bookings, engagement, and conversion rates on digital platforms.',
    photography_feature_seo_title: 'SEO Optimized',
    photography_feature_seo_desc: 'Virtual tours that improve search rankings by increasing time on page and providing rich, engaging content.',
    // Branding Overview
    branding_overview_title: 'Design Thinking Applied to Brand Building',
    branding_overview_desc: 'Just as architecture requires a solid foundation, clear structure, and beautiful exterior, so does effective branding. We apply our <strong>architectural design principles</strong> to create brands that are both visually compelling and strategically sound. Our approach ensures your brand identity works seamlessly across all touchpoints—from your physical space to your digital presence—creating a <strong>cohesive experience</strong> that resonates with your target audience and drives business results.',
    branding_feature_aesthetic_title: 'Architectural Aesthetic',
    branding_feature_aesthetic_desc: 'High-end design principles from architecture applied to create sophisticated, timeless brand identities.',
    branding_feature_strategy_title: 'Data-Driven Strategy',
    branding_feature_strategy_desc: 'SEO-optimized digital strategies that ensure your brand is discoverable and converts visitors into clients.',
    branding_feature_positioning_title: 'Market Positioning',
    branding_feature_positioning_desc: 'Strategic brand positioning that helps you stand out in your niche and attract your ideal customers.',
    // 3D Scanning Overview
    scanning_overview_title: 'Capturing Reality with Precision Technology',
    scanning_overview_desc: 'Our 3D scanning services bridge the gap between physical spaces and digital design workflows. Using advanced <strong>LiDAR scanning technology</strong>, we create accurate digital representations that serve as the foundation for renovation projects, heritage documentation, and virtual presentations. Whether you need precise measurements for custom installations or immersive virtual tours for remote stakeholders, our technology-driven approach ensures <strong>accuracy</strong> and <strong>accessibility</strong>.',
    scanning_feature_precision_title: 'Precision Scanning',
    scanning_feature_precision_desc: 'Millimeter-accurate LiDAR technology captures every detail of your space for precise design and planning.',
    scanning_feature_documentation_title: 'Digital Documentation',
    scanning_feature_documentation_desc: 'Create permanent digital records of your property that serve as valuable assets for future projects.',
    scanning_feature_virtual_title: 'Virtual Access',
    scanning_feature_virtual_desc: 'Enable remote exploration and collaboration through immersive 360-degree virtual environments.',
    // 3D Printing Overview
    printing_overview_title: 'From Digital Design to Physical Reality',
    printing_overview_desc: 'Our 3D printing services transform your digital architectural models into <strong>tangible, high-detail physical representations</strong>. These scale models (maquettes) are invaluable for client presentations, planning authority submissions, and design verification. We use <strong>precision 3D printing technology</strong> to create models that accurately represent your project\'s scale, proportions, and architectural details, making complex designs immediately understandable to all stakeholders.',
    printing_feature_manufacturing_title: 'Precision Manufacturing',
    printing_feature_manufacturing_desc: 'High-resolution 3D printing technology that captures fine architectural details and complex geometries with accuracy.',
    printing_feature_validation_title: 'Design Validation',
    printing_feature_validation_desc: 'Physical models help identify design issues early, allowing for adjustments before construction begins.',
    printing_feature_communication_title: 'Client Communication',
    printing_feature_communication_desc: 'Tactile models make abstract designs concrete, helping clients and stakeholders visualize the final project.',
  },
  fr: {
    // Footer
    footer_description: "Excellence architecturale pour le monde moderne. Création d'espaces qui inspirent et durent.",
    studio: 'Studio',
    contact: 'Contact',
    social: 'Réseaux',
    copyright: '© 2026 Projects by Joseph Dibeh. Tous droits réservés.',
    privacy_policy: 'Politique de confidentialité',
    terms_of_service: 'Conditions d\'utilisation',
    cookie_policy: 'Politique de cookies',
    paris: 'Paris',
    french_riviera: 'Côte d’Azur',
    beirut: 'Beyrouth',
    // Navigation
    nav_home: 'Accueil',
    nav_about: 'À propos',
    nav_services: 'Services',
    nav_projects: 'Projets',
    nav_others: 'Autres',
    nav_careers: 'Carrières',
    nav_blogs_news: 'Blogs & Actualités',
    nav_inquire: 'Demander',
    // Hero Section
    hero_badge: '01. À PROPOS',
    hero_title_part1: 'Définir l\'espace par',
    hero_title_part2: 'la précision',
    hero_title_part3: 'et la forme.',
    hero_description: 'Nous créons des environnements qui allient intégrité structurelle et pureté esthétique. Chaque ligne tracée a un but ; chaque vide crée du sens.',
    hero_cta: 'Voir les œuvres sélectionnées',
    hero_scroll: 'DÉFILEZ POUR EXPLORER',
    // Projects Section
    projects_label: ' Portfolio',
    projects_title: 'Œuvres sélectionnées',
    // Company Stats Section
    stats_badge: '02. Aperçu du Studio',
    stats_title: 'Mesuré par les lieux, les projets et les partenariats',
    stats_description:
      'Un studio d’architecture ciblé qui livre des projets en France et au Liban avec une approche sélective, guidée par le design.',
    // Career Section
    career_label: ' Équipe',
    career_title: 'Rejoignez le Studio',
    career_description: 'Nous recherchons toujours des esprits visionnaires pour rejoindre notre équipe. Si vous êtes passionné par les détails et le design, nous voulons vous entendre.',
    career_job_intern_interior: 'Stagiaire en Design d\'Intérieur',
    career_job_intern_graphic: 'Stagiaire en Design Graphique',
    career_job_details_fulltime: 'Temps plein',
    career_job_details_months: 'Mois',
    career_job_details_paris: 'Paris',
    career_job_details_france: 'France',
    career_job_details_hybrid: 'Hybride',
    career_job_details_remote: 'Distant',
    career_modal_apply: 'Postuler pour le poste',
    career_modal_subtitle: 'Rejoignez notre studio et contribuez à définir les espaces par la précision et la forme.',
    career_modal_role_title: 'Description du rôle',
    career_modal_role_text: 'Nous recherchons un stagiaire dévoué pour assister aux projets en cours. Le rôle implique de participer au développement de concepts, à la modélisation 3D et au dessin technique.',
    career_modal_requirements_title: 'Exigences',
    career_modal_requirement_1: 'Étudiant actuel ou diplômé récent dans un domaine pertinent',
    career_modal_requirement_2: 'Portfolio solide démontrant une pensée conceptuelle',
    career_modal_requirement_3: 'Maîtrise des logiciels pertinents (AutoCAD, Adobe Suite, etc.)',
    career_modal_requirement_4: 'Passion pour les détails et l\'artisanat architectural',
    career_form_fullname: 'Nom complet *',
    career_form_email: 'Adresse e-mail *',
    career_form_motivation: 'Lettre de motivation *',
    career_form_motivation_placeholder: 'Pourquoi voulez-vous rejoindre le Studio Joseph Dibeh ?',
    career_form_cv: 'Télécharger CV (PDF) *',
    career_form_portfolio: 'Portfolio (PDF)',
    career_form_selected: 'Sélectionné :',
    career_form_submit: 'Soumettre la candidature',
    career_form_submitting: 'Envoi en cours...',
    career_form_cv_required: 'Le fichier CV est requis',
    career_form_cv_pdf: 'Le CV doit être un fichier PDF',
    career_form_portfolio_pdf: 'Le portfolio doit être un fichier PDF',
    career_form_file_size: 'la taille du fichier est invalide',
    career_form_error: 'Échec de l\'envoi de la candidature. Veuillez réessayer.',
    career_form_error_generic: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
    career_thankyou: 'Merci pour votre candidature ! Nous examinerons votre soumission et vous répondrons bientôt.',
    // Inquiry Section
    inquiry_label: 'Contact',
    inquiry_title: 'Demande de projet',
    inquiry_step_identity: 'Identité',
    inquiry_step_context: 'Contexte',
    inquiry_step_path: 'Chemin',
    inquiry_step_review: 'Révision',
    inquiry_step1_title: 'Pour qui construisons-nous ?',
    inquiry_step1_subtitle: 'Commençons par votre identité.',
    inquiry_client_private: 'Client privé',
    inquiry_client_business: 'Entreprise / Promoteur',
    inquiry_form_firstname: 'Prénom *',
    inquiry_form_lastname: 'Nom de famille *',
    inquiry_form_email: 'Adresse e-mail *',
    inquiry_form_phone: 'Numéro de téléphone',
    inquiry_form_address: 'Adresse du projet',
    inquiry_form_services: 'Services requis (Sélection multiple)',
    inquiry_form_budget: 'Budget (€)',
    inquiry_form_timeline: 'Délai',
    inquiry_form_timeline_asap: 'Dès que possible',
    inquiry_form_timeline_3m: '3 Mois',
    inquiry_form_timeline_6m: '6 Mois',
    inquiry_form_timeline_1y: '1 An+',
    inquiry_form_surface: 'Surface (m²)',
    inquiry_form_description: 'Description',
    inquiry_form_description_placeholder: 'Parlez-nous de votre vision...',
    inquiry_upload_drag: 'Glisser-déposer plans ou inspiration (PDF, Images)',
    inquiry_step2_title: 'Contexte du projet',
    inquiry_step2_subtitle: 'Définir la portée et les contraintes.',
    inquiry_step3_title: 'Choisissez votre chemin',
    inquiry_step3_subtitle: 'Comment pouvons-nous vous aider au mieux aujourd\'hui ?',
    inquiry_path_general_title: 'Demande générale',
    inquiry_path_general_desc: 'Je souhaite discuter d\'un projet à long terme ou obtenir un devis personnalisé pour ma propriété.',
    inquiry_path_general_footer: 'Évaluation gratuite',
    inquiry_path_consult_title: 'Consultation d\'expert',
    inquiry_path_consult_desc: 'J\'ai besoin de conseils immédiats, de vérifications de faisabilité ou d\'une session de brainstorming de design.',
    inquiry_path_consult_footer: 'Session payante • À partir de 100 €',
    inquiry_review_title: 'Réviser la demande',
    inquiry_review_subtitle: 'Prêt à envoyer les détails de votre projet.',
    inquiry_review_client: 'Client',
    inquiry_review_type: 'Type',
    inquiry_review_services: 'Services',
    inquiry_review_budget: 'Budget',
    inquiry_review_timeline: 'Délai',
    inquiry_review_surface: 'Surface',
    inquiry_review_address: 'Adresse',
    inquiry_review_description: 'Description',
    inquiry_consult_duration: 'Durée',
    inquiry_consult_duration_60: '1 heure',
    inquiry_consult_duration_120: '2 heures',
    inquiry_consult_duration_180: '3 heures',
    inquiry_consult_roadmap: 'Rapport de feuille de route',
    inquiry_consult_roadmap_desc: 'Recevoir un rapport écrit détaillé après la consultation',
    inquiry_consult_format: 'Format',
    inquiry_consult_format_online: 'En ligne',
    inquiry_consult_format_onsite: 'Sur site',
    inquiry_consult_billing: 'Adresse de facturation identique à l\'adresse du projet',
    inquiry_consult_billing_title: 'Facturation',
    inquiry_consult_schedule: 'Planifier la consultation',
    inquiry_consult_schedule_pay: 'Planifier et payer',
    inquiry_consult_session_details: 'Détails de la session',
    inquiry_consult_select_date: 'Sélectionner la date (Jours de semaine 10-12)',
    inquiry_consult_select_time: 'Sélectionner l\'heure',
    inquiry_consult_prev_week: 'Semaine précédente',
    inquiry_consult_next_week: 'Semaine suivante',
    inquiry_consult_roadmap_title: 'Le rapport de feuille de route',
    inquiry_consult_roadmap_price: 'Résumé écrit et plan d\'action (+100 €)',
    inquiry_consult_recommended: 'Recommandé',
    inquiry_consult_format_online_label: 'En ligne (Google Meet)',
    inquiry_consult_format_onsite_label: 'Sur site',
    inquiry_btn_back: 'Retour',
    inquiry_btn_continue: 'Continuer',
    inquiry_btn_continue_context: 'Continuer vers le contexte du projet',
    inquiry_btn_saving: 'Enregistrement...',
    inquiry_btn_submit: 'Soumettre la demande',
    inquiry_btn_proceed_payment: 'Procéder au paiement',
    inquiry_btn_loading: 'Chargement...',
    inquiry_error_save: 'Échec de l\'enregistrement',
    inquiry_error_payment: 'Échec de la création de la session de paiement',
    inquiry_error_required_fields: 'Veuillez remplir tous les champs requis',
    inquiry_error_identity: 'Échec de l\'enregistrement des informations d\'identité',
    inquiry_error_context: 'Échec de l\'enregistrement du contexte du projet',
    inquiry_error_path: 'Échec de l\'enregistrement de la sélection du chemin',
    inquiry_error_submit: 'Échec de l\'envoi de la demande',
    inquiry_error_id_not_found: 'ID de demande introuvable. Veuillez revenir à l\'étape 1.',
    inquiry_error_id_not_found_simple: 'ID de demande introuvable',
    inquiry_error_select_path: 'Veuillez sélectionner un chemin',
    inquiry_error_select_datetime: 'Veuillez sélectionner une date et une heure',
    inquiry_error_generic: 'Une erreur s\'est produite. Veuillez réessayer.',
    inquiry_success_submitted: 'Demande envoyée avec succès ! Nous vous contacterons sous peu.',
    // Services List
    services_title: 'Nos services',
    services_view_all: 'Voir tous les services',
    services_label: ' Expertise',
    services_coming_soon: 'BIENTÔT DISPONIBLE',
    // Testimonials Section
    testimonials_label: ' Clients',
    testimonials_title: 'Témoignages',
    testimonials_modal_title: 'Ajoutez votre avis',
    testimonials_modal_description: 'Partagez votre expérience de travail avec nous.',
    testimonials_form_fullname: 'Nom complet *',
    testimonials_form_email: 'E-mail *',
    testimonials_form_phone: 'Numéro de téléphone',
    testimonials_form_project_type: 'Type de projet',
    testimonials_form_review: 'Avis *',
    testimonials_form_placeholder_name: 'Jane Doe',
    testimonials_form_placeholder_email: 'jane@example.com',
    testimonials_form_placeholder_phone: '+33123456789',
    testimonials_form_placeholder_project: 'ex. Rénovation résidentielle',
    testimonials_form_placeholder_review: 'Décrivez votre expérience...',
    testimonials_btn_submit: 'Soumettre l\'avis',
    testimonials_btn_submitting: 'Envoi en cours...',
    testimonials_btn_add_review: 'Ajoutez votre avis',
    testimonials_loading: 'Chargement des témoignages...',
    testimonials_empty: 'Aucun témoignage pour le moment. Soyez le premier à partager votre expérience !',
    testimonials_error_submit: 'Échec de l\'envoi du témoignage. Veuillez réessayer.',
    testimonials_error_generic: 'Une erreur s\'est produite. Veuillez réessayer plus tard.',
    testimonials_thankyou: 'Merci pour votre avis ! Nous apprécions vos commentaires.',
    testimonials_client_fallback: 'Client',
    testimonials_show_more: 'Voir plus',
    // Thank You Message
    thankyou_title: 'Merci !',
    thankyou_close: 'Fermer',
    // News Section
    news_label: 'Réflexions & Insights',
    news_title: 'Blog',
    news_read_article: 'Lire l\'article',
    // About Page
    about_intro_text: 'Nous opérons à l\'intersection de la précision et de l\'émotion. Notre studio est dédié à la création d\'espaces qui ne sont pas seulement construits, mais façonnés—où chaque ligne a une fonction et chaque vide a un sens.',
    founder_quote_1: 'L\'architecture est un langage de responsabilité. Quand nous traçons une ligne, nous faisons une promesse au paysage et à la communauté. Mon parcours a été guidé par le désir de fusionner l\'exactitude technique avec l\'intuition artistique.',
    founder_quote_2: 'Nous ne concevons pas seulement des bâtiments ; nous organisons des expériences. Chaque projet est une opportunité de redéfinir les limites et de créer quelque chose de vraiment durable. Merci de faire partie de notre histoire.',
    founder_name: 'Joseph Dibeh',
    founder_role: 'Fondateur & PDG',
    mission_label: 'Notre Mission',
    mission_title: 'Précision & Forme',
    mission_description: 'Offrir l\'excellence architecturale grâce à une attention rigoureuse aux détails. Nous nous efforçons de résoudre des défis complexes avec des solutions simples et élégantes qui élèvent l\'expérience humaine.',
    vision_label: 'Notre Vision',
    vision_title: 'Espaces Intemporels',
    vision_description: 'Nous envisageons un environnement bâti qui respecte son contexte tout en regardant audacieusement vers l\'avant. Notre objectif est de créer des structures qui vieillissent avec grâce et restent pertinentes pour les générations.',
    philosophy_label: 'Notre Philosophie',
    philosophy_title: 'Vide Significatif',
    philosophy_description: 'L\'architecture concerne autant l\'espace entre les murs que les murs eux-mêmes. Nous croyons en la poésie du vide, façonnant la lumière et l\'ombre pour définir l\'atmosphère d\'un lieu.',
    // Services Header
    services_header_label: '01. APPROCHE',
    services_header_title_part1: 'Disciplines du',
    services_header_title_part2: 'design',
    services_header_title_part3: '& de la forme.',
    services_header_description: 'Nous offrons une approche holistique de la création spatiale, fusionnant la rigueur architecturale avec la chaleur intérieure. De l\'étude de faisabilité initiale à la remise finale, chaque détail est soigné.',
    // Methodology
    methodology_label: '03. Méthodologie',
    methodology_title: 'Du Concept à la Réalité',
    methodology_description: 'Un processus standardisé et rigoureux garantissant clarté et contrôle à chaque étape du cycle de vie du projet. Nous vous guidons du premier croquis à la remise finale.',
    methodology_phase1_title: 'Rêver & Concevoir Votre Espace',
    methodology_phase1_description: 'C\'est là que vos idées prennent forme. Nous transformons vos besoins en un concept concret et magnifique.',
    methodology_phase1_task1_name: 'Relevé de Site',
    methodology_phase1_task1_desc: 'Nous apprenons à connaître votre espace. Nous visitons votre domicile pour prendre des mesures précises et vérifier la "santé" du bâtiment (murs, plomberie et électricité) afin qu\'il n\'y ait pas de surprises cachées plus tard.',
    methodology_phase1_task2_name: 'L\'Esquisse',
    methodology_phase1_task2_desc: 'Nous explorons les possibilités. Je propose différentes options d\'aménagement et des croquis rapides pour voir comment nous pouvons optimiser au mieux votre espace.',
    methodology_phase1_task3_name: 'Le Concept',
    methodology_phase1_task3_desc: 'Nous définissons le style. Nous choisissons ensemble l\'ambiance générale, les couleurs et les matériaux en utilisant des moodboards pour nous assurer que nous sommes sur la même longueur d\'onde esthétique.',
    methodology_phase1_task4_name: 'Le Design Final',
    methodology_phase1_task4_desc: 'Nous finalisons les détails. Je crée les plans techniques finaux et les rendus 3D. Vous verrez exactement à quoi ressemblera votre futur intérieur, jusqu\'au moindre détail.',
    methodology_phase2_title: 'Planifier pour la Perfection',
    methodology_phase2_description: 'Pas de place pour les suppositions. Nous organisons tout pour garantir que la construction soit sans stress et respecte le budget.',
    methodology_phase2_task1_name: 'Administration & Autorisations',
    methodology_phase2_task1_desc: 'Nous gérons les formalités. Si votre projet nécessite des modifications aux fenêtres ou à l\'extérieur, je prépare et soumets la "Déclaration Préalable" à la mairie locale pour vous.',
    methodology_phase2_task2_name: 'Dossier Technique',
    methodology_phase2_task2_desc: 'Nous créons le "Manuel d\'Instruction". J\'écris une description technique très détaillée pour les constructeurs. Cela garantit que vous obtenez des prix fixes et précis qui ne changeront pas à mi-parcours.',
    methodology_phase2_task3_name: 'Choisir les Constructeurs',
    methodology_phase2_task3_desc: 'Nous trouvons la bonne équipe. Je vous aide à analyser les devis de différents entrepreneurs et à négocier pour vous assurer d\'obtenir les meilleurs experts pour votre budget spécifique.',
    methodology_phase3_title: 'Voir Votre Vision Devenir Réalité',
    methodology_phase3_description: 'La transformation commence. J\'agis comme vos yeux et vos oreilles sur le chantier jusqu\'au jour où vous emménagez.',
    methodology_phase3_task1_name: 'Supervision de Chantier',
    methodology_phase3_task1_desc: 'Nous gérons le travail. Je visite le chantier chaque semaine pour m\'assurer que la qualité correspond aux plans. Vous recevez un rapport de progression hebdomadaire pour rester informé depuis le confort de votre canapé.',
    methodology_phase3_task2_name: 'La Remise',
    methodology_phase3_task2_desc: 'Nous vérifions chaque coin. Une fois les travaux terminés, nous faisons une visite finale ensemble. Je m\'assure que chaque finition est parfaite avant que vous ne repreniez officiellement les clés.',
    methodology_phase3_task3_name: 'Le Manuel du Propriétaire',
    methodology_phase3_task3_desc: 'Nous vous laissons l\'esprit tranquille. Je vous fournis un dossier final contenant tous vos plans "tels que construits" et les garanties des entrepreneurs—votre guide de référence à vie pour votre bâtiment.',
    // Service Cards (ServicesList)
    service_architecture_title: 'Architecture',
    service_architecture_desc: 'Services de conception complets pour structures résidentielles et commerciales, créant une esthétique intemporelle ancrée dans la fonctionnalité.',
    service_interior_title: 'Design d\'Intérieur',
    service_interior_desc: 'Organisation d\'espaces intérieurs qui s\'harmonisent avec l\'architecture extérieure, sélection de matériaux et mobilier avec précision.',
    service_landscape_title: 'Paysage',
    service_landscape_desc: 'Conception d\'espaces extérieurs qui interagissent organiquement avec l\'environnement bâti, créant un flux fluide entre nature et architecture.',
    service_3d_scanning_title: 'Scan 3D',
    service_3d_scanning_desc: 'Capture précise des conditions existantes pour informer des stratégies précises de rénovation et de préservation utilisant le LiDAR.',
    service_photography_title: 'Photographie d\'Architecture',
    service_photography_desc: 'Capturer l\'essence des formes construites par la lumière et l\'ombre. Documenter les projets avec la même précision utilisée pour les construire.',
    service_permits_title: 'Déclaration Préalable & Autorisations',
    service_permits_desc: 'Accompagnement spécialisé pour les dossiers de déclaration préalable, les autorisations d\'urbanisme et la conformité PLU.',
    service_3d_printing_title: 'Impression 3D',
    service_3d_printing_desc: 'Transformer des modèles numériques en prototypes physiques et maquettes. Donner vie aux concepts architecturaux grâce à la fabrication additive de précision.',
    service_branding_title: 'Identité & Présence Numérique',
    service_branding_desc: 'Création d\'identité visuelle et d\'expériences numériques qui reflètent l\'excellence architecturale. Du design de logo à la présence web, nous construisons des marques qui résonnent.',
    // Service Overview Common
    service_overview_label: 'Notre Approche',
    service_faq_label: '04. Questions Courantes',
    service_faq_title: 'Questions Fréquemment Posées',
    // Architecture Process
    architecture_process_label: '03. Méthodologie',
    architecture_process_title: 'Phases de Design',
    architecture_process_phase1_title: 'Design Conceptuel',
    architecture_process_phase1_subtitle: 'Esquisse',
    architecture_process_phase1_desc: 'Croquis conceptuels initiaux et analyse spatiale. Nous explorons votre vision et la traduisons en idées architecturales préliminaires.',
    architecture_process_phase1_deliverable1: 'Croquis conceptuels',
    architecture_process_phase1_deliverable2: 'Diagrammes spatiaux',
    architecture_process_phase1_deliverable3: 'Étude de faisabilité initiale',
    architecture_process_phase2_title: 'Avant-Projet Sommaire',
    architecture_process_phase2_subtitle: 'Avant-Projet Sommaire',
    architecture_process_phase2_desc: 'Développement détaillé du concept choisi avec validation technique. Plans, élévations et palette de matériaux sont définis.',
    architecture_process_phase2_deliverable1: 'Plans',
    architecture_process_phase2_deliverable2: 'Élévations',
    architecture_process_phase2_deliverable3: 'Nuancier de matériaux',
    architecture_process_phase2_deliverable4: 'Rendus 3D',
    architecture_process_phase3_title: 'Avant-Projet Définitif',
    architecture_process_phase3_subtitle: 'Avant-Projet Définitif',
    architecture_process_phase3_desc: 'Documentation architecturale complète prête pour la soumission du permis. Tous les détails techniques sont finalisés et coordonnés.',
    architecture_process_phase3_deliverable1: 'Dessins techniques',
    architecture_process_phase3_deliverable2: 'Documents de permis',
    architecture_process_phase3_deliverable3: 'Spécifications',
    architecture_process_phase3_deliverable4: 'Estimation des coûts',
    architecture_process_deliverables_label: 'Livrables :',
    // Architecture Overview
    architecture_overview_title: 'Une Transition Transparente pour les Grands Projets',
    architecture_overview_desc: 'Si votre projet dépasse 150m², notre rôle ne s\'arrête pas au plan. Une fois l\'<strong>Avant-Projet Définitif (APD)</strong> validé, nous mobilisons notre réseau exclusif de cabinets d\'architecture partenaires. Nous vous mettons en relation directe avec des collaborateurs agréés qui gèrent le permis de construire administratif et les phases d\'exécution, tandis que nous continuons à diriger le Design d\'Intérieur et le Paysagisme pour garantir que la vision originale soit exécutée à la perfection.',
    architecture_feature_specialty_title: 'Spécialité',
    architecture_feature_specialty_desc: 'Extensions de maison (jusqu\'à 40m² en zones U), surélévations de toit et modifications de façade.',
    architecture_feature_phases_title: 'Phases',
    architecture_feature_phases_desc: 'Concept (ESQ), Avant-Projet Sommaire (APS) et Avant-Projet Définitif (APD).',
    architecture_feature_network_title: 'Réseau',
    architecture_feature_network_desc: 'Transmission transparente aux cabinets partenaires pour la PC et le suivi de construction.',
    // Interior Design Overview
    interior_overview_title: 'Transformer les Concepts Architecturaux en Réalités Vécues',
    interior_overview_desc: 'Notre philosophie de design d\'intérieur se concentre sur la création d\'espaces qui allient harmonieusement <strong>l\'excellence esthétique</strong> et <strong>l\'optimisation fonctionnelle</strong>. Nous travaillons en étroite collaboration avec les clients pour comprendre leur mode de vie, l\'identité de leur marque et leurs besoins spatiaux, garantissant que chaque décision de design améliore les expériences de vie ou de travail quotidiennes. Du concept initial à l\'installation finale, nous maintenons une approche holistique qui prend en compte la matérialité, l\'éclairage, l\'ergonomie et le caractère unique de chaque espace.',
    interior_feature_integration_title: 'Intégration Transparente',
    interior_feature_integration_desc: 'Que nous continuions depuis notre phase architecturale ou que nous commencions à zéro, nous garantissons un langage de design cohérent tout au long.',
    interior_feature_custom_title: 'Solutions Personnalisées',
    interior_feature_custom_desc: 'Chaque projet est adapté pour refléter votre mode de vie unique, l\'identité de votre marque et vos exigences fonctionnelles.',
    interior_feature_turnkey_title: 'Résultats Clés en Main',
    interior_feature_turnkey_desc: 'Du concept à l\'installation, nous gérons tout le processus en garantissant que chaque détail répond à nos normes élevées.',
    // Landscape Overview
    landscape_overview_title: 'Étendre Votre Espace de Vie dans la Nature',
    landscape_overview_desc: 'Notre philosophie d\'architecture paysagère se concentre sur la création de transitions transparentes entre les <strong>environnements bâtis</strong> et les <strong>espaces naturels</strong>. Nous concevons des espaces extérieurs qui fonctionnent comme de véritables extensions de votre maison, améliorant à la fois l\'attrait esthétique et l\'utilité pratique. Chaque design respecte les écosystèmes locaux, intègre des pratiques durables et crée des espaces qui évoluent magnifiquement au fil du temps tout en maintenant une esthétique contemporaine qui complète votre architecture.',
    landscape_feature_ecosystem_title: 'Intégration Écosystémique',
    landscape_feature_ecosystem_desc: 'Des designs qui respectent et améliorent la biodiversité locale tout en créant de beaux espaces extérieurs fonctionnels.',
    landscape_feature_extension_title: 'Extension Transparente',
    landscape_feature_extension_desc: 'Des espaces extérieurs qui se sentent comme des extensions naturelles de votre maison, créant une vie intérieur-extérieur cohérente.',
    landscape_feature_sustainable_title: 'Design Durable',
    landscape_feature_sustainable_desc: 'Esthétique moderne obtenue grâce à des pratiques durables, la sélection de plantes indigènes et des systèmes d\'irrigation efficaces.',
    // Permits Overview
    permits_overview_title: 'Naviguer dans la Complexité Administrative Française',
    permits_overview_desc: 'Le système d\'urbanisme français exige une documentation précise et une conformité stricte aux réglementations locales. Nous sommes spécialisés dans les procédures de <strong>Déclaration Préalable (DP)</strong>, gérant tous les aspects administratifs de la documentation initiale à l\'approbation. Notre expertise garantit que votre projet respecte les exigences du <strong>PLU (Plan Local d\'Urbanisme)</strong> et navigue dans les réglementations des zones patrimoniales le cas échéant. Nous retirons la complexité des permis, vous permettant de vous concentrer sur votre projet.',
    permits_feature_documentation_title: 'Documentation Complète',
    permits_feature_documentation_desc: 'Nous préparons tous les formulaires, plans et documents techniques requis pour votre demande de permis.',
    permits_feature_compliance_title: 'Conformité Réglementaire',
    permits_feature_compliance_desc: 'Garantir que votre projet est entièrement conforme aux réglementations d\'urbanisme locales et aux exigences patrimoniales.',
    permits_feature_navigation_title: 'Navigation Experte',
    permits_feature_navigation_desc: 'Des années d\'expérience dans la navigation des systèmes administratifs français et le travail avec les autorités locales.',
    // Photography Overview
    photography_overview_title: 'Capturer des Espaces Qui Convertissent',
    photography_overview_desc: 'Nos services de photographie et de visite virtuelle sont conçus pour mettre en valeur vos espaces sous leur meilleur jour, à la fois littéralement et figurativement. Nous comprenons que <strong>les premières impressions sont numériques</strong>, et nos images haut de gamme aident les propriétés à se démarquer sur des marchés compétitifs. Que vous vendiez un bien immobilier, commercialisiez un hôtel ou présentiez un restaurant, notre <strong>photographie professionnelle</strong> et nos <strong>visites virtuelles immersives</strong> créent des récits visuels convaincants qui stimulent l\'engagement, augmentent les réservations et améliorent le classement dans les moteurs de recherche.',
    photography_feature_quality_title: 'Qualité Professionnelle',
    photography_feature_quality_desc: 'Photographie architecturale haut de gamme qui capture l\'essence et la qualité de vos espaces avec précision et art.',
    photography_feature_conversion_title: 'Axé sur la Conversion',
    photography_feature_conversion_desc: 'Images et visites stratégiquement conçues pour augmenter les réservations, l\'engagement et les taux de conversion sur les plateformes numériques.',
    photography_feature_seo_title: 'Optimisé pour le SEO',
    photography_feature_seo_desc: 'Visites virtuelles qui améliorent le classement dans les moteurs de recherche en augmentant le temps sur la page et en fournissant un contenu riche et engageant.',
    // Branding Overview
    branding_overview_title: 'Design Thinking Appliqué à la Construction de Marque',
    branding_overview_desc: 'Tout comme l\'architecture nécessite une fondation solide, une structure claire et une belle extérieur, il en va de même pour un branding efficace. Nous appliquons nos <strong>principes de design architectural</strong> pour créer des marques à la fois visuellement convaincantes et stratégiquement solides. Notre approche garantit que l\'identité de votre marque fonctionne de manière transparente sur tous les points de contact—de votre espace physique à votre présence numérique—créant une <strong>expérience cohérente</strong> qui résonne avec votre public cible et génère des résultats commerciaux.',
    branding_feature_aesthetic_title: 'Esthétique Architecturale',
    branding_feature_aesthetic_desc: 'Principes de design haut de gamme de l\'architecture appliqués pour créer des identités de marque sophistiquées et intemporelles.',
    branding_feature_strategy_title: 'Stratégie Basée sur les Données',
    branding_feature_strategy_desc: 'Stratégies numériques optimisées pour le SEO qui garantissent que votre marque est découvrable et convertit les visiteurs en clients.',
    branding_feature_positioning_title: 'Positionnement sur le Marché',
    branding_feature_positioning_desc: 'Positionnement stratégique de la marque qui vous aide à vous démarquer dans votre niche et à attirer vos clients idéaux.',
    // 3D Scanning Overview
    scanning_overview_title: 'Capturer la Réalité avec une Technologie de Précision',
    scanning_overview_desc: 'Nos services de scan 3D comblent le fossé entre les espaces physiques et les flux de travail de design numérique. En utilisant une <strong>technologie de scan LiDAR avancée</strong>, nous créons des représentations numériques précises qui servent de fondation pour les projets de rénovation, la documentation patrimoniale et les présentations virtuelles. Que vous ayez besoin de mesures précises pour des installations sur mesure ou de visites virtuelles immersives pour des parties prenantes distantes, notre approche axée sur la technologie garantit <strong>la précision</strong> et <strong>l\'accessibilité</strong>.',
    scanning_feature_precision_title: 'Scan de Précision',
    scanning_feature_precision_desc: 'La technologie LiDAR précise au millimètre capture chaque détail de votre espace pour un design et une planification précis.',
    scanning_feature_documentation_title: 'Documentation Numérique',
    scanning_feature_documentation_desc: 'Créer des enregistrements numériques permanents de votre propriété qui servent d\'actifs précieux pour les projets futurs.',
    scanning_feature_virtual_title: 'Accès Virtuel',
    scanning_feature_virtual_desc: 'Permettre l\'exploration et la collaboration à distance grâce à des environnements virtuels immersifs à 360 degrés.',
    // 3D Printing Overview
    printing_overview_title: 'Du Design Numérique à la Réalité Physique',
    printing_overview_desc: 'Nos services d\'impression 3D transforment vos modèles architecturaux numériques en <strong>représentations physiques tangibles et détaillées</strong>. Ces maquettes à l\'échelle sont inestimables pour les présentations clients, les soumissions aux autorités de planification et la vérification du design. Nous utilisons une <strong>technologie d\'impression 3D de précision</strong> pour créer des modèles qui représentent avec précision l\'échelle, les proportions et les détails architecturaux de votre projet, rendant les designs complexes immédiatement compréhensibles pour toutes les parties prenantes.',
    printing_feature_manufacturing_title: 'Fabrication de Précision',
    printing_feature_manufacturing_desc: 'Technologie d\'impression 3D haute résolution qui capture les détails architecturaux fins et les géométries complexes avec précision.',
    printing_feature_validation_title: 'Validation du Design',
    printing_feature_validation_desc: 'Les modèles physiques aident à identifier les problèmes de design tôt, permettant des ajustements avant que la construction ne commence.',
    printing_feature_communication_title: 'Communication Client',
    printing_feature_communication_desc: 'Les modèles tactiles rendent les designs abstraits concrets, aidant les clients et les parties prenantes à visualiser le projet final.',
  },
  ar: {
    paris: 'باريس',
    french_riviera: 'الريفييرا الفرنسية',
    beirut: 'بيروت',
  },
} as const

type TranslationKey = keyof typeof translations.en

// Helper function to get initial language synchronously
// Always returns 'en' for SSR to match server render
function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  
  // Check if language was set by the blocking script in layout (runs before React)
  const scriptDetectedLang = document.documentElement.getAttribute('data-initial-lang') as Language | null
  if (scriptDetectedLang && (scriptDetectedLang === 'en' || scriptDetectedLang === 'fr')) {
    return scriptDetectedLang
  }
  
  // Check localStorage (synchronous)
  try {
    const savedLanguage = localStorage.getItem('language') as Language | null
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'fr')) {
      return savedLanguage
    }
  } catch (e) {
    // localStorage might not be available
  }
  
  // Default to English (will be updated by geolocation if needed)
  return 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Always initialize with 'en' to match server render and prevent hydration mismatch
  // Will be updated immediately after mount to the correct language
  const [language, setLanguageState] = useState<Language>('en')

  // Use useLayoutEffect to update language synchronously before paint
  // This prevents the flash of wrong language
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    // Get the language from the blocking script (runs before React)
    // This is set synchronously before React hydrates
    const scriptLang = document.documentElement.getAttribute('data-initial-lang') as Language | null
    let detectedLang: Language = 'en'
    
    if (scriptLang && (scriptLang === 'en' || scriptLang === 'fr')) {
      detectedLang = scriptLang
    } else {
      // Fallback to localStorage if script didn't set it
      try {
        const savedLang = localStorage.getItem('language') as Language | null
        if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
          detectedLang = savedLang
        }
      } catch (e) {
        // localStorage not available
      }
    }

    // Update state immediately to match what the script set
    // useLayoutEffect runs synchronously before paint, so no flash
    if (detectedLang !== language) {
      setLanguageState(detectedLang)
    }
    
    // Ensure HTML lang attribute matches
    document.documentElement.lang = detectedLang
    document.documentElement.setAttribute('lang', detectedLang)
  }, []) // Run only once on mount

  // Separate useEffect for async API call (only if no saved preference)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if we have a saved language preference
    let hasSavedPreference = false
    try {
      hasSavedPreference = !!localStorage.getItem('language')
    } catch (e) {
      // localStorage not available
    }

    if (!hasSavedPreference) {
      // No saved preference, detect via API
      let cancelled = false
      
      fetch('https://ipapi.co/json/')
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return
          const apiDetectedLang: Language = data.country_code === 'FR' ? 'fr' : 'en'
          setLanguageState(apiDetectedLang)
          localStorage.setItem('language', apiDetectedLang)
          document.documentElement.lang = apiDetectedLang
          document.documentElement.setAttribute('lang', apiDetectedLang)
          document.documentElement.setAttribute('data-initial-lang', apiDetectedLang)
        })
        .catch(() => {
          if (cancelled) return
          // If IP geolocation fails, keep current language (English by default)
        })

      return () => {
        cancelled = true
      }
    }
  }, []) // Run only once on mount

  const setLanguage = React.useCallback((lang: Language) => {
    // Update state immediately (not functional update to ensure it always updates)
    setLanguageState(lang)
    
    // Update localStorage and HTML attribute synchronously
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang)
        // Update HTML lang attribute immediately using both methods
        const htmlElement = document.documentElement
        htmlElement.setAttribute('lang', lang)
        htmlElement.lang = lang
        // Also update the data attribute for consistency
        htmlElement.setAttribute('data-initial-lang', lang)
      } catch (error) {
        console.error('Error updating language:', error)
      }
    }
  }, [])

  // Translation function
  const t = React.useCallback((key: TranslationKey): string => {
    return translations[language][key]
  }, [language])

  // Memoize context value to ensure proper updates
  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t
  }), [language, setLanguage, t])

  // Provide context even before mount to prevent errors
  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

