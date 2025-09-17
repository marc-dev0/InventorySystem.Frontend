import React, { useState, useEffect } from 'react'
import { salesService } from '../services/api'
import { formatPrice } from '../utils/currency'
import type { SaleDetail, SaleDetailsResponse } from '../types'

interface SaleDetailsProps {
  saleId: number
  onClose?: () => void
}

export const SaleDetailsComponent: React.FC<SaleDetailsProps> = ({ saleId, onClose }) => {
  const [details, setDetails] = useState<SaleDetailsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await salesService.getDetails(saleId)
        setDetails(response)
      } catch (err) {
        setError('Error al cargar el detalle de la venta')
        console.error('Error fetching sale details:', err)
      } finally {
        setLoading(false)
      }
    }

    if (saleId) {
      fetchDetails()
    }
  }, [saleId])

  if (loading) {
    return (
      <div className="p-4 bg-gray-50">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200">
        <div className="text-red-800 text-sm">{error}</div>
      </div>
    )
  }

  if (!details) {
    return (
      <div className="p-4 bg-gray-50">
        <div className="text-gray-600 text-sm">No se encontraron detalles para esta venta</div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200">
      <div className="mb-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Detalle de Venta #{details.saleNumber}
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
          <div>
            <span className="font-medium">Fecha:</span>{' '}
            {new Date(details.saleDate).toLocaleDateString('es-ES')}
          </div>
          <div>
            <span className="font-medium">Cliente:</span>{' '}
            {details.customerName || 'Cliente Genérico'}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Unit.
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {details.details.map((detail: SaleDetail) => (
              <tr key={detail.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {detail.productCode}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="font-medium text-gray-900">{detail.productName}</div>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {detail.quantity.toLocaleString('es-ES', { maximumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="text-gray-600">
                    {formatPrice(detail.unitPrice)}
                  </span>
                </td>
                <td className="px-3 py-2 text-right">
                  <span className="font-semibold text-green-600">
                    {formatPrice(detail.subtotal)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-4 border-t pt-3">
        <div className="flex justify-end space-y-1">
          <div className="text-right">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Subtotal:</span> {formatPrice(details.subTotal)}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">Impuestos:</span> {formatPrice(details.taxes)}
            </div>
            <div className="text-lg font-bold text-green-600 border-t pt-1">
              <span className="font-medium">Total:</span> {formatPrice(details.total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}