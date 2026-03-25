import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Chip,
  useTheme,
  alpha,
} from '@mui/material';
import { AccessTime, Visibility, CalendarMonth, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import type { BlogPost } from '@/api/blogTypes';

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.05),
        bgcolor: 'background.paper',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-12px)',
          boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.12)}`,
          '& .card-image': { transform: 'scale(1.1)' },
          '& .read-more-btn': { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={`/blog/${post.slug}`}
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden', height: 240 }}>
          <CardMedia
            className="card-image"
            component="img"
            image={post.thumbnailUrl || '/images/blog-placeholder-2.png'}
            alt={post.title}
            sx={{ 
              height: '100%',
              transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)', 
              objectFit: 'cover' 
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' 
            }} 
          />
          {post.isFeatured && (
            <Chip
              label="BẢN TIN HOT"
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: theme.palette.secondary.main,
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.6rem',
                letterSpacing: 1,
                borderRadius: 1,
              }}
            />
          )}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              left: 16,
              display: 'flex',
              gap: 1,
            }}
          >
            {post.categories?.slice(0, 1).map((cat) => (
              <Chip
                key={cat.id}
                label={cat.name}
                size="small"
                sx={{
                  bgcolor: alpha('#fff', 0.9),
                  color: theme.palette.primary.dark,
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 24,
                  backdropFilter: 'blur(4px)',
                }}
              />
            ))}
          </Box>
        </Box>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              <CalendarMonth sx={{ fontSize: 14 }} />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('vi-VN') : 'Mới'}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
              <AccessTime sx={{ fontSize: 14 }} />
              {post.readingTime} min
            </Typography>
          </Box>
          
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontSize: '1.25rem',
              lineHeight: 1.3,
              mb: 2,
              color: 'text.primary',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              '&:hover': { color: theme.palette.primary.main }
            }}
          >
            {post.title}
          </Typography>
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              flex: 1,
              lineHeight: 1.7,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 3,
              fontSize: '0.9rem'
            }}
          >
            {post.excerpt}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 'auto',
            }}
          >
            <Box 
              className="read-more-btn"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5, 
                color: theme.palette.primary.dark,
                fontWeight: 700,
                fontSize: '0.85rem',
                opacity: 0.7,
                transform: 'translateX(-4px)',
                transition: 'all 0.3s ease'
              }}
            >
              Đọc tiếp <ArrowForward sx={{ fontSize: 16 }} />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary', opacity: 0.7 }}>
              <Visibility sx={{ fontSize: 14 }} />
              <Typography variant="caption" fontWeight={600}>
                {post.viewCount}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default BlogPostCard;
