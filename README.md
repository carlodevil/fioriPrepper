# 🏅 Fiori Study Buddy

A modern, mobile‑first quiz application designed to help SAP Fiori developers and consultants prepare for certifications and enhance their knowledge. The application features a clean, responsive interface with question banks and a detailed scoring system.

## ✨ Features

- **Question Banks**: Organized quiz questions in manageable banks of 40 questions each
- **Interactive Quiz Interface**: Modern, responsive UI built with Tailwind CSS
- **Scoring System**: Track your progress with detailed scoring metrics
- **Time Tracking**: Monitor how long it takes to complete quizzes

## 🚀 Quick Start

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for Cloudflare deployment

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

3. **Start the application locally**
   ```powershell
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`.

5. **Deploy to Cloudflare** (optional)
   ```powershell
   wrangler deploy
   ```

## 📁 Project Structure

```
fioriPrepper/
├── worker.js             # Cloudflare Worker (Hono) serving API and assets
├── server.js             # Node wrapper for local development
├── package.json          # Project dependencies and scripts
├── data/
│   └── questions.json    # Quiz questions database
└── public/
    ├── index.html        # Main HTML page
    ├── main.js           # Frontend JavaScript logic
    └── style.css         # Custom styles
```

## 🔧 Technical Stack

- **Backend**: Cloudflare Worker using Hono
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


## 🎯 How to Use

1. **Start a Quiz**: Select your desired question banks from the interface
2. **Answer Questions**: Work through the interactive quiz questions
3. **Track Progress**: Monitor your score and time as you progress

## 🔒 Data Management

- **Questions**: Stored in `data/questions.json` with a structured format including question text, answers, and correct answer indicators
- **Bank System**: Questions are automatically divided into banks of 40 questions each

## 🛠️ Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)

### Customization

- **Bank Size**: Modify the `BANK_SIZE` constant in `worker.js` (default: 40)

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
