import { Toaster } from 'sonner'
import { useThemeStore } from '../../store/useThemeStore'

function AppToaster() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <Toaster
      theme={theme}
      position="bottom-center"
      richColors
      closeButton
      duration={3200}
      offset={72}
      mobileOffset={88}
    />
  )
}

export default AppToaster
