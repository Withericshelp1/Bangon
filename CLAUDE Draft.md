CLAUDE.md — Frontend Website Rules (Draft / Rapid Build)

Always Do First
Invoke the frontend-design skill before writing any frontend code, every session, no exceptions.
Core Principle
This is a fast build for mockups, concepts, or first versions
Prioritise clean design, clear structure, and usability
Keep things lightweight and easy to iterate
Reference Images
If a reference image is provided:
Match layout, spacing, typography, and color exactly
Do not improve or add extra sections
If no reference image:
Design a clean, modern layout suitable for a service business
Perform at least 1 to 2 screenshot comparison rounds before finalising
Local Server + Screenshot Workflow
Always serve via localhost, never file:///
Start server: node serve.mjs
URL: http://localhost:3000
Screenshot using: node screenshot.mjs http://localhost:3000
Review and fix:
spacing
font sizes
alignment
responsiveness
Output Defaults
Default to a single index.html file
Use inline styles or Tailwind CDN
Keep code simple and readable
Mobile-first responsive
Page Structure (Important)

Even for drafts, structure must make sense.

Include a clear H1
Use logical sections (H2s where needed)
Avoid random or messy layouts
Typical Sections (Service Business)

Use when no reference is provided:

Hero (headline + CTA)
Services overview
About / credibility
Why choose us
Testimonials or trust signals
Contact / CTA section
Content Style
Write in a natural, human tone
Avoid generic filler text like “lorem ipsum”
Use simple, clear messaging
Focus on what the business does and who it helps
Keep copy concise but meaningful
Conversion Basics
Include a CTA above the fold
Add at least one more CTA lower on the page
Use clear actions:
Call
Book
Get a quote
Make it obvious what the user should do next
Images + Media
Use placeholders if no assets:
https://placehold.co/WIDTHxHEIGHT
Keep image sizes consistent
Ensure images support layout and readability
Avoid cluttered or excessive imagery
Navigation + Layout
Keep navigation simple:
Logo
3 to 5 links max
Ensure layout flows logically from top to bottom
Maintain consistent spacing throughout
Design Guardrails (Keep It Premium)
Do not use default Tailwind blue/indigo as primary color
Create a simple custom color direction
Use clean typography:
slightly larger headings
readable body text
Use spacing consistently, not randomly
Add subtle hover states to buttons and links
Interactions + Animations
Keep interactions minimal
Only use:
opacity
transform
No heavy animation or over-design
What To Avoid
No overcomplicated layouts
No unnecessary sections
No bloated code
No generic “agency-style” fluff
No relying only on visuals without supporting text
Draft Mode Priorities
Clean layout
Clear messaging
Logical structure
Fast to build and edit
Do Not Forget
Clear H1
Strong first section
At least one CTA above the fold
Mobile responsiveness
Consistent spacing
Simple navigation