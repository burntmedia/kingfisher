const growthQuestions = [
  {
    category: "Connecting with the family of God",
    shortName: "Community",
    nextStep:
      "Look for one relationship where honesty, grace, or forgiveness could become more intentional this week.",
    questions: [
      {
        text: "I am intentionally cultivating relationships with Christian friends and spiritual mentors.",
        detail: "I identify Christians who have character qualities I admire, and spend time with them.",
      },
      {
        text: "I am cultivating authentic community by speaking the truth in love and creating healthy boundaries.",
        detail: "I say what needs to be said in a loving and up-building way.",
      },
      {
        text: "I am increasingly becoming loving, grace-giving, and forgiving to others.",
        detail: "When people annoy me, I am increasingly able to respond calmly and positively.",
      },
      {
        text: "I am authentically connecting in my immediate family relationships.",
        detail: "So far as it is down to me, I am seeking to build honest, positive relationships.",
      },
      {
        text: "I am resolving conflict with others in a Biblical manner and supporting the leadership of this church family.",
        detail: "I am increasingly refusing to cause division through gossip, mud-slinging, or character assassination.",
      },
    ],
  },
  {
    category: "Maturing in my spiritual life",
    shortName: "Maturity",
    nextStep:
      "Choose one rhythm that helps you stay close to God, then make it small enough to repeat.",
    questions: [
      {
        text: "I am growing spiritually through regular quiet times, reading God's word, and praying.",
        detail: "Notice whether these practices are becoming a real source of life rather than a duty.",
      },
      {
        text: "I avoid addictive behaviours that hinder my growth.",
        detail: "Consider whether food, busyness, TV, or other habits are helping you avoid deeper issues.",
      },
      {
        text: "I have an active relationship with one or several people who encourage me in my spiritual walk.",
        detail: "These are people to whom I can make myself open and accountable.",
      },
      {
        text: "I am experiencing an increase of the Fruit of the Spirit in my life.",
        detail: "Love, joy, peace, patience, kindness, goodness, gentleness, and self-control.",
      },
      {
        text: "I am honouring God with my finances and giving to the church.",
        detail: "Reflect honestly on whether money is part of your worship and trust.",
      },
    ],
  },
  {
    category: "Discovering my ministry in the church",
    shortName: "Ministry",
    nextStep:
      "Name one gift, passion, or practical ability that could bless the church family in a regular way.",
    questions: [
      {
        text: "I have discovered how God has made me and am actively seeking to develop that in ministry.",
        detail: "Think about the kind of service that seems to fit how you are wired.",
      },
      {
        text: "I am actively demonstrating that I am Christ's servant in ordinary ways.",
        detail: "This includes attitudes towards family, friends, church, work, and daily life.",
      },
      {
        text: "I am serving in a regular ministry in the church body.",
        detail: "Regular service helps gifts become love in action.",
      },
      {
        text: "I am taking opportunities presented in the church for courses and gatherings that support my ministry.",
        detail: "Growth often comes through training, encouragement, and shared practice.",
      },
      {
        text: "I am an active, participating member of my Connect Group.",
        detail: "Participation means bringing presence, care, prayer, and contribution.",
      },
    ],
  },
  {
    category: "Growing in my sense of mission in the world",
    shortName: "Mission",
    nextStep:
      "Choose one person to pray for and one simple way to show them the love of Jesus.",
    questions: [
      {
        text: "I am actively praying for and cultivating relationships with unchurched friends and family.",
        detail: "Mission often begins with faithful love for specific people.",
      },
      {
        text: "I am actively witnessing to spiritual seekers.",
        detail: "This could be through your story, invitations, introductions, or another natural way.",
      },
      {
        text: "I am praying for God to show me where he can use me in the world in which I live.",
        detail: "Ask where your normal life already gives you meaningful opportunities.",
      },
      {
        text: "I am actively looking for and taking opportunities to build positively into other people's lives.",
        detail: "Look for ways to demonstrate Christ's love through words and acts of kindness.",
      },
      {
        text: "I am known by others as one who lives out their beliefs in everyday life.",
        detail: "Consider what people close to you would recognise as consistent and genuine.",
      },
    ],
  },
  {
    category: "Deepening my relationship with God in worship",
    shortName: "Worship",
    nextStep:
      "Find one ordinary moment this week and turn it into worship, surrender, or gratitude.",
    questions: [
      {
        text: "I am faithfully attending corporate worship services with a positive expectation that God will meet with me.",
        detail: "Expectation changes how we arrive and how we listen.",
      },
      {
        text: "I am actively seeking to know and do what pleases God as a way of life.",
        detail: "Worship is not just sung; it is lived.",
      },
      {
        text: "I am surrendering my whole life to the Lord, including exercise and nutrition.",
        detail: "The way I treat body, soul, and spirit reflects that they belong to God.",
      },
      {
        text: "The worship songs that I sing accurately and increasingly reflect my true feelings about God.",
        detail: "Notice where sung worship is becoming honest worship.",
      },
      {
        text: "I am honouring God with every dimension of my life by balancing his purposes in my life.",
        detail: "A growing life pays attention to all five areas together.",
      },
    ],
  },
];

const flattenedQuestions = growthQuestions.flatMap((group, categoryIndex) =>
  group.questions.map((question, questionIndex) => ({
    ...question,
    category: group.category,
    shortName: group.shortName,
    categoryIndex,
    questionIndex,
  }))
);

let currentQuestionIndex = 0;
const answers = Array(flattenedQuestions.length).fill(undefined);

const categoryList = document.querySelector("[data-category-list]");
const questionStage = document.querySelector("[data-question-stage]");
const resultsStage = document.querySelector("[data-results-stage]");
const resultsGrid = document.querySelector("[data-results-grid]");
const progressFill = document.querySelector("[data-progress-fill]");
const questionCount = document.querySelector("[data-question-count]");
const categoryName = document.querySelector("[data-category-name]");
const questionText = document.querySelector("[data-question-text]");
const questionDetail = document.querySelector("[data-question-detail]");
const ratingOptions = document.querySelector("[data-rating-options]");
const previousButton = document.querySelector("[data-previous]");
const nextButton = document.querySelector("[data-next]");
const restartButton = document.querySelector("[data-restart]");

function renderCategories() {
  if (!categoryList) return;

  categoryList.innerHTML = growthQuestions
    .map(
      (group, index) => `
        <li data-category-item="${index}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          ${group.shortName}
        </li>
      `
    )
    .join("");
}

function renderRatingOptions() {
  if (!ratingOptions) return;

  ratingOptions.innerHTML = Array.from({ length: 6 }, (_, value) => {
    return `<button class="rating-option" type="button" data-rating-value="${value}" aria-label="Choose ${value} out of 5">${value}</button>`;
  }).join("");

  ratingOptions.querySelectorAll("[data-rating-value]").forEach((button) => {
    button.addEventListener("click", () => {
      answers[currentQuestionIndex] = Number(button.dataset.ratingValue);
      renderQuestion();
    });
  });
}

function categoryProgress(categoryIndex) {
  const categoryQuestions = flattenedQuestions.filter((question) => question.categoryIndex === categoryIndex);
  return categoryQuestions.every((question) => answers[flattenedQuestions.indexOf(question)] !== undefined);
}

function renderQuestion() {
  const current = flattenedQuestions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / flattenedQuestions.length) * 100;

  progressFill.style.width = `${progress}%`;
  questionCount.textContent = `Question ${currentQuestionIndex + 1} of ${flattenedQuestions.length}`;
  categoryName.textContent = current.category;
  questionText.textContent = current.text;
  questionDetail.textContent = current.detail;
  previousButton.disabled = currentQuestionIndex === 0;
  nextButton.disabled = selectedAnswer === undefined;
  nextButton.textContent = currentQuestionIndex === flattenedQuestions.length - 1 ? "View results" : "Next";

  document.querySelectorAll("[data-category-item]").forEach((item) => {
    const categoryIndex = Number(item.dataset.categoryItem);
    item.classList.toggle("is-active", categoryIndex === current.categoryIndex);
    item.classList.toggle("is-complete", categoryProgress(categoryIndex));
  });

  ratingOptions.querySelectorAll("[data-rating-value]").forEach((button) => {
    button.classList.toggle("is-selected", Number(button.dataset.ratingValue) === selectedAnswer);
  });
}

function scoreLevel(score) {
  if (score <= 8) return "Needs attention";
  if (score <= 15) return "Developing";
  if (score <= 21) return "Growing";
  return "Strong";
}

function renderResults() {
  resultsGrid.innerHTML = growthQuestions
    .map((group, categoryIndex) => {
      const categoryAnswers = flattenedQuestions
        .map((question, index) => ({ ...question, answer: answers[index] }))
        .filter((question) => question.categoryIndex === categoryIndex);
      const score = categoryAnswers.reduce((sum, question) => sum + question.answer, 0);
      const percent = Math.round((score / 25) * 100);

      return `
        <article class="result-row">
          <div>
            <h3>${group.category}</h3>
            <p>${group.nextStep}</p>
            <div class="result-bar" aria-hidden="true"><span style="width: ${percent}%"></span></div>
          </div>
          <div class="result-score">
            ${score}/25
            <small>${scoreLevel(score)}</small>
          </div>
        </article>
      `;
    })
    .join("");

  questionStage.hidden = true;
  resultsStage.hidden = false;
  progressFill.style.width = "100%";
}

previousButton?.addEventListener("click", () => {
  if (currentQuestionIndex === 0) return;
  currentQuestionIndex -= 1;
  renderQuestion();
});

nextButton?.addEventListener("click", () => {
  if (answers[currentQuestionIndex] === undefined) return;

  if (currentQuestionIndex === flattenedQuestions.length - 1) {
    renderResults();
    return;
  }

  currentQuestionIndex += 1;
  renderQuestion();
});

restartButton?.addEventListener("click", () => {
  answers.fill(undefined);
  currentQuestionIndex = 0;
  resultsStage.hidden = true;
  questionStage.hidden = false;
  renderQuestion();
});

renderCategories();
renderRatingOptions();
renderQuestion();
