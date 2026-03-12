import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { adminBlogApi } from '@/api/blogApi';
import type { BlogCategory, CreateCategoryRequest } from '@/api/blogTypes';

const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCategoryRequest>({ name: '', slug: '', description: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const theme = useTheme();

  const fetchCategories = async () => {
    try {
      const data = await adminBlogApi.getCategories();
      setCategories(data);
    } catch {
      console.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    try {
      if (editId) {
        await adminBlogApi.updateCategory(editId, form);
      } else {
        await adminBlogApi.createCategory(form);
      }
      setDialogOpen(false);
      setEditId(null);
      setForm({ name: '', slug: '', description: '' });
      fetchCategories();
    } catch {
      console.error('Failed to save category');
    }
  };

  const handleEdit = (cat: BlogCategory) => {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, description: cat.description || '' });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminBlogApi.deleteCategory(deleteId);
      setDeleteId(null);
      fetchCategories();
    } catch {
      console.error('Failed to delete category');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          📁 Quản lý chuyên mục
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setEditId(null);
            setForm({ name: '', slug: '', description: '' });
            setDialogOpen(true);
          }}
          sx={{
            bgcolor: theme.palette.primary.dark,
            '&:hover': { bgcolor: theme.palette.secondary.dark },
          }}
        >
          Thêm chuyên mục
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableCell sx={{ fontWeight: 700 }}>Tên</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Slug</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mô tả</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Số bài viết</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {cat.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    /{cat.slug}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 250,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cat.description || '—'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Chip label={(cat as any).postCount || 0} size="small" sx={{ height: 22 }} />
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Tooltip title="Sửa">
                    <IconButton size="small" onClick={() => handleEdit(cat)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton size="small" color="error" onClick={() => setDeleteId(cat.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có chuyên mục nào.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editId ? 'Sửa chuyên mục' : 'Thêm chuyên mục'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Tên chuyên mục"
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
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            {editId ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Xóa chuyên mục</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa chuyên mục này?</Typography>
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

export default CategoriesManager;
