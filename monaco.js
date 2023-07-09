var editor;

require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.39.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.querySelector(".monaco"), {
    theme: "vs-dark",
    automaticLayout: true,
    language: "c",
    value: ["int main() {", "", "}"].join("\n"),
  });
});

var myModalEl = document.getElementById("staticBackdrop");
var editorReadOnly;

myModalEl.addEventListener("show.bs.modal", function (event) {
  editorReadOnly = monaco.editor.create(
    document.getElementById("monaco-read-only"),
    {
      theme: "vs-dark",
      automaticLayout: true,
      language: "c",
      value: editor.getValue(),
      readOnly: true,
    }
  );
});

function submitChat() {
  var $chat = $("#chat-write");

  if ($chat.val()) {
    $(".modal-chat-content").append(
      $("<div>")
        .prop({
          className: "user-chat",
        })
        .prepend($("<div>").text("<"))
        .prepend($("<div>").text($chat.val()))
    );

    $chat.val("");
  }
}

$("#clearBtn").click(function () {
  $(".modal-chat-content").empty();
});

$(".btn-close").click(function () {
  editorReadOnly.dispose();
});

$("#chat-write").keydown(function (event) {
  if (event.key === "Enter") {
    submitChat();
  }
});
