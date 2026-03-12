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
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  alpha,
} from '@mui/material';
import { Search, Edit, Delete, Add, Visibility } from '@mui/icons-material';
import { servicesApi } from '../../api/servicesApi';
import type { Service, CreateServiceRequest, PriceType } from '../../api/types';

const categories = ['Gội đầu', 'Nails', 'Chăm sóc da', 'Triệt lông', 'Mi', 'Massage', 'Khác'];
const priceTypes: { value: PriceType; label: string }[] = [
  { value: 'single', label: 'Giá cố định' },
  { value: 'range', label: 'Khoảng giá' },
  { value: 'package', label: 'Gói' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

const emptyForm: CreateServiceRequest = {
  name: '',
  category: '',
  priceType: 'single',
  description: '',
  singlePrice: undefined,
  priceRangeMin: undefined,
  priceRangeMax: undefined,
  packagePrice: undefined,
  packageSessions: undefined,
  duration: '',
  zone: '',
};

const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateServiceRequest>(emptyForm);
  const [detailDialog, setDetailDialog] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      const res = await servicesApi.getAll();
      const data = Array.isArray(res) ? res : (res as any)?.data || [];
      setServices(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleOpen = (service?: Service) => {
    if (service) {
      setEditId(service.id);
      setForm({
        name: service.name,
        category: service.category,
        priceType: service.priceType,
        description: service.description || '',
        singlePrice: service.singlePrice,
        priceRangeMin: service.priceRangeMin,
        priceRangeMax: service.priceRangeMax,
        packagePrice: service.packagePrice,
        packageSessions: service.packageSessions,
        duration: service.duration || '',
        zone: service.zone || '',
      });
    } else {
      setEditId(null);
      setForm(emptyForm);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editId) {
        await servicesApi.update(editId, form);
      } else {
        await servicesApi.create(form);
      }
      setDialogOpen(false);
      fetchServices();
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    await servicesApi.delete(id);
    fetchServices();
  };

  const formatPrice = (s: Service): string => {
    const fmt = (n?: number) => n?.toLocaleString('vi-VN') || '0';
    switch (s.priceType) {
      case 'single':
        return `${fmt(s.singlePrice)}đ`;
      case 'range':
        return `${fmt(s.priceRangeMin)} - ${fmt(s.priceRangeMax)}đ`;
      case 'package':
        return `${fmt(s.packagePrice)}đ / ${s.packageSessions || 0} buổi`;
      case 'custom':
        return 'Liên hệ';
      default:
        return '—';
    }
  };

  const filtered = services.filter(
    (s) =>
      (!search || s.name.toLowerCase().includes(search.toLowerCase())) &&
      (!categoryFilter || s.category === categoryFilter),
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Quản Lý Dịch Vụ
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>Tổng: {services.length} dịch vụ</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)' }}
        >
          Thêm Dịch Vụ
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 250 }}
        />
        <TextField
          select
          size="small"
          label="Danh mục"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 600 } }}>
              <TableCell>Tên dịch vụ</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Thời lượng</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((svc) => (
              <TableRow key={svc.id} sx={{ '&:hover': { bgcolor: alpha('#d4af8c', 0.05) } }}>
                <TableCell sx={{ fontWeight: 500 }}>{svc.name}</TableCell>
                <TableCell>
                  <Chip size="small" label={svc.category} variant="outlined" />
                </TableCell>
                <TableCell>{formatPrice(svc)}</TableCell>
                <TableCell>{svc.duration || '—'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={svc.isActive ? 'Hoạt động' : 'Tạm nghỉ'}
                    color={svc.isActive ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Xem">
                    <IconButton size="small" onClick={() => setDetailDialog(svc)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <IconButton size="small" color="primary" onClick={() => handleOpen(svc)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton size="small" color="error" onClick={() => handleDelete(svc.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  Không có dịch vụ nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {editId ? 'Sửa Dịch Vụ' : 'Thêm Dịch Vụ Mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Tên dịch vụ"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Danh mục"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select
                fullWidth
                label="Loại giá"
                value={form.priceType}
                onChange={(e) => setForm((p) => ({ ...p, priceType: e.target.value as PriceType }))}
              >
                {priceTypes.map((p) => (
                  <MenuItem key={p.value} value={p.value}>
                    {p.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {form.priceType === 'single' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Giá (VND)"
                  value={form.singlePrice || ''}
                  onChange={(e) => setForm((p) => ({ ...p, singlePrice: Number(e.target.value) }))}
                />
              </Grid>
            )}
            {form.priceType === 'range' && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Giá thấp nhất"
                    value={form.priceRangeMin || ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, priceRangeMin: Number(e.target.value) }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Giá cao nhất"
                    value={form.priceRangeMax || ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, priceRangeMax: Number(e.target.value) }))
                    }
                  />
                </Grid>
              </>
            )}
            {form.priceType === 'package' && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Giá gói (VND)"
                    value={form.packagePrice || ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, packagePrice: Number(e.target.value) }))
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Số buổi"
                    value={form.packageSessions || ''}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, packageSessions: Number(e.target.value) }))
                    }
                  />
                </Grid>
              </>
            )}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Thời lượng"
                placeholder="VD: 60 phút"
                value={form.duration}
                onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Khu vực"
                placeholder="VD: Tay, Chân"
                value={form.zone}
                onChange={(e) => setForm((p) => ({ ...p, zone: e.target.value }))}
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

      {/* Detail Dialog */}
      <Dialog open={!!detailDialog} onClose={() => setDetailDialog(null)} maxWidth="sm" fullWidth>
        {detailDialog && (
          <>
            <DialogTitle sx={{ fontWeight: 600 }}>{detailDialog.name}</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={detailDialog.category} color="primary" variant="outlined" />
                <Chip label={formatPrice(detailDialog)} />
                <Chip
                  label={detailDialog.isActive ? 'Hoạt động' : 'Tạm nghỉ'}
                  color={detailDialog.isActive ? 'success' : 'default'}
                />
              </Box>
              {detailDialog.description && (
                <Typography sx={{ mt: 1, color: 'text.secondary' }}>
                  {detailDialog.description}
                </Typography>
              )}
              {detailDialog.duration && (
                <Typography sx={{ mt: 1 }}>
                  <strong>Thời lượng:</strong> {detailDialog.duration}
                </Typography>
              )}
              {detailDialog.zone && (
                <Typography>
                  <strong>Khu vực:</strong> {detailDialog.zone}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialog(null)}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ServicesManager;
