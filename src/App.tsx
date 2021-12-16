import React, { useState } from 'react';
import fetchQuizQuestions, { Difficulty, QuestionState } from './API';

import QuestionCard from './components/QuestionCard';

const TOTAL_QUESTIONS: number = 3;

type AnswerObject = {
  question: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
};

interface State {
  loading: boolean;
  questions: QuestionState[];
  currentQuestion: number;
  userAnswers: AnswerObject[];
  score: number;
  gameOver: boolean;
}

const initialState = {
  loading: false,
  questions: [],
  currentQuestion: 0,
  userAnswers: [],
  score: 0,
  gameOver: true,
};

const App = () => {
  const [state, setState] = useState<State>(initialState);
  const { loading, questions, currentQuestion, userAnswers, score, gameOver } =
    state;

  const startTrivia = async () => {
    setState({ ...initialState, loading: true, gameOver: false });

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setState((prevState: State) => ({
      ...prevState,
      loading: false,
      questions: newQuestions,
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

  const showStartButton = gameOver || userAnswers.length === TOTAL_QUESTIONS;
  const showNextQuestionButton =
    !gameOver &&
    !loading &&
    userAnswers.length === currentQuestion + 1 &&
    currentQuestion + 1 !== TOTAL_QUESTIONS;

  return (
    <div>
      <h1>Quiz</h1>
      {showStartButton && <button onClick={startTrivia}>Start</button>}
      {!gameOver && <p>Score: {score}</p>}
      {loading && <p>Loading questions...</p>}
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
        <button onClick={nextQuestion}>Next question</button>
      )}
    </div>
  );
};

export default App;
