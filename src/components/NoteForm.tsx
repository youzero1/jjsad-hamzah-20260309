'use client';

import { useState } from 'react';

interface NoteFormValues {
  title: string;
  content: string;
  tags: string;
  isPublic: boolean;
  authorName: string;
}

interface NoteFormProps {
  onSubmit: (values: NoteFormValues) => Promise<void>;
  submitLabel?: string;
  initialValues?: NoteFormValues;
}

const defaultValues: NoteFormValues = {
  title: '',
  content: '',
  tags: '',
  isPublic: false,
  authorName: 'Anonymous',
};

export default function NoteForm({ onSubmit, submitLabel = 'Save', initialValues }: NoteFormProps) {
  const [values, setValues] = useState<NoteFormValues>(initialValues || defaultValues);
  const [errors, setErrors] = useState<Partial<NoteFormValues>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = (): boolean => {
    const newErrors: Partial<NoteFormValues> = {};
    if (!values.title.trim()) newErrors.title = 'Title is required';
    else if (values.title.trim().length > 200) newErrors.title = 'Title must be 200 characters or less';
    if (!values.content.trim()) newErrors.content = 'Content is required';
    if (!values.authorName.trim()) newErrors.authorName = 'Author name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: keyof NoteFormValues, value: string | boolean) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="form-card" noValidate>
      {submitError && (
        <div className="alert alert-error">{submitError}</div>
      )}

      <div className="form-group">
        <label className="form-label" htmlFor="title">Title <span>*</span></label>
        <input
          id="title"
          type="text"
          className={`form-input${errors.title ? ' form-input-error' : ''}`}
          placeholder="Give your note a title..."
          value={values.title}
          onChange={e => handleChange('title', e.target.value)}
          maxLength={200}
          disabled={submitting}
        />
        {errors.title && <span className="form-error">{errors.title}</span>}
        <span className="form-hint">{values.title.length}/200 characters</span>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="content">Content <span>*</span></label>
        <textarea
          id="content"
          className={`form-textarea${errors.content ? ' form-input-error' : ''}`}
          placeholder="Write your note here... (supports multi-line)"
          value={values.content}
          onChange={e => handleChange('content', e.target.value)}
          disabled={submitting}
          rows={8}
        />
        {errors.content && <span className="form-error">{errors.content}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="authorName">Author Name</label>
        <input
          id="authorName"
          type="text"
          className="form-input"
          placeholder="Your name"
          value={values.authorName}
          onChange={e => handleChange('authorName', e.target.value)}
          disabled={submitting}
        />
        {errors.authorName && <span className="form-error">{errors.authorName}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="tags">Tags <span>(optional)</span></label>
        <input
          id="tags"
          type="text"
          className="form-input"
          placeholder="e.g. tech, personal, ideas (comma-separated)"
          value={values.tags}
          onChange={e => handleChange('tags', e.target.value)}
          disabled={submitting}
        />
        <span className="form-hint">Separate tags with commas</span>
      </div>

      <div className="form-group">
        <label className="form-label">Visibility</label>
        <label className="form-toggle" htmlFor="isPublic" style={{ cursor: submitting ? 'not-allowed' : 'pointer' }}>
          <input
            id="isPublic"
            type="checkbox"
            style={{ display: 'none' }}
            checked={values.isPublic}
            onChange={e => handleChange('isPublic', e.target.checked)}
            disabled={submitting}
          />
          <div className={`toggle-switch ${values.isPublic ? 'on' : ''}`} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
              {values.isPublic ? '🌐 Public' : '🔒 Private'}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {values.isPublic
                ? 'Visible to everyone in the public feed'
                : 'Only visible to you'}
            </div>
          </div>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={() => window.history.back()} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
