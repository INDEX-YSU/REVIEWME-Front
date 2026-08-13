import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import styles from './MarkdownContent.module.css';

type MarkdownContentProps = {
  content: string;
};

export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
