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
  Chip,
  IconButton,
  Tooltip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  alpha,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { adminPromotionsApi } from '../../api/promotionsApi';
import type { Promotion } from '../../api/types';

const emptyForm: {
  title: string;
  description: string;
  discountType: 'percent' | 'fixed' | 'gift';
  discountValue: number;
  badge: string;
  imageUrl: string;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  displayOrder: number;
} = {
  title: '',
  description: '',
  discountType: 'percent',
  discountValue: 0,
  badge: '',
  imageUrl: '',
  validFrom: '',
  validUntil: '',
  isActive: true,
  displayOrder: 0,
};

const PromotionsManager = () => {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetch = useCallback(async () => {
    try {
      const res = await adminPromotionsApi.getAll();
      const data = Array.isArray(res) ? res : (res as any)?.data || [];
      setPromos(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleOpen = (p?: Promotion) => {
    if (p) {
      setEditId(p.id);
      setForm({
        title: p.title,
        description: p.description || '',
        discountType: p.discountType,
        discountValue: p.discountValue || 0,
        badge: p.badge || '',
        imageUrl: p.imageUrl || '',
        validFrom: p.validFrom?.split('T')[0] || '',
        validUntil: p.validUntil?.split('T')[0] || '',
        isActive: p.isActive,
        displayOrder: p.displayOrder,
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        validFrom: form.validFrom || undefined,
        validUntil: form.validUntil || undefined,
      };
      if (editId) await adminPromotionsApi.update(editId, payload);
      else await adminPromotionsApi.create(payload);
      setDialogOpen(false);
      fetch();
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa khuyến mãi này?')) return;
    await adminPromotionsApi.remove(id);
    fetch();
  };

  const formatDiscount = (p: Promotion) => {
    if (p.discountType === 'percent') return `${p.discountValue}%`;
    if (p.discountType === 'fixed') return `${(p.discountValue || 0).toLocaleString('vi-VN')}đ`;
    return 'Quà tặng';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản Lý Khuyến Mãi
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tổng: {promos.length} khuyến mãi</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)' }}
        >
          Thêm Khuyến Mãi
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
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Loại giảm</TableCell>
              <TableCell>Giá trị</TableCell>
              <TableCell>Badge</TableCell>
              <TableCell>Hiệu lực</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promos.map((p) => (
              <TableRow key={p.id} sx={{ '&:hover': { bgcolor: alpha('#d4af8c', 0.05) } }}>
                <TableCell sx={{ fontWeight: 500 }}>{p.title}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={
                      p.discountType === 'percent'
                        ? 'Phần trăm'
                        : p.discountType === 'fixed'
                          ? 'Cố định'
                          : 'Quà tặng'
                    }
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{formatDiscount(p)}</TableCell>
                <TableCell>{p.badge || '—'}</TableCell>
                <TableCell sx={{ fontSize: '0.85rem' }}>
                  {p.validFrom ? new Date(p.validFrom).toLocaleDateString('vi-VN') : '∞'} —{' '}
                  {p.validUntil ? new Date(p.validUntil).toLocaleDateString('vi-VN') : '∞'}
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={p.isActive ? 'Hoạt động' : 'Tạm nghỉ'}
                    color={p.isActive ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton size="small" color="primary" onClick={() => handleOpen(p)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {promos.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  Chưa có khuyến mãi nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editId ? 'Sửa Khuyến Mãi' : 'Thêm Khuyến Mãi'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Tiêu đề"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Loại giảm"
                value={form.discountType}
                onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value as any }))}
              >
                <MenuItem value="percent">Phần trăm (%)</MenuItem>
                <MenuItem value="fixed">Cố định (VND)</MenuItem>
                <MenuItem value="gift">Quà tặng</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Giá trị giảm"
                value={form.discountValue}
                onChange={(e) => setForm((p) => ({ ...p, discountValue: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Badge"
                placeholder="VD: HOT, -30%"
                value={form.badge}
                onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
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
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Bắt đầu"
                value={form.validFrom}
                onChange={(e) => setForm((p) => ({ ...p, validFrom: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="date"
                label="Kết thúc"
                value={form.validUntil}
                onChange={(e) => setForm((p) => ({ ...p, validUntil: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
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
                label="Đang hoạt động"
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

export default PromotionsManager;
