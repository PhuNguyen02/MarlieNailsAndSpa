import { useState, useEffect, useCallback } from 'react';
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
  Avatar,
  Rating,
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Switch,
  FormControlLabel,
  alpha,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { adminTestimonialsApi } from '../../api/testimonialsApi';
import type { Testimonial } from '../../api/types';

const emptyForm = {
  customerName: '',
  customerTitle: '',
  avatarUrl: '',
  content: '',
  rating: 5,
  isActive: true,
  displayOrder: 0,
};

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = useCallback(async () => {
    try {
      const res = await adminTestimonialsApi.getAll();
      const data = Array.isArray(res) ? res : (res as any)?.data || [];
      setTestimonials(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleOpen = (t?: Testimonial) => {
    if (t) {
      setEditId(t.id);
      setForm({
        customerName: t.customerName,
        customerTitle: t.customerTitle || '',
        avatarUrl: t.avatarUrl || '',
        content: t.content,
        rating: t.rating,
        isActive: t.isActive,
        displayOrder: t.displayOrder,
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editId) await adminTestimonialsApi.update(editId, form);
      else await adminTestimonialsApi.create(form);
      setDialogOpen(false);
      fetchItems();
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa đánh giá này?')) return;
    await adminTestimonialsApi.remove(id);
    fetchItems();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản Lý Đánh Giá
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Tổng: {testimonials.length} đánh giá khách hàng
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)' }}
        >
          Thêm Đánh Giá
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 600 } }}>
              <TableCell>Khách hàng</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id} sx={{ '&:hover': { bgcolor: alpha('#d4af8c', 0.05) } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={t.avatarUrl} alt={t.customerName}>
                      {t.customerName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {t.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t.customerTitle || 'Khách hàng'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Rating value={t.rating} size="small" readOnly />
                </TableCell>
                <TableCell sx={{ maxWidth: 300 }}>
                  <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                    {t.content}
                  </Typography>
                </TableCell>
                <TableCell>{t.displayOrder}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={t.isActive ? 'Hiện' : 'Ẩn'}
                    color={t.isActive ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton size="small" color="primary" onClick={() => handleOpen(t)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editId ? 'Sửa Đánh Giá' : 'Thêm Đánh Giá'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tên khách hàng"
                value={form.customerName}
                onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Danh hiệu/Chức vụ"
                placeholder="VD: Khách hàng thân thiết"
                value={form.customerTitle}
                onChange={(e) => setForm((p) => ({ ...p, customerTitle: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link ảnh đại diện"
                value={form.avatarUrl}
                onChange={(e) => setForm((p) => ({ ...p, avatarUrl: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Nội dung đánh giá"
                value={form.content}
                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Số sao
              </Typography>
              <Rating
                value={form.rating}
                onChange={(_, v) => setForm((p) => ({ ...p, rating: v || 5 }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Thứ tự hiển thị"
                value={form.displayOrder}
                onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                }
                label="Hiển thị công khai"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)' }}
          >
            {editId ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestimonialsManager;
