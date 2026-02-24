
interface TerminalState {
    input: HTMLInputElement;
    history: string[];
    historyIndex: number;
}

interface Project {
    title: string;
    description: string;
    image: string;
    technologies: string[];
    demo: string;
    repo: string;
}

interface SkillLevels {
    [key: string]: number;
}

interface Skills {
    [category: string]: SkillLevels;
}

interface FileSystemItem {
    type: 'file' | 'directory';
    content?: string;
    contents?: { [name: string]: FileSystemItem };
}

// import * as p5 from 'p5';

class TerminalResume {
    private output: HTMLElement | null;
    private input: HTMLInputElement | null;
    private terminal: HTMLElement | null;
    private terminalContainer: HTMLElement | null;
    private contextMenu: HTMLElement | null;
    private terminals: TerminalState[];
    private activeTerminal: number;
    private activeTerminalContent: HTMLElement | null;
    private resizing: any;
    private currentTheme: string;
    private projects: Project[];
    private skills: Skills;
    private themeModal: HTMLElement | null;
    private projectsModal: HTMLElement | null;
    private skillsModal: HTMLElement | null;
    private themeToggle: HTMLElement | null;
    private p5Instance: any;
    private matrixInterval: any;

    constructor() {
        this.output = document.getElementById("output");
        this.input = document.getElementById("command-input") as HTMLInputElement;
        this.terminal = document.querySelector(".terminal");
        this.terminalContainer = document.querySelector(".terminal-container");
        this.contextMenu = document.querySelector(".context-menu");
        this.terminals = this.input ? [{ input: this.input, history: [], historyIndex: -1 }] : [];
        this.activeTerminal = 0;
        this.activeTerminalContent = null;
        this.resizing = null;

        this.currentTheme = localStorage.getItem("theme") || "default";
        this.projects = [];
        this.skills = {};

        this.themeModal = document.getElementById("theme-modal");
        this.projectsModal = document.getElementById("projects-modal");
        this.skillsModal = document.getElementById("skills-modal");
        this.themeToggle = document.getElementById("theme-toggle");

        this.setupEventListeners();
        this.loadProjects();
        this.loadSkills();
        this.init();
    }

    init() {
        this.handleThemeChange(this.currentTheme);

        document.querySelectorAll(".close-button").forEach((button) => {
            button.addEventListener("click", () => {
                const modal = button.closest(".modal") as HTMLElement;
                if (modal) this.closeModal(modal);
            });
        });

        this.themeToggle?.addEventListener("click", () => {
            if (this.themeModal) this.showModal(this.themeModal);
        });

        const languageToggle = document.getElementById("language-toggle");
        if (languageToggle?.parentElement) {
            languageToggle.parentElement.style.display = "none";
        }

        document.querySelectorAll(".theme-option").forEach((option) => {
            option.addEventListener("click", () => {
                const theme = (option as HTMLElement).dataset.theme;
                if (theme) this.handleThemeChange(theme);
            });
        });

        this.printWelcomeMessage();
        this.input?.focus();
        this.setupContextMenu();
    }

    setupContextMenu() {
        this.terminalContainer?.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            const terminalContent = (e.target as HTMLElement).closest(".terminal-content") as HTMLElement;
            if (terminalContent) {
                this.activeTerminalContent = terminalContent;
                this.showContextMenu(e.clientX, e.clientY);
            }
        });

        document.addEventListener("click", () => {
            this.contextMenu?.classList.remove("active");
        });

        this.contextMenu?.addEventListener("click", (e) => {
            const action = (e.target as HTMLElement).dataset.action;
            if (action) {
                this.handleContextMenuAction(action);
            }
        });
    }

    showContextMenu(x: number, y: number) {
        if (!this.contextMenu) return;
        this.contextMenu.style.left = `${x}px`;
        this.contextMenu.style.top = `${y}px`;
        this.contextMenu.classList.add("active");

        const closeOption = this.contextMenu.querySelector('[data-action="close-split"]') as HTMLElement;
        if (closeOption && this.terminalContainer) {
            const isMainTerminal = this.activeTerminalContent === this.terminalContainer.firstElementChild;
            closeOption.style.display = isMainTerminal ? "none" : "block";
        }
    }

    handleContextMenuAction(action: string) {
        if (!this.activeTerminalContent) return;

        switch (action) {
            case "split-h":
                this.splitTerminal("horizontal", this.activeTerminalContent);
                break;
            case "split-v":
                this.splitTerminal("vertical", this.activeTerminalContent);
                break;
            case "close-split":
                this.closeSplit(this.activeTerminalContent);
                break;
        }
        this.contextMenu?.classList.remove("active");
    }

    setupEventListeners() {
        this.terminalContainer?.addEventListener("click", (e) => {
            const terminalContent = (e.target as HTMLElement).closest(".terminal-content");
            if (terminalContent) {
                const input = terminalContent.querySelector("input") as HTMLInputElement;
                if (input) {
                    input.focus();
                    this.activeTerminal = this.terminals.findIndex((t) => t.input === input);
                }
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "h") {
                e.preventDefault();
                const activeContent = this.terminals[this.activeTerminal]?.input.closest(".terminal-content") as HTMLElement;
                if (activeContent) this.splitTerminal("horizontal", activeContent);
            }
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "v") {
                e.preventDefault();
                const activeContent = this.terminals[this.activeTerminal]?.input.closest(".terminal-content") as HTMLElement;
                if (activeContent) this.splitTerminal("vertical", activeContent);
            }
        });

        if (this.input) this.setupInputHandlers(this.input);
    }

    setupInputHandlers(inputElement: HTMLInputElement) {
        inputElement.addEventListener("keydown", (e) => {
            const terminal = this.terminals.find((t) => t.input === inputElement);
            if (!terminal) return;

            if (e.key === "Enter") {
                this.handleCommand(inputElement);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                this.navigateHistory("up", terminal);
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                this.navigateHistory("down", terminal);
            } else if (e.key === "l" && e.ctrlKey) {
                e.preventDefault();
                const outputElement = inputElement.closest(".terminal-content")?.querySelector("[id^='output']") as HTMLElement;
                if (outputElement) {
                    outputElement.innerHTML = "";
                    this.printWelcomeMessage(outputElement);
                }
            } else if (e.key === "Tab") {
                e.preventDefault();
                this.handleTabCompletion(inputElement);
            }
        });
    }

    handleTabCompletion(inputElement: HTMLInputElement) {
        const currentInput = inputElement.value.toLowerCase().trim();
        const commands = ["help", "about", "skills", "experience", "education", "contact", "clear", "projects", "skills-visual", "game", "exit-game", "matrix", "stop-matrix", "weather", "calc", "calculate", "pdf"];

        const matches = commands.filter((cmd) => cmd.startsWith(currentInput));

        if (matches.length === 1) {
            inputElement.value = matches[0];
        } else if (matches.length > 1 && currentInput) {
            const outputElement = inputElement.closest(".terminal-content")?.querySelector("[id^='output']") as HTMLElement;
            if (outputElement) {
                const matchesText = `\nPossible commands:\n${matches.join("  ")}`;
                this.printToOutput(outputElement, matchesText, "info");
            }
        }
    }

    navigateHistory(direction: 'up' | 'down', terminal: TerminalState) {
        if (direction === "up" && terminal.historyIndex < terminal.history.length - 1) {
            terminal.historyIndex++;
        } else if (direction === "down" && terminal.historyIndex > -1) {
            terminal.historyIndex--;
        }

        if (terminal.historyIndex >= 0 && terminal.historyIndex < terminal.history.length) {
            terminal.input.value = terminal.history[terminal.history.length - 1 - terminal.historyIndex];
        } else {
            terminal.input.value = "";
        }
    }

    splitTerminal(direction: 'horizontal' | 'vertical', sourceTerminal: HTMLElement) {
        const parentContainer = sourceTerminal.parentElement as HTMLElement;
        const isAlreadySplit = parentContainer.children.length > 1;
        const splitClass = direction === "horizontal" ? "split-h" : "split-v";

        if (!isAlreadySplit || !parentContainer.classList.contains(splitClass)) {
            const newContainer = document.createElement("div");
            newContainer.className = `terminal-container ${splitClass}`;
            sourceTerminal.parentElement?.insertBefore(newContainer, sourceTerminal);
            newContainer.appendChild(sourceTerminal);
            this.createNewTerminalContent(newContainer);
        } else {
            this.createNewTerminalContent(parentContainer);
        }
    }

    createNewTerminalContent(container: HTMLElement) {
        const newContent = document.createElement("div");
        newContent.className = "terminal-content";
        const timestamp = Date.now();
        newContent.innerHTML = `
      <div id="output-${timestamp}" class="terminal-output"></div>
      <div class="input-line">
        <span class="prompt">➜</span>
        <input type="text" id="command-input-${timestamp}" class="command-input" />
      </div>
    `;

        if (container.children.length > 0) {
            const handle = document.createElement("div");
            handle.className = `resize-handle ${container.classList.contains("split-h") ? "horizontal" : "vertical"}`;
            (container.lastElementChild as HTMLElement).appendChild(handle);
            this.setupResizeHandle(handle);
        }

        container.appendChild(newContent);
        const newInput = newContent.querySelector(".command-input") as HTMLInputElement;
        this.setupInputHandlers(newInput);

        this.terminals.push({ input: newInput, history: [], historyIndex: -1 });
        const newOutput = newContent.querySelector(`#output-${timestamp}`) as HTMLElement;
        this.printWelcomeMessage(newOutput);
        newInput.focus();
        this.activeTerminal = this.terminals.length - 1;
    }

    setupResizeHandle(handle: HTMLElement) {
        const isHorizontal = handle.classList.contains("horizontal");

        const startResize = (e: MouseEvent) => {
            e.preventDefault();
            this.resizing = {
                handle,
                startX: e.clientX,
                startY: e.clientY,
                parentContainer: handle.closest(".terminal-container"),
                element: handle.parentElement,
                initialSize: isHorizontal ? handle.parentElement!.offsetWidth : handle.parentElement!.offsetHeight,
            };
            document.addEventListener("mousemove", resize);
            document.addEventListener("mouseup", stopResize);
        };

        const resize = (e: MouseEvent) => {
            if (!this.resizing) return;
            const { parentContainer, element, startX, startY, initialSize } = this.resizing;
            const containerRect = (parentContainer as HTMLElement).getBoundingClientRect();

            if (isHorizontal) {
                const deltaX = e.clientX - startX;
                const newWidth = initialSize + deltaX;
                const maxWidth = containerRect.width - 150;
                if (newWidth >= 150 && newWidth <= maxWidth) {
                    const percentage = (newWidth / containerRect.width) * 100;
                    element.style.flex = "none";
                    element.style.width = `${percentage}%`;
                }
            } else {
                const deltaY = e.clientY - startY;
                const newHeight = initialSize + deltaY;
                const maxHeight = containerRect.height - 100;
                if (newHeight >= 100 && newHeight <= maxHeight) {
                    const percentage = (newHeight / containerRect.height) * 100;
                    element.style.flex = "none";
                    element.style.height = `${percentage}%`;
                }
            }
        };

        const stopResize = () => {
            this.resizing = null;
            document.removeEventListener("mousemove", resize);
            document.removeEventListener("mouseup", stopResize);
        };

        handle.addEventListener("mousedown", startResize);
    }

    printToOutput(outputElement: HTMLElement, text: string, className = "", useTypewriter = false): Promise<void> {
        if (!text) {
            outputElement.innerHTML = "";
            return Promise.resolve();
        }
        const line = document.createElement("div");
        line.className = className;
        line.style.whiteSpace = "pre-wrap";
        line.style.marginBottom = "0.5rem";
        outputElement.appendChild(line);
        this.scrollToBottom(outputElement.closest(".terminal-content") as HTMLElement);

        if (useTypewriter && !text.includes("<")) {
            return this.typeText(line, text, 20);
        } else if (useTypewriter && text.includes("<")) {
            return this.typeHTML(line, text, 20);
        } else {
            line.innerHTML = text;
            return Promise.resolve();
        }
    }

    scrollToBottom(terminalContent: HTMLElement) {
        if (!terminalContent) return;
        if (terminalContent.scrollHeight > terminalContent.clientHeight) {
            const maxScroll = terminalContent.scrollHeight - terminalContent.clientHeight;
            if (terminalContent.scrollTop < maxScroll) {
                terminalContent.scrollTop = maxScroll;
                requestAnimationFrame(() => {
                    terminalContent.scrollTop = maxScroll;
                });
            }
        }
    }

    handleCommand(inputElement: HTMLInputElement) {
        const terminal = this.terminals.find((t) => t.input === inputElement);
        if (!terminal) return;

        const command = inputElement.value.trim().toLowerCase();
        const outputElement = inputElement.closest(".terminal-content")?.querySelector("[id^='output']") as HTMLElement;

        this.printToOutput(outputElement, `➜ ${command}`, "command");
        terminal.history.push(command);
        terminal.historyIndex = -1;
        inputElement.value = "";

        const [cmd, ...args] = command.split(" ");

        switch (cmd) {
            case "help": this.showHelp(outputElement); break;
            case "about": this.showAbout(outputElement); break;
            case "experience": this.showExperience(outputElement); break;
            case "education": this.showEducation(outputElement); break;
            case "skills": this.showSkills(outputElement); break;
            case "contact": this.showContact(outputElement); break;
            case "clear": outputElement.innerHTML = ""; this.printWelcomeMessage(outputElement); break;
            case "projects": this.showProjects(); break;
            case "skills-visual": this.showSkillsVisualization(); break;
            case "game": this.initGame(); break;
            case "pdf": this.generatePDF(); break;
            case "linkedin-cover": this.generateLinkedInCover(outputElement); break;
            case "exit-game": this.endGame(); this.printToOutput(outputElement, "Game exited.", "info"); break;
            case "matrix": this.startMatrixEffect(outputElement); break;
            case "stop-matrix": this.stopMatrixEffect(); this.printToOutput(outputElement, "Matrix effect stopped.", "info"); break;
            case "weather": this.showWeather(args.join(" "), outputElement); break;
            case "calc":
            case "calculate": this.calculate(args.join(" "), outputElement); break;
            case "": break;
            default:
                this.printToOutput(outputElement, `Command not found: ${command}. Type 'help' for available commands.`, "error");
        }
        this.scrollToBottom(outputElement.closest(".terminal-content") as HTMLElement);
    }

    printWelcomeMessage(outputElement: HTMLElement = this.output!) {
        if (!outputElement) return;
        const asciiArt = `███╗   ███╗ █████╗ ██████╗ ██╗ ██████╗
████╗ ████║██╔══██╗██╔══██╗██║██╔═══██╗
██╔████╔██║███████║██████╔╝██║██║   ██║
██║╚██╔╝██║██╔══██║██╔══██╗██║██║   ██║
██║ ╚═╝ ██║██║  ██║██║  ██║██║╚██████╔╝
╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ `;

        const divider = "─────────────────────────────────────────────────";
        const welcome =
            this.wrapWithColor(asciiArt + "\n", "#d4843e") +
            this.wrapWithColor(divider + "\n", "#555555") +
            this.wrapWithColor("              Interactive Terminal Resume\n", "#888888") +
            this.wrapWithColor("         Software Engineer • Cloud Architect • Tech Lead\n", "#666666") +
            this.wrapWithColor(divider + "\n\n", "#555555") +
            this.wrapWithColor("Type ", "#666666") +
            this.wrapWithColor("'help'", "#87af87") +
            this.wrapWithColor(" to see available commands\n", "#666666") +
            this.wrapWithColor("Press ", "#666666") +
            this.wrapWithColor("'tab'", "#87af87") +
            this.wrapWithColor(" to auto-complete commands", "#666666");

        const helpDiv = document.createElement("div");
        helpDiv.innerHTML = welcome;
        outputElement.appendChild(helpDiv);
        this.scrollToBottom(outputElement.closest(".terminal-content") as HTMLElement);
    }

    showHelp(outputElement: HTMLElement = this.output!) {
        if (!outputElement) return;
        const title = this.wrapWithColor("🚀 Available Commands\n\n", "#ffff00");
        const mainCommands = this.wrapWithColor("Main Commands:\n", "#00ffff") +
            this.wrapWithColor("• help", "#98fb98") + "       " + this.wrapWithColor("Show this help message\n", "#ffffff") +
            this.wrapWithColor("• about", "#98fb98") + "      " + this.wrapWithColor("Display my professional summary\n", "#ffffff") +
            this.wrapWithColor("• skills", "#98fb98") + "     " + this.wrapWithColor("View my technical expertise\n", "#ffffff") +
            this.wrapWithColor("• experience", "#98fb98") + " " + this.wrapWithColor("Show my work history\n", "#ffffff") +
            this.wrapWithColor("• education", "#98fb98") + "  " + this.wrapWithColor("View my educational background\n", "#ffffff") +
            this.wrapWithColor("• contact", "#98fb98") + "    " + this.wrapWithColor("Get my contact information\n", "#ffffff") +
            this.wrapWithColor("• clear", "#98fb98") + "      " + this.wrapWithColor("Clear the terminal screen\n", "#ffffff");

        const utilityCommands = "\n" + this.wrapWithColor("Utility Commands:\n", "#00ffff") +
            this.wrapWithColor("• projects", "#98fb98") + "   " + this.wrapWithColor("View my project showcase\n", "#ffffff") +
            this.wrapWithColor("• skills-visual", "#98fb98") + " " + this.wrapWithColor("Show skills visualization\n", "#ffffff") +
            this.wrapWithColor("• game", "#98fb98") + "      " + this.wrapWithColor("Play a mini-game\n", "#ffffff") +
            this.wrapWithColor("• matrix", "#98fb98") + "    " + this.wrapWithColor("Start Matrix digital rain effect\n", "#ffffff") +
            this.wrapWithColor("• weather", "#98fb98") + "   " + this.wrapWithColor("Check weather for a location\n", "#ffffff") +
            this.wrapWithColor("• calc", "#98fb98") + "      " + this.wrapWithColor("Calculate mathematical expressions\n", "#ffffff") +
            this.wrapWithColor("• pdf", "#98fb98") + "       " + this.wrapWithColor("Download resume as PDF\n", "#ffffff") +
            this.wrapWithColor("• linkedin-cover", "#98fb98") + " " + this.wrapWithColor("Generate LinkedIn cover image\n", "#ffffff");

        const shortcuts = "\n" + this.wrapWithColor("Shortcuts:\n", "#666666") +
            this.wrapWithColor("• ", "#666666") + this.wrapWithColor("↑/↓", "#666666") + "         " + this.wrapWithColor("Navigate command history\n", "#444444") +
            this.wrapWithColor("• ", "#666666") + this.wrapWithColor("Tab", "#666666") + "         " + this.wrapWithColor("Auto-complete commands\n", "#444444") +
            this.wrapWithColor("• ", "#666666") + this.wrapWithColor("Ctrl+L", "#666666") + "      " + this.wrapWithColor("Clear the screen\n", "#444444") +
            this.wrapWithColor("• ", "#666666") + this.wrapWithColor("Ctrl+Shift+H", "#666666") + " " + this.wrapWithColor("Split horizontally\n", "#444444") +
            this.wrapWithColor("• ", "#666666") + this.wrapWithColor("Ctrl+Shift+V", "#666666") + " " + this.wrapWithColor("Split vertically", "#444444");

        const help = title + mainCommands + utilityCommands + shortcuts;
        const helpDiv = document.createElement("div");
        helpDiv.innerHTML = help;
        outputElement.appendChild(helpDiv);
        this.scrollToBottom(outputElement.closest(".terminal-content") as HTMLElement);
    }

    showAbout(outputElement: HTMLElement = this.output!) {
        if (!outputElement) return;
        // logic for about content would go here
    }

    wrapWithColor(text: string, color: string): string {
        return `<span style="color: ${color}">${text}</span>`;
    }

    typeText(element: HTMLElement, text: string, speed = 30): Promise<void> {
        return new Promise((resolve) => {
            let index = 0;
            element.textContent = "";
            const interval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, speed);
        });
    }

    async typeHTML(element: HTMLElement, html: string, speed = 30): Promise<void> {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        const walker = document.createTreeWalker(temp, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
        const nodes: Node[] = [];
        let currentNode: Node | null;
        while ((currentNode = walker.nextNode())) nodes.push(currentNode);
        element.innerHTML = "";
        for (const node of nodes) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                const span = document.createElement("span");
                element.appendChild(span);
                await this.typeText(span, node.textContent, speed);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const clone = node.cloneNode(false);
                element.appendChild(clone);
                if ((node as HTMLElement).tagName === "STYLE" || !node.hasChildNodes()) {
                    (clone as HTMLElement).innerHTML = (node as HTMLElement).innerHTML;
                }
            }
        }
    }

    showExperience(outputElement: HTMLElement = this.output!) {
        if (!outputElement) return;
        // ... similar to showAbout, using wrapWithColor and template literals
    }

    showEducation(outputElement: HTMLElement = this.output!) {
        if (!outputElement) return;
        // ...
    }

    showSkills(outputElement: HTMLElement = this.output!) {
        if (!outputElement) return;
        // ...
    }

    showContact(outputElement: HTMLElement = this.output!) {
        if (!outputElement) return;
        // ...
    }

    closeSplit(terminalContent: HTMLElement) {
        const container = terminalContent.parentElement as HTMLElement;
        const input = terminalContent.querySelector("input") as HTMLInputElement;
        const terminalIndex = this.terminals.findIndex((t) => t.input === input);
        if (terminalIndex > -1) this.terminals.splice(terminalIndex, 1);
        terminalContent.remove();
        if (container.children.length <= 1 && container !== this.terminalContainer) {
            if (container.children.length === 1) {
                const remainingContent = container.firstElementChild as HTMLElement;
                container.parentElement?.insertBefore(remainingContent, container);
            }
            container.remove();
        }
        if (this.terminals.length > 0) {
            const newActiveIndex = Math.min(terminalIndex, this.terminals.length - 1);
            this.terminals[newActiveIndex].input.focus();
            this.activeTerminal = newActiveIndex;
        }
    }

    loadProjects() {
        this.projects = [
            {
                title: "Interactive Terminal Resume",
                description: "A unique terminal-based resume with interactive features",
                image: "path/to/project-image.jpg",
                technologies: ["JavaScript", "HTML", "CSS"],
                demo: "https://demo.example.com",
                repo: "https://github.com/example/repo",
            },
        ];
    }

    loadSkills() {
        this.skills = {
            programming: { JavaScript: 95, Python: 90, "React.js": 85, "Node.js": 88 },
            cloud: { "Google Cloud": 92, AWS: 85, Azure: 80 },
            databases: { MongoDB: 90, PostgreSQL: 85, Redis: 82 },
        };
    }

    setupFileSystem() {
        // file system setup logic
    }

    handleThemeChange(theme: string) {
        if (this.terminal) this.terminal.className = `terminal theme-${theme}`;
        localStorage.setItem("theme", theme);
        this.currentTheme = theme;
        if (this.themeModal) this.closeModal(this.themeModal);
    }

    showModal(modal: HTMLElement) { modal.classList.add("active"); }
    closeModal(modal: HTMLElement) { modal.classList.remove("active"); }

    showProjects() {
        if (!this.projectsModal) return;
        const container = this.projectsModal.querySelector(".projects-container") as HTMLElement;
        container.innerHTML = this.projects.map((_p) => `...`).join("");
        this.showModal(this.projectsModal);
    }

    showSkillsVisualization() {
        if (!this.skillsModal) return;
        const container = this.skillsModal.querySelector(".skills-container") as HTMLElement;
        container.innerHTML = Object.entries(this.skills).map(([_c, _s]) => `...`).join("");
        this.showModal(this.skillsModal);
    }

    generatePDF() {
        // ...
    }

    initGame() {
        this.endGame();
        const outputElement = this.terminals[this.activeTerminal]?.input.closest(".terminal-content")?.querySelector("[id^='output']") as HTMLElement;
        if (outputElement) {
            const gameContainer = document.createElement("div");
            gameContainer.className = "game-container";
            gameContainer.id = "snake-game-container";
            gameContainer.innerHTML = `<div id="snake-game-canvas"></div>...`;
            outputElement.appendChild(gameContainer);
            this.initSnakeGame();
            this.scrollToBottom(outputElement.closest(".terminal-content") as HTMLElement);
        }
    }

    endGame() {
        this.p5Instance?.remove();
        document.getElementById("snake-game-container")?.remove();
    }

    initSnakeGame() {
        // ... using this.p5Instance = new p5(sketch)
    }

    startMatrixEffect(outputElement: HTMLElement) {
        this.stopMatrixEffect();
        const matrixContainer = document.createElement("div");
        matrixContainer.id = "matrix-container";
        matrixContainer.innerHTML = `<canvas id="matrix-canvas"></canvas>`;
        outputElement.appendChild(matrixContainer);
        // ... animation logic
        this.matrixInterval = setInterval(() => { }, 50);
    }

    stopMatrixEffect() {
        if (this.matrixInterval) clearInterval(this.matrixInterval);
        document.getElementById("matrix-container")?.remove();
    }

    async showWeather(_location: string, _outputElement: HTMLElement) {
        // ... fetch logic
    }

    calculate(_expression: string, _outputElement: HTMLElement) {
        // ... eval logic
    }

    generateLinkedInCover(_outputElement: HTMLElement) {
        // ... DOM construction logic
    }
}

new TerminalResume();
