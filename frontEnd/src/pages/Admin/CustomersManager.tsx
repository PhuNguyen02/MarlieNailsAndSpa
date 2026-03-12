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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  alpha,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { Search, Edit, Visibility, Delete, Phone, Email } from '@mui/icons-material';
import { customersApi } from '../../api/customersApi';
import type { Customer } from '../../api/types';

const CustomersManager = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await customersApi.getAll();
      const data = Array.isArray(res) ? res : (res as any)?.data || [];
      setCustomers(data);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handlePhoneSearch = async () => {
    if (!phoneSearch.trim()) {
      fetchCustomers();
      return;
    }
    try {
      const res = await customersApi.getByPhone(phoneSearch);
      const data = (res as any)?.data || res;
      setCustomers(data ? [data] : []);
    } catch {
      setCustomers([]);
    }
  };

  const handleViewDetail = async (customer: Customer) => {
    try {
      const res = await customersApi.getById(customer.id);
      const data = (res as any)?.data || res;
      setSelectedCustomer(data);
    } catch {
      setSelectedCustomer(customer);
    }
    setDetailOpen(true);
  };

  const handleEditOpen = (c: Customer) => {
    setEditForm({
      fullName: c.fullName,
      email: c.email || '',
      phone: c.phone,
      address: (c as any).address || '',
      notes: (c as any).notes || '',
    });
    setSelectedCustomer(c);
    setEditOpen(true);
  };

  const handleSave = async () => {
    if (!selectedCustomer) return;
    try {
      await customersApi.update(selectedCustomer.id, editForm);
      setEditOpen(false);
      fetchCustomers();
    } catch {
      /* ignore */
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa khách hàng này?')) return;
    await customersApi.delete(id);
    fetchCustomers();
  };

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email || '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Quản Lý Khách Hàng
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Tổng: {customers.length} khách hàng
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Tổng khách', value: customers.length, color: '#1976d2' },
          {
            label: 'Tổng lượt ghé',
            value: customers.reduce((s, c) => s + (c.totalVisits || 0), 0),
            color: '#2e7d32',
          },
          {
            label: 'Tổng doanh thu',
            value: `${(customers.reduce((s, c) => s + (c.totalSpent || 0), 0) / 1000000).toFixed(1)}M`,
            color: '#ed6c02',
          },
        ].map((s, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card
              elevation={0}
              sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
            >
              <CardContent sx={{ py: 2, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: s.color }}>
                  {s.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {s.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Search */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Tìm theo tên, SĐT, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 280 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            placeholder="Tìm chính xác SĐT..."
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="outlined"
            onClick={handlePhoneSearch}
            sx={{ borderColor: '#d4af8c', color: '#b8956f' }}
          >
            Tìm SĐT
          </Button>
        </Box>
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
              <TableCell>Họ tên</TableCell>
              <TableCell>SĐT</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Số lần đến</TableCell>
              <TableCell align="right">Tổng chi tiêu</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} sx={{ '&:hover': { bgcolor: alpha('#d4af8c', 0.05) } }}>
                <TableCell sx={{ fontWeight: 500 }}>{c.fullName}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.email || '—'}</TableCell>
                <TableCell align="center">
                  <Chip
                    size="small"
                    label={c.totalVisits || 0}
                    color={c.totalVisits > 5 ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 500 }}>
                  {(c.totalSpent || 0).toLocaleString('vi-VN')}đ
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Xem">
                    <IconButton size="small" onClick={() => handleViewDetail(c)}>
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Sửa">
                    <IconButton size="small" color="primary" onClick={() => handleEditOpen(c)}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton size="small" color="error" onClick={() => handleDelete(c.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  Không tìm thấy khách hàng
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        {selectedCustomer && (
          <>
            <DialogTitle sx={{ fontWeight: 600 }}>{selectedCustomer.fullName}</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<Phone />}
                  label={selectedCustomer.phone}
                  variant="outlined"
                  size="small"
                />
                {selectedCustomer.email && (
                  <Chip
                    icon={<Email />}
                    label={selectedCustomer.email}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Số lần ghé
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {selectedCustomer.totalVisits || 0}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Tổng chi tiêu
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {(selectedCustomer.totalSpent || 0).toLocaleString('vi-VN')}đ
                  </Typography>
                </Grid>
              </Grid>
              {(selectedCustomer as any).bookings?.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Lịch sử đặt lịch gần đây
                  </Typography>
                  {(selectedCustomer as any).bookings.slice(0, 5).map((b: any) => (
                    <Box
                      key={b.id}
                      sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}
                    >
                      <Typography variant="body2">{b.serviceName || 'Dịch vụ'}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {new Date(b.bookingDate).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailOpen(false)}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Sửa Thông Tin Khách Hàng</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ tên"
                value={editForm.fullName}
                onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="SĐT"
                value={editForm.phone}
                onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Email"
                value={editForm.email}
                onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                value={editForm.address}
                onChange={(e) => setEditForm((p) => ({ ...p, address: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Ghi chú"
                value={editForm.notes}
                onChange={(e) => setEditForm((p) => ({ ...p, notes: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)' }}
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomersManager;
