import './index.css';

import React, { useState } from 'react';
import fetchQuizQuestions, { Difficulty, QuestionState } from './API';

import QuestionCard from './components/QuestionCard';

const difficulties: { label: string; value: Difficulty }[] = [
  { label: 'Easy', value: Difficulty.EASY },
  { label: 'Medium', value: Difficulty.MEDIUM },
  { label: 'Hard', value: Difficulty.HARD },
];

const allowedAmountOfQuestions: number[] = [5, 10, 20];

type AnswerObject = {
  correctAnswer: string;
  isCorrect: boolean;
  question: string;
  userAnswer: string;
};

interface State {
  activeDifficulty: Difficulty;
  currentQuestion: number;
  gameOver: boolean;
  loading: boolean;
  questions: QuestionState[];
  score: number;
  totalQuestions: number;
  userAnswers: AnswerObject[];
}

const initialState = {
  activeDifficulty: Difficulty.UNDEFINED,
  totalQuestions: 5,
  currentQuestion: 0,
  gameOver: true,
  loading: false,
  questions: [],
  score: 0,
  userAnswers: [],
};

const App = () => {
  const [state, setState] = useState<State>(initialState);
  const {
    activeDifficulty,
    currentQuestion,
    gameOver,
    loading,
    questions,
    score,
    totalQuestions,
    userAnswers,
  } = state;

  const startTrivia = async (difficulty: Difficulty) => {
    setState((prevState) => ({ ...prevState, loading: true, gameOver: false }));

    const newQuestions = await fetchQuizQuestions(
      totalQuestions,
      activeDifficulty
    );

    setState((prevState: State) => ({
      ...prevState,
      loading: false,
      questions: newQuestions,
      activeDifficulty: difficulty,
    }));
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (gameOver) {
      return;
    }

    const userAnswer = e.currentTarget.value;
    const isCorrect = userAnswer === questions[currentQuestion].correct_answer;
    const answerObject = {
      question: questions[currentQuestion].question,
      userAnswer,
      isCorrect,
      correctAnswer: questions[currentQuestion].correct_answer,
    };

    if (isCorrect) {
      setState((prevState: State) => ({
        ...prevState,
        score: prevState.score + 1,
      }));
    }

    setState((prevState: State) => ({
      ...prevState,
      userAnswers: [...state.userAnswers, answerObject],
    }));
  };

  const nextQuestion = () => {
    const nextQuestion = currentQuestion + 1;

    if (nextQuestion === totalQuestions) {
      setState((prevState: State) => ({
        ...prevState,
        gameOver: true,
      }));
    } else {
      setState((prevState: State) => ({
        ...prevState,
        currentQuestion: nextQuestion,
      }));
    }
  };

  const showNextQuestionButton =
    !gameOver &&
    !loading &&
    userAnswers.length === currentQuestion + 1 &&
    currentQuestion + 1 !== totalQuestions;
  const showRestartButton = userAnswers.length === totalQuestions;

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="mb-6 text-5xl">Quiz</h1>
      {gameOver ? (
        <>
          <p className="mb-6">How many questions do you want?</p>
          <select
            className="mb-6 py-1 pl-1 pr-3 border-2 border-solid border-black"
            onChange={(e) =>
              setState((prevState) => ({
                ...prevState,
                totalQuestions: parseInt(e.target.value, 10),
              }))
            }
          >
            {allowedAmountOfQuestions.map((amount) => {
              return <option value={amount}>{amount}</option>;
            })}
          </select>
          <p className="mb-6">Choose difficulty</p>
          <div className="flex mb-6">
            {difficulties.map((difficulty) => {
              const isActive = activeDifficulty === difficulty.value;

              return (
                <button
                  className={`mr-4 last:mr-0 py-1 px-6 border-2 border-solid ${
                    isActive ? 'border-blue-500 text-blue-500' : 'border-black'
                  } hover:border-blue-500 hover:text-blue-500`}
                  onClick={() => {
                    startTrivia(difficulty.value);
                  }}
                >
                  {difficulty.label}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <p className="mb-6">Score: {score}</p>
          {loading && <p>Loading questions...</p>}
          <div className="text-center min-h-[500px]">
            {!loading && !gameOver && (
              <QuestionCard
                questionNumber={currentQuestion + 1}
                totalQuestions={totalQuestions}
                question={questions[currentQuestion].question}
                answers={questions[currentQuestion].answers}
                userAnswer={
                  userAnswers ? userAnswers[currentQuestion] : undefined
                }
                callback={checkAnswer}
              />
            )}

            {showNextQuestionButton && (
              <button
                className="mt-3 py-1 px-6 border-2 border-solid border-black hover:border-blue-500 hover:text-blue-500"
                onClick={nextQuestion}
              >
                Next question
              </button>
            )}
            {showRestartButton && (
              <>
                <p className="mb-4 mt-2 text-xl">Total score: {score}</p>
                <button
                  className="py-1 px-6 border-2 border-solid border-black hover:border-blue-500 hover:text-blue-500"
                  onClick={() => setState(initialState)}
                >
                  Play again
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
