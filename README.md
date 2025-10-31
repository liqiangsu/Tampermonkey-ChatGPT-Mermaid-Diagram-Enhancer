# ChatGPT Mermaid Diagram Enhancer 📊

A Tampermonkey userscript that enhances the ChatGPT web interface by automatically detecting Mermaid diagram code blocks and adding "View Diagram" buttons to visualize them in a beautiful modal popup.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-orange)

## ✨ Features

- 🔍 **Automatic Detection**: Automatically detects Mermaid code blocks in ChatGPT conversations
- 📊 **Interactive Buttons**: Adds "📊 View Diagram" buttons next to detected Mermaid code
- 🎨 **Beautiful Modal**: Displays diagrams in a clean, dark-themed modal popup
- 🌙 **Theme Integration**: Matches ChatGPT's dark/light theme styling
- ⚡ **Real-time Updates**: Works with dynamically loaded content as you chat
- 🛡️ **Error Handling**: Graceful error handling with helpful error messages
- 🎯 **Multiple Formats**: Supports all Mermaid diagram types (flowcharts, sequence, class, etc.)

## 🚀 Installation

### Prerequisites
1. Install [Tampermonkey](https://www.tampermonkey.net/) browser extension
   - [Chrome/Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

### Install the Script
1. **Direct Installation** (Recommended):
   - Click [here](https://raw.githubusercontent.com/yourusername/chatgpt-mermaid-enhancer/main/chatgpt-mermaid-enhancer.user.js) to install directly
   - Tampermonkey will open and prompt you to install

2. **Manual Installation**:
   - Copy the contents of `chatgpt-mermaid-enhancer.user.js`
   - Open Tampermonkey Dashboard
   - Click "Create a new script"
   - Paste the code and save

3. **From GitHub**:
   - Download the `.user.js` file from this repository
   - Open Tampermonkey Dashboard
   - Click "Utilities" tab
   - Choose "File" and select the downloaded file

## 📖 Usage

1. **Open ChatGPT**: Navigate to [chat.openai.com](https://chat.openai.com) or [chatgpt.com](https://chatgpt.com)

2. **Ask for Mermaid Diagrams**: Request ChatGPT to create Mermaid diagrams, for example:
   ```
   Create a flowchart using Mermaid syntax showing the user login process
   ```

3. **Look for the Button**: When ChatGPT responds with Mermaid code, you'll see a green "📊 View Diagram" button

4. **View the Diagram**: Click the button to open a modal with the rendered diagram

5. **Close the Modal**: Click the X button, click outside the modal, or press Escape

## 🎯 Supported Mermaid Diagrams

The script supports all Mermaid diagram types:

- **Flowcharts** (`flowchart`, `graph`)
- **Sequence Diagrams** (`sequenceDiagram`)
- **Class Diagrams** (`classDiagram`)
- **State Diagrams** (`stateDiagram`)
- **Entity Relationship Diagrams** (`erDiagram`)
- **User Journey** (`journey`)
- **Gantt Charts** (`gantt`)
- **Pie Charts** (`pie`)
- **Git Graph** (`gitgraph`)
- **Mindmaps** (`mindmap`)
- **Timelines** (`timeline`)

## 📝 Example Prompts

Try these prompts in ChatGPT to test the script:

### Simple Flowchart
```
Create a simple flowchart in Mermaid showing the steps to make coffee
```

### Sequence Diagram
```
Create a Mermaid sequence diagram showing how a user logs into a website
```

### Class Diagram
```
Generate a Mermaid class diagram for a basic e-commerce system with User, Product, and Order classes
```

### State Diagram
```
Create a Mermaid state diagram showing the states of an order in an online store
```

## 🔧 Configuration

The script includes several configuration options at the top of the file:

```javascript
const CONFIG = {
    mermaidButtonText: '📊 View Diagram',    // Button text
    mermaidButtonClass: 'mermaid-view-btn',   // CSS class for button
    modalClass: 'mermaid-modal',              // CSS class for modal
    overlayClass: 'mermaid-overlay',          // CSS class for overlay
    processedClass: 'mermaid-processed'       // Class to mark processed blocks
};
```

## 🛠️ Troubleshooting

### The button doesn't appear
- Ensure the code block is marked as "mermaid" language
- Check that the code contains Mermaid syntax keywords
- Refresh the page and try again

### Diagram doesn't render correctly
- Verify your Mermaid syntax is correct
- Check the browser console for error messages
- Try simplifying the diagram to isolate syntax issues

### Modal doesn't open
- Check if other browser extensions are interfering
- Ensure Tampermonkey is enabled and the script is active
- Try disabling other userscripts temporarily

### Performance issues
- The script uses MutationObserver for efficiency
- If experiencing slowdowns, try refreshing the page

## 🎨 Customization

### Changing Button Appearance
Modify the CSS in the `GM_addStyle` section:

```css
.mermaid-view-btn {
    background-color: #your-color !important;
    color: white;
    /* Add your custom styles */
}
```

### Changing Modal Theme
Update the Mermaid initialization:

```javascript
mermaid.initialize({
    theme: 'light', // or 'dark', 'neutral'
    // ... other options
});
```

## 🔒 Privacy & Security

- **No Data Collection**: This script doesn't collect or transmit any personal data
- **Local Processing**: All diagram rendering happens locally in your browser
- **Open Source**: Full source code is available for inspection
- **Secure CDN**: Mermaid.js is loaded from the official jsdelivr CDN

## 🤝 Contributing

Contributions are welcome! Please feel free to:

1. **Report Issues**: [Open an issue](https://github.com/yourusername/chatgpt-mermaid-enhancer/issues)
2. **Submit Pull Requests**: Fork the repo and create a PR
3. **Suggest Features**: Share ideas in the issues section
4. **Improve Documentation**: Help make the docs better

### Development Setup

1. Fork this repository
2. Make your changes to the `.user.js` file
3. Test with Tampermonkey in development mode
4. Submit a pull request

## 📋 Changelog

### Version 1.0.0 (2024-10-31)
- Initial release
- Automatic Mermaid code detection
- Modal diagram viewer
- Support for all Mermaid diagram types
- Error handling and validation
- Dark theme integration

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mermaid.js](https://mermaid.js.org/) - For the amazing diagram rendering library
- [Tampermonkey](https://www.tampermonkey.net/) - For the userscript platform

---

**Enjoy creating beautiful diagrams with ChatGPT! 🎉**