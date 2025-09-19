// Islamic Geometric Patterns Map - JavaScript

// Global variables
let map;
let currentMarker = null;
let infoPanel;
let closeBtn;
let patternData = [];

// CSV data - will be loaded dynamically
const csvData = `Location,Latitude,Longitude,FileName,SymmetryGroup,Century,Notes,Tiling Search Link
"The Great Mosque, Tlemcen, Algeria",34.88390002,-1.310460442,01_H327.png,p6m,13,,
Tile from Copenhagen,55.6761,12.5683,02_na.PNG,p4m,,Attribution unkown. Also a modern roundel with the same design,
"Fatehpur Sikri, India",27.09565487,77.66306994,03_P85.png,p3m1,16,Carved stone panel dated 1565-1605; Jali screen on the balcony.,
"Golestan Palace, Tehran",35.67986124,51.42048591,04_P30.png,pmm,18,,
"Salim Chishti's Tomb, Fatehpur Sikri, India",27.09530275,77.66276663,05_PG351.png,p6,16,"Also in Itmad ud Daula, Agra",
"Itmad ud Daula, Agra, India",27.1930543,78.03110955,05_PG351.png,p6,17,"Also in Salim Chishti's Tomb, Fatehpur Sikri",
"Mexuar Patio Corridor, Alhambra, Granada, Spain",37.176245,-3.588076927,06_P051.png,p4m,,No colour in the original. Has a left-hand and right-hand versions,
"Patio de los Arrauanes, Alhambra, Granada, Spain",37.17741684,-3.589753888,07_P052A.png,p3,14,,https://tilingsearch.mit.edu/HTML/data159/P052A.html
"Itmad ud Daula, Agra, India",27.19261053,78.0303478,08_IND0428.png,p2,17,,https://tilingsearch.mit.edu/HTML/data189/IND0428.html
Topkapı scroll,38.0837822,46.28966583,09_na.PNG,pm,15,,
"Friday Mosque, Yazd",31.90166085,54.36844785,10_IB2.png,p4g,14,,https://tilingsearch.mit.edu/HTML/data207/IB2.html
"Mudhafaria Minaret, Irbil, Iraq",36.1877659,43.99964228,10_IB2.png,p4g,12,,https://tilingsearch.mit.edu/HTML/data207/IB2.html
"Mosque of Rustem Pasha, Istanbul, Turkey",41.01777553,28.96871961,11_A376.png,p31m,16,,https://tilingsearch.mit.edu/HTML/data15/A376.html
"Isfahan, Iran",32.66257793,51.66299351,12_P175.png,cmm,11,,https://tilingsearch.mit.edu/HTML/data12/P175.html
"Mahan - The Shrine of Sheikh Nematullah Vali, Iran",30.06066774,57.28947471,12_P175.png,cmm,15,,https://tilingsearch.mit.edu/HTML/data12/P175.html
"Lab-i-Hauz complex, Bukhara, Uzbekistan",39.77342685,64.4203621,12_P175.png,cmm,16,,https://tilingsearch.mit.edu/HTML/data12/P175.html
"Qalawun, Cairo, Egypt",30.04980545,31.26102204,13_M2.png,pmg,13,,https://tilingsearch.mit.edu/HTML/data19/M2.html
"Mosque of Muhammad Ali, Cairo, Egypt",30.03459541,31.25937622,13_M2.png,pmg,19,,https://tilingsearch.mit.edu/HTML/data19/M2.html`;

// Function to parse CSV data
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue; // Skip empty lines
        
        const values = parseCSVLine(lines[i]);
        if (values.length >= headers.length) {
            const pattern = {};
            headers.forEach((header, index) => {
                let value = values[index] || '';
                // Remove quotes and trim
                value = value.replace(/^"|"$/g, '').trim();
                
                // Convert numeric fields
                if (header === 'Latitude' || header === 'Longitude') {
                    value = parseFloat(value) || 0;
                }
                
                // Convert field names to camelCase for consistency
                let fieldName = header.toLowerCase()
                    .replace(/\s+/g, '')
                    .replace(/tilingsearchlink/g, 'tilingSearchLink');
                
                // Fix specific field names
                if (fieldName === 'filename') fieldName = 'fileName';
                if (fieldName === 'symmetrygroup') fieldName = 'symmetryGroup';
                
                pattern[fieldName] = value;
            });
            data.push(pattern);
        }
    }
    
    return data;
}

// Function to parse CSV line handling quoted fields
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current);
    return result;
}

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Parse CSV data first
    patternData = parseCSV(csvData);
    console.log('Loaded patterns:', patternData.length);
    console.log('First pattern:', patternData[0]);
    
    initializeMap();
    initializeInfoPanel();
});

function initializeMap() {
    // Initialize the map centered on the Middle East (where most Islamic patterns originate)
    map = L.map('map').setView([30, 50], 3);
    
    // Use CartoDB tiles (based on OpenStreetMap data, more reliable)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, © <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 20,
        className: 'custom-tile',
        subdomains: 'abcd'
    }).addTo(map);
    
    // Add markers for each pattern
    addPatternMarkers();
}

function addPatternMarkers() {
    patternData.forEach((pattern, index) => {
        // Use default Leaflet markers
        const marker = L.marker([pattern.latitude, pattern.longitude]).addTo(map);
        
        // Add click event to marker
        marker.on('click', function() {
            showPatternInfo(pattern, marker);
        });
        
        // Store pattern data in marker for reference
        marker.patternData = pattern;
        
        // Debug: Log marker position
        console.log(`Marker ${index + 1}: ${pattern.location} at [${pattern.latitude}, ${pattern.longitude}]`);
    });
}

function initializeInfoPanel() {
    infoPanel = document.getElementById('infoPanel');
    closeBtn = document.getElementById('closeBtn');
    
    // Close panel when close button is clicked
    closeBtn.addEventListener('click', closeInfoPanel);
    
    // Close panel when clicking outside of it
    infoPanel.addEventListener('click', function(e) {
        if (e.target === infoPanel) {
            closeInfoPanel();
        }
    });
    
    // Close panel with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeInfoPanel();
        }
    });
}

function showPatternInfo(pattern, marker) {
    // Close any currently open popup
    if (currentMarker && currentMarker !== marker) {
        closeInfoPanel();
    }
    
    // If clicking the same marker, toggle the panel
    if (currentMarker === marker) {
        if (infoPanel.classList.contains('active')) {
            closeInfoPanel();
            return;
        }
    }
    
    // Update current marker
    currentMarker = marker;
    
    // Update panel content
    updatePanelContent(pattern);
    
    // Show the panel
    infoPanel.classList.add('active');
    
    // Smooth scroll to marker if it's not visible
    map.setView([pattern.latitude, pattern.longitude], Math.max(map.getZoom(), 6), {
        animate: true,
        duration: 1
    });
}

function updatePanelContent(pattern) {
    // Update image
    const patternImage = document.getElementById('patternImage');
    patternImage.src = `Images/${pattern.fileName}`;
    patternImage.alt = pattern.location;
    
    // Update location
    document.getElementById('patternLocation').textContent = pattern.location;
    
    // Update symmetry group
    document.getElementById('patternSymmetry').textContent = pattern.symmetryGroup || 'Not specified';
    
    // Update century
    document.getElementById('patternCentury').textContent = pattern.century ? `${pattern.century}th century` : 'Not specified';
    
    // Update notes
    const notesElement = document.getElementById('patternNotes');
    if (notesElement) {
        if (pattern.notes && pattern.notes.trim() !== '') {
            notesElement.textContent = pattern.notes;
            notesElement.parentElement.style.display = 'block';
        } else {
            notesElement.parentElement.style.display = 'none';
        }
    }
    
    // Add tiling search link if available
    const tilingLinkElement = document.getElementById('tilingSearchLink');
    const tilingSearchItem = document.getElementById('tilingSearchItem');
    if (tilingLinkElement && tilingSearchItem) {
        if (pattern.tilingSearchLink && pattern.tilingSearchLink.trim() !== '') {
            tilingLinkElement.href = pattern.tilingSearchLink;
            tilingLinkElement.textContent = 'View on Tiling Search';
            tilingSearchItem.style.display = 'block';
        } else {
            tilingSearchItem.style.display = 'none';
        }
    }
    
    // Add loading state for image
    patternImage.onload = function() {
        this.style.opacity = '1';
    };
    
    patternImage.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
        this.alt = 'Image not found';
    };
    
    patternImage.style.opacity = '0.5';
}

function closeInfoPanel() {
    infoPanel.classList.remove('active');
    currentMarker = null;
}

// Add some additional map styling and interactions
function addMapEnhancements() {
    // Add a custom control for map information
    const infoControl = L.control({position: 'bottomright'});
    
    infoControl.onAdd = function(map) {
        const div = L.DomUtil.create('div', 'map-info-control');
        div.innerHTML = `
            <div style="background: rgba(26, 26, 46, 0.9); color: #ffd700; padding: 10px; border-radius: 5px; font-family: 'Crimson Text', serif; font-size: 12px; border: 1px solid #ffd700;">
                <strong>Islamic Geometric Patterns</strong><br>
                Click markers to explore patterns
            </div>
        `;
        return div;
    };
    
    infoControl.addTo(map);
    
    // Add proper attribution control
    const attributionControl = L.control.attribution({
        position: 'bottomright',
        prefix: false
    });
    
    attributionControl.addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
    attributionControl.addTo(map);
}

// Initialize map enhancements after map is loaded
map.whenReady(function() {
    addMapEnhancements();
});

// Add smooth animations and transitions
function addSmoothAnimations() {
    // Add hover effects to markers
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            layer.on('mouseover', function() {
                this.getElement().style.transform = 'scale(1.2)';
                this.getElement().style.transition = 'transform 0.3s ease';
            });
            
            layer.on('mouseout', function() {
                this.getElement().style.transform = 'scale(1)';
            });
        }
    });
}

// Call animations after markers are added
setTimeout(addSmoothAnimations, 1000);

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (infoPanel.classList.contains('active')) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            navigatePatterns(e.key === 'ArrowRight' ? 1 : -1);
        }
    }
});

function navigatePatterns(direction) {
    if (!currentMarker) return;
    
    const currentIndex = patternData.findIndex(p => p === currentMarker.patternData);
    let newIndex = currentIndex + direction;
    
    // Wrap around
    if (newIndex < 0) newIndex = patternData.length - 1;
    if (newIndex >= patternData.length) newIndex = 0;
    
    // Find the marker for the new pattern
    let newMarker = null;
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker && layer.patternData === patternData[newIndex]) {
            newMarker = layer;
        }
    });
    
    if (newMarker) {
        showPatternInfo(patternData[newIndex], newMarker);
    }
}

// Add touch support for mobile devices
let touchStartX = 0;
let touchStartY = 0;

infoPanel.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

infoPanel.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Swipe left or right to navigate patterns
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            navigatePatterns(-1); // Swipe right = previous
        } else {
            navigatePatterns(1); // Swipe left = next
        }
    }
});

// Add loading indicator
function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.textContent = 'Loading patterns...';
    loadingDiv.id = 'loadingIndicator';
    document.body.appendChild(loadingDiv);
}

function hideLoading() {
    const loadingDiv = document.getElementById('loadingIndicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Show loading initially
showLoading();

// Hide loading when map is ready
map.whenReady(function() {
    setTimeout(hideLoading, 1000);
});
