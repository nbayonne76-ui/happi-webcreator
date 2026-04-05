'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Block, DevicePreview, Page, PageSeo, Project } from '@/types';
import { createProject } from '@/lib/defaults';
import { nanoid } from '@/lib/nanoid';

// ─── Editor slice ─────────────────────────────────────────────────────────────

interface EditorSlice {
  // Current project being edited
  currentProjectId: string | null;
  currentPageId: string | null;
  selectedBlockId: string | null;
  devicePreview: DevicePreview;
  showGrid: boolean;
  showOutlines: boolean;

  // History for undo/redo
  past: Block[][];
  future: Block[][];

  // Panel states
  activePanel: 'blocks' | 'layers' | 'pages' | null;
  propertiesOpen: boolean;

  // Actions
  setCurrentProject: (id: string) => void;
  setCurrentPage: (id: string) => void;
  selectBlock: (id: string | null) => void;
  setDevicePreview: (device: DevicePreview) => void;
  setActivePanel: (panel: 'blocks' | 'layers' | 'pages' | null) => void;
  setPropertiesOpen: (open: boolean) => void;
  toggleGrid: () => void;
  toggleOutlines: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

// ─── Projects slice ───────────────────────────────────────────────────────────

interface ProjectsSlice {
  projects: Project[];
  addProject: (name: string, templateId: string) => Project;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;

  // Block operations
  addBlock: (projectId: string, pageId: string, block: Block, index?: number) => void;
  removeBlock: (projectId: string, pageId: string, blockId: string) => void;
  updateBlock: (projectId: string, pageId: string, blockId: string, props: Record<string, unknown>) => void;
  moveBlock: (projectId: string, pageId: string, fromIndex: number, toIndex: number) => void;
  duplicateBlock: (projectId: string, pageId: string, blockId: string) => void;

  // Page operations
  addPage: (projectId: string, name: string) => void;
  removePage: (projectId: string, pageId: string) => void;
  renamePage: (projectId: string, pageId: string, name: string) => void;

  // Theme
  updateTheme: (projectId: string, theme: Partial<Project['theme']>) => void;

  // SEO
  updatePageSeo: (projectId: string, pageId: string, seo: Partial<PageSeo>) => void;
}

// ─── Combined store ───────────────────────────────────────────────────────────

type Store = EditorSlice & ProjectsSlice;

export const useEditorStore = create<Store>()(
  persist(
    (set, get) => ({
      // ── Editor state ──
      currentProjectId: null,
      currentPageId: null,
      selectedBlockId: null,
      devicePreview: 'desktop',
      showGrid: false,
      showOutlines: false,
      past: [],
      future: [],
      activePanel: 'blocks',
      propertiesOpen: false,

      // ── Projects ──
      projects: [],

      // ── Editor actions ──
      setCurrentProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        set({
          currentProjectId: id,
          currentPageId: project?.pages[0]?.id ?? null,
          selectedBlockId: null,
          past: [],
          future: [],
        });
      },

      setCurrentPage: (id) => set({ currentPageId: id, selectedBlockId: null }),

      selectBlock: (id) => set({ selectedBlockId: id, propertiesOpen: id !== null }),

      setDevicePreview: (device) => set({ devicePreview: device }),

      setActivePanel: (panel) => set({ activePanel: panel }),

      setPropertiesOpen: (open) => set({ propertiesOpen: open }),

      toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),

      toggleOutlines: () => set((s) => ({ showOutlines: !s.showOutlines })),

      canUndo: () => get().past.length > 0,
      canRedo: () => get().future.length > 0,

      undo: () => {
        const { past, future, currentProjectId, currentPageId, projects } = get();
        if (!past.length || !currentProjectId || !currentPageId) return;
        const previous = past[past.length - 1];
        const currentBlocks = getCurrentBlocks(projects, currentProjectId, currentPageId);

        set({
          past: past.slice(0, -1),
          future: [currentBlocks, ...future],
          projects: setBlocks(projects, currentProjectId, currentPageId, previous),
        });
      },

      redo: () => {
        const { past, future, currentProjectId, currentPageId, projects } = get();
        if (!future.length || !currentProjectId || !currentPageId) return;
        const next = future[0];
        const currentBlocks = getCurrentBlocks(projects, currentProjectId, currentPageId);

        set({
          past: [...past, currentBlocks],
          future: future.slice(1),
          projects: setBlocks(projects, currentProjectId, currentPageId, next),
        });
      },

      // ── Project actions ──
      addProject: (name, templateId) => {
        const project = createProject(name, templateId);
        set((s) => ({ projects: [project, ...s.projects] }));
        return project;
      },

      deleteProject: (id) =>
        set((s) => ({ projects: s.projects.filter((p) => p.id !== id) })),

      duplicateProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return;
        const now = new Date().toISOString();
        const copy: Project = {
          ...project,
          id: nanoid(),
          name: `${project.name} (copie)`,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ projects: [copy, ...s.projects] }));
      },

      renameProject: (id, name) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
          ),
        })),

      // ── Block actions ──
      addBlock: (projectId, pageId, block, index) => {
        const { projects } = get();
        const currentBlocks = getCurrentBlocks(projects, projectId, pageId);
        const newBlocks = [...currentBlocks];
        if (index !== undefined) newBlocks.splice(index, 0, block);
        else newBlocks.push(block);

        set((s) => ({
          past: [...s.past.slice(-20), currentBlocks],
          future: [],
          projects: setBlocks(s.projects, projectId, pageId, newBlocks),
        }));
      },

      removeBlock: (projectId, pageId, blockId) => {
        const { projects } = get();
        const currentBlocks = getCurrentBlocks(projects, projectId, pageId);
        set((s) => ({
          past: [...s.past.slice(-20), currentBlocks],
          future: [],
          selectedBlockId: s.selectedBlockId === blockId ? null : s.selectedBlockId,
          projects: setBlocks(s.projects, projectId, pageId, currentBlocks.filter((b) => b.id !== blockId)),
        }));
      },

      updateBlock: (projectId, pageId, blockId, props) => {
        const { projects } = get();
        const currentBlocks = getCurrentBlocks(projects, projectId, pageId);
        const newBlocks = currentBlocks.map((b) =>
          b.id === blockId ? { ...b, props: { ...b.props, ...props } } : b
        );
        set((s) => ({
          past: [...s.past.slice(-20), currentBlocks],
          future: [],
          projects: setBlocks(s.projects, projectId, pageId, newBlocks),
        }));
      },

      moveBlock: (projectId, pageId, fromIndex, toIndex) => {
        const { projects } = get();
        const currentBlocks = getCurrentBlocks(projects, projectId, pageId);
        const newBlocks = [...currentBlocks];
        const [moved] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, moved);
        set((s) => ({
          past: [...s.past.slice(-20), currentBlocks],
          future: [],
          projects: setBlocks(s.projects, projectId, pageId, newBlocks),
        }));
      },

      duplicateBlock: (projectId, pageId, blockId) => {
        const { projects } = get();
        const currentBlocks = getCurrentBlocks(projects, projectId, pageId);
        const idx = currentBlocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return;
        const copy = { ...currentBlocks[idx], id: nanoid() };
        const newBlocks = [...currentBlocks];
        newBlocks.splice(idx + 1, 0, copy);
        set((s) => ({
          past: [...s.past.slice(-20), currentBlocks],
          future: [],
          projects: setBlocks(s.projects, projectId, pageId, newBlocks),
        }));
      },

      // ── Page actions ──
      addPage: (projectId, name) => {
        const slug = `/${name.toLowerCase().replace(/\s+/g, '-')}`;
        const page: Page = { id: nanoid(), name, slug, blocks: [] };
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, pages: [...p.pages, page], updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      removePage: (projectId, pageId) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, pages: p.pages.filter((pg) => pg.id !== pageId), updatedAt: new Date().toISOString() }
              : p
          ),
          currentPageId: s.currentPageId === pageId ? null : s.currentPageId,
        }));
      },

      renamePage: (projectId, pageId, name) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  pages: p.pages.map((pg) => (pg.id === pageId ? { ...pg, name } : pg)),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        }));
      },

      updateTheme: (projectId, theme) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, theme: { ...p.theme, ...theme }, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      updatePageSeo: (projectId, pageId, seo) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  updatedAt: new Date().toISOString(),
                  pages: p.pages.map((pg) =>
                    pg.id === pageId ? { ...pg, seo: { ...pg.seo, title: pg.seo?.title ?? '', description: pg.seo?.description ?? '', slug: pg.slug, ...seo } } : pg
                  ),
                }
              : p
          ),
        }));
      },
    }),
    {
      name: 'happi-webcreator-store',
      partialize: (state) => ({ projects: state.projects }),
    }
  )
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCurrentBlocks(projects: Project[], projectId: string, pageId: string): Block[] {
  return projects.find((p) => p.id === projectId)?.pages.find((pg) => pg.id === pageId)?.blocks ?? [];
}

function setBlocks(projects: Project[], projectId: string, pageId: string, blocks: Block[]): Project[] {
  return projects.map((p) =>
    p.id === projectId
      ? {
          ...p,
          updatedAt: new Date().toISOString(),
          pages: p.pages.map((pg) => (pg.id === pageId ? { ...pg, blocks } : pg)),
        }
      : p
  );
}

// ─── Selectors ────────────────────────────────────────────────────────────────

export function useCurrentProject() {
  return useEditorStore((s) => s.projects.find((p) => p.id === s.currentProjectId) ?? null);
}

export function useCurrentPage() {
  const project = useCurrentProject();
  const pageId = useEditorStore((s) => s.currentPageId);
  return project?.pages.find((pg) => pg.id === pageId) ?? null;
}

export function useCurrentBlocks(): Block[] {
  const page = useCurrentPage();
  return page?.blocks ?? [];
}

export function useSelectedBlock() {
  const page = useCurrentPage();
  const selectedId = useEditorStore((s) => s.selectedBlockId);
  return page?.blocks.find((b) => b.id === selectedId) ?? null;
}
