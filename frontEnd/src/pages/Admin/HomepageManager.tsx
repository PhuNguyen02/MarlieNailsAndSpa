import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import { Edit, DragIndicator, Visibility, VisibilityOff, Save } from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { adminHomepageApi, HomepageSection } from '../../api/homepageApi';

// Type bypass for ReactQuill in React 18
const QuillEditor = ReactQuill as any;

interface SortableSectionProps {
  section: HomepageSection;
  onEdit: (section: HomepageSection) => void;
  onToggle: (section: HomepageSection) => void;
}

const SortableSection = ({ section, onEdit, onToggle }: SortableSectionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.5 : 1,
    marginBottom: '16px',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        variant="outlined"
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderColor: section.isActive ? 'primary.main' : 'divider',
          bgcolor: isDragging ? alpha('#d4af8c', 0.1) : 'background.paper',
        }}
      >
        <Box {...attributes} {...listeners} sx={{ cursor: 'grab', display: 'flex', px: 1 }}>
          <DragIndicator color="action" />
        </Box>

        <CardContent sx={{ flexGrow: 1, py: '8px !important' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {section.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                bgcolor: 'action.selected',
                px: 1,
                borderRadius: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              {section.type}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 400 }}>
            {section.subtitle || 'Không có mô tả phụ'}
          </Typography>
        </CardContent>

        <Box sx={{ display: 'flex', gap: 1, pr: 1 }}>
          <IconButton size="small" onClick={() => onToggle(section)}>
            {section.isActive ? <Visibility color="primary" /> : <VisibilityOff color="disabled" />}
          </IconButton>
          <IconButton size="small" color="primary" onClick={() => onEdit(section)}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      </Card>
    </div>
  );
};

const HomepageManager = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSection, setCurrentSection] = useState<Partial<HomepageSection>>({});
  const [configText, setConfigText] = useState('');
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminHomepageApi.getAll();
      setSections(res);
    } catch (err) {
      console.error('Failed to fetch sections:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id);
      const newIndex = sections.findIndex((s) => s.id === over?.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);

      try {
        await adminHomepageApi.reorder(newSections.map((s) => s.id));
      } catch (err) {
        console.error('Failed to save order:', err);
        fetchData(); // Reset on error
      }
    }
  };

  const handleEdit = (section: HomepageSection) => {
    setCurrentSection({ ...section });
    setConfigText(JSON.stringify(section.config || {}, null, 2));
    setIsEditing(true);
  };

  const handleToggle = async (section: HomepageSection) => {
    try {
      await adminHomepageApi.update(section.id, { isActive: !section.isActive });
      fetchData();
    } catch {
      /* ignore */
    }
  };

  const handleSave = async () => {
    if (!currentSection.id) return;

    // Parse the final config text before saving
    let finalConfig = currentSection.config;
    try {
      finalConfig = JSON.parse(configText);
    } catch (err) {
      alert('Dữ liệu JSON không hợp lệ. Vui lòng kiểm tra lại.');
      return;
    }

    try {
      await adminHomepageApi.update(currentSection.id, {
        ...currentSection,
        config: finalConfig,
      });
      setIsEditing(false);
      fetchData();
    } catch {
      /* ignore */
    }
  };

  const editorModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'video'],
      ['clean'],
    ],
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Thiết Kế Trang Chủ
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Kéo thả để sắp xếp vị trí hiển thị các vùng nội dung.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Save />}
          sx={{ background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)' }}
          onClick={() => fetchData()}
        >
          Làm mới
        </Button>
      </Box>

      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            {sections.map((section) => (
              <SortableSection
                key={section.id}
                section={section}
                onEdit={handleEdit}
                onToggle={handleToggle}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {/* Editor Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Chỉnh Sửa Nội Dung Section</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Tiêu đề chính"
                value={currentSection.title || ''}
                onChange={(e) => setCurrentSection((prev) => ({ ...prev, title: e.target.value }))}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Tiêu đề phụ / Mô tả ngắn"
                value={currentSection.subtitle || ''}
                onChange={(e) =>
                  setCurrentSection((prev) => ({ ...prev, subtitle: e.target.value }))
                }
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Nội dung chi tiết (Rich Text)
              </Typography>
              <Box sx={{ '.ql-editor': { minHeight: 200 } }}>
                <QuillEditor
                  theme="snow"
                  value={currentSection.content || ''}
                  onChange={(val: string) =>
                    setCurrentSection((prev) => ({ ...prev, content: val }))
                  }
                  modules={editorModules}
                />
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: alpha('#f5f5f5', 0.5) }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
                  Cấu hình & Hình ảnh
                </Typography>

                <TextField
                  fullWidth
                  label="URL Hình ảnh"
                  size="small"
                  value={currentSection.imageUrl || ''}
                  onChange={(e) =>
                    setCurrentSection((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  sx={{ mb: 2 }}
                />

                {currentSection.imageUrl && (
                  <Box
                    component="img"
                    src={currentSection.imageUrl}
                    sx={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 2, mb: 2 }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Cấu hình nâng cao (JSON)"
                  multiline
                  rows={8}
                  size="small"
                  value={configText}
                  onChange={(e) => setConfigText(e.target.value)}
                  sx={{
                    mb: 2,
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      whiteSpace: 'pre',
                    },
                  }}
                  helperText="Dùng để cấu hình thẻ (cards), giờ mở cửa, v.v."
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={currentSection.isActive || false}
                      onChange={(e) =>
                        setCurrentSection((prev) => ({ ...prev, isActive: e.target.checked }))
                      }
                    />
                  }
                  label="Hiển thị mục này"
                />

                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 2, color: 'text.secondary' }}
                >
                  Loại section: <strong>{currentSection.type}</strong>
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsEditing(false)}>Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ background: 'linear-gradient(135deg, #d4af8c 0%, #b8956f 100%)', px: 4 }}
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomepageManager;
