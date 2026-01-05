"use client";

import { useState, useEffect } from 'react';

export interface Project {
    id: string;
    name: string;
    createdAt: string; // ISO string
    lastOpenedAt: string; // ISO string
}

const STORAGE_KEY = 'zencodr_projects';

export function useProjects() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setProjects(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse projects', e);
            }
        }
    }, []);

    const saveProjects = (newProjects: Project[]) => {
        setProjects(newProjects);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
    };

    const addProject = (id: string, name: string) => {
        const newProject: Project = {
            id,
            name: name || 'Untitled Project',
            createdAt: new Date().toISOString(),
            lastOpenedAt: new Date().toISOString(),
        };
        const updated = [newProject, ...projects];
        saveProjects(updated);
        return newProject;
    };

    const removeProject = (id: string) => {
        const updated = projects.filter(p => p.id !== id);
        saveProjects(updated);
    };

    const updateLastOpened = (id: string) => {
        const updated = projects.map(p =>
            p.id === id ? { ...p, lastOpenedAt: new Date().toISOString() } : p
        );
        // Sort by last opened
        updated.sort((a, b) => new Date(b.lastOpenedAt).getTime() - new Date(a.lastOpenedAt).getTime());
        saveProjects(updated);
    };

    return { projects, addProject, removeProject, updateLastOpened };
}
