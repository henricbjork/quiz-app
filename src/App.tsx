import './index.css';

import React, { useState } from 'react';
import fetchQuizQuestions, { Difficulty, QuestionState } from './API';

import QuestionCard from './components/QuestionCard';

const TOTAL_QUESTIONS: number = 2;

const difficulties: { label: string; value: Difficulty }[] = [
  { label: 'Easy', value: Difficulty.EASY },
  { label: 'Medium', value: Difficulty.MEDIUM },
  { label: 'Hard', value: Difficulty.HARD },
];

type AnswerObject = {
  correctAnswer: string;
  isCorrect: boolean;
  question: string;
  userAnswer: string;
};

interface State {
  currentQuestion: number;
  activeDifficulty: Difficulty;
  gameOver: boolean;
  loading: boolean;
  questions: QuestionState[];
  score: number;
  userAnswers: AnswerObject[];
}

const initialState = {
  currentQuestion: 0,
  activeDifficulty: Difficulty.UNDEFINED,
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
    userAnswers,
  } = state;

  console.log(activeDifficulty);
  const startTrivia = async (difficulty: Difficulty) => {
    setState({ ...initialState, loading: true, gameOver: false });

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
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

    if (nextQuestion === TOTAL_QUESTIONS) {
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
    currentQuestion + 1 !== TOTAL_QUESTIONS;
  const showRestartButton = userAnswers.length === TOTAL_QUESTIONS;

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <h1 className="mb-6 text-5xl">Quiz</h1>
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

      {!gameOver && <p className="mb-6">Score: {score}</p>}
      {loading && <p>Loading questions...</p>}
      <div className="text-center min-h-[500px]">
        {!loading && !gameOver && (
          <QuestionCard
            questionNumber={currentQuestion + 1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[currentQuestion].question}
            answers={questions[currentQuestion].answers}
            userAnswer={userAnswers ? userAnswers[currentQuestion] : undefined}
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
              onClick={() => startTrivia(activeDifficulty)}
            >
              Play again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
