import {
  collectionAssetsByCategory,
  projectAssetsBySlug
} from './assets.generated.js'

const getCollectionAssets = (category, id) =>
  collectionAssetsByCategory?.[category]?.[id] || { cover: '', images: [] }

const withCollectionAssets = (category, item) => {
  const assets = getCollectionAssets(category, item.id)
  const images = assets.images && assets.images.length
    ? assets.images
    : assets.cover
      ? [assets.cover]
      : []

  return {
    ...item,
    imageSrc: assets.cover || '',
    images
  }
}

const getProjectAssets = (slug) =>
  projectAssetsBySlug?.[slug] || {
    sliderBefore: '',
    sliderAfter: '',
    beforeGallery: [],
    afterGallery: []
  }

const withProjectAssets = (project) => {
  const assets = getProjectAssets(project.slug)
  const coverImage = assets.sliderAfter || assets.sliderBefore || ''

  return {
    ...project,
    coverImage,
    beforeImage: assets.sliderBefore || '',
    afterImage: assets.sliderAfter || '',
    beforeGallery: assets.beforeGallery || [],
    afterGallery: assets.afterGallery || []
  }
}

const roofingCollectionBase = [
  { id: 're-roof', label: 'Re-roof', tag: 'Composite' },
  { id: 'patch', label: 'Patch', tag: 'Metal' },
  { id: 'tile-reset', label: 'Tile reset', tag: 'Tile' }
]

const roofingPreviewBase = [
  { id: 're-roof', label: 'Re-roof', tag: 'Composite' },
  { id: 'patch', label: 'Patch', tag: 'Metal' },
  { id: 'tile-reset', label: 'Tile reset', tag: 'Tile' }
]

const installationCollectionBase = [
  { id: 'window-install', label: 'Window install' },
  { id: 'door-install', label: 'Door install' },
  { id: 'gate-install', label: 'Gate install' }
]

const installationPreviewBase = [
  { id: 'window-install', label: 'Window install' },
  { id: 'door-install', label: 'Door install' },
  { id: 'gate-install', label: 'Gate install' }
]

const paintingCollectionBase = [
  { id: 'exterior-paint', label: 'Exterior paint' },
  { id: 'interior-paint', label: 'Interior paint' },
  { id: 'trim-paint', label: 'Trim paint' }
]

const paintingPreviewBase = [
  { id: 'exterior-paint', label: 'Exterior paint' },
  { id: 'interior-paint', label: 'Interior paint' },
  { id: 'trim-paint', label: 'Trim paint' }
]

const wholeProjectsBase = [
  {
    id: 'grape-street-project',
    slug: 'grape-street',
    title: 'Grape Street Project',
    summary: 'Full restoration and remodel.',
    services: ['Restoration', 'Remodel']
  },
  {
    id: '63rd-place-project',
    slug: '63rd-place',
    title: '63rd Place Project',
    summary: 'Structural repairs and interior updates.',
    services: ['Structural repair', 'Interior updates']
  }
]

export const roofingCollection = roofingCollectionBase.map((item) =>
  withCollectionAssets('roofing', item)
)

export const roofingPreview = roofingPreviewBase.map((item) =>
  withCollectionAssets('roofing', item)
)

export const installationCollection = installationCollectionBase.map((item) =>
  withCollectionAssets('installation', item)
)

export const installationPreview = installationPreviewBase.map((item) =>
  withCollectionAssets('installation', item)
)

export const paintingCollection = paintingCollectionBase.map((item) =>
  withCollectionAssets('painting', item)
)

export const paintingPreview = paintingPreviewBase.map((item) =>
  withCollectionAssets('painting', item)
)

export const wholeProjects = wholeProjectsBase.map((project) =>
  withProjectAssets(project)
)
