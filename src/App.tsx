import React, { useState, useEffect } from 'react';
import { Brain, Plus, Minus, X, Divide, Trophy, Timer, Target, ArrowLeft } from 'lucide-react';

type Topic = 'addition' | 'subtraction' | 'multiplication' | 'division';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Problem {
  question: string;
  answer: number;
}

function App() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const generateProblem = (topic: Topic, difficulty: Difficulty): Problem => {
    let num1: number, num2: number;
    
    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        break;
      case 'medium':
        num1 = Math.floor(Math.random() * 41) + 10;
        num2 = Math.floor(Math.random() * 41) + 10;
        break;
      case 'hard':
        num1 = Math.floor(Math.random() * 51) + 50;
        num2 = Math.floor(Math.random() * 51) + 50;
        break;
    }

    let question: string;
    let answer: number;

    switch (topic) {
      case 'addition':
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
      case 'subtraction':
        question = `${num1} - ${num2}`;
        answer = num1 - num2;
        break;
      case 'multiplication':
        question = `${num1} × ${num2}`;
        answer = num1 * num2;
        break;
      case 'division':
        answer = num1;
        num2 = Math.floor(Math.random() * 9) + 2;
        question = `${num1 * num2} ÷ ${num2}`;
        break;
    }

    return { question, answer };
  };

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setTotalQuestions(0);
    setCorrectAnswers(0);
    setTimeLeft(difficulty === 'easy' ? 30 : difficulty === 'medium' ? 60 : 90);
    setCurrentProblem(generateProblem(selectedTopic, difficulty));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProblem) return;

    const numAnswer = parseFloat(userAnswer);
    setTotalQuestions(prev => prev + 1);
    
    if (numAnswer === currentProblem.answer) {
      setScore(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
      setFeedback('Correct! 🎉');
    } else {
      setFeedback(`Incorrect. The answer was ${currentProblem.answer}`);
    }

    setUserAnswer('');
    setCurrentProblem(generateProblem(selectedTopic, difficulty));

    setTimeout(() => setFeedback(''), 2000);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsGameActive(false);
    }
    return () => clearInterval(timer);
  }, [timeLeft, isGameActive]);

  const getTopicIcon = (topic: Topic) => {
    switch (topic) {
      case 'addition':
        return <Plus className="w-6 h-6" />;
      case 'subtraction':
        return <Minus className="w-6 h-6" />;
      case 'multiplication':
        return <X className="w-6 h-6" />;
      case 'division':
        return <Divide className="w-6 h-6" />;
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-teal-500';
    if (accuracy >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl p-8 max-w-2xl w-full border border-teal-100">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Brain className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-purple-900">Math Quest</h1>
        </div>

        {!isGameActive ? (
          timeLeft === 0 ? (
            // Final Score Page
            <div className="space-y-8 animate-fadeIn">
              <div className="text-center">
                <Trophy className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-purple-900 mb-2">Game Over!</h2>
                <p className="text-purple-600">Great effort! Here's how you did:</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg text-center border border-purple-200">
                  <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-purple-600 mb-1">Final Score</p>
                  <p className="text-2xl font-bold text-purple-800">{score}</p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg text-center border border-teal-200">
                  <Timer className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-teal-600 mb-1">Questions Attempted</p>
                  <p className="text-2xl font-bold text-teal-800">{totalQuestions}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-teal-50 p-6 rounded-lg text-center border border-teal-200">
                  <Target className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                  <p className="text-sm text-teal-600 mb-1">Accuracy</p>
                  <p className={`text-2xl font-bold ${getAccuracyColor(totalQuestions ? (correctAnswers / totalQuestions) * 100 : 0)}`}>
                    {totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="text-center space-y-4">
                <p className="text-purple-600">
                  Topic: <span className="font-semibold capitalize">{selectedTopic}</span> | 
                  Difficulty: <span className="font-semibold capitalize">{difficulty}</span>
                </p>
                <button
                  onClick={() => {
                    setTimeLeft(30);
                    setIsGameActive(false);
                  }}
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Play Again
                </button>
              </div>
            </div>
          ) : (
            // Initial Game Setup
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3 text-purple-900">Select Topic</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['addition', 'subtraction', 'multiplication', 'division'] as Topic[]).map(topic => (
                    <button
                      key={topic}
                      onClick={() => setSelectedTopic(topic)}
                      className={`flex items-center justify-center gap-2 p-3 rounded-lg border transition-all ${
                        selectedTopic === topic
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-teal-200 hover:border-purple-600 text-purple-900'
                      }`}
                    >
                      {getTopicIcon(topic)}
                      <span className="capitalize">{topic}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3 text-purple-900">Select Difficulty</h2>
                <div className="grid grid-cols-3 gap-3">
                  {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
                    <button
                      key={diff}
                      onClick={() => setDifficulty(diff)}
                      className={`p-3 rounded-lg border transition-all ${
                        difficulty === diff
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-teal-200 hover:border-purple-600 text-purple-900'
                      }`}
                    >
                      <span className="capitalize">{diff}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={startGame}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Start Game
              </button>
            </div>
          )
        ) : (
          // Active Game
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-lg font-semibold text-purple-900">Score: {score}</div>
              <div className="text-lg font-semibold text-purple-900">Time: {timeLeft}s</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold mb-4 text-purple-900">{currentProblem?.question}</div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="w-full max-w-xs text-center text-2xl p-2 border border-teal-200 rounded-lg focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                  placeholder="Enter your answer"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit
                </button>
              </form>
            </div>

            {feedback && (
              <div className={`text-center text-lg font-semibold ${
                feedback.includes('Correct') ? 'text-teal-600' : 'text-rose-600'
              }`}>
                {feedback}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;