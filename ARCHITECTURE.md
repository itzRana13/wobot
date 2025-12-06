# Architecture Documentation

## Overview

This application is a modern React-based camera management system built with a focus on clean architecture, scalability, and maintainability. All functionality is handled on the frontend as per requirements.

## Project Structure

```
wobot/
├── src/
│   ├── components/          # React components
│   │   ├── CameraTable.jsx  # Main table component with all features
│   │   ├── HealthBadge.jsx  # Reusable health status badge component
│   │   ├── DeleteModal.jsx  # Reusable delete confirmation modal
│   │   └── StatusTooltip.jsx # Reusable status notification tooltip
│   ├── services/            # API service layer
│   │   └── api.js           # API communication functions
│   ├── utils/               # Utility functions
│   │   └── formatters.js    # Data formatting utilities
│   ├── assets/              # Static assets (SVG icons, logos)
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Component Architecture

### 1. App.jsx (Main Application)
- **Responsibility**: Application-level state management, data fetching, error handling
- **State Management**: Uses React hooks (`useState`, `useEffect`)
- **Features**:
  - Fetches camera data on mount
  - Handles loading and error states
  - Manages camera list state
  - Delegates UI rendering to CameraTable

### 2. CameraTable.jsx (Core Component)
- **Responsibility**: Main table UI with all interactive features
- **State Management**: Multiple `useState` hooks for different concerns
- **Features**:
  - Search functionality
  - Filtering (Location, Status)
  - Pagination
  - Status updates via API
  - Delete functionality
  - Bulk selection
- **Performance Optimizations**:
  - `useMemo` for expensive computations (filtering, pagination)
  - `useCallback` for event handlers to prevent unnecessary re-renders

### 3. HealthBadge.jsx (Reusable Component)
- **Responsibility**: Displays health status with segmented ring design
- **Props**: `status` (string), `isFirst` (boolean)
- **Design**: Custom SVG-based circular badge with segmented ring

### 4. DeleteModal.jsx (Reusable Component)
- **Responsibility**: Confirmation dialog for delete actions
- **Props**: `show`, `cameraName`, `onConfirm`, `onCancel`
- **Accessibility**: ARIA attributes, keyboard support (Escape key)

### 5. StatusTooltip.jsx (Reusable Component)
- **Responsibility**: Displays status update notifications
- **Props**: `show`, `message`
- **Features**: Auto-dismiss, success/error styling

## Data Flow

1. **Initial Load**:
   - `App.jsx` → `fetchCameras()` → API → Response → State Update → `CameraTable` renders

2. **Status Update**:
   - User clicks status badge → `handleStatusToggle()` → `updateCameraStatus()` → API → Success/Error → State Update → Tooltip feedback

3. **Delete**:
   - User clicks delete → `handleDelete()` → Modal opens → User confirms → `onDelete()` → State update (frontend only)

4. **Search/Filter**:
   - User input → State update → `useMemo` recalculates filtered data → Re-render

## Performance Optimizations

1. **Memoization**:
   - `filteredCameras`: Recalculates only when dependencies change
   - `locations` and `statuses`: Extracted once from camera data
   - `paginatedCameras`: Sliced from filtered data

2. **Callback Optimization**:
   - Event handlers wrapped in `useCallback` to prevent unnecessary re-renders

3. **Frontend Pagination**:
   - Only renders visible items, reducing DOM nodes

## Scalability Considerations

1. **Component Modularity**: Components are small, focused, and reusable
2. **Service Layer**: API calls abstracted into service module
3. **Utility Functions**: Data formatting separated into utilities
4. **State Management**: Can easily migrate to Redux/Context if needed
5. **Code Splitting**: Ready for lazy loading if application grows

## Design Patterns

1. **Component Composition**: Small, composable components
2. **Separation of Concerns**: UI, business logic, and API calls separated
3. **Single Responsibility**: Each component has one clear purpose
4. **DRY Principle**: Reusable components and utilities

## Error Handling

- API errors caught and displayed to users
- Loading states prevent user interaction during async operations
- Graceful degradation for missing data

## Accessibility

- Semantic HTML elements
- ARIA attributes where needed
- Keyboard navigation support
- Focus management in modals

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Breakpoints: `sm:` (640px+), `md:` (768px+), `lg:` (1024px+)
- Horizontal scrolling for table on small screens
- Flexible layouts for filters and search

