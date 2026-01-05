"use client";

import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { useYjs } from './providers/YjsProvider';
import * as Y from 'yjs';
import { v4 as uuidv4 } from 'uuid';

export default function TerminalComponent() {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);
    const prompt = '\x1b[1;32muser@zencodr\x1b[0m:\x1b[1;34m~\x1b[0m$ ';
    const { doc } = useYjs();
    const currentPath = useRef<string[]>(([''])); // Root

    const docRef = useRef(doc);

    useEffect(() => {
        docRef.current = doc;
    }, [doc]);

    useEffect(() => {
        if (!terminalRef.current) return;

        // Cleanup existing
        if (xtermRef.current) {
            xtermRef.current.dispose();
            xtermRef.current = null;
        }

        const term = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#0a0e27',
                foreground: '#cccccc',
            },
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: 14,
            rows: 12,
            cols: 80, // Default columns to avoid 0 division if open() called early
            allowProposedApi: true
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        xtermRef.current = term;

        let isOpened = false;

        const initOrFit = () => {
            if (!terminalRef.current || !xtermRef.current) return;

            const { clientWidth, clientHeight } = terminalRef.current;
            if (clientWidth > 0 && clientHeight > 0) {
                if (!isOpened) {
                    term.open(terminalRef.current);
                    isOpened = true;
                    // Initial welcome message only after open
                    term.write('Welcome to Zencodr Terminal v1.0.0\r\n');
                    term.write('Type "help" for a list of commands.\r\n');
                    term.write(prompt);
                }
                try {
                    fitAddon.fit();
                } catch (e) {
                    // ignore
                }
            }
        };

        // Try immediately in case already visible
        // But wrapped in rAF to prevent sync layout trashing if mounted in hidden state
        requestAnimationFrame(initOrFit);

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(initOrFit);
        });

        resizeObserver.observe(terminalRef.current);

        let cmd = '';

        const executeCommand = (commandLine: string, term: Terminal) => {
            const args = commandLine.split(' ');
            const command = args[0];

            const getFileMap = () => docRef.current?.getMap('files');

            switch (command) {
                case '':
                    term.write(prompt);
                    break;
                case 'help':
                    term.write('Available commands: ls, mkdir, touch, echo, clear, help\r\n');
                    term.write(prompt);
                    break;
                case 'clear':
                    term.clear();
                    term.write(prompt);
                    break;
                case 'ls':
                    const files: any[] = [];
                    getFileMap()?.forEach((f: any) => files.push(f.name));
                    term.write(files.join('  ') + '\r\n');
                    term.write(prompt);
                    break;
                case 'touch':
                    if (!args[1]) {
                        term.write('Usage: touch <filename>\r\n');
                    } else {
                        const name = args[1];
                        const id = uuidv4();
                        const node = { id, name, type: 'file', parentId: null };
                        getFileMap()?.set(id, node);
                        docRef.current?.getText(id).insert(0, '');
                        term.write(`Created file ${name}\r\n`);
                    }
                    term.write(prompt);
                    break;
                case 'mkdir':
                    if (!args[1]) {
                        term.write('Usage: mkdir <dirname>\r\n');
                    } else {
                        const name = args[1];
                        const id = uuidv4();
                        const node = { id, name, type: 'folder', parentId: null };
                        getFileMap()?.set(id, node);
                        term.write(`Created directory ${name}\r\n`);
                    }
                    term.write(prompt);
                    break;
                default:
                    term.write(`Command not found: ${command}\r\n`);
                    term.write(prompt);
            }
        };

        term.onData(e => {
            switch (e) {
                case '\r': // Enter
                    term.write('\r\n');
                    executeCommand(cmd.trim(), term);
                    cmd = '';
                    break;
                case '\u007F': // Backspace
                    if (cmd.length > 0) {
                        term.write('\b \b');
                        cmd = cmd.substring(0, cmd.length - 1);
                    }
                    break;
                default:
                    if (e >= String.fromCharCode(0x20) && e <= String.fromCharCode(0x7E)) {
                        cmd += e;
                        term.write(e);
                    }
            }
        });

        return () => {
            resizeObserver.disconnect();
            if (xtermRef.current) {
                xtermRef.current.dispose();
                xtermRef.current = null;
            }
        };
    }, []); // Empty deps is fine now because executeCommand is stable-ish (defined inside) and uses ref for doc



    return (
        <div className="h-full w-full bg-navy-900 p-2 overflow-hidden border-t border-white/10">
            <div ref={terminalRef} className="h-full w-full" />
        </div>
    );
}
