import { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import {
  getChatbotReply,
  getQuickReplies,
  getWelcomeMessage,
} from "@/lib/chatbot-engine";
import { getApiBaseUrl } from "@/lib/api-base";
import { faqs as localFaqs } from "@/data/faq";

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "rounded-br-md bg-emerald text-white"
            : "rounded-bl-md border border-[#14532d]/10 bg-white text-[#14532d]"
        }`}
      >
        {!isUser && message.matchedQuestion && (
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-emerald/70">
            Re: {message.matchedQuestion}
          </p>
        )}
        <p className="whitespace-pre-wrap">{message.text}</p>
        {message.links?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.links.map((link) => (
              <Link
                key={link.href + link.label}
                to={link.href}
                className="inline-flex rounded-full border border-emerald/25 bg-[#f3f7f0] px-2.5 py-1 text-[11px] font-semibold text-emerald hover:bg-primary/40"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function SiteChatbot() {
  const { pathname } = useLocation();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [faqData, setFaqData] = useState(localFaqs);
  const [messages, setMessages] = useState(() => {
    const welcome = getWelcomeMessage();
    return [
      {
        id: "welcome",
        role: "bot",
        text: welcome.text,
        links: welcome.links,
        suggestions: welcome.suggestions,
      },
    ];
  });
  const [suggestions, setSuggestions] = useState(getQuickReplies());
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const hideOnAuth =
    pathname === "/signup" || pathname === "/forgot-password";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${getApiBaseUrl()}/faq`);
        if (!res.ok) return;
        const json = await res.json();
        const list = json?.data?.faqs;
        if (!cancelled && Array.isArray(list) && list.length) {
          setFaqData(list);
        }
      } catch {
        /* keep local FAQs */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [open, messages]);

  const pushBotReply = (userText) => {
    const reply = getChatbotReply(userText, { faqs: faqData });
    setMessages((prev) => [
      ...prev,
      {
        id: `bot-${Date.now()}`,
        role: "bot",
        text: reply.text,
        links: reply.links,
        matchedQuestion: reply.matchedQuestion,
        suggestions: reply.suggestions,
      },
    ]);
    if (reply.suggestions?.length) setSuggestions(reply.suggestions);
  };

  const sendText = (raw) => {
    const text = String(raw || "").trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: "user", text },
    ]);
    setInput("");
    window.setTimeout(() => pushBotReply(text), 220);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    sendText(input);
  };

  if (hideOnAuth) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="HIMU site assistant"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[calc(var(--mobile-nav-offset)+4.75rem)] right-3 z-[55] flex h-[min(520px,70dvh)] w-[min(100vw-1.5rem,370px)] flex-col overflow-hidden rounded-3xl border border-[#14532d]/12 bg-[#f8fbf4] shadow-[0_20px_50px_-20px_rgba(20,83,45,0.45)] md:bottom-24 md:right-6"
          >
            <div className="flex items-center justify-between gap-3 bg-emerald px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold leading-tight">HIMU Assistant</p>
                  <p className="text-[11px] text-white/75">Products · FAQ · Contact</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 hover:bg-white/10"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-3 overflow-y-auto px-3 py-3"
            >
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </div>

            {suggestions?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-t border-[#14532d]/08 px-3 py-2">
                {suggestions.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => sendText(chip.label)}
                    className="rounded-full border border-emerald/20 bg-white px-2.5 py-1 text-[11px] font-semibold text-emerald hover:bg-primary/50"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            <form
              onSubmit={onSubmit}
              className="flex items-center gap-2 border-t border-[#14532d]/10 bg-white px-3 py-2.5"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                maxLength={400}
                className="h-10 flex-1 rounded-xl border border-[#14532d]/12 bg-[#f8fbf4] px-3 text-sm text-[#14532d] outline-none placeholder:text-[#14532d]/40 focus:border-emerald/40"
                aria-label="Chat message"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald text-white disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <p className="bg-white px-3 pb-2 text-center text-[10px] text-[#14532d]/45">
              Not medical advice. For emergencies, contact a doctor.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Close HIMU assistant" : "Open HIMU assistant"}
        onClick={() => setOpen((v) => !v)}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-[calc(var(--mobile-nav-offset)+1.25rem)] right-3 z-[56] flex h-14 items-center gap-2 rounded-full bg-emerald px-4 text-white shadow-lg shadow-emerald/30 hover:bg-[#14532d] md:bottom-6 md:right-6"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="pr-1 text-sm font-bold">{open ? "Close" : "Chat"}</span>
      </motion.button>
    </>
  );
}
