import { useState, useMemo } from "react";
import {
  LuSearch,
  LuChevronDown,
  LuInfo,
  LuMail,
  LuX,
  LuMessageSquare,
  LuCheck,
} from "react-icons/lu";

const FAQ_DATA = [
  {
    category: "General",
    questions: [
      {
        id: "gen-1",
        question: "What is WhistleWorks?",
        answer:
          "WhistleWorks is a centralized platform designed to connect sports officials with officiating camps and training opportunities. Officials can easily discover camps, register, manage their schedule, and track their development — all in one place.",
      },
      {
        id: "gen-2",
        question: "Who can use WhistleWorks?",
        answer: "WhistleWorks is designed for:",
        list: [
          "Sports officials looking to improve their skills and attend officiating camps",
          "Camp coordinators who want a streamlined way to manage registrations, schedules, and officials",
          "Camp staff (Evaluators) who want an easy and effective way of evaluating officials.",
        ],
      },
      {
        id: "gen-3",
        question: "What sports does WhistleWorks support?",
        answer:
          "Currently, WhistleWorks focuses on basketball officiating camps, with plans to expand into additional sports in the future.",
      },
    ],
  },
  {
    category: "Account & Registration",
    questions: [
      {
        id: "acc-1",
        question: "How do I create an account?",
        answer:
          "Visit www.whistleworks.org and click Sign Up. After entering your information, you will receive a one-time passcode (OTP) via email to verify your account.",
      },
      {
        id: "acc-2",
        question: "Does creating an account reserve my spot in a camp?",
        answer:
          "No. Creating an account does not reserve a spot in any camp. To attend a camp, you must register for the specific camp through the platform.",
      },
      {
        id: "acc-3",
        question: "Where can I see the camps I registered for?",
        answer:
          "Once registered, you can view your camps by clicking My Camps in your dashboard. Your registered camps will appear under the Registered tab.",
      },
      {
        id: "acc-4",
        question: "When can I check in to a camp?",
        answer:
          "The Check-In feature becomes available 24 hours before the start date of the camp.",
      },
    ],
  },
  {
    category: "Camp Registration",
    questions: [
      {
        id: "camp-1",
        question: "How do I register for a camp?",
        orderedList: [
          "Log into your WhistleWorks account",
          "Browse available camps",
          "Select the camp you want to attend",
          "Complete the registration and payment process",
        ],
      },
      {
        id: "camp-2",
        question: "What happens after I register?",
        answer: "After successful registration you will receive:",
        list: [
          "A registration confirmation email",
          "A payment receipt",
          "Access to the camp inside your My Camps dashboard",
        ],
      },
      {
        id: "camp-3",
        question: "I didn’t receive my confirmation email. What should I do?",
        answer:
          "First, check your spam or junk folder. If you still cannot find it, please contact support at drewbontrager@gmail.com.",
      },
    ],
  },
  {
    category: "Payments",
    questions: [
      {
        id: "pay-1",
        question: "What payment methods are accepted?",
        answer:
          "Payments are processed securely online through our payment system. Accepted payment methods include major credit and debit cards.",
      },
      {
        id: "pay-2",
        question: "Is my payment secure?",
        answer:
          "Yes. Payments are processed through our Stripe payment gateway to ensure your information is protected with industry-standard encryption.",
      },
      {
        id: "pay-3",
        question: "Can I get a refund if I cannot attend?",
        answer:
          "Refund policies are determined by the individual camp operator. Please refer to the specific camp’s refund policy listed during registration.",
      },
    ],
  },
  {
    category: "Camp Experience",
    questions: [
      {
        id: "exp-1",
        question: "How will I receive my game schedule?",
        answer:
          "Camp schedules and game assignments will be available inside your camp dashboard within WhistleWorks in real-time.",
      },
    ],
  },
  {
    category: "For Camp Directors",
    questions: [
      {
        id: "dir-1",
        question: "Why should camps use WhistleWorks?",
        answer: "WhistleWorks helps camps:",
        list: [
          "Manage registrations and online payments",
          "Conduct real-time evaluator feedback",
          "Communicate instantly with registered officials",
          "Automatically assign games and schedule crews",
          "Keep all camp logistics organized in one centralized portal",
        ],
      },
      {
        id: "dir-2",
        question: "How do I add my camp to WhistleWorks?",
        answer:
          "If you are interested in listing your camp, please contact us at drewbontrager@gmail.com or through the chatbot in the lower right corner of the screen.",
      },
    ],
  },
  {
    category: "Technical Questions",
    questions: [
      {
        id: "tech-1",
        question: "What should I do if I experience a technical issue?",
        answer:
          "If you experience a bug or issue while using the platform, please contact support via email at drewbontrager@gmail.com or our chatbot with:",
        list: [
          "A description of the issue",
          "The page or feature you were using",
          "A screenshot if possible",
        ],
      },
      {
        id: "tech-2",
        question: "What devices can I use WhistleWorks on?",
        answer: "WhistleWorks is fully responsive and works seamlessly across:",
        list: [
          "Desktop computers & laptops",
          "Tablets & iPads",
          "Mobile smartphones",
        ],
      },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openItems, setOpenItems] = useState({});

  // Flatten all questions with category meta
  const allQuestions = useMemo(() => {
    return FAQ_DATA.flatMap((group) =>
      group.questions.map((q) => ({ ...q, category: group.category }))
    );
  }, []);

  // Filter questions by search query & selected category
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchesCategory =
        selectedCategory === "All" || q.category === selectedCategory;
      const queryLower = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !queryLower ||
        q.question.toLowerCase().includes(queryLower) ||
        (q.answer && q.answer.toLowerCase().includes(queryLower)) ||
        q.category.toLowerCase().includes(queryLower);

      return matchesCategory && matchesSearch;
    });
  }, [allQuestions, selectedCategory, searchQuery]);

  // Group filtered questions by category
  const groupedFiltered = useMemo(() => {
    const map = {};
    filteredQuestions.forEach((q) => {
      if (!map[q.category]) {
        map[q.category] = [];
      }
      map[q.category].push(q);
    });
    return map;
  }, [filteredQuestions]);

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const nextState = {};
    filteredQuestions.forEach((q) => {
      nextState[q.id] = true;
    });
    setOpenItems(nextState);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const categories = ["All", ...FAQ_DATA.map((g) => g.category)];

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-900 pb-20 font-sans">
      {/* ── Hero Banner Section ─────────────────────────────────── */}
      <section className="relative bg-slate-950 text-white pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[48rem] h-[22rem] bg-primary/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-sky-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-primary text-xs font-bold uppercase tracking-wider mb-5 shadow-inner">
            <LuInfo className="text-primary text-sm animate-pulse" />
            <span>Support & Help Center</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
            Frequently Asked Questions
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light mb-8">
            Everything you need to know about officiating camp discovery, account setup, game assignments, and payments.
          </p>

          {/* Interactive Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all overflow-hidden backdrop-blur-md">
              <LuSearch className="text-slate-400 text-xl ml-5 shrink-0" />
              <input
                type="text"
                placeholder="Search questions, topics, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent px-4 py-4 text-white text-base placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-2 mr-3 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <LuX className="text-lg" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content Container ───────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Category Pills Navigation */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200/80 pb-6 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none max-w-full">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count =
                cat === "All"
                  ? allQuestions.length
                  : FAQ_DATA.find((g) => g.category === cat)?.questions.length || 0;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${isActive
                      ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                      : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                    }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions (Expand/Collapse) */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 shrink-0">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:text-primary hover:border-primary/40 transition-all cursor-pointer"
            >
              Expand All
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:text-slate-800 transition-all cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Search Results Summary */}
        {searchQuery && (
          <div className="mb-6 flex items-center justify-between bg-sky-50 border border-sky-200/80 rounded-2xl px-5 py-3 text-sm text-sky-900 font-medium">
            <span>
              Showing results for &quot;<strong className="font-bold">{searchQuery}</strong>&quot; (
              {filteredQuestions.length} found)
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredQuestions.length === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl mb-4">
              <LuSearch />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Matching Questions Found</h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              We couldn&apos;t find any questions matching {`"${searchQuery}"`}. Try adjusting your keywords or clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-sky-400 transition-all cursor-pointer shadow-md shadow-primary/20"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Grouped Accordion List */}
        <div className="space-y-10">
          {Object.entries(groupedFiltered).map(([category, questions]) => (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <div className="w-2.5 h-6 rounded-full bg-primary" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {category}
                </h2>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {questions.length}
                </span>
              </div>

              <div className="space-y-3">
                {questions.map((item) => {
                  const isOpen = !!openItems[item.id];

                  return (
                    <div
                      key={item.id}
                      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen
                          ? "border-primary/50 shadow-md ring-1 ring-primary/20"
                          : "border-slate-200/80 hover:border-slate-300 shadow-xs"
                        }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none group"
                      >
                        <span className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-primary transition-colors leading-snug">
                          {item.question}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen
                              ? "bg-primary text-white rotate-180"
                              : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                            }`}
                        >
                          <LuChevronDown className="text-lg" />
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 animate-fadeIn">
                          {item.answer && <p className="mb-3">{item.answer}</p>}

                          {/* Bullet list */}
                          {item.list && item.list.length > 0 && (
                            <ul className="space-y-2 mt-3 pl-2">
                              {item.list.map((bullet, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-slate-700">
                                  <LuCheck className="text-primary text-base shrink-0 mt-0.5" />
                                  <span>{bullet}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {/* Numbered list */}
                          {item.orderedList && item.orderedList.length > 0 && (
                            <ol className="space-y-2.5 mt-3">
                              {item.orderedList.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-slate-700">
                                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                                    {idx + 1}
                                  </span>
                                  <span className="pt-0.5">{step}</span>
                                </li>
                              ))}
                            </ol>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Still Have Questions Support CTA ────────────────────── */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
              <LuMessageSquare className="text-primary text-sm" />
              <span>Need Direct Support?</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Still Have Questions?
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              If you have any questions not covered in this FAQ, reach out directly or chat with our live support team.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="mailto:drewbontrager@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary hover:bg-sky-400 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-primary/25 hover:scale-105 cursor-pointer"
            >
              <LuMail className="text-lg" />
              <span>Email Support</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}