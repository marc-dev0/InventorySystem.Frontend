import React, { useState, useEffect } from 'react'
import { importService } from '../services/imports'
import type { BackgroundJob } from '../types'

interface JobStatusProps {
  jobId?: string
  showUserJobs?: boolean
  onJobCompleted?: () => void
}

export const JobStatus: React.FC<JobStatusProps> = ({ jobId, showUserJobs = false, onJobCompleted }) => {
  const [job, setJob] = useState<BackgroundJob | null>(null)
  const [jobs, setJobs] = useState<BackgroundJob[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (jobId) {
      fetchJobStatus()
      const interval = setInterval(fetchJobStatus, 2000) // Poll every 2 seconds
      return () => clearInterval(interval)
    } else if (showUserJobs) {
      fetchUserJobs()
      const interval = setInterval(fetchUserJobs, 2000) // Poll user jobs too
      return () => clearInterval(interval)
    }
  }, [jobId, showUserJobs])

  const fetchJobStatus = async () => {
    if (!jobId) return
    
    try {
      setLoading(true)
      const jobData = await importService.getJobStatus(jobId)
      
      // Check if job just completed and call the callback
      const isCompleted = (status: string) => status === 'COMPLETED' || status === 'COMPLETED_WITH_WARNINGS'
      if (job && !isCompleted(job.status) && isCompleted(jobData.status) && onJobCompleted) {
        onJobCompleted()
      }
      
      setJob(jobData)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al obtener el estado del trabajo')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserJobs = async () => {
    try {
      setLoading(true)
      const jobsData = await importService.getUserJobs()
      
      // Check if any job just completed and call the callback
      if (jobs.length > 0 && onJobCompleted) {
        const previousJobs = jobs
        const newJobs = jobsData
        const isCompleted = (status: string) => status === 'COMPLETED' || status === 'COMPLETED_WITH_WARNINGS'
        
        for (const newJob of newJobs) {
          const previousJob = previousJobs.find(j => j.jobId === newJob.jobId)
          if (previousJob && !isCompleted(previousJob.status) && isCompleted(newJob.status)) {
            onJobCompleted()
            break // Only call once even if multiple jobs completed
          }
        }
      }
      
      setJobs(jobsData)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al obtener los trabajos')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'queued': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'completed_with_warnings': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getJobTypeLabel = (jobType: string) => {
    switch (jobType) {
      case 'PRODUCTS_IMPORT': return 'Productos'
      case 'STOCK_IMPORT': return 'Stock'
      case 'SALES_IMPORT': return 'Ventas'
      default: return jobType
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-ES')
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (showUserJobs) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Mis Trabajos de Importación</h3>
        
        {loading && jobs.length === 0 ? (
          <p className="text-gray-500">Cargando trabajos...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No tienes trabajos de importación</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.jobId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{getJobTypeLabel(job.jobType)}</h4>
                    <p className="text-sm text-gray-600">{job.fileName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>Total: {job.totalRecords}</div>
                  <div>Exitosos: {job.successRecords}</div>
                  <div>Errores: {job.errorRecords}</div>
                  <div>Iniciado: {formatDate(job.startedAt)}</div>
                </div>
                
                {job.progressPercentage > 0 && (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progressPercentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{job.progressPercentage}% completado</p>
                  </div>
                )}
                
                {job.detailedErrors && job.detailedErrors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-600">Errores:</p>
                    <ul className="text-xs text-red-600 mt-1">
                      {job.detailedErrors.slice(0, 3).map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                      {job.detailedErrors.length > 3 && (
                        <li>• Y {job.detailedErrors.length - 3} errores más...</li>
                      )}
                    </ul>
                  </div>
                )}
                
                {job.detailedWarnings && job.detailedWarnings.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-yellow-600">Advertencias:</p>
                    <ul className="text-xs text-yellow-600 mt-1">
                      {job.detailedWarnings.slice(0, 3).map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                      {job.detailedWarnings.length > 3 && (
                        <li>• Y {job.detailedWarnings.length - 3} advertencias más...</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!job) {
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Estado del Trabajo</h3>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{getJobTypeLabel(job.jobType)}</p>
            <p className="text-sm text-gray-600">{job.fileName}</p>
            <p className="text-xs text-gray-500">ID: {job.jobId}</p>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>
        
        {job.progressPercentage > 0 && (
          <div>
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${job.progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{job.progressPercentage}% completado</p>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-50 p-3 rounded">
            <p className="font-medium text-gray-700">Total de registros</p>
            <p className="text-lg font-bold text-blue-600">{job.totalRecords}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="font-medium text-gray-700">Procesados exitosamente</p>
            <p className="text-lg font-bold text-green-600">{job.successRecords}</p>
          </div>
          <div className="bg-red-50 p-3 rounded">
            <p className="font-medium text-gray-700">Errores</p>
            <p className="text-lg font-bold text-red-600">{job.errorRecords}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded">
            <p className="font-medium text-gray-700">Advertencias</p>
            <p className="text-lg font-bold text-yellow-600">{job.warningRecords}</p>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Iniciado: {formatDate(job.startedAt)}</p>
          {job.completedAt && <p>Completado: {formatDate(job.completedAt)}</p>}
          <p>Iniciado por: {job.startedBy}</p>
        </div>
        
        {job.errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="font-medium text-red-700">Error:</p>
            <p className="text-red-600 text-sm">{job.errorMessage}</p>
          </div>
        )}
        
        {job.detailedErrors && job.detailedErrors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <p className="font-medium text-red-700 mb-2">Errores detallados:</p>
            <ul className="text-red-600 text-sm space-y-1">
              {job.detailedErrors.slice(0, 5).map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
              {job.detailedErrors.length > 5 && (
                <li className="text-red-500">• Y {job.detailedErrors.length - 5} errores más...</li>
              )}
            </ul>
          </div>
        )}
        
        {job.detailedWarnings && job.detailedWarnings.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <p className="font-medium text-yellow-700 mb-2">Advertencias detalladas:</p>
            <ul className="text-yellow-600 text-sm space-y-1">
              {job.detailedWarnings.slice(0, 5).map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
              {job.detailedWarnings.length > 5 && (
                <li className="text-yellow-500">• Y {job.detailedWarnings.length - 5} advertencias más...</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}