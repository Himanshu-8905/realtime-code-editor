// import React, { useEffect, useRef } from 'react';
// import Codemirror from 'codemirror';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/theme/dracula.css';
// import 'codemirror/mode/javascript/javascript';
// import 'codemirror/addon/edit/closetag';
// import 'codemirror/addon/edit/closebrackets';
// import ACTIONS from '../Actions';

// const Editor = ({ socketRef, roomId, onCodeChange }) => {
//     const editorRef = useRef(null);
//     useEffect(() => {
//         async function init() {
//             editorRef.current = Codemirror.fromTextArea(
//                 document.getElementById('realtimeEditor'),
//                 {
//                     mode: { name: 'javascript', json: true },
//                     theme: 'dracula',
//                     autoCloseTags: true,
//                     autoCloseBrackets: true,
//                     lineNumbers: true,
//                 }
//             );

//             editorRef.current.on('change', (instance, changes) => {
//                 const { origin } = changes;
//                 const code = instance.getValue();
//                 onCodeChange(code);
//                 if (origin !== 'setValue') {
//                     socketRef.current.emit(ACTIONS.CODE_CHANGE, {
//                         roomId,
//                         code,
//                     });
//                 }
//             });
//         }
//         init();
//     }, []);

//     useEffect(() => {
//         if (socketRef.current) {
//             socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
//                 if (code !== null) {
//                     editorRef.current.setValue(code);
//                 }
//             });
//         }

//         return () => {
//             socketRef.current.off(ACTIONS.CODE_CHANGE);
//         };
//     }, [socketRef.current]);

//     return <textarea id="realtimeEditor"></textarea>;
// };

// export default Editor;




import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Actions';

const Editor = ({ socketRef, roomId, onCodeChange, username }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        // Initialize CodeMirror editor
        editorRef.current = Codemirror.fromTextArea(
            document.getElementById('realtimeEditor'),
            {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,
            }
        );

        // Detect changes and send them via socket
        editorRef.current.on('change', (instance, changes) => {
            const { origin } = changes;
            const code = instance.getValue();
            onCodeChange(code);

            if (origin !== 'setValue') {
                const cursor = instance.getCursor(); // Get cursor position
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code,
                    username,
                    cursor,
                });
            }
        });
    }, []);

    useEffect(() => {
        // Handle incoming socket events for code changes
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code, editor, cursor }) => {
                if (code !== null) {
                    editorRef.current.setValue(code);
                }
                if (editor && cursor) {
                    showEditorName(editor, cursor);
                }
            });
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
    }, [socketRef.current]);

    const showEditorName = (name, cursorPos) => {
        const marker = document.createElement('div');
        marker.textContent = name;
        marker.style.backgroundColor = 'rgba(255, 99, 71, 0.9)';
        marker.style.color = '#fff';
        marker.style.padding = '2px 6px';
        marker.style.borderRadius = '4px';
        marker.style.fontSize = '12px';
        marker.style.position = 'absolute';

        // Attach marker to the cursor position
        const { line, ch } = cursorPos;
        editorRef.current.addWidget({ line, ch }, marker, true);

        // Remove the marker after 2 seconds
        setTimeout(() => marker.remove(), 2000);
    };

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
