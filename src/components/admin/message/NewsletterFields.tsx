import { inputClass } from "@/pages/Login";
import type { NewsletterVals } from "./MessageData";

interface NewsletterValsProps {
  vals: NewsletterVals;
  set: (v: NewsletterVals) => void;
}
const NewsletterFields: React.FC<NewsletterValsProps> = ({ vals, set }) => (
  <>
    <div>
      <label className={inputClass.label}>Email Subject Line</label>
      <input
        value={vals.subject}
        onChange={(e) => set({ ...vals, subject: e.target.value })}
        placeholder="Enter email subject..."
        className={inputClass.input}
      />
    </div>
    <div>
      <label className={inputClass.label}>Message Content</label>
      <textarea
        value={vals.content}
        onChange={(e) => set({ ...vals, content: e.target.value })}
        placeholder="Write your message here..."
        rows={6}
        className={`${inputClass.input} resize-none`}
      />
    </div>
  </>
);

export default NewsletterFields;
