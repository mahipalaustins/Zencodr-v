
export function getLanguageFromFilename(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'py':
            return 'python';
        case 'java':
            return 'java';
        case 'cpp':
        case 'cc':
        case 'c':
        case 'h':
            return 'cpp';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        default:
            return 'plaintext';
    }
}

export function getIconColor(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js': return 'text-yellow-400';
        case 'ts': return 'text-blue-500';
        case 'jsx': return 'text-yellow-500';
        case 'tsx': return 'text-blue-400';
        case 'html': return 'text-orange-500';
        case 'css': return 'text-blue-300';
        case 'py': return 'text-green-400';
        case 'java': return 'text-red-500';
        default: return 'text-gray-400';
    }
}
