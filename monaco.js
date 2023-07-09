var editor;

require.config({
    paths: {
        vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs",
    },
});

require(["vs/editor/editor.main"], function () {
    editor = monaco.editor.create(document.getElementById("monaco"), {
        theme: "vs-dark",
        automaticLayout: true,
        language: "c",
        value: ["int main() {", "", "}"].join("\n"),
    });
});

var myModalEl = document.getElementById("staticBackdrop");

myModalEl.addEventListener("show.bs.modal", function (event) {
    var modalCode = document.querySelector(".modal-code");
    var editorCode = editor.getValue();

    var editorReadOnly = monaco.editor.create(
        document.getElementById("monaco-read-only"),
        {
            theme: "vs-dark",
            automaticLayout: true,
            language: "c",
            value: editorCode,
            readOnly: true,
        }
    );
});
