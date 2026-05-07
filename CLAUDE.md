# Project Type: Local Service Business Website - Visual Prototype Only

Visual Prototype Rule — NO Schema or Backend SEO
These pages are for client and developer visual review only — not for live deployment.
Do NOT include:
Schema markup (JSON-LD, LocalBusiness, FAQPage, BreadcrumbList, Service, etc.)
Meta description tags
Canonical tags
robots meta tags
Any other backend SEO code
Only include: <title> tag and <meta name="viewport"> — nothing else in the head beyond fonts and styles.
This rule overrides all SEO and Schema sections below.

Always Do First
Invoke the frontend-design skill before writing any frontend code, every session, no exceptions.
Core Principle
This is not just a design task.
Every website must support SEO, local visibility, trust, and conversions.
Design decisions must prioritise readability, crawlability, and lead generation.
Reference Images
If a reference image is provided: match layout, spacing, typography, and color exactly. Do not improve or add to the design.
If no reference image: design with high-end, modern UI while still prioritising conversion and SEO structure.
Perform at least 2 screenshot comparison rounds before finalising.
Local Server + Screenshot Workflow
Always serve via localhost, never file:///
Start server: node serve.mjs → http://localhost:3000
Screenshot using: node screenshot.mjs http://localhost:3000
Review screenshots and fix:
spacing
typography
alignment
color accuracy
responsiveness
Output Structure (Production Ready)
Use a scalable structure, not just a single file:
/index.html
/services/service-name.html
/locations/location-name.html
/assets/ (images, icons)
/css/ (if required)
Use semantic HTML: header, nav, main, section, footer
Ensure clean, readable, production-quality code
SEO + Page Structure Rules
Every page must include:
One clear H1
Logical heading hierarchy (H2, H3)
No skipping heading levels for styling
Include crawlable content, not just visual blocks
Avoid hiding key content inside tabs or accordions
Content Requirements
Service pages must include:
What the service is
Who it’s for
Benefits
Process
FAQs
CTA
Location pages must:
Be unique (no duplicate templates)
Mention suburbs, nearby areas, or landmarks naturally
Include internal linking between:
services
locations
contact pages
Metadata + Indexing
Every page must include:
Unique <title> tag (50–60 chars)
Meta description (140–160 chars)
Include:
canonical tag
viewport meta
Ensure pages are indexable unless specified otherwise
Schema Requirements
Include relevant schema where applicable:
LocalBusiness
Service
FAQ
Review
Breadcrumb
Use JSON-LD format
Ensure schema matches visible page content
Images + Media
Use real brand assets if available (check brand_assets/)
If not, use placeholders: https://placehold.co/
All images must:
include descriptive alt text
be properly sized and compressed
Maintain consistent aspect ratios across layouts
Avoid oversized images that slow load speed
Internal Linking
Include contextual internal links:
between services
between locations
to contact/booking pages
Use descriptive anchor text, not “click here”
Conversion Rules
Every page must include:
CTA above the fold
repeated CTAs throughout longer pages
Use:
click-to-call buttons
enquiry forms
Keep forms short unless specified otherwise
Ensure contact details are easy to find
Trust Elements
Include where relevant:
reviews or testimonials
star ratings
years of experience
service areas
Format testimonials with:
first name
location (suburb/area)
Local SEO Requirements
Mention relevant suburbs/areas naturally in content
Include service area sections where relevant
Ensure consistent business info:
name
phone
service area
Support Google Business Profile alignment
Performance Rules
Prioritise fast load times
Avoid unnecessary scripts or heavy libraries
Optimise images and assets
Prevent layout shift (CLS)
Keep code clean and minimal
Accessibility Rules
Ensure:
keyboard navigation works
proper labels for all form fields
strong color contrast
clear button and link states
Avoid vague link text
Brand Assets
Always check brand_assets/ first
Use provided:
logos
colors
fonts
Do not invent branding if assets exist
Anti-Generic Design Guardrails
Do not use default Tailwind colors
Create a custom color system
Use layered shadows, not flat ones
Pair fonts properly:
display font for headings
clean sans for body
Add depth through gradients and overlays
Maintain consistent spacing system
Add hover, focus, and active states to all interactive elements
Animations
Only animate:
transform
opacity
Do not use transition-all
Use subtle, purposeful motion only
Navigation + Footer
Navigation must be:
clear
minimal
mobile-friendly
Footer must include:
contact info
service areas or links
key pages
Do Not Forget
Strong H1 and opening value proposition
Above-the-fold CTA
Crawlable service content
Internal links
Alt text
Mobile responsiveness
Trust elements
Metadata
Schema
Fast load performance
Hard Rules
Do not add features not requested
Do not ignore SEO structure for design
Do not stop after one screenshot pass
Do not use transition-all
Do not use default Tailwind blue/indigo
Do not produce thin content pages
Do not include schema, meta descriptions, canonical tags, or any backend SEO — visual prototype only
