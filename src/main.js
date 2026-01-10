import './style.css'
import {
  roofingCollection,
  roofingPreview,
  installationCollection,
  installationPreview,
  paintingCollection,
  paintingPreview,
  wholeProjects
} from './data/work.js'

const gradientPalette = [
  'linear-gradient(135deg, #e6d5c1 0%, #f3ece2 45%, #c9b098 100%)',
  'linear-gradient(135deg, #dfc9b1 0%, #f1e7da 40%, #baa188 100%)',
  'linear-gradient(135deg, #e7d7c4 0%, #f6efe6 45%, #c6b099 100%)',
  'linear-gradient(135deg, #e1cbb4 0%, #f1e4d5 45%, #b59b82 100%)',
  'linear-gradient(135deg, #efe1d0 0%, #f7efe6 45%, #ccb39b 100%)'
]

const collectionSections = [
  {
    id: 'roofing',
    title: 'Roofing',
    description: 'Repairs, re-roofs, and roof upgrades.',
    items: roofingCollection,
    previewItems: roofingPreview,
    paletteOffset: 0,
    viewPath: '/work/roofing'
  },
  {
    id: 'installation',
    title: 'Installation',
    description: 'Windows, doors, gates, and exterior installs.',
    items: installationCollection,
    previewItems: installationPreview,
    paletteOffset: 1,
    viewPath: '/work/installation'
  },
  {
    id: 'painting',
    title: 'Painting',
    description: 'Exterior, interior, and trim paint.',
    items: paintingCollection,
    previewItems: paintingPreview,
    paletteOffset: 2,
    viewPath: '/work/painting'
  }
]

const serviceCategories = [
  {
    title: 'Roofing & Exterior Systems',
    items: [
      'Full tear-off and re-roofing',
      'Roof repairs and leak remediation',
      'Structural roof framing repair when required',
      'Tile reset and composite roofing systems',
      'Stucco repair and exterior surface restoration',
      'Exterior wall patching and weather sealing',
      'Fascia, trim, and exterior detailing',
      'Pressure washing and surface prep'
    ]
  },
  {
    title: 'Structural & Framing',
    items: [
      'Load-bearing and non-load-bearing framing',
      'Structural reinforcement and repair',
      'Wall rebuilds and layout corrections',
      'Subfloor repair and leveling',
      'Stair construction and repair',
      'Fence framing and installation',
      'Deck framing and exterior structures',
      'Concrete break-out, repair, and new pours'
    ]
  },
  {
    title: 'Interior Construction & Finishes',
    items: [
      'Flooring installation and repair',
      'Cabinet installation and adjustment',
      'Interior wall repair and drywall finishing',
      'Painting (interior and exterior)',
      'Trim work and finish carpentry',
      'Lighting fixture installation',
      'Door and hardware installation',
      'General interior repair and upgrades'
    ]
  },
  {
    title: 'Mechanical & Utilities (Limited Scope)',
    items: [
      'Electrical work within residential limits',
      'Plumbing work within legal scope',
      'HVAC unit installation and replacement coordination',
      'Appliance hookups and basic system integration',
      'Permit coordination when required'
    ],
    note: 'Note: Work beyond permitted scope is coordinated with licensed specialists.'
  },
  {
    title: 'Site Work & Property Improvements',
    items: [
      'Ground clearing and site prep',
      'Landscaping installation and cleanup',
      'Yard access improvements',
      'Fence lines and boundary structures',
      'Exterior access paths and walkways',
      'Garage door installation and motor replacement',
      'Property cleanup and remodel preparation'
    ]
  }
]

const distributeColumns = (items, columns) => {
  const result = Array.from({ length: columns }, () => [])
  items.forEach((item, index) => {
    result[index % columns].push(item)
  })
  return result
}

const heroImage = "url('/assets/brand/hero-bg.jpg')"

const buildBackground = (src, fallback) => {
  if (!src) return fallback
  return `url('${src}'), ${fallback}`
}

const getCollectionImageSrc = (item) => {
  if (item.imageSrc) return item.imageSrc
  return ''
}

const getSectionPreviewItems = (section) => {
  const items = section.previewItems && section.previewItems.length
    ? section.previewItems
    : section.items

  const previewItems = [0, 1, 2].map((index) => {
    const item = items[index] || items[0] || { id: section.id, label: section.title }
    const imageSrc = getCollectionImageSrc(item)
    return {
      ...item,
      imageSrc,
      background: buildBackground(
        imageSrc,
        gradientPalette[(section.paletteOffset + index) % gradientPalette.length]
      )
    }
  })

  return {
    items: previewItems,
    backdrop: gradientPalette[(section.paletteOffset + 3) % gradientPalette.length]
  }
}

const callButtonContent = (label, number) => `
  <span class="call-pill__label">${label}</span>
  <span class="call-pill__value">${number}</span>
`

const phoneButtonsMarkup = () => `
  <a
    class="call-pill inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm transition hover:bg-[var(--accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
    href="tel:323-695-0290"
    data-call-button
    data-call-number="323-695-0290"
    data-call-label="Call (English)"
    aria-live="polite"
  >
    ${callButtonContent('Call (English)', '323-695-0290')}
  </a>
  <a
    class="call-pill inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-700 transition hover:border-stone-400 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
    href="tel:213-280-9892"
    data-call-button
    data-call-number="213-280-9892"
    data-call-label="Llamar (Español)"
    aria-live="polite"
  >
    ${callButtonContent('Llamar (Español)', '213-280-9892')}
  </a>
`



const projectCardMarkup = (project, index) => {
  const image = buildBackground(
    project.coverImage,
    gradientPalette[(index + 3) % gradientPalette.length]
  )
  const summaryMarkup = project.summary
    ? `<p class="mt-2 text-sm text-stone-500">${project.summary}</p>`
    : ''

  return `
  <a
    class="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
    href="/projects/${project.slug}"
    data-link
  >
    <article class="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div class="image-tile aspect-[5/4] w-full" style="background-image: ${image};"></div>
      <div class="p-4">
        <h3 class="text-lg font-semibold">${project.title}</h3>
        ${summaryMarkup}
      </div>
    </article>
  </a>
`
}

const sectionMarkup = (section) => {
  const preview = getSectionPreviewItems(section)
  const [mainPreview, secondaryPreview, tertiaryPreview] = preview.items
  const featuredClass = section.id === 'roofing'
    ? 'ring-1 ring-amber-200/70 shadow-md'
    : ''

  return `
    <article class="rounded-3xl border border-stone-200/80 bg-white/90 p-6 shadow-sm ${featuredClass}">
      <div class="grid gap-6 md:grid-cols-[minmax(220px,1fr)_minmax(0,3fr)] md:items-start">
        <div class="space-y-3">
          <h3 class="text-2xl font-semibold md:text-3xl">${section.title}</h3>
          <p class="text-sm text-stone-500">${section.description}</p>
        </div>
        <a
          class="group image-tile flex h-full min-h-[320px] flex-col justify-between rounded-2xl border border-stone-200/80 bg-stone-100/80 p-4 shadow-sm sm:min-h-[360px] sm:p-5 lg:min-h-[420px]"
          href="${section.viewPath}"
          data-link
          aria-label="View ${section.title} gallery"
          style="background-image: ${preview.backdrop};"
        >
          <div class="grid flex-1 grid-cols-[1.4fr_0.6fr] grid-rows-2 gap-3" data-work-mosaic>
            <div class="relative overflow-hidden rounded-2xl border border-stone-200/70 shadow-sm sm:row-span-2">
              <div class="image-tile h-full w-full" style="background-image: ${mainPreview.background};"></div>
              <div class="absolute inset-x-0 bottom-0 bg-white/85 px-3 py-2">
                ${mainPreview.tag ? `<p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">${mainPreview.tag}</p>` : ''}
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">${mainPreview.label}</p>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-2xl border border-stone-200/70 shadow-sm">
              <div class="image-tile h-full w-full" style="background-image: ${secondaryPreview.background};"></div>
              <div class="absolute inset-x-0 bottom-0 bg-white/85 px-3 py-2">
                ${secondaryPreview.tag ? `<p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">${secondaryPreview.tag}</p>` : ''}
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">${secondaryPreview.label}</p>
              </div>
            </div>
            <div class="relative overflow-hidden rounded-2xl border border-stone-200/70 shadow-sm">
              <div class="image-tile h-full w-full" style="background-image: ${tertiaryPreview.background};"></div>
              <div class="absolute inset-x-0 bottom-0 bg-white/85 px-3 py-2">
                ${tertiaryPreview.tag ? `<p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">${tertiaryPreview.tag}</p>` : ''}
                <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-700">${tertiaryPreview.label}</p>
              </div>
            </div>
          </div>
          <span class="mt-4 inline-flex items-center justify-end text-xs font-semibold uppercase tracking-[0.3em] text-stone-600 transition group-hover:text-stone-900">
            View gallery
          </span>
        </a>
      </div>
    </article>
  `
}

const headerMarkup = () => `
  <header class="border-b border-stone-200/70 bg-stone-50/80 backdrop-blur">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <a
        class="text-base font-semibold uppercase tracking-[0.2em] text-stone-800"
        href="/"
        data-link
      >
        J West Coast Construction
      </a>
      <nav class="flex flex-wrap items-center gap-5 text-xs font-semibold uppercase tracking-[0.3em] text-stone-600">
        <a
          class="transition hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
          href="/services"
          data-link
        >
          Services
        </a>
        <a
          class="transition hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
          href="/services#contact"
          data-link
        >
          Contact
        </a>
      </nav>
    </div>
  </header>
`

const footerMarkup = () => `
  <footer class="border-t border-stone-200/70 py-8">
    <div class="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 text-xs uppercase tracking-[0.2em] text-stone-500 md:flex-row md:items-center md:justify-between">
      <span>J West Coast Construction</span>
      <span>Roofing, installs, painting, and restoration</span>
    </div>
  </footer>
`

const homeMarkup = () => `
  <div class="min-h-screen">
    ${headerMarkup()}

    <main class="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
      <section id="services">
        <div
          class="image-tile relative min-h-[420px] overflow-hidden rounded-3xl border border-stone-200/80 shadow-sm sm:min-h-[480px] lg:min-h-[520px]"
          style="background-image: ${heroImage}; background-repeat: no-repeat;"
        >
          <div
            class="absolute inset-0 bg-gradient-to-r from-stone-900/20 via-stone-900/5 to-transparent"
            aria-hidden="true"
          ></div>
          <div class="relative z-10 max-w-xl p-6 sm:p-8 lg:p-10">
            <div class="rounded-3xl bg-stone-50/85 p-6 shadow-sm backdrop-blur sm:p-8">
              <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                CONTRACTOR-LED PROJECTS
              </p>
              <h1 class="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                J West Coast Construction
              </h1>
              <ul class="mt-6 space-y-3 text-sm text-stone-600">
                <li class="flex items-start gap-3">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-600"></span>
                  Roofing — tear-off, re-roof, repairs
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-600"></span>
                  Exterior repairs — stucco, siding, patch work
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-600"></span>
                  Installations — windows, doors, gates, garage doors
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-600"></span>
                  Remodel support — framing, flooring, cabinets, paint
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-600"></span>
                  Permit-backed work when required (project dependent)
                </li>
              </ul>
              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                ${phoneButtonsMarkup()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" class="mt-20">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Work</p>
            <h2 class="mt-3 text-3xl font-semibold md:text-4xl">Recent Work</h2>
            <p class="mt-2 text-sm text-stone-500">Small projects and full remodels — examples from recent jobs.</p>
          </div>
        </div>

        <div class="mt-8 rounded-2xl border border-stone-200/70 bg-stone-100/70 p-2">
          <div class="grid grid-cols-2 gap-2" role="tablist" aria-label="Work categories" data-tablist>
            <button
              class="tab-btn"
              id="tab-roofing"
              type="button"
              role="tab"
              aria-selected="true"
              aria-controls="panel-roofing"
              tabindex="0"
              data-state="active"
            >
              Small Projects
            </button>
            <button
              class="tab-btn"
              id="tab-projects"
              type="button"
              role="tab"
              aria-selected="false"
              aria-controls="panel-projects"
              tabindex="-1"
              data-state="inactive"
            >
              Whole Projects
            </button>
          </div>
        </div>

          <div class="mt-8">
            <div id="panel-roofing" role="tabpanel" aria-labelledby="tab-roofing">
              <div class="space-y-10">
                ${collectionSections.map(sectionMarkup).join('')}
              </div>
            </div>
            <div id="panel-projects" role="tabpanel" aria-labelledby="tab-projects" hidden>
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 class="text-2xl font-semibold md:text-3xl">Whole Projects</h3>
                  <p class="mt-2 text-sm text-stone-500">Full remodels and restorations.</p>
                </div>
              </div>
              <div class="mt-6 grid gap-6 md:grid-cols-2">
                ${wholeProjects.map(projectCardMarkup).join('')}
              </div>
            </div>
          </div>
        </section>

      <section id="contact" class="mt-20">
        <div class="rounded-3xl border border-stone-200/80 bg-white/80 p-8 shadow-sm md:p-10">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Contact</p>
              <h2 class="mt-3 text-2xl font-semibold md:text-3xl">Let's talk through scope and next steps.</h2>
              <p class="mt-3 max-w-xl text-sm text-stone-500">
                Tell us what you need done — we'll confirm scope, timeline, and next steps.
              </p>
            </div>
            <div class="flex flex-col gap-3 sm:flex-row">
              ${phoneButtonsMarkup()}
            </div>
          </div>
        </div>
      </section>
    </main>

    ${footerMarkup()}
  </div>
`

const servicesPageMarkup = () => `
  <div class="min-h-screen">
    ${headerMarkup()}

    <main class="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
      <section>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Services</p>
        <h1 class="mt-3 text-4xl font-semibold md:text-5xl">Services</h1>
        <p class="mt-3 max-w-2xl text-sm text-stone-500">
          Roofing & Exterior Systems, Structural & Framing, Interior Construction & Finishes,
          Mechanical & Utilities (Limited Scope), Site Work & Property Improvements.
        </p>
        <div class="mt-10 space-y-10">
          ${serviceCategories
            .map((category) => {
              const columns = distributeColumns(category.items, 3)
              return `
                <div class="border-t border-stone-200/70 pt-8">
                  <h2 class="text-2xl font-semibold">${category.title}</h2>
                  <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    ${columns
                      .map(
                        (column) => `
                          <ul class="space-y-2 text-sm text-stone-600">
                            ${column.map((item) => `<li>${item}</li>`).join('')}
                          </ul>
                        `
                      )
                      .join('')}
                  </div>
                  ${
                    category.note
                      ? `<p class="mt-4 text-xs text-stone-500">${category.note}</p>`
                      : ''
                  }
                </div>
              `
            })
            .join('')}
        </div>
      </section>

      <section id="contact" class="mt-16">
        <div class="rounded-3xl border border-stone-200/80 bg-white/80 p-8 shadow-sm md:p-10">
          <div class="grid gap-10 lg:grid-cols-[minmax(0,0.4fr),minmax(0,0.6fr)]">
            <div class="space-y-5">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Contact</p>
                <h2 class="mt-3 text-2xl font-semibold md:text-3xl">Let's talk through scope and next steps.</h2>
              </div>
              <div class="space-y-2 text-sm text-stone-600">
                <p><span class="font-semibold text-stone-700">Call (English):</span> 323-695-0290</p>
                <p><span class="font-semibold text-stone-700">Llamar (Español):</span> 213-280-9892</p>
                <p><span class="font-semibold text-stone-700">Email:</span> info@jwestcoastconstruction.com</p>
              </div>
              <div class="flex flex-col gap-3 sm:flex-row">
                ${phoneButtonsMarkup()}
              </div>
            </div>

            <form class="space-y-4" data-contact-form>
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Name
                  <input
                    class="rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    name="name"
                    type="text"
                    autocomplete="name"
                  />
                </label>
                <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Phone
                  <input
                    class="rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    name="phone"
                    type="tel"
                    autocomplete="tel"
                  />
                </label>
              </div>
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Email
                  <input
                    class="rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    name="email"
                    type="email"
                    autocomplete="email"
                  />
                </label>
                <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Service interested in
                  <select
                    class="rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                    name="service"
                  >
                    <option value="">Select</option>
                    ${serviceCategories
                      .map((category) => `<option value="${category.title}">${category.title}</option>`)
                      .join('')}
                  </select>
                </label>
              </div>
              <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Message
                <textarea
                  class="min-h-[140px] rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                  name="message"
                ></textarea>
              </label>
              <label class="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Attachment
                <input
                  class="rounded-xl border border-stone-200/80 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
                  name="attachment"
                  type="file"
                  multiple
                />
              </label>
              <div class="absolute -left-[9999px] top-auto" aria-hidden="true">
                <label>
                  Company
                  <input type="text" name="company" tabindex="-1" autocomplete="off" />
                </label>
              </div>
              <label class="flex items-center gap-3 text-sm text-stone-600">
                <input
                  class="h-4 w-4 rounded border-stone-300 text-amber-600 focus-visible:ring-amber-600"
                  type="checkbox"
                  name="robot"
                />
                I'm not a robot
              </label>
              <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  class="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-white shadow-sm transition hover:bg-[var(--accent-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
                  type="submit"
                >
                  Submit
                </button>
                <p class="text-sm text-emerald-700" data-form-success hidden>
                  Message prepared - we'll follow up shortly.
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>

    ${footerMarkup()}
  </div>
`

const projectComparisonMarkup = (beforeSrc, afterSrc, groupId, title) => {
  const beforeAlt = title ? `Before - ${title}` : 'Before'
  const afterAlt = title ? `After - ${title}` : 'After'

  if (import.meta.env?.DEV) {
    const beforeLower = String(beforeSrc).toLowerCase()
    const afterLower = String(afterSrc).toLowerCase()
    if (beforeLower.includes('/after') || afterLower.includes('/before')) {
      console.warn(
        '[Slider] Before/after sources look reversed. Check slider asset paths.',
        { beforeSrc, afterSrc, title }
      )
    }
  }

  return `
      <div
        class="ba-slider aspect-[16/9] rounded-3xl border border-stone-200/80 bg-white/80 shadow-sm"
        data-comparison
        data-lightbox-compare
        data-lightbox-before="${beforeSrc}"
        data-lightbox-after="${afterSrc}"
        data-lightbox-before-alt="${beforeAlt}"
        data-lightbox-after-alt="${afterAlt}"
        ${groupId ? `data-lightbox-group="${groupId}"` : ''}
        style="--pos: 50%;"
      >
        <img class="ba-img ba-before" src="${beforeSrc}" alt="${beforeAlt}" loading="lazy" decoding="async" width="1600" height="900" />
        <img class="ba-img ba-after" src="${afterSrc}" alt="${afterAlt}" loading="lazy" decoding="async" width="1600" height="900" />
        <div class="ba-labels" aria-hidden="true">
          <span class="ba-label">Before</span>
          <span class="ba-label">After</span>
        </div>
        <div class="ba-handle" aria-hidden="true"></div>
        <input
          class="ba-range"
          type="range"
          min="0"
          max="100"
          value="50"
          aria-label="Before/After slider"
        />
      </div>
    `
}

const projectCoverMarkup = (imageSrc, fallbackIndex) => {
  const fallback = gradientPalette[fallbackIndex % gradientPalette.length]
  const heroImage = buildBackground(imageSrc, fallback)
  return `
    <div
      class="image-tile aspect-[16/9] rounded-3xl border border-stone-200/80 shadow-sm"
      style="background-image: ${heroImage};"
    ></div>
  `
}

const projectHeroMarkup = (project) => {
  const beforeSrc = project.beforeImage
    ? `/assets/projects/${project.slug}/slider/before.jpeg`
    : ''
  const afterSrc = project.afterImage
    ? `/assets/projects/${project.slug}/slider/after.jpeg`
    : ''
  const hasComparison = Boolean(beforeSrc) && Boolean(afterSrc)
  if (hasComparison) {
    return projectComparisonMarkup(
      beforeSrc,
      afterSrc,
      `project-${project.slug}-compare`,
      project.title
    )
  }

  return projectCoverMarkup(project.coverImage || '', 2)
}

const projectGalleryMarkup = (project) => {
  const beforeGallery = project.beforeGallery && project.beforeGallery.length
    ? project.beforeGallery
    : ['', '', '']
  const afterGallery = project.afterGallery && project.afterGallery.length
    ? project.afterGallery
    : ['', '', '']

  const renderGalleryColumn = (label, images, offset, groupId) => `
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">${label}</p>
        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          ${images
            .map((imageSrc, index) => {
              const image = buildBackground(
                imageSrc,
                gradientPalette[(offset + index) % gradientPalette.length]
              )
              const altText = imageSrc
                ? `${project.title} ${label.toLowerCase()} image ${index + 1}`
                : ''
              const triggerAttrs = imageSrc
                ? `data-lightbox-src="${imageSrc}" data-lightbox-alt="${altText}" data-lightbox-group="${groupId}" data-lightbox-index="${index}" aria-label="View full image"`
                : ''
              return `
                <button class="lightbox-trigger w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 p-0 shadow-sm" type="button" ${triggerAttrs}>
                  <div class="image-tile aspect-[4/3] w-full" style="background-image: ${image};"></div>
                </button>
              `
            })
            .join('')}
        </div>
      </div>
    `

  return `
    <section class="mt-12">
      <div class="grid gap-8 lg:grid-cols-2">
        ${renderGalleryColumn('Before gallery', beforeGallery, 1, `project-${project.slug}-before`)}
        ${renderGalleryColumn('After gallery', afterGallery, 3, `project-${project.slug}-after`)}
      </div>
    </section>
  `
}

const projectServicesMarkup = (project) => {
  if (!project.services || project.services.length === 0) return ''

  return `
    <section class="mt-12">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Services</p>
      <div class="mt-4 flex flex-wrap gap-2">
        ${project.services
          .map(
            (service) => `
              <span class="rounded-full border border-stone-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600">
                ${service}
              </span>
            `
          )
          .join('')}
      </div>
    </section>
  `
}

const projectPageMarkup = (project) => `
  <div class="min-h-screen">
    ${headerMarkup()}

    <main class="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
      <section class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Project</p>
          <h1 class="mt-3 text-4xl font-semibold md:text-5xl">${project.title}</h1>
          ${
            project.summary
              ? `<p class="mt-3 max-w-2xl text-sm text-stone-500">${project.summary}</p>`
              : ''
          }
        </div>
        <a
          class="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-700 transition hover:border-stone-400 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
          href="/#work?tab=whole"
          data-link
        >
          Back to Work
        </a>
      </section>

      <section class="mt-10">
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Before / After</p>
        <div class="mt-4">
          ${projectHeroMarkup(project)}
        </div>
      </section>

      ${projectGalleryMarkup(project)}
      ${projectServicesMarkup(project)}

      <section class="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a
          class="inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-700 transition hover:border-stone-400 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
          href="/#work?tab=whole"
          data-link
        >
          Back to Work
        </a>
        ${phoneButtonsMarkup()}
      </section>
    </main>

    ${footerMarkup()}
  </div>
`

const collectionPageMarkup = (collection) => {
  const gridClass = collection.items.length > 1 ? 'md:grid-cols-2' : 'md:grid-cols-1'

  return `
    <div class="min-h-screen">
      ${headerMarkup()}

      <main class="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
        <section>
          <h1 class="text-4xl font-semibold md:text-5xl">${collection.title}</h1>
          ${
            collection.description
              ? `<p class="mt-3 max-w-2xl text-sm text-stone-500">${collection.description}</p>`
              : ''
          }
        </section>

        <section class="mt-8 divide-y divide-stone-200/70 border-t border-stone-200/70">
          ${collection.items
            .map((item, index) => {
              const images = item.images && item.images.length
                ? item.images
                : item.imageSrc
                  ? [item.imageSrc]
                  : ['']
              const isSingle = images.length <= 1
              const gridClass = isSingle ? '' : 'sm:grid-cols-2 lg:grid-cols-3'
              const imageClass = isSingle ? 'aspect-[16/9]' : 'aspect-[4/3]'
              const maxWidth = isSingle ? 'max-w-2xl' : ''
              const tagMarkup = item.tag
                ? `<p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">${item.tag}</p>`
                : ''
              const groupId = `collection-${collection.id}-${item.id}`
              return `
                <article class="py-8">
                  <div class="grid gap-6 lg:grid-cols-[minmax(0,0.35fr),minmax(0,0.65fr)] lg:items-start">
                    <div class="space-y-2">
                      <h2 class="text-2xl font-semibold">${item.label}</h2>
                      ${tagMarkup}
                    </div>
                    <div class="grid gap-4 ${gridClass} ${maxWidth}">
                      ${images
                        .map((imageSrc, imageIndex) => {
                          const image = buildBackground(
                            imageSrc,
                            gradientPalette[(collection.paletteOffset + imageIndex) % gradientPalette.length]
                          )
                          const altText = imageSrc
                            ? `${item.label}${item.tag ? ` ${item.tag}` : ''} image ${imageIndex + 1}`
                            : ''
                          const triggerAttrs = imageSrc
                            ? `data-lightbox-src="${imageSrc}" data-lightbox-alt="${altText}" data-lightbox-group="${groupId}" data-lightbox-index="${imageIndex}" aria-label="View full image"`
                            : ''
                          return `
                            <button class="lightbox-trigger w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-white/80 p-0 shadow-sm" type="button" ${triggerAttrs}>
                              <div class="image-tile ${imageClass} w-full" style="background-image: ${image};"></div>
                            </button>
                          `
                        })
                        .join('')}
                    </div>
                  </div>
                </article>
              `
            })
            .join('')}
        </section>
      </main>

      ${footerMarkup()}
    </div>
  `
}

const notFoundMarkup = () => `
  <div class="min-h-screen">
    ${headerMarkup()}
    <main class="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
      <p class="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">Not found</p>
      <h1 class="mt-3 text-3xl font-semibold">Page not found.</h1>
      <a
        class="mt-6 inline-flex items-center justify-center rounded-full border border-stone-300 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-stone-700 transition hover:border-stone-400 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50"
        href="/"
        data-link
      >
        Back to Home
      </a>
    </main>
    ${footerMarkup()}
  </div>
`

const app = document.querySelector('#app')

const renderApp = (markup, title) => {
  if (!app) return
  app.innerHTML = markup
  if (title) {
    document.title = title
  }
  initTabs()
  initGalleries()
  initComparisons()

  if (window.location.hash) {
    const [targetHash] = window.location.hash.split('?')
    const target = targetHash ? document.querySelector(targetHash) : null
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  } else {
    window.scrollTo({ top: 0 })
  }
}

const renderRoute = () => {
  const { pathname } = window.location

  if (pathname === '/' || pathname === '') {
    renderApp(homeMarkup(), 'J West Coast Construction')
    return
  }

  if (pathname === '/services' || pathname === '/services/') {
    renderApp(servicesPageMarkup(), 'Services | J West Coast Construction')
    return
  }

  const collectionMatch = pathname.match(/^\/work\/([^/]+)\/?$/)
  if (collectionMatch) {
    const slug = decodeURIComponent(collectionMatch[1])
    const collection = collectionSections.find((section) => section.id === slug)
    if (collection) {
      renderApp(
        collectionPageMarkup(collection),
        `${collection.title} | J West Coast Construction`
      )
      return
    }
  }

  const projectMatch = pathname.match(/^\/projects\/([^/]+)\/?$/)
  if (projectMatch) {
    const slug = decodeURIComponent(projectMatch[1])
    const project = wholeProjects.find((entry) => entry.slug === slug)
    if (project) {
      renderApp(
        projectPageMarkup(project),
        `${project.title} | J West Coast Construction`
      )
      return
    }
  }

  renderApp(notFoundMarkup(), 'J West Coast Construction')
}

const navigateTo = (url) => {
  window.history.pushState({}, '', url)
  renderRoute()
}

const handleLinkClick = (event) => {
  const link = event.target.closest('a[data-link]')
  if (!link) return
  if (event.defaultPrevented) return
  if (event.button !== 0) return
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

  const url = new URL(link.href)
  if (url.origin !== window.location.origin) return

  event.preventDefault()
  navigateTo(`${url.pathname}${url.hash}`)
}

const initTabs = () => {
  const tablist = document.querySelector('[data-tablist]')
  if (!tablist) return

  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'))
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'))
  const hashQuery = window.location.hash.includes('?')
    ? window.location.hash.split('?')[1]
    : ''
  const tabParam =
    new URLSearchParams(window.location.search).get('tab')
    || new URLSearchParams(hashQuery).get('tab')

  const setActiveTab = (tab, moveFocus = false) => {
    const target = tab.getAttribute('aria-controls')

    tabs.forEach((button) => {
      const isActive = button === tab
      button.setAttribute('aria-selected', isActive ? 'true' : 'false')
      button.tabIndex = isActive ? 0 : -1
      button.dataset.state = isActive ? 'active' : 'inactive'
    })

    panels.forEach((panel) => {
      panel.hidden = panel.id !== target
    })

    if (moveFocus) {
      tab.focus()
    }
  }

  const handleKey = (event) => {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']
    if (!keys.includes(event.key)) return

    const currentIndex = tabs.indexOf(event.currentTarget)
    let nextIndex = currentIndex

    if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
    }

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    }

    if (event.key === 'Home') {
      nextIndex = 0
    }

    if (event.key === 'End') {
      nextIndex = tabs.length - 1
    }

    event.preventDefault()
    setActiveTab(tabs[nextIndex], true)
  }

  const requestedTab =
    tabParam === 'whole'
      ? tablist.querySelector('#tab-projects')
      : null
  const initialTab =
    requestedTab
    || tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')
    || tabs[0]

  if (initialTab) {
    setActiveTab(initialTab, false)
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => setActiveTab(tab, true))
    tab.addEventListener('keydown', handleKey)
  })
}

const initComparisons = () => {
  document.querySelectorAll('[data-comparison]').forEach((comparison) => {
    const range = comparison.querySelector('input[type="range"]')
    if (!range) return

    const update = () => {
      comparison.style.setProperty('--pos', `${range.value}%`)
    }

    update()
    range.addEventListener('input', update)
  })
}

const isTouchDevice = () =>
  window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0

const copyToClipboard = async (text) => {
  if (!text) return false
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const success = document.execCommand('copy')
    textarea.remove()
    return success
  } catch {
    return false
  }
}

const callButtonTimeouts = new WeakMap()

const showCallCopied = (button) => {
  const label = button.dataset.callLabel || ''
  const number = button.dataset.callNumber || ''
  if (!button.dataset.callMarkup) {
    button.dataset.callMarkup = button.innerHTML
  }
  button.innerHTML = `<span class="call-pill__label">Copied</span>`

  if (callButtonTimeouts.has(button)) {
    clearTimeout(callButtonTimeouts.get(button))
  }

  const timeout = setTimeout(() => {
    if (label && number) {
      button.innerHTML = callButtonContent(label, number)
    } else if (button.dataset.callMarkup) {
      button.innerHTML = button.dataset.callMarkup
    } else {
      button.textContent = label || number
    }
  }, 1400)

  callButtonTimeouts.set(button, timeout)
}

const handleCallButtonClick = async (event) => {
  const button = event.target.closest('[data-call-button]')
  if (!button) return

  if (isTouchDevice()) return

  event.preventDefault()
  const number = button.dataset.callNumber
  const copied = await copyToClipboard(number)
  if (copied) {
    showCallCopied(button)
  }
}

const handleContactFormSubmit = (event) => {
  const form = event.target.closest('[data-contact-form]')
  if (!form) return

  event.preventDefault()
  const success = form.querySelector('[data-form-success]')
  if (success) {
    success.hidden = false
  }
  form.reset()
}

const lightboxState = {
  isOpen: false,
  items: [],
  index: 0,
  trigger: null,
  root: null,
  image: null,
  closeButton: null,
  prevButton: null,
  nextButton: null,
  originalLink: null
}

const getLightboxFocusable = () => {
  if (!lightboxState.root) return []
  const selectors = [
    'button:not([disabled])',
    'a[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ]
  return Array.from(lightboxState.root.querySelectorAll(selectors.join(',')))
}

const ensureLightbox = () => {
  if (lightboxState.root) return lightboxState

  const root = document.createElement('div')
  root.className = 'lightbox'
  root.setAttribute('data-lightbox-root', '')
  root.setAttribute('aria-hidden', 'true')
  root.innerHTML = `
    <div class="lightbox__backdrop" data-lightbox-close></div>
    <div class="lightbox__panel" role="dialog" aria-modal="true" aria-label="Image preview">
      <div class="lightbox__controls">
        <div class="lightbox__nav-group">
          <button class="lightbox__nav lightbox__prev" type="button" data-lightbox-prev aria-label="Previous image">Prev</button>
          <button class="lightbox__nav lightbox__next" type="button" data-lightbox-next aria-label="Next image">Next</button>
        </div>
        <button class="lightbox__close" type="button" data-lightbox-close aria-label="Close image">Close</button>
      </div>
      <img class="lightbox__image" alt="" loading="lazy" decoding="async" width="1600" height="900" />
      <a class="lightbox__original" href="#" target="_blank" rel="noopener">Open original</a>
    </div>
  `
  document.body.appendChild(root)

  lightboxState.root = root
  lightboxState.image = root.querySelector('.lightbox__image')
  lightboxState.closeButton = root.querySelector('.lightbox__close')
  lightboxState.prevButton = root.querySelector('[data-lightbox-prev]')
  lightboxState.nextButton = root.querySelector('[data-lightbox-next]')
  lightboxState.originalLink = root.querySelector('.lightbox__original')

  root.addEventListener('click', (event) => {
    if (event.target.matches('[data-lightbox-close]')) {
      closeLightbox()
    }
  })

  lightboxState.prevButton.addEventListener('click', () => {
    showLightboxItem(lightboxState.index - 1)
  })

  lightboxState.nextButton.addEventListener('click', () => {
    showLightboxItem(lightboxState.index + 1)
  })

  return lightboxState
}

const getGroupItems = (groupId) => {
  const nodes = Array.from(document.querySelectorAll(`[data-lightbox-group="${groupId}"]`))
  const items = nodes
    .map((node) => ({
      src: node.getAttribute('data-lightbox-src') || '',
      alt: node.getAttribute('data-lightbox-alt') || '',
      index: node.getAttribute('data-lightbox-index')
    }))
    .filter((item) => item.src)

  const hasIndexes = items.every((item) => item.index !== null && item.index !== '')
  if (hasIndexes) {
    items.sort((a, b) => Number(a.index) - Number(b.index))
  }

  return items.map((item) => ({ src: item.src, alt: item.alt }))
}

const showLightboxItem = (index) => {
  const { items, image, originalLink, prevButton, nextButton } = lightboxState
  if (!items.length || !image || !originalLink) return

  let nextIndex = index
  if (nextIndex < 0) nextIndex = items.length - 1
  if (nextIndex >= items.length) nextIndex = 0

  const currentItem = items[nextIndex]
  const src = currentItem.src || ''
  const alt = currentItem.alt || 'Project image'
  lightboxState.index = nextIndex
  image.src = src
  image.alt = alt
  originalLink.href = src

  const hasMultiple = items.length > 1
  prevButton.disabled = !hasMultiple
  nextButton.disabled = !hasMultiple
  prevButton.setAttribute('aria-disabled', hasMultiple ? 'false' : 'true')
  nextButton.setAttribute('aria-disabled', hasMultiple ? 'false' : 'true')
}

const openLightbox = ({ items, index, trigger }) => {
  if (!items.length) return
  const { root, closeButton } = ensureLightbox()

  lightboxState.items = items
  lightboxState.trigger = trigger
  lightboxState.isOpen = true
  root.setAttribute('data-open', 'true')
  root.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'

  showLightboxItem(index)
  requestAnimationFrame(() => {
    closeButton.focus()
  })
}

const closeLightbox = () => {
  if (!lightboxState.isOpen || !lightboxState.root) return
  lightboxState.isOpen = false
  lightboxState.root.removeAttribute('data-open')
  lightboxState.root.setAttribute('aria-hidden', 'true')
  document.body.style.overflow = ''
  const trigger = lightboxState.trigger
  if (trigger && typeof trigger.focus === 'function') {
    trigger.focus()
  }
}

const handleLightboxClick = (event) => {
  const compare = event.target.closest('[data-lightbox-compare]')
  if (compare) {
    const beforeSrc = compare.getAttribute('data-lightbox-before') || ''
    const afterSrc = compare.getAttribute('data-lightbox-after') || ''
    const beforeAlt = compare.getAttribute('data-lightbox-before-alt') || 'Before'
    const afterAlt = compare.getAttribute('data-lightbox-after-alt') || 'After'
    if (!beforeSrc || !afterSrc) return

    const rect = compare.getBoundingClientRect()
    const ratio = rect.width ? (event.clientX - rect.left) / rect.width : 0.5
    const range = compare.querySelector('input[type="range"]')
    const position = range ? Number(range.value) / 100 : 0.5
    const groupId = compare.getAttribute('data-lightbox-group')
    const items = groupId
      ? getGroupItems(groupId)
      : [
        { src: beforeSrc, alt: beforeAlt },
        { src: afterSrc, alt: afterAlt }
      ]
    const index = ratio <= position ? 0 : 1

    openLightbox({ items, index, trigger: compare })
    event.preventDefault()
    return
  }

  const trigger = event.target.closest('[data-lightbox-src]')
  if (!trigger) return
  const src = trigger.getAttribute('data-lightbox-src')
  if (!src) return
  const alt = trigger.getAttribute('data-lightbox-alt') || 'Project image'

  const groupId = trigger.getAttribute('data-lightbox-group')
  let items = [{ src, alt }]
  if (groupId) {
    const groupItems = getGroupItems(groupId)
    items = groupItems.length ? groupItems : [{ src, alt }]
  }

  const indexAttr = trigger.getAttribute('data-lightbox-index')
  const index = indexAttr
    ? Number(indexAttr)
    : Math.max(0, items.findIndex((item) => item.src === src))

  openLightbox({ items, index: Number.isNaN(index) ? 0 : index, trigger })
  event.preventDefault()
}

const handleLightboxKeydown = (event) => {
  if (lightboxState.isOpen) {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeLightbox()
      return
    }
    if (event.key === 'Tab') {
      const focusable = getLightboxFocusable()
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      showLightboxItem(lightboxState.index - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      showLightboxItem(lightboxState.index + 1)
    }
    return
  }

  if (event.key !== 'Enter' && event.key !== ' ') return
  const trigger = event.target.closest('[data-lightbox-src]')
  if (!trigger) return
  if (trigger.tagName === 'BUTTON' || trigger.tagName === 'A') return
  event.preventDefault()
  trigger.click()
}

const initGalleries = () => {
  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const wrapper = gallery.parentElement
    const prevButton = wrapper.querySelector('[data-gallery-prev]')
    const nextButton = wrapper.querySelector('[data-gallery-next]')

    const updateButtons = () => {
      const maxScroll = gallery.scrollWidth - gallery.clientWidth - 2
      if (prevButton) prevButton.disabled = gallery.scrollLeft <= 0
      if (nextButton) nextButton.disabled = gallery.scrollLeft >= maxScroll
    }

    const scrollByAmount = (direction) => {
      gallery.scrollBy({
        left: gallery.clientWidth * 0.9 * direction,
        behavior: 'smooth'
      })
    }

    if (prevButton) {
      prevButton.addEventListener('click', () => scrollByAmount(-1))
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => scrollByAmount(1))
    }

    gallery.addEventListener('scroll', () => {
      window.requestAnimationFrame(updateButtons)
    })

    updateButtons()
  })
}

window.addEventListener('popstate', renderRoute)
document.addEventListener('click', handleLinkClick)
document.addEventListener('click', handleCallButtonClick)
document.addEventListener('click', handleLightboxClick)
document.addEventListener('keydown', handleLightboxKeydown)
document.addEventListener('submit', handleContactFormSubmit)

renderRoute()
