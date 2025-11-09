# Quiz App Frontend

A modern, feature-rich React frontend for the Quiz Application with real-time features, analytics, and comprehensive quiz management.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Available Routes](#available-routes)
- [Components](#components)
- [Key Features Details](#key-features-details)
- [Running the App](#running-the-app)
- [Environment Variables](#environment-variables)

## Features

### Authentication & User Management
- **User Registration & Login**: Email/password authentication with validation
- **Google OAuth Integration**: One-click sign-in with Google account
- **CAS Authentication**: Central Authentication Service (SSO) login support
  - CAS callback handling
  - Automatic user creation/update
  - Token-based authentication flow
- **Persistent Login**: Automatic session restoration from localStorage
  - Token expiration checking
  - Automatic logout on token expiry
  - Seamless user experience across browser sessions
- **Protected Routes**: Role-based access control (Admin/User)
- **Token Management**: Automatic token injection in API requests
- **User Profile Pages**: View and edit profile with stats, badges, and quiz history

### Quiz Features
- **Explore Page**: Search, filter, and sort quizzes
  - Search by quiz name
  - Filter by tags and difficulty
  - Sort by name, popularity, or date
  - Infinite scroll for better performance
- **Quiz Attempt**: Enhanced quiz taking experience
  - Keyboard shortcuts (N=Next, P=Previous, S=Submit, 1-4=Select option)
  - Progress bar
  - Confirmation before navigation
  - Time tracking
  - Badge notifications on completion
- **Save/Bookmark**: 
  - Save quizzes for later viewing
  - Save individual questions for review
  - Quick access to saved content
  - Toggle save/unsave from quiz cards
- **Category Following**: Subscribe to quiz categories to stay updated
- **Quiz Timer**: Real-time timer display during quiz attempts
  - Shows elapsed time in MM:SS or HH:MM:SS format
  - Tracks completion time for analytics
  - Displayed in quiz results
- **Question Reporting**: Report inappropriate questions during quiz
  - Report button on each question
  - Reason text input
  - One report per question per user

### Admin Features
- **Quiz Management**: Create, edit, and delete quizzes
  - Upload quiz images
  - Add tags and set difficulty
  - View quiz statistics (participants, questions, average score)
- **Analytics Dashboard**: Comprehensive quiz analytics
  - Participant growth charts
  - Attempts over time
  - Average score trends
  - **Completion Time Distribution**: Histogram showing how many users took how much time
  - Completion time statistics (average, median, min, max)
- **Reports Management**: Moderate reported questions
  - View reports only for quizzes you created
  - Filter by status (All, Pending, Fixed, Ignored, Deleted)
  - Fix, ignore, or delete questions
  - Edit question text and options when fixing
  - Auto-expiry indicators
  - Quiz title display for each report

### User Profile
- **Profile Information**: View and edit user details
  - Name, email, bio
  - Avatar upload and display
- **Statistics Dashboard**:
  - Total quizzes attempted
  - Average score across all quizzes
  - Quiz streak (consecutive days)
  - Total badges earned
- **Follow/Following System**:
  - Followers and following counts (clickable)
  - Follow/Unfollow button for other users
  - Followers modal with remove functionality
  - Following modal with unfollow functionality
  - Mutual follow indicators
- **Badge Display**: Visual representation of earned achievements
- **Quiz History**: Complete list of quiz attempts with scores and dates
- **Followed Categories**: Manage subscription to quiz categories
- **Profile Editing**: Update profile information with real-time validation
- **Chat Button**: Start chat with users you mutually follow

### Real-time Features
- **Chat System**: REST-based messaging with polling
  - Chat with users you mutually follow
  - Chat list showing all conversations
  - Message history with sender information
  - Real-time updates via polling (every 2 seconds)
  - Optimistic UI updates for instant feedback
  - Start new chats from profile or People page
  - Mutual follow requirement enforced
- **Real-time Notifications**: Badge awards, quiz updates (backend ready)

### Bonus Features
- **People/Discover Page**: 
  - Discover and search users
  - Sort by followers, name, or recent
  - Follow/unfollow users
  - View mutual followers
  - User cards with avatars and stats
- **Infinite Scroll**: Efficient loading of quiz lists and leaderboards
- **Keyboard Shortcuts**: 
  - Quiz navigation (N=Next, P=Previous)
  - Quick option selection (1-4)
  - Submit quiz (S)
- **Confirmation Dialogs**: 
  - Prevent accidental navigation during quiz
  - Confirm before leaving quiz page
  - Browser back button warning
- **Banned Keywords Filtering**: Automatic display of filtered content (*** replacement)
- **Responsive Design**: Mobile-friendly interface
- **Time Tracking**: Real-time quiz completion time display
- **Progress Indicators**: Visual progress bars and completion status
- **Navbar with Icons**: Material-UI icons for all navigation items
- **Quiz Creator Info**: Display creator on quiz cards with follow button

## Tech Stack

- **Framework**: React 19.x
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios
- **UI Library**: Material-UI (MUI)
- **Charts**: Recharts
- **Real-time**: Socket.io Client
- **Infinite Scroll**: react-infinite-scroll-component
- **Keyboard Shortcuts**: react-hotkeys-hook
- **Build Tool**: Create React App

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AddQuestions.js      # Add questions to quiz
│   │   │   ├── AdminQuizResults.js  # View quiz results
│   │   │   ├── Analytics.js         # Analytics dashboard
│   │   │   ├── CreateQuiz.js        # Create new quiz
│   │   │   └── Reports.js           # Reports moderation
│   │   ├── auth/
│   │   │   ├── Login.js             # Login page
│   │   │   └── Register.js          # Registration page
│   │   ├── common/
│   │   │   └── ProtectedRoute.js    # Route protection
│   │   ├── dashboard/
│   │   │   ├── AdminPanel.js        # Admin dashboard
│   │   │   ├── QuizAttempt.js       # Quiz taking interface
│   │   │   └── UserPanel.js         # User dashboard
│   │   ├── explore/
│   │   │   └── Explore.js           # Explore quizzes page
│   │   ├── profile/
│   │   │   ├── Profile.js           # User profile page
│   │   │   ├── FollowersModal.js    # Followers list modal
│   │   │   └── FollowingModal.js   # Following list modal
│   │   ├── people/
│   │   │   └── People.js            # Discover users page
│   │   ├── chat/
│   │   │   ├── Chat.js              # Main chat container
│   │   │   ├── ChatList.js          # Chat list sidebar
│   │   │   └── ChatWindow.js        # Chat conversation window
│   │   ├── saved/
│   │   │   └── SavedQuizzes.js     # Saved quizzes page
│   │   ├── common/
│   │   │   ├── Navbar.js            # Navigation bar with icons
│   │   │   └── ProtectedRoute.js    # Route protection
│   │   └── Home.js                  # Landing page
│   ├── context/
│   │   └── AuthContext.js          # Authentication context
│   ├── utils/
│   │   └── api.js                  # Axios configuration
│   ├── App.js                       # Main app component
│   └── index.js                     # Entry point
├── package.json
└── .env                             # Environment variables
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (if needed):
   ```env
   REACT_APP_API_BASE_URL=http://localhost:5000
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

The app will open at [http://localhost:3000](http://localhost:3000)

## Available Routes

### Public Routes
- `/` - Home/Landing page
- `/login` - User login (with Google OAuth and CAS options)
- `/register` - User registration
- `/auth/cas/success` - CAS authentication callback handler

### Protected Routes (Require Authentication)
- `/dashboard` - User/Admin dashboard (role-based)
- `/quiz/:id` - Attempt a quiz
- `/profile/:userId` - View user profile
- `/explore` - Explore quizzes (search, filter, sort)
- `/people` - Discover and search users
- `/chat` - Chat page (list of conversations)
- `/chat/:chatId` - Individual chat conversation
- `/saved/quizzes` - View saved quizzes

### Admin-Only Routes
- `/admin/quiz/create` - Create new quiz
- `/admin/quiz/:id/questions` - Add questions to quiz (with Back to Dashboard button)
- `/admin/quiz/:id/results` - View quiz results
- `/admin/quiz/:quizId/analytics` - View quiz analytics
- `/admin/reports` - Manage reported questions (only own quizzes)

## Components

### Authentication Components

#### Login (`/components/auth/Login.js`)
- Email and password login
- Google OAuth button (ready for integration)
- Redirects to dashboard on success

#### Register (`/components/auth/Register.js`)
- User registration form
- Password validation
- Auto-login after registration

### Dashboard Components

#### AdminPanel (`/components/dashboard/AdminPanel.js`)
- View all created quizzes
- Quiz statistics (participants, questions, average score)
- Quick actions: Add Questions, View Results, Analytics, Delete
- Links to Reports and Explore pages

#### UserPanel (`/components/dashboard/UserPanel.js`)
- List of available quizzes
- Start quiz button for each quiz

#### QuizAttempt (`/components/dashboard/QuizAttempt.js`)
- **Enhanced quiz interface** with:
  - One question at a time display
  - Progress bar
  - **Real-time timer** (MM:SS or HH:MM:SS format)
  - Previous/Next navigation
  - **Keyboard shortcuts**:
    - `N` - Next question
    - `P` - Previous question
    - `S` - Submit quiz
    - `1-4` - Select option
  - **Report Question** button on each question
  - Report modal with reason input
  - Confirmation before leaving page
  - Time tracking and display
  - Results display with badges earned and completion time

### Admin Components

#### CreateQuiz (`/components/admin/CreateQuiz.js`)
- Quiz creation form with:
  - Title and description
  - Difficulty selection (Easy/Medium/Hard)
  - Tag selection (predefined categories + custom tags)
  - Image upload
- Redirects to add questions after creation

#### AddQuestions (`/components/admin/AddQuestions.js`)
- Add multiple choice questions
- Set correct answer
- Banned keywords automatically filtered
- **Back to Dashboard** button (same size as Add Question button)

#### Analytics (`/components/admin/Analytics.js`)
- **Comprehensive analytics dashboard**:
  - Participant growth line chart
  - Attempts over time bar chart
  - Average score trends line chart
  - **Completion Time Distribution**: Bar chart histogram
  - Completion time statistics (average, median, min, max)
- Uses Recharts library

#### Reports (`/components/admin/Reports.js`)
- List of reported questions (only for quizzes you created)
- Filter by status (All, Pending, Fixed, Ignored, Deleted)
- Actions: Fix (edit), Ignore, Delete
- Shows quiz title, report reason, reporter, and expiry date
- Edit question form when fixing reports

### Explore Component

#### Explore (`/components/explore/Explore.js`)
- **Search and filter interface**:
  - Search bar for quiz names
  - Tag filter buttons
  - Difficulty filter dropdown
  - Sort options (Date, Name, Popularity)
- **Infinite scroll** for better performance
- Quiz cards with:
  - Image (if available)
  - Title and description
  - Tags and difficulty
  - Statistics (participants, questions, average score)
  - **Creator information** with avatar and follow button
  - Start Quiz button
  - Save/Unsave button

### Profile Component

#### Profile (`/components/profile/Profile.js`)
- User information display:
  - Avatar and bio
  - Email
  - Statistics (quizzes attempted, average score, badges)
- **Follow/Following System**:
  - Followers and following counts (clickable)
  - Follow/Unfollow button
  - Chat button (if mutual follow exists)
- **Edit profile** functionality:
  - Update name and bio
  - Upload avatar image
- Badges earned display
- Recent quiz attempts
- Followed categories
- **Modals**:
  - FollowersModal: View followers with remove and follow options
  - FollowingModal: View following with unfollow option

### Saved Component

#### SavedQuizzes (`/components/saved/SavedQuizzes.js`)
- Grid view of saved quizzes
- Quiz cards with images, titles, and descriptions
- Unsave functionality (toggle save/unsave)
- Quick access to start quiz
- Empty state handling

### People Component

#### People (`/components/people/People.js`)
- **User Discovery Page**:
  - Search users by name or email
  - Sort by followers, name, or recent join date
  - User cards with:
    - Avatar and name
    - Email and bio
    - Follower count, badge count
    - Mutual followers indicator
    - Follow/Unfollow button
  - Click user card to view profile
  - Responsive grid layout

### Chat Components

#### Chat (`/components/chat/Chat.js`)
- Main chat container with sidebar and conversation view
- Handles URL parameters for starting chats from profiles
- Manages chat list and selected chat state

#### ChatList (`/components/chat/ChatList.js`)
- **Chat Sidebar**:
  - List of all chats (mutual follow required)
  - Last message preview
  - Timestamp display
  - Click to open conversation
  - Refresh button
- **Start New Chat Section**:
  - Shows mutual follows without existing chats
  - Quick start chat buttons
  - Filters out users with existing chats

#### ChatWindow (`/components/chat/ChatWindow.js`)
- **Chat Conversation View**:
  - Message display (oldest at top, newest at bottom)
  - Message bubbles (different styles for own/other)
  - Sender avatars and names
  - Timestamp formatting
  - Auto-scroll to bottom
  - **Message Input**:
    - Text input with send button
    - Optimistic UI updates
    - Real-time polling (every 2 seconds)
  - Header with other user info and "View Profile" button
  - Mutual follow status indicator

#### Saved Questions (Backend Ready)
- Save individual questions for later review
- Access saved questions from profile
- Filter and search saved questions

## Key Features Details

### Keyboard Shortcuts (QuizAttempt)

The quiz attempt page supports keyboard shortcuts for better user experience:

- **N** - Navigate to next question
- **P** - Navigate to previous question
- **S** - Submit quiz (with confirmation)
- **1-4** - Select option 1, 2, 3, or 4

### Infinite Scroll

The Explore page uses `react-infinite-scroll-component` to load quizzes as the user scrolls, improving performance for large quiz lists.

### Confirmation Dialogs

- Quiz attempt page warns before navigation
- Admin delete actions require confirmation
- Quiz submission requires confirmation

### Badge System

Badges are automatically awarded and displayed:
- After quiz completion
- On profile page
- In quiz results

### Real-time Updates

- Socket.io client configured for real-time chat (backend ready)
- Can be extended for real-time notifications

## Running the App

### Development Mode

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).  
The page reloads when you make changes.

### Build for Production

```bash
npm run build
```

Builds the app for production to the `build` folder.  
Optimized and minified for best performance.

### Run Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

## Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
REACT_APP_API_BASE_URL=http://localhost:5000

# Google OAuth Client ID (for Google Sign-In)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# CAS Authentication (optional)
REACT_APP_CAS_ENABLED=true
```

### Environment Variables Explained

- **REACT_APP_API_BASE_URL**: Base URL for all API requests to the backend server
- **REACT_APP_GOOGLE_CLIENT_ID**: Google OAuth 2.0 Client ID for Google Sign-In functionality
  - Required for Google OAuth login feature
  - Get from [Google Cloud Console](https://console.cloud.google.com/)
  - See [Google OAuth Setup Guide](#google-oauth-setup-guide) for detailed instructions
- **REACT_APP_CAS_ENABLED**: Enable CAS authentication button (optional, default: false)
  - Set to "true" to show CAS login button
  - Requires backend CAS configuration

## API Integration

The app uses a centralized API configuration in `src/utils/api.js`:

- Base URL from environment variable
- Automatic JWT token injection
- Error handling
- Request/response interceptors

### Example API Usage

```javascript
import api from '../utils/api';

// GET request
const quizzes = await api.get('/quizzes');

// POST request
const result = await api.post('/quizzes', { title, description });

// With authentication (automatic via interceptor)
const profile = await api.get(`/profile/${userId}`);
```

## Authentication Flow

### Login Flow
1. User logs in (email/password or Google OAuth) → Receives JWT token
2. Token stored in `localStorage` with user ID
3. Token automatically added to all API requests via axios interceptor
4. Protected routes check authentication via `ProtectedRoute` component
5. Role-based access for admin routes

### Persistent Login
1. On app startup, `AuthContext` checks for existing token in `localStorage`
2. Token expiration is validated (checks JWT `exp` claim)
3. If valid, user session is restored automatically
4. If expired or invalid, token is cleared and user is logged out
5. Loading state prevents premature redirects during authentication check

### Token Management
- **Automatic Injection**: All API requests include JWT token in `Authorization` header
- **Token Refresh**: Backend supports token refresh endpoint (`/api/auth/refresh`)
- **Expiration Handling**: 
  - 401 responses trigger automatic logout
  - Token expiry checked on app load
  - User redirected to login on token expiration

## State Management

- **AuthContext**: Global authentication state
- **Local State**: Component-level state with React hooks
- **API State**: Managed via axios and React hooks

## Styling

- Component-specific CSS files
- Global styles in `App.css`
- Material-UI components for some UI elements
- Responsive design principles

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ features required
- LocalStorage for token persistence

## Notes

- Ensure backend server is running before starting frontend
- CORS is configured on backend for `http://localhost:3000`
- Images are served from backend `/uploads` route
- Socket.io connection configured for real-time features
- All API endpoints require authentication except `/explore` and public routes

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend server is running
   - Check `REACT_APP_API_BASE_URL` in `.env`
   - Check browser console for CORS errors

2. **Authentication Issues**
   - Clear localStorage and login again
   - Check token expiration
   - Verify JWT_SECRET matches backend

3. **Build Errors**
   - Delete `node_modules` and reinstall
   - Check Node.js version (v18+ recommended)
   - Clear npm cache: `npm cache clean --force`

## Additional Features

### Banned Keywords Display
- Offensive content is automatically filtered by the backend
- Filtered words are replaced with `***` in the frontend
- Works automatically for quiz titles, descriptions, and questions
- No user action required

### Category Subscription
- Users can follow/unfollow quiz categories
- Followed categories are displayed on the profile page
- Helps users discover quizzes in their preferred topics
- Integration with Explore page for filtered viewing

### Quiz Statistics
- Real-time participant count
- Average score calculation
- Total questions count
- Date created information
- Available on quiz cards and detail pages

## Future Enhancements

- **Chat UI Component**: Real-time chat interface (backend ready)
- **Saved Questions Page**: Dedicated page for saved questions (backend ready)
- **Multi-level Comments**: Discussion threads on quizzes
- **Enhanced Notifications**: Real-time badge and quiz update notifications
- **Progressive Web App (PWA)**: Offline support and app-like experience
- **Dark Mode**: Theme switching support
- **Advanced Analytics**: User-specific analytics and insights
- **Quiz Recommendations**: AI-powered quiz suggestions

## Google OAuth Setup Guide

This guide will help you set up Google OAuth for the Quiz App frontend.

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Sign in with your Google account

2. **Create a New Project**
   - Click on the project dropdown at the top
   - Click "New Project"
   - Enter project name: "Quiz App" (or your preferred name)
   - Click "Create"

3. **Configure OAuth Consent Screen**
   - Navigate to **APIs & Services** > **OAuth consent screen**
   - Choose **External** (unless you have a Google Workspace)
   - Fill in the required information:
     - App name: "Quiz App"
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`, `openid`
   - Add test users if your app is in testing mode
   - Click "Save and Continue" through all steps

4. **Create OAuth 2.0 Client ID**
   - Go to **APIs & Services** > **Credentials**
   - Click **Create Credentials** > **OAuth client ID**
   - Application type: **Web application**
   - Name: "Quiz App Frontend" (or any name)
   - **Authorized JavaScript origins**:
     - Add: `http://localhost:3000` (for local development)
     - Add your production URL if deployed (e.g., `https://yourdomain.com`)
   - **Authorized redirect URIs**:
     - Add: `http://localhost:3000` (for local development)
     - Add your production URL if deployed
   - Click **Create**
   - **Copy the Client ID** (you'll need this for the `.env` file)

### Step 2: Configure Frontend

1. **Add Client ID to `.env` file**
   ```env
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
   ```

2. **Restart Development Server**
   - Stop the current server (Ctrl+C)
   - Start again with `npm start`
   - React requires a restart to pick up new environment variables

### Step 3: Verify Setup

1. Navigate to the login page (`/login`)
2. You should see the Google Sign-In button below the login form
3. Click the button to test Google OAuth
4. Select a Google account to sign in
5. You should be redirected to the dashboard upon successful authentication

### Troubleshooting

- **Google Sign-In button not visible**:
  - Check that `REACT_APP_GOOGLE_CLIENT_ID` is set in `.env`
  - Restart the development server after adding the variable
  - Check browser console for errors

- **OAuth error**:
  - Verify the Client ID is correct
  - Check that `http://localhost:3000` is in authorized JavaScript origins
  - Ensure OAuth consent screen is configured
  - Check backend is running and Google OAuth endpoint is working

- **CORS errors**:
  - Ensure backend CORS is configured for `http://localhost:3000`
  - Check backend environment variables are set correctly

### Production Deployment

When deploying to production:
1. Add your production URL to authorized JavaScript origins
2. Add your production URL to authorized redirect URIs
3. Update `REACT_APP_API_BASE_URL` to your production backend URL
4. Update `REACT_APP_GOOGLE_CLIENT_ID` if using a different client ID for production