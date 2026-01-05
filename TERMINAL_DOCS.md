# Zencodr In-Browser Terminal

The integrated terminal allows you to manage your project files using command-line syntax. It is fully synced with the File Explorer.

## Supported Commands

- `ls`
  - Lists all files and folders in the project.
  
- `touch <filename>`
  - Creates a new empty file.
  - Example: `touch script.js`
  
- `mkdir <dirname>`
  - Creates a new directory.
  - Example: `mkdir src`
  
- `clear`
  - Clears the terminal output.

## Integration
All commands executed in the terminal update the shared Yjs state, meaning:
1. Changes appear instantly in the **File Explorer**.
2. Changes are **synced** to all other connected users in the room.
