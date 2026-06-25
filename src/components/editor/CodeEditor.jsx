import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { githubLight } from '@uiw/codemirror-theme-github';

const EXT = {
  c: () => cpp(),
  cpp: () => cpp(),
  java: () => java(),
  python: () => python(),
};

export default function CodeEditor({ value, onChange, language }) {
  const ext = EXT[language] ? [EXT[language]()] : [];
  return (
    <div className="h-full overflow-hidden rounded-lg border border-surface-line bg-white">
      <CodeMirror
        value={value}
        height="100%"
        theme={githubLight}
        extensions={ext}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          tabSize: 4,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
        }}
      />
    </div>
  );
}
