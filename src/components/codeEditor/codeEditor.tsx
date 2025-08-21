"use client";
import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";

interface codeEditorProps {
  questionId: number;
  initialValue?: string;
  language: "javascript" | "java" | "python";
  onChange: (value: string) => void;
}
export default function CodeEditor({
  language = "javascript",
  onChange,
  questionId,
  initialValue = "// Start Coding",
}: codeEditorProps) {
  const [code, setCode] = useState(initialValue);
  useEffect(() => {
    setCode(initialValue);
  }, [initialValue]);
  return (
    <div className="p-3 border rounded-md shadow-sm bg-white">
      <CodeMirror
        value={code}
        height="250px"
        extensions={[
          language === "javascript"
            ? javascript()
            : language === "java"
            ? java()
            : python(),
        ]}
        onChange={(value) => {
          setCode(value);
          onChange(value);
        }}
      />
    </div>
  );
}
