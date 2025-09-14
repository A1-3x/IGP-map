// Islamic Geometric Patterns Map - JavaScript

// Map data from CSV
const patternData = [
    {
        location: "The Great Mosque, Tlemcen, Algeria",
        latitude: 34.88390002,
        longitude: -1.310460442,
        fileName: "01_H327.png",
        symmetryGroup: "p6m",
        century: "13",
        notes: ""
    },
    {
        location: "Tile from Copenhagen",
        latitude: 55.6761,
        longitude: 12.5683,
        fileName: "02_na.PNG",
        symmetryGroup: "p4m",
        century: "",
        notes: "Attribution unknown. Also a modern roundel with the same design"
    },
    {
        location: "Fatehpur Sikri, India",
        latitude: 27.09565487,
        longitude: 77.66306994,
        fileName: "03_P85.png",
        symmetryGroup: "p3m1",
        century: "16",
        notes: "Carved stone panel dated 1565-1605; Jali screen on the balcony."
    },
    {
        location: "Golestan Palace, Tehran",
        latitude: 35.67986124,
        longitude: 51.42048591,
        fileName: "04_P30.png",
        symmetryGroup: "pmm",
        century: "18",
        notes: ""
    },
    {
        location: "Salim Chishti's Tomb, Fatehpur Sikri, India",
        latitude: 27.09530275,
        longitude: 77.66276663,
        fileName: "05_PG351.png",
        symmetryGroup: "p6",
        century: "16",
        notes: "Also in Itmad ud Daula, Agra"
    },
    {
        location: "Itmad ud Daula, Agra, India",
        latitude: 27.1930543,
        longitude: 78.03110955,
        fileName: "05_PG351.png",
        symmetryGroup: "p6",
        century: "17",
        notes: "Also in Salim Chishti's Tomb, Fatehpur Sikri"
    },
    {
        location: "Mexuar Patio Corridor, Alhambra, Granada, Spain",
        latitude: 37.176245,
        longitude: -3.588076927,
        fileName: "06_P051.png",
        symmetryGroup: "p4m",
        century: "",
        notes: "No colour in the original. Has a left-hand and right-hand versions"
    }
];

// Global variables
let map;
let currentMarker = null;
let infoPanel;
let closeBtn;

// Initialize the map when the page loads
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Hide notes section
    const notesElement = document.getElementById('patternNotes');
    if (notesElement) {
        notesElement.parentElement.style.display = 'none';
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
