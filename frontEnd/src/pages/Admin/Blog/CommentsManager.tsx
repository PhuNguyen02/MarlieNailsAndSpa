import React, { useEffect, useState, useCallback } from 'react';
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
  Pagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
  alpha,
} from '@mui/material';
import { Check, Delete, Reply } from '@mui/icons-material';
import { adminBlogApi } from '@/api/blogApi';
import type { BlogComment } from '@/api/blogTypes';

const CommentsManager: React.FC = () => {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [replyDialog, setReplyDialog] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const theme = useTheme();

  const fetchComments = useCallback(async () => {
    try {
      const params: any = { page, limit: 15 };
      if (filter) params.isApproved = filter === 'approved';
      const data = await adminBlogApi.getComments(params);
      setComments(data.items);
      setTotalPages(data.totalPages);
    } catch {
      console.error('Failed to fetch comments');
    }
  }, [page, filter]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleApprove = async (id: string) => {
    try {
      await adminBlogApi.approveComment(id);
      fetchComments();
    } catch {
      console.error('Failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminBlogApi.deleteComment(deleteId);
      setDeleteId(null);
      fetchComments();
    } catch {
      console.error('Failed');
    }
  };

  const handleReply = async () => {
    if (!replyDialog || !replyContent) return;
    try {
      await adminBlogApi.replyComment(replyDialog, replyContent);
      setReplyDialog(null);
      setReplyContent('');
      fetchComments();
    } catch {
      console.error('Failed');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          💬 Quản lý bình luận
        </Typography>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={filter}
            label="Trạng thái"
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="pending">Chờ duyệt</MenuItem>
            <MenuItem value="approved">Đã duyệt</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.08),
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
              <TableCell sx={{ fontWeight: 700 }}>Tác giả</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Nội dung</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Bài viết</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {comments.map((c) => (
              <TableRow
                key={c.id}
                hover
                sx={{ bgcolor: !c.isApproved ? alpha('#F59E0B', 0.03) : 'transparent' }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>
                    {c.authorName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {c.authorEmail}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c.content}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {c.post?.title || '—'}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  <Chip
                    label={c.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                    size="small"
                    sx={{
                      bgcolor: alpha(c.isApproved ? '#22C55E' : '#F59E0B', 0.1),
                      color: c.isApproved ? '#22C55E' : '#F59E0B',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(c.createdAt).toLocaleDateString('vi-VN')}
                  </Typography>
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {!c.isApproved && (
                    <Tooltip title="Phê duyệt">
                      <IconButton size="small" color="success" onClick={() => handleApprove(c.id)}>
                        <Check fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Trả lời">
                    <IconButton size="small" color="primary" onClick={() => setReplyDialog(c.id)}>
                      <Reply fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton size="small" color="error" onClick={() => setDeleteId(c.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!comments.length && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">Chưa có bình luận.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
          />
        </Box>
      )}
      <Dialog open={!!replyDialog} onClose={() => setReplyDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Phản hồi bình luận</DialogTitle>
        <DialogContent>
          <TextField
            label="Nội dung"
            fullWidth
            multiline
            rows={4}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(null)}>Hủy</Button>
          <Button variant="contained" onClick={handleReply}>
            Gửi
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle fontWeight={700}>Xóa bình luận</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa?</Typography>
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

export default CommentsManager;
