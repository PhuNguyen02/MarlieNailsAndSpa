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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Grid,
  alpha,
} from '@mui/material';
import {
  Search,
  MarkEmailRead,
  Delete,
  Visibility,
  Email as EmailIcon,
  Phone,
  CalendarToday,
  MailOutline,
  Drafts,
} from '@mui/icons-material';
import { adminContactApi } from '../../api/contactApi';
import type { ContactMessage } from '../../api/types';

const ContactMessagesManager = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const params: Record<string, string | number | undefined> = {
        page: page + 1,
        limit: rowsPerPage,
      };
      if (filter === 'read') params.isRead = 'true';
      if (filter === 'unread') params.isRead = 'false';
      const res = await adminContactApi.getAll(params as any);
      const data = (res as any)?.data || res;
      setMessages(data.items || []);
      setTotal(data.total || 0);
    } catch {
      /* ignore */
    }
  }, [page, rowsPerPage, filter]);

  const fetchStats = async () => {
    try {
      const res = await adminContactApi.getStats();
      const data = (res as any)?.data || res;
      setStats(data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);
  useEffect(() => {
    fetchStats();
  }, []);

  const handleMarkRead = async (id: string) => {
    await adminContactApi.markAsRead(id);
    fetchMessages();
    fetchStats();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tin nhắn này?')) return;
    await adminContactApi.remove(id);
    fetchMessages();
    fetchStats();
  };

  const handleView = (msg: ContactMessage) => {
    setSelectedMsg(msg);
    setDialogOpen(true);
    if (!msg.isRead) handleMarkRead(msg.id);
  };

  const filteredMessages = messages.filter(
    (m) =>
      !search ||
      m.fullName.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Tin Nhắn Liên Hệ
      </Typography>
      <Typography sx={{ color: 'text.secondary', mb: 4 }}>
        Quản lý tin nhắn từ khách hàng
      </Typography>

      {/* Stats */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[
          { label: 'Tổng tin nhắn', value: stats.total, icon: <EmailIcon />, color: '#1976d2' },
          { label: 'Chưa đọc', value: stats.unread, icon: <MailOutline />, color: '#ed6c02' },
          {
            label: 'Đã đọc',
            value: stats.total - stats.unread,
            icon: <Drafts />,
            color: '#2e7d32',
          },
        ].map((s, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card
              elevation={0}
              sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(s.color, 0.1),
                    color: s.color,
                  }}
                >
                  {s.icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {s.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {s.label}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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
        {['all', 'unread', 'read'].map((f) => (
          <Chip
            key={f}
            label={f === 'all' ? 'Tất cả' : f === 'unread' ? 'Chưa đọc' : 'Đã đọc'}
            onClick={() => {
              setFilter(f);
              setPage(0);
            }}
            color={filter === f ? 'primary' : 'default'}
            variant={filter === f ? 'filled' : 'outlined'}
          />
        ))}
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
              <TableCell>Email</TableCell>
              <TableCell>Chủ đề</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày gửi</TableCell>
              <TableCell align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMessages.map((msg) => (
              <TableRow
                key={msg.id}
                sx={{
                  cursor: 'pointer',
                  bgcolor: msg.isRead ? 'inherit' : alpha('#1976d2', 0.03),
                  '&:hover': { bgcolor: alpha('#d4af8c', 0.08) },
                }}
                onClick={() => handleView(msg)}
              >
                <TableCell sx={{ fontWeight: msg.isRead ? 400 : 600 }}>{msg.fullName}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell sx={{ fontWeight: msg.isRead ? 400 : 600 }}>{msg.subject}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={msg.isRead ? 'Đã đọc' : 'Chưa đọc'}
                    color={msg.isRead ? 'success' : 'warning'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>{new Date(msg.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Xem">
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(msg);
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {!msg.isRead && (
                    <Tooltip title="Đánh dấu đã đọc">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(msg.id);
                        }}
                      >
                        <MarkEmailRead fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Xóa">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(msg.id);
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {filteredMessages.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
                  Không có tin nhắn nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => setPage(p)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Dòng/trang:"
        rowsPerPageOptions={[10, 20, 50]}
      />

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        {selectedMsg && (
          <>
            <DialogTitle sx={{ fontWeight: 600 }}>{selectedMsg.subject}</DialogTitle>
            <DialogContent dividers>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<EmailIcon />}
                  label={selectedMsg.email}
                  variant="outlined"
                  size="small"
                />
                {selectedMsg.phone && (
                  <Chip
                    icon={<Phone />}
                    label={selectedMsg.phone}
                    variant="outlined"
                    size="small"
                  />
                )}
                <Chip
                  icon={<CalendarToday />}
                  label={new Date(selectedMsg.createdAt).toLocaleString('vi-VN')}
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                Từ: {selectedMsg.fullName}
              </Typography>
              <Typography sx={{ mt: 2, lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {selectedMsg.message}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Đóng</Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={() => {
                  handleDelete(selectedMsg.id);
                  setDialogOpen(false);
                }}
              >
                Xóa
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ContactMessagesManager;
