# 🏅 Fiori Study Buddy

A modern, interactive quiz application designed to help SAP Fiori developers and consultants prepare for certifications and enhance their knowledge. The application features a clean, responsive interface with question banks, scoring system, and leaderboards.

## ✨ Features

- **Question Banks**: Organized quiz questions in manageable banks of 40 questions each
- **Interactive Quiz Interface**: Modern, responsive UI built with Tailwind CSS
- **Scoring System**: Track your progress with detailed scoring metrics
- **Leaderboards**: Compete with others and track top performers
- **Time Tracking**: Monitor how long it takes to complete quizzes
- **Persistent Data**: Scores and leaderboards saved using LowDB

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```powershell
   git clone <repository-url>
   cd fioriPrepper
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Start the application**
   ```powershell
   npm start
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:3000` to start using the quiz app.

## 📁 Project Structure

```
fioriPrepper/
├── server.js              # Express.js backend server
├── package.json           # Project dependencies and scripts
├── data/
│   ├── questions.json     # Quiz questions database
│   └── leaderboard.json   # Leaderboard data storage
└── public/
    ├── index.html         # Main HTML page
    ├── main.js           # Frontend JavaScript logic
    └── style.css         # Custom styles
```

## 🔧 Technical Stack

- **Backend**: Node.js with Express.js
- **Database**: LowDB (JSON-based database)
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Module System**: ES6 modules

## 📊 API Endpoints

### Get Bank Information
```
GET /api/banks
```
Returns metadata about available question banks.

### Get Questions from Banks
```
GET /api/bank/:ids
```
Retrieve questions from specific bank(s). Use comma-separated IDs for multiple banks.
- Example: `/api/bank/1` (single bank)
- Example: `/api/bank/1,2,3` (multiple banks)

### Get Leaderboard
```
GET /api/leaderboard/:key
```
Retrieve top 10 scores for a specific quiz configuration.

### Submit Score
```
POST /api/leaderboard/:key
```
Submit a new score to the leaderboard.

**Request Body:**
```json
{
  "name": "Player Name",
  "score": 85,
  "total": 100,
  "time": 1500
}
```

## 🎯 How to Use

1. **Start a Quiz**: Select your desired question banks from the interface
2. **Answer Questions**: Work through the interactive quiz questions
3. **Track Progress**: Monitor your score and time as you progress
4. **Submit Results**: Enter your name to save your score to the leaderboard
5. **View Rankings**: Check the leaderboard to see how you compare with others

## 🔒 Data Management

- **Questions**: Stored in `data/questions.json` with a structured format including question text, answers, and correct answer indicators
- **Leaderboards**: Automatically saved to `data/leaderboard.json` with scores organized by quiz configuration
- **Bank System**: Questions are automatically divided into banks of 40 questions each

## 🛠️ Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)

### Customization

- **Bank Size**: Modify the `BANK_SIZE` constant in `server.js` (default: 40)
- **Leaderboard Size**: Adjust the slice limit in the leaderboard endpoint (default: top 10)
- **Name Length**: Change the character limit for player names (default: 20 characters)

## 📝 Adding Questions

To add new questions, update the `data/questions.json` file with the following structure:

```json
{
  "question": "Your question text here?",
  "image": null,
  "answers": [
    {
      "text": "Answer option 1",
      "correct": false
    },
    {
      "text": "Answer option 2",
      "correct": true
    }
  ]
}
```

## 🎨 UI Features

- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Modern dark theme for comfortable studying
- **Clean Interface**: Minimal, distraction-free design focused on learning
- **Real-time Feedback**: Immediate response to user interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is created for educational purposes.

## 👨‍💻 Author

**Carlo de Villiers** - 2025

---

*Happy studying! 🚀*
