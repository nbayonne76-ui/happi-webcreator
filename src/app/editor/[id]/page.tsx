'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEditorStore } from '@/store/useEditorStore';
import Topbar from '@/components/editor/Topbar';
import Sidebar from '@/components/editor/Sidebar';
import Canvas from '@/components/editor/Canvas';
import PropertiesPanel from '@/components/editor/PropertiesPanel';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { projects, setCurrentProject, currentProjectId } = useEditorStore();

  useEffect(() => {
    const project = projects.find((p) => p.id === id);
    if (!project) {
      router.replace('/dashboard');
      return;
    }
    if (currentProjectId !== id) {
      setCurrentProject(id);
    }
  }, [id, projects, currentProjectId, setCurrentProject, router]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { undo, redo, canUndo, canRedo } = useEditorStore.getState();
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        if (canRedo()) redo();
      }
      if (e.key === 'Escape') {
        useEditorStore.getState().selectBlock(null);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
