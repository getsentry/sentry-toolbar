import {useState} from 'react';
import Button from 'toolbar/components/base/Button';
import type {
  AskUserQuestionData,
  FileChangeApprovalData,
  PendingUserInput as PendingUserInputType,
  Question,
  QuestionOption,
} from 'toolbar/sentryApi/types/seerExplorer';

interface PendingUserInputProps {
  pendingInput: PendingUserInputType;
  onSubmit: (inputId: string, responseData?: Record<string, any>) => void;
  isSubmitting: boolean;
}

export default function PendingUserInput({
  pendingInput,
  onSubmit,
  isSubmitting,
}: PendingUserInputProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [selectedPatches, setSelectedPatches] = useState<number[]>([]);

  if (pendingInput.input_type === 'file_change_approval') {
    const data = pendingInput.data as FileChangeApprovalData;
    const patches = data.patches || [];
    const allSelected = selectedPatches.length === patches.length;

    const togglePatch = (index: number) => {
      setSelectedPatches(prev =>
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      );
    };

    const toggleAll = () => {
      if (allSelected) {
        setSelectedPatches([]);
      } else {
        setSelectedPatches(patches.map((_, i: number) => i));
      }
    };

    return (
      <div className="border-b border-b-translucentGray-200 bg-purple-400/10 px-2 py-2">
        <p className="mb-2 text-sm font-medium text-purple-400">File Changes Need Approval</p>

        {patches.length > 0 && (
          <div className="mb-2 flex flex-col gap-1">
            <button
              onClick={toggleAll}
              className="text-left text-xs text-purple-400 hover:underline">
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
            {patches.map((patch, index: number) => (
              <label key={index} className="flex items-start gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={selectedPatches.includes(index)}
                  onChange={() => togglePatch(index)}
                  disabled={isSubmitting}
                  className="mt-0.5"
                />
                <span className="text-gray-300">
                  {patch.path || patch.file || `Patch ${index + 1}`}
                </span>
              </label>
            ))}
          </div>
        )}

        <div className="flex flex-row gap-1">
          <Button
            variant="primary"
            onClick={() =>
              onSubmit(pendingInput.id, {
                approved: true,
                patches: selectedPatches,
              })
            }
            disabled={isSubmitting || selectedPatches.length === 0}>
            Approve Selected {selectedPatches.length > 0 ? `(${selectedPatches.length})` : ''}
          </Button>
          <Button
            variant="default"
            onClick={() =>
              onSubmit(pendingInput.id, {
                approved: false,
              })
            }
            disabled={isSubmitting}>
            Reject
          </Button>
        </div>
      </div>
    );
  }

  if (pendingInput.input_type === 'ask_user_question') {
    const data = pendingInput.data as AskUserQuestionData;
    const questions = data.questions || [];

    // Check if all questions are answered
    const allAnswered = questions.every((q: Question, qIndex: number) => {
      const key = q.header || qIndex;
      return selectedAnswers[key] !== undefined && selectedAnswers[key] !== '';
    });

    return (
      <div className="border-b border-b-translucentGray-200 bg-purple-400/10 px-2 py-2">
        <p className="mb-2 text-sm font-medium text-purple-400">Seer needs your input</p>

        <div className="mb-2 flex flex-col gap-2">
          {questions.map((q: Question, qIndex: number) => (
            <div key={qIndex} className="flex flex-col gap-1">
              <p className="text-sm text-gray-300">{q.question}</p>
              <div className="flex flex-col gap-0.5">
                {q.options?.map((option: QuestionOption, oIndex: number) => (
                  <label key={oIndex} className="flex items-start gap-2 text-xs">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={option.label}
                      checked={selectedAnswers[q.header || qIndex] === option.label}
                      onChange={e => {
                        setSelectedAnswers(prev => ({
                          ...prev,
                          [q.header || qIndex]: e.target.value,
                        }));
                      }}
                      disabled={isSubmitting}
                      className="mt-0.5"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-300">{option.label}</span>
                      {option.description && (
                        <span className="text-gray-400">{option.description}</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {!allAnswered && questions.length > 0 && (
          <p className="mb-2 text-xs text-gray-400">Please answer all questions before submitting</p>
        )}

        <Button
          variant="primary"
          onClick={() => onSubmit(pendingInput.id, {answers: selectedAnswers})}
          disabled={isSubmitting || !allAnswered}>
          Submit
        </Button>
      </div>
    );
  }

  return null;
}
