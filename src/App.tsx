// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, RotateCcw, Star, Clock, Zap, Trophy, Lightbulb, Volume2, Settings, Award, Timer, Target } from 'lucide-react';

const MathPracticeApp = () => {
  const [currentScreen, setCurrentScreen] = useState('menu');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(10);
  const [mode, setMode] = useState('Practice'); // Practice or Challenge
  const [theme, setTheme] = useState('Default');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [missedProblems, setMissedProblems] = useState([]);
  const [showMissed, setShowMissed] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [badges, setBadges] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [fontSize, setFontSize] = useState('normal');
  
  const audioRef = useRef(null);

  const themes = {
    Default: { bg: 'bg-gradient-to-br from-blue-100 to-purple-100', primary: 'blue' },
    Space: { bg: 'bg-gradient-to-br from-purple-900 to-blue-900 text-white', primary: 'purple' },
    Jungle: { bg: 'bg-gradient-to-br from-green-100 to-yellow-100', primary: 'green' },
    Ocean: { bg: 'bg-gradient-to-br from-blue-200 to-teal-100', primary: 'teal' }
  } as const;

// Literal class names so Tailwind can see them at build time
const colorClasses = {
  blue:   { text600: 'text-blue-600',   bg500: 'bg-blue-500',   bg600: 'bg-blue-600',   hoverBg600: 'hover:bg-blue-600' },
  green:  { text600: 'text-green-600',  bg500: 'bg-green-500',  bg600: 'bg-green-600',  hoverBg600: 'hover:bg-green-600' },
  purple: { text600: 'text-purple-600', bg500: 'bg-purple-500', bg600: 'bg-purple-600', hoverBg600: 'hover:bg-purple-600' },
  teal:   { text600: 'text-teal-600',   bg500: 'bg-teal-500',   bg600: 'bg-teal-600',   hoverBg600: 'hover:bg-teal-600' },
} as const;
type Primary = keyof typeof colorClasses;

const c = colorClasses[themes[theme].primary as Primary];  

  const difficulties = {
    Easy: { label: '🟢 Easy', desc: 'Small numbers, no regrouping' },
    Medium: { label: '🟡 Medium', desc: 'Some regrouping, basic facts' },
    Hard: { label: '🔴 Hard', desc: 'Larger numbers, complex problems' }
  };

  const operations = [
    { name: 'Addition', symbol: '+', color: 'bg-green-500', emoji: '➕' },
    { name: 'Subtraction', symbol: '-', color: 'bg-blue-500', emoji: '➖' },
    { name: 'Multiplication', symbol: '×', color: 'bg-purple-500', emoji: '✖️' },
    { name: 'Division', symbol: '÷', color: 'bg-orange-500', emoji: '➗' },
    { name: 'Mixed', symbol: '?', color: 'bg-pink-500', emoji: '🎲' }
  ];

  const playSound = (type) => {
    if (!soundEnabled) return;
    // Using Web Audio API to generate simple tones
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
    } else {
      oscillator.frequency.setValueAtTime(293.66, audioContext.currentTime); // D4
      oscillator.frequency.setValueAtTime(246.94, audioContext.currentTime + 0.2); // B3
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const generateQuestion = (operation, difficulty) => {
    let num1, num2, answer, symbol, hint = '';
    
    switch(operation) {
      case 'Addition':
        if (difficulty === 'Easy') {
          num1 = Math.floor(Math.random() * 20) + 1;
          num2 = Math.floor(Math.random() * 20) + 1;
        } else if (difficulty === 'Medium') {
          num1 = Math.floor(Math.random() * 50) + 1;
          num2 = Math.floor(Math.random() * 50) + 1;
        } else {
          num1 = Math.floor(Math.random() * 100) + 50;
          num2 = Math.floor(Math.random() * 100) + 50;
        }
        answer = num1 + num2;
        symbol = '+';
        hint = `Try counting up from ${num1}: ${num1} → ${num1 + 1} → ${num1 + 2}...`;
        break;
        
      case 'Subtraction':
        if (difficulty === 'Easy') {
          num1 = Math.floor(Math.random() * 30) + 10;
          num2 = Math.floor(Math.random() * (num1 - 5)) + 1;
        } else if (difficulty === 'Medium') {
          num1 = Math.floor(Math.random() * 80) + 20;
          num2 = Math.floor(Math.random() * (num1 - 10)) + 10;
        } else {
          num1 = Math.floor(Math.random() * 100) + 50;
          num2 = Math.floor(Math.random() * (num1 - 20)) + 20;
        }
        answer = num1 - num2;
        symbol = '-';
        hint = `Think: What number plus ${num2} equals ${num1}?`;
        break;
        
      case 'Multiplication':
        if (difficulty === 'Easy') {
          num1 = Math.floor(Math.random() * 5) + 1;
          num2 = Math.floor(Math.random() * 5) + 1;
        } else if (difficulty === 'Medium') {
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
        } else {
          num1 = Math.floor(Math.random() * 12) + 1;
          num2 = Math.floor(Math.random() * 12) + 1;
        }
        answer = num1 * num2;
        symbol = '×';
        hint = `Think of ${num1} groups of ${num2}, or skip count by ${num2}: ${num2}, ${num2*2}, ${num2*3}...`;
        break;
        
      case 'Division':
        if (difficulty === 'Easy') {
          num2 = Math.floor(Math.random() * 5) + 1;
          answer = Math.floor(Math.random() * 5) + 1;
        } else if (difficulty === 'Medium') {
          num2 = Math.floor(Math.random() * 10) + 1;
          answer = Math.floor(Math.random() * 10) + 1;
        } else {
          num2 = Math.floor(Math.random() * 12) + 1;
          answer = Math.floor(Math.random() * 12) + 1;
        }
        num1 = num2 * answer;
        symbol = '÷';
        hint = `Think: ${num2} times what number equals ${num1}?`;
        break;
        
      case 'Mixed':
        const ops = ['Addition', 'Subtraction', 'Multiplication', 'Division'];
        return generateQuestion(ops[Math.floor(Math.random() * ops.length)], difficulty);
        
      default:
        return null;
    }
    
    return { num1, num2, answer, symbol, operation, hint };
  };

  const checkBadges = (newScore, newStreak, timeElapsed) => {
    const newBadges = [...badges];
    
    // Streak badges
    if (newStreak >= 5 && !badges.includes('streak5')) {
      newBadges.push('streak5');
    }
    if (newStreak >= 10 && !badges.includes('streak10')) {
      newBadges.push('streak10');
    }
    
    // Perfect score badge
    if (newScore === questions.length && !badges.includes('perfect')) {
      newBadges.push('perfect');
    }
    
    // Speed badge (under 30 seconds for 10 questions)
    if (questions.length === 10 && timeElapsed < 30000 && newScore >= 8 && !badges.includes('speed')) {
      newBadges.push('speed');
    }
    
    // Math master badge (20 questions, 90% accuracy)
    if (questions.length === 20 && (newScore / questions.length) >= 0.9 && !badges.includes('master')) {
      newBadges.push('master');
    }
    
    setBadges(newBadges);
  };

  const getBadgeInfo = (badge) => {
    const badgeMap = {
      streak5: { emoji: '🔥', name: 'Hot Streak!', desc: '5 correct in a row' },
      streak10: { emoji: '🌟', name: 'Super Streak!', desc: '10 correct in a row' },
      perfect: { emoji: '💯', name: 'Perfect Score!', desc: 'Got every question right' },
      speed: { emoji: '⚡', name: 'Speed Demon!', desc: 'Fast and accurate' },
      master: { emoji: '🏆', name: 'Math Master!', desc: '20 questions, 90% accuracy' }
    };
    return badgeMap[badge] || { emoji: '🎖️', name: 'Achievement', desc: 'Well done!' };
  };

  const startQuiz = (operation) => {
    setSelectedOperation(operation);
    const newQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      newQuestions.push(generateQuestion(operation, difficulty));
    }
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setUserAnswer('');
    setShowFeedback(false);
    setShowHint(false);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setQuestionTimes([]);
    setCurrentScreen('quiz');
  };

  const submitAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userNum = parseInt(userAnswer);
    const correct = userNum === currentQuestion.answer;
    const questionTime = Date.now() - questionStartTime;
    
    setQuestionTimes([...questionTimes, questionTime]);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
      setStreak(streak + 1);
      setMaxStreak(Math.max(maxStreak, streak + 1));
      playSound('correct');

      //Auto-advance to next question after 500ms if correct
      setTimeout(() => {
        nextQuestion();
      }, 500);

    } else {
      setStreak(0);
      setMissedProblems([...missedProblems, {
        ...currentQuestion,
        userAnswer: userNum
      }]);
      playSound('incorrect');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowFeedback(false);
      setShowHint(false);
      setQuestionStartTime(Date.now());
    } else {
      const endTime = Date.now();
      setEndTime(endTime);
      checkBadges(score + (isCorrect ? 1 : 0), maxStreak, endTime - startTime);
      setCurrentScreen('results');
    }
  };

  const resetQuiz = () => {
    setCurrentScreen('menu');
    setUserAnswer('');
    setShowFeedback(false);
    setShowMissed(false);
    setShowHint(false);
    setEndTime(null);
    setStartTime(null);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const MenuScreen = () => (
    <div className="text-center space-y-8">
      <div className="mb-8">
        <h1 className={`text-5xl font-bold ${c.text600} mb-4 ${fontSize === 'large' ? 'text-6xl' : ''}`}>
          🧮 Math Practice Adventure!
        </h1>
        <p className={`text-xl text-gray-700 ${fontSize === 'large' ? 'text-2xl' : ''}`}>
          Choose your math challenge!
        </p>
      </div>

      {/* Settings Panel */}
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Difficulty */}
          <div>
            <label className={`block text-sm font-semibold text-gray-700 mb-2 ${fontSize === 'large' ? 'text-base' : ''}`}>
              Difficulty Level
            </label>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 ${fontSize === 'large' ? 'text-lg' : ''}`}
            >
              {Object.entries(difficulties).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
            <p className={`text-xs text-gray-500 mt-1 ${fontSize === 'large' ? 'text-sm' : ''}`}>
              {difficulties[difficulty].desc}
            </p>
          </div>

          {/* Number of Questions */}
          <div>
            <label className={`block text-sm font-semibold text-gray-700 mb-2 ${fontSize === 'large' ? 'text-base' : ''}`}>
              Questions
            </label>
            <select 
              value={numQuestions} 
              onChange={(e) => setNumQuestions(parseInt(e.target.value))}
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 ${fontSize === 'large' ? 'text-lg' : ''}`}
            >
              <option value={5}>5 questions</option>
              <option value={10}>10 questions</option>
              <option value={15}>15 questions</option>
              <option value={20}>20 questions</option>
            </select>
          </div>

          {/* Mode */}
          <div>
            <label className={`block text-sm font-semibold text-gray-700 mb-2 ${fontSize === 'large' ? 'text-base' : ''}`}>
              Mode
            </label>
            <select 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 ${fontSize === 'large' ? 'text-lg' : ''}`}
            >
              <option value="Practice">🎯 Practice Mode</option>
              <option value="Challenge">⚡ Challenge Mode</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className={`block text-sm font-semibold text-gray-700 mb-2 ${fontSize === 'large' ? 'text-base' : ''}`}>
              Theme
            </label>
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
              className={`w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 ${fontSize === 'large' ? 'text-lg' : ''}`}
            >
              <option value="Default">🎨 Default</option>
              <option value="Space">🚀 Space</option>
              <option value="Jungle">🌿 Jungle</option>
              <option value="Ocean">🌊 Ocean</option>
            </select>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${soundEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'} ${fontSize === 'large' ? 'text-lg' : ''}`}
          >
            <Volume2 size={16} />
            Sound {soundEnabled ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 bg-blue-100 text-blue-700 ${fontSize === 'large' ? 'text-lg' : ''}`}
          >
            <Settings size={16} />
            {fontSize === 'large' ? 'Large Font' : 'Normal Font'}
          </button>
        </div>
      </div>

      {/* Operation Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {operations.map((op) => (
          <button
            key={op.name}
            onClick={() => startQuiz(op.name)}
            className={`${op.color} hover:opacity-90 text-white font-bold py-8 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${fontSize === 'large' ? 'text-2xl py-10' : 'text-xl'}`}
          >
            <div className={`mb-2 ${fontSize === 'large' ? 'text-5xl' : 'text-4xl'}`}>
              {op.emoji}
            </div>
            <div>{op.name}</div>
            {mode === 'Challenge' && <div className="text-sm mt-1">⏱️ Timed</div>}
          </button>
        ))}
      </div>

      {/* Badges Display */}
      {badges.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
          <h3 className={`font-bold text-gray-700 mb-4 flex items-center gap-2 ${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
            <Trophy className="text-yellow-500" />
            Your Badges ({badges.length})
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge, index) => {
              const info = getBadgeInfo(badge);
              return (
                <div key={index} className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-3xl mb-1">{info.emoji}</div>
                  <div className={`font-semibold text-sm ${fontSize === 'large' ? 'text-base' : ''}`}>{info.name}</div>
                  <div className={`text-xs text-gray-600 ${fontSize === 'large' ? 'text-sm' : ''}`}>{info.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Missed Problems Review */}
      {missedProblems.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowMissed(!showMissed)}
            className={`bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg ${fontSize === 'large' ? 'text-lg' : ''}`}
          >
            📚 Review Missed Problems ({missedProblems.length})
          </button>
        </div>
      )}

      {showMissed && (
        <div className="mt-6 p-6 bg-red-50 rounded-lg max-w-2xl mx-auto">
          <h3 className={`font-bold text-red-700 mb-4 ${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
            Problems to Practice:
          </h3>
          <div className="space-y-3">
            {missedProblems.map((problem, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className={`${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
                  {problem.num1} {problem.symbol} {problem.num2} = ?
                </div>
                <div className={`text-gray-600 mt-2 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
                  Your answer: {problem.userAnswer} | Correct answer: {problem.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const QuizScreen = () => {
    if (!questions[currentQuestionIndex]) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    const questionText = `${currentQuestion.num1} ${currentQuestion.symbol} ${currentQuestion.num2} equals what?`;
    
    return (
      <div className="text-center space-y-8">
        {/* Header with Progress and Streak */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className={`text-gray-600 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            {streak > 1 && (
              <div className={`flex items-center gap-1 text-orange-600 font-bold ${fontSize === 'large' ? 'text-lg' : ''}`}>
                <Zap className="text-orange-500" size={20} />
                {streak} in a row!
              </div>
            )}
            <div className={`text-gray-600 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
              Score: {score}/{currentQuestionIndex + (showFeedback ? 1 : 0)}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`${c.bg500} h-3 rounded-full transition-all duration-300`}
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Question Card */}
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <div className="flex justify-between items-start mb-4">
            <button
              onClick={() => speakText(questionText)}
              className="text-blue-500 hover:text-blue-700"
              title="Read question aloud"
            >
              <Volume2 size={20} />
            </button>
            {mode === 'Practice' && (
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-yellow-500 hover:text-yellow-700"
                title="Show hint"
              >
                <Lightbulb size={20} />
              </button>
            )}
          </div>

          <div className={`font-bold text-gray-800 mb-6 ${fontSize === 'large' ? 'text-5xl' : 'text-4xl'}`}>
            {currentQuestion.num1} {currentQuestion.symbol} {currentQuestion.num2} = ?
          </div>
          
          {showHint && (
            <div className={`bg-yellow-50 p-3 rounded-lg mb-4 text-yellow-700 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
              💡 {currentQuestion.hint}
            </div>
          )}
          
          {!showFeedback ? (
            <div className="space-y-4">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className={`text-center w-32 p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 ${fontSize === 'large' ? 'text-3xl w-40 p-4' : 'text-2xl'}`}
                placeholder="?"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && userAnswer && submitAnswer()}
              />
              <div>
                <button
                  onClick={submitAnswer}
                  disabled={!userAnswer}
                  className={`bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 px-8 rounded-lg ${fontSize === 'large' ? 'text-2xl py-4 px-10' : 'text-xl'}`}
                >
                  Submit
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`mb-4 ${fontSize === 'large' ? 'text-8xl' : 'text-6xl'}`}>
                {isCorrect ? (
                  <div className="text-green-500 animate-bounce">
                    <CheckCircle className="mx-auto" size={fontSize === 'large' ? 100 : 80} />
                    {streak > 1 && <div className="text-2xl mt-2">🔥</div>}
                  </div>
                ) : (
                  <XCircle className="text-red-500 mx-auto animate-pulse" size={fontSize === 'large' ? 100 : 80} />
                )}
              </div>
              
              <div className={`${fontSize === 'large' ? 'text-2xl' : 'text-xl'}`}>
                {isCorrect ? (
                  <div>
                    <span className="text-green-600 font-bold">Excellent! 🎉</span>
                    {streak > 1 && <div className="text-orange-600 mt-1">🔥 {streak} in a row!</div>}
                  </div>
                ) : (
                  <div>
                    <div className="text-red-600 font-bold mb-2">Not quite right! 🤔</div>
                    <div className="text-gray-700">
                      The answer is <span className={`font-bold ${c.text600}`}>{currentQuestion.answer}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={nextQuestion}
                className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg ${fontSize === 'large' ? 'text-2xl py-4 px-10' : 'text-xl'}`}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ResultsScreen = () => {
    const percentage = Math.round((score / questions.length) * 100);
    const totalTime = endTime - startTime;
    const avgTime = questionTimes.length > 0 ? questionTimes.reduce((a, b) => a + b, 0) / questionTimes.length : 0;
    
    return (
      <div className="text-center space-y-8">
        <div className="mb-8">
          <h2 className={`font-bold ${c.text600} mb-4 ${fontSize === 'large' ? 'text-5xl' : 'text-4xl'}`}>
            Quiz Complete! 🎊
          </h2>
          <div className={`mb-4 ${fontSize === 'large' ? 'text-8xl' : 'text-6xl'}`}>
            <Star className="text-yellow-500 mx-auto animate-spin" size={fontSize === 'large' ? 120 : 100} />
          </div>
        </div>

        {/* Results Summary */}
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <div className={`font-bold text-gray-800 mb-4 ${fontSize === 'large' ? 'text-4xl' : 'text-3xl'}`}>
            Your Score: {score}/{questions.length}
          </div>
          <div className={`${c.text600} font-semibold mb-4 ${fontSize === 'large' ? 'text-3xl' : 'text-2xl'}`}>
            {percentage}%
          </div>
          
          {/* Detailed Stats */}
          <div className={`space-y-2 text-gray-700 mb-4 ${fontSize === 'large' ? 'text-lg' : ''}`}>
            <div className="flex items-center justify-between">
              <span>✅ Correct:</span>
              <span className="font-semibold">{score}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>❌ Incorrect:</span>
              <span className="font-semibold">{questions.length - score}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>⚡ Best Streak:</span>
              <span className="font-semibold">{maxStreak}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>⏱️ Total Time:</span>
              <span className="font-semibold">{formatTime(totalTime)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>📊 Avg per Question:</span>
              <span className="font-semibold">{formatTime(avgTime)}</span>
            </div>
          </div>
          
          <div className={`text-gray-700 ${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
            {percentage >= 90 ? "Outstanding work! 🌟 You're a math superstar!" :
             percentage >= 80 ? "Great job! 👍 Keep up the excellent work!" :
             percentage >= 70 ? "Good effort! 💪 You're getting better!" :
             percentage >= 60 ? "Nice try! 📚 Practice makes perfect!" :
             "Keep practicing! 🎯 You've got this!"}
          </div>
        </div>

        {/* New Badges Earned */}
        {badges.length > 0 && (
          <div className="bg-yellow-50 p-6 rounded-xl shadow-lg max-w-md mx-auto">
            <h3 className={`font-bold text-yellow-700 mb-4 flex items-center justify-center gap-2 ${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
              <Award className="text-yellow-500" />
              New Badges Earned!
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {badges.slice(-2).map((badge, index) => {
                const info = getBadgeInfo(badge);
                return (
                  <div key={index} className="text-center p-3 bg-white rounded-lg shadow animate-bounce">
                    <div className="text-3xl mb-1">{info.emoji}</div>
                    <div className={`font-semibold ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>{info.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={resetQuiz}
              className={`${c.bg500} ${c.hoverBg600} text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 ${fontSize === 'large' ? 'text-xl py-4 px-10' : 'text-lg'}`}
            >
              <RotateCcw size={20} />
              Practice More
            </button>
            
            <button
              onClick={() => {
                const report = `
Math Practice Report
===================
Operation: ${selectedOperation}
Difficulty: ${difficulty}
Mode: ${mode}
Questions: ${questions.length}
Score: ${score}/${questions.length} (${percentage}%)
Best Streak: ${maxStreak}
Total Time: ${formatTime(totalTime)}
Average Time: ${formatTime(avgTime)}
                `;
                navigator.clipboard.writeText(report).then(() => {
                  alert('Report copied to clipboard!');
                });
              }}
              className={`bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 ${fontSize === 'large' ? 'text-xl py-4 px-10' : 'text-lg'}`}
            >
              📋 Copy Report
            </button>
          </div>
          
          {/* Share Results Button */}
          <button
            onClick={() => {
              const shareText = `I just completed a math quiz! 🧮\n${score}/${questions.length} correct (${percentage}%)\nBest streak: ${maxStreak} 🔥`;
              if (navigator.share) {
                navigator.share({
                  title: 'My Math Practice Results',
                  text: shareText
                });
              } else {
                navigator.clipboard.writeText(shareText);
                alert('Results copied to clipboard!');
              }
            }}
            className={`bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg ${fontSize === 'large' ? 'text-lg py-3 px-8' : ''}`}
          >
            📤 Share Results
          </button>
        </div>

        {/* Missed Problems Summary */}
        {missedProblems.length > 0 && (
          <div className="bg-red-50 p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
            <h3 className={`font-bold text-red-700 mb-4 ${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
              📚 Questions to Review ({missedProblems.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {missedProblems.slice(0, 4).map((problem, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow">
                  <div className={`font-semibold ${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
                    {problem.num1} {problem.symbol} {problem.num2} = {problem.answer}
                  </div>
                  <div className={`text-gray-600 mt-1 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
                    You answered: {problem.userAnswer || 'No answer'}
                  </div>
                </div>
              ))}
            </div>
            {missedProblems.length > 4 && (
              <p className={`text-center text-gray-600 mt-4 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
                ...and {missedProblems.length - 4} more. Check the main menu to review all!
              </p>
            )}
          </div>
        )}

        {/* Encouragement for Next Steps */}
        <div className="bg-blue-50 p-6 rounded-xl shadow-lg max-w-md mx-auto">
          <h3 className={`font-bold text-blue-700 mb-2 ${fontSize === 'large' ? 'text-xl' : 'text-lg'}`}>
            🎯 What's Next?
          </h3>
          <div className={`text-blue-600 space-y-2 ${fontSize === 'large' ? 'text-base' : 'text-sm'}`}>
            {percentage >= 90 ? (
              <div>Try a harder difficulty level or challenge mode! 🚀</div>
            ) : percentage >= 70 ? (
              <div>Practice the same level again to build confidence! 💪</div>
            ) : (
              <div>Review the missed problems and try an easier difficulty! 📚</div>
            )}
            {maxStreak < 5 && <div>• Try to get 5 correct answers in a row for a badge! 🔥</div>}
            {questions.length < 20 && <div>• Challenge yourself with 20 questions next time! 🏆</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${themes[theme].bg} p-4`}>
      <div className="max-w-4xl mx-auto py-8">
        {currentScreen === 'menu' && <MenuScreen />}
        {currentScreen === 'quiz' && <QuizScreen />}
        {currentScreen === 'results' && <ResultsScreen />}
      </div>
    </div>
  );
};

export default MathPracticeApp; 