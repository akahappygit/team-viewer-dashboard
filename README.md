# Team Pulse Dashboard

A modern, responsive team management dashboard built with React, Redux Toolkit, and Tailwind CSS. Track team member status, assign tasks, and monitor productivity in real-time.

## 🚀 Features

### Core Features
- **Real-time Team Status Tracking**: Monitor team member availability (Available, Busy, In Meeting, Offline)
- **Role-based Views**: Separate interfaces for Team Leads and Team Members
- **Task Management**: Assign tasks, track progress, and monitor completion
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### Team Lead View
- **Team Overview Dashboard**: Summary cards showing total members and status distribution
- **Member Management**: View all team members with their current status and tasks
- **Task Assignment**: Assign new tasks to team members with due dates
- **Status Distribution Chart**: Visual representation of team status (toggleable)
- **Member Filtering**: Filter members by status and sort by various criteria

### Team Member View
- **Personal Status Control**: Update your own availability status
- **Task List**: View assigned tasks with progress tracking
- **Progress Updates**: Update task completion percentage with interactive controls
- **Task Statistics**: Overview of total, active, and completed tasks

### Bonus Features
- **Auto-reset Inactive Users**: Automatically set users to offline after 1 hour of inactivity
- **Chart Visualization**: Interactive pie chart showing team status distribution
- **localStorage Persistence**: Data persists across browser sessions
- **Real-time Updates**: Hot module replacement for instant updates during development

## 🛠️ Technology Stack

- **Frontend**: React 18 with Hooks
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Development**: Hot Module Replacement (HMR)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-pulse-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173/`

## 🎯 Usage

### Getting Started
1. The application starts with a default Team Lead view
2. Use the role switcher in the header to toggle between Team Lead and Team Member views
3. Click the theme toggle to switch between light and dark modes

### Team Lead Functions
- **View Team Status**: See all team members and their current availability
- **Assign Tasks**: Use the task form to assign new tasks to team members
- **Monitor Progress**: Track task completion and team productivity
- **View Analytics**: Toggle the chart view to see status distribution

### Team Member Functions
- **Update Status**: Use the status selector to update your availability
- **Manage Tasks**: View assigned tasks and update progress
- **Track Progress**: Use sliders or quick buttons to update task completion

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Header.jsx       # Navigation header with role switcher
│   ├── MemberCard.jsx   # Individual team member display
│   ├── StatusSelector.jsx # Status update component
│   ├── TaskForm.jsx     # Task assignment form
│   └── TaskList.jsx     # Task display and management
├── pages/               # Main page components
│   └── Dashboard.jsx    # Main dashboard with role-based views
├── redux/               # State management
│   ├── slices/
│   │   ├── membersSlice.js # Team members and tasks state
│   │   └── roleSlice.js    # User role and authentication
│   └── store.js         # Redux store configuration
├── index.css           # Global styles and Tailwind imports
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with consistent spacing
- **Responsive Layout**: Adapts to different screen sizes seamlessly
- **Accessibility**: Proper contrast ratios and keyboard navigation
- **Visual Feedback**: Hover effects, transitions, and loading states
- **Color Coding**: Status-based color schemes for quick recognition

## 🔧 Configuration

### Environment Setup
The application uses Vite for development and building. Configuration files:
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Customization
- **Colors**: Modify the color scheme in `tailwind.config.js`
- **Mock Data**: Update team member data in `src/redux/slices/membersSlice.js`
- **Auto-reset Timer**: Adjust the inactive user timeout in `Dashboard.jsx`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Redux Toolkit for simplified state management
- Tailwind CSS for utility-first styling
- Lucide React for beautiful icons
- Recharts for data visualization

---

**Team Pulse Dashboard** - Keeping your team connected and productive! 🚀

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
