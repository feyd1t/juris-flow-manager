
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Função para checar se é mobile
    const checkIsMobile = () => {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      setIsMobile(mql.matches)
    }
    
    // Verificação inicial
    checkIsMobile()
    
    // Adiciona o listener para mudanças na janela
    window.addEventListener("resize", checkIsMobile)
    
    // Cleanup function
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return !!isMobile
}

// Função auxiliar para usar em componentes que necessitam conhecer o tamanho da tela
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })
  
  React.useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    
    window.addEventListener('resize', handleResize)
    
    // Verificação inicial
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  return {
    ...screenSize,
    isMobile: screenSize.width < MOBILE_BREAKPOINT,
    isTablet: screenSize.width >= MOBILE_BREAKPOINT && screenSize.width < 1024,
    isDesktop: screenSize.width >= 1024,
  }
}
