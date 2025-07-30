# Tech Feud - Interactive Live Event Game 🚀

A cyberpunk-themed, real-time quiz and game show application built with React, Firebase, and Tailwind CSS. Perfect for tech conferences, meetups, and live events.

## 🚀 Features

- **Cyber/Techy Black Theme**: Dark, futuristic UI with neon accents and animations
- **Real-time Synchronization**: Live updates using Firebase Firestore
- **Multi-phase Game Flow**: Qualification quiz → Live game show
- **Admin Controls**: Complete event management dashboard
- **Presenter View**: Professional display for projectors/screens
- **Audience Participation**: Interactive experience for all attendees
- **Responsive Design**: Works on all devices and screen sizes

## 🎮 How to Access Different Panels

### 🏠 **Landing Page (Main Entry)**
- **URL**: `http://localhost:5173/` (or your deployed URL)
- **Access**: Open in any browser
- **Purpose**: Player registration and game entry point
- **Quick Access Codes**: URLs shown at bottom of login form

### 👨‍💼 **Admin Dashboard**
- **URL**: `http://localhost:5173/admin`
- **Password**: `admin2025`
- **Purpose**: Complete control over the game flow
- **Features**:
  - Start/stop quiz phases
  - Manage live game questions
  - Award points to finalists
  - View all participants and scores
  - System reset functionality

### 🎤 **Presenter View**
- **URL**: `http://localhost:5173/presenter`
- **Access**: Direct URL access (no authentication required)
- **Purpose**: Professional display for projectors and main screens
- **Features**:
  - Welcome screen with branding
  - Live quiz status
  - Game board with questions and answers
  - Real-time leaderboard
  - Controlled by admin dashboard

### 👥 **Audience View**
- **URL**: `http://localhost:5173/audience`
- **Access**: Direct URL access (no authentication required)
- **Purpose**: Read-only view for audience members
- **Features**:
  - Current game status
  - Live leaderboard
  - Question displays (when active)
  - Real-time updates

### 🏆 **Leaderboard**
- **URL**: `http://localhost:5173/leaderboard`
- **Access**: Direct URL access or automatic redirect after quiz
- **Purpose**: Show rankings and finalist status
- **Features**:
  - Real-time score updates
  - Finalist highlighting
  - Quiz and live game score breakdown

### 📝 **Quiz (Qualifier)**
- **URL**: `http://localhost:5173/quiz`
- **Access**: Automatic redirect from landing page when quiz is active
- **Purpose**: Qualification round for participants
- **Features**:
  - Timed questions
  - Real-time scoring
  - Progress tracking
  - Auto-submission

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tech-feud
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Anonymous sign-in)
   - Enable Firestore Database
   - Copy your Firebase config

4. **Configure Firebase**
   - Update `src/firebase.js` with your Firebase configuration
   - Run the database initialization:
   ```bash
   npm run init-db
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Main app: `http://localhost:5173`
   - Admin: `http://localhost:5173/admin`
   - Presenter: `http://localhost:5173/presenter`
   - Audience: `http://localhost:5173/audience`

## 🎯 Event Day Instructions

### Pre-event Setup (15 minutes before)

1. **Initialize System**
   ```bash
   npm run dev  # Start the application
   ```

2. **Open Required Tabs/Windows**
   - **Admin Control**: `http://localhost:5173/admin` (your device)
   - **Presenter Display**: `http://localhost:5173/presenter` (projector/main screen)
   - **Audience View**: `http://localhost:5173/audience` (optional secondary screen)

3. **Test All Panels**
   - Verify admin login works (password: `admin2025`)
   - Check presenter view displays correctly on projector
   - Ensure audience view is accessible

### Phase 1: Qualification Quiz (10-15 minutes)

1. **Announce to Participants**
   - "Visit [your-url] to join Tech Feud!"
   - "Enter your email and click 'Initialize Connection'"
   - "Complete the qualifier to advance to the live show!"

2. **Start the Quiz (Admin)**
   - Login to admin dashboard
   - Click "INITIATE QUALIFIER"
   - Monitor participant count in real-time

3. **During Quiz**
   - Presenter view shows live participant count
   - Audience can follow along on audience view
   - Admin can see all submissions in real-time

4. **End Quiz Phase**
   - Click "TERMINATE QUALIFIER" in admin
   - Top 10 participants automatically become finalists

### Phase 2: Live Game Show (15-20 minutes)

1. **Start Live Game**
   - Click "ACTIVATE LIVE BATTLE" in admin
   - Presenter view switches to game board

2. **Question Flow**
   - Select question from admin panel
   - Presenter view displays the question
   - Reveal answers one by one from admin
   - Award points to finalists who give correct answers

3. **Scoring**
   - Use point award buttons next to each finalist
   - Scores update in real-time across all views
   - Leaderboard automatically updates

### Phase 3: Results & Wrap-up

1. **Final Leaderboard**
   - All views show final rankings
   - Celebrate the winners!
   - Take screenshots for social media

2. **Reset for Next Session** (if needed)
   - Click "SYSTEM RESET" in admin
   - System returns to initial state

## 🎨 Customization

### Theme Colors (Tailwind Config)
- **Primary (Cyan)**: `#00ffff` - Main interface elements
- **Neon (Green)**: `#39ff14` - Success states, correct answers
- **Purple**: `#bf00ff` - Secondary elements
- **Hot Pink**: `#ff1493` - Accent elements
- **Dark**: `#0a0a0a` - Background base

### Adding Questions

#### Quiz Questions
Edit `src/components/Quiz.jsx` - `quizQuestions` array

#### Live Game Questions
Edit `src/components/AdminDashboard.jsx` - `liveGameQuestions` array

### Branding
- Update `index.html` title and meta tags
- Modify logos and branding text in components
- Customize color scheme in `tailwind.config.js`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS with custom cyber theme
- **Backend**: Firebase (Firestore + Authentication)
- **Real-time**: Firestore listeners
- **Routing**: React Router DOM

### File Structure
```
src/
├── components/           # React components
│   ├── LandingPage.jsx  # Main entry point
│   ├── Quiz.jsx         # Qualification quiz
│   ├── AdminDashboard.jsx # Control center
│   ├── PresenterView.jsx  # Projector display
│   ├── AudienceView.jsx   # Audience screen
│   └── Leaderboard.jsx    # Rankings display
├── firebase.js          # Firebase configuration
├── initDb.js           # Database initialization
├── index.css           # Custom styles + Tailwind
└── main.jsx            # App entry point
```

### Data Flow
1. **Admin** controls game state via dashboard
2. **Firestore** syncs state changes in real-time
3. **All views** listen to state changes and update automatically
4. **Participants** submit quiz answers and receive live updates

## 🔧 Troubleshooting

### Common Issues

**"Quiz Not Available"**
- Check admin dashboard - ensure quiz phase is active
- Verify Firebase connection
- Check browser console for errors

**Scores Not Updating**
- Verify Firestore rules allow read/write
- Check network connectivity
- Refresh the page

**Admin Login Failed**
- Default password is `admin2025`
- Check for typos
- Verify the component is loading correctly

**Presenter View Not Updating**
- Check Firebase configuration
- Verify Firestore listeners are active
- Ensure admin is controlling the correct game state

### Firebase Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## 📱 Mobile Support

The application is fully responsive and works on:
- **Desktop**: Optimal admin and presenter experience
- **Tablets**: Great for admin control on the go
- **Mobile**: Perfect for participant quiz taking
- **Large Screens**: Ideal for presenter view on projectors

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Hosting**
   ```bash
   firebase init hosting
   ```

3. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

### Alternative Deployment
- **Vercel**: Connect GitHub repo for auto-deployment
- **Netlify**: Drag and drop `dist` folder
- **AWS S3**: Upload build files to S3 bucket

## 🎉 Tips for Success

1. **Test Everything**: Run through the entire flow before your event
2. **Have Backup**: Keep admin login info handy
3. **Monitor Network**: Ensure stable internet connection
4. **Engage Audience**: Use the audience view to keep everyone involved
5. **Take Screenshots**: Capture the leaderboard for social media
6. **Keep Energy High**: The cyber theme creates great atmosphere!

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Firebase console for errors
3. Check browser developer tools console
4. Verify all URLs are accessible

---

**Ready to create an unforgettable tech event experience!** 🚀✨
