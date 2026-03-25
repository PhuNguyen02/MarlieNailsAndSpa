import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  useTheme,
  alpha,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { adminBlogApi } from '@/api/blogApi';
import type { BlogTag, CreateTagRequest } from '@/api/blogTypes';

const TagsManager: React.FC = () => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<CreateTagRequest>({ name: '', slug: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const theme = useTheme();

  const fetchTags = async () => {
    try {
      const data = await adminBlogApi.getTags();
      setTags(data);
    } catch {
      console.error('Failed to fetch tags');
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreate = async () => {
    try {
      await adminBlogApi.createTag(form);
      setDialogOpen(false);
      setForm({ name: '', slug: '' });
      fetchTags();
    } catch {
      console.error('Failed to create tag');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminBlogApi.deleteTag(deleteId);
      setDeleteId(null);
      fetchTags();
    } catch {
      console.error('Failed to delete tag');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          🏷️ Quản lý thẻ
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setForm({ name: '', slug: '' });
            setDialogOpen(true);
          }}
          sx={{
            bgcolor: theme.palette.primary.dark,
            '&:hover': { bgcolor: theme.palette.secondary.dark },
          }}
        >
          Thêm thẻ
        </Button>
      </Box>

      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <span>#{tag.name}</span>
                  <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                    ({(tag as any).postCount || 0})
                  </Typography>
                </Box>
              }
              onDelete={() => setDeleteId(tag.id)}
              sx={{
                borderRadius: 2,
                py: 0.5,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  transform: 'scale(1.05)',
                },
              }}
            />
          ))}
          {tags.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Chưa có thẻ nào. Hãy tạo thẻ mới!
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Thêm thẻ mới</DialogTitle>
        <DialogContent>
          <TextField
            label="Tên thẻ"
            fullWidth
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ mt: 1, mb: 2 }}
          />
          <TextField
            label="Slug"
            fullWidth
            size="small"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            helperText="Để trống để tự động tạo"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleCreate}>
            Tạo mới
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Xóa thẻ</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa thẻ này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TagsManager;
