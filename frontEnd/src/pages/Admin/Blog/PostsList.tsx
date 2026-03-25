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
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import { Add, Edit, Delete, Search, Visibility, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { adminBlogApi } from '@/api/blogApi';
import type { BlogPost, PostStatus } from '@/api/blogTypes';

const statusColors: Record<PostStatus, { color: string; label: string }> = {
  draft: { color: '#F59E0B', label: 'Bản nháp' },
  published: { color: '#22C55E', label: 'Đã xuất bản' },
  scheduled: { color: '#3B82F6', label: 'Lên lịch' },
};

const PostsList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PostStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminBlogApi.getPosts({
        page,
        limit: 10,
        status: statusFilter || undefined,
        search: search || undefined,
      });
      setPosts(data.items);
      setTotalPages(data.totalPages);
    } catch {
      console.error('Failed to fetch posts');
    }
    setLoading(false);
  }, [page, statusFilter, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteDialog) return;
    try {
      await adminBlogApi.deletePost(deleteDialog);
      setDeleteDialog(null);
      fetchPosts();
    } catch {
      console.error('Failed to delete post');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          📝 Quản lý bài viết
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/admin/blog/posts/new')}
          sx={{
            bgcolor: theme.palette.primary.dark,
            '&:hover': { bgcolor: theme.palette.secondary.dark },
          }}
        >
          Tạo bài viết
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Tìm kiếm bài viết..."
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => {
              setStatusFilter(e.target.value as PostStatus | '');
              setPage(1);
            }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="draft">Bản nháp</MenuItem>
            <MenuItem value="published">Đã xuất bản</MenuItem>
            <MenuItem value="scheduled">Lên lịch</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
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
              <TableCell sx={{ fontWeight: 700 }}>Tiêu đề</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Chuyên mục</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Lượt xem</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => {
              const status = statusColors[post.status];
              return (
                <TableRow
                  key={post.id}
                  hover
                  sx={{ '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.02) } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {post.isFeatured && <Star sx={{ fontSize: 18, color: '#F59E0B' }} />}
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {post.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          /{post.slug}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        bgcolor: alpha(status.color, 0.1),
                        color: status.color,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {post.categories?.map((cat) => (
                        <Chip
                          key={cat.id}
                          label={cat.name}
                          size="small"
                          sx={{ fontSize: '0.65rem', height: 22 }}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Visibility sx={{ fontSize: 14, color: 'text.secondary' }} />
                      {post.viewCount}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <Tooltip title="Sửa">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/admin/blog/posts/${post.id}/edit`)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog(post.id)}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}

            {posts.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="body2" color="text.secondary">
                    Chưa có bài viết nào.
                  </Typography>
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

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Xóa bài viết</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Hủy</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsList;
