"use client";

import React, { useEffect, useState } from 'react';
import Editor, { OnMount } from "@monaco-editor/react";
import * as Y from 'yjs';
// import { MonacoBinding } from 'y-monaco'; // Imported dynamically to fix SSR
import { useYjs } from './providers/YjsProvider';
import { useUser } from './providers/UserProvider';
import { getLanguageFromFilename } from '@/lib/fileUtils';

interface CodeEditorProps {
    fileId: string | null;
    fileName?: string;
    onValidate?: (markers: any[]) => void;
}

export default function CodeEditor(props: CodeEditorProps) {
    const { fileId, fileName } = props;
    const { doc, provider } = useYjs();
    const user = useUser();
    const [editor, setEditor] = useState<any>(null);


    const language = fileName ? getLanguageFromFilename(fileName) : 'javascript';

    useEffect(() => {
        if (!editor || !fileId || !doc || !provider) return;

        let binding: any;

        // Dynamic import to avoid SSR window error from monaco-editor
        import('y-monaco').then(({ MonacoBinding }) => {
            const yText = doc.getText(fileId);
            const model = editor.getModel();

            // Create new binding
            binding = new MonacoBinding(
                yText,
                model,
                new Set([editor]),
                provider.awareness
            );
        });

        return () => {
            if (binding) binding.destroy();
        };
    }, [fileId, editor, doc, provider]);

    useEffect(() => {
        // Update language if cached model allows or just force re-render via Key if needed
        // Monaco handles language change on model if we use monaco.editor.setModelLanguage
        // But @monaco-editor/react handles it via prop if we change it.
    }, [language]);

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        setEditor(editor);
    };

    function handleEditorValidation(markers: any[]) {
        // Bubble up if prop provided (we'll add this prop next)
        if (props.onValidate) {
            props.onValidate(markers);
        }
    }

    if (!fileId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-navy-900 text-gray-500">
                <p>Select a file to edit</p>
            </div>
        );
    }

    return (
        <div className="flex-1 h-full overflow-hidden bg-navy-900">
            <Editor
                height="100vh"
                theme="vs-dark" // We might want to customize this later to match navy
                language={language}
                onMount={handleEditorDidMount}
                onValidate={handleEditorValidation}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                    tabSize: 2,
                    fontFamily: "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
                    fontLigatures: true,
                }}
            />
        </div>
    );
}
