const fs = require("fs");
const path = require("path");
const mathjax = require("mathjax");

const traverseDir = (dir, callback) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
};

const parseExercise = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const [question, answer] = content.split("---").map((str) => str.trim());
  return { question, answer };
};

const renderMath = (content) => {
  return new Promise((resolve, reject) => {
    mjpage(
      content,
      {
        format: ["TeX"],
      },
      {
        html: true,
      },
      (output) => resolve(output),
    );
  });
};

const writeHTML = async (exercise, outputPath) => {
  let htmlContent = "<html><body>";

  const renderedQuestion = await renderMath(exercise.question);
  const renderedAnswer = await renderMath(exercise.answer);

  htmlContent += `
    ${renderedQuestion}
    <hr>
    ${renderedAnswer}
  `;

  htmlContent += "</body></html>";
  fs.writeFileSync(outputPath, htmlContent);
};

const exercises = [];

traverseDir("rawsolutions", (filePath) => {
    const exercise = parseExercise(filePath);
    const outputPath = filePath
      .replace("rawsolutions", "solutions")
      
    writeHTML(exercise, outputPath);
  }
});
