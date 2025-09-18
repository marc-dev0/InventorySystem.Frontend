import { useState, useEffect, useCallback } from 'react'

interface UseStockInitialValidationReturn {
  canPerformStockInitial: boolean
  validationMessage: string | null
  isLoading: boolean
  checkValidation: () => Promise<void>
}

export function useStockInitialValidation(storeCode: string | null, autoCheck = true): UseStockInitialValidationReturn {
  const [canPerformStockInitial, setCanPerformStockInitial] = useState(false)
  const [validationMessage, setValidationMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkValidation = useCallback(async () => {
    if (!storeCode) {
      setCanPerformStockInitial(false)
      setValidationMessage('Debe seleccionar una tienda')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/tandiaimport/stock-initial/validation/${storeCode}`)
      if (response.ok) {
        const data = await response.json()
        setCanPerformStockInitial(data.canPerformStockInitial || false)
        setValidationMessage(data.validationMessage || null)
      } else {
        console.error('Error checking stock initial validation:', response.statusText)
        setCanPerformStockInitial(false)
        setValidationMessage('Error al verificar si se puede realizar la carga de stock inicial')
      }
    } catch (err) {
      console.error('Error checking stock initial validation:', err)
      setCanPerformStockInitial(false)
      setValidationMessage('Error de conexión al verificar la validación')
    } finally {
      setIsLoading(false)
    }
  }, [storeCode])

  // Auto-check when storeCode changes
  useEffect(() => {
    if (autoCheck && storeCode) {
      checkValidation()
    }
  }, [storeCode, autoCheck, checkValidation])

  return {
    canPerformStockInitial,
    validationMessage,
    isLoading,
    checkValidation
  }
}