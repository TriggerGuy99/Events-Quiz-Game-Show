#!/bin/bash

# Tech Feud - Multi-Panel Launcher
# This script helps you open admin and presenter panels simultaneously

echo "🚀 Tech Feud - Multi-Panel Launcher"
echo "===================================="
echo ""

# Check if server is running
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Server is running on http://localhost:5173"
else
    echo "❌ Server is not running! Please start with: npm run dev"
    exit 1
fi

echo ""
echo "📱 Available Panels:"
echo "==================="
echo "1. 👑 Admin Panel (Password: admin2025)"
echo "   URL: http://localhost:5173/admin"
echo ""
echo "2. 🎤 Presenter View (For main screen/projector)"
echo "   URL: http://localhost:5173/presenter"
echo ""
echo "3. 🏠 Landing Page (For participants)"
echo "   URL: http://localhost:5173/"
echo ""
echo "4. 👥 Audience View (For spectators)"
echo "   URL: http://localhost:5173/audience"
echo ""
echo "5. 🏆 Leaderboard (For results)"
echo "   URL: http://localhost:5173/leaderboard"
echo ""

# Function to display URL for manual opening
display_url() {
    echo "🌐 Please open manually: $1"
}

# Function to open URL based on OS (fallback to display)
open_url() {
    if command -v xdg-open > /dev/null 2>&1; then
        xdg-open "$1" 2>/dev/null || display_url "$1"
    elif command -v open > /dev/null 2>&1; then
        open "$1" 2>/dev/null || display_url "$1"
    elif command -v start > /dev/null 2>&1; then
        start "$1" 2>/dev/null || display_url "$1"
    else
        display_url "$1"
    fi
}

echo "🎯 Quick Actions:"
echo "================="
echo "A) Open Admin + Presenter (Recommended for event hosts)"
echo "B) Open All Panels (For testing)"
echo "C) Show URLs only"
echo "Q) Quit"
echo ""

read -p "Choose an option (A/B/C/Q): " choice

case $choice in
    [Aa])
        echo ""
        echo "🔴 Opening Admin Panel..."
        open_url "http://localhost:5173/admin"
        sleep 2
        echo "🎤 Opening Presenter View..."
        open_url "http://localhost:5173/presenter"
        echo ""
        echo "✅ Both panels opened!"
        echo "💡 Admin Panel Password: admin2025"
        ;;
    [Bb])
        echo ""
        echo "🔴 Opening all panels..."
        open_url "http://localhost:5173/admin"
        sleep 1
        open_url "http://localhost:5173/presenter"
        sleep 1
        open_url "http://localhost:5173/"
        sleep 1
        open_url "http://localhost:5173/audience"
        sleep 1
        open_url "http://localhost:5173/leaderboard"
        echo ""
        echo "✅ All panels opened!"
        echo "💡 Admin Panel Password: admin2025"
        ;;
    [Cc])
        echo ""
        echo "📋 All URLs:"
        echo "============"
        echo "Admin:      http://localhost:5173/admin"
        echo "Presenter:  http://localhost:5173/presenter"
        echo "Landing:    http://localhost:5173/"
        echo "Audience:   http://localhost:5173/audience"
        echo "Leaderboard: http://localhost:5173/leaderboard"
        ;;
    [Qq])
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please try again."
        ;;
esac

echo ""
echo "🎉 Ready for your Tech Feud event!"
echo "📱 Pro tip: Use your phone for admin panel to stay mobile during the event!"
