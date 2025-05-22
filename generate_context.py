#!/usr/bin/env python3

import argparse
import os
import sys
from pathlib import Path
from datetime import datetime
import fnmatch # For wildcard matching similar to shell

# --- Configuration ---
# Use Path objects for easier manipulation
PROJECT_ROOT = Path(".").resolve()  # Get absolute path of current dir

# Output files (relative to PROJECT_ROOT, placed in tmp/)
TMP_DIR = PROJECT_ROOT / "tmp"
FULL_OUTPUT_FILE = TMP_DIR / "output_full.txt" # Changed name slightly for clarity
DIFF_OUTPUT_FILE = TMP_DIR / "output_diff.txt" # Changed name slightly

# Files/Directories to EXCLUDE (relative to PROJECT_ROOT)
# Use forward slashes, Pathlib handles OS conversion
EXCLUDED_DIRS = [
    ".git",
    "node_modules",
    "tmp",           # Exclude the output directory itself
    "assets/images",
    "assets/source-assets",
    "static",        # Often contains large generated or vendor assets
    ".idea",
    ".vscode",
    "public",        # Hugo output directory
    "resources",     # Hugo generated assets cache
    "__pycache__",   # Python cache
    ".venv",         # Common python virtualenv name
    "venv",          # Common python virtualenv name
]

# Specific file patterns/names to EXCLUDE (matched anywhere)
EXCLUDED_FILES_PATTERNS = [
    ".DS_Store",
    "hugo_stats.json",
    ".hugo_build.lock",
    str(FULL_OUTPUT_FILE.name), # Exclude the output files by name
    str(DIFF_OUTPUT_FILE.name), # Exclude the output files by name
    "*.pyc",
    "*~", # Backup files
    "package-lock.json", # <<< ADDED THIS LINE TO EXCLUDE package-lock.json
]

# File patterns/names to INCLUDE
# More specific wins over broader excludes if needed, but keep it simple
INCLUDE_PATTERNS = [
    "*.html",
    "*.md",
    "*.toml",
    "*.json",
    "*.yaml",
    "*.yml",
    "*.scss",
    "*.js",
    "*.php",
    "*.py",
    "*.sh",
    ".gitignore",
    "Dockerfile",
    "LICENSE",
    "README.md", # Explicitly include if needed, covered by *.md otherwise
    "go.mod",
    "go.sum",
    "package.json", # Explicitly include if needed, covered by *.json otherwise
    # "package-lock.json", # <<< REMOVED from includes (already covered by exclude)
    "nginx.conf",
]
# --- End Configuration ---

def log(message):
    """Prints a formatted log message to stderr."""
    print(f"[CONTEXT GEN] {message}", file=sys.stderr)

def should_ignore(path: Path, root: Path) -> bool:
    """Checks if a given path should be ignored based on config."""
    relative_path_str = str(path.relative_to(root))
    path_str = str(path) # Full path for pattern matching if needed

    # Check excluded directories (match anywhere in the relative path)
    # Normalize path separators for comparison
    parts = path.relative_to(root).parts
    for excluded_dir in EXCLUDED_DIRS:
        # Check if any part of the path matches an excluded dir name
        # Or if the relative path *starts* with an excluded dir path
        norm_excluded = excluded_dir.replace('/', os.sep) # Normalize slashes
        if norm_excluded in parts or relative_path_str.startswith(norm_excluded + os.sep):
             # log(f"Ignoring '{relative_path_str}' due to directory rule '{excluded_dir}'")
             return True

    # Check excluded file patterns/names against the filename
    for pattern in EXCLUDED_FILES_PATTERNS:
        if fnmatch.fnmatch(path.name, pattern):
            # log(f"Ignoring '{relative_path_str}' due to file pattern '{pattern}'")
            return True

    return False

def should_include(filename: str) -> bool:
    """Checks if a filename matches any include pattern."""
    for pattern in INCLUDE_PATTERNS:
        if fnmatch.fnmatch(filename, pattern):
            return True
    return False

def find_relevant_files(root: Path, checkpoint_mtime: float | None = None) -> list[Path]:
    """
    Walks the directory tree, applying include/exclude rules.
    If checkpoint_mtime is provided, only includes files newer than it.
    """
    relevant_files = []
    log(f"Scanning directory: {root}")
    if checkpoint_mtime:
        log(f"Filtering for files newer than: {datetime.fromtimestamp(checkpoint_mtime)}")

    # Convert excluded dirs to Paths relative to root for easier comparison
    excluded_dir_paths = {root / d for d in EXCLUDED_DIRS}

    for current_dir, dirs, files in os.walk(root, topdown=True):
        current_path = Path(current_dir)

        # Pruning: Modify dirs IN-PLACE to prevent descending into excluded ones
        # Must match against the *full path* of the directory being considered
        dirs[:] = [d for d in dirs if not should_ignore(current_path / d, root)]

        # Process files in the current directory
        for filename in files:
            file_path = current_path / filename

            # 1. Check global ignores (patterns, output files, etc.) applied to the file itself
            if should_ignore(file_path, root):
                continue

            # 2. Check if filename matches include patterns
            if not should_include(filename):
                continue

            # 3. (If diff mode) Check modification time
            if checkpoint_mtime:
                try:
                    file_mtime = file_path.stat().st_mtime
                    if file_mtime <= checkpoint_mtime:
                        continue # Skip files not newer than checkpoint
                except OSError as e:
                    log(f"Warning: Could not stat file {file_path}: {e}. Skipping.")
                    continue

            # If all checks pass, add it
            relevant_files.append(file_path)

    log(f"Found {len(relevant_files)} relevant files.")
    # Sort for consistent output order
    relevant_files.sort()
    return relevant_files

def generate_header(mode: str, checkpoint_file: Path | None = None) -> str:
    """Generates the header content for the output file."""
    if mode == "diff":
        if not checkpoint_file or not checkpoint_file.exists():
             # This case should be handled earlier, but defensively check
             checkpoint_ts_str = "ERROR: Checkpoint file missing!"
        else:
             checkpoint_mtime = checkpoint_file.stat().st_mtime
             checkpoint_ts = datetime.fromtimestamp(checkpoint_mtime)
             checkpoint_ts_str = checkpoint_ts.strftime('%Y-%m-%d %H:%M:%S %Z')

        return f"""--- START OF PROJECT CONTEXT UPDATE for VisionInit Website ---

This file contains ONLY the content of key files that have been MODIFIED since the last full context checkpoint was generated.

**Checkpoint File:** {checkpoint_file.relative_to(PROJECT_ROOT) if checkpoint_file else 'N/A'}
**Checkpoint Timestamp:** {checkpoint_ts_str}

**Instructions for AI:**
1.  **Apply Updates:** Use the content below to update your understanding of the project based on the changes since the checkpoint timestamp.
2.  **Focus on Changes:** These files represent recent modifications. Prioritize this information when it conflicts with previous context from the full checkpoint.
3.  **Context is Limited:** Remember this is NOT the full project, only the changed files. Refer back to the full checkpoint if needed for unchanged files or broader structure.
4.  **File Identification:** Each file's content is preceded by '=== [relative/path/to/file.ext] ==='.
5.  Provide Code with focus toward with minimal commenting and focus towards simplicity of copying and replacing within the IDE.
6.  Files over 200 lines are targets for modular refactors
7.  Tell me the name of the file in the code block AFTER the code block - so that I do not need to scroll up after COPYING the code block to know where to place it.
--- MODIFIED FILE CONTENTS START ---
"""
    else: # mode == "full"
        return """--- START OF PROJECT CONTEXT for VisionInit Website (Full Checkpoint) ---

This file contains the content of key configuration, source code, layout, and content files for the VisionInit Hugo website project (visioninit.dev). This serves as a full checkpoint.

**Instructions for AI:**
1.  **Analyze Structure:** Understand the Hugo project layout (config, content, layouts, assets, static structure).
2.  **Focus on Code/Config:** Pay close attention to Hugo templates (.html), SCSS (.scss), JavaScript (.js), configuration files (.toml, .yaml, .json), Go module files (go.mod, go.sum), and Node config (package.json, package-lock.json).
3.  **Understand Content:** Review markdown content files (.md) for site text and structure.
4.  **Identify Customizations:** Note custom logic in layouts, partials, shortcodes, SCSS, and JS compared to standard Hugo/theme practices.
5.  **Note Dependencies:** Identify key dependencies from go.mod/go.sum and package.json.
6.  **Ignore Irrelevant Data:** Skip over binary data representations or verbose dependency code if accidentally included. Focus on the content provided below.
7.  **Primary Goal:** Use this information to answer questions about the website's implementation, structure, features, styling, configuration, and potential areas for improvement or troubleshooting.
8.  Provide Code with focus toward with minimal commenting and focus towards simplicity of copying and replacing within the IDE.
9.  Files over 200 lines are targets for modular refactors
10.  Tell me the name of the file in the code block AFTER the code block - so that I do not need to scroll up after COPYING the code block to know where to place it.
--- FILE CONTENTS START ---
"""

def generate_footer(mode: str) -> str:
    """Generates the footer content."""
    if mode == "diff":
        return "\n--- END OF PROJECT CONTEXT UPDATE ---"
    else:
        return "\n--- END OF PROJECT CONTEXT ---"

def create_context_file(mode: str):
    """Main function to generate the context file based on the mode."""
    log(f"Project Root: {PROJECT_ROOT}")
    checkpoint_mtime = None
    target_output_file = None

    if mode == "full":
        target_output_file = FULL_OUTPUT_FILE
        log(f"Mode: Generating FULL context checkpoint -> {target_output_file.relative_to(PROJECT_ROOT)}")
    elif mode == "diff":
        target_output_file = DIFF_OUTPUT_FILE
        log(f"Mode: Generating DIFF context based on {FULL_OUTPUT_FILE.relative_to(PROJECT_ROOT)} -> {target_output_file.relative_to(PROJECT_ROOT)}")
        if not FULL_OUTPUT_FILE.exists():
            log(f"Error: Checkpoint file '{FULL_OUTPUT_FILE}' not found.")
            log("Please run with --full first to create the checkpoint.")
            sys.exit(1)
        try:
            checkpoint_mtime = FULL_OUTPUT_FILE.stat().st_mtime
        except OSError as e:
             log(f"Error: Could not read checkpoint file timestamp {FULL_OUTPUT_FILE}: {e}")
             sys.exit(1)
    else:
        # Should be caught by argparse, but good to be defensive
        log(f"Error: Invalid mode '{mode}'")
        sys.exit(1)

    # Ensure output directory exists
    try:
        TMP_DIR.mkdir(parents=True, exist_ok=True)
    except OSError as e:
        log(f"Error: Could not create output directory {TMP_DIR}: {e}")
        sys.exit(1)

    # Find the files
    files_to_include = find_relevant_files(PROJECT_ROOT, checkpoint_mtime)

    # Generate the content
    log(f"Generating context file: {target_output_file.relative_to(PROJECT_ROOT)}")
    header = generate_header(mode, FULL_OUTPUT_FILE if mode == "diff" else None)
    footer = generate_footer(mode)

    try:
        with open(target_output_file, "w", encoding="utf-8") as outfile:
            outfile.write(header + "\n") # Add newline after header

            for file_path in files_to_include:
                relative_path = file_path.relative_to(PROJECT_ROOT)
                log(f"  Adding: {relative_path}")
                outfile.write(f"\n=== {relative_path.as_posix()} ===\n") # Use posix paths in header
                try:
                    # Read file content, ignore decoding errors for robustness
                    content = file_path.read_text(encoding="utf-8", errors="ignore")
                    outfile.write(content)
                except Exception as e:
                    log(f"Warning: Failed to read content from {relative_path}: {e}")
                    outfile.write(f"--- FAILED TO READ/DECODE {relative_path.as_posix()} ---")
                outfile.write("\n") # Add newline after file content

            outfile.write(footer + "\n")

    except IOError as e:
        log(f"Error: Could not write to output file {target_output_file}: {e}")
        sys.exit(1)

    file_size = target_output_file.stat().st_size
    log(f"Successfully generated context file: {target_output_file.relative_to(PROJECT_ROOT)} ({file_size} bytes)")

    # Add warnings for empty/small files
    if not files_to_include:
         log("Warning: No files matched the criteria to be included in the output.")
    elif file_size < 1000 and mode == 'full': # Arbitrary threshold
         log("Warning: The generated full context file is very small. Please verify contents.")


def main():
    """Parses command line arguments and runs the script."""
    parser = argparse.ArgumentParser(
        description="Generate a context file with project source code for AI analysis.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=f"""
Examples:
  Generate a full context checkpoint:
    {sys.argv[0]} --full

  Generate a context file with changes since the last full checkpoint:
    {sys.argv[0]} --diff
"""
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "-f", "--full",
        action="store_const",
        const="full",
        dest="mode",
        help=f"Generate the full project context checkpoint ({FULL_OUTPUT_FILE.relative_to(PROJECT_ROOT)})."
    )
    group.add_argument(
        "-d", "--diff",
        action="store_const",
        const="diff",
        dest="mode",
        help=f"Generate context with files modified since the last full checkpoint ({DIFF_OUTPUT_FILE.relative_to(PROJECT_ROOT)})."
    )

    args = parser.parse_args()
    create_context_file(args.mode)

if __name__ == "__main__":
    main()
