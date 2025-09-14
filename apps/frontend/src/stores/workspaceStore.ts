import { create } from 'zustand'
import { Workspace } from '@shared'

interface WorkspaceState {
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  isLoading: boolean
  error: string | null
}

interface WorkspaceActions {
  setWorkspaces: (workspaces: Workspace[]) => void
  setCurrentWorkspace: (workspace: Workspace | null) => void
  addWorkspace: (workspace: Workspace) => void
  updateWorkspace: (id: string, updates: Partial<Workspace>) => void
  removeWorkspace: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

type WorkspaceStore = WorkspaceState & WorkspaceActions

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  // State
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  // Actions
  setWorkspaces: (workspaces) => set({ workspaces }),

  setCurrentWorkspace: (currentWorkspace) => set({ currentWorkspace }),

  addWorkspace: (workspace) => set((state) => ({
    workspaces: [...state.workspaces, workspace],
  })),

  updateWorkspace: (id, updates) => set((state) => ({
    workspaces: state.workspaces.map((workspace) => 
      workspace.id === id ? { ...workspace, ...updates } : workspace
    ),
    currentWorkspace: state.currentWorkspace?.id === id 
      ? { ...state.currentWorkspace, ...updates }
      : state.currentWorkspace,
  })),

  removeWorkspace: (id) => set((state) => ({
    workspaces: state.workspaces.filter((workspace) => workspace.id !== id),
    currentWorkspace: state.currentWorkspace?.id === id ? null : state.currentWorkspace,
  })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}))