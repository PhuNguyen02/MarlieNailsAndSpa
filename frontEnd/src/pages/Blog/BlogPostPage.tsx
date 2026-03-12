import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Paper,
  Skeleton,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Breadcrumbs,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  alpha,
} from '@mui/material';
import {
  AccessTime,
  Visibility,
  CalendarMonth,
  NavigateNext,
  Facebook,
  LinkedIn,
  Share,
  ChatBubbleOutline,
  Send,
  Reply,
} from '@mui/icons-material';
import { useParams, Link } from 'react-router-dom';
import { publicBlogApi } from '@/api/blogApi';
import type {
  BlogPost,
  BlogComment as BlogCommentType,
  CreateCommentRequest,
} from '@/api/blogTypes';

// ==========================================
// Table of Contents Component
// ==========================================
interface TOCItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [activeId, setActiveId] = useState('');
  const theme = useTheme();

  const items = useMemo(() => {
    const result: TOCItem[] = [];

    // Parse headings without IDs by generating them
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const headings = tempDiv.querySelectorAll('h2, h3');
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      result.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
      });
    });

    return result;
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -75% 0%' },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        position: 'sticky',
        top: 100,
        border: '1px solid',
        borderColor: alpha(theme.palette.divider, 0.08),
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
        📑 Mục lục
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            component="a"
            href={`#${item.id}`}
            sx={{
              textDecoration: 'none',
              color: activeId === item.id ? theme.palette.primary.main : 'text.secondary',
              fontSize: '0.8rem',
              lineHeight: 1.6,
              pl: item.level === 3 ? 2 : 0,
              py: 0.5,
              px: 1.5,
              borderRadius: 1,
              borderLeft: '2px solid',
              borderColor: activeId === item.id ? theme.palette.primary.main : 'transparent',
              fontWeight: activeId === item.id ? 600 : 400,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: theme.palette.primary.main,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
              },
            }}
          >
            {item.text}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// ==========================================
// Social Share Buttons
// ==========================================
const SocialShare: React.FC<{ title: string; url: string }> = ({ title, url }) => {
  const shareLinks = [
    {
      name: 'Facebook',
      icon: <Facebook />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: '#1877F2',
    },
    {
      name: 'LinkedIn',
      icon: <LinkedIn />,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      color: '#0A66C2',
    },
    {
      name: 'X (Twitter)',
      icon: <Share />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: '#000',
    },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
        Chia sẻ:
      </Typography>
      {shareLinks.map((link) => (
        <Tooltip key={link.name} title={link.name}>
          <IconButton
            component="a"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              bgcolor: alpha(link.color, 0.08),
              color: link.color,
              '&:hover': {
                bgcolor: alpha(link.color, 0.18),
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {link.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
};

// ==========================================
// Comment Component
// ==========================================
const CommentItem: React.FC<{
  comment: BlogCommentType;
  onReply: (parentId: string) => void;
  depth?: number;
}> = ({ comment, onReply, depth = 0 }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const avatarColor = colors[comment.authorName.length % colors.length];

  return (
    <Box sx={{ ml: depth > 0 ? 5 : 0, mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: avatarColor,
            fontSize: '0.8rem',
            fontWeight: 700,
          }}
        >
          {getInitials(comment.authorName)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {comment.authorName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary', mb: 1 }}>
            {comment.content}
          </Typography>
          {depth < 2 && (
            <Button
              size="small"
              startIcon={<Reply sx={{ fontSize: 14 }} />}
              onClick={() => onReply(comment.id)}
              sx={{ textTransform: 'none', fontSize: '0.75rem', color: 'text.secondary' }}
            >
              Trả lời
            </Button>
          )}
        </Box>
      </Box>

      {/* Replies */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} onReply={onReply} depth={depth + 1} />
      ))}
    </Box>
  );
};

// ==========================================
// Blog Post Detail Page
// ==========================================
const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogCommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState<CreateCommentRequest>({
    authorName: '',
    authorEmail: '',
    content: '',
  });
  const [replyTo, setReplyTo] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const [postData, relatedData, commentsData] = await Promise.all([
          publicBlogApi.getPost(slug),
          publicBlogApi.getRelatedPosts(slug, 4),
          publicBlogApi.getComments(slug),
        ]);
        setPost(postData);
        setRelated(relatedData);
        setComments(commentsData);
      } catch {
        console.error('Failed to fetch post');
      }
      setLoading(false);
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  // Process content to add IDs to headings
  const processedContent = useMemo(() => {
    if (!post?.content) return '';
    let index = 0;
    return post.content.replace(/<h([23])([^>]*)>/gi, (match, level, attrs) => {
      if (attrs.includes('id=')) return match;
      return `<h${level}${attrs} id="heading-${index++}">`;
    });
  }, [post?.content]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug || !commentForm.authorName || !commentForm.authorEmail || !commentForm.content)
      return;

    setSubmitting(true);
    try {
      await publicBlogApi.addComment(slug, {
        ...commentForm,
        parentId: replyTo,
      });
      setCommentForm({ authorName: '', authorEmail: '', content: '' });
      setReplyTo(undefined);
      setCommentSuccess(true);
      setTimeout(() => setCommentSuccess(false), 5000);
    } catch {
      console.error('Failed to submit comment');
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3, mb: 3 }} />
        <Skeleton variant="text" width="60%" height={60} />
        <Skeleton variant="text" width="100%" height={30} />
        <Skeleton variant="text" width="100%" height={30} />
        <Skeleton variant="text" width="80%" height={30} />
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Bài viết không tồn tại
        </Typography>
      </Container>
    );
  }

  const currentUrl = window.location.href;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Hero Image */}
      {post.thumbnailUrl && (
        <Box
          sx={{
            position: 'relative',
            height: isMobile ? 300 : 450,
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={post.thumbnailUrl}
            alt={post.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
            }}
          />
        </Box>
      )}

      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Breadcrumbs */}
            <Breadcrumbs separator={<NavigateNext sx={{ fontSize: 16 }} />} sx={{ mb: 3 }}>
              <Link
                to="/blog"
                style={{
                  color: theme.palette.text.secondary,
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                }}
              >
                Blog
              </Link>
              {post.categories?.[0] && (
                <Link
                  to={`/blog/category/${post.categories[0].slug}`}
                  style={{
                    color: theme.palette.text.secondary,
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                  }}
                >
                  {post.categories[0].name}
                </Link>
              )}
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {post.title.length > 50 ? post.title.slice(0, 50) + '...' : post.title}
              </Typography>
            </Breadcrumbs>

            {/* Post Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {post.categories?.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    component={Link}
                    to={`/blog/category/${cat.slug}`}
                    clickable
                    size="small"
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      color: theme.palette.primary.dark,
                      fontWeight: 600,
                      fontSize: '0.7rem',
                    }}
                  />
                ))}
              </Box>

              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  mb: 2,
                  fontSize: isMobile ? '1.75rem' : '2.5rem',
                }}
              >
                {post.title}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  flexWrap: 'wrap',
                  mb: 3,
                }}
              >
                {post.author && (
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    ✍️ {post.author.fullName}
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarMonth sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Draft'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {post.readingTime} phút đọc
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {post.viewCount} lượt xem
                  </Typography>
                </Box>
              </Box>

              <SocialShare title={post.title} url={currentUrl} />
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Post Content */}
            <Box
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: processedContent }}
              sx={{
                '& h2': {
                  fontSize: '1.75rem',
                  fontWeight: 700,
                  mt: 5,
                  mb: 2,
                  lineHeight: 1.3,
                  scrollMarginTop: '100px',
                },
                '& h3': {
                  fontSize: '1.35rem',
                  fontWeight: 600,
                  mt: 4,
                  mb: 1.5,
                  lineHeight: 1.4,
                  scrollMarginTop: '100px',
                },
                '& p': {
                  fontSize: '1.05rem',
                  lineHeight: 1.85,
                  mb: 2.5,
                  color: 'text.primary',
                },
                '& img': {
                  maxWidth: '100%',
                  height: 'auto',
                  borderRadius: 2,
                  my: 3,
                },
                '& a': {
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { textDecoration: 'underline' },
                },
                '& blockquote': {
                  borderLeft: `4px solid ${theme.palette.primary.main}`,
                  pl: 3,
                  py: 1,
                  my: 3,
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                  borderRadius: '0 8px 8px 0',
                  fontStyle: 'italic',
                  color: 'text.secondary',
                },
                '& code': {
                  bgcolor: alpha(theme.palette.text.primary, 0.06),
                  px: 1,
                  py: 0.3,
                  borderRadius: 1,
                  fontSize: '0.9em',
                  fontFamily: "'Fira Code', monospace",
                },
                '& pre': {
                  bgcolor: '#1e1e1e',
                  color: '#d4d4d4',
                  p: 3,
                  borderRadius: 2,
                  overflow: 'auto',
                  my: 3,
                  '& code': {
                    bgcolor: 'transparent',
                    p: 0,
                    color: 'inherit',
                  },
                },
                '& ul, & ol': {
                  pl: 4,
                  mb: 2.5,
                  '& li': { mb: 1, lineHeight: 1.7 },
                },
                '& table': {
                  width: '100%',
                  borderCollapse: 'collapse',
                  my: 3,
                  '& th, & td': {
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    p: 1.5,
                    textAlign: 'left',
                  },
                  '& th': {
                    bgcolor: alpha(theme.palette.primary.main, 0.06),
                    fontWeight: 600,
                  },
                },
              }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {post.tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={`#${tag.name}`}
                      component={Link}
                      to={`/blog/tag/${tag.slug}`}
                      clickable
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Divider sx={{ my: 4 }} />

            {/* Social Share (bottom) */}
            <SocialShare title={post.title} url={currentUrl} />

            <Divider sx={{ my: 4 }} />

            {/* Comments Section */}
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <ChatBubbleOutline /> Bình luận ({comments.length})
              </Typography>

              {/* Comments List */}
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onReply={(parentId) => {
                    setReplyTo(parentId);
                    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              ))}

              {comments.length === 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                </Typography>
              )}

              {/* Comment Form */}
              <Paper
                id="comment-form"
                component="form"
                onSubmit={handleSubmitComment}
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.1),
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {replyTo ? '💬 Trả lời bình luận' : '💬 Để lại bình luận'}
                </Typography>

                {replyTo && (
                  <Chip
                    label="Đang trả lời bình luận"
                    onDelete={() => setReplyTo(undefined)}
                    size="small"
                    sx={{ mb: 2 }}
                  />
                )}

                {commentSuccess && (
                  <Box
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 2,
                      bgcolor: alpha('#4CAF50', 0.1),
                      color: '#2E7D32',
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      ✅ Bình luận đã được gửi! Đang chờ phê duyệt.
                    </Typography>
                  </Box>
                )}

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Họ tên"
                      fullWidth
                      size="small"
                      required
                      value={commentForm.authorName}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, authorName: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      size="small"
                      required
                      value={commentForm.authorEmail}
                      onChange={(e) =>
                        setCommentForm({ ...commentForm, authorEmail: e.target.value })
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Nội dung bình luận"
                      fullWidth
                      multiline
                      rows={4}
                      required
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<Send />}
                      disabled={submitting}
                      sx={{
                        bgcolor: theme.palette.primary.dark,
                        '&:hover': { bgcolor: theme.palette.secondary.dark },
                      }}
                    >
                      {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Table of Contents */}
            <TableOfContents content={processedContent} />

            {/* Related Posts */}
            {related.length > 0 && (
              <Paper
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: 3,
                  border: '1px solid',
                  borderColor: alpha(theme.palette.divider, 0.08),
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
                  📚 Bài viết liên quan
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {related.map((relPost) => (
                    <Card
                      key={relPost.id}
                      sx={{
                        display: 'flex',
                        border: '1px solid',
                        borderColor: alpha(theme.palette.divider, 0.08),
                        boxShadow: 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                        },
                      }}
                    >
                      <CardActionArea
                        component={Link}
                        to={`/blog/${relPost.slug}`}
                        sx={{ display: 'flex', alignItems: 'stretch' }}
                      >
                        <CardMedia
                          component="img"
                          sx={{ width: 80, height: 80, objectFit: 'cover' }}
                          image={relPost.thumbnailUrl || '/placeholder-blog.jpg'}
                          alt={relPost.title}
                        />
                        <CardContent sx={{ flex: 1, p: '12px !important' }}>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              lineHeight: 1.3,
                              fontSize: '0.8rem',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {relPost.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {relPost.readingTime} min read
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BlogPostPage;
