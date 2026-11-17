import HidePasswordIcon from './hide-password.svg?react'
import ShowPasswordIcon from './show-password.svg?react'

const VISIBILITY_TOGGLE_LABEL = 'Afficher le mot de passe'

type PasswordVisibilityToggleProps = {
  isPasswordVisible: boolean
  onToggle: () => void
}

export function PasswordVisibilityToggle({ isPasswordVisible, onToggle }: PasswordVisibilityToggleProps) {
  return (
    <button
      type="button"
      aria-label={VISIBILITY_TOGGLE_LABEL}
      aria-pressed={isPasswordVisible}
      onClick={onToggle}
    >
      {isPasswordVisible ? <HidePasswordIcon /> : <ShowPasswordIcon />}
    </button>
  )
}
