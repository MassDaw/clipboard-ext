# ZenMarker - Chrome Extension

A Chrome extension for saving text snippets from any website with optional notes and tags.

## 🌍 Internationalization (i18n)

This extension now properly implements Chrome's i18n API following the official guidelines. The internationalization system includes:

### Supported Languages
- **English** (en) - Default
- **Spanish** (es)
- **Italian** (it)
- **French** (fr)
- **German** (de)

### Implementation Details

The extension uses Chrome's built-in `chrome.i18n` API for proper internationalization:

1. **Message Files**: Each language has its own `messages.json` file in `_locales/[language_code]/`
2. **Manifest Integration**: The manifest.json uses `__MSG_extName__` and `__MSG_extDescription__` for localized strings
3. **JavaScript Integration**: All UI strings are retrieved using `chrome.i18n.getMessage()`
4. **Default Locale**: Set to "en" in manifest.json

### File Structure
```
_locales/
├── en/messages.json
├── es/messages.json
├── it/messages.json
├── fr/messages.json
└── de/messages.json
```

### Usage in Code

```javascript
// Get a localized message
const message = chrome.i18n.getMessage('popupTitle');

// Get a message with substitutions
const totalMessage = chrome.i18n.getMessage('totalSnippets', [count.toString()]);
```

## Features

- ✅ Save selected text from any website
- ⌨️ Keyboard shortcut (Alt+Shift+S) for quick saving
- 📄 Works with PDFs, forms, and documents
- 🗒️ Add notes and tags to snippets
- 🔍 Search and filter snippets
- 📁 Export to PDF
- 📋 Copy snippets to clipboard
- 🌓 Dark and light mode
- 🔢 Snippet counter
- ☕ Support the developer
- 🌍 Multilingual UI (5 languages)
- 🔐 100% private - local storage only

## Installation

1. Download or clone this repository
2. Go to `chrome://extensions/` in your Chrome browser
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the project folder
5. Done! You'll see the extension icon in your Chrome toolbar

## Usage

1. **Select any text** on a web page
2. **Right-click and choose** "Save snippet" **OR** press **Alt+Shift+S**
3. **Add a note and tag** (both optional) in the prompts
4. **Open the extension popup** to view, search, filter, copy, share, pin, or export your snippets
5. **Switch between themes** with the 🌙/☀️ button
6. **Export to PDF** with the **Export to PDF 🖨️** button
7. **Delete all snippets** with the "Delete all" button (with confirmation)
8. **Support the developer** with the coffee button at the bottom!

## Technical Details

- **Storage**: Local browser storage (Chrome Storage API)
- **Privacy**: No data collection, tracking, or external servers
- **Performance**: Lightweight and fast
- **Compatibility**: Chrome, Edge, and other Chromium-based browsers
- **Languages**: JavaScript, HTML, CSS
- **Icons**: Custom SVG icons for all actions
- **i18n**: Chrome's official i18n API

## Contributing

Feel free to submit issues, feature requests, or pull requests. This is an open-source project and contributions are welcome!

## License

This project is open source and available under the MIT License.

## Support

If this extension has been useful to you, consider buying me a coffee! ☕

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-%F0%9F%8D%94-yellow?style=for-the-badge)](https://coff.ee/freeextensions)

---

**Made with ❤️ for the productivity community**

