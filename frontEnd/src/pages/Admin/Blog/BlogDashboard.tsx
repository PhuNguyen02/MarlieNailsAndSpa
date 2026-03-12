import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, useTheme, alpha, Skeleton } from '@mui/material';
import {
  Article,
  Visibility,
  ChatBubble,
  PendingActions,
  PublishedWithChanges,
  Drafts,
} from '@mui/icons-material';
import { adminBlogApi } from '@/api/blogApi';
import type { BlogStats, CommentStats } from '@/api/blogTypes';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, subtitle }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 24px ${alpha(color, 0.2)}`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            {subtitle && (
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(color, 0.1),
              color: color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const BlogDashboard: React.FC = () => {
  const [postStats, setPostStats] = useState<BlogStats | null>(null);
  const [commentStats, setCommentStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [posts, comments] = await Promise.all([
          adminBlogApi.getPostStats(),
          adminBlogApi.getCommentStats(),
        ]);
        setPostStats(posts);
        setCommentStats(comments);
      } catch {
        console.error('Failed to fetch stats');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 4 }}>
        📊 Blog Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng bài viết"
            value={postStats?.totalPosts || 0}
            icon={<Article />}
            color="#6366F1"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Đã xuất bản"
            value={postStats?.publishedPosts || 0}
            icon={<PublishedWithChanges />}
            color="#22C55E"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Bản nháp"
            value={postStats?.draftPosts || 0}
            icon={<Drafts />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng lượt xem"
            value={postStats?.totalViews || 0}
            icon={<Visibility />}
            color="#3B82F6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng bình luận"
            value={commentStats?.totalComments || 0}
            icon={<ChatBubble />}
            color="#8B5CF6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Bình luận chờ duyệt"
            value={commentStats?.pendingComments || 0}
            icon={<PendingActions />}
            color="#EF4444"
            subtitle={commentStats?.pendingComments ? 'Cần phê duyệt' : 'Tất cả đã duyệt'}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlogDashboard;
