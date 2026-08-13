import { useState } from 'react';
import { POST_CATEGORIES, type PostCategory, type PostInput } from '../mocks/posts';
import { colors, radius, cardStyle, primaryButtonStyle, secondaryButtonStyle, inputStyle, fontMono } from '../styles/theme';
import { MarkdownContent } from './MarkdownContent';

type PostFormProps = {
  initialValues?: PostInput;
  submitLabel: string;
  onSubmit: (values: PostInput) => void;
  onCancel: () => void;
};

type FormErrors = Partial<Record<'title' | 'category' | 'content', string>>;

const validate = (title: string, category: string, content: string): FormErrors => {
  const errors: FormErrors = {};
  if (!title.trim()) errors.title = '제목을 입력해주세요.';
  if (!category) errors.category = '카테고리를 선택해주세요.';
  if (!content.trim()) errors.content = '본문을 입력해주세요.';
  return errors;
};

const labelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: colors.textHeading,
  marginBottom: '6px',
};

const errorTextStyle: React.CSSProperties = {
  color: colors.danger,
  fontSize: '12px',
  marginTop: '6px',
};

export const PostForm = ({ initialValues, submitLabel, onSubmit, onCancel }: PostFormProps) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [category, setCategory] = useState<PostCategory | ''>(initialValues?.category ?? '');
  const [content, setContent] = useState(initialValues?.content ?? '');
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(title, category, content);
  const hasErrors = Object.keys(errors).length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;
    onSubmit({ title: title.trim(), category: category as PostCategory, content });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ ...inputStyle, fontSize: '16px', fontWeight: 600 }}
        />
        {submitted && errors.title && <p style={errorTextStyle}>{errors.title}</p>}
      </div>

      <div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as PostCategory)}
          style={{ ...inputStyle, width: '220px' }}
        >
          <option value="">카테고리 선택</option>
          {POST_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        {submitted && errors.category && <p style={errorTextStyle}>{errors.category}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <p style={labelStyle}>본문 (Markdown)</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={'마크다운 문법으로 작성할 수 있어요.\n예) # 제목, **굵게**, ```코드블록```'}
            style={{
              ...inputStyle,
              minHeight: '360px',
              fontFamily: fontMono,
              fontSize: '13px',
              resize: 'vertical',
            }}
          />
          {submitted && errors.content && <p style={errorTextStyle}>{errors.content}</p>}
        </div>

        <div>
          <p style={labelStyle}>미리보기</p>
          <div style={{ ...cardStyle, minHeight: '360px', maxHeight: '480px', overflowY: 'auto', borderRadius: radius.md }}>
            {content.trim() ? (
              <MarkdownContent content={content} />
            ) : (
              <p style={{ color: colors.text, fontSize: '13px' }}>내용을 입력하면 미리보기가 표시됩니다.</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancel} style={secondaryButtonStyle}>
          취소
        </button>
        <button type="submit" style={primaryButtonStyle}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
