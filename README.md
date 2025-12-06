# Wobot.ai Camera Manager

A modern, responsive React application for managing cameras with features including search, filtering, pagination, and status updates.

## 🌐 Live Demo

**Live Application**: [https://wobot-rh70d58et-itzrana13s-projects.vercel.app](https://wobot-rh70d58et-itzrana13s-projects.vercel.app)

The application is deployed on Vercel and is publicly accessible.

## Features

- 📹 **Camera List Display**: View all cameras in a clean, organized table format
- 🔍 **Search Functionality**: Search cameras by name, email, or model
- 🎯 **Filtering**: Filter cameras by location and status
- 📄 **Pagination**: Navigate through large datasets with customizable items per page
- ✏️ **Status Management**: Update camera status (Active/Inactive) via API
- 🗑️ **Delete Functionality**: Remove cameras from the list
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Axios**: HTTP client for API requests

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wobot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## API Integration

The application uses the following API endpoints:

- **Get Cameras**: `GET https://api-app-staging.wobot.ai/app/v1/fetch/cameras`
- **Update Status**: `POST https://api-app-staging.wobot.ai/app/v1/update/camera/status`

Authentication is handled via Bearer token in the request headers.

## Project Structure

```
wobot/
├── src/
│   ├── components/
│   │   └── CameraTable.jsx    # Main table component
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # Application entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Features in Detail

### Search
- Real-time search across camera names, emails, and models
- Case-insensitive matching
- Resets pagination to first page on search

### Filtering
- **Location Filter**: Filter cameras by their location (city, state)
- **Status Filter**: Filter by Active/Inactive status
- Filters work in combination with search

### Pagination
- Configurable items per page (10, 25, 50, 100)
- First, previous, next, and last page navigation
- Shows current range and total count

### Status Update
- Click the status badge or use the toggle action to update camera status
- Changes are persisted via API call
- UI updates immediately on success

### Delete
- Delete button on each row
- Confirmation dialog before deletion
- Removes camera from the list (frontend only as per requirements)

## Deployment

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json scripts:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d dist"
```

3. Deploy:
```bash
npm run deploy
```

### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Code Quality

### Architecture
- **Modular Design**: Components are separated by responsibility
- **Reusability**: Common UI elements (HealthBadge, DeleteModal, StatusTooltip) are extracted into reusable components
- **Service Layer**: API calls are abstracted into a dedicated service module
- **Utility Functions**: Data formatting logic is separated into utility modules

### Performance
- **Memoization**: Expensive computations use `useMemo` to prevent unnecessary recalculations
- **Callback Optimization**: Event handlers use `useCallback` to prevent unnecessary re-renders
- **Frontend Pagination**: Only visible items are rendered, reducing DOM nodes

### Documentation
- **JSDoc Comments**: All functions and components are documented with JSDoc
- **Inline Comments**: Complex logic includes explanatory comments
- **Architecture Documentation**: See `ARCHITECTURE.md` for detailed architecture overview

### Best Practices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Loading States**: Clear loading indicators during async operations
- **Accessibility**: ARIA attributes, keyboard navigation, semantic HTML
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

## Innovation & Unique Approaches

1. **Custom Health Badge Design**: Implemented a segmented ring badge using SVG for precise visual control
2. **Modular Component Architecture**: Extracted reusable components (HealthBadge, DeleteModal, StatusTooltip) for better maintainability
3. **Optimized State Management**: Strategic use of `useMemo` and `useCallback` for performance
4. **User Experience**: Custom tooltips and modals replace native browser alerts for better UX
5. **Responsive Table Design**: Horizontal scrolling with proper mobile optimization

## Scalability

The application is designed to scale:
- **Component Structure**: Easy to add new features without modifying existing code
- **Service Layer**: API endpoints can be easily extended
- **State Management**: Can migrate to Redux/Context if needed
- **Code Splitting**: Ready for lazy loading if application grows

## License

This project is created for assignment purposes.

## Contact

For any queries or issues, please reach out via the provided contact email.

