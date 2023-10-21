#!/usr/bin/env bun
const fs = require("fs");
const path = require("path");

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

const books = {
  jaynes: {
    title: "Probability Theory: The Logic of Science",
    author: "E. T. Jaynes",
    link: "https://www.amazon.com/Probability-Theory-Science-T-Jaynes/dp/0521592712",
  },
};

const parseExercise = (filePath) => {
  let content = fs.readFileSync(filePath, "utf8");
  let base = path.basename(filePath);
  const parts = path.normalize(filePath).split(path.sep);
  const book = parts[parts.length - 2];
  const specific = books[book];
  content = content.replace(/---/g, "<hr/>");
  content = content.replace(/\n\n/g, "<p>");
  const meta = `${specific.title}; Exercise ${base}`;
  content =
    `
    <head>
      <meta name="description" content="${meta}"/>
      <link rel="stylesheet" type="text/css" href="/style.css">
      <title>${meta}</title>
    </head>` +
    content +
    `<hr> <small>Exercise ${base}, <a href="${specific.link}">${specific.title}</a>, ${specific.author}`;
  return content;
};

const renderMath = (content) => {
  const { mathjax } = require("mathjax-full/js/mathjax.js");
  const { TeX } = require("mathjax-full/js/input/tex.js");
  const { CHTML } = require("mathjax-full/js/output/chtml.js");
  const { liteAdaptor } = require("mathjax-full/js/adaptors/liteAdaptor.js");
  const { RegisterHTMLHandler } = require("mathjax-full/js/handlers/html.js");
  const {
    AssistiveMmlHandler,
  } = require("mathjax-full/js/a11y/assistive-mml.js");

  const { AllPackages } = require("mathjax-full/js/input/tex/AllPackages.js");
  const sortedPackages = AllPackages.sort().join(", ");
  const adaptor = liteAdaptor({ fontSize: 16 });
  AssistiveMmlHandler(RegisterHTMLHandler(adaptor));

  const tex = new TeX({
    packages: sortedPackages.split(/\s*,\s*/),
    inlineMath: [["$", "$"]],
  });
  const chtml = new CHTML({
    fontURL:
      "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2",
    exFactor: 1 / 2,
  });
  const html = mathjax.document(content, { InputJax: tex, OutputJax: chtml });

  html.render();

  if (Array.from(html.math).length === 0)
    adaptor.remove(html.outputJax.chtmlStyles);

  return adaptor.outerHTML(adaptor.root(html.document));
};

const writeHTML = (exercise, outputPath) => {
  const renderedQuestion = renderMath(exercise);

  fs.writeFileSync(outputPath, "<!DOCTYPE html>" + renderedQuestion);
};

traverseDir("rawsolutions", (filePath) => {
  const exercise = parseExercise(filePath);
  const outputPath = filePath.replace("rawsolutions", "solutions");

  writeHTML(exercise, outputPath + ".html");
});
