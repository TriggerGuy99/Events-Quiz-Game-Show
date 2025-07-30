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

> **Quick Access**: All URLs are displayed at the bottom of the Landing Page for easy access during events!

### 🏠 **Landing Page (Main Entry)**
- **URL**: `http://localhost:5173/` (or your deployed URL)
- **Access**: Open in any browser - **NO PASSWORD REQUIRED**
- **Purpose**: Player registration and game entry point
- **What you'll see**: Email registration form, game status, and quick access links

### 👨‍💼 **Admin Dashboard** ⭐ **MOST IMPORTANT**
- **URL**: `http://localhost:5173/admin`
- **Password**: `admin2025` (enter when prompted)
- **Purpose**: **FULL CONTROL** over the entire game experience
- **Key Features**:
  - ✅ Start/stop quiz phases
  - ✅ Manage live game questions and answers
  - ✅ Award points to finalists during live rounds
  - ✅ View all participants and their scores
  - ✅ Reset system between games
  - ✅ Control what everyone else sees in real-time

### 🎤 **Presenter View** (For Main Screen/Projector)
- **URL**: `http://localhost:5173/presenter`
- **Access**: Direct URL - **NO PASSWORD REQUIRED**
- **Purpose**: Professional display for audience to see
- **Perfect for**: Main conference screen, projector, TV display
- **Shows**: Welcome screens, live questions, game board, leaderboard
- **Controlled by**: Admin dashboard (admin controls what appears here)

### 👥 **Audience View** (For Attendees to Watch)
- **URL**: `http://localhost:5173/audience`
- **Access**: Direct URL - **NO PASSWORD REQUIRED**
- **Purpose**: Read-only view for audience members who aren't playing
- **Perfect for**: People who want to follow along without participating
- **Shows**: Current game status, live leaderboard, active questions

### 🏆 **Leaderboard** (Live Rankings)
- **URL**: `http://localhost:5173/leaderboard`
- **Access**: Direct URL - **NO PASSWORD REQUIRED**
- **Purpose**: Shows current rankings and finalist status
- **Auto-redirect**: Players are automatically sent here after completing quiz
- **Features**: Real-time updates, finalist highlighting, score breakdowns

### � **Mobile Access URLs (Touch-Optimized)**

| Panel | URL | Best For | Access |
|-------|-----|----------|--------|
| **🏠 Landing** | `http://localhost:5173/` | Participants | Public |
| **👑 Admin** | `http://localhost:5173/admin` | **Event Host** | Password: `admin2025` |
| **🎤 Presenter** | `http://localhost:5173/presenter` | **Main Screen** | Public |
| **👥 Audience** | `http://localhost:5173/audience` | Spectators | Public |
| **🏆 Leaderboard** | `http://localhost:5173/leaderboard` | Results | Public |

### 🔧 **Mobile Optimizations Included:**
- ✅ Touch-friendly buttons (48px minimum)
- ✅ Responsive text sizes
- ✅ Optimized animations for mobile performance
- ✅ Finger-friendly spacing
- ✅ Reduced background effects on mobile
- ✅ Swipe-friendly navigation
- ✅ Portrait and landscape support

### 📲 **QR Code Setup (Recommended)**
Create QR codes for easy mobile access:
- **Main App**: `http://localhost:5173/`
- **Admin Panel**: `http://localhost:5173/admin`
- **Presenter View**: `http://localhost:5173/presenter`

### 💡 **Pro Tips for Mobile Events:**
1. **Share URLs via QR codes** - much easier than typing
2. **Test on actual phones** before the event
3. **Use airplane mode test** to simulate poor connectivity
4. **Keep admin panel on your phone** for mobility during events
5. **Use presenter view on tablets** for better visibility

## 🚀 **Quick Start for Event Hosts**

### 📱 **MOBILE-FIRST DESIGN** 
This app is optimized for mobile devices! All interfaces work perfectly on phones and tablets.

### 🎯 **Simultaneous Admin & Presenter Access**

**BEST SETUP for Live Events:**

1. **Primary Control Device (Your Phone/Laptop)**:
   - Open: `http://localhost:5173/admin`
   - Password: `admin2025`
   - Use this to control the entire game

2. **Main Display (Projector/TV/Second Screen)**:
   - Open: `http://localhost:5173/presenter`
   - This shows what the audience sees
   - Controlled automatically by your admin actions

3. **Optional: Audience Device**:
   - Open: `http://localhost:5173/audience`
   - Share this URL with people who want to follow along

### 🖥️ **Multi-Screen Setup Options:**

#### **Option 1: Single Device (Mobile/Laptop)**
- Use browser tabs: Admin in one tab, Presenter in another
- Switch between tabs to control and monitor

#### **Option 2: Two-Device Setup (Recommended)**
- **Device 1** (Your control): Admin panel (`/admin`)
- **Device 2** (Projector/TV): Presenter view (`/presenter`)

#### **Option 3: Professional Setup**
- **Your Phone**: Admin panel for full mobility
- **Laptop**: Connected to projector showing presenter view
- **Backup Device**: Audience view for monitoring

### 📋 **Event Day Workflow:**

1. **Pre-Event Setup** (5 mins before):
   ```
   ✅ Open admin panel on your control device
   ✅ Set up projector with presenter view
   ✅ Test both screens are working
   ✅ Have participant registration URL ready
   ```

2. **Registration Phase** (10-15 mins):
   ```
   ✅ Tell attendees: "Go to [your-url]"
   ✅ Watch registrations in admin panel
   ✅ Presenter view shows welcome screen
   ```

3. **Quiz Phase** (5-10 mins):
   ```
   ✅ Click "Start Quiz" in admin panel
   ✅ All players auto-redirected to quiz
   ✅ Monitor progress in admin panel
   ✅ Presenter view shows live quiz status
   ```

4. **Live Game Phase** (15-20 mins):
   ```
   ✅ Select finalists in admin panel
   ✅ Start live game round
   ✅ Control questions & answers from admin
   ✅ Award points in real-time
   ✅ Presenter view shows game board
   ```

5. **Results Phase**:
   ```
   ✅ Final leaderboard auto-displays
   ✅ Celebrate winners! 🎉
   ```

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
