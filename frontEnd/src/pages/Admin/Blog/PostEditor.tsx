import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { Save, ArrowBack, Publish } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { adminBlogApi } from '@/api/blogApi';
import type { BlogCategory, BlogTag, CreatePostRequest, PostStatus } from '@/api/blogTypes';

const PostEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);

  const [form, setForm] = useState<CreatePostRequest>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    metaTitle: '',
    metaDescription: '',
    thumbnailUrl: '',
    status: 'draft',
    isFeatured: false,
    categoryIds: [],
    tagIds: [],
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, tgs] = await Promise.all([adminBlogApi.getCategories(), adminBlogApi.getTags()]);
      setCategories(cats);
      setTags(tgs);

      if (isEdit && id) {
        const post = await adminBlogApi.getPost(id);
        setForm({
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          thumbnailUrl: post.thumbnailUrl || '',
          status: post.status,
          isFeatured: post.isFeatured,
          categoryIds: post.categories?.map((c) => c.id) || [],
          tagIds: post.tags?.map((t) => t.id) || [],
        });
      }
    } catch {
      setError('Không thể tải dữ liệu');
    }
    setLoading(false);
  }, [id, isEdit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSave = async (status?: PostStatus) => {
    if (!form.title || !form.content) {
      setError('Vui lòng nhập tiêu đề và nội dung');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const data = { ...form };
      if (status) data.status = status;

      if (isEdit && id) {
        await adminBlogApi.updatePost(id, data);
        setSuccess('Bài viết đã được cập nhật!');
      } else {
        const newPost = await adminBlogApi.createPost(data);
        setSuccess('Bài viết đã được tạo!');
        setTimeout(() => navigate(`/admin/blog/posts/${newPost.id}/edit`), 1500);
      }
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra');
    }
    setSaving(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const media = await adminBlogApi.uploadMedia(file);
      setForm({ ...form, thumbnailUrl: media.url });
    } catch (err: any) {
      setError(err?.message || 'Upload thất bại');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/admin/blog/posts')}
            sx={{ color: 'text.secondary' }}
          >
            Quay lại
          </Button>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            {isEdit ? '✏️ Sửa bài viết' : '📝 Tạo bài viết mới'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            Lưu nháp
          </Button>
          <Button
            variant="contained"
            startIcon={<Publish />}
            onClick={() => handleSave('published')}
            disabled={saving}
            sx={{
              bgcolor: '#22C55E',
              '&:hover': { bgcolor: '#16A34A' },
            }}
          >
            {saving ? 'Đang lưu...' : 'Xuất bản'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Title */}
          <TextField
            label="Tiêu đề bài viết"
            fullWidth
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2 }}
          />

          {/* Slug */}
          <TextField
            label="Slug (URL)"
            fullWidth
            size="small"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            helperText="Để trống để tự động tạo từ tiêu đề"
            sx={{ mb: 3 }}
          />

          {/* Content Editor */}
          <Paper
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.15),
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderBottom: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.1),
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                📝 Nội dung (HTML)
              </Typography>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={20}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="Nhập nội dung bài viết bằng HTML..."
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                '& textarea': {
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                },
              }}
            />
          </Paper>

          {/* Excerpt */}
          <TextField
            label="Mô tả ngắn (Excerpt)"
            fullWidth
            multiline
            rows={3}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            sx={{ mt: 3 }}
          />
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Status */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              ⚙️ Trạng thái
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={form.status}
                label="Trạng thái"
                onChange={(e) => setForm({ ...form, status: e.target.value as PostStatus })}
              >
                <MenuItem value="draft">Bản nháp</MenuItem>
                <MenuItem value="published">Đã xuất bản</MenuItem>
                <MenuItem value="scheduled">Lên lịch</MenuItem>
              </Select>
            </FormControl>

            {form.status === 'scheduled' && (
              <TextField
                label="Ngày xuất bản"
                type="datetime-local"
                fullWidth
                size="small"
                value={form.scheduledAt || ''}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                />
              }
              label="Bài viết nổi bật"
            />
          </Paper>

          {/* Thumbnail */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              🖼️ Ảnh đại diện
            </Typography>
            {form.thumbnailUrl && (
              <Box
                component="img"
                src={form.thumbnailUrl}
                alt="Thumbnail"
                sx={{
                  width: '100%',
                  height: 180,
                  objectFit: 'cover',
                  borderRadius: 2,
                  mb: 2,
                }}
              />
            )}
            <TextField
              label="URL ảnh đại diện"
              fullWidth
              size="small"
              value={form.thumbnailUrl}
              onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
              sx={{ mb: 1.5 }}
            />
            <Button variant="outlined" component="label" fullWidth size="small">
              Tải ảnh lên
              <input type="file" hidden accept="image/*" onChange={handleUploadImage} />
            </Button>
          </Paper>

          {/* Categories */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              📁 Chuyên mục
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                multiple
                value={form.categoryIds || []}
                onChange={(e) => setForm({ ...form, categoryIds: e.target.value as string[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((id) => {
                      const cat = categories.find((c) => c.id === id);
                      return cat ? <Chip key={id} label={cat.name} size="small" /> : null;
                    })}
                  </Box>
                )}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* Tags */}
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              🏷️ Thẻ
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                multiple
                value={form.tagIds || []}
                onChange={(e) => setForm({ ...form, tagIds: e.target.value as string[] })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((id) => {
                      const tag = tags.find((t) => t.id === id);
                      return tag ? <Chip key={id} label={`#${tag.name}`} size="small" /> : null;
                    })}
                  </Box>
                )}
              >
                {tags.map((tag) => (
                  <MenuItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          {/* SEO */}
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha(theme.palette.divider, 0.08),
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              🔍 SEO
            </Typography>
            <TextField
              label="Meta Title"
              fullWidth
              size="small"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              helperText={`${(form.metaTitle || '').length}/60 ký tự`}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Meta Description"
              fullWidth
              size="small"
              multiline
              rows={3}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              helperText={`${(form.metaDescription || '').length}/160 ký tự`}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PostEditor;
