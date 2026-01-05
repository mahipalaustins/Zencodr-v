"use client";

import React from 'react';
import { Trash2, ExternalLink, Code2, Clock } from 'lucide-react';
import { Project } from '@/lib/hooks/useProjects';
import Link from 'next/link';

interface ProjectTableProps {
    projects: Project[];
    onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function ProjectTable({ projects, onDelete }: ProjectTableProps) {
    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 border border-white/5 rounded-xl bg-navy-800/50">
                <Code2 size={48} className="mb-4 text-gray-600 opacity-50" />
                <h3 className="text-xl font-medium text-gray-300 mb-2">No projects yet</h3>
                <p className="text-sm">Create your first project to get started!</p>
            </div>
        );
    }

    // Format date helper
    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-navy-800/30 backdrop-blur-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Project</th>
                        <th className="px-6 py-4 font-medium hidden md:table-cell">Created</th>
                        <th className="px-6 py-4 font-medium hidden sm:table-cell">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {projects.map((project) => (
                        <tr
                            key={project.id}
                            className="group hover:bg-white/5 transition-colors cursor-pointer"
                            onClick={() => window.location.href = `/room/${project.id}`}
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded bg-gradient-to-br from-cyan/20 to-purple/20 text-cyan">
                                        <Code2 size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white group-hover:text-cyan transition-colors">{project.name}</h4>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5 max-w-[150px] truncate">{project.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-400 text-sm hidden md:table-cell">
                                <span className="flex items-center gap-2">
                                    {formatDate(project.createdAt)}
                                </span>
                            </td>
                            <td className="px-6 py-4 hidden sm:table-cell">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                    <Link
                                        href={`/room/${project.id}`}
                                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title="Open Project"
                                    >
                                        <ExternalLink size={16} />
                                    </Link>
                                    <button
                                        onClick={(e) => onDelete(project.id, e)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
