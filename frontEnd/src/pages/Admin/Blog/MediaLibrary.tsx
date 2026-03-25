import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Button,
  Pagination,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  alpha,
} from '@mui/material';
import { Add, Delete, ContentCopy, Image as ImageIcon } from '@mui/icons-material';
import { adminBlogApi } from '@/api/blogApi';
import type { MediaFile } from '@/api/blogTypes';

const MediaLibrary: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const theme = useTheme();

  const fetchMedia = useCallback(async () => {
    try {
      const data = await adminBlogApi.getMedia({ page, limit: 20 });
      setFiles(data.items);
      setTotalPages(data.totalPages);
    } catch {
      console.error('Failed');
    }
  }, [page]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    setUploading(true);
    for (let i = 0; i < fileList.length; i++) {
      try {
        await adminBlogApi.uploadMedia(fileList[i]);
      } catch {
        console.error('Upload failed');
      }
    }
    setUploading(false);
    fetchMedia();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminBlogApi.deleteMedia(deleteId);
      setDeleteId(null);
      fetchMedia();
    } catch {
      console.error('Failed');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          🖼️ Thư viện Media
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          component="label"
          disabled={uploading}
          sx={{
            bgcolor: theme.palette.primary.dark,
            '&:hover': { bgcolor: theme.palette.secondary.dark },
          }}
        >
          {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
          <input type="file" hidden multiple accept="image/*,video/*" onChange={handleUpload} />
        </Button>
      </Box>
      <Grid container spacing={2}>
        {files.map((file) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={file.id}>
            <Card
              sx={{
                border: '1px solid',
                borderColor: alpha(theme.palette.divider, 0.08),
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              {file.mimeType.startsWith('image/') ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={file.url}
                  alt={file.originalName}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <Box
                  sx={{
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <ImageIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                </Box>
              )}
              <CardContent sx={{ p: 1.5, pb: '8px !important' }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.originalName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatSize(file.size)}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 1, pt: 0, justifyContent: 'flex-end' }}>
                <Tooltip title="Sao chép URL">
                  <IconButton size="small" onClick={() => copyUrl(file.url)}>
                    <ContentCopy sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xóa">
                  <IconButton size="small" color="error" onClick={() => setDeleteId(file.id)}>
                    <Delete sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {!files.length && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">Chưa có media nào.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
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
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle fontWeight={700}>Xóa file</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa file này?</Typography>
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

export default MediaLibrary;
