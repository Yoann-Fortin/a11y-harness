import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const ROOT_ELEMENT_ID = 'root'
const MISSING_ROOT_MESSAGE = `Missing #${ROOT_ELEMENT_ID} element`
const PAGE_TITLE = 'Bac à sable a11y-harness'

const rootElement = document.getElementById(ROOT_ELEMENT_ID)

if (rootElement === null) {
  throw new Error(MISSING_ROOT_MESSAGE)
}

createRoot(rootElement).render(
  <StrictMode>
    <main>
      <h1>{PAGE_TITLE}</h1>
    </main>
  </StrictMode>,
)
