import { create } from 'zustand'

interface UIState {
  isSidebarCollapsed: boolean
  isMobile: boolean
  theme: 'light' | 'dark' | 'system'
  activeDocumentId: string | null
  selectedDocuments: string[]
  isUploading: boolean
  uploadProgress: number
}

interface UIActions {
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setMobile: (mobile: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setActiveDocument: (id: string | null) => void
  selectDocument: (id: string) => void
  deselectDocument: (id: string) => void
  selectAllDocuments: (ids: string[]) => void
  clearSelection: () => void
  setUploading: (uploading: boolean) => void
  setUploadProgress: (progress: number) => void
}

type UIStore = UIState & UIActions

export const useUIStore = create<UIStore>((set) => ({
  // State
  isSidebarCollapsed: false,
  isMobile: false,
  theme: 'system',
  activeDocumentId: null,
  selectedDocuments: [],
  isUploading: false,
  uploadProgress: 0,

  // Actions
  toggleSidebar: () => set((state) => ({
    isSidebarCollapsed: !state.isSidebarCollapsed,
  })),

  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),

  setMobile: (isMobile) => set({ isMobile }),

  setTheme: (theme) => set({ theme }),

  setActiveDocument: (activeDocumentId) => set({ activeDocumentId }),

  selectDocument: (id) => set((state) => ({
    selectedDocuments: state.selectedDocuments.includes(id)
      ? state.selectedDocuments
      : [...state.selectedDocuments, id],
  })),

  deselectDocument: (id) => set((state) => ({
    selectedDocuments: state.selectedDocuments.filter((docId) => docId !== id),
  })),

  selectAllDocuments: (selectedDocuments) => set({ selectedDocuments }),

  clearSelection: () => set({ selectedDocuments: [] }),

  setUploading: (isUploading) => set({ isUploading }),

  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
}))