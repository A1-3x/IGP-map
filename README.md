# Islamic Geometric Patterns Interactive Map

A beautiful, interactive web map showcasing Islamic geometric patterns from around the world. This project displays the locations of various Islamic geometric patterns with detailed information panels that include images, symmetry groups, historical context, and more.

## Features

- **Interactive World Map**: Built with Leaflet.js for smooth navigation and zooming
- **Islamic-Inspired Design**: Beautiful geometric patterns and golden color scheme
- **Pattern Markers**: Clickable markers showing the locations of Islamic geometric patterns
- **Information Panels**: Detailed popups with pattern images, location data, symmetry groups, and historical notes
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Keyboard Navigation**: Use arrow keys to navigate between patterns when a panel is open
- **Touch Support**: Swipe gestures for mobile navigation

## Pattern Locations

The map currently includes patterns from:

1. **The Great Mosque, Tlemcen, Algeria** (13th century, p6m symmetry)
2. **Tile from Copenhagen** (p4m symmetry)
3. **Fatehpur Sikri, India** (16th century, p3m1 symmetry)
4. **Golestan Palace, Tehran** (18th century, pmm symmetry)

## How to Use

1. Open `index.html` in a web browser
2. Click on any golden marker to view pattern details
3. Use the close button (×) or press Escape to close the information panel
4. Click on another marker to switch between patterns
5. Use arrow keys to navigate between patterns when a panel is open
6. On mobile devices, swipe left/right to navigate between patterns

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styling with Islamic geometric patterns
├── script.js           # JavaScript functionality
├── IGP_map.csv         # Data source for pattern locations
├── Images/             # Pattern images folder
│   ├── 01_H327.png
│   ├── 02_na.PNG
│   ├── 03_P85.png
│   └── 04_P30.png
└── README.md           # This file
```

## Technical Details

- **Map Library**: Leaflet.js 1.9.4
- **Map Tiles**: OpenStreetMap (https://tile.openstreetmap.org/)
- **Styling**: Custom CSS with Islamic geometric patterns and golden color scheme
- **Fonts**: Amiri (Arabic-inspired) and Crimson Text (elegant serif)
- **Responsive**: Mobile-first design with touch support
- **Browser Support**: Modern browsers with ES6 support
- **OpenStreetMap Compliance**: Proper attribution, user agent, and caching

## OpenStreetMap Compliance

This application complies with OpenStreetMap usage requirements:

- ✅ **Correct Tile URL**: Uses https://tile.openstreetmap.org/{z}/{x}/{y}.png
- ✅ **Proper Attribution**: Displays copyright notice and links to OpenStreetMap
- ✅ **Report Issues Link**: Includes link to https://www.openstreetmap.org/fixthemap
- ✅ **Contact Information**: Contact email provided in header
- ✅ **Valid User-Agent**: Identifies as "Islamic Geometric Patterns Map v1.0"
- ✅ **Proper Referrer Policy**: Uses strict-origin-when-cross-origin
- ✅ **Caching**: Respects HTTP caching headers (no no-cache headers sent)

## Customization

To add new patterns:

1. Add the pattern image to the `Images/` folder
2. Update the `patternData` array in `script.js` with the new pattern information
3. Ensure the image filename matches the `fileName` property in the data

## Browser Requirements

- Modern web browser with JavaScript enabled
- Internet connection for Leaflet.js and Google Fonts
- Local web server recommended for best performance (due to CORS restrictions with local files)

## Credits

- Map tiles: OpenStreetMap contributors
- Fonts: Google Fonts (Amiri, Crimson Text)
- Map library: Leaflet.js
- Pattern data: Compiled from various historical sources
