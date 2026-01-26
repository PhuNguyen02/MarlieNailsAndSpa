import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material'
import { blogStyles } from '../styles'

const blogPosts = [
  {
    title: 'Healing Spa',
    date: '16th August 2020',
    author: 'Amy Burton',
    description: 'Lorem ipsum dolor sit amet, an bonorum partiendo sit. Ne alia graecis sit, duo natum errem ne, minim tollit nonumy eos at, quot',
    image: 'https://picsum.photos/800/500?random=11',
  },
  {
    title: 'Resort & Spa',
    date: '11th August 2020',
    author: 'Amy Burton',
    description: 'Lorem ipsum dolor sit amet, an bonorum partiendo sit. Ne alia graecis sit, duo natum errem ne, minim tollit nonumy eos at, quot',
    image: 'https://picsum.photos/800/500?random=12',
  },
  {
    title: 'Blue Lagoon',
    date: '11th August 2020',
    author: 'Amy Burton',
    description: 'Lorem ipsum dolor sit amet, an bonorum partiendo sit. Ne alia graecis sit, duo natum errem ne, minim tollit nonumy eos at, quot',
    image: 'https://picsum.photos/800/500?random=13',
  },
]

const BlogSection = () => {
  return (
    <Box sx={blogStyles.container}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom sx={blogStyles.title}>
          Latest Posts
        </Typography>
        <Typography variant="body1" align="center" sx={blogStyles.subtitle}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ulamcorper mattis eu nam adhuc.
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {blogPosts.map((post, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={blogStyles.card}>
                <Box sx={{ overflow: 'hidden', height: '250px' }}>
                  <Box
                    component="img"
                    src={post.image}
                    alt={post.title}
                    sx={blogStyles.image}
                  />
                </Box>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={blogStyles.date}>
                    {post.date} By {post.author}
                  </Typography>
                  <Typography variant="h6" gutterBottom sx={blogStyles.postTitle}>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={blogStyles.description}>
                    {post.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={blogStyles.readMore}
                    component="a"
                    href="#"
                  >
                    Read More
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default BlogSection

