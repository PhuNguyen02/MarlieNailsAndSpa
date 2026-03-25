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
  Grid,
  alpha,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Edit, Delete, Add, Panorama } from '@mui/icons-material';
import { adminBannersApi, Banner } from '../../api/bannersApi';

const emptyForm = {
  title: '',
  subtitle: '',
  imageUrl: '',
  buttonText: '',
  buttonLink: '',
  displayOrder: 0,
  isActive: true,
};

const BannersManager = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchBanners = useCallback(async () => {
    try {
      const data = await adminBannersApi.getAll();
      setBanners(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleOpen = (banner?: Banner) => {
    if (banner) {
      setEditId(banner.id);
      setForm({
        title: banner.title,
        subtitle: banner.subtitle || '',
        imageUrl: banner.imageUrl || '',
        buttonText: banner.buttonText || '',
        buttonLink: banner.buttonLink || '',
        displayOrder: banner.displayOrder,
        isActive: banner.isActive,
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editId) await adminBannersApi.update(editId, form);
      else await adminBannersApi.create(form);
      setDialogOpen(false);
      fetchBanners();
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa banner này?')) return;
    await adminBannersApi.remove(id);
    fetchBanners();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản Lý Hero Section
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tổng: {banners.length} banner/hero content</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)' }}
        >
          Thêm Banner
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
              <TableCell>Hình ảnh</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Thứ tự</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banners.map((b) => (
              <TableRow key={b.id} sx={{ '&:hover': { bgcolor: alpha('#d4af8c', 0.05) } }}>
                <TableCell>
                  {b.imageUrl ? (
                    <Box
                      component="img"
                      src={b.imageUrl}
                      sx={{ width: 80, height: 45, objectFit: 'cover', borderRadius: 1 }}
                    />
                  ) : (
                    <Panorama sx={{ color: 'divider' }} />
                  )}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{b.title}</TableCell>
                <TableCell>{b.displayOrder}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={b.isActive ? 'Hoạt động' : 'Tạm nghỉ'}
                    color={b.isActive ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Sửa">
                    <IconButton size="small" color="primary" onClick={() => handleOpen(b)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton size="small" color="error" onClick={() => handleDelete(b.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {banners.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  Chưa có banner nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editId ? 'Sửa Banner' : 'Thêm Banner'}
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả / Phụ đề"
                value={form.subtitle}
                onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL Hình ảnh"
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Text nút bấm"
                value={form.buttonText}
                onChange={(e) => setForm((p) => ({ ...p, buttonText: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Link nút bấm"
                value={form.buttonLink}
                onChange={(e) => setForm((p) => ({ ...p, buttonLink: e.target.value }))}
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
              <FormControlLabel
                control={
                  <Switch
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                }
                label="Kích hoạt"
                sx={{ mt: 1 }}
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

export default BannersManager;
