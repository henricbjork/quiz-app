import React from 'react';

type Props = {
  question: string;
  answers: string[];
  callback: any;
  userAnswer: any;
  questionNumber: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-[350px]">
      <p>
        Question: {questionNumber} / {totalQuestions}
      </p>
      <p
        dangerouslySetInnerHTML={{ __html: question }}
        className="my-6 text-2xl"
      />
      <div className="w-full">
        {answers.map((answer) => {
          const correctAnswer = answer === userAnswer?.correctAnswer;
          const hasAnswered = !!userAnswer;
          let buttonBackgroundColor =
            'bg-white hover:bg-black hover:text-white';

          if (hasAnswered) {
            if (correctAnswer) {
              buttonBackgroundColor = 'bg-green-400 hover:bg-green-400';
            } else {
              buttonBackgroundColor = 'bg-red-300 hover:bg-red-300';
            }
          }

          return (
            <div key={answer} className="mb-3">
              <button
                className={`p-2 w-full ${buttonBackgroundColor} last:mb-0 border-2 border-solid border-black`}
                disabled={!!userAnswer}
                value={answer}
                onClick={callback}
              >
                <span dangerouslySetInnerHTML={{ __html: answer }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
