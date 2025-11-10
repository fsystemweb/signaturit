import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { DocumentItem, NotificationItem, Signer } from '../types'
import { nanoid } from 'nanoid'

type FilterStatus = 'All' | 'Pending' | 'Signed' | 'Declined'

interface AppState {
  documents: DocumentItem[]
  notifications: NotificationItem[]
  filter: FilterStatus
}

type Action =
  | { type: 'ADD_DOCUMENT'; payload: Omit<DocumentItem, 'id' | 'uploadDate' | 'status' | 'signers'> & { file: File } }
  | { type: 'ADD_DOCUMENT_DIRECT'; payload: DocumentItem }
  | { type: 'DELETE_DOCUMENT'; payload: { id: string } }
  | { type: 'UPDATE_DOCUMENT'; payload: DocumentItem }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationItem }
  | { type: 'REMOVE_NOTIFICATION'; payload: { id: string } }

const initialState: AppState = {
  documents: [],
  notifications: [],
  filter: 'All'
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_DOCUMENT_DIRECT':
      return { ...state, documents: [action.payload, ...state.documents] }
    case 'DELETE_DOCUMENT':
      return { ...state, documents: state.documents.filter(d => d.id !== action.payload.id) }
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(d => (d.id === action.payload.id ? action.payload : d))
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] }
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload.id) }
    default:
      return state
  }
}

interface AppContextValue extends AppState {
  addUploadedDocument: (file: File) => DocumentItem
  deleteDocument: (id: string) => void
  updateDocument: (doc: DocumentItem) => void
  setFilter: (filter: FilterStatus) => void
  notify: (item: Omit<NotificationItem, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  sendSignatureRequest: (docId: string, signers: Array<{ email: string }>, message?: string) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addUploadedDocument = (file: File): DocumentItem => {
    const newDoc: DocumentItem = {
      id: nanoid(),
      filename: file.name,
      fileType: file.type || guessType(file.name),
      fileSize: file.size,
      uploadDate: new Date(),
      status: 'Pending',
      signers: []
    }
    dispatch({ type: 'ADD_DOCUMENT_DIRECT', payload: newDoc })
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: nanoid(),
        type: 'Uploaded',
        documentName: newDoc.filename,
        timestamp: new Date()
      }
    })
    return newDoc
  }

  const deleteDocument = (id: string) => dispatch({ type: 'DELETE_DOCUMENT', payload: { id } })
  const updateDocument = (doc: DocumentItem) => dispatch({ type: 'UPDATE_DOCUMENT', payload: doc })
  const setFilter = (filter: FilterStatus) => dispatch({ type: 'SET_FILTER', payload: filter })
  const notify = (item: Omit<NotificationItem, 'id' | 'timestamp'>) =>
    dispatch({ type: 'ADD_NOTIFICATION', payload: { ...item, id: nanoid(), timestamp: new Date() } })
  const removeNotification = (id: string) => dispatch({ type: 'REMOVE_NOTIFICATION', payload: { id } })

  const sendSignatureRequest = (docId: string, signers: Array<{ email: string }>, _message?: string) => {
    const doc = state.documents.find(d => d.id === docId)
    if (!doc) return
    const enrichedSigners: Signer[] = [
      ...doc.signers,
      ...signers.map(s => ({ id: nanoid(), email: s.email, status: 'Pending' as const }))
    ]
    const updated: DocumentItem = {
      ...doc,
      status: enrichedSigners.length > 0 ? 'Pending' : doc.status,
      signers: enrichedSigners
    }
    dispatch({ type: 'UPDATE_DOCUMENT', payload: updated })
    notify({ type: 'RequestSent', documentName: doc.filename })
  }

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      addUploadedDocument,
      deleteDocument,
      updateDocument,
      setFilter,
      notify,
      removeNotification,
      sendSignatureRequest
    }),
    [state]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider')
  }
  return ctx
}

function guessType(name: string): string {
  const lower = name.toLowerCase()
  if (lower.endsWith('.pdf')) return 'application/pdf'
  if (lower.endsWith('.doc')) return 'application/msword'
  if (lower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (lower.endsWith('.xlsx')) return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  return 'application/octet-stream'
}

